import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { masterclassByIdQuery } from "@/sanity/groq";
import {
  getPriceTier,
  getRegistrationState,
  generateRegistrationId,
} from "@/lib/masterclass";
import type {
  Masterclass,
  RegisterRequestBody,
} from "@/types/masterclass";

type ExistingRegistration = {
  _id: string;
  registrationId: string;
};

function isValidBody(body: any): body is RegisterRequestBody {
  return (
    body &&
    typeof body.masterclassId === "string" &&
    typeof body.paystackReference === "string" &&
    body.registrantInfo &&
    typeof body.registrantInfo.fullName === "string" &&
    typeof body.registrantInfo.phone === "string" &&
    typeof body.registrantInfo.email === "string" &&
    typeof body.registrantInfo.location === "string" &&
    body.preferences &&
    typeof body.preferences.topicToLearn === "string" &&
    typeof body.preferences.audienceType === "string" &&
    typeof body.preferences.referralSource === "string"
  );
}

function getRegistrationDocumentId(paystackReference: string): string {
  const hash = createHash("sha256").update(paystackReference).digest("hex");
  return `masterclass-registration-${hash}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    // 1. Verify Paystack transaction
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${body.paystackReference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || paystackData?.data?.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          message:
            paystackData?.message || "Payment not successful or could not be verified",
        },
        { status: 400 },
      );
    }

    if (paystackData.data.currency !== "GHS") {
      console.warn("Masterclass payment in unexpected currency", {
        reference: body.paystackReference,
        currency: paystackData.data.currency,
      });
      return NextResponse.json(
        {
          success: false,
          message: "Payment currency is not supported",
        },
        { status: 400 },
      );
    }

    const paidAtIso =
      paystackData.data.paid_at || paystackData.data.paidAt || new Date().toISOString();
    const paidAt = new Date(paidAtIso);
    const paidAmountGhs = paystackData.data.amount / 100;

    // 2. Idempotency: if a registration already exists for this Paystack reference, return it.
    const existing = await client.fetch<ExistingRegistration | null>(
      `*[_type == "masterclassRegistration" && payment.paystackReference == $ref][0]{ _id, registrationId }`,
      { ref: body.paystackReference },
    );
    if (existing) {
      return NextResponse.json({
        success: true,
        registrationId: existing.registrationId,
        _id: existing._id,
      });
    }

    // 3. Fetch the masterclass and confirm it's active and accepting registrations
    const masterclass: Masterclass | null = await client.fetch(
      masterclassByIdQuery,
      { id: body.masterclassId },
    );

    if (!masterclass) {
      return NextResponse.json(
        { success: false, message: "Masterclass not found" },
        { status: 404 },
      );
    }
    if (!masterclass.isActive) {
      return NextResponse.json(
        { success: false, message: "Masterclass is no longer active" },
        { status: 404 },
      );
    }

    const registrationState = getRegistrationState(masterclass, paidAt);
    if (registrationState !== "open") {
      return NextResponse.json(
        {
          success: false,
          message:
            registrationState === "ended"
              ? "This event has already taken place"
              : "Registration for this masterclass is closed",
        },
        { status: 400 },
      );
    }

    // 4. Recompute price using paidAt as the reference time
    const { tier: expectedTier, price: expectedPrice } = getPriceTier(
      masterclass,
      paidAt,
    );

    if (Math.abs(paidAmountGhs - expectedPrice) > 0.01) {
      console.warn("Masterclass price mismatch", {
        reference: body.paystackReference,
        paidAmountGhs,
        expectedPrice,
      });
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment amount does not match the expected price. Please contact support.",
        },
        { status: 400 },
      );
    }

    // 5. Create the registration document
    const registrationDocumentId = getRegistrationDocumentId(body.paystackReference);
    const registrationId = generateRegistrationId();

    const registration = await client.createIfNotExists({
      _id: registrationDocumentId,
      _type: "masterclassRegistration",
      registrationId,
      masterclass: { _ref: masterclass._id, _type: "reference" },
      registrantInfo: body.registrantInfo,
      preferences: body.preferences,
      payment: {
        status: "paid",
        paystackReference: body.paystackReference,
        amount: paidAmountGhs,
        priceTier: expectedTier,
        paidAt: paidAtIso,
      },
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      registrationId: registration.registrationId,
      _id: registration._id,
    });
  } catch (error) {
    console.error("Masterclass registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create registration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

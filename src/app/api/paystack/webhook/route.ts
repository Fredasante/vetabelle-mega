import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { masterclassByIdQuery } from "@/sanity/groq";
import { getPriceTier } from "@/lib/masterclass";
import { buildRegistrationDoc } from "@/lib/masterclassRegistration";
import { isPaidAmountSufficient } from "@/lib/pricing";
import type { Masterclass } from "@/types/masterclass";

type ExistingRegistration = { _id: string };
type CustomField = { variable_name?: string; value?: string };

// Server-side source of truth for Paystack payments. Mobile money completes
// out-of-band on the customer's phone, so the browser's onSuccess callback may
// never fire — this webhook records the registration regardless. It only
// handles masterclass registrations; order/other events are acknowledged and
// ignored. Idempotent with the browser register route via the shared doc id.
export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("Paystack webhook: PAYSTACK_SECRET_KEY is not configured");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Raw body is required for signature verification — read it before parsing.
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    console.warn("Paystack webhook: invalid signature");
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Only successful charges create records; acknowledge everything else.
  if (event?.event !== "charge.success") {
    return NextResponse.json({ ok: true, ignored: event?.event ?? "unknown" });
  }

  const data = event.data ?? {};
  const reference: string = typeof data.reference === "string" ? data.reference : "";
  const customFields: CustomField[] = data?.metadata?.custom_fields ?? [];
  const meta = (name: string) =>
    customFields.find((f) => f?.variable_name === name)?.value ?? "";

  // This handler is masterclass-only. Orders are recorded by their own flow.
  const isMasterclass =
    meta("registration_type") === "masterclass" || reference.startsWith("MC-");
  if (!isMasterclass) {
    return NextResponse.json({ ok: true, ignored: "non-masterclass" });
  }

  try {
    // Idempotency: the browser path (or an earlier webhook delivery) may have
    // already recorded this exact payment.
    const existing = await client.fetch<ExistingRegistration | null>(
      `*[_type == "masterclassRegistration" && payment.paystackReference == $ref][0]{ _id }`,
      { ref: reference },
    );
    if (existing) {
      return NextResponse.json({ ok: true, alreadyRecorded: true });
    }

    if (data.currency && data.currency !== "GHS") {
      console.warn("Paystack webhook: non-GHS masterclass charge", {
        reference,
        currency: data.currency,
      });
      return NextResponse.json({ ok: true, ignored: "currency" });
    }

    const masterclassId = meta("masterclass_id");
    const masterclass: Masterclass | null = masterclassId
      ? await client.fetch(masterclassByIdQuery, { id: masterclassId })
      : null;
    if (!masterclass) {
      // Acknowledge so Paystack stops retrying; flag for manual recovery.
      console.error("Paystack webhook: masterclass not found for paid charge", {
        reference,
        masterclassId,
      });
      return NextResponse.json({ ok: true, unresolved: "masterclass-not-found" });
    }

    const paidAmountGhs = Number(data.amount) / 100;
    const paidAtIso = data.paid_at || data.paidAt || new Date().toISOString();

    // Record regardless of amount (the money is collected), but flag a genuine
    // underpayment so it can be reconciled.
    const { price: expectedPrice } = getPriceTier(masterclass, new Date(paidAtIso));
    if (!isPaidAmountSufficient(paidAmountGhs, expectedPrice)) {
      console.warn("Paystack webhook: masterclass underpayment recorded", {
        reference,
        paidAmountGhs,
        expectedPrice,
      });
    }

    const doc = buildRegistrationDoc({
      masterclass,
      paystackReference: reference,
      paidAmountGhs,
      paidAtIso,
      registrantInfo: {
        fullName: meta("customer_name"),
        phone: meta("phone"),
        email: data?.customer?.email || meta("email"),
        location: meta("location"),
      },
      preferences: {
        topicToLearn: meta("topic_to_learn"),
        audienceType: meta("audience_type"),
        referralSource: meta("referral_source"),
      },
    });

    const created = await client.createIfNotExists(doc);
    console.log("Paystack webhook: recorded masterclass registration", {
      reference,
      _id: created._id,
    });
    return NextResponse.json({ ok: true, recorded: true });
  } catch (error) {
    // Return 500 so Paystack retries delivery.
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

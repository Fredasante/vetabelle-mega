import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "Payment reference is required" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await paystackResponse.json();

    if (!paystackResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Payment verification failed",
        },
        { status: 400 }
      );
    }

    // Check if payment was successful
    if (data.data.status === "success") {
      return NextResponse.json({
        success: true,
        data: {
          reference: data.data.reference,
          amount: data.data.amount / 100, // From pesewas to GHS
          status: data.data.status,
          paidAt: data.data.paid_at,
          channel: data.data.channel,
          metadata: data.data.metadata,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Payment not successful",
        status: data.data.status,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during payment verification",
      },
      { status: 500 }
    );
  }
}

// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
});

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Basic validation
    if (
      !orderData.orderId ||
      !orderData.customerInfo ||
      !orderData.items ||
      orderData.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required order data",
        },
        { status: 400 }
      );
    }

    // Remove null fields to avoid Sanity "invalid property value" errors
    const cleanedData = Object.fromEntries(
      Object.entries(orderData).filter(([, v]) => v !== null)
    );

    // Create order in Sanity
    const order = await client.create({
      _type: "order",
      ...cleanedData,
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      _id: order._id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

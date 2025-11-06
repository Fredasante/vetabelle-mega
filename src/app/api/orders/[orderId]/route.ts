import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch order from Sanity
    const order = await client.fetch(
      `*[_type == "order" && orderId == $orderId][0]{
        orderId,
        customerInfo,
        deliveryInfo,
        items,
        pricing,
        payment,
        deliveryStatus,
        confirmation,
        customerNotes,
        adminNotes,
        createdAt,
        updatedAt,
        deliveredAt
      }`,
      { orderId }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

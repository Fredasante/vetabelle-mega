// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    const refParam = new URL(request.url).searchParams.get("ref");
    const { userId } = await auth();

    const order = await client.fetch(
      `*[_type == "order" && orderId == $orderId][0]{
        orderId,
        fulfillmentMethod,
        customerInfo,
        deliveryInfo,
        items[]{
          _key,
          product->{
            _id,
            title,
            slug,
            image
          },
          productSnapshot,
          quantity,
          priceAtPurchase
        },
        pricing,
        payment,
        deliveryStatus,
        createdAt,
        updatedAt
      }`,
      { orderId },
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorize: caller must either be the Clerk owner of the order, or
    // present the matching paystack reference (capability URL — granted to
    // legitimate customers via the order-success redirect).
    const isOwner =
      userId && order.customerInfo?.userId === userId ? true : false;
    const refMatches =
      refParam && order.payment?.paystackReference === refParam ? true : false;

    if (!isOwner && !refMatches) {
      // Return 404 rather than 403 to avoid confirming the order exists
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 },
    );
  }
}

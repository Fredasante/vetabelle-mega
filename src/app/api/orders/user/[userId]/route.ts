import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Get authenticated user
    const { userId: authUserId } = await auth();

    if (!authUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params
    const { userId } = await params;

    // Security: ensure user can only access their own orders
    if (authUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user's email and phone to match guest orders they may have placed
    const user = await currentUser();
    const userEmails =
      user?.emailAddresses.map((email) => email.emailAddress) || [];
    const userPhone = user?.phoneNumbers?.[0]?.phoneNumber || null;

    // Fetch orders that match:
    // 1. Orders placed while signed in (has userId)
    // 2. Guest orders with matching email (so past guest orders show up after sign-in)
    // 3. Guest orders with matching phone
    const orders = await client.fetch(
      `*[_type == "order" && (
        customerInfo.userId == $userId ||
        customerInfo.email in $userEmails ||
        customerInfo.phone == $userPhone
      )] | order(createdAt desc) {
        orderId,
        customerInfo,
        deliveryInfo,
        items[] {
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
      { userId, userEmails, userPhone }
    );

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    console.error("Error fetching user orders:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

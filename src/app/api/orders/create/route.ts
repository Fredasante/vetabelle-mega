import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { calculateItemPrice } from "@/lib/pricing";
import { computeOrderHash } from "@/lib/orderHash";

type ExistingOrder = { _id: string; orderId: string };
type ProductRow = {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  image?: string;
};
type IncomingItem = {
  _key?: unknown;
  product?: { _ref?: unknown };
  quantity?: unknown;
};

function getOrderDocumentId(paystackReference: string): string {
  const hash = createHash("sha256").update(paystackReference).digest("hex");
  return `order-${hash}`;
}

function bad(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    if (
      !orderData?.orderId ||
      typeof orderData.orderId !== "string" ||
      !orderData?.customerInfo ||
      !Array.isArray(orderData?.items) ||
      orderData.items.length === 0 ||
      !orderData?.payment?.paystackReference ||
      typeof orderData.payment.paystackReference !== "string"
    ) {
      return bad("Missing required order data");
    }

    const paystackReference: string = orderData.payment.paystackReference;

    // Verify the Paystack transaction server-side
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${paystackReference}`,
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
      return bad(
        paystackData?.message ||
          "Payment not successful or could not be verified",
      );
    }

    if (paystackData.data.currency !== "GHS") {
      console.warn("Order payment in unexpected currency", {
        reference: paystackReference,
        currency: paystackData.data.currency,
      });
      return bad("Payment currency is not supported");
    }

    const paidAtIso =
      paystackData.data.paid_at ||
      paystackData.data.paidAt ||
      new Date().toISOString();
    const paidAmountGhs = paystackData.data.amount / 100;

    if (!Number.isFinite(paidAmountGhs) || paidAmountGhs <= 0) {
      return bad("Invalid paid amount from Paystack");
    }

    // Bind the verified payment to this specific order/customer using the
    // metadata fields that paystack.ts captures at payment-init time. Without
    // this, anyone holding a valid reference could submit a different
    // customer/cart and have it accepted.
    const customFields: Array<{
      variable_name?: string;
      value?: string;
    }> = paystackData?.data?.metadata?.custom_fields ?? [];
    const metadataFor = (name: string) =>
      customFields.find((f) => f?.variable_name === name)?.value;

    const metadataOrderId = metadataFor("order_id");
    const metadataCustomerName = metadataFor("customer_name");
    const metadataPhone = metadataFor("phone");
    const metadataOrderHash = metadataFor("order_hash");
    const metadataIntendedUserId = metadataFor("intended_user_id");

    // Bind ownership: whoever's Clerk session paid for this transaction is
    // the only one who can finalize it. "" on both sides means a guest
    // checkout that started and ended with no session — also fine.
    const { userId: authUserId } = await auth();
    if ((metadataIntendedUserId ?? "") !== (authUserId ?? "")) {
      console.warn("Order ownership does not match verified payment", {
        reference: paystackReference,
        metadataIntendedUserId,
        authUserId,
      });
      return bad("Session does not match the verified payment");
    }

    if (
      metadataOrderId !== orderData.orderId ||
      metadataCustomerName !== orderData.customerInfo?.fullName ||
      metadataPhone !== orderData.customerInfo?.phone
    ) {
      console.warn("Order metadata does not match verified payment", {
        reference: paystackReference,
        metadataOrderId,
        bodyOrderId: orderData.orderId,
      });
      return bad("Order details do not match the verified payment");
    }

    // Validate incoming items and collect product refs
    const incomingItems = orderData.items as IncomingItem[];
    const productIds: string[] = [];
    const quantities: number[] = [];
    for (const item of incomingItems) {
      const ref = item?.product?._ref;
      const qty = Number(item?.quantity);
      if (typeof ref !== "string" || !Number.isInteger(qty) || qty <= 0) {
        return bad("Invalid item: missing product reference or quantity");
      }
      productIds.push(ref);
      quantities.push(qty);
    }

    // Bind the verified payment to the exact items + email + fulfillment +
    // delivery target by recomputing the same hash the client committed at
    // payment-init time. Anything missing or mismatched is rejected — a
    // stolen reference can't be reused with a different email, address, or
    // pickup/delivery choice.
    const expectedOrderHash = await computeOrderHash({
      items: incomingItems.map((_, i) => ({
        product: { _ref: productIds[i] },
        quantity: quantities[i],
      })),
      email: orderData.customerInfo?.email,
      fulfillmentMethod: orderData.fulfillmentMethod,
      deliveryInfo: orderData.deliveryInfo,
    });
    if (!metadataOrderHash || metadataOrderHash !== expectedOrderHash) {
      console.warn("Order hash does not match verified payment", {
        reference: paystackReference,
        metadataOrderHash,
        expectedOrderHash,
      });
      return bad("Order details do not match the verified payment");
    }

    // Idempotency: now that verification + binding have passed, return the
    // existing order if this reference already landed.
    const existing = await client.fetch<ExistingOrder | null>(
      `*[_type == "order" && payment.paystackReference == $ref][0]{ _id, orderId }`,
      { ref: paystackReference },
    );
    if (existing) {
      return NextResponse.json({
        success: true,
        orderId: existing.orderId,
        _id: existing._id,
      });
    }

    // Refetch products by id — these are the authoritative price/title/image
    const products: ProductRow[] = await client.fetch(
      `*[_type == "product" && _id in $ids]{ _id, title, price, discountPrice, "image": image.asset->url }`,
      { ids: Array.from(new Set(productIds)) },
    );
    const productById = new Map(products.map((p) => [p._id, p]));

    // Rebuild items from authoritative data, applying server-side bulk pricing
    let subtotal = 0;
    const rebuiltItems = incomingItems.map((item, index) => {
      const ref = productIds[index];
      const product = productById.get(ref);
      if (!product) {
        throw Object.assign(new Error(`Product not found: ${ref}`), {
          __badRequest: true,
        });
      }
      const quantity = quantities[index];
      const lineTotal = calculateItemPrice(
        {
          title: product.title,
          price: product.price,
          discountPrice: product.discountPrice,
        },
        quantity,
      );
      subtotal += lineTotal;

      const incomingKey =
        typeof item._key === "string" && item._key.length > 0
          ? item._key
          : undefined;

      return {
        _key:
          incomingKey ||
          createHash("sha256")
            .update(`${paystackReference}:${index}:${ref}`)
            .digest("hex")
            .slice(0, 12),
        product: { _ref: ref, _type: "reference" },
        productSnapshot: {
          title: product.title,
          price: product.price,
          ...(typeof product.discountPrice === "number"
            ? { discountPrice: product.discountPrice }
            : {}),
          ...(product.image ? { image: product.image } : {}),
        },
        quantity,
        priceAtPurchase: lineTotal / quantity,
      };
    });

    // Strict amount check — coupons are inactive, so paid must equal subtotal
    if (Math.abs(paidAmountGhs - subtotal) > 0.01) {
      console.warn("Order paid amount does not match server subtotal", {
        reference: paystackReference,
        paidAmountGhs,
        subtotal,
      });
      return bad("Payment amount does not match the expected order total");
    }

    const nowIso = new Date().toISOString();

    // userId comes from the server-side Clerk session that just passed the
    // ownership-bind check above — never trust whatever the client put on
    // customerInfo.userId. Guests get no userId on the doc.
    const incomingCustomerInfo = orderData.customerInfo ?? {};
    const customerInfo = {
      fullName: incomingCustomerInfo.fullName,
      phone: incomingCustomerInfo.phone,
      email: incomingCustomerInfo.email,
      ...(authUserId ? { userId: authUserId } : {}),
    };

    const orderDoc = {
      _id: getOrderDocumentId(paystackReference),
      _type: "order",
      orderId: orderData.orderId,
      customerInfo,
      fulfillmentMethod: orderData.fulfillmentMethod,
      ...(orderData.deliveryInfo
        ? { deliveryInfo: orderData.deliveryInfo }
        : {}),
      items: rebuiltItems,
      pricing: {
        subtotal,
        discount: 0,
        total: subtotal,
      },
      payment: {
        method: "paystack",
        status: "paid",
        paystackReference,
        amount: paidAmountGhs,
        paidAt: paidAtIso,
      },
      deliveryStatus: "payment_received",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const order = await client.createIfNotExists(orderDoc as any);

    return NextResponse.json({
      success: true,
      orderId: (order as any).orderId,
      _id: order._id,
    });
  } catch (error: any) {
    if (error?.__badRequest) {
      console.warn("Order creation rejected:", error.message);
      return bad(error.message);
    }
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

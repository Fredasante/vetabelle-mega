// @ts-nocheck

import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "customerInfo",
      title: "Customer Information",
      type: "object",
      fields: [
        { name: "fullName", title: "Full Name", type: "string" },
        { name: "phone", title: "Phone", type: "string" },
        { name: "email", title: "Email", type: "string" },
        { name: "userId", title: "User ID (Clerk)", type: "string" },
      ],
    }),
    defineField({
      name: "deliveryInfo",
      title: "Delivery Information",
      type: "object",
      fields: [
        { name: "region", title: "Region", type: "string" },
        { name: "city", title: "City", type: "string" },
        { name: "address", title: "Address", type: "text" },
      ],
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
            },
            {
              name: "productSnapshot",
              title: "Product Snapshot",
              type: "object",
              description: "Snapshot of product at time of purchase",
              fields: [
                { name: "title", title: "Product Title", type: "string" },
                { name: "price", title: "Price", type: "number" },
                {
                  name: "discountPrice",
                  title: "Discount Price",
                  type: "number",
                },
                { name: "image", title: "Image URL", type: "string" },
              ],
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            },
            {
              name: "priceAtPurchase",
              title: "Price at Purchase",
              type: "number",
            },
          ],
          preview: {
            select: {
              title: "productSnapshot.title",
              quantity: "quantity",
              price: "priceAtPurchase",
              media: "productSnapshot.image",
            },
            prepare({ title, quantity, price }) {
              return {
                title: title || "Product",
                subtitle: `Qty: ${quantity} × ₵${price?.toFixed(2)}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      fields: [
        { name: "subtotal", title: "Subtotal", type: "number" },
        { name: "discount", title: "Discount", type: "number" },
        { name: "total", title: "Total", type: "number" },
        { name: "couponCode", title: "Coupon Code", type: "string" },
      ],
    }),
    defineField({
      name: "payment",
      title: "Payment",
      type: "object",
      fields: [
        {
          name: "method",
          title: "Payment Method",
          type: "string",
          options: {
            list: [
              { title: "Paystack", value: "paystack" },
              { title: "Cash on Delivery", value: "cod" },
            ],
          },
        },
        {
          name: "status",
          title: "Payment Status",
          type: "string",
          options: {
            list: [
              { title: "Pending", value: "pending" },
              { title: "Paid", value: "paid" },
              { title: "Failed", value: "failed" },
              { title: "Refunded", value: "refunded" },
            ],
          },
        },
        {
          name: "paystackReference",
          title: "Paystack Reference",
          type: "string",
        },
        { name: "amount", title: "Amount", type: "number" },
        { name: "paidAt", title: "Paid At", type: "datetime" },
      ],
    }),
    defineField({
      name: "deliveryStatus",
      title: "Delivery Status",
      type: "string",
      options: {
        list: [
          { title: "Payment Pending", value: "payment_pending" },
          { title: "Payment Received", value: "payment_received" },
          { title: "Processing", value: "processing" },
          { title: "Ready for Pickup", value: "ready_for_pickup" },
          { title: "Out for Delivery", value: "out_for_delivery" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      orderId: "orderId",
      customerName: "customerInfo.fullName",
      total: "pricing.total",
      status: "deliveryStatus",
      createdAt: "createdAt",
    },
    prepare({ orderId, customerName, total, status, createdAt }) {
      const statusEmojis: Record<string, string> = {
        payment_pending: "⏳",
        payment_received: "✅",
        processing: "📦",
        ready_for_pickup: "🎁",
        out_for_delivery: "🚚",
        delivered: "✨",
        cancelled: "❌",
      };

      return {
        title: `${orderId} - ${customerName || "Guest"}`,
        subtitle: `₵${total?.toFixed(2)} • ${statusEmojis[status] || ""} ${status
          ?.replace(/_/g, " ")
          .toUpperCase()} • ${new Date(createdAt).toLocaleDateString()}`,
      };
    },
  },
  orderings: [
    {
      title: "Latest First",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Oldest First",
      name: "createdAtAsc",
      by: [{ field: "createdAt", direction: "asc" }],
    },
  ],
});

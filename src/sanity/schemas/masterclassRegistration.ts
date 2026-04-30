// @ts-nocheck

import { defineField, defineType } from "sanity";

export default defineType({
  name: "masterclassRegistration",
  title: "Masterclass Registrations",
  type: "document",
  fields: [
    defineField({
      name: "registrationId",
      title: "Registration ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "masterclass",
      title: "Masterclass",
      type: "reference",
      to: [{ type: "masterclass" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "registrantInfo",
      title: "Registrant Information",
      type: "object",
      fields: [
        { name: "fullName", title: "Full Name", type: "string" },
        { name: "phone", title: "Phone", type: "string" },
        { name: "email", title: "Email", type: "string" },
        { name: "location", title: "Location (Area / City)", type: "string" },
      ],
    }),
    defineField({
      name: "preferences",
      title: "Preferences",
      type: "object",
      fields: [
        {
          name: "topicToLearn",
          title: "What would you like to learn?",
          type: "string",
        },
        {
          name: "audienceType",
          title: "What best describes you?",
          type: "string",
        },
        {
          name: "referralSource",
          title: "Where did you hear about this program?",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "payment",
      title: "Payment",
      type: "object",
      fields: [
        {
          name: "status",
          title: "Status",
          type: "string",
          options: {
            list: [
              { title: "Pending", value: "pending" },
              { title: "Paid", value: "paid" },
              { title: "Confirmed", value: "confirmed" },
              { title: "Failed", value: "failed" },
            ],
          },
        },
        {
          name: "paystackReference",
          title: "Paystack Reference",
          type: "string",
        },
        { name: "amount", title: "Amount (GHS)", type: "number" },
        {
          name: "priceTier",
          title: "Price Tier",
          type: "string",
          options: {
            list: [
              { title: "Early Bird", value: "early_bird" },
              { title: "Regular", value: "regular" },
            ],
          },
        },
        { name: "paidAt", title: "Paid At", type: "datetime" },
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      registrationId: "registrationId",
      fullName: "registrantInfo.fullName",
      topic: "preferences.topicToLearn",
      tier: "payment.priceTier",
      status: "payment.status",
    },
    prepare({ registrationId, fullName, topic, tier, status }) {
      const statusLabel =
        status === "paid"
          ? "🟢 Paid"
          : status === "confirmed"
            ? "🔵 Confirmed"
            : status === "failed"
              ? "🔴 Failed"
              : "🟡 Pending";
      const tierLabel =
        tier === "early_bird" ? "Early Bird" : tier === "regular" ? "Regular" : "—";
      return {
        title: `${fullName || "Unknown"} — ${registrationId}`,
        subtitle: `${statusLabel} • ${topic || "No topic"} • ${tierLabel}`,
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

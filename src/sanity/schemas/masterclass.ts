// @ts-nocheck

import { defineField, defineType } from "sanity";

export default defineType({
  name: "masterclass",
  title: "Masterclasses",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventDate",
      title: "Event Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g., 'Accra, Ghana' or 'Online'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bannerImage",
      title: "Banner Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich event description shown on the landing page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "learningTopics",
      title: "Learning Topics",
      type: "array",
      of: [{ type: "string" }],
      description: "Options for 'What would you like to learn?'",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "audienceTypes",
      title: "Audience Types",
      type: "array",
      of: [{ type: "string" }],
      description: "Options for 'What best describes you?'",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "referralSources",
      title: "Referral Sources",
      type: "array",
      of: [{ type: "string" }],
      description: "Options for 'Where did you hear about this program?'",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "regularPrice",
      title: "Regular Price (GHS)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "earlyBirdPrice",
      title: "Early Bird Price (GHS)",
      type: "number",
      description: "Optional. If set, earlyBirdDeadline must also be set.",
    }),
    defineField({
      name: "earlyBirdDeadline",
      title: "Early Bird Deadline",
      type: "datetime",
      description: "Required if earlyBirdPrice is set. Must be before eventDate.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as any;
          if (doc?.earlyBirdPrice && !value)
            return "Required when Early Bird Price is set";
          if (value && doc?.eventDate && new Date(value) >= new Date(doc.eventDate))
            return "Must be before the event date";
          return true;
        }),
    }),
    defineField({
      name: "registrationOpen",
      title: "Registration Open",
      type: "boolean",
      description: "Manual kill switch — set to false to close registration",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "registrationDeadline",
      title: "Registration Deadline",
      type: "datetime",
      description:
        "Optional. If unset, registration runs until the event date. Must be on or before eventDate.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as any;
          if (value && doc?.eventDate && new Date(value) > new Date(doc.eventDate))
            return "Must be on or before the event date";
          return true;
        }),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description:
        "The site shows the active masterclass. Only one document should be active at a time.",
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      eventDate: "eventDate",
      isActive: "isActive",
      media: "bannerImage",
    },
    prepare({ title, eventDate, isActive, media }) {
      const dateLabel = eventDate
        ? new Date(eventDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "no date";
      return {
        title,
        subtitle: `${dateLabel} — ${isActive ? "🟢 Active" : "⚪ Inactive"}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Event Date (Latest)",
      name: "eventDateDesc",
      by: [{ field: "eventDate", direction: "desc" }],
    },
  ],
});

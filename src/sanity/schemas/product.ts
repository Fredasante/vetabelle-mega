// @ts-nocheck

import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",

  fields: [
    // 🏷️ Basic Info
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // 🖼️ Images
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
    }),

    // 🏷️ Category
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Clothing", value: "clothing" },
          { title: "Sneakers", value: "sneakers" },
          { title: "Slippers", value: "slippers" },
          { title: "Gadgets", value: "gadgets" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🚻 Gender
    defineField({
      name: "gender",
      title: "Gender",
      type: "string",
      options: {
        list: [
          { title: "Women", value: "women" },
          { title: "Men", value: "men" },
          { title: "Unisex", value: "unisex" },
        ],
        layout: "dropdown",
      },
      initialValue: "women",
    }),

    // 📏 Numeric Sizes (Visible only for Clothing)
    defineField({
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "6", value: "6" },
          { title: "8", value: "8" },
          { title: "10", value: "10" },
          { title: "12", value: "12" },
          { title: "14", value: "14" },
          { title: "16", value: "16" },
          { title: "18", value: "18" },
          { title: "20", value: "20" },
        ],
        layout: "tags",
      },
      description: "Select all available sizes (for clothing only)",
      hidden: ({ parent }) => parent?.category !== "clothing",
    }),

    // 💰 Price
    defineField({
      name: "price",
      title: "Price (₵)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "discountPrice",
      title: "Discount Price (₵)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),

    // 🎨 Color
    defineField({
      name: "colors",
      title: "Available Colors",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Example: Red, Black, White, Blue",
    }),

    // 🧾 Description
    defineField({
      name: "description",
      title: "Product Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich text description of the product.",
    }),

    // 🚦 Status
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Sold", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (Rule) => Rule.required(),
    }),

    // ⭐ Flags
    defineField({
      name: "isFeatured",
      title: "Featured Product?",
      type: "boolean",
      initialValue: false,
    }),

    // 🕒 Dates
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "mainImage",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: subtitle
          ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1)
          : "",
        media,
      };
    },
  },
});

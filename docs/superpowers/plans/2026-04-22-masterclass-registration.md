# Masterclass Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a paid event-registration feature on `/masterclass` with Sanity-managed event content, Paystack payment, and a homepage promo. Replaces the current Google Form + manual mobile-money flow.

**Architecture:** Two new Sanity schemas (`masterclass` and `masterclassRegistration`), one new API route to verify Paystack and persist registrations, a `/masterclass` landing page with inline form, a `/masterclass/success` confirmation page, and a `MasterclassPromo` homepage section + conditional nav link.

**Tech Stack:** Next.js 15 App Router, TypeScript, Sanity (CMS), Paystack inline-js (already integrated), Tailwind CSS, lucide-react, react-spinners.

**Source spec:** [`docs/superpowers/specs/2026-04-22-masterclass-registration-design.md`](../specs/2026-04-22-masterclass-registration-design.md)

**Important:** This codebase has no test framework. Each task ends with **manual verification** steps (commands + expected output) rather than automated tests. Run `npm run dev` once at the start; the dev server hot-reloads.

---

## File Structure (what gets created or modified)

**Create:**
- `src/sanity/schemas/masterclass.ts` — event schema
- `src/sanity/schemas/masterclassRegistration.ts` — signup schema
- `src/types/masterclass.ts` — TypeScript types
- `src/lib/masterclass.ts` — pricing/state helpers + ID generator
- `src/app/api/masterclass/register/route.ts` — POST: verify + persist
- `src/app/api/masterclass/active/route.ts` — GET: active masterclass (for header)
- `src/components/Masterclass/index.tsx` — page-level orchestrator
- `src/components/Masterclass/Hero.tsx`
- `src/components/Masterclass/PriceCard.tsx`
- `src/components/Masterclass/RegistrationForm.tsx`
- `src/components/Masterclass/EmptyStates.tsx`
- `src/components/Masterclass/Success.tsx`
- `src/components/Home/MasterclassPromo.tsx`
- `src/app/(site)/(pages)/masterclass/page.tsx`
- `src/app/(site)/(pages)/masterclass/success/page.tsx`

**Modify:**
- `src/sanity/schemas/index.ts` — register the two new schemas
- `src/sanity/groq.ts` — add masterclass-related GROQ queries
- `src/components/Home/index.tsx` — render `MasterclassPromo`
- `src/components/Header/index.tsx` — conditional Masterclass nav link

---

## Task 1: Create the `masterclass` Sanity schema

**Files:**
- Create: `src/sanity/schemas/masterclass.ts`

- [ ] **Step 1: Create the schema file**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemas/masterclass.ts
git commit -m "feat(sanity): add masterclass event schema"
```

---

## Task 2: Create the `masterclassRegistration` Sanity schema

**Files:**
- Create: `src/sanity/schemas/masterclassRegistration.ts`

- [ ] **Step 1: Create the schema file**

```ts
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
      const statusEmoji =
        status === "paid" ? "✅" : status === "failed" ? "❌" : "⏳";
      const tierLabel =
        tier === "early_bird" ? "Early Bird" : tier === "regular" ? "Regular" : "—";
      return {
        title: `${fullName || "Unknown"} — ${registrationId}`,
        subtitle: `${topic || "No topic"} • ${tierLabel} • ${statusEmoji}`,
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
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/schemas/masterclassRegistration.ts
git commit -m "feat(sanity): add masterclass registration schema"
```

---

## Task 3: Register the new schemas in the Studio index

**Files:**
- Modify: `src/sanity/schemas/index.ts`

- [ ] **Step 1: Update the schemas array**

Replace the contents of `src/sanity/schemas/index.ts` with:

```ts
import order from "./order";
import product from "./product";
import masterclass from "./masterclass";
import masterclassRegistration from "./masterclassRegistration";

export const schemas = [product, order, masterclass, masterclassRegistration];
```

- [ ] **Step 2: Manually verify in Sanity Studio**

Run dev server if not already running:

```bash
npm run dev
```

Open `http://localhost:3000/admin` (the Studio mount). Expected:
- "Masterclasses" appears in the document type list.
- "Masterclass Registrations" appears in the document type list.
- Clicking "Masterclasses" → "Create new" shows all the fields from Task 1.

- [ ] **Step 3: Create a test masterclass document**

In the Studio, create a "Masterclass" document with:
- Title: `Vetabelle Mentorship & Masterclass (TEST)`
- Slug: auto-generated
- Event Date: `2026-05-30T10:00:00`
- Location: `Accra, Ghana`
- Banner Image: upload any test image
- Description: a few lines of text
- Learning Topics: `Starting a business, Growing my business, Confidence building, Leadership, Self-care and well-being, Financial management, Marketing, Networking`
- Audience Types: `Market Trader, Small Business Owner, Entrepreneur, Student, Employed, Freelancer, Job Seeker, Social Media Influencer/Content Creator`
- Referral Sources: `Tiktok, Instagram, Facebook, Whatsapp, Friends/Family, LinkedIn`
- Regular Price: `1500`
- Early Bird Price: `1000`
- Early Bird Deadline: `2026-04-30T23:59:00`
- Registration Open: `true`
- Active: `true`

Publish. Expected: document saves without validation errors. Preview shows the title with "🟢 Active" subtitle.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/index.ts
git commit -m "feat(sanity): register masterclass schemas in studio"
```

---

## Task 4: Add TypeScript types

**Files:**
- Create: `src/types/masterclass.ts`

- [ ] **Step 1: Create the types file**

```ts
export type PriceTier = "early_bird" | "regular";
export type PaymentStatus = "pending" | "paid" | "failed";
export type RegistrationState = "open" | "closed" | "ended";

export interface Masterclass {
  _id: string;
  title: string;
  slug: { current: string };
  eventDate: string; // ISO datetime
  location: string;
  bannerImage: string; // resolved URL via GROQ projection
  description: any[]; // portable text blocks
  learningTopics: string[];
  audienceTypes: string[];
  referralSources: string[];
  regularPrice: number;
  earlyBirdPrice?: number;
  earlyBirdDeadline?: string;
  registrationOpen: boolean;
  registrationDeadline?: string;
  isActive: boolean;
}

export interface MasterclassRegistration {
  _id?: string;
  registrationId: string;
  masterclass:
    | { _ref: string; _type: "reference" }
    | { _id: string; title: string; eventDate: string; location: string };
  registrantInfo: {
    fullName: string;
    phone: string;
    email: string;
    location: string;
  };
  preferences: {
    topicToLearn: string;
    audienceType: string;
    referralSource: string;
  };
  payment: {
    status: PaymentStatus;
    paystackReference: string;
    amount: number;
    priceTier: PriceTier;
    paidAt?: string;
  };
  createdAt: string;
}

export interface RegisterRequestBody {
  masterclassId: string;
  paystackReference: string;
  registrantInfo: {
    fullName: string;
    phone: string;
    email: string;
    location: string;
  };
  preferences: {
    topicToLearn: string;
    audienceType: string;
    referralSource: string;
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors related to `masterclass.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/types/masterclass.ts
git commit -m "feat(types): add masterclass type definitions"
```

---

## Task 5: Add GROQ queries for masterclass

**Files:**
- Modify: `src/sanity/groq.ts`

- [ ] **Step 1: Append masterclass queries**

Append the following to the end of `src/sanity/groq.ts`:

```ts

// 🎓 Active, upcoming masterclass (for /masterclass page, homepage promo, nav)
export const activeMasterclassQuery = `
  *[_type == "masterclass" && isActive == true && eventDate > now()]
  | order(_updatedAt desc)[0] {
    _id,
    title,
    slug,
    eventDate,
    location,
    "bannerImage": bannerImage.asset->url,
    description,
    learningTopics,
    audienceTypes,
    referralSources,
    regularPrice,
    earlyBirdPrice,
    earlyBirdDeadline,
    registrationOpen,
    registrationDeadline,
    isActive
  }
`;

// 🎓 Single masterclass by id (for the registration API)
export const masterclassByIdQuery = `
  *[_type == "masterclass" && _id == $id][0] {
    _id,
    title,
    slug,
    eventDate,
    location,
    "bannerImage": bannerImage.asset->url,
    description,
    learningTopics,
    audienceTypes,
    referralSources,
    regularPrice,
    earlyBirdPrice,
    earlyBirdDeadline,
    registrationOpen,
    registrationDeadline,
    isActive
  }
`;

// 🎓 Registration by id (for the success page)
export const masterclassRegistrationByIdQuery = `
  *[_type == "masterclassRegistration" && registrationId == $id][0] {
    _id,
    registrationId,
    masterclass->{
      _id,
      title,
      eventDate,
      location
    },
    registrantInfo,
    preferences,
    payment,
    createdAt
  }
`;
```

- [ ] **Step 2: Commit**

```bash
git add src/sanity/groq.ts
git commit -m "feat(sanity): add masterclass GROQ queries"
```

---

## Task 6: Add pricing/state helpers and ID generator

**Files:**
- Create: `src/lib/masterclass.ts`

- [ ] **Step 1: Create the helper file**

```ts
import type {
  Masterclass,
  PriceTier,
  RegistrationState,
} from "@/types/masterclass";

export function getPriceTier(
  masterclass: Pick<
    Masterclass,
    "regularPrice" | "earlyBirdPrice" | "earlyBirdDeadline"
  >,
  now: Date = new Date(),
): { tier: PriceTier; price: number } {
  if (!masterclass.earlyBirdPrice || !masterclass.earlyBirdDeadline) {
    return { tier: "regular", price: masterclass.regularPrice };
  }
  const isEarlyBird = now < new Date(masterclass.earlyBirdDeadline);
  return isEarlyBird
    ? { tier: "early_bird", price: masterclass.earlyBirdPrice }
    : { tier: "regular", price: masterclass.regularPrice };
}

export function getRegistrationState(
  masterclass: Pick<
    Masterclass,
    "eventDate" | "registrationOpen" | "registrationDeadline"
  >,
  now: Date = new Date(),
): RegistrationState {
  const eventDate = new Date(masterclass.eventDate);
  if (now > eventDate) return "ended";
  if (!masterclass.registrationOpen) return "closed";
  const deadline = masterclass.registrationDeadline
    ? new Date(masterclass.registrationDeadline)
    : eventDate;
  if (now > deadline) return "closed";
  return "open";
}

export function generateRegistrationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MC-${timestamp}-${random}`;
}

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function daysUntil(iso: string, now: Date = new Date()): number {
  const target = new Date(iso).getTime();
  const diff = target - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/masterclass.ts
git commit -m "feat(lib): add masterclass pricing and state helpers"
```

---

## Task 7: Add the registration API route

**Files:**
- Create: `src/app/api/masterclass/register/route.ts`

- [ ] **Step 1: Create the route file**

```ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { masterclassByIdQuery } from "@/sanity/groq";
import { getPriceTier, generateRegistrationId } from "@/lib/masterclass";
import type {
  Masterclass,
  RegisterRequestBody,
} from "@/types/masterclass";

function isValidBody(body: any): body is RegisterRequestBody {
  return (
    body &&
    typeof body.masterclassId === "string" &&
    typeof body.paystackReference === "string" &&
    body.registrantInfo &&
    typeof body.registrantInfo.fullName === "string" &&
    typeof body.registrantInfo.phone === "string" &&
    typeof body.registrantInfo.email === "string" &&
    typeof body.registrantInfo.location === "string" &&
    body.preferences &&
    typeof body.preferences.topicToLearn === "string" &&
    typeof body.preferences.audienceType === "string" &&
    typeof body.preferences.referralSource === "string"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    // 1. Verify Paystack transaction
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${body.paystackReference}`,
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
      return NextResponse.json(
        {
          success: false,
          message:
            paystackData?.message || "Payment not successful or could not be verified",
        },
        { status: 400 },
      );
    }

    const paidAtIso =
      paystackData.data.paid_at || paystackData.data.paidAt || new Date().toISOString();
    const paidAmountGhs = paystackData.data.amount / 100;

    // 2. Fetch the masterclass and confirm it's active
    const masterclass: Masterclass | null = await client.fetch(
      masterclassByIdQuery,
      { id: body.masterclassId },
    );

    if (!masterclass) {
      return NextResponse.json(
        { success: false, message: "Masterclass not found" },
        { status: 404 },
      );
    }
    if (!masterclass.isActive) {
      return NextResponse.json(
        { success: false, message: "Masterclass is no longer active" },
        { status: 404 },
      );
    }

    // 3. Recompute price using paidAt as the reference time
    const { tier: expectedTier, price: expectedPrice } = getPriceTier(
      masterclass,
      new Date(paidAtIso),
    );

    if (Math.abs(paidAmountGhs - expectedPrice) > 0.01) {
      console.warn("Masterclass price mismatch", {
        reference: body.paystackReference,
        paidAmountGhs,
        expectedPrice,
      });
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment amount does not match the expected price. Please contact support.",
        },
        { status: 400 },
      );
    }

    // 4. Create the registration document
    const registrationId = generateRegistrationId();

    const registration = await client.create({
      _type: "masterclassRegistration",
      registrationId,
      masterclass: { _ref: masterclass._id, _type: "reference" },
      registrantInfo: body.registrantInfo,
      preferences: body.preferences,
      payment: {
        status: "paid",
        paystackReference: body.paystackReference,
        amount: paidAmountGhs,
        priceTier: expectedTier,
        paidAt: paidAtIso,
      },
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      registrationId: registration.registrationId,
      _id: registration._id,
    });
  } catch (error) {
    console.error("Masterclass registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create registration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Manually verify the route exists**

With dev server running, test that the route responds (it should reject the invalid body):

```bash
curl -X POST http://localhost:3000/api/masterclass/register \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected: `{"success":false,"message":"Missing or invalid required fields"}` with HTTP 400.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/masterclass/register/route.ts
git commit -m "feat(api): add masterclass registration endpoint"
```

---

## Task 8: Add the active-masterclass GET endpoint (used by Header)

**Files:**
- Create: `src/app/api/masterclass/active/route.ts`

- [ ] **Step 1: Create the route file**

```ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { activeMasterclassQuery } from "@/sanity/groq";
import type { Masterclass } from "@/types/masterclass";

export async function GET() {
  try {
    const masterclass: Masterclass | null = await client.fetch(
      activeMasterclassQuery,
    );
    return NextResponse.json({ masterclass });
  } catch (error) {
    console.error("Active masterclass fetch error:", error);
    return NextResponse.json({ masterclass: null }, { status: 500 });
  }
}
```

- [ ] **Step 2: Manually verify the route**

With the test masterclass created in Task 3 set to Active:

```bash
curl http://localhost:3000/api/masterclass/active
```

Expected: JSON containing `masterclass` with the test event's `_id`, `title`, `eventDate`, etc. If the event is set to `isActive: false` or `eventDate < now()`, expect `{"masterclass":null}`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/masterclass/active/route.ts
git commit -m "feat(api): add active-masterclass GET endpoint"
```

---

## Task 9: Build the `PriceCard` component

**Files:**
- Create: `src/components/Masterclass/PriceCard.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import React from "react";
import type { Masterclass } from "@/types/masterclass";
import { getPriceTier, daysUntil } from "@/lib/masterclass";

interface PriceCardProps {
  masterclass: Pick<
    Masterclass,
    "regularPrice" | "earlyBirdPrice" | "earlyBirdDeadline"
  >;
  onRegisterClick?: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({ masterclass, onRegisterClick }) => {
  const { tier, price } = getPriceTier(masterclass);
  const isEarlyBird = tier === "early_bird";
  const daysLeft = isEarlyBird && masterclass.earlyBirdDeadline
    ? daysUntil(masterclass.earlyBirdDeadline)
    : null;

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-6 border border-gray-3">
      {isEarlyBird && (
        <span className="inline-block text-xs font-medium text-white bg-[#c77f56] px-2.5 py-1 rounded-full mb-3">
          Early Bird Offer
        </span>
      )}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-bold text-[#c77f56]">
          ₵{price.toLocaleString()}
        </span>
        {isEarlyBird && masterclass.regularPrice > price && (
          <span className="text-base text-dark-5 line-through">
            ₵{masterclass.regularPrice.toLocaleString()}
          </span>
        )}
      </div>
      {isEarlyBird && daysLeft !== null && (
        <p className="text-sm text-dark-5 mb-4">
          {daysLeft === 0
            ? "Last day for early bird pricing!"
            : `Early bird ends in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
        </p>
      )}
      {!isEarlyBird && (
        <p className="text-sm text-dark-5 mb-4">Regular price</p>
      )}
      {onRegisterClick && (
        <button
          type="button"
          onClick={onRegisterClick}
          className="w-full font-medium text-white bg-[#c77f56] py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-90"
        >
          Register Below
        </button>
      )}
    </div>
  );
};

export default PriceCard;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Masterclass/PriceCard.tsx
git commit -m "feat(masterclass): add PriceCard component"
```

---

## Task 10: Build the `Hero` component

**Files:**
- Create: `src/components/Masterclass/Hero.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import React from "react";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import type { Masterclass } from "@/types/masterclass";
import { formatEventDate } from "@/lib/masterclass";
import PriceCard from "./PriceCard";

interface HeroProps {
  masterclass: Masterclass;
  onRegisterClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ masterclass, onRegisterClick }) => {
  return (
    <section className="bg-[#fdf6f0] pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden shadow-1">
            <Image
              src={masterclass.bannerImage}
              alt={masterclass.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-5 leading-tight">
              {masterclass.title}
            </h1>
            <div className="flex flex-col gap-2.5 mb-7">
              <div className="flex items-center gap-2.5 text-dark">
                <Calendar className="w-5 h-5 text-[#c77f56]" />
                <span className="font-medium">
                  {formatEventDate(masterclass.eventDate)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-dark">
                <MapPin className="w-5 h-5 text-[#c77f56]" />
                <span className="font-medium">{masterclass.location}</span>
              </div>
            </div>
            <PriceCard masterclass={masterclass} onRegisterClick={onRegisterClick} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Masterclass/Hero.tsx
git commit -m "feat(masterclass): add Hero component"
```

---

## Task 11: Build the empty-state components

**Files:**
- Create: `src/components/Masterclass/EmptyStates.tsx`

- [ ] **Step 1: Create the component file**

```tsx
import React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface EventEndedProps {
  title?: string;
}

export const NoActiveEvent: React.FC = () => (
  <section className="overflow-hidden py-20 bg-gray-2 mt-32 md:mt-40">
    <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="bg-white shadow-1 rounded-[10px] p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fdf6f0] mb-5">
          <Calendar className="w-8 h-8 text-[#c77f56]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-3">
          No upcoming masterclass right now
        </h2>
        <p className="text-dark-5 mb-7 max-w-lg mx-auto">
          We&apos;re cooking up the next one. Follow us on social media to be
          the first to know when registration opens.
        </p>
        <Link
          href="/"
          className="inline-block font-medium text-white bg-[#c77f56] py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  </section>
);

export const EventEnded: React.FC<EventEndedProps> = ({ title }) => (
  <section className="overflow-hidden py-20 bg-gray-2 mt-32 md:mt-40">
    <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="bg-white shadow-1 rounded-[10px] p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-3">
          {title ? `${title} has ended` : "This event has ended"}
        </h2>
        <p className="text-dark-5 mb-7 max-w-lg mx-auto">
          Thanks to everyone who joined! Stay tuned for the next masterclass.
        </p>
        <Link
          href="/"
          className="inline-block font-medium text-white bg-[#c77f56] py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  </section>
);

export const RegistrationClosed: React.FC = () => (
  <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
    <h3 className="text-xl font-semibold text-dark mb-2">
      Registration is closed
    </h3>
    <p className="text-dark-5">
      Registration for this masterclass is no longer accepting new sign-ups.
    </p>
  </div>
);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Masterclass/EmptyStates.tsx
git commit -m "feat(masterclass): add empty-state components"
```

---

## Task 12: Build the `RegistrationForm` component

**Files:**
- Create: `src/components/Masterclass/RegistrationForm.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { CircleCheck } from "lucide-react";
import {
  initializePaystackPayment,
  generatePaymentReference,
} from "@/lib/paystack";
import { getPriceTier } from "@/lib/masterclass";
import type { Masterclass } from "@/types/masterclass";

interface RegistrationFormProps {
  masterclass: Masterclass;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ masterclass }) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { price, tier } = getPriceTier(masterclass);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);

    const registrantInfo = {
      fullName: (formData.get("fullName") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      email: (formData.get("email") as string).trim(),
      location: (formData.get("location") as string).trim(),
    };
    const preferences = {
      topicToLearn: formData.get("topicToLearn") as string,
      audienceType: formData.get("audienceType") as string,
      referralSource: formData.get("referralSource") as string,
    };

    const paystackReference = generatePaymentReference(
      `MC-${masterclass.slug.current}`,
    );

    try {
      initializePaystackPayment({
        email: registrantInfo.email,
        amount: price,
        reference: paystackReference,
        metadata: {
          orderId: paystackReference,
          customerName: registrantInfo.fullName,
          phone: registrantInfo.phone,
          items: [
            {
              title: masterclass.title,
              quantity: 1,
              price,
              tier,
            },
          ],
        },
        onSuccess: async (transaction) => {
          try {
            const response = await fetch("/api/masterclass/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                masterclassId: masterclass._id,
                paystackReference: transaction.reference,
                registrantInfo,
                preferences,
              }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
              throw new Error(
                data?.message ||
                  "Payment received but registration failed. Please contact support.",
              );
            }

            router.push(`/masterclass/success?id=${data.registrationId}`);
          } catch (err) {
            console.error("Post-payment registration error:", err);
            setErrorMessage(
              `Payment successful, but we couldn't save your registration. Please contact support with reference: ${transaction.reference}`,
            );
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setIsProcessing(false);
          setErrorMessage("Payment was cancelled. Your registration was not completed.");
        },
      });
    } catch (err) {
      console.error("Paystack init error:", err);
      setErrorMessage("Could not start payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form
      id="register"
      onSubmit={handleSubmit}
      className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8"
    >
      <h2 className="text-2xl font-semibold text-dark mb-1">Register Now</h2>
      <p className="text-dark-5 mb-7">
        Fill in your details and pay securely via card or mobile money.
      </p>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="fullName" className="block mb-2.5">
            Full Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            required
            placeholder="Enter your full name"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-2.5">
            Phone Number <span className="text-red">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            pattern="[0-9]{10}"
            placeholder="024 123 4567"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="email" className="block mb-2.5">
            Email Address <span className="text-red">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="your.email@example.com"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          <p className="text-xs text-gray-600 mt-1.5">
            For payment receipt and event updates
          </p>
        </div>
        <div>
          <label htmlFor="location" className="block mb-2.5">
            Location (Area / City) <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            placeholder="e.g., East Legon, Accra"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="topicToLearn" className="block mb-2.5">
          What would you like to learn? <span className="text-red">*</span>
        </label>
        <select
          name="topicToLearn"
          id="topicToLearn"
          required
          defaultValue=""
          className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        >
          <option value="" disabled>
            Select a topic
          </option>
          {masterclass.learningTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label htmlFor="audienceType" className="block mb-2.5">
          What best describes you? <span className="text-red">*</span>
        </label>
        <select
          name="audienceType"
          id="audienceType"
          required
          defaultValue=""
          className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        >
          <option value="" disabled>
            Select one
          </option>
          {masterclass.audienceTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-7">
        <label htmlFor="referralSource" className="block mb-2.5">
          Where did you hear about this program? <span className="text-red">*</span>
        </label>
        <select
          name="referralSource"
          id="referralSource"
          required
          defaultValue=""
          className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        >
          <option value="" disabled>
            Select source
          </option>
          {masterclass.referralSources.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full flex justify-center items-center gap-2 font-medium text-white bg-[#c77f56] py-3.5 px-6 rounded-md ease-out duration-200 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <ClipLoader size={20} color="#ffffff" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CircleCheck className="w-4 h-4" />
            <span>Register & Pay ₵{price.toLocaleString()}</span>
          </>
        )}
      </button>

      <p className="text-xs text-center text-gray-600 mt-4">
        🔒 Secure payment via Paystack • Card or Mobile Money
      </p>
    </form>
  );
};

export default RegistrationForm;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Masterclass/RegistrationForm.tsx
git commit -m "feat(masterclass): add RegistrationForm component"
```

---

## Task 13: Build the page-level orchestrator component

**Files:**
- Create: `src/components/Masterclass/index.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import React, { useRef } from "react";
import { PortableText } from "@portabletext/react";
import type { Masterclass as MasterclassType } from "@/types/masterclass";
import { getRegistrationState } from "@/lib/masterclass";
import Hero from "./Hero";
import RegistrationForm from "./RegistrationForm";
import { EventEnded, RegistrationClosed } from "./EmptyStates";

interface MasterclassProps {
  masterclass: MasterclassType;
}

const Masterclass: React.FC<MasterclassProps> = ({ masterclass }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const state = getRegistrationState(masterclass);

  if (state === "ended") {
    return <EventEnded title={masterclass.title} />;
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <Hero masterclass={masterclass} onRegisterClick={scrollToForm} />

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-5">
                About this Masterclass
              </h2>
              <div className="prose max-w-none text-dark-5 leading-relaxed">
                <PortableText value={masterclass.description} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dark mb-4">
                What you&apos;ll learn
              </h3>
              <ul className="space-y-2.5">
                {masterclass.learningTopics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-2 text-dark-5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c77f56] mt-2 flex-shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section ref={formRef} className="py-12 md:py-16 bg-gray-2">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {state === "open" ? (
            <RegistrationForm masterclass={masterclass} />
          ) : (
            <RegistrationClosed />
          )}
        </div>
      </section>
    </main>
  );
};

export default Masterclass;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Masterclass/index.tsx
git commit -m "feat(masterclass): add page orchestrator component"
```

---

## Task 14: Add the `/masterclass` page route

**Files:**
- Create: `src/app/(site)/(pages)/masterclass/page.tsx`

- [ ] **Step 1: Create the page file**

```tsx
import { Metadata } from "next";
import { client } from "@/sanity/client";
import { activeMasterclassQuery } from "@/sanity/groq";
import type { Masterclass as MasterclassType } from "@/types/masterclass";
import Masterclass from "@/components/Masterclass";
import { NoActiveEvent } from "@/components/Masterclass/EmptyStates";

export const metadata: Metadata = {
  title: "Vetabelle Masterclass | Mentorship & Empowerment for Women",
  description:
    "Join the Vetabelle Mentorship & Masterclass — build confidence, become financially stable, and heal into your highest self.",
};

export const dynamic = "force-dynamic";

export default async function MasterclassPage() {
  const masterclass: MasterclassType | null = await client.fetch(
    activeMasterclassQuery,
  );

  if (!masterclass) {
    return <NoActiveEvent />;
  }

  return <Masterclass masterclass={masterclass} />;
}
```

- [ ] **Step 2: Manually verify the page**

With dev server running and the test masterclass document set to Active, visit `http://localhost:3000/masterclass`. Expected:
- Hero with banner image, title, date ("Saturday, 30 May 2026"), location ("Accra, Ghana"), and PriceCard showing "Early Bird Offer", "₵1,000", "₵1,500" struck through, "Early bird ends in N days".
- "About this Masterclass" with description.
- "What you'll learn" list with all 8 topics.
- Registration form with all fields and "Register & Pay ₵1,000" button.

Now toggle the test masterclass to `isActive: false` in the Studio (publish), refresh the page. Expected: "No upcoming masterclass right now" empty state. Toggle back to `isActive: true` for subsequent tasks.

- [ ] **Step 3: Commit**

```bash
git add src/app/(site)/(pages)/masterclass/page.tsx
git commit -m "feat(masterclass): add /masterclass page route"
```

---

## Task 15: Build the `Success` component

**Files:**
- Create: `src/components/Masterclass/Success.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CircleCheck, Calendar, MapPin } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { formatEventDate } from "@/lib/masterclass";

interface RegistrationDetails {
  registrationId: string;
  masterclass: {
    title: string;
    eventDate: string;
    location: string;
  };
  registrantInfo: {
    fullName: string;
    email: string;
  };
  payment: {
    amount: number;
    paystackReference: string;
    priceTier: string;
  };
}

const Success: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [registration, setRegistration] = useState<RegistrationDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }
    const load = async () => {
      try {
        const res = await fetch(`/api/masterclass/registration/${id}`);
        const data = await res.json();
        if (!res.ok || !data.registration) {
          throw new Error(data?.message || "Registration not found");
        }
        setRegistration(data.registration);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load registration");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  if (loading) {
    return (
      <section className="overflow-hidden py-20 bg-gray-2 mt-32 md:mt-40">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex justify-center items-center min-h-[300px]">
            <ClipLoader size={32} color="#c77f56" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !registration) {
    return (
      <section className="overflow-hidden py-20 bg-gray-2 mt-32 md:mt-40">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
            <h2 className="text-2xl font-semibold text-dark mb-3">
              We couldn&apos;t load your registration
            </h2>
            <p className="text-dark-5 mb-7">
              {error || "Please contact support with your payment reference."}
            </p>
            <Link
              href="/"
              className="inline-block font-medium text-white bg-[#c77f56] py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden py-12 md:py-20 bg-gray-2 mt-32 md:mt-40">
      <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="bg-white shadow-1 rounded-[10px] p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CircleCheck className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-dark mb-2">
              You&apos;re registered!
            </h1>
            <p className="text-dark-5">
              Welcome, {registration.registrantInfo.fullName}. We&apos;ve sent a
              confirmation to {registration.registrantInfo.email}.
            </p>
          </div>

          <div className="border-t border-b border-gray-3 py-6 my-6">
            <h2 className="text-lg font-semibold text-dark mb-4">
              {registration.masterclass.title}
            </h2>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-dark-5">
                <Calendar className="w-4 h-4 text-[#c77f56]" />
                <span>{formatEventDate(registration.masterclass.eventDate)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-dark-5">
                <MapPin className="w-4 h-4 text-[#c77f56]" />
                <span>{registration.masterclass.location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 mb-7">
            <div className="flex justify-between text-sm">
              <span className="text-dark-5">Registration ID</span>
              <span className="font-medium text-dark">
                {registration.registrationId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-5">Payment Reference</span>
              <span className="font-medium text-dark">
                {registration.payment.paystackReference}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-5">Amount Paid</span>
              <span className="font-medium text-dark">
                ₵{registration.payment.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-[#fdf6f0] rounded-md p-4 mb-7">
            <h3 className="font-medium text-dark mb-2">What happens next?</h3>
            <p className="text-sm text-dark-5">
              We&apos;ll be in touch via WhatsApp and email with all the details
              you need closer to the event date. Save the date!
            </p>
          </div>

          <Link
            href="/"
            className="block w-full text-center font-medium text-white bg-[#c77f56] py-3.5 px-6 rounded-md ease-out duration-200 hover:bg-opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Success;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Masterclass/Success.tsx
git commit -m "feat(masterclass): add Success component"
```

---

## Task 16: Add the registration-by-id GET API and the success page route

**Files:**
- Create: `src/app/api/masterclass/registration/[id]/route.ts`
- Create: `src/app/(site)/(pages)/masterclass/success/page.tsx`

- [ ] **Step 1: Create the registration-by-id route**

```ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { masterclassRegistrationByIdQuery } from "@/sanity/groq";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Registration id is required" },
        { status: 400 },
      );
    }

    const registration = await client.fetch(masterclassRegistrationByIdQuery, {
      id,
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error("Registration fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Create the success page**

```tsx
import { Metadata } from "next";
import Success from "@/components/Masterclass/Success";

export const metadata: Metadata = {
  title: "Registration Confirmed | Vetabelle Masterclass",
  description: "Your masterclass registration was successful.",
};

export const dynamic = "force-dynamic";

export default function MasterclassSuccessPage() {
  return <Success />;
}
```

- [ ] **Step 3: Manually verify the registration-by-id endpoint**

```bash
curl http://localhost:3000/api/masterclass/registration/MC-fake-id
```

Expected: `{"success":false,"message":"Registration not found"}` with HTTP 404.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/masterclass/registration/[id]/route.ts src/app/(site)/(pages)/masterclass/success/page.tsx
git commit -m "feat(masterclass): add success page and registration GET route"
```

---

## Task 17: Build the `MasterclassPromo` homepage section

**Files:**
- Create: `src/components/Home/MasterclassPromo.tsx`

- [ ] **Step 1: Create the component**

```tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { client } from "@/sanity/client";
import { activeMasterclassQuery } from "@/sanity/groq";
import type { Masterclass } from "@/types/masterclass";
import { getPriceTier, formatEventDate } from "@/lib/masterclass";

const MasterclassPromo = async () => {
  const masterclass: Masterclass | null = await client.fetch(
    activeMasterclassQuery,
  );

  if (!masterclass) return null;

  const { tier, price } = getPriceTier(masterclass);
  const isEarlyBird = tier === "early_bird";

  return (
    <section className="py-10 md:py-14 bg-[#fdf6f0]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="bg-white rounded-[12px] shadow-1 overflow-hidden grid md:grid-cols-2">
          <div className="relative w-full aspect-[4/3] md:aspect-auto md:min-h-[320px]">
            <Image
              src={masterclass.bannerImage}
              alt={masterclass.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            {isEarlyBird && (
              <span className="inline-flex w-fit text-xs font-medium text-white bg-[#c77f56] px-2.5 py-1 rounded-full mb-3">
                Early Bird — Save ₵
                {(masterclass.regularPrice - price).toLocaleString()}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3 leading-tight">
              {masterclass.title}
            </h2>
            <div className="flex flex-col gap-1.5 mb-5 text-sm text-dark-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c77f56]" />
                <span>{formatEventDate(masterclass.eventDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c77f56]" />
                <span>{masterclass.location}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-3xl font-bold text-[#c77f56]">
                ₵{price.toLocaleString()}
              </span>
              {isEarlyBird && masterclass.regularPrice > price && (
                <span className="text-sm text-dark-5 line-through">
                  ₵{masterclass.regularPrice.toLocaleString()}
                </span>
              )}
            </div>
            <Link
              href="/masterclass"
              className="inline-block w-fit font-medium text-white bg-[#c77f56] py-3 px-7 rounded-md ease-out duration-200 hover:bg-opacity-90"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MasterclassPromo;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Home/MasterclassPromo.tsx
git commit -m "feat(home): add MasterclassPromo component"
```

---

## Task 18: Render the promo on the homepage

**Files:**
- Modify: `src/components/Home/index.tsx`

- [ ] **Step 1: Convert Home to async server component and add the promo**

`MasterclassPromo` is an async server component. `Home` currently renders client-only children (`Hero` is `"use client"`), but Next.js allows mixing — server components can render client components. Replace `src/components/Home/index.tsx` with:

```tsx
import React from "react";
import NewArrival from "./NewArrivals";
import Hero from "./Hero";
import AboutUsSection from "./AboutUsSection";
import MasterclassPromo from "./MasterclassPromo";

const Home = () => {
  return (
    <main>
      <Hero />
      {/* @ts-expect-error Async Server Component */}
      <MasterclassPromo />
      <NewArrival />
      <AboutUsSection />
    </main>
  );
};

export default Home;
```

The `@ts-expect-error` comment is needed because TypeScript hasn't fully caught up to async server components in some configurations. If `npx tsc --noEmit` shows no error there, remove the comment.

- [ ] **Step 2: Manually verify the homepage**

Visit `http://localhost:3000/`. Expected:
- The promo section appears between `Hero` and `NewArrival`.
- Banner image, title, date, location, price, and "Register Now" button visible.
- Clicking "Register Now" navigates to `/masterclass`.

Set the test masterclass `isActive` to false, refresh `/`. Expected: promo disappears entirely (returns `null`). Set back to true.

- [ ] **Step 3: Commit**

```bash
git add src/components/Home/index.tsx
git commit -m "feat(home): render MasterclassPromo on homepage"
```

---

## Task 19: Add conditional Masterclass nav link in Header

**Files:**
- Modify: `src/components/Header/index.tsx`

- [ ] **Step 1: Add active-masterclass fetch and conditional nav item**

In `src/components/Header/index.tsx`, add a new `useState` and `useEffect` to fetch the active masterclass on mount, then conditionally append a "Masterclass" item to the rendered menu. The minimal diff:

After the existing `useState` declarations near the top of the component (around line 16-19), add:

```tsx
  const [hasActiveMasterclass, setHasActiveMasterclass] = useState(false);
```

Add this `useEffect` near the existing one:

```tsx
  useEffect(() => {
    let cancelled = false;
    fetch("/api/masterclass/active")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setHasActiveMasterclass(Boolean(data?.masterclass));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
```

Build the displayed menu by appending the Masterclass item when active. Replace the `{menuData.map((menuItem, i) => (...))}` block with:

```tsx
                  {[
                    ...menuData,
                    ...(hasActiveMasterclass
                      ? [
                          {
                            id: 999,
                            title: "Masterclass",
                            newTab: false,
                            path: "/masterclass",
                          },
                        ]
                      : []),
                  ].map((menuItem, i) => (
                    <li
                      key={i}
                      className="group relative before:w-0 before:h-[3px] before:bg-[#c77f56] before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full "
                    >
                      <Link
                        href={menuItem.path}
                        onClick={closeNavigation}
                        className={`hover:text-[#c2712f] text-custom-sm font-medium text-dark flex ${
                          stickyMenu ? "xl:py-4" : "xl:py-6"
                        }`}
                      >
                        {menuItem.title}
                      </Link>
                    </li>
                  ))}
```

- [ ] **Step 2: Manually verify the nav**

Visit `http://localhost:3000/`. Expected: "Masterclass" appears in the nav (alongside Home, Shop, Wishlist, etc.). Click → goes to `/masterclass`.

In Studio, set the test masterclass `isActive` to false and publish. Refresh `/`. Expected: "Masterclass" disappears from the nav. Set back to true.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header/index.tsx
git commit -m "feat(header): conditional Masterclass nav link"
```

---

## Task 20: End-to-end manual verification

This task is verification only — no code changes.

- [ ] **Step 1: Confirm Paystack test keys are set**

Confirm `.env.local` contains valid `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` (test keys are fine; they begin with `pk_test_` and `sk_test_`). Restart dev server if you change them.

- [ ] **Step 2: Walk through the full registration flow**

1. Visit `http://localhost:3000/`. Confirm the `MasterclassPromo` is visible and "Masterclass" appears in the nav.
2. Click "Register Now" in the promo. Confirm you land on `/masterclass`.
3. Scroll. Confirm the Hero, About, "What you'll learn", and form sections are correct.
4. Fill the form with: a real email you control, a 10-digit phone number, any location, and select a value in each dropdown.
5. Click "Register & Pay ₵1,000". The Paystack popup opens.
6. In the test popup, use Paystack's test card (`4084084084084081`, any future expiry, any CVV, OTP `123456`).
7. On success, you should be redirected to `/masterclass/success?id=MC-...`.
8. Confirm the success page shows the event details, registration ID, and payment reference.

- [ ] **Step 3: Confirm registration was saved in Sanity**

Open `http://localhost:3000/admin`. Click "Masterclass Registrations". Expected: a new entry titled `<Your Name> — MC-...` with `✅ Paid` and your selected topic and tier.

- [ ] **Step 4: Test the closed-registration state**

In Studio, edit the test masterclass and set `Registration Open` to `false`. Publish. Visit `/masterclass`. Expected: the Hero still shows, but the form is replaced by "Registration is closed". Set back to `true`.

- [ ] **Step 5: Test the event-ended state**

In Studio, edit the test masterclass and set `Event Date` to a date in the past (e.g., yesterday). Publish. Visit `/masterclass`. Expected: "This event has ended". Visit `/`. Expected: the promo disappears and "Masterclass" is removed from the nav. Restore the original future date.

- [ ] **Step 6: Run typecheck and build**

```bash
npx tsc --noEmit
npm run build
```

Expected: both complete without errors.

- [ ] **Step 7: Final commit if any cleanup needed**

If you fixed anything during verification, commit it:

```bash
git add -A
git commit -m "fix(masterclass): post-verification adjustments"
```

If nothing needed fixing, skip this step.

---

## Done

Everything in the spec is implemented:
- ✅ Two Sanity schemas (`masterclass`, `masterclassRegistration`) with validation
- ✅ Active masterclass GROQ query, masterclass-by-id, registration-by-id
- ✅ TypeScript types
- ✅ Pricing tier and registration state helpers
- ✅ POST `/api/masterclass/register` with Paystack server verification and price recomputation
- ✅ GET `/api/masterclass/active` for header
- ✅ GET `/api/masterclass/registration/[id]` for success page
- ✅ `/masterclass` landing page with Hero, About, learning topics, form
- ✅ `/masterclass/success` confirmation page
- ✅ `MasterclassPromo` on homepage (auto-hides)
- ✅ Conditional Masterclass nav link
- ✅ Empty states: no active event, event ended, registration closed

# Masterclass Registration — Design Spec

**Date:** 2026-04-22
**Status:** Approved (pending spec review)
**Author:** Alfred Apenteng (with Claude)

## Summary

Add a paid event-registration feature to the Vetabelle site for the Vetabelle Mentorship & Masterclass. Replaces the current Google Form + manual mobile-money flow. Uses the existing Paystack integration for payment, Sanity for event content and registration storage, and is promoted from the homepage with a dedicated landing page at `/masterclass`.

## Goals

- Let visitors register and pay for the masterclass in one flow on the site.
- Drop the Google Form's manual payment-screenshot step — Paystack confirms payment server-side.
- Let Betty manage the event (dates, prices, copy, banner) and the registrant list from Sanity Studio without code changes.
- Promote the active event from the homepage and the main nav, auto-hiding once the event passes.

## Non-Goals

- No custom admin dashboard. Registrations are viewed in Sanity Studio (CSV export from there if needed).
- No automated confirmation emails or WhatsApp messages on registration. Out of scope for v1.
- No discount codes, group registrations, or partial payments.
- No calendar invite (`.ics`) generation.
- No live capacity/seat management beyond a manual "Registration Open" toggle.

## User Flow

1. Visitor lands on the homepage `/` and sees the `MasterclassPromo` section (banner image, event name, date, current price, "Register Now" button).
2. Clicks through to `/masterclass`. Reads the event description, what they'll learn, etc.
3. Fills the inline registration form (7 fields).
4. Clicks "Register & Pay GHS X". Paystack popup opens (existing `@paystack/inline-js` integration, card + mobile money channels).
5. On successful payment:
   - Client calls `POST /api/masterclass/register` with form data + Paystack reference.
   - Server verifies the Paystack transaction (reusing the verification pattern from `/api/payments/verify`).
   - Server creates a `masterclassRegistration` document in Sanity.
   - Client redirects to `/masterclass/success?id=<registrationId>`.
6. Success page confirms registration, shows event details, payment reference, and what happens next (e.g., "We'll be in touch via WhatsApp").

## Data Model (Sanity Schemas)

### `masterclass`

The event itself. Multiple documents allowed (one per event); exactly one is marked `isActive` at any time.

| Field | Type | Notes |
|---|---|---|
| `title` | string, required | e.g., "Vetabelle Mentorship & Masterclass" |
| `slug` | slug, required | Source: title |
| `eventDate` | datetime, required | Used for "event has passed" logic |
| `location` | string, required | e.g., "Accra, Ghana" or "Online" |
| `bannerImage` | image, required | The pink/cream banner with Betty's photo |
| `description` | array of blocks (portable text) | Rich event description for the landing page |
| `learningTopics` | array of strings | Options for "What would you like to learn?" |
| `audienceTypes` | array of strings | Options for "What best describes you?" |
| `referralSources` | array of strings | Options for "Where did you hear about this program?" |
| `regularPrice` | number, required | GHS, e.g., 1500 |
| `earlyBirdPrice` | number | GHS, e.g., 1000. If unset, only `regularPrice` applies. |
| `earlyBirdDeadline` | datetime | Required if `earlyBirdPrice` set |
| `registrationOpen` | boolean, required, default true | Manual kill switch |
| `registrationDeadline` | datetime | Optional. If unset, registration runs until `eventDate`. |
| `isActive` | boolean, required, default false | Only the doc with `isActive === true` is shown on the site |

**Validation rules:**
- If `earlyBirdPrice` is set, `earlyBirdDeadline` must also be set.
- `earlyBirdDeadline` must be before `eventDate`.
- `registrationDeadline` (if set) must be before or equal to `eventDate`.
- Studio convention: only one document should have `isActive === true`. We don't enforce uniqueness in the schema (Sanity makes that awkward); a soft-warning preview label is enough. The site query picks the most recently updated active doc as a tiebreak.

**Studio preview:** `"<title> — <eventDate, formatted> — <Active/Inactive>"`.

### `masterclassRegistration`

One document per signup.

| Field | Type | Notes |
|---|---|---|
| `registrationId` | string, required, readOnly | e.g., `MC-1714000000000-AB12CD` |
| `masterclass` | reference to `masterclass`, required | |
| `registrantInfo` | object | `fullName`, `phone`, `email`, `location` (all required strings) |
| `preferences` | object | `topicToLearn`, `audienceType`, `referralSource` (strings — values must come from the parent masterclass arrays, but stored as plain strings so renaming options later doesn't orphan old registrations) |
| `payment` | object | `status` (`pending`/`paid`/`failed`), `paystackReference`, `amount` (number, GHS), `priceTier` (`early_bird`/`regular`), `paidAt` (datetime) |
| `createdAt` | datetime, required | Defaults to now |

**Studio preview:** `"<fullName> — <topicToLearn> — <priceTier> — <status emoji>"`. Orderings: latest first, oldest first.

## Routes & Components

### Routes

| Route | Purpose |
|---|---|
| `/masterclass` | Landing page (hero, description, form). |
| `/masterclass/success?id=<registrationId>` | Post-payment confirmation page. |
| `POST /api/masterclass/register` | Verifies Paystack payment, creates registration in Sanity. |

### Components

All under `src/components/Masterclass/` unless noted:

- `index.tsx` — page-level orchestrator. Fetches active masterclass on the server, renders Hero / About / RegistrationForm or empty/closed/ended states.
- `Hero.tsx` — banner image, title, date, location, sticky `PriceCard`.
- `PriceCard.tsx` — shows current tier and price; if early bird, displays "Ends in N days".
- `RegistrationForm.tsx` — client component, owns form state and Paystack popup orchestration.
- `Success.tsx` — rendered by `/masterclass/success` page.
- `EmptyStates.tsx` — `NoActiveEvent`, `EventEnded`, `RegistrationClosed`.

Homepage promo:
- `src/components/Home/MasterclassPromo.tsx` — slim-to-medium section. Renders only when an active, upcoming masterclass exists.

Header:
- Edit `src/components/Header/menuData.ts` to support a conditional "Masterclass" item.
- Edit `src/components/Header/index.tsx` (or wherever `menuData` is consumed) to fetch the active-masterclass flag and filter the menu accordingly. Decision: do this via a small server component wrapper or context populated at the layout level — see Implementation Notes.

### Sanity queries

Add to `src/sanity/groq.ts`:

```groq
// Active, upcoming masterclass (for homepage promo, nav, /masterclass)
*[_type == "masterclass" && isActive == true && eventDate > now()] | order(_updatedAt desc)[0]

// Single masterclass by slug (if needed for archive in future)
*[_type == "masterclass" && slug.current == $slug][0]

// Registration by id (for success page / admin lookups)
*[_type == "masterclassRegistration" && registrationId == $id][0]{
  ...,
  masterclass->{title, eventDate, location}
}
```

## Business Logic

All price and visibility decisions are derived **server-side** from the Sanity document and `Date.now()`. The client never sets the price; it's recomputed on the server during the API call to prevent tampering.

```ts
function getPriceTier(masterclass, now = new Date()) {
  if (!masterclass.earlyBirdPrice || !masterclass.earlyBirdDeadline) {
    return { tier: "regular", price: masterclass.regularPrice };
  }
  const isEarlyBird = now < new Date(masterclass.earlyBirdDeadline);
  return isEarlyBird
    ? { tier: "early_bird", price: masterclass.earlyBirdPrice }
    : { tier: "regular", price: masterclass.regularPrice };
}

function getRegistrationState(masterclass, now = new Date()) {
  const eventDate = new Date(masterclass.eventDate);
  if (now > eventDate) return "ended";
  if (!masterclass.registrationOpen) return "closed";
  const deadline = masterclass.registrationDeadline
    ? new Date(masterclass.registrationDeadline)
    : eventDate;
  if (now > deadline) return "closed";
  return "open";
}
```

### Page state matrix

| Condition | What page renders |
|---|---|
| No `isActive` masterclass exists | `NoActiveEvent` |
| Event has passed | `EventEnded` |
| `registrationOpen === false` or past `registrationDeadline` | Hero + description, form replaced by `RegistrationClosed` |
| Otherwise | Full landing page with form |

### Homepage promo + nav visibility

- Promo and nav link render only when there is an active masterclass with `eventDate` in the future. (We don't gate on `registrationOpen` — even with registration closed, promoting the event is fine as long as it's upcoming.)

## API: `POST /api/masterclass/register`

### Request body

```ts
{
  masterclassId: string;        // Sanity _id of the masterclass doc
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

### Server steps

1. Validate body shape and required fields. Reject with 400 on any missing field.
2. Verify the Paystack transaction by calling `https://api.paystack.co/transaction/verify/<reference>` with the secret key (mirrors `/api/payments/verify`).
3. Fetch the masterclass document from Sanity by `masterclassId`. Reject with 404 if not found or not `isActive`.
4. Recompute the expected price using `getPriceTier(masterclass, paidAtFromPaystack)`. Convert Paystack's pesewas amount to GHS and compare. If they don't match, log a warning and reject with 400 — do not silently accept a wrong amount.
5. Generate `registrationId` (`MC-<timestamp>-<random6>`).
6. Create the `masterclassRegistration` document in Sanity with `payment.status = "paid"`, `priceTier`, `amount`, `paystackReference`, `paidAt`.
7. Return `{ success: true, registrationId }`.

### Failure modes

| Case | Response |
|---|---|
| Missing/invalid body | 400 with `message` |
| Paystack verify fails or status != `success` | 400 with `message` |
| Masterclass not found / not active | 404 |
| Price mismatch | 400 — registrant should contact support; payment is on Paystack record |
| Sanity write fails | 500 — registrant has paid; surface a clear "Payment received but registration save failed, contact support with reference X" message on the client |

The client-side success handler in `RegistrationForm` mirrors the Checkout component's existing pattern: on a 500 after Paystack succeeds, show the user the Paystack reference and a support contact, do **not** silently lose the registration.

## Visual / UX

- Use the existing brand color `#c77f56` for primary CTAs and accents.
- Reuse the design language of Checkout (rounded-md inputs, `bg-white shadow-1`, `text-dark`/`text-dark-5` palette).
- Hero: banner image left, content right on desktop; stacked on mobile.
- `PriceCard` is sticky on desktop scroll within the hero region (best-effort, not critical).
- Homepage promo: roughly 320–400px tall, banner image on one side, copy + CTA on the other. Default placement: directly under the homepage hero, above the next product/category section. Easy to move later if it doesn't feel right in review.

## Environment & Dependencies

No new environment variables. No new npm packages. Reuses:

- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY` — Paystack
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` — Sanity (token must have write access for the registration insert)
- `@paystack/inline-js`, `@sanity/client`, `next-sanity` — already present
- `react-spinners`, `lucide-react` — already present, used for loading and icons

## Implementation Notes

- Schema files: `src/sanity/schemas/masterclass.ts` and `src/sanity/schemas/masterclassRegistration.ts`. Register both in `src/sanity/schemas/index.ts`.
- The active-masterclass query result needs to be available to the Header to conditionally show the nav link. Cleanest path: fetch it in `src/app/(site)/layout.tsx` (server component) and pass down via a context or props. Implementation can settle this in the plan.
- Reuse `lib/paystack.ts` (`initializePaystackPayment`, `generatePaymentReference`) — no changes needed beyond passing a different metadata payload.
- TypeScript types for the new docs go in `src/types/` alongside existing types.
- Keep the API verification logic shared with `/api/payments/verify` if the duplication starts to bite — for v1, a small targeted copy is fine since the responses differ.

## Open Questions

None at design time. Implementation-time decisions (homepage section placement, Header context vs. props) are noted above.

import { createHash } from "node:crypto";
import { getPriceTier, generateRegistrationId } from "@/lib/masterclass";
import type { Masterclass } from "@/types/masterclass";

// Deterministic, per-payment document id. Both the browser-triggered register
// route and the Paystack webhook use this so the same payment can only ever
// produce ONE registration document (createIfNotExists is a no-op the 2nd time).
export function getRegistrationDocumentId(paystackReference: string): string {
  const hash = createHash("sha256").update(paystackReference).digest("hex");
  return `masterclass-registration-${hash}`;
}

type RegistrantInfo = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
};
type Preferences = {
  topicToLearn: string;
  audienceType: string;
  referralSource: string;
};

// Builds the Sanity registration document from a verified payment. priceTier is
// derived from the masterclass pricing at the time the payment was made.
export function buildRegistrationDoc(params: {
  masterclass: Pick<
    Masterclass,
    "_id" | "regularPrice" | "earlyBirdPrice" | "earlyBirdDeadline"
  >;
  paystackReference: string;
  paidAmountGhs: number;
  paidAtIso: string;
  registrantInfo: RegistrantInfo;
  preferences: Preferences;
}) {
  const { tier } = getPriceTier(params.masterclass, new Date(params.paidAtIso));
  return {
    _id: getRegistrationDocumentId(params.paystackReference),
    _type: "masterclassRegistration" as const,
    registrationId: generateRegistrationId(),
    masterclass: { _ref: params.masterclass._id, _type: "reference" as const },
    registrantInfo: params.registrantInfo,
    preferences: params.preferences,
    payment: {
      status: "paid" as const,
      paystackReference: params.paystackReference,
      amount: params.paidAmountGhs,
      priceTier: tier,
      paidAt: params.paidAtIso,
    },
    createdAt: new Date().toISOString(),
  };
}

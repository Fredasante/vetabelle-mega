export type PriceTier = "early_bird" | "regular";
export type PaymentStatus = "pending" | "paid" | "confirmed" | "failed";
export type RegistrationState = "open" | "closed" | "ended";

export interface Masterclass {
  _id: string;
  title: string;
  slug: { current: string };
  eventDate: string;
  location: string;
  bannerImage: string;
  description: any[];
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

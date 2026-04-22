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

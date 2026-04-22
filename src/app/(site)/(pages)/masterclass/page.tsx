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

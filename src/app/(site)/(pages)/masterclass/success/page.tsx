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

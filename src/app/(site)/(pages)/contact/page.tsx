import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Vetabelle",
  description:
    "Reach out to Vetabelle for inquiries, appointments, or product information. We’re here to support your pet’s well-being and answer all your questions.",
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;

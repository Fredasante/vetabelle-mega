import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Bend the Trendd",
  description:
    "Get in touch with Bend the Trendd for inquiries, orders, or support. We'd love to hear from you!",
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;

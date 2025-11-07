import AboutUs from "@/components/AboutUs/AboutUs";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Vetabelle",
  description:
    "Learn about Vetabelle — a wellness brand empowering women through beauty, confidence, and self-care. Discover how our high-quality supplements promote glowing skin, healthy hair, and overall well-being.",
};

const AboutUsPage = () => {
  return (
    <main>
      <AboutUs />
    </main>
  );
};

export default AboutUsPage;

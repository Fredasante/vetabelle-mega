import AboutUs from "@/components/AboutUs/AboutUs";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Bend the Trendd",
  description:
    "Discover Bend the Trendd — your go-to fashion destination offering trendy, affordable, and high-quality styles for every occasion.",
};

const AboutUsPage = () => {
  return (
    <main>
      <AboutUs />
    </main>
  );
};

export default AboutUsPage;

import React, { Suspense } from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { Metadata } from "next";
import LoadingFallback from "@/components/Common/LoadingFallback";

export const metadata: Metadata = {
  title: "Shop | Vetabelle",
  description:
    "Shop premium beauty and wellness supplements from Vetabelle. Discover science-backed formulas with Collagen, Biotin, and Keratin to enhance your natural beauty from within.",
  keywords: [
    "Vetabelle",
    "Beauty Supplements",
    "Collagen",
    "Biotin",
    "Keratin",
    "Hair Skin Nails",
    "Wellness Products",
    "Women's Health",
    "Beauty from Within",
  ],
  openGraph: {
    title: "Shop | Vetabelle",
    description:
      "Explore Vetabelle's premium range of beauty and wellness supplements formulated to support glowing skin, luscious hair, and strong nails. Beauty begins within.",
    url: "https://vetabelle.com/shop",
    siteName: "Vetabelle",
    type: "website",
  },
};

const ShopPage = () => {
  return (
    <main>
      <Suspense fallback={<LoadingFallback />}>
        <ShopWithSidebar />
      </Suspense>
    </main>
  );
};

export default ShopPage;

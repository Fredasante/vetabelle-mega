import React, { Suspense } from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { Metadata } from "next";
import LoadingFallback from "@/components/Common/LoadingFallback";

export const metadata: Metadata = {
  title: "Shop | Bend The Trendd",
  description:
    "Discover the latest fashion, sneakers, slippers, and gadgets at Bend The Trendd. Shop our exclusive collection of stylish products at great prices.",
  keywords: [
    "Bend The Trendd",
    "Online Shop",
    "Fashion",
    "Sneakers",
    "Clothing",
    "Women's Fashion",
    "Affordable Fashion Ghana",
  ],
  openGraph: {
    title: "Shop | Bend The Trendd",
    description:
      "Explore trendy clothing, sneakers, slippers, and more — only at Bend The Trend.",
    url: "https://bendthetrendd.com/shop",
    siteName: "Bend The Trendd",
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

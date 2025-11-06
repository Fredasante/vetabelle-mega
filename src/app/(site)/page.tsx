import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bend the Trendd | Fashion & Lifestyle Ecommerce",
  description:
    "Discover the latest fashion, lifestyle, and trendsetting products at Bend the Trendd. Shop quality apparel, accessories, and more with seamless online shopping.",
  keywords: [
    "Bend the Trendd",
    "fashion ecommerce",
    "online clothing store",
    "lifestyle products",
    "trendy outfits",
  ],
  authors: [{ name: "Bend the Trendd" }],
  openGraph: {
    title: "Bend the Trendd | Fashion & Lifestyle Ecommerce",
    description:
      "Shop the latest trends in fashion and lifestyle at Bend the Trendd. Quality apparel and accessories made for you.",
    url: "https://bendthetrendd.com",
    siteName: "Bend the Trendd",
    images: [
      {
        url: "/bend-the-trendd-logo.png",
        width: 1200,
        height: 630,
        alt: "Bend the Trendd Ecommerce Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function HomePage() {
  return <Home />;
}

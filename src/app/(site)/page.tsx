import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vetabelle | Wellness & Beauty Supplements for Women",
  description:
    "Vetabelle is a wellness brand dedicated to empowering women through beauty, confidence, and self-care. Explore our high-quality supplements made with Collagen, Biotin, and Keratin to enhance your natural beauty from within.",
  keywords: [
    "Vetabelle",
    "beauty supplements",
    "women wellness",
    "collagen supplements",
    "biotin for hair growth",
    "keratin for nails",
    "skin care vitamins",
    "inner beauty",
  ],
  authors: [{ name: "Vetabelle" }],
  openGraph: {
    title: "Vetabelle | Wellness & Beauty Supplements for Women",
    description:
      "Discover Vetabelle — your trusted wellness brand for glowing skin, healthy hair, and strong nails. Beauty starts from within!",
    url: "https://vetabelle.com",
    siteName: "Vetabelle",
    images: [
      {
        url: "/vetabelle-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Vetabelle Wellness & Beauty Supplements",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function HomePage() {
  return <Home />;
}

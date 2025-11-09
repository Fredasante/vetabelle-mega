import React from "react";
import { Wishlist } from "@/components/Wishlist";

export const metadata = {
  title: "Wishlist | Vetabelle",
  description:
    "View and manage your saved products in your Vetabelle wishlist.",
  robots: "noindex, nofollow",
};

const WishlistPage = () => {
  return (
    <main>
      <Wishlist />
    </main>
  );
};

export default WishlistPage;

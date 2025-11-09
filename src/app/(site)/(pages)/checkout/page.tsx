import React from "react";
import Checkout from "@/components/Checkout";

export const metadata = {
  title: "Checkout | Vetabelle",
  description: "Complete your purchase securely at Vetabelle.",
  robots: "noindex, nofollow",
};

const CheckoutPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;

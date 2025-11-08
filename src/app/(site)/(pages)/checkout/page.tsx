import React from "react";
import Checkout from "@/components/Checkout";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Vetabelle",
  description:
    "Complete your Vetabelle purchase securely and effortlessly. Review your wellness supplements and finalize your order for radiant beauty and confidence.",
};

const CheckoutPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;

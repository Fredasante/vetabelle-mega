import React from "react";
import Cart from "@/components/Cart";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | Vetabelle",
  description:
    "Review and manage the wellness supplements in your Vetabelle cart before completing your purchase.",
};

const CartPage = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;

import React from "react";
import Cart from "@/components/Cart";

export const metadata = {
  title: "Cart | Vetabelle",
  description: "View and manage the items in your shopping cart on Vetabelle.",
  robots: "noindex, nofollow",
};

const CartPage = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;

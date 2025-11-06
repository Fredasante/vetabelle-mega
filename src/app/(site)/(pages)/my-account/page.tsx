import MyAccount from "@/components/MyAccount";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Bend the Trendd",
  description:
    "Access and manage your Bend the Trendd account. Track orders, update your details, and view your purchase history all in one place.",
};

const MyAccountPage = () => {
  return (
    <main>
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;

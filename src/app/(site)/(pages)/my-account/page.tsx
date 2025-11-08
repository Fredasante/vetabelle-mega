import MyAccount from "@/components/MyAccount";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Account | Vetabelle",
  description:
    "Access and manage your Vetabelle account. Track your wellness orders, update personal details, and view your supplement purchase history with ease.",
};

const MyAccountPage = () => {
  return (
    <main>
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;

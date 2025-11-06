import Signin from "@/components/Auth/Signin";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Bend the Trendd",
  description:
    "Access your Bend the Trendd account to track orders, manage your wishlist, and enjoy a personalized shopping experience.",
};

const SigninPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default SigninPage;

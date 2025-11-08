import Signin from "@/components/Auth/Signin";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Vetabelle",
  description:
    "Sign In to your Vetabelle account to manage your orders, track deliveries, and enjoy a personalized wellness shopping experience.",
};

const SigninPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default SigninPage;

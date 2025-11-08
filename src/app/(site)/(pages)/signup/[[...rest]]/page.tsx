import Signup from "@/components/Auth/Signup";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Vetabelle",
  description:
    "Sign Up to your Vetabelle account to manage your orders, track deliveries, and enjoy a personalized wellness shopping experience.",
};

const SignupPage = () => {
  return (
    <main>
      <Signup />
    </main>
  );
};

export default SignupPage;

import Signin from "@/components/Auth/Signin";
import React from "react";

export const metadata = {
  title: "Sign In | Vetabelle",
  description: "Access your Vetabelle account to manage orders and wishlist.",
  robots: "noindex, nofollow",
};

const SigninPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default SigninPage;

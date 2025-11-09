import Signup from "@/components/Auth/Signup";
import React from "react";

export const metadata = {
  title: "Sign Up | Vetabelle",
  description:
    "Create your Vetabelle account to start shopping and manage your orders.",
  robots: "noindex, nofollow",
};

const SignupPage = () => {
  return (
    <main>
      <Signup />
    </main>
  );
};

export default SignupPage;

"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="mt-45 mb-5 md:mt-50 md:mb-10 lg:mb-15 ml-5">
      <div className="w-full max-w-md mx-auto">
        <SignIn path="/signin" routing="path" signUpUrl="/signup" />
      </div>
    </div>
  );
}

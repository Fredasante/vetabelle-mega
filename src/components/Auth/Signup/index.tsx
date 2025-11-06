"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="mt-45 mb-5 md:mt-50 md:mb-10 lg:mb-15 ml-5">
      <div className="w-full max-w-md mx-auto">
        <SignUp path="/signup" routing="path" signInUrl="/signin" />
      </div>
    </main>
  );
}

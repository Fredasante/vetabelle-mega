"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CircleCheck, Calendar, MapPin } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { formatEventDate } from "@/lib/masterclass";

interface RegistrationDetails {
  registrationId: string;
  masterclass: {
    title: string;
    eventDate: string;
    location: string;
  };
  registrantInfo: {
    fullName: string;
    email: string;
  };
  payment: {
    amount: number;
    paystackReference: string;
    priceTier: string;
  };
}

const Success: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [registration, setRegistration] = useState<RegistrationDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }
    const load = async () => {
      try {
        const res = await fetch(`/api/masterclass/registration/${id}`);
        const data = await res.json();
        if (!res.ok || !data.registration) {
          throw new Error(data?.message || "Registration not found");
        }
        setRegistration(data.registration);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load registration");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  if (loading) {
    return (
      <section className="overflow-hidden py-20 bg-gray-2 mt-32 md:mt-40">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex justify-center items-center min-h-[300px]">
            <ClipLoader size={32} color="#c77f56" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !registration) {
    return (
      <section className="overflow-hidden py-20 bg-gray-2 mt-32 md:mt-40">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
            <h2 className="text-2xl font-semibold text-dark mb-3">
              We couldn&apos;t load your registration
            </h2>
            <p className="text-dark-5 mb-7">
              {error || "Please contact support with your payment reference."}
            </p>
            <Link
              href="/"
              className="inline-block font-medium text-white bg-[#c77f56] py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden py-12 md:py-20 bg-gray-2 mt-32 md:mt-40">
      <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="bg-white shadow-1 rounded-[10px] p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CircleCheck className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-dark mb-2">
              You&apos;re registered!
            </h1>
            <p className="text-dark-5">
              Welcome, {registration.registrantInfo.fullName}. We&apos;ve sent a
              confirmation to {registration.registrantInfo.email}.
            </p>
          </div>

          <div className="border-t border-b border-gray-3 py-6 my-6">
            <h2 className="text-lg font-semibold text-dark mb-4">
              {registration.masterclass.title}
            </h2>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-dark-5">
                <Calendar className="w-4 h-4 text-[#c77f56]" />
                <span>{formatEventDate(registration.masterclass.eventDate)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-dark-5">
                <MapPin className="w-4 h-4 text-[#c77f56]" />
                <span>{registration.masterclass.location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 mb-7">
            <div className="flex justify-between text-sm">
              <span className="text-dark-5">Registration ID</span>
              <span className="font-medium text-dark">
                {registration.registrationId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-5">Payment Reference</span>
              <span className="font-medium text-dark">
                {registration.payment.paystackReference}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-5">Amount Paid</span>
              <span className="font-medium text-dark">
                ₵{registration.payment.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-[#fdf6f0] rounded-md p-4 mb-7">
            <h3 className="font-medium text-dark mb-2">What happens next?</h3>
            <p className="text-sm text-dark-5">
              We&apos;ll be in touch via WhatsApp and email with all the details
              you need closer to the event date. Save the date!
            </p>
          </div>

          <Link
            href="/"
            className="block w-full text-center font-medium text-white bg-[#c77f56] py-3.5 px-6 rounded-md ease-out duration-200 hover:bg-opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Success;

"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CircleCheck,
  Calendar,
  MapPin,
  User,
  Mail,
  Receipt,
} from "lucide-react";
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
      <section className="overflow-hidden mt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 rounded-lg">
          <div className="flex justify-center items-center min-h-[400px]">
            <ClipLoader size={32} color="#c77f56" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !registration) {
    return (
      <section className="overflow-hidden mt-45 mb-5 md:mt-50 md:mb-10 lg:mb-15">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0 bg-gray-2 rounded-lg">
          <div className="shadow-1 rounded-[10px] p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Unable to Load Registration
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "Registration not found"}
            </p>
            <Link
              href="/"
              className="inline-block font-medium text-white bg-[#c77f56] py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden py-5 md:py-10 lg:py-12 bg-gray-2 mt-45 mb-5 md:mt-50 md:mb-10 lg:mb-15">
      <div className="max-w-[900px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Success Banner */}
        <div className="bg-white shadow-1 rounded-[10px] p-6 sm:p-10 mb-7.5 text-center">
          <div className="w-20 h-20 bg-green-light-6 rounded-full flex items-center justify-center mx-auto mb-5">
            <CircleCheck className="w-12 h-12 text-green-dark" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-3">
            Registration Confirmed! 🎉
          </h1>
          <p className="text-gray-600 mb-2">
            Welcome, {registration.registrantInfo.fullName}! We&apos;ve received
            your payment and sent a confirmation to{" "}
            {registration.registrantInfo.email}.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Registration ID:{" "}
            <span className="font-mono font-semibold text-[#c77f56]">
              {registration.registrationId}
            </span>
          </p>
          {registration.payment.paystackReference && (
            <p className="text-xs text-gray-500 mt-1">
              Payment Reference:{" "}
              <span className="font-mono">
                {registration.payment.paystackReference}
              </span>
            </p>
          )}
        </div>

        {/* Event Details */}
        <div className="bg-white shadow-1 rounded-[10px] p-6 sm:p-8 mb-7.5">
          <h2 className="text-xl font-semibold text-dark mb-5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#c77f56]" />
            Event Details
          </h2>

          <div className="space-y-4 mb-6">
            <div className="pb-4 border-b border-gray-3">
              <p className="font-medium text-dark text-lg">
                {registration.masterclass.title}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-dark mb-1">Date &amp; Time</p>
                <p className="text-sm text-gray-600">
                  {formatEventDate(registration.masterclass.eventDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-dark mb-1">Location</p>
                <p className="text-sm text-gray-600">
                  {registration.masterclass.location}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-2 pt-4 border-t border-gray-3">
            {registration.payment.priceTier && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price Tier</span>
                <span className="text-dark capitalize">
                  {registration.payment.priceTier.replace(/[-_]/g, " ")}
                </span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-3">
              <span className="text-dark">Total Paid</span>
              <span className="text-[#c77f56]">
                ₵{registration.payment.amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Registrant Information */}
        <div className="bg-white shadow-1 rounded-[10px] p-6 sm:p-8 mb-7.5">
          <h2 className="text-xl font-semibold text-dark mb-5 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#c77f56]" />
            Registrant Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-dark mb-1">Full Name</p>
                <p className="text-sm text-gray-600">
                  {registration.registrantInfo.fullName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-dark mb-1">Email</p>
                <p className="text-sm text-gray-600">
                  {registration.registrantInfo.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-[#fdf6f0] border border-[#f0d9c4] rounded-[10px] p-6 mb-7.5">
          <h3 className="font-semibold text-dark mb-3">What happens next?</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-[#c77f56] font-semibold">1.</span>
              <span>
                You&apos;ll receive a confirmation email with all the details
                you need
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#c77f56] font-semibold">2.</span>
              <span>
                We&apos;ll be in touch via WhatsApp and email closer to the
                event date with reminders and instructions
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#c77f56] font-semibold">3.</span>
              <span>Save the date and we&apos;ll see you there!</span>
            </li>
          </ol>
        </div>

        {/* Support Section */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Have questions about your registration?
          </p>
          <a
            href="https://wa.me/233548182872"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green hover:text-green-dark font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Success;

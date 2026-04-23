"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { CircleCheck } from "lucide-react";
import {
  initializePaystackPayment,
  generatePaymentReference,
} from "@/lib/paystack";
import { getPriceTier } from "@/lib/masterclass";
import type { Masterclass } from "@/types/masterclass";

interface RegistrationFormProps {
  masterclass: Masterclass;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ masterclass }) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { price, tier } = getPriceTier(masterclass);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);

    const registrantInfo = {
      fullName: (formData.get("fullName") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      email: (formData.get("email") as string).trim(),
      location: (formData.get("location") as string).trim(),
    };
    const preferences = {
      topicToLearn: formData.get("topicToLearn") as string,
      audienceType: formData.get("audienceType") as string,
      referralSource: formData.get("referralSource") as string,
    };

    const paystackReference = generatePaymentReference(
      `MC-${masterclass.slug.current}`,
    );

    try {
      initializePaystackPayment({
        email: registrantInfo.email,
        amount: price,
        reference: paystackReference,
        metadata: {
          orderId: paystackReference,
          customerName: registrantInfo.fullName,
          phone: registrantInfo.phone,
          items: [
            {
              title: masterclass.title,
              quantity: 1,
              price,
              tier,
            },
          ],
        },
        onSuccess: async (transaction) => {
          try {
            const response = await fetch("/api/masterclass/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                masterclassId: masterclass._id,
                paystackReference: transaction.reference,
                registrantInfo,
                preferences,
              }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
              throw new Error(
                data?.message ||
                  "Payment received but registration failed. Please contact support.",
              );
            }

            router.push(`/masterclass/success?id=${data.registrationId}`);
          } catch (err) {
            console.error("Post-payment registration error:", err);
            setErrorMessage(
              `Payment successful, but we couldn't save your registration. Please contact support with reference: ${transaction.reference}`,
            );
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setIsProcessing(false);
          setErrorMessage("Payment was cancelled. Your registration was not completed.");
        },
      });
    } catch (err) {
      console.error("Paystack init error:", err);
      setErrorMessage("Could not start payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form
      id="register"
      onSubmit={handleSubmit}
      className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8"
    >
      <h2 className="text-2xl font-semibold text-dark mb-1">Register Now</h2>
      <p className="text-dark-5 mb-7">
        Fill in your details and pay securely via card or mobile money.
      </p>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="fullName" className="block mb-2.5">
            Full Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            required
            placeholder="Enter your full name"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-2.5">
            Phone Number <span className="text-red">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            pattern="[0-9]{10}"
            placeholder="024 123 4567"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="email" className="block mb-2.5">
            Email Address <span className="text-red">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="your.email@example.com"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          <p className="text-xs text-gray-600 mt-1.5">
            For payment receipt and event updates
          </p>
        </div>
        <div>
          <label htmlFor="location" className="block mb-2.5">
            Location (Area / City) <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            placeholder="e.g., East Legon, Accra"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="topicToLearn" className="block mb-2.5">
          What would you like to learn? <span className="text-red">*</span>
        </label>
        <select
          name="topicToLearn"
          id="topicToLearn"
          required
          defaultValue=""
          className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        >
          <option value="" disabled>
            Select a topic
          </option>
          {masterclass.learningTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label htmlFor="audienceType" className="block mb-2.5">
          What best describes you? <span className="text-red">*</span>
        </label>
        <select
          name="audienceType"
          id="audienceType"
          required
          defaultValue=""
          className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        >
          <option value="" disabled>
            Select one
          </option>
          {masterclass.audienceTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-7">
        <label htmlFor="referralSource" className="block mb-2.5">
          Where did you hear about this program? <span className="text-red">*</span>
        </label>
        <select
          name="referralSource"
          id="referralSource"
          required
          defaultValue=""
          className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        >
          <option value="" disabled>
            Select source
          </option>
          {masterclass.referralSources.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full flex justify-center items-center gap-2 font-medium text-white bg-[#c2712f] py-3.5 px-6 rounded-md ease-out duration-200 hover:bg-[#b96e48] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <ClipLoader size={20} color="#ffffff" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CircleCheck className="w-4 h-4" />
            <span>Register & Pay ₵{price.toLocaleString()}</span>
          </>
        )}
      </button>

      <p className="text-xs text-center text-gray-600 mt-4">
        🔒 Secure payment via Paystack • Card or Mobile Money
      </p>
    </form>
  );
};

export default RegistrationForm;

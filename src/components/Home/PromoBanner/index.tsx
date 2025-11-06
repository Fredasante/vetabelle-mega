"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function DiscountBanner() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("SAVE50");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-5 lg:pt-0">
      <div className="bg-blue-50 w-full h-full absolute top-0 left-0"></div>
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 relative">
        <a
          href="#"
          className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-dark bg-gray-1 shadow-md rounded-full"
        >
          <span className="text-xs bg-blue rounded-full text-white px-4 py-1.5 me-3">
            LIMITED
          </span>
          <span className="text-sm font-medium">
            Special discount available for a limited time!
          </span>
          <svg
            className="w-2.5 h-2.5 ms-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </a>

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl">
          Save Big on Your Purchase
        </h1>

        <p className="mb-8 md:text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48">
          Use the exclusive code below at checkout and get an instant discount
          on your order. Dont miss out on this amazing offer!
        </p>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-blue rounded-2xl p-6 shadow-2xl">
            <p className="text-white text-sm font-semibold mb-2 uppercase tracking-wide">
              Your Discount Code
            </p>
            <div className="bg-white rounded-xl px-6 py-4 mb-3 flex items-center justify-between">
              <p className="text-3xl md:text-4xl font-bold font-mono text-blue-600">
                SAVE50
              </p>
              <button
                onClick={copyToClipboard}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <Copy className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
            <p className="text-white text-xs opacity-90">
              Apply this code during checkout to receive your discount
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

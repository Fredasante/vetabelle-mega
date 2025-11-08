import React from "react";
import Breadcrumb from "../Common/Breadcrumb";

const AboutUs = () => {
  return (
    <>
      <section className="overflow-hidden py-10 bg-gray-2 mt-45 md:mt-50 md:pb-10 lg:pb-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-2xl md:text-4xl text-dark mb-5">
              Welcome to Vetabelle
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your trusted partner in beauty and wellness — offering
              premium-quality supplements designed to enhance your natural glow
              from the inside out. Because true beauty begins within.
            </p>
          </div>

          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Our Mission Card */}
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">Our Mission</p>
              </div>

              <div className="p-4 sm:p-7.5">
                <div className="flex flex-col gap-4">
                  <p className="text-gray-600">
                    At Vetabelle, our mission is to empower women by nurturing
                    their inner strength, confidence, and natural beauty through
                    science-backed wellness products that support holistic
                    health.
                  </p>

                  <div className="flex items-start gap-3 mt-4">
                    <svg
                      className="mt-1 shrink-0"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
                        fill="#14b8a6"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <strong className="text-dark">Science-Backed:</strong>{" "}
                      Every formula is carefully developed with proven
                      ingredients like Biotin, Collagen, and Keratin.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-1 shrink-0"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
                        fill="#14b8a6"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <strong className="text-dark">Holistic Beauty:</strong>{" "}
                      Supporting radiant skin, strong nails, luscious hair, and
                      a resilient immune system.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-1 shrink-0"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
                        fill="#14b8a6"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <strong className="text-dark">Empowerment:</strong> We
                      believe when women feel good inside, they shine with
                      confidence outside.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <h2 className="font-bold text-2xl text-dark mb-6">
                The Vetabelle Difference
              </h2>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-semibold text-lg text-dark mb-2">
                    Beauty from Within
                  </h3>
                  <p className="text-gray-600">
                    We believe beauty begins beneath the surface. That&apos;s
                    why our formulas combine essential nutrients that work
                    synergistically to nourish your skin, hair, and nails from
                    within.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-dark mb-2">
                    Backed by Nature & Science
                  </h3>
                  <p className="text-gray-600">
                    Vetabelle supplements are developed with clinically studied
                    ingredients. From Collagen&apos;s skin-firming power to
                    Biotin&apos;s hair-strengthening benefits, each capsule
                    delivers visible, lasting results.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-dark mb-2">
                    Trusted Wellness Partner
                  </h3>
                  <p className="text-gray-600">
                    We are committed to your holistic health journey. Our
                    mission goes beyond beauty — it&apos;s about supporting your
                    confidence, strength, and vitality, naturally.
                  </p>
                </div>
              </div>

              <div className="bg-[#d1fae5] rounded-lg p-6 border-l-4 border-[#14b8a6]">
                <h3 className="font-semibold text-lg text-dark mb-3">
                  Our Promise
                </h3>
                <p className="text-gray-600 mb-3">
                  When you choose Vetabelle, you&apos;re choosing products
                  designed to elevate your natural glow while supporting your
                  health from the inside out. We promise transparency, quality,
                  and a science-meets-nature approach to wellness.
                </p>
                <p className="text-gray-600 italic">
                  “Your beauty deserves the best — and that starts within.” 🌿✨
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-1 p-6 text-center">
              <div className="w-16 h-16 bg-[#d1fae5] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#14b8a6"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-dark mb-2">
                Premium Quality
              </h4>
              <p className="text-gray-600 text-sm">
                Each product is crafted with pure, high-grade ingredients to
                deliver maximum results.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-1 p-6 text-center">
              <div className="w-16 h-16 bg-[#d1fae5] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#14b8a6"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16V12M12 8H12.01"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-dark mb-2">
                Science-Backed Formulas
              </h4>
              <p className="text-gray-600 text-sm">
                Our products are developed with evidence-based research to
                ensure safe, effective, and visible results.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-1 p-6 text-center">
              <div className="w-16 h-16 bg-[#d1fae5] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-dark mb-2">
                Customer Care
              </h4>
              <p className="text-gray-600 text-sm">
                We&apos;re here to support your wellness journey with care,
                guidance, and transparency every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;

import React from "react";
import Breadcrumb from "../Common/Breadcrumb";

const AboutUs = () => {
  return (
    <>
      <section className="overflow-hidden py-10 bg-gray-2 mt-45 md:mt-50 md:pb-10 lg:pb-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-2xl md:text-4xl text-dark mb-4">
              Welcome to Bend the Trendd
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Where fashion meets individuality. We do not just follow trends –
              we bend them to create unique styles that empower you to express
              yourself.
            </p>
          </div>

          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* Our Story Card */}
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <p className="font-medium text-xl text-dark">Our Story</p>
              </div>

              <div className="p-4 sm:p-7.5">
                <div className="flex flex-col gap-4">
                  <p className="text-gray-600">
                    Founded with a passion for distinctive fashion, Bend the
                    Trendd specializes in bringing you carefully curated dresses
                    that make a statement.
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
                        fill="#3C50E0"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <strong className="text-dark">Quality First:</strong> Each
                      dress is selected for its exceptional quality and
                      craftsmanship
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
                        fill="#3C50E0"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <strong className="text-dark">Unique Styles:</strong> From
                      casual to elegant, we offer diverse designs for every
                      occasion
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
                        fill="#3C50E0"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <strong className="text-dark">Customer-Centric:</strong>{" "}
                      Your satisfaction and style confidence are our top
                      priorities
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
              <h2 className="font-bold text-2xl text-dark mb-6">
                What Makes Us Different
              </h2>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-semibold text-lg text-dark mb-2">
                    Curated Collections
                  </h3>
                  <p className="text-gray-600">
                    Every dress in our collection is handpicked to ensure it
                    meets our high standards of style, comfort, and quality. We
                    believe that fashion should be both beautiful and wearable,
                    which is why we test and approve every piece before it
                    reaches you.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-dark mb-2">
                    Trendsetting, Not Following
                  </h3>
                  <p className="text-gray-600">
                    At Bend the Trendd, we do not just follow what is popular –
                    we redefine it. Our designs blend contemporary trends with
                    timeless elegance, creating pieces that stand out while
                    remaining versatile enough for your everyday wardrobe.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-dark mb-2">
                    Commitment to You
                  </h3>
                  <p className="text-gray-600">
                    We are dedicated to providing an exceptional shopping
                    experience from browsing to delivery. Our customer service
                    team is always ready to help you find the perfect dress,
                    answer questions about sizing, or assist with any concerns
                    you may have.
                  </p>
                </div>
              </div>

              <div className="bg-blue/5 rounded-lg p-6 border-l-4 border-blue">
                <h3 className="font-semibold text-lg text-dark mb-3">
                  Our Promise
                </h3>
                <p className="text-gray-600 mb-3">
                  When you shop at Bend the Trendd, you are not just buying a
                  dress - you are investing in quality, style, and confidence.
                  We promise to deliver fashion that makes you feel amazing,
                  with service that exceeds your expectations.
                </p>
                <p className="text-gray-600 italic">
                  Fashion is about dressing according to what is fashionable.
                  Style is more about being yourself. - Oscar de la Renta
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-1 p-6 text-center">
              <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#3C50E0"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-dark mb-2">
                Premium Quality
              </h4>
              <p className="text-gray-600 text-sm">
                Only the finest materials and craftsmanship make it into our
                collection
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-1 p-6 text-center">
              <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#3C50E0"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16V12M12 8H12.01"
                    stroke="#3C50E0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-dark mb-2">
                Fast Shipping
              </h4>
              <p className="text-gray-600 text-sm">
                Quick and reliable delivery to get your new dress to you as soon
                as possible
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-1 p-6 text-center">
              <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="#3C50E0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-lg text-dark mb-2">
                Customer Support
              </h4>
              <p className="text-gray-600 text-sm">
                Dedicated team ready to assist you with any questions or
                concerns
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;

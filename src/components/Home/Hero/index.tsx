"use client";

import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <div className="overflow-hidden pb-10 lg:pb-12.5 pt-45 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="relative bg-white p-5 md:p-10 lg:p-12 rounded-lg shadow-sm">
            <div className="container">
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 lg:w-5/12">
                  <div className="hero-content">
                    <h1 className="mb-5 text-3xl font-bold !leading-[1.208] text-dark dark:text-white sm:text-[42px] lg:text-[40px] xl:text-5xl">
                      Bend the Trend with Confidence
                    </h1>
                    <p className="mb-8 max-w-[480px] text-base text-body-color dark:text-dark-6">
                      Discover fashion that defines your style — explore our
                      latest arrivals and elevate your wardrobe with exclusive
                      pieces made for you.
                    </p>
                    <ul className="flex flex-wrap items-center">
                      <li>
                        <Link
                          href="/shop"
                          className="inline-flex items-center justify-center rounded-md bg-blue-dark px-5 py-3 lg:px-7 text-center text-base font-medium text-white hover:bg-blue "
                        >
                          Shop Now!
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/about"
                          className="inline-flex ml-3 border border-gray-5 items-center justify-center rounded-md bg-white px-5 py-3 lg:px-7 text-center text-base font-medium text-black hover:text-white hover:bg-blue-dark "
                        >
                          About Us
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="hidden px-4 lg:block lg:w-1/12"></div>
                <div className="w-full px-4 lg:w-6/12">
                  <div className="lg:ml-auto lg:text-right">
                    <div className="relative z-10 inline-block pt-11 lg:pt-0">
                      <Image
                        src="/images/hero/model-2.png"
                        alt="hero"
                        width={500}
                        height={500}
                        className="max-w-full lg:ml-auto rounded-xl"
                      />
                      <span className="absolute -bottom-8 -left-8 z-[-1]">
                        <svg
                          width="93"
                          height="93"
                          viewBox="0 0 93 93"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                          <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                          <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                          <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                          <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                          <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                          <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                          <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                          <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                          <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                          <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                          <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                          <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                          <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                          <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                          <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                          <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                          <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                          <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                          <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                          <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                          <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                          <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                          <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                          <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

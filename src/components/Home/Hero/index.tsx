"use client";

import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <div className="overflow-hidden pb-5 lg:pb-8 pt-36 sm:pt-45 lg:pt-30 xl:pt-45 bg-[#F4F0F8]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="relative bg-white px-2 py-4 md:p-7 lg:p-12 rounded-lg shadow-sm">
            <div className="container">
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 lg:w-5/12">
                  <div className="hero-content">
                    <h1 className="mb-5 text-3xl font-bold !leading-[1.208] text-[#3A2E39] sm:text-[42px] lg:text-[40px] xl:text-5xl">
                      Beauty Begins from Within
                    </h1>
                    <p className="mb-8 max-w-[480px] text-base text-gray-700">
                      Vetabelle empowers women to embrace their natural beauty
                      with confidence. Our wellness supplements nourish your
                      skin, hair, and nails — helping you glow from the inside
                      out.
                    </p>
                    <ul className="flex flex-wrap items-center">
                      <li>
                        <Link
                          href="/products"
                          className="inline-flex items-center justify-center rounded-md bg-[#c77f56] px-5 py-3 lg:px-7 text-center text-base font-medium text-white hover:bg-opacity-95 transition-all duration-200 ease-in-out"
                        >
                          Shop Now
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/about"
                          className="inline-flex ml-3 border border-[#c77f56] items-center justify-center rounded-md bg-white px-5 py-3 lg:px-7 text-center text-base font-medium text-dark hover:text-white hover:bg-[#c77f56] transition-all duration-200 ease-in-out"
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
                        src="/vetabelle-image-1.jpg"
                        alt="Vetabelle Wellness Hero"
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
                          {[...Array(25)].map((_, i) => {
                            const x = (i % 5) * 22 + 2.5;
                            const y = Math.floor(i / 5) * 22 + 2.5;
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="2.5"
                                fill="#C69AC9"
                              />
                            );
                          })}
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

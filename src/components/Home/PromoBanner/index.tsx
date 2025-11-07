"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function DiscountBanner() {
  return (
    <div className="overflow-hidden pb-5 lg:pb-8 pt-10 bg-[#F4F0F8]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative bg-white px-2 py-4 md:p-7 lg:p-12 rounded-lg shadow-sm">
          <div className="container">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4 md:w-5/12">
                <div className="relative z-10 inline-block pt-11 lg:pt-0 w-full max-w-[400px] mb-8">
                  {/* Image container with aspect ratio */}
                  <div className="relative w-full aspect-square">
                    <Image
                      src="/vetabelle-image-4.jpg"
                      alt="Vetabelle Wellness Hero"
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>

                  {/* Decorative dots */}
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

              <div className="w-full px-4 md:w-7/12">
                <div className="hero-content mb-8">
                  <h1 className="mb-5 text-3xl font-bold !leading-[1.208] text-[#3A2E39] sm:text-[32px] lg:text-[40px]">
                    About Vetabelle
                  </h1>
                  <p className="mb-4 text-base text-gray-700">
                    <strong>Vetabelle</strong> was born from a simple belief —
                    that every woman deserves to feel beautiful, confident, and
                    radiant in her own skin. We understand that beauty
                    isn&apos;t just about what you see on the outside; it&apos;s
                    a reflection of how you nurture yourself from within.
                  </p>

                  <p className="mb-8 text-base text-gray-700">
                    Beyond supplements, Vetabelle is a celebration of self-care,
                    self-love, and inner strength. We&apos;re committed to
                    empowering women everywhere to embrace their unique beauty
                    journeys with confidence, positivity, and grace — because
                    when you feel good inside, it shows outside.
                  </p>

                  <ul className="flex flex-wrap items-center">
                    <li>
                      <Link
                        href="/about"
                        className="inline-flex items-center justify-center rounded-md bg-[#c77f56] px-5 py-3 lg:px-7 text-center text-base font-medium text-white hover:bg-opacity-95 transition-all duration-200 ease-in-out"
                      >
                        Learn More
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop"
                        className="inline-flex ml-3 border border-[#c77f56] items-center justify-center rounded-md bg-white px-5 py-3 lg:px-7 text-center text-base font-medium text-dark hover:text-white hover:bg-[#c77f56] transition-all duration-200 ease-in-out"
                      >
                        Shop Now
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

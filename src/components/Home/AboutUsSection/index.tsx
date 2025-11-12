"use client";

import Image from "next/image";
import React from "react";

export default function AboutUsSection() {
  return (
    <div className="overflow-hidden pb-5 md:pb-10 lg:pb-12 pt-10 bg-[#f4f0f7]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative bg-white px-2 py-4 md:p-7 lg:p-12 rounded-lg shadow-sm">
          <div className="container">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4 lg:w-6/12">
                <div className="hero-content">
                  <h1 className="mb-5 text-3xl font-bold !leading-[1.208] text-[#3A2E39] sm:text-[42px] lg:text-[40px] xl:text-5xl">
                    Beauty Begins from Within
                  </h1>
                  <p className="mb-5 max-w-[480px] text-base text-gray-700">
                    Vetabelle empowers women to embrace their natural beauty
                    with confidence. Our wellness supplements nourish your skin,
                    hair, and nails — helping you glow from the inside out.
                  </p>
                  <p className="max-w-[480px] text-base text-gray-700">
                    More than just beauty, Vetabelle is about holistic wellness.
                    We blend science and nature to create products that restore
                    balance, boost vitality, and enhance your overall well-being
                    — so you can feel as radiant as you look. Every formula is
                    thoughtfully crafted to help you live confidently,
                    beautifully, and with a renewed sense of self-care.
                  </p>
                </div>
              </div>
              <div className="hidden px-4 lg:block lg:w-1/12"></div>
              <div className="w-full px-4 lg:w-5/12">
                <div className="lg:ml-auto lg:text-right">
                  <div className="relative z-10 inline-block pt-11 lg:pt-0">
                    <Image
                      src="/Photo-2.jpg"
                      alt="Vetabelle Wellness Hero"
                      width={400}
                      height={400}
                      className="w-[400px] h-[400px] object-cover rounded-xl"
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

          {/* Four Images Grid */}
          <div className="mt-10 lg:mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[
                { src: "/image-1.jpg", alt: "Vetabelle Product 1" },
                { src: "/image-3.jpg", alt: "Vetabelle Product 2" },
                { src: "/image-2.jpg", alt: "Vetabelle Product 3" },
                { src: "/image-4.jpg", alt: "Vetabelle Product 4" },
              ].map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-100 sm:h-72 lg:h-80">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

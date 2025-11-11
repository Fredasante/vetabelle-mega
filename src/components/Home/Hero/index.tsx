"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="overflow-x-hidden pb-10 lg:pb-12.5 xl:pb-12 pt-37 sm:pt-40 lg:pt-30 xl:pt-40 bg-[#f9fafb]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 mt-3">
        <div className="flex flex-wrap gap-5">
          {/* Left Search Section */}
          <div
            className="xl:max-w-[757px] w-full flex items-center justify-center rounded-[10px] h-[520px] bg-cover bg-center relative"
            style={{
              backgroundImage: "url('/carousel-3.jpg')",
            }}
          >
            <div className="relative z-1 overflow-hidden p-6 md:p-8 w-full flex items-center max-w-full">
              <div className="w-full max-w-md pr-20 sm:pr-0 overflow-hidden">
                {/* Heading */}
                <div className="text-left mb-6 lg:mb-8">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-5 lg:mb-7">
                    Discover Premium{" "}
                    <span className="text-[#c2712f] text-[19px] lg:text-[22px] font-bold bg-white px-3 py-1.5 rounded-lg shadow-lg inline-block border-b-4 border-[#c77f56] mt-2">
                      Supplements / Selfcare / Confidence
                    </span>
                  </h1>
                  <p className="text-base lg:text-lg text-white/90">
                    Empowering women with premium wellness supplements,
                    self-care essentials, and the confidence to shine from
                    within.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="mb-4 sm:mb-6 w-full">
                  <div className="relative flex items-center bg-white rounded-full shadow-2 overflow-hidden border-2 border-gray-3 focus-within:border-[#c77f56] transition-colors w-full max-w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search for supplements, vitamins, beauty products..."
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 outline-none text-dark placeholder:text-gray-500 w-full min-w-0"
                    />

                    <button
                      onClick={handleSearch}
                      className="bg-[#c77f56] text-white px-6 sm:px-8 py-3 sm:py-4 font-medium hover:bg-[#b96e48] transition-all duration-200 flex items-center gap-2 flex-shrink-0"
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-start gap-3 mt-6 sm:mt-8">
                  <Link
                    href="/shop"
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-[#c77f56] text-white px-6 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-[#b96e48] transition-all duration-200 shadow-1"
                  >
                    Browse All Products
                  </Link>
                  <Link
                    href="/about"
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-[#c77f56] px-6 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-gray-1 transition-all duration-200 border-2 border-[#c77f56]"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Cards */}
          <div className="xl:max-w-[393px] w-full hidden md:block h-[520px]">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-4 h-full">
              {/* Our Mission Card */}
              <div className="w-full relative rounded-[10px] overflow-hidden flex-1 flex flex-col justify-between">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  poster="https://res.cloudinary.com/epic-eats/image/upload/f_auto,q_auto/vetabelle-fallback.jpg"
                >
                  <source
                    src="https://res.cloudinary.com/epic-eats/video/upload/f_auto,q_auto/v1762625692/vetabelle-video_zm114i.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* What We Offer Card */}
              <div
                className="w-full relative rounded-[10px] overflow-hidden sm:p-7.5 flex-1 flex flex-col justify-between bg-cover bg-center"
                style={{
                  backgroundImage: "url('/vetabelle-image-6.jpg')",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

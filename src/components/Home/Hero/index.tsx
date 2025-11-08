import React from "react";
import HeroFeature from "./HeroFeature";
import { Sparkles, Heart } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-37 sm:pt-40 lg:pt-30 xl:pt-46 bg-[#e5eaf4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          {/* Left Video Section */}
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden h-[520px]">
              {/* Video with mobile-friendly autoplay */}
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              >
                <source src="/vetabelle-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Overlay Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    Beauty from Within
                  </h1>
                  <p className="text-lg sm:text-xl mb-4">
                    Empowering women with premium wellness supplements
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block bg-[#c77f56] text-white px-6 py-3 rounded-md font-medium hover:bg-[#b96e48] transition-all duration-200"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Cards */}
          <div className="xl:max-w-[393px] w-full hidden md:block">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-4 h-full">
              {/* Our Mission Card */}
              <div
                className="w-full relative rounded-[10px] overflow-hidden p-4 sm:p-7.5 flex-1 flex flex-col justify-between bg-cover bg-center"
                style={{ backgroundImage: "url('/Photo-4.jpg')" }}
              >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="font-semibold text-white text-xl max-w-[200px]">
                      Our Mission
                    </h2>
                    <div className="flex-shrink-0">
                      <Sparkles className="w-12 h-12 text-[#c77f56]" />
                    </div>
                  </div>
                  <p className="text-white text-sm leading-relaxed mb-6">
                    Empowering women by enhancing natural beauty and boosting
                    confidence through high-quality supplements.
                  </p>
                </div>
                <div className="relative z-10 bg-white/20 backdrop-blur-sm w-fit rounded-md">
                  <Link
                    href="/about"
                    className="cursor-pointer bg-[#c77f56] text-white px-3 py-1 rounded-md font-medium transition-all duration-200 hover:bg-[#b96e48]"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* What We Offer Card */}
              <div
                className="w-full relative rounded-[10px] overflow-hidden p-4 sm:p-7.5 flex-1 flex flex-col justify-between bg-cover bg-center"
                style={{ backgroundImage: "url('/biotin.png')" }}
              >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="font-semibold text-white text-xl max-w-[200px]">
                      Beauty from Within
                    </h2>
                    <div className="flex-shrink-0">
                      <Heart className="w-12 h-12 text-[#c77f56]" />
                    </div>
                  </div>
                  <p className="text-white text-sm leading-relaxed mb-6">
                    Glowing skin, luscious hair, and strong nails. Made for
                    Ghanaian women who embrace their inner strength.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="w-fit cursor-pointer bg-white text-[#c77f56] px-3 py-1 rounded-md font-medium transition-all duration-200 hover:bg-[#f9f9f9]"
                >
                  Explore All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Features */}
      <HeroFeature />
    </section>
  );
};

export default Hero;

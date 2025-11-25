"use client";

import React, { useState, useEffect } from "react";
import { Search, Zap, Tag, Gift, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BlackFridayHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const router = useRouter();

  useEffect(() => {
    // Calculate end date (7 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

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
    <section className="overflow-x-hidden pb-10 lg:pb-12.5 xl:pb-12 pt-37 sm:pt-40 lg:pt-30 xl:pt-40 bg-[#f1f4f7] relative">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 mt-0 lg:mt-3 relative z-10">
        {/* Single Large Hero Section */}
        <div
          className="w-full flex items-center justify-center rounded-[10px] min-h-[580px] lg:h-[580px] bg-cover bg-center relative overflow-hidden border-4 border-red-600 shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1600')",
          }}
        >
          {/* Black Friday Badge */}
          <div className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full text-xs sm:text-base font-bold shadow-lg animate-bounce flex items-center gap-1 sm:gap-2">
            <Zap className="w-3 h-3 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">BLACK FRIDAY 2025</span>
            <span className="sm:hidden">BLACK FRIDAY 2025</span>
          </div>

          {/* Countdown Timer (Top Left) */}
          <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-black/90 backdrop-blur-sm border-2 border-yellow-400 text-white px-3 sm:px-6 py-2 sm:py-4 rounded-lg shadow-xl">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-[10px] sm:text-xs uppercase">
                Sale Ends
              </span>
            </div>
            <div className="flex gap-1 sm:gap-3 text-center">
              <div>
                <div className="text-lg sm:text-2xl font-black text-red-500">
                  {timeLeft.days}
                </div>
                <div className="text-[8px] sm:text-xs text-gray-400">DAYS</div>
              </div>
              <div className="text-lg sm:text-2xl font-black text-white">:</div>
              <div>
                <div className="text-lg sm:text-2xl font-black text-red-500">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-[8px] sm:text-xs text-gray-400">HRS</div>
              </div>
              <div className="text-lg sm:text-2xl font-black text-white">:</div>
              <div>
                <div className="text-lg sm:text-2xl font-black text-red-500">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-[8px] sm:text-xs text-gray-400">MIN</div>
              </div>
              <div className="text-lg sm:text-2xl font-black text-white">:</div>
              <div>
                <div className="text-lg sm:text-2xl font-black text-red-500">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[8px] sm:text-xs text-gray-400">SEC</div>
              </div>
            </div>
          </div>

          <div className="relative z-1 overflow-hidden p-8 md:p-12 lg:p-16 w-full flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <div className="mb-8 lg:mb-10 mt-15">
              <h1 className="text-2xl lg:text-4xl font-extrabold text-white/90 mb-5 sm:mb-6 leading-tight">
                BLACK FRIDAY
                <span className="block text-white/80 bg-clip-text bg-gradient-to-r from-red-light via-yellow-light-1 to-red-light-2 mt-2 sm:mt-3 text-4xl md:text-5xl lg:text-6xl">
                  MEGA SALE
                </span>
              </h1>

              <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 text-white px-8 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl shadow-2xl inline-block mb-5 sm:mb-6 border-2 sm:border-4 border-yellow-400 transform hover:scale-105 transition-transform">
                <span className="text-3xl sm:text-5xl md:text-6xl font-black">
                  UP TO 50% OFF
                </span>
              </div>

              <p className="text-base sm:text-xl md:text-2xl text-white font-bold mb-3 sm:mb-4 px-4">
                🔥 Premium Supplements • Self-Care • Beauty Products
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-[#d28b55] to-[#b8601d] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-black hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-2xl border-2 sm:border-4 border-yellow-400 hover:scale-105 transform"
              >
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-sm sm:text-base">
                  Shop All Black Friday Deals
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlackFridayHero;

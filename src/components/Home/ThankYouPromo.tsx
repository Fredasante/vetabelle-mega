"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Gift, Clock } from "lucide-react";
import { isDeadlinePassed } from "@/lib/masterclass";
import CountdownTimer from "@/components/Masterclass/CountdownTimer";

// Promo extended through Wed 17th June 2026, 11:59pm Ghana time (GMT)
const PROMO_END = "2026-06-17T23:59:59Z";

const ThankYouPromo = () => {
  const [ended, setEnded] = useState(() => isDeadlinePassed(PROMO_END));

  useEffect(() => {
    if (ended) return;
    const id = setInterval(() => {
      if (isDeadlinePassed(PROMO_END)) setEnded(true);
    }, 1000);
    return () => clearInterval(id);
  }, [ended]);

  return (
    <section className="py-10 md:py-14 bg-[#fdf6f0] pb-10 lg:pb-12.5 xl:pb-12 pt-30 sm:pt-44 lg:pt-30 xl:pt-40">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 lg:mt-3">
        <div className="bg-white rounded-[12px] shadow-1 overflow-hidden grid md:grid-cols-2">
          <div className="relative w-full aspect-[3/4] md:aspect-auto md:min-h-[420px] bg-[#fdf6f0]">
            <Image
              src="/vetabelle-thank-you-promo.jpeg"
              alt="Vetabelle Thank You Promo"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            {!ended && (
              <span className="inline-flex w-fit text-xs font-medium text-white bg-[#c77f56] px-2.5 py-1 rounded-full mb-3">
                Limited-Time Offer
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3 leading-tight">
              Vetabelle Thank You Promo
            </h2>
            <div className="flex flex-col gap-1.5 mb-5 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c77f56]" />
                <span>11th – 17th June, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#c77f56]" />
                <span className="text-slate-500">
                  Free gifts on a purchase made on our website
                </span>
              </div>
            </div>
            <CountdownTimer
              targetDate={PROMO_END}
              label="Promo ends in"
              expiredLabel="Promo ended"
            />
            <div className="flex items-start gap-2.5 bg-[#fff7f0] border border-[#c2712f]/25 rounded-md px-3.5 py-3 mb-4">
              <Clock className="w-4 h-4 text-[#c2712f] mt-0.5 flex-shrink-0" />
              <p className="text-base text-[#c2712f] leading-snug">
                {ended ? (
                  <>
                    The Thank You Promo has ended. Thank you for shopping with
                    us!
                  </>
                ) : (
                  <>
                    Promo ends on{" "}
                    <span className="font-bold">17th June, 2026</span>
                  </>
                )}
              </p>
            </div>
            <a
              href="#featured-products"
              className="inline-block w-fit font-medium text-white bg-[#c2712f] py-3 px-7 rounded-md ease-out duration-200 hover:bg-[#b96e48]"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYouPromo;

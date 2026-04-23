import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";
import { client } from "@/sanity/client";
import { activeMasterclassQuery } from "@/sanity/groq";
import type { Masterclass } from "@/types/masterclass";
import { getPriceTier, formatEventDate } from "@/lib/masterclass";

const MasterclassPromo = async () => {
  const masterclass: Masterclass | null = await client.fetch(
    activeMasterclassQuery,
  );

  if (!masterclass) return null;

  const { tier, price } = getPriceTier(masterclass);
  const isEarlyBird = tier === "early_bird";

  return (
    <section className="py-10 md:py-14 bg-[#fdf6f0] pb-10 lg:pb-12.5 xl:pb-12 pt-37 sm:pt-40 lg:pt-30 xl:pt-40">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 lg:mt-3">
        <div className="bg-white rounded-[12px] shadow-1 overflow-hidden grid md:grid-cols-2">
          <div className="relative w-full aspect-[4/3] md:aspect-auto md:min-h-[320px] bg-[#fdf6f0]">
            <Image
              src={masterclass.bannerImage}
              alt={masterclass.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain md:object-cover"
            />
          </div>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            {isEarlyBird && (
              <span className="inline-flex w-fit text-xs font-medium text-white bg-[#c77f56] px-2.5 py-1 rounded-full mb-3">
                Early Bird — Save ₵
                {(masterclass.regularPrice - price).toLocaleString()}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3 leading-tight">
              {masterclass.title}
            </h2>
            <div className="flex flex-col gap-1.5 mb-5 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c77f56]" />
                <span>{formatEventDate(masterclass.eventDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c77f56]" />
                <span className="text-slate-500">{masterclass.location}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3 mb-5">
              {isEarlyBird && masterclass.regularPrice > price ? (
                <>
                  <span className="text-3xl font-bold text-dark line-through">
                    ₵{masterclass.regularPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl font-bold text-[#c2712f]">
                    ₵{price.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium bg-green-light-6 text-green-dark px-2 py-0.5 rounded-full">
                    Save ₵{(masterclass.regularPrice - price).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-[#c2712f]">
                  ₵{price.toLocaleString()}
                </span>
              )}
            </div>
            {isEarlyBird && masterclass.earlyBirdDeadline && (
              <div className="flex items-start gap-2.5 bg-[#fff7f0] border border-[#c2712f]/25 rounded-md px-3.5 py-3 mb-4">
                <Clock className="w-4 h-4 text-[#c2712f] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#c2712f] leading-snug">
                  Early bird access closes strictly on{" "}
                  <span className="font-bold">
                    {formatEventDate(masterclass.earlyBirdDeadline)}
                  </span>
                </p>
              </div>
            )}
            <Link
              href="/masterclass"
              className="inline-block w-fit font-medium text-white bg-[#c2712f] py-3 px-7 rounded-md ease-out duration-200 hover:bg-[#b96e48]"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MasterclassPromo;

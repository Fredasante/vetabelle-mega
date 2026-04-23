"use client";
import React from "react";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import type { Masterclass } from "@/types/masterclass";
import { formatEventDate } from "@/lib/masterclass";
import PriceCard from "./PriceCard";

interface HeroProps {
  masterclass: Masterclass;
  onRegisterClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ masterclass, onRegisterClick }) => {
  return (
    <section className="bg-[#fdf6f0] pt-36 md:pt-45 pb-12 md:pb-16">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <div className="relative w-full aspect-[3/4] md:aspect-auto md:min-h-[480px] rounded-[10px] overflow-hidden shadow-1 bg-[#fdf6f0]">
            <Image
              src={masterclass.bannerImage}
              alt={masterclass.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-5 leading-tight">
              {masterclass.title}
            </h1>
            <div className="flex flex-col gap-2.5 mb-7">
              <div className="flex items-center gap-2.5 text-dark">
                <Calendar className="w-5 h-5 text-[#c77f56]" />
                <span className="font-medium">
                  {formatEventDate(masterclass.eventDate)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-dark">
                <MapPin className="w-5 h-5 text-[#c77f56]" />
                <span className="font-medium">{masterclass.location}</span>
              </div>
            </div>
            <PriceCard
              masterclass={masterclass}
              onRegisterClick={onRegisterClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

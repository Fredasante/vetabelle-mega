"use client";
import React from "react";
import { Clock } from "lucide-react";
import type { Masterclass } from "@/types/masterclass";
import { getPriceTier, formatEventDate } from "@/lib/masterclass";
import CountdownTimer from "./CountdownTimer";

interface PriceCardProps {
  masterclass: Pick<
    Masterclass,
    "regularPrice" | "earlyBirdPrice" | "earlyBirdDeadline"
  >;
  onRegisterClick?: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({
  masterclass,
  onRegisterClick,
}) => {
  const { tier, price } = getPriceTier(masterclass);
  const isEarlyBird = tier === "early_bird";

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-6 border border-gray-3">
      {isEarlyBird && (
        <span className="inline-block text-xs font-medium text-white bg-[#c77f56] px-2.5 py-1 rounded-full mb-3">
          Early Bird Offer
        </span>
      )}
      <div className="flex items-baseline gap-3 mb-3">
        {isEarlyBird && masterclass.regularPrice > price ? (
          <>
            <span className="text-4xl font-bold text-dark line-through">
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
          <span className="text-4xl font-bold text-[#c2712f]">
            ₵{price.toLocaleString()}
          </span>
        )}
      </div>
      {isEarlyBird && masterclass.earlyBirdDeadline && (
        <>
          <CountdownTimer targetDate={masterclass.earlyBirdDeadline} />
          <div className="flex items-start gap-2.5 bg-[#fff7f0] border border-[#c2712f]/25 rounded-md px-3.5 py-3 mb-4">
            <Clock className="w-4 h-4 text-[#c2712f] mt-0.5 flex-shrink-0" />
            <p className="text-base text-[#c2712f] leading-snug">
              Early bird has been extended to{" "}
              <span className="font-bold">
                {formatEventDate(masterclass.earlyBirdDeadline)}
              </span>
            </p>
          </div>
        </>
      )}
      {!isEarlyBird && (
        <p className="text-sm text-dark-5 mb-4">Regular price</p>
      )}
      {onRegisterClick && (
        <button
          type="button"
          onClick={onRegisterClick}
          className="w-full font-medium text-white bg-[#c2712f] py-3 px-6 rounded-md ease-out duration-200 hover:bg-[#b96e48]"
        >
          Register Below
        </button>
      )}
    </div>
  );
};

export default PriceCard;

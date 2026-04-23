"use client";
import React from "react";
import type { Masterclass } from "@/types/masterclass";
import { getPriceTier, daysUntil } from "@/lib/masterclass";

interface PriceCardProps {
  masterclass: Pick<
    Masterclass,
    "regularPrice" | "earlyBirdPrice" | "earlyBirdDeadline"
  >;
  onRegisterClick?: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({ masterclass, onRegisterClick }) => {
  const { tier, price } = getPriceTier(masterclass);
  const isEarlyBird = tier === "early_bird";
  const daysLeft = isEarlyBird && masterclass.earlyBirdDeadline
    ? daysUntil(masterclass.earlyBirdDeadline)
    : null;

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-6 border border-gray-3">
      {isEarlyBird && (
        <span className="inline-block text-xs font-medium text-white bg-[#c77f56] px-2.5 py-1 rounded-full mb-3">
          Early Bird Offer
        </span>
      )}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-bold text-[#c77f56]">
          ₵{price.toLocaleString()}
        </span>
        {isEarlyBird && masterclass.regularPrice > price && (
          <span className="text-base text-dark-5 line-through">
            ₵{masterclass.regularPrice.toLocaleString()}
          </span>
        )}
      </div>
      {isEarlyBird && daysLeft !== null && (
        <p className="text-sm text-dark-5 mb-4">
          {daysLeft === 0
            ? "Last day for early bird pricing!"
            : `Early bird ends in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
        </p>
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

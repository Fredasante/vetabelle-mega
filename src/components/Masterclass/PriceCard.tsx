"use client";
import React from "react";
import type { Masterclass } from "@/types/masterclass";
import { getPriceTier, formatEventDate } from "@/lib/masterclass";

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
        <p className="text-base text-slate-500 mb-4">
          Early bird access closes strictly on{" "}
          <span className="font-bold text-dark">
            {formatEventDate(masterclass.earlyBirdDeadline)}
          </span>
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

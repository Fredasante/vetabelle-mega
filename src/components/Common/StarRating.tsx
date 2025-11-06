import React from "react";
import Image from "next/image";

interface StarRatingProps {
  count?: number; // number of stars to display
}

const StarRating = ({ count = 5 }: StarRatingProps) => {
  return (
    <div className="flex items-center justify-center gap-2.5 mb-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: count }).map((_, index) => (
          <Image
            key={index}
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={15}
            height={15}
          />
        ))}
      </div>
    </div>
  );
};

export default StarRating;

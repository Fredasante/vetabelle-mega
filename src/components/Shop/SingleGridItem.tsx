"use client";

import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { Eye, Heart } from "lucide-react";
import StarRating from "../Common/StarRating";
import { toast } from "sonner";

const SingleGridItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // 🟢 Update QuickView
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // 🛒 Add to Cart
  const handleAddToCart = () => {
    const selectedSize = item.sizes?.[0] || null;
    const selectedColor = item.colors?.[0] || null;

    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      })
    );
    toast.success("Added to cart!");
  };

  // 💖 Add to Wishlist
  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        status: "available",
        quantity: 1,
      })
    );
    toast.success("Added to wishlist!");
  };

  return (
    <div className="group">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-white shadow-1 mb-4 flex items-center justify-center">
        <Image
          src={item.mainImageUrl || "/images/placeholder.png"}
          alt={item.name || "Product image"}
          fill
          className="object-contain object-center p-3"
        />
      </div>

      <StarRating />

      {/* Product title */}
      <h3 className="font-medium text-center text-dark ease-out duration-200 hover:text-blue mb-1.5 line-clamp-1">
        <Link href={`/shop/${item.slug?.current || item.slug}`}>
          {item.name}
        </Link>
      </h3>

      {/* Price */}
      <span className="flex items-center justify-center gap-2 font-medium">
        <span className="text-dark">₵{item.discountPrice ?? item.price}</span>
        {item.discountPrice && (
          <span className="text-dark-4 line-through">₵{item.price}</span>
        )}
      </span>

      {/* Hover buttons */}
      <div className="w-full flex items-center justify-center gap-2.5 pt-3 pb-2 ease-linear duration-200 group-hover:translate-y-0">
        <button
          onClick={() => {
            openModal();
            handleQuickViewUpdate();
          }}
          aria-label="Quick view product"
          className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={handleAddToCart}
          className="inline-flex font-medium text-custom-sm py-[4px] md:py-[7px] px-1.5 md:px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark"
        >
          Add to cart
        </button>

        <button
          onClick={handleItemToWishList}
          aria-label="Add to wishlist"
          className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SingleGridItem;

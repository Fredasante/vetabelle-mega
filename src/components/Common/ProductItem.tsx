"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { updateProductDetails } from "@/redux/features/product-details";
import { Eye, Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import StarRating from "./StarRating";

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = item.status === "out-of-stock";

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        _id: item._id,
        title: item.title,
        price: item.price,
        discountPrice: item.discountPrice,
        quantity,
        image: item.image,
      })
    );
    toast.success(`${quantity} ${item.title} added to cart!`);
    setQuantity(1);
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        _id: item._id,
        title: item.title,
        price: item.price,
        discountPrice: item.discountPrice,
        image: item.image,
        slug: item.slug,
        status: item.status,
        description: item.description,
        createdAt: item.createdAt,
      })
    );
    toast.success("Added to wishlist!");
  };

  const handleProductDetails = () => {
    dispatch(updateProductDetails({ ...item }));
  };

  return (
    <div className="group">
      {/* Image */}
      <div className="relative mb-4">
        <div className="relative w-full aspect-[3/2] sm:aspect-[4/3] overflow-hidden rounded-lg bg-white shadow-1 flex items-center justify-center">
          <Image
            src={item.image || "/images/placeholder.png"}
            alt={item.title || "Product image"}
            fill
            className="object-contain object-center p-3"
          />
        </div>
        {isOutOfStock && (
          <span className="absolute top-2 left-2 z-10 bg-red text-white text-xs font-semibold px-2 py-0.5 rounded">
            Sold Out
          </span>
        )}
      </div>

      <StarRating />

      {/* Title */}
      <h3
        className="font-semibold text-dark text-center ease-out duration-200 hover:text-[#c2712f] mb-1.5"
        onClick={handleProductDetails}
      >
        <Link href={`/shop/${item.slug.current}`} className="line-clamp-1">
          {item.title}
        </Link>
      </h3>

      {/* Price */}
      <span className="flex items-center justify-center gap-2 font-medium">
        {item.discountPrice && item.discountPrice > 0 ? (
          <>
            <span className="text-dark text-lg"> GH₵ {item.discountPrice}</span>
            <span className="text-dark-4 line-through"> GH₵ {item.price}</span>
          </>
        ) : (
          <span className="text-dark text-lg"> GH₵ {item.price}</span>
        )}
      </span>

      {/* Quantity Controls */}
      {!isOutOfStock && (
        <div className="flex items-center justify-center gap-3 py-3">
          <button
            onClick={handleDecrease}
            className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-medium min-w-[20px] text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className={`w-full flex items-center justify-center gap-2.5 ${isOutOfStock ? "pt-3" : ""} pb-2`}>
        <button
          onClick={() => {
            openModal();
            handleQuickViewUpdate();
          }}
          id="newOne"
          aria-label="button for quick view"
          className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-[#c77f56] flex-shrink-0"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={isOutOfStock ? undefined : handleAddToCart}
          disabled={isOutOfStock}
          className={`flex items-center justify-center font-medium text-custom-sm py-[7px] px-5 rounded-[5px] text-white ease-out duration-200 ${
            isOutOfStock
              ? "bg-[#c2712f]/50 cursor-not-allowed"
              : "bg-[#c2712f] hover:bg-opacity-90"
          }`}
        >
          {isOutOfStock ? "Sold Out" : "Add to cart"}
        </button>

        <button
          onClick={handleItemToWishList}
          aria-label="button for favorite select"
          id="favOne"
          className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-[#c2712f] flex-shrink-0"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;

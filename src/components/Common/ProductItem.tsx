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
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-white shadow-1 mb-4 flex items-center justify-center">
        <Image
          src={item.image || "/images/placeholder.png"}
          alt={item.title || "Product image"}
          fill
          className="object-contain object-center p-1 md:p-2 lg:p-3"
        />
      </div>

      <StarRating />

      {/* Title */}
      <h3
        className="font-semibold text-dark text-center ease-out duration-200 hover:text-teal mb-1.5"
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
            <span className="text-dark">₵{item.discountPrice}</span>
            <span className="text-dark-4 line-through">₵{item.price}</span>
          </>
        ) : (
          <span className="text-dark">₵{item.price}</span>
        )}
      </span>

      {/* Quantity Controls */}
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

      {/* Buttons */}
      <div className="w-full flex items-center justify-center gap-2.5 pb-2">
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
          onClick={handleAddToCart}
          className="flex items-center justify-center bg-[#c77f56] font-medium text-custom-sm py-[7px] px-5 rounded-[5px] text-white ease-out duration-200 hover:bg-opacity-90"
        >
          Add to cart
        </button>

        <button
          onClick={handleItemToWishList}
          aria-label="button for favorite select"
          id="favOne"
          className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-[#c77f56] flex-shrink-0"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;

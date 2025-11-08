"use client";
import React, { useState } from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, Minus, Plus } from "lucide-react";
import StarRating from "../Common/StarRating";
import { toast } from "sonner";
import { updateProductDetails } from "@/redux/features/product-details";

const SingleListItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // Add to cart
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
    <div className="group rounded-lg bg-white shadow-1">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="shadow-list relative overflow-hidden flex items-center justify-center w-full sm:max-w-[270px] min-h-[200px] sm:min-h-[230px] p-4">
          <Image
            src={item.image || "/images/placeholder.png"}
            alt={item.title || "Product image"}
            fill
            className="object-contain object-center p-3"
          />

          {/* Hover Buttons */}
          <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
            <button
              onClick={() => {
                openModal();
                handleQuickViewUpdate();
              }}
              aria-label="Quick view"
              className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-teal"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-teal text-white ease-out duration-200 hover:bg-opacity-90"
            >
              Add to cart
            </button>

            <button
              onClick={handleItemToWishList}
              aria-label="Add to wishlist"
              className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-teal"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center justify-between py-5 px-4 sm:px-7.5 lg:pl-11 lg:pr-12">
          <div className="flex-1">
            <h3
              className="font-semibold text-dark ease-out duration-200 hover:text-[#c77f56] mb-1.5 line-clamp-2"
              onClick={handleProductDetails}
            >
              <Link href={`/shop/${item.slug.current}`}>{item.title}</Link>
            </h3>

            {/* Price */}
            <span className="flex items-center gap-2 font-medium text-lg mb-4">
              {item.discountPrice && item.discountPrice > 0 ? (
                <>
                  <span className="text-dark">₵{item.discountPrice}</span>
                  <span className="text-dark-4 line-through">
                    ₵{item.price}
                  </span>
                </>
              ) : (
                <span className="text-dark">₵{item.price}</span>
              )}
            </span>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">
                Quantity:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrease}
                  className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-medium min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;

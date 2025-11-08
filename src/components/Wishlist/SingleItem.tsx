import React, { useEffect } from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

import {
  removeItemFromWishlist,
  WishListItem,
} from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";

import Image from "next/image";
import { CheckCircle, CircleX, XCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  item: WishListItem;
};

const SingleItem = ({ item }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromWishlist = () => {
    dispatch(removeItemFromWishlist(item._id));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  const isInStock = item.status === "in-stock";
  const displayPrice = item.discountPrice ?? item.price;

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-10">
      <div className="min-w-[83px]">
        <button
          onClick={handleRemoveFromWishlist}
          aria-label="button for remove product from wishlist"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <CircleX className="w-4 h-4" />
        </button>
      </div>

      <div className="min-w-[387px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="relative flex items-center justify-center rounded-[8px] bg-gray-2 max-w-[80px] w-full h-20 overflow-hidden p-1.5">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain rounded-[5px] p-2"
              />
            </div>
            <div>
              <h3 className="text-dark ease-out duration-200 hover:text-blue line-clamp-1">
                <Link href={`/products/${item.slug?.current}`}>
                  {item.title}
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-[205px]">
        <p className="text-dark">₵{displayPrice.toFixed(2)}</p>
      </div>

      <div className="min-w-[265px] flex items-center gap-1.5">
        {isInStock ? (
          <>
            <CheckCircle className="text-green w-5 h-5" />
            <span className="text-green">In Stock</span>
          </>
        ) : (
          <>
            <XCircle className="text-red w-5 h-5" />
            <span className="text-red-dark">Out of Stock</span>
          </>
        )}
      </div>

      <div className="min-w-[150px] flex justify-end">
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`inline-flex text-dark py-2.5 px-6 rounded-md ease-out duration-200 ${
            isInStock
              ? "hover:text-white bg-gray-1 border border-gray-3 hover:bg-[#c77f56] hover:border-gray-3"
              : "bg-gray-2 border border-gray-3 cursor-not-allowed opacity-50"
          }`}
        >
          {isInStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

export default SingleItem;

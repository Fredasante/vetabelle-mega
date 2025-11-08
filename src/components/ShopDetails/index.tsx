"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { PortableText } from "@portabletext/react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { toast } from "sonner";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { AppDispatch } from "@/redux/store";
import { Minus, Plus } from "lucide-react";

interface ShopDetailsProps {
  product: Product;
}

const ShopDetails = ({ product }: ShopDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  const isAvailable = product.status === "in-stock";
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100
      )
    : 0;

  // Quantity handlers
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Add to cart
  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...product,
        quantity: quantity,
      })
    );
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  // Add to wishlist
  const handleAddToWishlist = () => {
    dispatch(addItemToWishlist(product));
    toast.success("Added to wishlist");
  };

  return (
    <div className="bg-gray-100 pt-30 xl:pt-50 bg-[#f3f4f6] pb-7 px-3 lg:min-h-[72vh]">
      <div className="container px-4 py-8 max-w-[1170px] w-full mx-auto">
        <div className="flex flex-wrap -mx-4">
          {/* Product Image */}
          <div className="w-full md:w-1/2 lg:w-[38%] px-4 mb-8">
            <div className="relative w-full max-w-md rounded-lg shadow-md bg-white p-4">
              <Image
                src={product.image || "/placeholder.jpg"}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-auto rounded-lg object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 lg:w-[60%] px-4">
            <h1 className="text-3xl font-bold mb-2 text-dark">
              {product.title}
            </h1>
            <p className="text-gray-600 mb-5">
              Status:{" "}
              <span
                className={`font-semibold ${
                  isAvailable ? "text-green" : "text-red"
                }`}
              >
                {isAvailable ? "In Stock" : "Out of Stock"}
              </span>
            </p>

            <div className="mb-5">
              <span className="text-2xl font-bold mr-2 text-dark">
                ₵{product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-gray-500 line-through">
                    ₵{product.discountPrice?.toFixed(2)}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-teal text-white">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6 md:mb-8">
              <h3 className="text-lg font-semibold text-dark mb-3">Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseQuantity}
                  disabled={!isAvailable || quantity <= 1}
                  className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                    !isAvailable || quantity <= 1
                      ? "border-gray-3 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-3 shadow-sm bg-white text-dark hover:border-[#c77f56] hover:bg-[#c77f56] hover:text-white"
                  }`}
                >
                  <Minus className="w-3 h-3" />
                </button>

                <span className="font-semibold text-dark min-w-[3rem] text-center">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  disabled={!isAvailable}
                  className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                    !isAvailable
                      ? "border-gray-3 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-3 shadow-sm bg-white text-dark hover:border-[#c77f56] hover:bg-[#c77f56] hover:text-white"
                  }`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-5">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`inline-flex font-medium text-white py-2.5 px-4.5 text-sm sm:text-base rounded-md transition-colors ${
                  isAvailable
                    ? "bg-[#c77f56] hover:bg-opacity-90"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isAvailable ? "Add to Cart" : "Out of Stock"}
              </button>

              <button
                onClick={handleAddToWishlist}
                disabled={!isAvailable}
                className={`inline-flex items-center gap-2 font-medium text-white py-2.5 px-4.5 text-sm sm:text-base rounded-md transition-colors ${
                  isAvailable
                    ? "bg-teal hover:bg-opacity-90"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Add to Wishlist
              </button>
            </div>

            {/* Product Description */}
            <div className="prose prose-sm max-w-none text-gray-700 mt-6">
              <h3 className="text-xl font-semibold mb-3 text-dark">
                About This Product
              </h3>
              {Array.isArray(product?.description) &&
              product.description.length > 0 ? (
                <PortableText
                  value={product.description}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="mb-4">{children}</p>
                      ),
                    },
                    list: {
                      bullet: ({ children }) => (
                        <ul className="list-disc pl-5 space-y-2">{children}</ul>
                      ),
                      number: ({ children }) => (
                        <ol className="list-decimal pl-5 space-y-2">
                          {children}
                        </ol>
                      ),
                    },
                    listItem: {
                      bullet: ({ children }) => <li>{children}</li>,
                      number: ({ children }) => <li>{children}</li>,
                    },
                    marks: {
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      link: ({ children, value }) => (
                        <a
                          href={value.href}
                          className="text-teal hover:underline"
                        >
                          {children}
                        </a>
                      ),
                    },
                  }}
                />
              ) : (
                <p className="text-gray-500 italic">
                  No description available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;

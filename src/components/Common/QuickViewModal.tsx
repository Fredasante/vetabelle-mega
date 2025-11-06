"use client";
import React, { useEffect, useState } from "react";

import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { updateProductDetails } from "@/redux/features/product-details";
import { X } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { toast } from "sonner";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const [quantity, setQuantity] = useState(1);

  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");

  const dispatch = useDispatch<AppDispatch>();

  const [activePreview, setActivePreview] = useState(0);

  // preview modal
  const handlePreviewSlider = () => {
    dispatch(updateProductDetails(product));
    openPreviewModal();
  };

  // add to cart
  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        mainImageUrl: product.mainImageUrl || "",
        size: product.sizes?.[0] || null,
        color: product.colors?.[0] || null,
        quantity,
      })
    );
    toast.success("Added to cart!");
    closeModal();
  };

  // add to wishlist
  const handleAddToWishlist = () => {
    dispatch(
      addItemToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        mainImageUrl: product.mainImageUrl || "",
        quantity: 1,
        status: product.status,
      })
    );
    toast.success("Added to wishlist");
    closeModal();
  };

  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setQuantity(1);
    };
  }, [isModalOpen, closeModal]);

  return (
    <div
      className={`${
        isModalOpen ? "z-99999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={() => closeModal()}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-12.5">
            {/* Main Image */}
            <div className="max-w-[526px] w-full">
              <div className="relative z-1 overflow-hidden flex items-center justify-center w-full h-[300px] sm:h-[400px] lg:h-[508px] bg-gray-1 rounded-lg border border-gray-3">
                {product?.mainImageUrl ? (
                  <Image
                    src={product.mainImageUrl}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-contain w-full h-full max-h-[280px] sm:max-h-[380px] lg:max-h-[480px]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                    <span>No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="max-w-[445px] w-full">
              <h3 className="font-semibold text-xl xl:text-heading-5 text-dark mb-4">
                {product.name || "Untitled Product"}
              </h3>

              <div>
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-dark text-xl xl:text-heading-4">
                    ₵{product.discountPrice || product.price || "0.00"}
                  </span>
                  {product.discountPrice && (
                    <span className="font-medium text-dark-4 text-lg xl:text-2xl line-through">
                      ₵{product.price}
                    </span>
                  )}
                </span>
              </div>

              <div className="flex flex-wrap gap-9 md:gap-15 lg:gap-25 mt-6 mb-7.5">
                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-500 whitespace-nowrap">
                      Size:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1 border rounded-md transition-all ${
                            selectedSize === size
                              ? "bg-blue text-white border-blue"
                              : "bg-white text-dark border-gray-300 hover:border-blue"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2">
                  <h4 className="font-semibold text-lg text-slate-500">
                    Quantity:
                  </h4>
                  <div className="flex gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-[5px] border border-gray-3 bg-white font-medium text-dark">
                      {quantity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
                <button
                  onClick={handleAddToCart}
                  className="inline-flex font-medium text-white bg-blue py-2.5 px-4.5 sm:py-3 sm:px-7 text-sm sm:text-base rounded-md hover:bg-blue-dark transition-colors"
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className="inline-flex items-center gap-2 font-medium text-white bg-dark py-2.5 px-4.5 sm:py-3 sm:px-6 text-sm sm:text-base rounded-md hover:bg-opacity-95 transition-colors"
                >
                  Add to Wishlist
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 mt-6">
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
                          <ul className="list-disc pl-5 space-y-2">
                            {children}
                          </ul>
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
                            className="text-blue hover:underline"
                          >
                            {children}
                          </a>
                        ),
                      },
                    }}
                  />
                ) : product?.description &&
                  typeof product.description === "string" &&
                  product.description.trim() !== "" ? (
                  <p>{product.description}</p>
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
    </div>
  );
};

export default QuickViewModal;

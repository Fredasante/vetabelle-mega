"use client";
import React, { useEffect, useState } from "react";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { toast } from "sonner";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const [quantity, setQuantity] = useState(1);

  // Get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);
  const dispatch = useDispatch<AppDispatch>();

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Add to cart
  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addItemToCart({
        _id: product._id,
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.image,
        quantity,
      })
    );
    toast.success(`${quantity} ${product.title} added to cart!`);
    closeModal();
    setQuantity(1);
  };

  // Add to wishlist
  const handleAddToWishlist = () => {
    if (!product) return;

    dispatch(
      addItemToWishlist({
        _id: product._id,
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.image,
        status: product.status,
        description: product.description,
        slug: product.slug,
        createdAt: product.createdAt,
      })
    );
    toast.success("Added to wishlist!");
    closeModal();
  };

  useEffect(() => {
    // Closing modal while clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (
        !event.target ||
        !(event.target as HTMLElement).closest(".modal-content")
      ) {
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

  if (!product) return null;

  return (
    <div
      className={`${
        isModalOpen ? "z-99999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={closeModal}
            aria-label="Close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-12.5">
            {/* Main Image */}
            <div className="max-w-[526px] w-full">
              <div className="relative z-1 overflow-hidden flex items-center justify-center w-full h-[300px] sm:h-[400px] lg:h-[508px] bg-gray-1 rounded-lg border border-gray-3">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="object-contain w-full h-full max-h-[280px] sm:max-h-[380px] lg:max-h-[480px]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="max-w-[445px] w-full">
              <h3 className="font-semibold text-xl xl:text-heading-5 text-dark mb-4">
                {product.title}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-dark xl:text-heading-5">
                    ₵{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="font-medium text-dark-4 xl:text-xl line-through">
                      ₵{product.price}
                    </span>
                  )}
                </span>
              </div>

              {/* Status */}
              <div className="mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    product.status === "in-stock"
                      ? "bg-green-light-6 text-green-dark"
                      : "bg-red-light-6 text-red-dark"
                  }`}
                >
                  {product.status === "in-stock" ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-7.5">
                <h4 className="font-semibold text-lg text-slate-500">
                  Quantity:
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecrease}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="flex items-center justify-center w-12 h-10 rounded-[5px] border border-gray-3 bg-white font-medium text-dark">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.status !== "in-stock"}
                  className="inline-flex font-medium text-white bg-[#c77f56] py-2.5 px-4.5 sm:py-3 sm:px-7 text-sm sm:text-base rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className="inline-flex items-center gap-2 font-medium text-white bg-teal py-2.5 px-4.5 sm:py-3 sm:px-6 text-sm sm:text-base rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Add to Wishlist
                </button>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none text-gray-700">
                {Array.isArray(product.description) &&
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
                            href={value?.href}
                            className="text-blue hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
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
    </div>
  );
};

export default QuickViewModal;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { useAppSelector } from "@/redux/store";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import SingleItem from "./SingleItem";
import Link from "next/link";
import EmptyCart from "./EmptyCart";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Handle viewport height changes (for iOS Safari URL bar)
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    // Also listen for orientation changes on mobile
    window.addEventListener("orientationchange", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);

  // Reset scroll position when modal opens
  useEffect(() => {
    if (isCartModalOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isCartModalOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !event.target ||
        !(event.target as HTMLElement).closest(".modal-content")
      ) {
        closeCartModal();
      }
    }

    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen, closeCartModal]);

  const formatCedis = (amount: number) => `₵ ${amount.toFixed(2)}`;

  return (
    <div
      className={`fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full bg-dark/70 ease-linear duration-300 ${
        isCartModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ height: viewportHeight || "100vh" }}
    >
      <div className="flex items-center justify-end h-full">
        <div
          className="w-full max-w-[500px] shadow-1 bg-white relative modal-content flex flex-col"
          style={{ height: viewportHeight || "100vh" }}
        >
          {/* Header */}
          <div className="flex-shrink-0 bg-white flex items-center justify-between pb-7 pt-4 sm:pt-7.5 lg:pt-11 px-4 sm:px-7.5 lg:px-11 border-b border-gray-3">
            <h2 className="font-medium text-dark text-lg sm:text-2xl">
              Cart View
            </h2>
            <button
              onClick={closeCartModal}
              aria-label="Close cart modal"
              className="flex items-center justify-center ease-in w-6 h-6 p-2 rounded-full duration-150 bg-gray-2 text-slate-400 hover:text-dark"
            >
              ✕
            </button>
          </div>

          {/* Cart Items - Scrollable */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-7.5 lg:px-11 py-7.5 min-h-0"
          >
            <div className="flex flex-col gap-6">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <SingleItem key={item._id || index} item={item} />
                ))
              ) : (
                <EmptyCart />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-3 bg-white pt-5 pb-4 sm:pb-7.5 lg:pb-11 px-4 sm:px-7.5 lg:px-11">
            <div className="flex items-center justify-between gap-5 mb-6">
              <p className="font-medium text-xl text-dark">Subtotal:</p>
              <p className="font-medium text-xl text-dark">
                {formatCedis(totalPrice)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                onClick={closeCartModal}
                href="/cart"
                className="w-full flex justify-center font-medium text-white bg-blue py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                View Cart
              </Link>

              <Link
                href="/checkout"
                className="w-full flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarModal;

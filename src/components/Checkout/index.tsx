"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useAppSelector } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import {
  initializePaystackPayment,
  generatePaymentReference,
  verifyPaystackPayment,
} from "@/lib/paystack";
import { CircleCheck } from "lucide-react";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";

const generateKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const Checkout = () => {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const cartItems = useAppSelector(selectCartItems);
  const itemsTotal = useSelector(selectTotalPrice);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  const total = itemsTotal - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const orderId = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;
      const paymentReference = generatePaymentReference(orderId);

      const orderData = {
        orderId,
        customerInfo: {
          fullName: formData.get("fullName") as string,
          phone: formData.get("phone") as string,
          email:
            (formData.get("email") as string) ||
            user?.primaryEmailAddress?.emailAddress ||
            "",
          userId: user?.id || null,
        },
        deliveryInfo: {
          region: formData.get("region") as string,
          city: formData.get("city") as string,
          address: formData.get("address") as string,
        },
        items: cartItems.map((item) => ({
          _key: generateKey(),
          product: { _ref: item._id, _type: "reference" },
          productSnapshot: {
            name: item.name,
            price: item.price,
            discountPrice: item.discountPrice,
            mainImageUrl: item.mainImageUrl,
            size: item.size || null,
            color: item.color || null,
          },
          quantity: item.quantity,
          priceAtPurchase: item.discountPrice ?? item.price,
        })),
        pricing: {
          subtotal: itemsTotal,
          discount,
          total,
          couponCode: couponCode || null,
        },
        payment: {
          method: "paystack",
          status: "pending",
          paystackReference: paymentReference,
          amount: total,
          paidAt: null,
        },
        deliveryStatus: "payment_pending",
        confirmation: {
          isConfirmed: false,
          confirmedBy: null,
          confirmedAt: null,
          deliveryDateAgreed: null,
        },
        customerNotes: (formData.get("notes") as string) || "",
        adminNotes: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      initializePaystackPayment({
        email: orderData.customerInfo.email || "customer@example.com",
        amount: total,
        reference: paymentReference,
        metadata: {
          orderId,
          customerName: orderData.customerInfo.fullName,
          phone: orderData.customerInfo.phone,
          items: cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.discountPrice ?? item.price,
          })),
        },
        onSuccess: async (transaction) => {
          try {
            const verification = await verifyPaystackPayment(
              transaction.reference
            );

            if (!verification.success) {
              throw new Error("Payment verification failed");
            }

            orderData.payment.status = "paid";
            orderData.payment.paidAt = new Date().toISOString();
            orderData.deliveryStatus = "payment_received";

            sessionStorage.setItem(
              `order_${orderId}`,
              JSON.stringify(orderData)
            );

            // Create the order in Sanity
            const response = await fetch("/api/orders/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData),
            });

            if (!response.ok) {
              throw new Error("Failed to create order");
            }

            const result = await response.json();

            // Update all products in cart to "sold" status
            const updatePromises = cartItems.map((item) =>
              fetch("/api/products/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  productId: item._id,
                  status: "sold",
                }),
              })
            );

            // Wait for all product updates to complete
            const updateResults = await Promise.allSettled(updatePromises);

            // Log any failures (optional)
            updateResults.forEach((result, index) => {
              if (result.status === "rejected") {
                console.error(
                  `Failed to update product ${cartItems[index]._id}:`,
                  result.reason
                );
              }
            });

            // Clear the cart
            dispatch(removeAllItemsFromCart());

            // Redirect to success page
            router.push(
              `/order-success?orderId=${orderId}&reference=${transaction.reference}`
            );
          } catch (error) {
            console.error("Post-payment error:", error);
            alert(
              "Payment was successful but there was an error processing your order. Please contact support with reference: " +
                transaction.reference
            );
            setIsProcessing(false);
          }
        },
        onCancel: () => {
          setIsProcessing(false);
          alert("Payment was cancelled. Your order has not been placed.");
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        "Something went wrong. Please try again or contact us on WhatsApp."
      );
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <>
        <section className="overflow-hidden py-20 bg-gray-2 mt-10">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex justify-center items-center min-h-[400px]">
              <ClipLoader size={32} color="#000080" />
            </div>
          </div>
        </section>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <section className="overflow-hidden py-20 bg-gray-2 mt-45 md:mt-50">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some products to your cart before proceeding to checkout.
              </p>
              <Link
                href="/shop"
                className="inline-block font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="overflow-hidden py-10 bg-gray-2 mt-45 md:mt-50 md:pb-10 lg:pb-18">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {!isSignedIn && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-7.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-dark mb-1.5">
                    Checkout as Guest or Sign In
                  </h3>
                  <p className="text-sm text-gray-600">
                    Complete your order as a guest, or sign in to track orders
                    easily
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/signin?redirect_url=/checkout"
                    className="inline-flex items-center justify-center font-medium text-white bg-blue py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup?redirect_url=/checkout"
                    className="inline-flex items-center justify-center font-medium text-blue bg-white border border-blue py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue hover:text-white whitespace-nowrap"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          )}

          {isSignedIn && user && (
            <div className="bg-white border-none shadow-sm rounded-lg p-5 mb-7.5">
              <div className="flex items-center  gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <CircleCheck className="w-6 h-6 text-green-dark" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Your order will be saved to your account for easy tracking
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              <div className="lg:max-w-[670px] w-full">
                <Billing isGuest={!isSignedIn} />
              </div>

              <div className="max-w-[455px] w-full mt-3 md:mt-5 lg:mt-20">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Order Summary
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {cartItems.map((item) => {
                      const itemPrice = item.discountPrice ?? item.price;
                      const itemTotal = itemPrice * item.quantity;

                      return (
                        <div
                          key={item._id}
                          className="flex items-start justify-between gap-4 py-4 border-b border-gray-3"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            {item.mainImageUrl && (
                              <div className="relative w-16 h-16 flex-shrink-0 rounded bg-gray-1">
                                <Image
                                  src={item.mainImageUrl}
                                  alt={item.name}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-dark text-sm font-medium mb-1">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} x GH₵{itemPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="text-dark font-medium">
                            GH₵{itemTotal.toFixed(2)}
                          </p>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between py-4 border-b border-gray-3">
                      <p className="text-dark">Subtotal</p>
                      <p className="text-dark">GH₵{itemsTotal.toFixed(2)}</p>
                    </div>

                    {discount > 0 && (
                      <div className="flex items-center justify-between py-4 border-b border-gray-3">
                        <p className="text-green-600">
                          Discount {couponCode && `(${couponCode})`}
                        </p>
                        <p className="text-green-600">
                          -GH₵{discount.toFixed(2)}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-4 border-b border-gray-3 bg-blue-50 -mx-4 sm:-mx-8.5 px-4 sm:px-8.5">
                      <div>
                        <p className="font-semibold text-dark">Total Amount</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Payment for items only
                        </p>
                      </div>
                      <p className="font-semibold text-lg text-blue">
                        GH₵{total.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs text-yellow-800">
                        <strong>Note:</strong> Delivery fee will be collected
                        separately by the rider upon delivery
                      </p>
                    </div>
                  </div>
                </div>

                <Coupon onApplyCoupon={setDiscount} />

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex justify-center items-center gap-2 font-medium text-white bg-blue py-3.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <ClipLoader size={20} color="#ffffff" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CircleCheck className="w-4 h-4" />
                      <span>Pay GH₵{total.toFixed(2)} Now</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-600 mt-4">
                  🔒 Secure payment via Paystack • Choose Card or Mobile Money
                  in checkout
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;

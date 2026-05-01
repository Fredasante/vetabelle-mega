"use client";
import React, { useState } from "react";
import { calculateItemPrice } from "@/lib/pricing";
import { computeOrderHash } from "@/lib/orderHash";
import Billing from "./Billing";
import FulfillmentMethod, {
  FulfillmentType,
  PICKUP_LOCATIONS,
} from "./FulfillmentMethod";
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
  const { user, isLoaded } = useUser();
  const cartItems = useAppSelector(selectCartItems);
  const itemsTotal = useSelector(selectTotalPrice);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentType>("delivery");
  const dispatch = useDispatch();

  const total = itemsTotal;

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

      const isPickup = fulfillmentMethod !== "delivery";

      const customerInfo = {
        fullName: formData.get("fullName") as string,
        phone: formData.get("phone") as string,
        email:
          (formData.get("email") as string) ||
          user?.primaryEmailAddress?.emailAddress ||
          "",
      };
      const deliveryInfo = isPickup
        ? undefined
        : {
            region: formData.get("region") as string,
            city: formData.get("city") as string,
            address: formData.get("address") as string,
          };

      const orderHash = await computeOrderHash({
        items: cartItems,
        email: customerInfo.email,
        fulfillmentMethod,
        deliveryInfo,
      });

      const orderData = {
        orderId,
        fulfillmentMethod,
        customerInfo,
        ...(deliveryInfo ? { deliveryInfo } : {}),
        items: cartItems.map((item) => ({
          _key: generateKey(),
          product: { _ref: item._id, _type: "reference" },
          productSnapshot: {
            title: item.title,
            price: item.price,
            discountPrice: item.discountPrice,
            image: item.image,
          },
          quantity: item.quantity,
          priceAtPurchase: item.discountPrice ?? item.price,
        })),
        pricing: {
          subtotal: itemsTotal,
          discount: 0,
          total,
        },
        payment: {
          method: "paystack",
          status: "pending",
          paystackReference: paymentReference,
          amount: total,
          paidAt: undefined,
        },
        deliveryStatus: "payment_pending",
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
          orderHash,
          intendedUserId: user?.id ?? "",
          items: cartItems.map((item) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.discountPrice ?? item.price,
          })),
        },
        onSuccess: async (transaction) => {
          try {
            const verification = await verifyPaystackPayment(
              transaction.reference,
            );

            if (!verification.success) {
              throw new Error("Payment verification failed");
            }

            orderData.payment.status = "paid";
            orderData.payment.paidAt = new Date().toISOString();
            orderData.deliveryStatus = "payment_received";

            sessionStorage.setItem(
              `order_${orderId}`,
              JSON.stringify(orderData),
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

            // Clear the cart
            dispatch(removeAllItemsFromCart());

            // Redirect to success page
            router.push(
              `/order-success?orderId=${orderId}&reference=${transaction.reference}`,
            );
          } catch (error) {
            console.error("Post-payment error:", error);
            alert(
              "Payment was successful but there was an error processing your order. Please contact support with reference: " +
                transaction.reference,
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
        "Something went wrong. Please try again or contact us on WhatsApp.",
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
              <ClipLoader size={32} color="#c77f56" />
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
                className="inline-block font-medium text-white bg-[#c77f56] py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
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
      <section className="overflow-hidden py-10 bg-gray-2 pt-40 md:pt-50 md:pb-10 lg:pb-18">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              <div className="lg:max-w-[670px] w-full">
                <FulfillmentMethod
                  selected={fulfillmentMethod}
                  onChange={setFulfillmentMethod}
                />

                <div className="mt-7">
                  <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
                    Contact Information
                  </h2>

                  <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                    {/* Full Name */}
                    <div className="mb-5">
                      <label htmlFor="fullName" className="block mb-2.5">
                        Full Name <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Enter your full name"
                        required
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-5">
                      <label htmlFor="phone" className="block mb-2.5">
                        Phone Number <span className="text-red">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="024 123 4567"
                        required
                        pattern="[0-9]{10}"
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                      <p className="text-xs text-gray-600 mt-1.5">
                        For contact and mobile money payment
                      </p>
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label htmlFor="email" className="block mb-2.5">
                        Email Address <span className="text-dark-5">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="your.email@example.com"
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                      <p className="text-xs text-gray-600 mt-1.5">
                        For order confirmation and updates
                      </p>
                    </div>
                  </div>
                </div>

                {fulfillmentMethod === "delivery" && (
                  <Billing />
                )}
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
                      const itemTotal = calculateItemPrice(item, item.quantity);
                      const effectiveUnitPrice = itemTotal / item.quantity;

                      return (
                        <div
                          key={item._id}
                          className="flex items-start justify-between gap-4 py-4 border-b border-gray-3"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            {item.image && (
                              <div className="relative w-16 h-16 flex-shrink-0 rounded bg-gray-1">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-dark text-sm font-medium mb-1">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} x ₵
                                {effectiveUnitPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="text-dark font-medium">
                            ₵{itemTotal.toFixed(2)}
                          </p>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between py-4 border-b border-gray-3">
                      <p className="text-dark">Subtotal</p>
                      <p className="text-dark">₵{itemsTotal.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-3 bg-blue-50 -mx-4 sm:-mx-8.5 px-4 sm:px-8.5">
                      <div>
                        <p className="font-semibold text-dark">Total Amount</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Payment for items only
                        </p>
                      </div>
                      <p className="font-semibold text-lg text-[#c77f56]">
                        ₵{total.toFixed(2)}
                      </p>
                    </div>

                    {fulfillmentMethod === "delivery" ? (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-xs text-yellow-800">
                          <strong>Note:</strong> Delivery fee will be collected
                          separately by the rider upon delivery
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-xs text-green-800">
                          <strong>Pickup:</strong> No delivery fee — collect
                          your order at{" "}
                          {
                            PICKUP_LOCATIONS[
                              fulfillmentMethod as Exclude<
                                FulfillmentType,
                                "delivery"
                              >
                            ]?.name
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex justify-center items-center gap-2 font-medium text-white bg-[#c77f56] py-3.5 px-6 rounded-md ease-out duration-200 hover:bg-opacity-90 mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <ClipLoader size={20} color="#ffffff" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CircleCheck className="w-4 h-4" />
                      <span>Pay ₵{total.toFixed(2)} Now</span>
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

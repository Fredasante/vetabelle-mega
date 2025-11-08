"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CircleCheck,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Printer,
} from "lucide-react";
import { ClipLoader } from "react-spinners";

interface OrderDetails {
  orderId: string;
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
  };
  deliveryInfo: {
    region: string;
    city: string;
    address: string;
  };
  items: Array<{
    productSnapshot: {
      title: string;
      price: number;
      discountPrice?: number;
      image?: string;
    };
    quantity: number;
    priceAtPurchase: number;
  }>;
  pricing: {
    subtotal: number;
    discount: number;
    total: number;
    couponCode?: string | null;
  };
  payment: {
    method: string;
    status: string;
    paystackReference: string;
    amount: number;
  };
  deliveryStatus: string;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const reference = searchParams.get("reference");

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError("Unable to load order details. Please contact support.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  if (loading) {
    return (
      <section className="overflow-hidden mt-28">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 rounded-lg">
          <div className="flex justify-center items-center min-h-[400px]">
            <ClipLoader size={32} color="#c77f56" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !orderDetails) {
    return (
      <section className="overflow-hidden mt-45 mb-5 md:mt-50 md:mb-10 lg:mb-15">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0 bg-gray-2 rounded-lg">
          <div className="shadow-1 rounded-[10px] p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Unable to Load Order
            </h3>
            <p className="text-gray-600 mb-6">{error || "Order not found"}</p>
            <Link
              href="/"
              className="inline-block font-medium text-white bg-teal py-3 px-8 rounded-md ease-out duration-200 hover:bg-teal-dark"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden py-5 md:py-10 lg:py-12 bg-gray-2 mt-45 mb-5 md:mt-50 md:mb-10 lg:mb-15">
      <div className="max-w-[900px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Success Banner */}
        <div className="bg-white shadow-1 rounded-[10px] p-6 sm:p-10 mb-7.5 text-center">
          <div className="w-20 h-20 bg-green-light-6 rounded-full flex items-center justify-center mx-auto mb-5">
            <CircleCheck className="w-12 h-12 text-green-dark" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-3">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-600 mb-2">
            Thank you for your order! We&apos;ve received your payment and will
            contact you shortly to confirm delivery details.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Order ID:{" "}
            <span className="font-mono font-semibold text-[#c77f56]">
              {orderId}
            </span>
          </p>
          {reference && (
            <p className="text-xs text-gray-500 mt-1">
              Payment Reference: <span className="font-mono">{reference}</span>
            </p>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white shadow-1 rounded-[10px] p-6 sm:p-8 mb-7.5">
          <h2 className="text-xl font-semibold text-dark mb-5 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#c77f56]" />
            Order Details
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {orderDetails.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 pb-4 border-b border-gray-3"
              >
                {item.productSnapshot.image && (
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-2 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.productSnapshot.image}
                      alt={item.productSnapshot.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark truncate">
                    {item.productSnapshot.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} × ₵{item.priceAtPurchase.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium text-dark flex-shrink-0">
                  ₵{(item.priceAtPurchase * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="space-y-2 pt-4 border-t border-gray-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-dark">
                ₵{orderDetails.pricing.subtotal.toFixed(2)}
              </span>
            </div>
            {orderDetails.pricing.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">
                  Discount
                  {orderDetails.pricing.couponCode && (
                    <span className="ml-1 text-xs">
                      ({orderDetails.pricing.couponCode})
                    </span>
                  )}
                </span>
                <span className="text-green-600">
                  -₵{orderDetails.pricing.discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-3">
              <span className="text-dark">Total Paid</span>
              <span className="text-teal">
                ₵{orderDetails.pricing.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Delivery fee will be collected separately
              by the rider upon delivery
            </p>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white shadow-1 rounded-[10px] p-6 sm:p-8 mb-7.5">
          <h2 className="text-xl font-semibold text-dark mb-5 flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal" />
            Delivery Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-dark mb-1">Delivery Address</p>
                <p className="text-sm text-gray-600">
                  {orderDetails.deliveryInfo.address}
                  <br />
                  {orderDetails.deliveryInfo.city},{" "}
                  {orderDetails.deliveryInfo.region}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-dark mb-1">Contact Person</p>
                <p className="text-sm text-gray-600">
                  {orderDetails.customerInfo.fullName}
                  <br />
                  {orderDetails.customerInfo.phone}
                </p>
              </div>
            </div>

            {orderDetails.customerInfo.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-dark mb-1">Email</p>
                  <p className="text-sm text-gray-600">
                    {orderDetails.customerInfo.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-6 mb-7.5">
          <h3 className="font-semibold text-dark mb-3">What happens next?</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-teal font-semibold">1.</span>
              <span>
                Our team will review your order and contact you within 24 hours
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-semibold">2.</span>
              <span>
                We&apos;ll confirm the delivery date and time that works for you
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-semibold">3.</span>
              <span>
                Your order will be carefully prepared and delivered to your
                address
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-semibold">4.</span>
              <span>
                Delivery fee will be collected by the rider on delivery
              </span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handlePrint}
            className="flex-1 flex justify-center items-center gap-2 font-medium text-white bg-[#c77f56] py-3 px-6 rounded-md ease-out duration-200 hover:bg-opacity-90 hover:text-white print:hidden"
          >
            <Printer className="w-5 h-5" />
            Print Order
          </button>
          <Link
            href="/shop"
            className="flex-1 flex justify-center items-center font-medium text-white bg-teal py-3 px-6 rounded-md ease-out duration-200 hover:bg-teal-dark print:hidden"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support Section */}
        <div className="mt-7.5 text-center print:hidden">
          <p className="text-sm text-gray-600 mb-2">
            Need help with your order?
          </p>
          <a
            href="https://wa.me/233548182872"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green hover:text-green-dark font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

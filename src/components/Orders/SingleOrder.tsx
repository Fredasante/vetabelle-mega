"use client";
import React, { useState } from "react";
import {
  Eye,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

interface Order {
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
      name: string;
      price: number;
      discountPrice?: number;
      mainImageUrl?: string;
    };
    quantity: number;
    priceAtPurchase: number;
  }>;
  pricing: {
    subtotal: number;
    discount: number;
    total: number;
  };
  payment: {
    method: string;
    status: string;
    amount: number;
  };
  deliveryStatus: string;
  createdAt: string;
}

const SingleOrder = ({ order, isLast }: { order: Order; isLast: boolean }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          color: "bg-green-light-6 text-green-dark border-green-light-3",
          label: "Delivered",
          icon: "✓",
        };
      case "out_for_delivery":
        return {
          color: "bg-blue-light-6 text-blue-dark border-blue-light-3",
          label: "Out for Delivery",
          icon: "🚚",
        };
      case "preparing":
        return {
          color: "bg-yellow-light-4 text-yellow-dark border-yellow-light-2",
          label: "Preparing",
          icon: "📦",
        };
      case "confirmed":
        return {
          color: "bg-purple-light-6 text-purple-dark border-purple-light-3",
          label: "Confirmed",
          icon: "✓",
        };
      case "payment_received":
        return {
          color: "bg-green-light-6 text-green-dark border-green-light-3",
          label: "Payment Received",
          icon: "✓",
        };
      case "payment_pending":
        return {
          color: "bg-orange-light-6 text-orange-dark border-orange-light-3",
          label: "Payment Pending",
          icon: "⏳",
        };
      case "cancelled":
        return {
          color: "bg-red-light-6 text-red border-red-light-3",
          label: "Cancelled",
          icon: "✗",
        };
      default:
        return {
          color: "bg-gray-1 text-gray-600 border-gray-3",
          label: status.replace(/_/g, " "),
          icon: "•",
        };
    }
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const statusConfig = getStatusConfig(order.deliveryStatus);

  return (
    <div
      className={`bg-white ${
        !isLast ? "border-b lg:border-b-0" : ""
      } lg:border lg:border-gray-3 ${
        showDetails ? "lg:rounded-none" : isLast ? "lg:rounded-b-xl" : ""
      }`}
    >
      {/* Desktop View */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 py-5 px-6 items-center hover:bg-gray-1 transition-colors">
        <div className="col-span-2">
          <p className="text-sm font-semibold text-blue">
            #{order.orderId.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="col-span-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(order.createdAt)}</span>
          </div>
        </div>

        <div className="col-span-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-full border ${statusConfig.color}`}
          >
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </span>
        </div>

        <div className="col-span-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        <div className="col-span-2">
          <p className="text-sm font-semibold text-dark">
            GH₵{order.pricing.total.toFixed(2)}
          </p>
        </div>

        <div className="col-span-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-blue hover:text-blue-dark transition-colors text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-blue mb-1">
              #{order.orderId.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-600">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-full border ${statusConfig.color}`}
          >
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-sm mb-3 pb-3 border-b border-gray-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-4 h-4" />
            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>
          <p className="font-semibold text-dark">
            GH₵{order.pricing.total.toFixed(2)}
          </p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 text-blue hover:text-blue-dark transition-colors text-sm font-medium py-2 border border-blue rounded-lg hover:bg-blue-light-6"
        >
          <Eye className="w-4 h-4" />
          <span>{showDetails ? "Hide" : "View"} Details</span>
          {showDetails ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Order Details Expandable Section */}
      {showDetails && (
        <div className="border-t border-gray-3 bg-gray-1 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-dark mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items
              </h4>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 bg-white p-3 rounded-lg"
                  >
                    {item.productSnapshot.mainImageUrl && (
                      <div className="relative w-16 h-16 flex-shrink-0 rounded bg-gray-1">
                        <Image
                          src={item.productSnapshot.mainImageUrl}
                          alt={item.productSnapshot.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark truncate">
                        {item.productSnapshot.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Qty: {item.quantity} × GH₵
                        {item.priceAtPurchase.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold text-dark mt-1">
                        GH₵{(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="mt-4 bg-white p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-dark">
                    GH₵{order.pricing.subtotal.toFixed(2)}
                  </span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green">
                      -GH₵{order.pricing.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-3">
                  <span className="text-dark">Total</span>
                  <span className="text-blue">
                    GH₵{order.pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div className="space-y-4">
              {/* Delivery Information */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-dark mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="text-dark font-medium">
                      {order.customerInfo.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="text-dark font-medium">
                      {order.customerInfo.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="text-dark font-medium">
                      {order.deliveryInfo.city}, {order.deliveryInfo.region}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="text-dark">{order.deliveryInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-dark mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="text-dark font-medium capitalize">
                      {order.payment.method.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`font-medium capitalize ${
                        order.payment.status === "paid"
                          ? "text-green"
                          : "text-orange"
                      }`}
                    >
                      {order.payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="text-dark font-medium">
                      GH₵{order.payment.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleOrder;

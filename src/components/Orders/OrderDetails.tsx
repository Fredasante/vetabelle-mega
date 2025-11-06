"use client";
import React from "react";
import { X, Package, MapPin, Phone, Mail } from "lucide-react";
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

const OrderDetails = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  return (
    <div className="p-4 sm:p-7.5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-dark">Order Details</h3>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-dark ease-out duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue" />
            <h4 className="font-medium text-dark">Order Items</h4>
          </div>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white rounded-lg"
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
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark mb-1">
                    {item.productSnapshot.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Qty: {item.quantity} × GH₵{item.priceAtPurchase.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-medium text-dark">
                  GH₵{(item.priceAtPurchase * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="mt-4 p-3 bg-white rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-dark">
                GH₵{order.pricing.subtotal.toFixed(2)}
              </span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600">
                  -GH₵{order.pricing.discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t border-gray-3">
              <span className="text-dark">Total</span>
              <span className="text-blue">
                GH₵{order.pricing.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery & Contact Info */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue" />
              <h4 className="font-medium text-dark">Delivery Address</h4>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-dark">
                {order.deliveryInfo.address}
                <br />
                {order.deliveryInfo.city}, {order.deliveryInfo.region}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-blue" />
              <h4 className="font-medium text-dark">Contact Information</h4>
            </div>
            <div className="p-3 bg-white rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-dark">{order.customerInfo.phone}</p>
              </div>
              {order.customerInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-dark">
                    {order.customerInfo.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h4 className="font-medium text-dark mb-3">Payment Information</h4>
            <div className="p-3 bg-white rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-dark capitalize">
                  {order.payment.method}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Status</span>
                <span
                  className={`capitalize ${
                    order.payment.status === "paid" ? "text-green" : "text-red"
                  }`}
                >
                  {order.payment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Fee Notice */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Delivery fee will be collected separately
              by the rider upon delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

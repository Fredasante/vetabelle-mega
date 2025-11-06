"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ClipLoader } from "react-spinners";
import SingleOrder from "./SingleOrder";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";

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

const Orders = () => {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/user/${user.id}`);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please sign in to view your orders");
          }
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load orders. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ClipLoader size={32} color="#000080" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-light-6 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-blue" />
          </div>
          <h3 className="text-xl font-semibold text-dark mb-3">
            Sign In Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please sign in to view and track your orders.
          </p>
          <Link
            href="/signin?redirect_url=/orders"
            className="inline-block font-medium text-white bg-blue py-3 px-8 rounded-lg ease-out duration-200 hover:bg-blue-dark"
          >
            Sign In to View Orders
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block font-medium text-white bg-blue py-2.5 px-6 rounded-lg ease-out duration-200 hover:bg-blue-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-dark mb-3">
            No Orders Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven&apos;t placed any orders yet. Start shopping to see your
            orders here!
          </p>
          <Link
            href="/shop"
            className="inline-block font-medium text-white bg-blue py-3 px-8 rounded-lg ease-out duration-200 hover:bg-blue-dark"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 px-4 sm:px-6">
        <h2 className="text-2xl font-semibold text-dark mb-2">My Orders</h2>
        <p className="text-gray-600">
          Track and manage your orders ({orders.length}{" "}
          {orders.length === 1 ? "order" : "orders"})
        </p>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden lg:block bg-white rounded-t-xl border border-gray-3">
        <div className="grid grid-cols-12 gap-4 py-4 px-6 border-b border-gray-3 bg-gray-1">
          <div className="col-span-2">
            <p className="text-sm font-semibold text-dark">Order ID</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-semibold text-dark">Date</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-semibold text-dark">Status</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-semibold text-dark">Items</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-semibold text-dark">Total</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-semibold text-dark">Action</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4 lg:space-y-0">
        {orders.map((order, index) => (
          <SingleOrder
            key={order.orderId}
            order={order}
            isLast={index === orders.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Orders;

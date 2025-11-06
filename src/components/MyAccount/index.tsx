"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Orders from "../Orders";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface Order {
  orderId: string;
  pricing: {
    total: number;
  };
  payment: {
    status: string;
  };
  deliveryStatus: string;
  createdAt: string;
}

const MyAccount = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoggingOut(false);
    }
  };

  const formatMemberSince = (createdAt: number | Date) => {
    const timestamp =
      createdAt instanceof Date ? createdAt.getTime() : createdAt;
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Calculate order statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (o) => o.deliveryStatus === "delivered"
  ).length;
  const pendingOrders = orders.filter(
    (o) => o.deliveryStatus !== "delivered" && o.deliveryStatus !== "cancelled"
  ).length;
  const totalSpent = orders
    .filter((o) => o.payment.status === "paid")
    .reduce((sum, order) => sum + order.pricing.total, 0);

  // Get recent orders (last 3)
  const recentOrders = orders.slice(0, 3);

  if (!isLoaded) {
    return (
      <>
        <section className="overflow-hidden py-20 bg-gray-2 mt-45 mb-5 md:mt-50 md:mb-10 lg:mb-15">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex justify-center items-center min-h-[400px]">
              <ClipLoader size={28} color="#000080" />
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <>
      <section className="overflow-hidden py-5 sm:py-7 bg-gray-2 mt-45 mb-5 md:mt-50 md:mb-10 lg:mb-15">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-5 lg:gap-7.5">
            {/* Sidebar */}
            <div className="xl:max-w-[320px] w-full">
              <div className="bg-white rounded-xl shadow-1 sticky top-4">
                {/* User Info - Mobile & Desktop */}
                <div className="flex items-center gap-4 p-5 border-b border-gray-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-blue-light-6 flex items-center justify-center flex-shrink-0">
                    {user.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName || "User"}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xl sm:text-2xl font-bold text-blue">
                        {user.firstName?.charAt(0) ||
                          user.username?.charAt(0) ||
                          "U"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark mb-1 truncate text-sm sm:text-base">
                      {user.fullName || user.username || "User"}
                    </p>
                    <p className="text-xs text-gray-600">
                      Member Since{" "}
                      {formatMemberSince(user.createdAt || Date.now())}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="p-5">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`w-full flex items-center gap-3 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 ${
                        activeTab === "dashboard"
                          ? "text-white bg-blue shadow-sm"
                          : "text-gray-700 bg-gray-1 hover:bg-gray-2 hover:text-dark"
                      }`}
                    >
                      <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full flex items-center gap-3 rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 ${
                        activeTab === "orders"
                          ? "text-white bg-blue shadow-sm"
                          : "text-gray-700 bg-gray-1 hover:bg-gray-2 hover:text-dark"
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                      <span>Orders</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center gap-3 rounded-lg py-3 px-4 text-sm font-medium text-gray-700 bg-gray-1 hover:bg-red hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <ClipLoader size={18} color="#ffffff" />
                      ) : (
                        <>
                          <LogOut className="w-5 h-5 flex-shrink-0" />
                          <span>Logout</span>
                        </>
                      )}
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 md:mt-4">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="space-y-5 lg:space-y-6">
                  {/* Welcome Card */}
                  <div className="bg-white rounded-xl shadow-1 p-5 sm:p-6 lg:p-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-dark mb-2">
                      Welcome back, {user.firstName || user.username}!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Here&apos;s an overview of your account activity
                    </p>
                  </div>

                  {/* Order Statistics */}
                  <div className="bg-white rounded-xl shadow-1 p-5 sm:p-6 lg:p-8">
                    {loadingOrders ? (
                      <div className="flex justify-center py-12">
                        <ClipLoader size={32} color="#000080" />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-dark mb-5">
                          Order Statistics
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                          {/* Total Orders */}
                          <div className="p-4 sm:p-5 bg-blue-light-6 rounded-lg border border-blue-light-3">
                            <div className="flex flex-col gap-2">
                              <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-2xl sm:text-3xl font-bold text-blue">
                                  {totalOrders}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  Total Orders
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Completed */}
                          <div className="p-4 sm:p-5 bg-green-light-6 rounded-lg border border-green-light-3">
                            <div className="flex flex-col gap-2">
                              <div className="w-10 h-10 bg-green rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-2xl sm:text-3xl font-bold text-green">
                                  {completedOrders}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* In Progress */}
                          <div className="p-4 sm:p-5 bg-yellow-light-4 rounded-lg border border-yellow-light-2">
                            <div className="flex flex-col gap-2">
                              <div className="w-10 h-10 bg-yellow rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-2xl sm:text-3xl font-bold text-yellow">
                                  {pendingOrders}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  In Progress
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Total Spent */}
                          <div className="p-4 sm:p-5 bg-purple-light-6 rounded-lg border border-purple-light-3">
                            <div className="flex flex-col gap-2">
                              <div className="w-10 h-10 bg-purple rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-xl sm:text-2xl font-bold text-purple truncate">
                                  GH₵{totalSpent.toFixed(0)}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  Total Spent
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Orders */}
                        {recentOrders.length > 0 && (
                          <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-base sm:text-lg font-semibold text-dark">
                                Recent Orders
                              </h3>
                              <button
                                onClick={() => setActiveTab("orders")}
                                className="text-xs sm:text-sm text-blue hover:text-blue-dark font-medium transition-colors"
                              >
                                View All →
                              </button>
                            </div>
                            <div className="space-y-3">
                              {recentOrders.map((order) => (
                                <div
                                  key={order.orderId}
                                  className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-gray-1 rounded-lg hover:bg-gray-2 transition-colors"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 bg-blue-light-6 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Truck className="w-5 h-5 text-blue" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-dark truncate">
                                        #{order.orderId.slice(-8).toUpperCase()}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {new Date(
                                          order.createdAt
                                        ).toLocaleDateString("en-GB")}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-semibold text-dark">
                                      GH₵{order.pricing.total.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-600 capitalize">
                                      {order.deliveryStatus.replace(/_/g, " ")}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-3">
                          <h3 className="text-base sm:text-lg font-semibold text-dark mb-4">
                            Quick Actions
                          </h3>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => setActiveTab("orders")}
                              className="flex items-center justify-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-lg transition-all duration-200 hover:bg-blue-dark text-sm sm:text-base"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>View All Orders</span>
                            </button>
                            <button
                              onClick={() => router.push("/shop")}
                              className="flex items-center justify-center gap-2 font-medium text-blue bg-blue-light-6 py-3 px-6 rounded-lg transition-all duration-200 hover:bg-blue-light-5 border border-blue-light-3 text-sm sm:text-base"
                            >
                              <Package className="w-4 h-4" />
                              <span>Continue Shopping</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Account Information */}
                  <div className="bg-white rounded-xl shadow-1 p-5 sm:p-6 lg:p-8">
                    <h3 className="text-base sm:text-lg font-semibold text-dark mb-4">
                      Account Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-gray-1 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            Email Address
                          </p>
                          <p className="text-sm sm:text-base font-medium text-dark break-words">
                            {user.primaryEmailAddress?.emailAddress ||
                              "No email added"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-gray-1 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            Phone Number
                          </p>
                          <p className="text-sm sm:text-base font-medium text-dark break-words">
                            {user.primaryPhoneNumber?.phoneNumber ||
                              "No phone added"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="bg-white rounded-xl shadow-1 p-4 sm:p-6">
                  <Orders />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";

interface UserOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuthStore();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) {
            setOrders(data.orders);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-void text-white">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "processing":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto text-white">
      {/* Account Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl tracking-wider text-white">
            MY ACCOUNT
          </h1>
          <p className="text-xs text-white/50 tracking-widest uppercase mt-1">
            Welcome back, {user.name}
          </p>
        </div>

        <div className="flex gap-4">
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="px-6 py-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-amber-500/30 transition-all"
            >
              ⚡ Admin Panel
            </Link>
          )}
          <button
            onClick={logout}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Information Card */}
        <div className="lg:col-span-4 bg-neutral-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl h-fit">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6 border-b border-white/10 pb-4">
            Profile Details
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <p className="text-white/50 uppercase text-[10px] tracking-wider mb-1">Full Name</p>
              <p className="text-white font-medium text-sm">{user.name}</p>
            </div>

            <div>
              <p className="text-white/50 uppercase text-[10px] tracking-wider mb-1">Email Address</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-white/50 uppercase text-[10px] tracking-wider mb-1">Phone</p>
              <p className="text-white font-medium">{user.phone || "Not set"}</p>
            </div>

            <div>
              <p className="text-white/50 uppercase text-[10px] tracking-wider mb-1">Default Address</p>
              <p className="text-white font-medium">
                {user.address ? `${user.address}, ${user.city || ""}` : "No default address saved"}
              </p>
            </div>

            <div>
              <p className="text-white/50 uppercase text-[10px] tracking-wider mb-1">Account Role</p>
              <span className="inline-block px-2.5 py-1 bg-white/10 rounded text-[10px] uppercase font-bold text-white tracking-widest">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-8 bg-neutral-900/60 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6 border-b border-white/10 pb-4">
            Order History ({orders.length})
          </h2>

          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-white/50">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/60 text-sm mb-4">You haven't placed any orders yet.</p>
              <Link
                href="/shop"
                className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-neutral-200 inline-block"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-black/40 border border-white/10 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-white">#{ord.orderNumber}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-1">
                      Placed on {new Date(ord.createdAt).toLocaleDateString()} | Method: {ord.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-sm font-bold text-white">
                      Rs. {ord.totalAmount.toLocaleString()}
                    </span>
                    <Link
                      href={`/order-success/${ord.id}`}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-lg border border-white/10 transition-colors"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

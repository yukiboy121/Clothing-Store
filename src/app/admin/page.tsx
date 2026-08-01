"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface AdminOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/");
      return;
    }

    if (user && user.role === "admin") {
      fetchOrders();
    }
  }, [user, isLoading, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-void text-white">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered").length;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto text-white">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
              ADMIN PORTAL
            </span>
            <h1 className="font-heading text-3xl md:text-5xl tracking-wider text-white">
              STORE MANAGEMENT
            </h1>
          </div>
          <p className="text-xs text-white/50 tracking-widest uppercase mt-1">
            Manage customer orders and update package status
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
        >
          Refresh Orders
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-neutral-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Total Orders</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{totalOrders}</p>
        </div>
        <div className="bg-neutral-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Total Revenue</p>
          <p className="text-2xl md:text-3xl font-bold text-emerald-400">
            Rs. {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-neutral-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Pending Orders</p>
          <p className="text-2xl md:text-3xl font-bold text-amber-400">{pendingOrders}</p>
        </div>
        <div className="bg-neutral-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Completed Deliveries</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-400">{deliveredOrders}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900/60 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-6">
          Customer Orders List ({orders.length})
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-white/50">Loading store orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-white/50">No orders found in store.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">#{ord.orderNumber}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-white">{ord.customerName}</p>
                      <p className="text-[10px] text-white/50">{ord.customerPhone}</p>
                    </td>
                    <td className="py-4 px-4 text-white/60">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      Rs. {ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="uppercase text-[10px] font-semibold text-white/80">
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="bg-black/60 border border-white/20 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-white uppercase"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/order-success/${ord.id}`}
                        className="text-xs text-white/70 hover:text-white underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

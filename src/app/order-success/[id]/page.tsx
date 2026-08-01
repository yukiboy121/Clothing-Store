"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface OrderDetail {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Order not found");
        }
        setOrder(data.order);
        setItems(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-void text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-white/50">Loading Order Details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-6 flex flex-col items-center justify-center bg-void text-white">
        <h1 className="font-heading text-3xl md:text-5xl mb-4">ORDER NOT FOUND</h1>
        <p className="text-white/60 mb-8">{error || "We couldn't retrieve this order."}</p>
        <Link
          href="/shop"
          className="px-8 py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Interactive status steps
  const statusSteps = ["pending", "processing", "shipped", "delivered"];
  const currentStepIndex = Math.max(0, statusSteps.indexOf(order.orderStatus.toLowerCase()));

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-[1100px] mx-auto text-white print:pt-6 print:pb-6 print:bg-white print:text-black">
      {/* Printable CSS styles */}
      <style jsx global>{`
        @media print {
          header, footer, .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-card {
            border: 1px solid #ccc !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-12 no-print"
      >
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-heading text-4xl md:text-6xl tracking-wider text-white mb-2">
          ORDER CONFIRMED!
        </h1>
        <p className="text-xs text-white/60 uppercase tracking-widest">
          Thank you for your order. We're processing your items.
        </p>
      </motion.div>

      {/* Live Order Tracking Visualizer */}
      <div className="bg-neutral-900/60 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl mb-10 no-print">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-8 text-center">
          Live Order Status: <span className="text-amber-400 uppercase font-bold">{order.orderStatus}</span>
        </h2>

        <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
          {/* Progress Bar Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0">
            <div
              className="h-full bg-emerald-400 transition-all duration-700"
              style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>

          {statusSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-400 text-black shadow-lg shadow-emerald-400/20"
                      : "bg-neutral-800 text-white/40 border border-white/10"
                  }`}
                >
                  {idx + 1}
                </div>
                <p
                  className={`text-[11px] uppercase tracking-wider mt-3 font-medium ${
                    isCurrent
                      ? "text-emerald-400 font-bold"
                      : isCompleted
                      ? "text-white"
                      : "text-white/40"
                  }`}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Invoice Card */}
      <div className="bg-neutral-900/80 border border-white/10 p-8 rounded-2xl backdrop-blur-xl print-card">
        {/* Printable Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-white/10 mb-6 gap-4">
          <div>
            <h2 className="font-heading text-2xl tracking-wider text-white">DRAGON GROUP LK</h2>
            <p className="text-xs text-white/50 print:text-gray-600">Official Order Invoice</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs font-bold text-white uppercase tracking-widest">
              Order #{order.orderNumber}
            </p>
            <p className="text-[11px] text-white/50 print:text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/10 mb-6 text-xs">
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-white/70 mb-2">Customer Details</h3>
            <p className="text-white font-medium">{order.customerName}</p>
            <p className="text-white/60">{order.customerEmail}</p>
            <p className="text-white/60">{order.customerPhone}</p>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-white/70 mb-2">Shipping Address</h3>
            <p className="text-white font-medium">{order.shippingAddress.address}</p>
            <p className="text-white/60">{order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
            {order.shippingAddress.notes && (
              <p className="text-white/40 italic mt-1">Note: {order.shippingAddress.notes}</p>
            )}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-4">Items Ordered</h3>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded-lg bg-white/5 no-print"
                  />
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-white/50 text-[11px]">
                      Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-white">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="flex justify-end border-t border-white/10 pt-6">
          <div className="w-full max-w-xs space-y-2 text-xs">
            <div className="flex justify-between text-white/70">
              <span>Subtotal</span>
              <span>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>- Rs. {order.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-white/70">
              <span>Payment Method</span>
              <span className="font-semibold text-white">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Payment Status</span>
              <span className="font-semibold uppercase text-emerald-400">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-white border-t border-white/10 pt-3 mt-3">
              <span>Total Paid / Payable</span>
              <span className="text-lg">Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center mt-8 gap-4 no-print">
        <button
          onClick={() => window.print()}
          className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-xl border border-white/15 transition-all flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Invoice / Bill
        </button>

        <div className="flex gap-4">
          <Link
            href="/account"
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-xl border border-white/15 transition-all"
          >
            View My Orders
          </Link>

          <Link
            href="/shop"
            className="px-8 py-3.5 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

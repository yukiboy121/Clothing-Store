"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill if user logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || "",
        customerEmail: prev.customerEmail || user.email || "",
        customerPhone: prev.customerPhone || user.phone || "",
        address: prev.address || user.address || "",
        city: prev.city || user.city || "",
        postalCode: prev.postalCode || user.postalCode || "",
      }));
    }
  }, [user]);

  const subtotal = totalPrice();
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponMessage(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponMessage({ text: data.error, error: true });
        setDiscountAmount(0);
      } else {
        setDiscountAmount(data.discount);
        setCouponMessage({ text: data.message, error: false });
      }
    } catch (err) {
      setCouponMessage({ text: "Failed to apply coupon", error: true });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate Fake Card Payment Validation
    if (paymentMethod === "CARD") {
      const sanitizedCardNumber = cardData.cardNumber.replace(/\s/g, "");
      if (sanitizedCardNumber !== "4242424242424242") {
        setError("Payment Failed: Invalid Card Number. Please use the test card provided.");
        setLoading(false);
        return;
      }
      if (!cardData.expiry || !cardData.cvc || !cardData.cardName) {
        setError("Payment Failed: Please fill in all card details.");
        setLoading(false);
        return;
      }
      
      // Simulate 1.5 second processing delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          paymentMethod,
          discountAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      clearCart();
      router.push(`/order-success/${data.orderId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-6 flex flex-col items-center justify-center bg-void text-white">
        <h1 className="font-heading text-3xl md:text-5xl mb-4">YOUR CART IS EMPTY</h1>
        <p className="text-white/60 mb-8">Add items to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="px-8 py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-colors"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto text-white">
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-heading text-4xl md:text-6xl tracking-wider text-white mb-2">
          CHECKOUT
        </h1>
        <p className="text-xs text-white/50 tracking-widest uppercase">
          Complete your delivery and order details
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Shipping Details & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Form */}
          <div className="bg-neutral-900/60 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-white/90 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">1</span>
              Shipping Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Kasun Perera"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="kasun@example.com"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="0771234567"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address, Apartment or Suite"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Colombo"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="00100"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Special instructions for delivery..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-neutral-900/60 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-white/90 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">2</span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                onClick={() => setPaymentMethod("COD")}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  paymentMethod === "COD"
                    ? "border-white bg-white/10"
                    : "border-white/10 bg-black/30 hover:border-white/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-white"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase text-white">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-white/50 mt-1">Pay when item arrives at your doorstep</p>
                  </div>
                </div>
              </label>

              <div className={`rounded-xl border transition-all ${
                  paymentMethod === "CARD"
                    ? "border-white bg-white/5"
                    : "border-white/10 bg-black/30 hover:border-white/30"
                }`}>
                <label
                  onClick={() => setPaymentMethod("CARD")}
                  className="cursor-pointer p-4 flex items-start gap-3 w-full"
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "CARD"}
                    onChange={() => setPaymentMethod("CARD")}
                    className="accent-white mt-1"
                  />
                  <div className="w-full">
                    <p className="text-xs font-semibold uppercase text-white mb-1.5">Bank card / Bank Account - OnePay</p>
                    {/* Logos Container */}
                    <div className="flex flex-wrap items-center gap-2 bg-white rounded-lg p-2 max-w-fit mb-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-4 object-contain" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 object-contain ml-2" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-4 object-contain ml-2" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Discover_Card_logo.svg" alt="Discover" className="h-3 object-contain ml-2" />
                    </div>
                    <p className="text-[11px] text-white/50">Pay by Visa, MasterCard, AMEX, or Lanka QR via OnePay.</p>
                  </div>
                </label>

                {/* Card Details Form - Only visible when CARD is selected */}
                <AnimatePresence>
                  {paymentMethod === "CARD" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-white/10"
                    >
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">Card Number</label>
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            value={cardData.cardNumber}
                            onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={cardData.expiry}
                              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                              className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">CVC</label>
                            <input
                              type="text"
                              placeholder="123"
                              maxLength={4}
                              value={cardData.cvc}
                              onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                              className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">Name on Card</label>
                          <input
                            type="text"
                            placeholder="Kasun Perera"
                            value={cardData.cardName}
                            onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary & Promo Code */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900/60 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl sticky top-28">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-white/90 mb-6">
              Order Summary ({items.length} Items)
            </h2>

            {/* Item List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 mb-6 border-b border-white/10 pb-6">
              {items.map((item, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-14 h-16 relative bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-xs font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-[11px] text-white/50">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-[11px] text-white/70 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. UNTER10"
                  className="flex-grow bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 uppercase focus:outline-none focus:border-white"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs uppercase font-semibold rounded-xl border border-white/15 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-[11px] mt-2 ${couponMessage.error ? "text-red-400" : "text-emerald-400"}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Calculation Breakdown */}
            <div className="space-y-2.5 text-xs border-b border-white/10 pb-6 mb-6">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Discount</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-white/70">
                <span>Delivery / Shipping</span>
                <span className="text-emerald-400 font-semibold uppercase">Free</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-semibold uppercase text-white">Total Amount</span>
              <span className="text-2xl font-bold text-white">
                Rs. {finalTotal.toLocaleString()}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-all duration-300 shadow-xl disabled:opacity-50"
            >
              {loading ? "Processing Order..." : `Place Order (Rs. ${finalTotal.toLocaleString()})`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

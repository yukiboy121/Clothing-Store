"use client";

import { useCartStore } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const FREE_SHIPPING_THRESHOLD = 250;

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore();
  const total = totalPrice();
  const shippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-abyss border-l border-white/5 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-heading text-xl tracking-wider">YOUR BAG</h2>
              <button onClick={closeCart} className="text-white/60 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-6 py-4 border-b border-white/5">
              <div className="flex justify-between text-xs text-white/50 mb-2">
                <span>{remaining > 0 ? `Rs. ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} away from free shipping` : "Free shipping unlocked! 🎉"}</span>
                <span>Rs. {FREE_SHIPPING_THRESHOLD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-white/40 to-white rounded-full"
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/30">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  <p className="mt-4 text-sm">Your bag is empty</p>
                  <button onClick={closeCart} className="mt-4 text-xs text-white/60 underline underline-offset-4 hover:text-white transition-colors">
                    Continue shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4 px-6">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4"
                    >
                      <Link href={`/product/${item.slug}`} onClick={closeCart} className="relative w-20 h-24 bg-abyss flex-shrink-0 overflow-hidden rounded">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.slug}`} onClick={closeCart}>
                          <h3 className="text-xs font-medium tracking-wider truncate">{item.name}</h3>
                        </Link>
                        <p className="text-[10px] text-white/40 mt-1">{item.color} / {item.size}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                              className="w-6 h-6 border border-white/10 flex items-center justify-center text-xs hover:border-white/30 transition-colors"
                            >
                              −
                            </button>
                            <span className="text-xs w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                              className="w-6 h-6 border border-white/10 flex items-center justify-center text-xs hover:border-white/30 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs">Rs. {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <button
                              onClick={() => removeItem(item.productId, item.size, item.color)}
                              className="text-white/30 hover:text-white transition-colors"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span className="font-medium">Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[11px] text-white/30">
                  <span>Shipping</span>
                  <span>{total >= FREE_SHIPPING_THRESHOLD ? "FREE" : "Calculated at checkout"}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center py-4 bg-white text-void font-heading text-sm tracking-[0.2em] hover:bg-white/90 transition-colors"
                >
                  CHECKOUT — Rs. {total.toLocaleString()}
                </Link>
                <button onClick={closeCart} className="w-full text-center text-xs text-white/40 underline underline-offset-4 hover:text-white/60 transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

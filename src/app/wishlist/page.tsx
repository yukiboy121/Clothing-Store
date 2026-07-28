"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 md:px-10 max-w-[1800px] mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4">WISHLIST</h1>
        <p className="text-white/40 text-sm tracking-wider mb-16">Your saved pieces</p>

        <div className="text-center py-20">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="mx-auto text-white/20"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p className="mt-4 text-white/30 text-sm">Your wishlist is empty</p>
          <Link
            href="/shop"
            className="inline-block mt-6 px-8 py-3 bg-white text-void font-heading text-sm tracking-[0.2em] hover:bg-white/90 transition-colors"
          >
            SHOP NOW
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

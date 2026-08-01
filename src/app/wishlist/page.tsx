"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string[];
  slug: string;
  category: string;
}

export default function WishlistPage() {
  const { user, isLoading } = useAuthStore();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      setLoading(false);
      return;
    }

    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setItems(data.items);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, isLoading]);

  const removeFromWishlist = async (productId: number) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setItems(items.filter((item) => item.productId !== productId));
      }
    } catch (err) {
      console.error("Failed to remove item");
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-void text-white">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl tracking-wider text-white">MY WISHLIST</h1>
            <p className="text-xs text-white/50 tracking-widest uppercase mt-2">
              Your saved collection
            </p>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </p>
        </div>

        {!user ? (
          <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-white/5 backdrop-blur-sm">
            <p className="text-white/60 mb-6 uppercase tracking-widest text-sm">Log in to save and view your wishlist across devices</p>
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 bg-neutral-900/40 rounded-3xl border border-white/5 backdrop-blur-sm">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto text-white/20 mb-6"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className="mt-4 text-white/40 text-sm tracking-wider uppercase">Your wishlist is empty</p>
            <Link
              href="/shop"
              className="inline-block mt-8 px-8 py-4 bg-white/10 text-white font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-white/20 transition-colors border border-white/15"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-neutral-900/60 rounded-2xl border border-white/10 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/50">
                  <img
                    src={item.image[0] || "/images/placeholder.jpg"}
                    alt={item.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-black/80 transition-all border border-white/10"
                    title="Remove from wishlist"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">{item.category}</p>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-bold text-sm text-white">Rs. {item.price.toLocaleString()}</p>
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

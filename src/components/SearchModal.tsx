"use client";

import { useSearchStore } from "@/store/search";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface SearchProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
}

export function SearchModal() {
  const { isOpen, closeSearch, query, setQuery } = useSearchStore();
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.products || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchProducts(query), 300);
    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-void/95 backdrop-blur-xl flex flex-col"
        >
          <div className="max-w-3xl mx-auto w-full px-6 pt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-xl tracking-wider">SEARCH</h2>
              <button onClick={closeSearch} className="text-white/60 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="w-full bg-transparent border-b border-white/20 pb-4 text-2xl md:text-4xl font-light focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20"
              />
              {loading && (
                <div className="absolute right-0 top-2">
                  <div className="w-5 h-5 border border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4 max-h-[60vh] overflow-y-auto">
              {results.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <div className="relative w-16 h-20 bg-abyss rounded overflow-hidden flex-shrink-0">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium tracking-wider">{product.name}</h3>
                      <p className="text-xs text-white/40 mt-1">{product.category}</p>
                      <p className="text-sm mt-1">Rs. {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {query.length >= 2 && !loading && results.length === 0 && (
                <p className="text-center text-white/30 py-12">No products found</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

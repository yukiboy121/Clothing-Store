"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  isLimitedDrop: boolean;
  category: string;
  inStock: boolean;
}

interface ShopClientProps {
  initialProducts: Product[];
  categories: string[];
}

export function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [initialProducts, selectedCategory, sortBy, priceRange]);

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 md:px-10 max-w-[1800px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10 md:mb-16"
      >
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider">
          {selectedCategory || "SHOP ALL"}
        </h1>
        <p className="text-white/40 text-sm mt-3 tracking-wider">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setSelectedCategory("")}
            className={`whitespace-nowrap px-4 py-2 text-[10px] tracking-[0.2em] border transition-colors ${
              !selectedCategory
                ? "bg-white text-void border-white"
                : "border-white/10 text-white/50 hover:border-white/30"
            }`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              className={`whitespace-nowrap px-4 py-2 text-[10px] tracking-[0.2em] border transition-colors ${
                selectedCategory === cat
                  ? "bg-white text-void border-white"
                  : "border-white/10 text-white/50 hover:border-white/30"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/50 hover:text-white transition-colors md:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </svg>
            FILTERS
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border border-white/10 px-4 py-2 text-[10px] tracking-[0.15em] text-white/50 focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
          >
            <option value="newest" className="bg-abyss">NEWEST</option>
            <option value="price-asc" className="bg-abyss">PRICE: LOW → HIGH</option>
            <option value="price-desc" className="bg-abyss">PRICE: HIGH → LOW</option>
            <option value="name" className="bg-abyss">A → Z</option>
          </select>
        </div>
      </div>

      {/* Extended Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="p-6 border border-white/5 rounded-lg">
              <h3 className="text-xs tracking-[0.2em] text-white/50 mb-4">PRICE RANGE</h3>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/30">${priceRange[0]}</span>
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
                <span className="text-xs text-white/30">${priceRange[1]}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">No products found</p>
          <button
            onClick={() => {
              setSelectedCategory("");
              setPriceRange([0, 500]);
            }}
            className="mt-4 text-xs text-white/50 underline underline-offset-4 hover:text-white transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

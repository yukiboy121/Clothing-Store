"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

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
}

export function LatestDropSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 md:py-32 px-6 md:px-10 max-w-[1800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16"
      >
        <div>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider">LATEST DROP</h2>
          <p className="text-white/40 text-sm mt-3 tracking-wider">Limited quantities. No restocks.</p>
        </div>
        <Link
          href="/shop"
          className="mt-4 md:mt-0 text-xs tracking-[0.2em] text-white/50 hover:text-white transition-colors underline underline-offset-4"
        >
          VIEW ALL
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

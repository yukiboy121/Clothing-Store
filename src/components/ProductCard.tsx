"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  isLimitedDrop: boolean;
  category: string;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden flex flex-col"
    >
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-white overflow-hidden">
        <Image
          src={product.images[imageIndex] || product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isLimitedDrop && (
            <span className="bg-black text-white text-[9px] font-bold tracking-[0.15em] px-3 py-1 rounded-full">
              LIMITED
            </span>
          )}
          {product.comparePrice && (
            <span className="bg-[#00F0FF] text-black text-[10px] font-bold tracking-widest px-3 py-1 rounded-full shadow-lg">
              Sale!
            </span>
          )}
        </div>

        {/* Image Switcher on Hover */}
        {product.images.length > 1 && (
          <div
            className="absolute inset-0 hidden md:block z-20"
            onMouseEnter={() => setImageIndex(1)}
            onMouseLeave={() => setImageIndex(0)}
          />
        )}
      </Link>

      {/* Product Info */}
      <div className="p-5 md:p-6 flex flex-col items-center justify-center flex-1 text-center space-y-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-[10px] md:text-xs tracking-widest font-bold uppercase text-white/90 hover:text-white transition-colors leading-relaxed">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-3 justify-center">
          {product.comparePrice && (
            <span className="text-xs text-white/40 line-through">
              Rs. {product.comparePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
          <span className="text-sm md:text-base font-bold text-white">
            Rs. {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <Link 
          href={`/product/${product.slug}`} 
          className="mt-2 px-6 py-2.5 rounded-full border border-white/20 text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors w-max"
        >
          Select Options
        </Link>
      </div>
    </motion.div>
  );
}

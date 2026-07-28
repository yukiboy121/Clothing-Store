"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";

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
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizes, setShowSizes] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = () => {
    if (!selectedSize) {
      setShowSizes(true);
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: product.colors[selectedColor]?.name || "Default",
      quantity: 1,
      slug: product.slug,
    });
    setShowSizes(false);
    setSelectedSize(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group product-card-hover"
    >
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] bg-abyss overflow-hidden mb-4">
        <Image
          src={product.images[imageIndex] || product.images[0]}
          alt={product.name}
          fill
          className="object-cover product-image"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isLimitedDrop && (
            <span className="bg-white text-void text-[9px] font-bold tracking-[0.15em] px-2 py-1">
              LIMITED
            </span>
          )}
          {product.comparePrice && (
            <span className="bg-red-600 text-white text-[9px] font-bold tracking-[0.15em] px-2 py-1">
              SALE
            </span>
          )}
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
          {showSizes ? (
            <div className="flex flex-wrap gap-2 mb-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-3 py-1.5 text-[10px] tracking-wider border transition-colors ${
                    selectedSize === size
                      ? "bg-white text-void border-white"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          ) : null}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleQuickAdd();
            }}
            className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] tracking-[0.2em] hover:bg-white hover:text-void transition-all duration-300"
          >
            {showSizes && selectedSize ? "ADD TO BAG" : showSizes ? "SELECT SIZE" : "QUICK ADD"}
          </button>
        </div>

        {/* Image Switcher on Hover */}
        {product.images.length > 1 && (
          <div
            className="absolute inset-0 hidden md:block"
            onMouseEnter={() => setImageIndex(1)}
            onMouseLeave={() => setImageIndex(0)}
          />
        )}
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Color Swatches */}
        {product.colors.length > 1 && (
          <div className="flex gap-1.5">
            {product.colors.map((color, i) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(i)}
                className={`w-3 h-3 rounded-full border transition-all ${
                  selectedColor === i ? "border-white scale-125" : "border-white/20"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}

        <Link href={`/product/${product.slug}`}>
          <h3 className="text-xs tracking-[0.15em] font-medium group-hover:text-white/80 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-sm">${product.price.toFixed(2)}</span>
          {product.comparePrice && (
            <span className="text-xs text-white/30 line-through">${product.comparePrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

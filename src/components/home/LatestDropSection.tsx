"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  tags?: string[];
  isLimitedDrop?: boolean;
  category: string;
}

export function LatestDropSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  // We spotlight the first product as the "Main Drop"
  const mainProduct = products[0];
  const otherProducts = products.slice(1, 4); // Show up to 3 more

  return (
    <section className="relative pt-32 pb-20 md:py-32 px-6 md:px-12 max-w-[1600px] mx-auto overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="mb-16 text-center md:text-left relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-bold mb-3"
          >
            Exclusive Release
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-wider text-white leading-none"
          >
            LATEST <span className="text-white/30">DROP</span>
          </motion.h2>
        </div>
        
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <Link
            href="/shop"
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white transition-colors"
          >
            Shop All Releases
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>

      {/* Spotlight Feature */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full rounded-3xl overflow-hidden bg-black border border-white/10 flex flex-col lg:flex-row group"
      >
        {/* Left Side: Product Image (Takes up 60% on large screens) */}
        <Link href={`/product/${mainProduct.slug}`} className="relative w-full lg:w-[60%] aspect-square lg:aspect-auto bg-white lg:min-h-[600px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainProduct.images[0]}
            alt={mainProduct.name}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />
          <div className="absolute top-6 left-6 flex gap-3 flex-wrap">
            {mainProduct.tags && mainProduct.tags.map(tag => (
              <span key={tag} className="bg-black/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.2em] px-4 py-2 uppercase border border-white/10">
                {tag}
              </span>
            ))}
            {!mainProduct.tags?.length && mainProduct.isLimitedDrop && (
              <span className="bg-black/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.2em] px-4 py-2 uppercase border border-white/10">
                Limited Edition
              </span>
            )}
            {mainProduct.comparePrice && (
              <span className="bg-emerald-400 text-black text-[10px] font-bold tracking-[0.2em] px-4 py-2 uppercase shadow-lg">
                Sale
              </span>
            )}
          </div>
        </Link>

        {/* Right Side: Product Details */}
        <div className="w-full lg:w-[40%] p-10 md:p-16 flex flex-col justify-center bg-gradient-to-b from-black to-neutral-900">
          <div className="mb-4">
            <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-2">
              {mainProduct.category}
            </p>
            <Link href={`/product/${mainProduct.slug}`}>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading tracking-widest text-white mb-6 uppercase leading-tight hover:text-white/80 transition-colors">
                {mainProduct.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-10">
            {mainProduct.comparePrice && (
              <span className="text-lg text-white/30 line-through">
                Rs. {mainProduct.comparePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-2xl md:text-3xl font-bold text-white">
              Rs. {mainProduct.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-6 mt-auto">
            {mainProduct.colors.length > 0 && (
              <div>
                <p className="text-[10px] text-white/50 tracking-widest uppercase mb-3">Available Colors</p>
                <div className="flex gap-2">
                  {mainProduct.colors.map(color => (
                    <div 
                      key={color.name}
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/product/${mainProduct.slug}`}
              className="inline-flex w-full justify-center items-center py-5 bg-white text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors"
            >
              Secure Yours Now
            </Link>
            <p className="text-[10px] text-white/30 text-center tracking-widest uppercase">
              Strictly no restocks once sold out
            </p>
          </div>
        </div>
      </motion.div>

      {/* Other Limited Drops (if any) */}
      {otherProducts.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {otherProducts.map((prod, idx) => (
            <motion.div 
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/product/${prod.slug}`} className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-colors">
                <div className="aspect-square bg-white relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                     {prod.tags && prod.tags.map(tag => (
                        <span key={tag} className="bg-black/90 backdrop-blur-sm text-white text-[8px] font-bold tracking-widest px-2 py-1 uppercase border border-white/10">{tag}</span>
                     ))}
                     {!prod.tags?.length && prod.isLimitedDrop && (
                        <span className="bg-black/90 backdrop-blur-sm text-white text-[8px] font-bold tracking-widest px-2 py-1 uppercase border border-white/10">Limited</span>
                     )}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-white truncate mb-2">{prod.name}</h4>
                  <p className="text-xs text-white/70">Rs. {prod.price.toLocaleString()}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

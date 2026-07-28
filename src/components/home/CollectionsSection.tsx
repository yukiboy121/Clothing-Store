"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    name: "Oversized Tees",
    image: "https://images.pexels.com/photos/18584221/pexels-photo-18584221.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    href: "/shop?category=Oversized+Tees",
  },
  {
    name: "Hoodies",
    image: "https://images.pexels.com/photos/16272623/pexels-photo-16272623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    href: "/shop?category=Hoodies",
  },
  {
    name: "Cargo Pants",
    image: "https://images.pexels.com/photos/19862949/pexels-photo-19862949.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    href: "/shop?category=Cargo+Pants",
  },
  {
    name: "Jackets",
    image: "https://images.pexels.com/photos/30257616/pexels-photo-30257616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    href: "/shop?category=Jackets",
  },
  {
    name: "Accessories",
    image: "https://images.pexels.com/photos/18956666/pexels-photo-18956666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    href: "/shop?category=Accessories",
  },
];

export function CollectionsSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-10 max-w-[1800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16"
      >
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider">COLLECTIONS</h2>
        <p className="text-white/40 text-sm mt-3 tracking-wider">Explore the range</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {collections.map((col, i) => (
          <motion.div
            key={col.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Link
              href={col.href}
              className="group relative block aspect-[3/4] overflow-hidden bg-abyss"
            >
              <Image
                src={col.image}
                alt={col.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-heading text-lg md:text-xl tracking-wider">{col.name}</h3>
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[10px] tracking-[0.2em] text-white/60">EXPLORE</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

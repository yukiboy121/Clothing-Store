"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const lookbookImages = [
  {
    src: "https://images.pexels.com/photos/25312248/pexels-photo-25312248.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    aspect: "aspect-[16/9]",
    span: "col-span-2",
  },
  {
    src: "https://images.pexels.com/photos/19273260/pexels-photo-19273260.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    aspect: "aspect-[3/4]",
    span: "col-span-1",
  },
  {
    src: "https://images.pexels.com/photos/33055601/pexels-photo-33055601.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    aspect: "aspect-[3/4]",
    span: "col-span-1",
  },
  {
    src: "https://images.pexels.com/photos/17615774/pexels-photo-17615774.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    aspect: "aspect-[16/9]",
    span: "col-span-2",
  },
];

export function LookbookSection() {
  return (
    <section id="lookbook" className="py-20 md:py-32 px-6 md:px-10 max-w-[1800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16"
      >
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider">LOOKBOOK</h2>
        <p className="text-white/40 text-sm mt-3 tracking-wider">SS26 Collection</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {lookbookImages.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className={`${img.span} overflow-hidden group`}
          >
            <div className={`relative ${img.aspect} overflow-hidden`}>
              <Image
                src={img.src}
                alt={`Lookbook image ${i + 1}`}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes={img.span === "col-span-2" ? "66vw" : "33vw"}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

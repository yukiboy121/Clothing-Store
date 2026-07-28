"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.pexels.com/videos/7901213/pexels-photo-7901213.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"
      >
        <source
          src="https://videos.pexels.com/video-files/7901213/7901213-uhd_3840_2160_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div className="video-overlay absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-5xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[10px] md:text-xs tracking-[0.4em] text-white/50 mb-6 md:mb-8"
          >
            EST. 2026 — MELBOURNE, AUSTRALIA
          </motion.p>

          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-wider">
            <motion.span
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="block"
            >
              BUILT FOR
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="block gradient-text"
            >
              THE UNDERGROUND
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-8 md:mt-12 space-y-2"
          >
            <p className="text-sm md:text-base text-white/50 tracking-[0.15em] font-light">
              Limited Drops. Premium Quality. No Restocks.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center px-10 py-4 bg-white text-void font-heading text-sm tracking-[0.2em] overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">SHOP DROP</span>
              <div className="absolute inset-0 bg-silver transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
            <Link
              href="#lookbook"
              className="inline-flex items-center justify-center px-10 py-4 border border-white/20 font-heading text-sm tracking-[0.2em] hover:bg-white/5 transition-all duration-300"
            >
              LOOKBOOK
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white/40"
          />
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="py-24 md:py-40 px-6 md:px-10 max-w-[1400px] mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="text-[10px] tracking-[0.4em] text-white/30 mb-8">THE BRAND</p>

        <h2 className="font-heading text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-wider leading-[1.1]">
          <span className="block">NOT MADE FOR</span>
          <span className="block gradient-text">EVERYONE.</span>
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 md:mt-12 text-white/40 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
        >
          Born from the underground scenes of Sri Lanka. Inspired by the grit of local rap,
          the edge of street culture, and the precision of luxury fashion. Every piece is designed
          for the ones who create their own lane. Limited runs. Premium materials. No compromises.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: "200+", label: "Limited Pieces Per Drop" },
            { value: "12", label: "Countries Shipped" },
            { value: "100%", label: "Premium Materials" },
            { value: "0", label: "Restocks" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-3xl md:text-4xl tracking-wider">{stat.value}</p>
              <p className="text-[10px] text-white/30 tracking-[0.15em] mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

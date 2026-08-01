"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PenTool, Package, Laptop } from "lucide-react";

const services = [
  {
    icon: PenTool,
    title: "Embroidery & DTF",
    description: "Custom premium stitching and high-quality printing for your brand or personal gear.",
    action: "Learn More",
    href: "/services",
  },
  {
    icon: Package,
    title: "Reselling Program",
    description: "Start your own business with our dropshipping support and wholesale opportunities.",
    action: "Join Now",
    href: "/services",
  },
  {
    icon: Laptop,
    title: "Web & Branding",
    description: "We build professional e-commerce websites and create unique brand identities.",
    action: "Get Quote",
    href: "/services",
  },
];

export function ServicesOverviewSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-10 max-w-[1800px] mx-auto text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16 text-center md:text-left"
      >
        <p className="text-[10px] md:text-xs text-white/50 tracking-[0.3em] uppercase mb-4">
          Beyond Apparel
        </p>
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider">OUR SERVICES</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-[#0f111a] border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col transition-transform hover:-translate-y-2 duration-500 shadow-xl hover:border-white/20"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-2xl tracking-wider mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8 flex-grow">
                {service.description}
              </p>
              <Link
                href={service.href}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-white transition-colors group"
              >
                {service.action}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

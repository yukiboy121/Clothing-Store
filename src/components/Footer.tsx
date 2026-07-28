"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-void border-t border-white/5">
      {/* Newsletter */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4">
            JOIN THE UNDERGROUND
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto mb-10">
            Be the first to know about new drops, exclusive releases, and underground events.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              try {
                await fetch("/api/newsletter", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                (form.elements.namedItem("email") as HTMLInputElement).value = "";
              } catch { /* noop */ }
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1 bg-transparent border border-white/10 px-5 py-4 text-sm tracking-wider placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-void px-8 py-4 font-heading text-sm tracking-[0.2em] hover:bg-white/90 transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-white/5">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <h3 className="font-heading text-sm tracking-wider mb-5">SHOP</h3>
              <div className="space-y-3">
                <Link href="/shop" className="block text-xs text-white/40 hover:text-white/70 transition-colors">All Products</Link>
                <Link href="/shop?category=Oversized+Tees" className="block text-xs text-white/40 hover:text-white/70 transition-colors">Oversized Tees</Link>
                <Link href="/shop?category=Hoodies" className="block text-xs text-white/40 hover:text-white/70 transition-colors">Hoodies</Link>
                <Link href="/shop?category=Cargo+Pants" className="block text-xs text-white/40 hover:text-white/70 transition-colors">Cargo Pants</Link>
                <Link href="/shop?category=Jackets" className="block text-xs text-white/40 hover:text-white/70 transition-colors">Jackets</Link>
                <Link href="/shop?category=Accessories" className="block text-xs text-white/40 hover:text-white/70 transition-colors">Accessories</Link>
              </div>
            </div>
            <div>
              <h3 className="font-heading text-sm tracking-wider mb-5">INFO</h3>
              <div className="space-y-3">
                <span className="block text-xs text-white/40">About Us</span>
                <span className="block text-xs text-white/40">Size Guide</span>
                <span className="block text-xs text-white/40">Contact</span>
                <span className="block text-xs text-white/40">Careers</span>
              </div>
            </div>
            <div>
              <h3 className="font-heading text-sm tracking-wider mb-5">POLICIES</h3>
              <div className="space-y-3">
                <span className="block text-xs text-white/40">Shipping</span>
                <span className="block text-xs text-white/40">Returns & Exchanges</span>
                <span className="block text-xs text-white/40">Privacy Policy</span>
                <span className="block text-xs text-white/40">Terms of Service</span>
              </div>
            </div>
            <div>
              <h3 className="font-heading text-sm tracking-wider mb-5">CONNECT</h3>
              <div className="flex gap-4">
                <a href="#" className="text-white/40 hover:text-white transition-colors" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </a>
                <a href="#" className="text-white/40 hover:text-white transition-colors" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M13.232 10.768L20 4" />
                  </svg>
                </a>
                <a href="#" className="text-white/40 hover:text-white transition-colors" aria-label="TikTok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
                  </svg>
                </a>
              </div>
              <p className="text-[10px] text-white/20 mt-6">
                Worldwide shipping from Melbourne, Australia
              </p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-heading text-lg tracking-[0.15em]">UNTERGRUND</span>
            <p className="text-[10px] text-white/20">
              © 2026 UNTERGRUND. All rights reserved. Built for the underground.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

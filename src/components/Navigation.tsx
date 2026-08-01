"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useSearchStore } from "@/store/search";
import { useAuthStore } from "@/store/auth";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalItems = useCartStore((s) => s.totalItems);
  const openCart = useCartStore((s) => s.openCart);
  const openSearch = useSearchStore((s) => s.openSearch);

  const { user, fetchUser, logout } = useAuthStore();

  useEffect(() => {
    fetchUser();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchUser]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong py-3" : "py-5"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 w-7"
            aria-label="Menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-full bg-white"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-[1.5px] w-full bg-white"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-full bg-white"
            />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-300">
              Home
            </Link>
            <Link href="/shop" className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-300">
              Products
            </Link>
            <Link href="/about" className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-300">
              About
            </Link>
            <Link href="/contact" className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-300">
              Contact
            </Link>
          </nav>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-heading text-2xl md:text-3xl tracking-[0.15em]">
              UNTERGRUND
            </h1>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <button
              onClick={openSearch}
              className="text-white/70 hover:text-white transition-colors duration-300"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <Link href="/wishlist" className="hidden md:block text-white/70 hover:text-white transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            {/* User Profile / Auth Button */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 text-xs tracking-wider uppercase text-white/80 hover:text-white transition-colors duration-300"
                  >
                    <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-[11px] text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl py-2 z-50 glass-strong"
                      >
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-white/50 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          My Account & Orders
                        </Link>

                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-4 py-2 text-xs text-amber-400 font-semibold hover:bg-white/5 transition-colors"
                          >
                            ⚡ Admin Dashboard
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 transition-colors"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-xs tracking-wider uppercase text-white/80 hover:text-white border border-white/20 hover:border-white px-3 py-1.5 rounded-lg transition-all duration-300"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative text-white/70 hover:text-white transition-colors duration-300"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-white text-void text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {totalItems()}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-void/98 flex flex-col items-center justify-center gap-8"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Products" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
              ...(user
                ? [
                    { href: "/account", label: "My Account" },
                    ...(user.role === "admin" ? [{ href: "/admin", label: "Admin Portal" }] : []),
                  ]
                : [{ href: "/login", label: "Login / Register" }]),
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-4xl md:text-5xl tracking-wider text-white/80 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

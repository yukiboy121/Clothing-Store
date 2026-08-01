"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useSearchStore } from "@/store/search";
import { useAuthStore } from "@/store/auth";
import { ChevronDown, Heart } from "lucide-react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled ? "bg-[#060914]/90 backdrop-blur-md border-white/5 py-3" : "bg-transparent border-transparent py-5"
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
              className="block h-[1.5px] w-full bg-[#00F0FF]"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-[1.5px] w-full bg-[#00F0FF]"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-[1.5px] w-full bg-[#00F0FF]"
            />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-[#00F0FF] transition-colors duration-300">
              Home
            </Link>
            <Link href="/shop" className="text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-[#00F0FF] transition-colors duration-300">
              Shop
            </Link>
            <Link href="/services" className="text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-[#00F0FF] transition-colors duration-300">
              Services
            </Link>
            
            {/* About Dropdown */}
            <div 
              className="relative group py-2"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-white/70 group-hover:text-[#00F0FF] transition-colors duration-300">
                About Us
                <ChevronDown size={14} className={`transition-transform duration-300 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {aboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-0 w-48 bg-[#0A0E1A] border border-white/5 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                  >
                    {[
                      { label: "Our Story", href: "/about" },
                      { label: "Privacy Policy", href: "/privacy-policy" },
                      { label: "Terms & Conditions", href: "/terms-conditions" },
                      { label: "Refund Policy", href: "/refund-policy" },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setAboutDropdownOpen(false)}
                        className="block px-5 py-2.5 text-xs text-white/60 hover:text-[#00F0FF] hover:bg-white/5 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/order-guide" className="text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-[#00F0FF] transition-colors duration-300">
              Order Guide
            </Link>
            <Link href="/contact" className="text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-[#00F0FF] transition-colors duration-300">
              Contact
            </Link>
          </nav>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-heading text-2xl md:text-3xl tracking-[0.15em] text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              DRAGON
            </h1>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <button
              onClick={openSearch}
              className="text-white/70 hover:text-[#00F0FF] transition-colors duration-300"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <Link href="/wishlist" className="hidden md:block text-white/70 hover:text-[#ee6443] transition-colors duration-300">
              <Heart size={18} strokeWidth={2} />
            </Link>

            {/* User Profile / Auth Button */}
            <div className="relative">
              {user ? (
                <div 
                  className="relative group py-2"
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <button
                    className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-white/70 hover:text-[#00F0FF] transition-colors duration-300"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-0 w-48 bg-[#0A0E1A] border border-white/5 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                      >
                        <div className="px-5 py-3 border-b border-white/5 bg-[#00F0FF]/5">
                          <p className="text-xs font-semibold text-[#00F0FF] truncate">{user.name}</p>
                          <p className="text-[10px] text-white/50 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-5 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          My Account
                        </Link>

                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block px-5 py-2.5 text-xs text-amber-400 font-semibold hover:bg-white/5 transition-colors"
                          >
                            ⚡ Admin Panel
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-5 py-2.5 text-xs text-[#ee6443] hover:bg-white/5 transition-colors"
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
                  className="text-[10px] font-bold tracking-widest uppercase text-white hover:text-[#00F0FF] border border-white/20 hover:border-[#00F0FF] px-4 py-2 rounded-full transition-all duration-300"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative text-white/70 hover:text-[#00F0FF] transition-colors duration-300"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-[#00F0FF] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.5)]"
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
            className="fixed inset-0 z-40 bg-[#060914] flex flex-col items-center justify-center gap-6"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Shop" },
              { href: "/services", label: "Services" },
              { href: "/about", label: "About Us" },
              { href: "/order-guide", label: "Order Guide" },
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
                  className="font-heading text-4xl uppercase tracking-wider text-white/80 hover:text-[#00F0FF] transition-colors"
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

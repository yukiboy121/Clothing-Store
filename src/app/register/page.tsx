"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";

export default function RegisterPage() {
  const router = useRouter();
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      await fetchUser();
      router.push("/account");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-void text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-neutral-900/60 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl md:text-4xl tracking-wider text-white mb-2">
            JOIN UNTERGRUND
          </h1>
          <p className="text-xs text-white/50 tracking-widest uppercase">
            Create an account for seamless shopping & order tracking
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Kasun Perera"
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="kasun@example.com"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0771234567"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
              Password *
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="No. 123, Main Street"
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Colombo"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="00100"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 mt-4"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-white/10 pt-4">
          <p className="text-xs text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-white underline font-medium hover:text-neutral-300">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

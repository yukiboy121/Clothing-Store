"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to login.");
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
        className="w-full max-w-md bg-neutral-900/60 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl md:text-4xl tracking-wider text-white mb-2">
            WELCOME BACK
          </h1>
          <p className="text-xs text-white/50 tracking-widest uppercase">
            Sign in to your UNTERGRUND account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 mt-4"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-xs text-white/60">
            Don't have an account?{" "}
            <Link href="/register" className="text-white underline font-medium hover:text-neutral-300">
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

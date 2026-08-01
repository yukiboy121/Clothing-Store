"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ShieldCheck, Truck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060914] text-white overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F0FF] rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ee6443] rounded-full mix-blend-screen filter blur-[120px] animate-pulse-slow delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-full">
              <span className="w-2 h-2 bg-[#00F0FF] rounded-full animate-ping"></span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#00F0FF]">Premium Custom Apparel</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-heading uppercase leading-[0.9] tracking-wider">
              Wear Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#0080FF]">Identity.</span>
            </h1>
            
            <p className="text-white/60 max-w-md text-lg leading-relaxed">
              Sri Lanka's leading custom clothing manufacturer. We print, stitch, and deliver premium quality apparel tailored to your brand.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href="/shop" className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#00F0FF] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all overflow-hidden rounded-none">
                <span className="relative z-10 flex items-center gap-3">
                  Shop Now <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              </Link>
              <Link href="/services" className="group inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-xs hover:border-[#00F0FF] hover:text-[#00F0FF] transition-all rounded-none">
                View Services
              </Link>
            </div>
          </div>

          <div className="relative h-[60vh] lg:h-[80vh] w-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-t from-[#060914] via-transparent to-transparent z-10"></div>
            {/* Using a placeholder image for the hero, ideally this would be a high quality model shot */}
            <img 
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Apparel" 
              className="w-full h-full object-cover object-center rounded-2xl opacity-80"
            />
            
            {/* Floating Badges */}
            <div className="absolute top-10 -left-6 z-20 bg-[#0A0E1A]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3 animate-bounce shadow-2xl">
              <div className="bg-[#00F0FF]/20 p-2 rounded-lg">
                <Star size={20} className="text-[#00F0FF]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">4.9/5 Rating</p>
                <p className="text-white/50 text-[10px] uppercase tracking-widest">1000+ Reviews</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative w-full overflow-hidden bg-[#0A0E1A] py-6 border-y border-white/5 mt-10">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex gap-16 items-center px-8">
            {Array(5).fill(["PREMIUM QUALITY", "CUSTOM PRINTING", "ISLAND-WIDE DELIVERY", "BULK ORDERS", "CUT & SEW"]).flat().map((text, i) => (
              <span key={i} className="text-xl md:text-3xl font-heading text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 uppercase tracking-widest">
                {text} <span className="text-[#00F0FF] mx-8">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <section className="py-24 max-w-[1800px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading uppercase tracking-wider mb-4">Why Choose Dragon</h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto">We use state-of-the-art technology and premium fabrics to deliver exactly what you envision.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Premium Fabrics", desc: "We source only the highest quality materials for long-lasting wear.", icon: <ShieldCheck size={32} /> },
            { title: "Fast Production", desc: "State of the art printing ensures your custom orders are done quickly.", icon: <Zap size={32} /> },
            { title: "Island-wide Delivery", desc: "Safe and secure delivery right to your doorstep anywhere in Sri Lanka.", icon: <Truck size={32} /> },
          ].map((feature, i) => (
            <div key={i} className="bg-[#0A0E1A] border border-white/5 p-10 rounded-3xl hover:border-[#00F0FF]/30 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#00F0FF]/10 text-[#00F0FF] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#00F0FF] group-hover:text-black transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider mb-3">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="relative bg-gradient-to-r from-[#ee6443]/20 to-[#00F0FF]/10 border border-white/10 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[#0A0E1A]/60 mix-blend-overlay"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-heading uppercase tracking-wider mb-6">Start Your Own Brand</h2>
              <p className="text-white/70 mb-10">
                From manufacturing to tagging and packaging, we provide everything you need to launch your clothing line.
              </p>
              <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#00F0FF] transition-colors rounded-none">
                Contact Production Team
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

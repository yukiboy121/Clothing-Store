"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Very fast delivery and the embroidery is perfect.",
    author: "Amila Silva",
    location: "Custom Hoodie",
  },
  {
    quote: "Quality of the material is superb. Best sportswear in SL!",
    author: "Kasun Perera",
    location: "Performance T-Shirt",
  },
  {
    quote: "The fit is amazing. Highly recommend Dragon Group.",
    author: "Nimali Fonseka",
    location: "Active Shorts",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-10 max-w-[1800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16"
      >
        <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider">THE WORD</h2>
        <p className="text-white/40 text-sm mt-3 tracking-wider">From the community</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="bg-[#0f111a] border border-[#00b4d8] rounded-3xl p-8 md:p-10 flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-500 shadow-xl"
          >
            <img 
              src="https://dragongrouplk.com/wp-content/uploads/2026/05/lVuQD-removebg-preview.png" 
              alt="Dragon Logo" 
              className="h-10 mb-4 object-contain opacity-60" 
            />
            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, j) => (
                <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#fca311]">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed mb-8 max-w-[250px]">
              "{t.quote}"
            </p>
            <div className="mt-auto">
              <p className="text-sm font-bold tracking-wide text-white">{t.author}</p>
              <p className="text-xs text-white/70 mt-1">{t.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

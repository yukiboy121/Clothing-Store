"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    category: "Customization",
    title: "DTF PRINTING",
    description: "Experience high-vibrancy Direct to Film (DTF) printing for complex designs and multi-color logos. Perfect for t-shirts, hoodies, and activewear with no minimum order quantity.",
    features: ["Vibrant Colors", "Durable Finish", "No MOQ", "Fast Turnaround"],
    action: "Get a Quote",
    image: "https://dragongrouplk.com/wp-content/uploads/2026/05/Gemini_Generated_Image_qawt2hqawt2hqawt-1.png",
  },
  {
    category: "Customization",
    title: "PROFESSIONAL EMBROIDERY",
    description: "Elevate your brand with premium precision stitching. We provide high-quality embroidery for caps, polos, jackets, and corporate wear with exceptional detail.",
    features: ["High Precision", "Premium Thread", "Long Lasting", "Professional Look"],
    action: "Get a Quote",
    image: "https://dragongrouplk.com/wp-content/uploads/2026/05/Gemini_Generated_Image_bpidikbpidikbpid-1.png",
  },
  {
    category: "Digital Presence",
    title: "WEB DESIGN & E-COMMERCE",
    description: "We build professional, conversion-optimized e-commerce websites tailored for your business. From hosting to payment gateway integration, we handle it all.",
    features: ["100% Responsive", "SEO Optimized", "Payment Gateway", "24/7 Support"],
    action: "Inquire Now",
    image: "https://dragongrouplk.com/wp-content/uploads/2026/05/Gemini_Generated_Image_82qma282qma282qm-1.png",
  },
  {
    category: "Creative",
    title: "PRODUCT PHOTOGRAPHY",
    description: "High-end editorial and catalog photography to make your products stand out. Professional lighting and post-production included.",
    features: ["Studio Lighting", "High Res", "Editorial Style", "Fast Delivery"],
    action: "Book Session",
    image: "https://dragongrouplk.com/wp-content/uploads/2026/05/Gemini_Generated_Image_w3lrztw3lrztw3lr-1.png",
  },
  {
    category: "Business Growth",
    title: "RESELLING PARTNERSHIP",
    description: "Join our network of successful resellers. We provide high-quality products, reliable fulfillment, and the support you need to grow your own apparel business.",
    features: ["Wholesale Pricing", "Quality Assurance", "Bulk Discounts", "Priority Support"],
    action: "Learn More",
    image: "https://dragongrouplk.com/wp-content/uploads/2026/05/Gemini_Generated_Image_jd9l0hjd9l0hjd9l-1.png",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    }
  },
};

export default function ServicesPage() {
  const whatsappNumber = "94770000000"; // Can be updated to the real number

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto text-white">
      {/* Hero Section */}
      <div className="mb-16 md:mb-24 text-center md:text-left max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] md:text-xs text-white/50 tracking-[0.3em] uppercase mb-4"
        >
          Beyond Apparel
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-wider leading-[1.1] text-white"
        >
          OUR EXPERT <span className="text-white/40">SERVICES</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-sm md:text-base text-white/60 max-w-2xl leading-relaxed"
        >
          Dragon Group brings a number of premium services to elevate your brand and e-commerce business. From custom apparel manufacturing to high-end digital presence.
        </motion.p>
      </div>

      {/* Services Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
      >
        {services.map((service) => (
          <motion.div
            key={service.title}
            variants={cardVariants}
            className="group relative h-full flex flex-col liquid-glass p-8 md:p-10 hover:-translate-y-2 transition-transform duration-500 ease-out"
          >
            {/* Subtle Glow on Hover */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-500 pointer-events-none rounded-xl"></div>
            
            <div className="flex-grow z-10 flex flex-col">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-4">
                {service.category}
              </p>
              <h2 className="font-heading text-2xl md:text-3xl tracking-wider text-white mb-4">
                {service.title}
              </h2>
              <p className="text-xs text-white/60 leading-relaxed mb-8">
                {service.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[10px] tracking-wider text-white/50 uppercase">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/10 z-10">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello! I would like to ${service.action.toLowerCase()} for ${service.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 font-heading text-xs tracking-[0.2em] bg-transparent border border-white/20 text-white hover:border-white/60 hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 uppercase"
              >
                {service.action}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </motion.div>
        ))}

        {/* Contact Banner (Takes up remaining space in grid) */}
        <motion.div
          variants={cardVariants}
          className="group relative h-full flex flex-col justify-center items-center text-center liquid-glass p-8 md:p-10 border border-white/5 bg-white/[0.02]"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/40 mb-6">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <h2 className="font-heading text-2xl tracking-wider text-white mb-3">
            NEED A CUSTOM SOLUTION?
          </h2>
          <p className="text-xs text-white/50 mb-8 max-w-[250px]">
            Have a unique project in mind? Contact us directly to discuss your requirements.
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-colors"
          >
            CONTACT US
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

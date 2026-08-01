import Link from "next/link";
import { Wrench, Printer, Scissors, Layers, CheckCircle } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Custom Printing",
      description: "High-quality screen printing, DTF, and sublimation tailored for your brand.",
      icon: <Printer size={32} className="text-[#00F0FF]" />,
    },
    {
      title: "Cut & Sew",
      description: "We manufacture premium garments from scratch, custom tailored to your exact measurements.",
      icon: <Scissors size={32} className="text-[#00F0FF]" />,
    },
    {
      title: "Bulk Orders",
      description: "Specialized discounts and expedited processing for corporate and event bulk orders.",
      icon: <Layers size={32} className="text-[#00F0FF]" />,
    },
    {
      title: "Brand Development",
      description: "Private labeling, custom tags, and packaging to elevate your clothing brand.",
      icon: <Wrench size={32} className="text-[#00F0FF]" />,
    }
  ];

  return (
    <div className="min-h-screen pt-36 pb-24 bg-[#060914] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-[#00F0FF] text-xs font-bold uppercase tracking-[0.3em]">Dragon Group Services</span>
          <h1 className="text-5xl md:text-7xl font-heading mt-4 mb-6 uppercase tracking-wider">Premium Custom Apparel</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
            We provide end-to-end manufacturing and printing services for individuals and brands across Sri Lanka.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-[#0A0E1A] border border-white/5 p-8 lg:p-12 rounded-2xl hover:border-[#00F0FF]/30 transition-all group"
            >
              <div className="w-16 h-16 bg-[#00F0FF]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">{service.title}</h3>
              <p className="text-white/60 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-[#0A0E1A] to-[#060914] border border-[#00F0FF]/20 p-10 lg:p-16 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-50"></div>
          
          <h2 className="text-3xl md:text-5xl font-heading uppercase tracking-wider mb-6">Start Your Project Today</h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto">
            Ready to bring your clothing brand to life? Contact our production team for a free consultation and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="px-8 py-4 bg-[#00F0FF] text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-white transition-colors rounded-none"
            >
              Request a Quote
            </Link>
            <Link 
              href="/shop"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-white/5 transition-colors rounded-none"
            >
              View Blank Apparel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

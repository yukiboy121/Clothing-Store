import Link from "next/link";
import { Search, ShoppingCart, CreditCard, Package } from "lucide-react";

export default function OrderGuidePage() {
  const steps = [
    {
      number: "01",
      title: "Browse & Select",
      description: "Explore our premium collection in the Shop. Select your desired product, choose your size and color variations, and click 'Add to Cart'.",
      icon: <Search size={24} className="text-[#00F0FF]" />
    },
    {
      number: "02",
      title: "Review Cart",
      description: "Click on the shopping bag icon in the navigation bar to review your selected items. Here you can apply any promotional coupons.",
      icon: <ShoppingCart size={24} className="text-[#00F0FF]" />
    },
    {
      number: "03",
      title: "Secure Checkout",
      description: "Proceed to checkout. Fill in your delivery details and choose your preferred payment method (Cash on Delivery or Bank Transfer).",
      icon: <CreditCard size={24} className="text-[#00F0FF]" />
    },
    {
      number: "04",
      title: "Delivery",
      description: "Once confirmed, your order will be processed and dispatched. Island-wide delivery usually takes 2-5 business days.",
      icon: <Package size={24} className="text-[#00F0FF]" />
    }
  ];

  return (
    <div className="min-h-screen pt-36 pb-24 bg-[#060914] text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-wider mb-4">How to Order</h1>
          <p className="text-white/60">A simple step-by-step guide to purchasing your premium apparel.</p>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#060914] bg-[#0A0E1A] text-[#00F0FF] font-bold text-xs shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {step.number}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#0A0E1A] border border-white/5 p-6 rounded-xl hover:border-[#00F0FF]/30 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-[#00F0FF]/10 rounded-lg">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-lg uppercase tracking-wider">{step.title}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link 
            href="/shop"
            className="inline-flex items-center justify-center px-10 py-4 bg-[#00F0FF] text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-white transition-colors"
          >
            Start Shopping Now
          </Link>
        </div>
      </div>
    </div>
  );
}

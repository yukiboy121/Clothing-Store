import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-36 pb-20 px-6 flex flex-col items-center justify-center bg-void text-white">
      <h1 className="font-heading text-4xl md:text-6xl mb-6 tracking-wider">CONTACT US</h1>
      <div className="max-w-2xl text-center text-white/70 space-y-6">
        <p>
          Need help with your order or have a general inquiry? Reach out to our support team.
        </p>
        
        <div className="space-y-2 p-6 bg-neutral-900/40 border border-white/10 rounded-2xl">
          <p className="text-xs uppercase tracking-widest text-white/50">Email</p>
          <p className="text-lg font-semibold text-white">support@dragongrouplk.com</p>
        </div>
        
        <div className="space-y-2 p-6 bg-neutral-900/40 border border-white/10 rounded-2xl">
          <p className="text-xs uppercase tracking-widest text-white/50">Customer Service</p>
          <p className="text-lg font-semibold text-white">+94 77 123 4567</p>
          <p className="text-xs text-white/40">Available Mon-Fri, 9AM to 6PM</p>
        </div>
      </div>
    </div>
  );
}

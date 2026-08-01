"use client";

export function MarqueeStrip() {
  const text = "LIMITED DROP • PREMIUM QUALITY • WORLDWIDE SHIPPING • EST. 2026 • DRAGON GROUP LK • SRI LANKA UNDERGROUND • NO RESTOCKS • ";

  return (
    <div className="bg-white text-void py-3 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="font-heading text-sm tracking-[0.2em] mx-2">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

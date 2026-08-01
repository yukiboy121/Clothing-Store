import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-36 pb-20 px-6 flex flex-col items-center justify-center bg-void text-white">
      <h1 className="font-heading text-4xl md:text-6xl mb-6 tracking-wider">ABOUT UNTERGRUND</h1>
      <div className="max-w-2xl text-center text-white/70 space-y-4">
        <p>
          UNTERGRUND is an independent streetwear label established with the vision of redefining modern urban aesthetics.
          We blend premium materials with underground culture to create timeless pieces.
        </p>
        <p>
          Our pieces are designed for the bold, the creatives, and those who walk their own path.
        </p>
      </div>
      <Link
        href="/shop"
        className="mt-10 px-8 py-4 bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-colors"
      >
        Explore Our Collection
      </Link>
    </div>
  );
}

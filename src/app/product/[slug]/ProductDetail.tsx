"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { ProductCard } from "@/components/ProductCard";
import { ProductReviews } from "@/components/ProductReviews";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  isLimitedDrop: boolean;
  dropEndsAt: Date | null;
  inStock: boolean;
  stockCount: number;
  category: string;
}

function CountdownTimer({ endsAt }: { endsAt: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const end = new Date(endsAt).getTime();
      const diff = Math.max(0, end - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <div className="flex gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="font-heading text-2xl md:text-3xl tracking-wider">{String(value).padStart(2, "0")}</div>
          <div className="text-[9px] text-white/30 tracking-[0.2em] mt-1">{unit.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetail({ product, recommended }: { product: Product; recommended: Product[] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: product.colors[selectedColor]?.name || "Default",
      quantity,
      slug: product.slug,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="pt-24 md:pt-32">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="relative aspect-square bg-[#0A0A0A] rounded-2xl md:rounded-[2rem] border border-white/5 overflow-hidden cursor-crosshair group"
              onClick={() => setZoomed(!zoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomed(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300"
                    style={
                      zoomed
                        ? {
                            transform: "scale(2)",
                            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                          }
                        : undefined
                    }
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isLimitedDrop && (
                  <span className="bg-white text-void text-[9px] font-bold tracking-[0.15em] px-3 py-1.5">
                    LIMITED DROP
                  </span>
                )}
                {product.comparePrice && (
                  <span className="bg-red-600 text-white text-[9px] font-bold tracking-[0.15em] px-3 py-1.5">
                    SALE
                  </span>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative shrink-0 aspect-square w-20 md:w-24 bg-[#0A0A0A] rounded-xl border overflow-hidden transition-all duration-300 ${
                    selectedImage === i ? "border-white/40 ring-1 ring-white/40" : "border-white/5 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info - Sticky */}
          <div className="md:sticky md:top-32 md:self-start space-y-8">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-white/30 mb-3">{product.category.toUpperCase()}</p>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-wider">{product.name}</h1>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xl md:text-2xl">Rs. {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                {product.comparePrice && (
                  <span className="text-base text-white/30 line-through">Rs. {product.comparePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                )}
                {product.comparePrice && (
                  <span className="text-[10px] bg-red-600/20 text-red-400 px-2 py-1 tracking-wider">
                    SAVE Rs. {(product.comparePrice - product.price).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                )}
              </div>
            </div>

            {/* Countdown */}
            {product.isLimitedDrop && product.dropEndsAt && (
              <div className="p-5 border border-white/10">
                <p className="text-[10px] tracking-[0.2em] text-white/40 mb-3">DROP ENDS IN</p>
                <CountdownTimer endsAt={product.dropEndsAt} />
                {product.stockCount <= 50 && (
                  <p className="text-[10px] text-red-400 mt-3 tracking-wider pulse-glow">
                    ONLY {product.stockCount} LEFT
                  </p>
                )}
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[0.2em] text-white/40 mb-3">
                  COLOR — {product.colors[selectedColor]?.name}
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === i ? "border-white scale-110" : "border-white/10 hover:border-white/30"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[0.2em] text-white/40">
                  SIZE {selectedSize ? `— ${selectedSize}` : ""}
                </p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[10px] tracking-[0.15em] text-white/40 underline underline-offset-4 hover:text-white/60 transition-colors"
                >
                  SIZE GUIDE
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-3 text-xs tracking-[0.15em] border transition-all duration-300 ${
                      selectedSize === size
                        ? "bg-white text-void border-white"
                        : "border-white/10 text-white/60 hover:border-white/30"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-[10px] tracking-[0.2em] text-white/40 mb-3">QUANTITY</p>
              <div className="flex items-center border border-white/10 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  −
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-sm border-x border-white/10">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Custom Order */}
            <div className="space-y-3">
              <motion.button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-5 font-heading text-sm tracking-[0.2em] transition-all duration-300 ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : selectedSize
                    ? "bg-white text-void hover:bg-silver"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                {addedToCart ? "✓ ADDED TO BAG" : selectedSize ? "ADD TO BAG" : "SELECT A SIZE"}
              </motion.button>

              <motion.a
                href={`https://wa.me/94770000000?text=${encodeURIComponent(`Hello! I would like to place a custom order for: ${product.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 font-heading text-sm tracking-[0.2em] bg-transparent border border-white/20 text-white hover:border-white/60 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                CUSTOMIZE / CUSTOM ORDER
              </motion.a>
            </div>

            {/* Description */}
            <div className="pt-6 border-t border-white/5">
              <p className="text-sm text-white/50 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4">
              {[
                "Free shipping on orders over Rs. 250",
                "14-day returns policy",
                "Premium packaging",
                "Worldwide delivery",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-xs text-white/40">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <ProductReviews productId={product.id} />

        {/* Recommended Products */}
        {recommended.length > 0 && (
          <div className="mt-20 md:mt-32 pb-20">
            <h2 className="font-heading text-2xl md:text-4xl tracking-wider mb-10">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recommended.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSizeGuide(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-abyss border border-white/10 p-8 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl tracking-wider">SIZE GUIDE</h3>
                <button onClick={() => setShowSizeGuide(false)} className="text-white/60 hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-white/40 tracking-wider">SIZE</th>
                      <th className="text-left py-3 text-white/40 tracking-wider">CHEST</th>
                      <th className="text-left py-3 text-white/40 tracking-wider">LENGTH</th>
                      <th className="text-left py-3 text-white/40 tracking-wider">SHOULDER</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    {[
                      { size: "S", chest: "106cm", length: "72cm", shoulder: "52cm" },
                      { size: "M", chest: "112cm", length: "74cm", shoulder: "54cm" },
                      { size: "L", chest: "118cm", length: "76cm", shoulder: "56cm" },
                      { size: "XL", chest: "124cm", length: "78cm", shoulder: "58cm" },
                      { size: "XXL", chest: "130cm", length: "80cm", shoulder: "60cm" },
                    ].map((row) => (
                      <tr key={row.size} className="border-b border-white/5">
                        <td className="py-3 font-medium">{row.size}</td>
                        <td className="py-3">{row.chest}</td>
                        <td className="py-3">{row.length}</td>
                        <td className="py-3">{row.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-white/30 mt-4">
                All measurements are approximate. Our pieces are designed with an oversized fit.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

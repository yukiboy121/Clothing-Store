"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  isLimitedDrop: boolean;
  category: string;
  inStock: boolean;
}

interface ShopClientProps {
  initialProducts: Product[];
  categories: string[];
}

export function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [minPrice, setMinPrice] = useState<string>("0");
  const [maxPrice, setMaxPrice] = useState<string>("50000");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  
  // Mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sections collapse state
  const [sections, setSections] = useState({
    categories: true,
    price: true,
    colors: true,
    sizes: true,
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Derive all available colors and sizes from products
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    initialProducts.forEach(p => {
      p.colors.forEach(c => colorMap.set(c.name, c.hex));
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [initialProducts]);

  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    initialProducts.forEach(p => {
      p.sizes.forEach(s => sizeSet.add(s));
    });
    return Array.from(sizeSet).sort();
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    const min = 0;
    const max = parseFloat(maxPrice) || Infinity;
    filtered = filtered.filter((p) => p.price >= min && p.price <= max);

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) => 
        p.colors.some(c => selectedColors.includes(c.name))
      );
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) => 
        p.sizes.some(s => selectedSizes.includes(s))
      );
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [initialProducts, selectedCategories, minPrice, maxPrice, selectedColors, selectedSizes, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  
  const toggleColor = (colorName: string) => {
    setSelectedColors(prev => prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setMaxPrice(maxPriceLimit.toString());
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const maxPriceLimit = useMemo(() => {
    return initialProducts.length > 0 ? Math.max(...initialProducts.map(p => p.price)) : 50000;
  }, [initialProducts]);

  // Helper to get count
  const getCategoryCount = (cat: string) => initialProducts.filter(p => p.category === cat).length;

  const SidebarContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <button onClick={() => toggleSection('categories')} className="flex items-center justify-between w-full text-left mb-4">
          <h3 className="font-heading text-lg tracking-wider">Categories</h3>
          {sections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {sections.categories && (
          <div className="space-y-3">
            {categories.map(cat => (
              <label key={cat} onClick={() => toggleCategory(cat)} className="flex items-center justify-between cursor-pointer group text-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-white border-white' : 'border-white/20 group-hover:border-white/50'}`}>
                    {selectedCategories.includes(cat) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <span className={selectedCategories.includes(cat) ? 'text-white' : 'text-white/60 group-hover:text-white transition-colors'}>{cat}</span>
                </div>
                <span className="text-white/30 text-xs">{getCategoryCount(cat)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-t border-white/5 pt-8">
        <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full text-left mb-4">
          <h3 className="font-heading text-lg tracking-wider">Price Range</h3>
          {sections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {sections.price && (
          <div className="pt-2">
            <div className="flex justify-between text-xs text-white/50 tracking-wider mb-4">
              <span>Rs. 0</span>
              <span className="text-white">Rs. {maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={maxPriceLimit} 
              step="100"
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value)} 
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]" 
            />
          </div>
        )}
      </div>

      {/* Colors */}
      {availableColors.length > 0 && (
        <div className="border-t border-white/5 pt-8">
          <button onClick={() => toggleSection('colors')} className="flex items-center justify-between w-full text-left mb-4">
            <h3 className="font-heading text-lg tracking-wider">Colors</h3>
            {sections.colors ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {sections.colors && (
            <div className="flex flex-wrap gap-3">
              {availableColors.map(color => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  title={color.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColors.includes(color.name) ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div className="border-t border-white/5 pt-8">
          <button onClick={() => toggleSection('sizes')} className="flex items-center justify-between w-full text-left mb-4">
            <h3 className="font-heading text-lg tracking-wider">Sizes</h3>
            {sections.sizes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {sections.sizes && (
            <div className="grid grid-cols-4 gap-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`py-2 text-xs font-bold transition-colors border ${selectedSizes.includes(size) ? 'bg-white text-black border-white' : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-white/5 pt-8 flex gap-3">
        <button onClick={clearAll} className="flex-1 py-3 border border-white/20 text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-colors rounded-lg">
          Clear All
        </button>
        <button onClick={() => setShowMobileFilters(false)} className="flex-1 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors lg:hidden rounded-lg">
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 md:px-10 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/5 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wider">
            SHOP ALL
          </h1>
          <p className="text-white/40 text-sm mt-2 tracking-wider">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center justify-center flex-1 md:flex-none gap-2 border border-white/10 px-6 py-3 text-xs tracking-[0.2em] hover:bg-white/5 transition-colors lg:hidden"
          >
            FILTERS
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border border-white/10 px-4 py-3 text-xs tracking-[0.15em] text-white/50 focus:outline-none focus:border-white/30 appearance-none cursor-pointer flex-1 md:flex-none"
          >
            <option value="newest" className="bg-abyss">NEWEST</option>
            <option value="price-asc" className="bg-abyss">PRICE: LOW → HIGH</option>
            <option value="price-desc" className="bg-abyss">PRICE: HIGH → LOW</option>
            <option value="name" className="bg-abyss">A → Z</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-y-0 left-0 w-[85vw] sm:w-[350px] bg-[#050505] z-50 p-6 overflow-y-auto border-r border-white/10 lg:hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-2xl tracking-wider">FILTERS</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="text-white/50 hover:text-white p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 border border-white/5 mt-4 rounded-xl">
              <p className="text-white/40 mb-4">No products match your filters</p>
              <button
                onClick={clearAll}
                className="text-xs text-white underline underline-offset-4 hover:text-white/70 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

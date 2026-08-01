import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { HeroSection } from "@/components/home/HeroSection";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { LatestDropSection } from "@/components/home/LatestDropSection";
import { LatestGearSection } from "@/components/home/LatestGearSection";
import { ServicesOverviewSection } from "@/components/home/ServicesOverviewSection";
import { AboutSection } from "@/components/home/AboutSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export default async function HomePage() {
  let featuredProducts: (typeof products.$inferSelect)[] = [];
  let limitedDrops: (typeof products.$inferSelect)[] = [];

  try {
    featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(sql`${products.createdAt} DESC`)
      .limit(8);

    limitedDrops = await db
      .select()
      .from(products)
      .where(sql`${products.isLimitedDrop} = true OR ${products.tags} @> '["Latest Drop"]'::jsonb`)
      .orderBy(sql`${products.createdAt} DESC`)
      .limit(6);
  } catch {
    // DB may not be seeded yet
  }

  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <CollectionsSection />
      <LatestDropSection products={limitedDrops.length > 0 ? limitedDrops : featuredProducts.slice(0, 6)} />
      <LatestGearSection products={featuredProducts.length > 6 ? featuredProducts.slice(6) : featuredProducts} />
      <ServicesOverviewSection />
      <AboutSection />
      <TestimonialsSection />
    </>
  );
}

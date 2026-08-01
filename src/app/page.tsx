import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { HeroSection } from "@/components/home/HeroSection";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { LatestDropSection } from "@/components/home/LatestDropSection";
import { LookbookSection } from "@/components/home/LookbookSection";
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
      .where(eq(products.isLimitedDrop, true))
      .orderBy(sql`${products.createdAt} DESC`)
      .limit(4);
  } catch {
    // DB may not be seeded yet
  }

  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <CollectionsSection />
      <LatestDropSection products={featuredProducts.length > 0 ? featuredProducts : limitedDrops} />
      <LookbookSection />
      <AboutSection />
      <TestimonialsSection />
    </>
  );
}

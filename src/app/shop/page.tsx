import { db } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";
import { ShopClient } from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let allProducts: (typeof products.$inferSelect)[] = [];
  let categories: string[] = [];

  try {
    allProducts = await db.select().from(products).orderBy(sql`${products.createdAt} DESC`);
    const catResult = await db
      .selectDistinct({ category: products.category })
      .from(products);
    categories = catResult.map((c) => c.category);
  } catch {
    // DB may not be ready
  }

  return <ShopClient initialProducts={allProducts} categories={categories} />;
}

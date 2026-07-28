import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, ne, and, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductDetail } from "./ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: typeof products.$inferSelect | null = null;
  let recommended: (typeof products.$inferSelect)[] = [];

  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (result.length === 0) {
      notFound();
    }

    product = result[0];

    recommended = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.category, product.category),
          ne(products.id, product.id)
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(4);

    if (recommended.length < 4) {
      const more = await db
        .select()
        .from(products)
        .where(ne(products.id, product.id))
        .orderBy(sql`RANDOM()`)
        .limit(4 - recommended.length);
      recommended = [...recommended, ...more];
    }
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} recommended={recommended} />;
}

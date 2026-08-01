import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishlistItems, products } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Please log in to add items to your wishlist." }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, session.userId),
          eq(wishlistItems.productId, productId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .delete(wishlistItems)
        .where(eq(wishlistItems.id, existing[0].id));
      return NextResponse.json({ success: true, action: "removed" });
    } else {
      await db
        .insert(wishlistItems)
        .values({
          userId: session.userId,
          productId,
        });
      return NextResponse.json({ success: true, action: "added" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update wishlist." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ items: [] });
    }

    const items = await db
      .select({
        id: wishlistItems.id,
        productId: products.id,
        name: products.name,
        price: products.price,
        image: products.images,
        slug: products.slug,
        category: products.category
      })
      .from(wishlistItems)
      .innerJoin(products, eq(wishlistItems.productId, products.id))
      .where(eq(wishlistItems.userId, session.userId));

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch wishlist." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const data = await req.json();

    const [newProduct] = await db
      .insert(products)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
        category: data.category,
        images: data.images, // Array of URLs
        colors: data.colors || [], // Array of {name, hex}
        sizes: data.sizes || [], // Array of strings
        isLimitedDrop: data.isLimitedDrop || false,
        dropEndsAt: data.dropEndsAt ? new Date(data.dropEndsAt) : null,
        inStock: data.inStock ?? true,
        stockCount: parseInt(data.stockCount) || 100,
        featured: data.featured || false,
      })
      .returning();

    revalidatePath("/shop");
    revalidatePath("/");

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Failed to add product:", error);
    return NextResponse.json({ error: "Failed to add product." }, { status: 500 });
  }
}

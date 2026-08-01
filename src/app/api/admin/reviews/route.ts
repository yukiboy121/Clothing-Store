import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, products, users } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const allReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        isVerifiedBuyer: reviews.isVerifiedBuyer,
        createdAt: reviews.createdAt,
        productName: products.name,
        userEmail: users.email,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .leftJoin(users, eq(reviews.userId, users.id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ success: true, reviews: allReviews });
  } catch (error: any) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    await db.delete(reviews).where(eq(reviews.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ error: "Failed to delete review." }, { status: 500 });
  }
}

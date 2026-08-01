import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, orders, orderItems } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "You must be logged in to leave a review." }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
    }

    // Check if the user is a verified buyer (has purchased this product)
    const userOrders = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.userId, session.userId));

    let isVerifiedBuyer = false;
    
    if (userOrders.length > 0) {
      const orderIds = userOrders.map((o) => o.id);
      
      // We can do a simpler loop check or IN clause. 
      // For Drizzle, let's just query if an orderItem exists for any of these orderIds
      for (const oId of orderIds) {
        const items = await db
          .select()
          .from(orderItems)
          .where(and(eq(orderItems.orderId, oId), eq(orderItems.productId, productId)))
          .limit(1);
          
        if (items.length > 0) {
          isVerifiedBuyer = true;
          break;
        }
      }
    }

    const [newReview] = await db
      .insert(reviews)
      .values({
        productId,
        userId: session.userId,
        rating,
        comment: comment || null,
        isVerifiedBuyer,
      })
      .returning();

    return NextResponse.json({ success: true, review: newReview });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, parseInt(productId)));

    return NextResponse.json({ reviews: productReviews });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
  }
}

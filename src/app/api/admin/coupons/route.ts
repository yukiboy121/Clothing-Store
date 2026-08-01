import { NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const allCoupons = await db.select().from(coupons).orderBy(coupons.createdAt);
    return NextResponse.json({ coupons: allCoupons });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { code, discountPercent, discountAmount, minOrderAmount, isActive } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const [newCoupon] = await db
      .insert(coupons)
      .values({
        code: code.toUpperCase(),
        discountPercent: discountPercent ? parseFloat(discountPercent) : null,
        discountAmount: discountAmount ? parseFloat(discountAmount) : null,
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
        isActive: isActive ?? true,
      })
      .returning();

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add coupon. Code may already exist." }, { status: 500 });
  }
}

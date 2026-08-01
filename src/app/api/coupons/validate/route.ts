import { NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Built-in test coupons for instant experience: UNTER10 (10%), WELCOME500 (Rs. 500 off)
    let matchedCoupon = null;

    const [dbCoupon] = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, cleanCode), eq(coupons.isActive, true)))
      .limit(1);

    if (dbCoupon) {
      matchedCoupon = dbCoupon;
    } else if (cleanCode === "UNTER10") {
      matchedCoupon = {
        code: "UNTER10",
        discountPercent: 10,
        discountAmount: null,
        minOrderAmount: 0,
      };
    } else if (cleanCode === "WELCOME500") {
      matchedCoupon = {
        code: "WELCOME500",
        discountPercent: null,
        discountAmount: 500,
        minOrderAmount: 2000,
      };
    }

    if (!matchedCoupon) {
      return NextResponse.json({ error: "Invalid or expired promo code." }, { status: 404 });
    }

    if (matchedCoupon.minOrderAmount && subtotal < matchedCoupon.minOrderAmount) {
      return NextResponse.json(
        { error: `This coupon requires a minimum order total of Rs. ${matchedCoupon.minOrderAmount}` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (matchedCoupon.discountPercent) {
      discount = (subtotal * matchedCoupon.discountPercent) / 100;
    } else if (matchedCoupon.discountAmount) {
      discount = matchedCoupon.discountAmount;
    }

    return NextResponse.json({
      valid: true,
      code: matchedCoupon.code,
      discount: Math.round(discount),
      message: `Coupon Applied! Saved Rs. ${Math.round(discount)}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}

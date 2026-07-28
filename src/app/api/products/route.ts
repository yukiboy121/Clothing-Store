import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ilike, eq, and, gte, lte, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");
  const limit = searchParams.get("limit");

  try {
    const conditions = [];

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }
    if (category) {
      conditions.push(eq(products.category, category));
    }
    if (featured === "true") {
      conditions.push(eq(products.featured, true));
    }
    if (minPrice) {
      conditions.push(gte(products.price, parseFloat(minPrice)));
    }
    if (maxPrice) {
      conditions.push(lte(products.price, parseFloat(maxPrice)));
    }

    let query = db.select().from(products);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    if (sort === "price-asc") {
      query = query.orderBy(products.price) as typeof query;
    } else if (sort === "price-desc") {
      query = query.orderBy(sql`${products.price} DESC`) as typeof query;
    } else if (sort === "newest") {
      query = query.orderBy(sql`${products.createdAt} DESC`) as typeof query;
    } else {
      query = query.orderBy(sql`${products.createdAt} DESC`) as typeof query;
    }

    if (limit) {
      query = query.limit(parseInt(limit)) as typeof query;
    }

    const result = await query;

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsedId = parseInt(id);
    let orderResult;

    if (!isNaN(parsedId)) {
      orderResult = await db
        .select()
        .from(orders)
        .where(or(eq(orders.id, parsedId), eq(orders.orderNumber, id)))
        .limit(1);
    } else {
      orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, id))
        .limit(1);
    }

    if (!orderResult || orderResult.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orderResult[0];

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    return NextResponse.json({ order, items });
  } catch (error: any) {
    console.error("Fetch order detail error:", error);
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}

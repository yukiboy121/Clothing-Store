import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const [updatedOrder] = await db
      .update(orders)
      .set({ orderStatus: status })
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}

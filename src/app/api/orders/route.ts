import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      postalCode,
      notes,
      items,
      paymentMethod = "COD",
      discountAmount = 0,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !address || !city) {
      return NextResponse.json(
        { error: "Please fill in all required shipping fields." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const totalAmount = Math.max(0, subtotal - discountAmount);

    // Generate unique order number UNT-XXXX
    const orderNumber = `UNT-${Math.floor(100000 + Math.random() * 900000)}`;

    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: session?.userId || null,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: {
          address,
          city,
          postalCode: postalCode || "",
          notes: notes || "",
        },
        subtotal,
        discountAmount,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === "CARD" ? "paid" : "pending",
        orderStatus: "pending",
      })
      .returning();

    // Insert order items
    const itemsToInsert = items.map((item: any) => ({
      orderId: newOrder.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || "M",
      color: item.color || "Black",
      image: item.image || "/images/placeholder.jpg",
    }));

    await db.insert(orderItems).values(itemsToInsert);

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      totalAmount: newOrder.totalAmount,
    });
  } catch (error: any) {
    console.error("Order placement error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If admin, fetch all, else user's orders
    let userOrders;
    if (session.role === "admin") {
      userOrders = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt));
    } else {
      userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, session.userId))
        .orderBy(desc(orders.createdAt));
    }

    return NextResponse.json({ orders: userOrders });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

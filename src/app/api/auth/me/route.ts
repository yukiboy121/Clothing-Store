import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        phone: users.phone,
        address: users.address,
        city: users.city,
        postalCode: users.postalCode,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

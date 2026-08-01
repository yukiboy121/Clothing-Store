import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId || (role !== "admin" && role !== "user")) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Don't allow changing one's own role to avoid locking oneself out
    if (userId === session.userId) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    await db
      .update(users)
      .set({ role })
      .where(eq(users.id, parseInt(userId)));

    return NextResponse.json({ success: true, role });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}

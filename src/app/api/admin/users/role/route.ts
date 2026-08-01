import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser, verifyAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    const isAdmin = await verifyAdminSession();
    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, email, role } = body;

    if (role !== "admin" && role !== "user") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // --- Email-based role change ---
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const [targetUser] = await db
        .select({ id: users.id, email: users.email, name: users.name })
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (!targetUser) {
        return NextResponse.json(
          { error: `No user found with email: ${normalizedEmail}` },
          { status: 404 }
        );
      }

      if (targetUser.id === session.userId) {
        return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
      }

      await db.update(users).set({ role }).where(eq(users.id, targetUser.id));
      return NextResponse.json({ success: true, role, user: { id: targetUser.id, name: targetUser.name, email: targetUser.email } });
    }

    // --- ID-based role change ---
    if (!userId) {
      return NextResponse.json({ error: "Provide either userId or email" }, { status: 400 });
    }

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

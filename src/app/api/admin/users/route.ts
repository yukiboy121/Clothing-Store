import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    return NextResponse.json({ users: allUsers });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

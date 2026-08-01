import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, address, city, postalCode } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Default to admin for first user or specific admin email if needed, else 'user'
    const role = email.toLowerCase().trim().includes("admin") ? "admin" : "user";

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        phone: phone || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
      })
      .returning();

    // Auto set session cookie
    const payload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    await setSessionCookie(payload);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        postalCode: newUser.postalCode,
      },
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user." },
      { status: 500 }
    );
  }
}

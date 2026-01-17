import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    // Set a simple httpOnly cookie to indicate logged-in state
    res.cookies.set("admin_auth", "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("admin_auth")?.value;
  return NextResponse.json({ authenticated: cookie === "1" });
}

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";
import { mkdir, rename } from "fs/promises";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const filename = body?.filename;
    const hide = !!body?.hide;
    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    const safeName = path.basename(filename);
    const uploadsDir = path.join(process.cwd(), "uploads");
    const hiddenDir = path.join(uploadsDir, ".hidden");

    const source = path.join(uploadsDir, safeName);
    const target = path.join(hiddenDir, safeName);

    if (hide) {
      if (!existsSync(source)) {
        return NextResponse.json(
          { error: "File not found to hide" },
          { status: 404 },
        );
      }
      if (!existsSync(hiddenDir)) await mkdir(hiddenDir, { recursive: true });
      await rename(source, target);
      return NextResponse.json({ ok: true, hidden: true });
    } else {
      // unhide
      if (!existsSync(target)) {
        return NextResponse.json(
          { error: "Hidden file not found" },
          { status: 404 },
        );
      }
      await rename(target, source);
      return NextResponse.json({ ok: true, hidden: false });
    }
  } catch (err) {
    console.error("Hide error", err);
    return NextResponse.json(
      { error: "Failed to process hide/unhide" },
      { status: 500 },
    );
  }
}

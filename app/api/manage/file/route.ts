import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { existsSync, unlink } from "fs";
import { unlink as unlinkP } from "fs/promises";

function isAuthed(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === "1";
}

export async function DELETE(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const filename = body?.filename;
    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    const safeName = path.basename(filename);
    const uploadsDir = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadsDir, safeName);

    if (!existsSync(filePath)) {
      // maybe it's in .hidden folder
      const hiddenPath = path.join(uploadsDir, ".hidden", safeName);
      if (existsSync(hiddenPath)) {
        await unlinkP(hiddenPath);
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await unlinkP(filePath);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete error", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(request: Request) {
  try {
    const uploadsDir = path.join(process.cwd(), "uploads");

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = existsSync(uploadsDir) ? await readdir(uploadsDir) : [];

    // Query param to include hidden files from uploads/.hidden
    const url = new URL(request.url);
    const includeHidden = url.searchParams.get("includeHidden") === "true";

    // Filter out dotfiles except when including hidden entries
    const validFiles = files.filter((f) => !f.startsWith("."));

    const fileDetails = await Promise.all(
      validFiles.map(async (filename) => {
        const filepath = path.join(uploadsDir, filename);
        const stats = await stat(filepath);

        // Determine file type
        const ext = path.extname(filename).toLowerCase();
        const isVideo = [".mp4", ".webm", ".mov", ".quicktime"].includes(ext);
        const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(
          ext,
        );

        return {
          name: filename,
          size: stats.size,
          created: stats.birthtime,
          type: isVideo ? "video" : isImage ? "image" : "unknown",
          hidden: false,
        };
      }),
    );

    // If requested, include hidden files from uploads/.hidden and mark them hidden
    if (includeHidden) {
      const hiddenDir = path.join(uploadsDir, ".hidden");
      if (existsSync(hiddenDir)) {
        const hiddenFiles = await readdir(hiddenDir);
        const hiddenDetails = await Promise.all(
          hiddenFiles
            .filter((f) => !f.startsWith("."))
            .map(async (filename) => {
              const filepath = path.join(hiddenDir, filename);
              const stats = await stat(filepath);
              const ext = path.extname(filename).toLowerCase();
              const isVideo = [".mp4", ".webm", ".mov", ".quicktime"].includes(
                ext,
              );
              const isImage = [
                ".jpg",
                ".jpeg",
                ".png",
                ".gif",
                ".webp",
              ].includes(ext);
              return {
                name: filename,
                size: stats.size,
                created: stats.birthtime,
                type: isVideo ? "video" : isImage ? "image" : "unknown",
                hidden: true,
              };
            }),
        );
        fileDetails.push(...hiddenDetails);
      }
    }

    // Sort by creation date (newest first)
    fileDetails.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );

    return NextResponse.json({ files: fileDetails });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 },
    );
  }
}

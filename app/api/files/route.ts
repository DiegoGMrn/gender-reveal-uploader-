import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = await readdir(uploadsDir);
    
    const fileDetails = await Promise.all(
      files.map(async (filename) => {
        const filepath = path.join(uploadsDir, filename);
        const stats = await stat(filepath);
        
        // Determine file type
        const ext = path.extname(filename).toLowerCase();
        const isVideo = ['.mp4', '.webm', '.mov', '.quicktime'].includes(ext);
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        
        return {
          name: filename,
          size: stats.size,
          created: stats.birthtime,
          type: isVideo ? 'video' : isImage ? 'image' : 'unknown',
        };
      })
    );

    // Sort by creation date (newest first)
    fileDetails.sort((a, b) => b.created.getTime() - a.created.getTime());

    return NextResponse.json({ files: fileDetails });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { uploadMediaAsset } from "@/lib/storage";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file attached." }, { status: 400 });
    }

    // Size check: limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB limit." }, { status: 400 });
    }

    // Allowed MIME types
    const allowedMimes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file format. Allowed: PNG, JPG, WEBP, SVG, PDF." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadMediaAsset({
      fileBuffer: buffer,
      fileName: file.name,
      mimeType: file.type,
      prefix: "course-studio",
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: file.name,
      fileSize: file.size,
      storageProvider: result.storageProvider,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: error.message || "File upload failed." }, { status: 500 });
  }
}

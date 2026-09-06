import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_CONFIGURED = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_CONFIGURED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "File must be an image or video" },
        { status: 400 }
      );
    }

    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB limit for this endpoint
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { error: "File size must be less than 50MB" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = `portfolio-${timestamp}-${randomId}-${file.name}`;

    // Prefer Cloudinary when it's configured; fall back to Vercel Blob.
    if (CLOUDINARY_CONFIGURED) {
      const base64 = Buffer.from(buffer).toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;
      const resourceType = file.type.startsWith("video/") ? "video" : "image";

      const result = await cloudinary.uploader.upload(dataUri, {
        public_id: filename.replace(/\.[^/.]+$/, ""),
        resource_type: resourceType,
        folder: "geniuzlab-portfolio",
      });

      return NextResponse.json({
        url: result.secure_url,
        filename: result.public_id,
        provider: "cloudinary",
      });
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, Buffer.from(buffer), {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return NextResponse.json({
        url: blob.url,
        filename: blob.pathname,
        provider: "vercel-blob",
      });
    }

    return NextResponse.json(
      { error: "Image storage not configured" },
      { status: 503 }
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { putItem } from "@/lib/downloadStore";

function inferExtension(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  return "bin";
}

export async function POST(req: Request) {
  try {
    const { dataUrl, filename } = await req.json();
    if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
      return NextResponse.json({ error: "Invalid dataUrl" }, { status: 400 });
    }

    const match = /^data:([^;]+);base64,(.*)$/i.exec(dataUrl);
    if (!match) {
      return NextResponse.json(
        { error: "Unsupported dataUrl" },
        { status: 400 }
      );
    }
    const contentType = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, "base64");
    const ext = inferExtension(contentType);
    const name =
      typeof filename === "string" && filename.trim()
        ? filename
        : `image.${ext}`;

    const token = putItem(buffer, contentType, name);
    return NextResponse.json({ token }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

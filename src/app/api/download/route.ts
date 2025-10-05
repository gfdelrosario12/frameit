import { NextResponse } from "next/server";
import { getItem } from "@/lib/downloadStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || "";
    if (!token) return new NextResponse("Missing token", { status: 400 });

    const item = getItem(token);
    if (!item) return new NextResponse("Not found or expired", { status: 404 });

    const body = new Uint8Array(item.data);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": item.contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          item.filename
        )}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

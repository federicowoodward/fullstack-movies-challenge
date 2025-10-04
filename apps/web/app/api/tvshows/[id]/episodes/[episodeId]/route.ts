import { NextRequest, NextResponse } from "next/server";
import { authCookieNames } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export async function GET(
  request: NextRequest,
  context: { params: { id: string; episodeId: string } }
) {
  const accessToken = request.cookies.get(authCookieNames.access)?.value;
  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Unauthorized", data: null }, { status: 401 });
  }

  const { id, episodeId } = context.params;
  const backendResponse = await fetch(`${API_BASE_URL}/tvshows/${id}/episodes/${episodeId}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = await backendResponse.text();
  const response = new NextResponse(body, { status: backendResponse.status });
  const contentType = backendResponse.headers.get("content-type");
  if (contentType) {
    response.headers.set("content-type", contentType);
  }
  return response;
}

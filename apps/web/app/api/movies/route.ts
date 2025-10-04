import { NextRequest, NextResponse } from "next/server";
import { authCookieNames } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

function unauthorizedResponse() {
  return NextResponse.json({ success: false, message: "Unauthorized", data: null }, { status: 401 });
}

async function forwardToBackend(path: string, init: RequestInit) {
  const backendResponse = await fetch(`${API_BASE_URL}${path}`, init);
  const body = await backendResponse.text();
  const response = new NextResponse(body, { status: backendResponse.status });
  const contentType = backendResponse.headers.get("content-type");
  if (contentType) {
    response.headers.set("content-type", contentType);
  }
  return response;
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(authCookieNames.access)?.value;
  if (!accessToken) {
    return unauthorizedResponse();
  }
  const search = request.nextUrl.search ?? "";
  return forwardToBackend(`/movies${search}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(authCookieNames.access)?.value;
  if (!accessToken) {
    return unauthorizedResponse();
  }
  const body = await request.text();
  return forwardToBackend(`/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });
}

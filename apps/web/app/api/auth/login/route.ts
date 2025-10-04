import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth";
import type { ApiResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  const backendResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await backendResponse.text();
  const data: ApiResponse<{ token: string; refreshToken: string }> | undefined = text
    ? (JSON.parse(text) as ApiResponse<{ token: string; refreshToken: string }>)
    : undefined;

  if (!backendResponse.ok || !data?.data?.token || !data?.data?.refreshToken) {
    const response = NextResponse.json(data ?? { success: false, message: "Login failed", data: null }, {
      status: backendResponse.status,
    });
    clearAuthCookies(response);
    return response;
  }

  const response = new NextResponse(null, { status: 204 });
  setAuthCookies(response, {
    accessToken: data.data.token,
    refreshToken: data.data.refreshToken,
  });
  return response;
}

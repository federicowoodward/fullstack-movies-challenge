import { NextRequest, NextResponse } from "next/server";
import { authCookieNames, clearAuthCookies, setAuthCookies } from "@/lib/auth";
import type { ApiResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(authCookieNames.refresh)?.value;

  if (!refreshToken) {
    const response = NextResponse.json({ success: false, message: "Missing refresh token", data: null }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  const backendResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const text = await backendResponse.text();
  const data: ApiResponse<{ token: string }> | undefined = text
    ? (JSON.parse(text) as ApiResponse<{ token: string }>)
    : undefined;

  if (!backendResponse.ok || !data?.data?.token) {
    const response = NextResponse.json(data ?? { success: false, message: "Unable to refresh token", data: null }, {
      status: backendResponse.status,
    });
    clearAuthCookies(response);
    return response;
  }

  const response = new NextResponse(null, { status: 204 });
  setAuthCookies(response, { accessToken: data.data.token });
  return response;
}

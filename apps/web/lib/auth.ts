import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type CookieOptions = {
  maxAge?: number;
};

const accessCookieName = process.env.AUTH_COOKIE_ACCESS ?? "mt_access";
const refreshCookieName = process.env.AUTH_COOKIE_REFRESH ?? "mt_refresh";

const isProduction = process.env.NODE_ENV === "production";

export const authCookieNames = {
  access: accessCookieName,
  refresh: refreshCookieName,
} as const;

export function setAuthCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken?: string },
  options: CookieOptions = {}
) {
  const { accessToken, refreshToken } = tokens;
  response.cookies.set(accessCookieName, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: options.maxAge ?? 60 * 15,
  });
  if (refreshToken) {
    response.cookies.set(refreshCookieName, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(accessCookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
  response.cookies.set(refreshCookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function getAccessToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get(accessCookieName)?.value ?? null;
}

export function getRefreshToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get(refreshCookieName)?.value ?? null;
}

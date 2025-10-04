import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const accessCookieName = process.env.AUTH_COOKIE_ACCESS ?? "mt_access";
const refreshCookieName = process.env.AUTH_COOKIE_REFRESH ?? "mt_refresh";

const PUBLIC_PATHS = new Set(["/login"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png")
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const hasAccess = Boolean(request.cookies.get(accessCookieName)?.value);
  const hasRefresh = Boolean(request.cookies.get(refreshCookieName)?.value);

  if (!hasAccess && !hasRefresh) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

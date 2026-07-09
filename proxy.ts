import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "elite_site_access";
const ACCESS_QUERY_PARAM = "clientAccess";
const ACCESS_PATH_PREFIX = "/client-preview/";

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const lockEnabled = process.env.SITE_LOCK_ENABLED !== "false";
  const accessSecret = process.env.SITE_LOCK_SECRET || "elite-preview-2026";

  if (!lockEnabled || !accessSecret) {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;

  if (
    pathname === "/under-construction" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const queryAccess = searchParams.get(ACCESS_QUERY_PARAM);
  const cookieAccess = request.cookies.get(ACCESS_COOKIE)?.value;
  const pathAccess = pathname.startsWith(ACCESS_PATH_PREFIX)
    ? decodeURIComponent(pathname.slice(ACCESS_PATH_PREFIX.length))
    : null;

  if (queryAccess === accessSecret || pathAccess === accessSecret) {
    const cleanUrl = request.nextUrl.clone();
    if (pathAccess === accessSecret) {
      cleanUrl.pathname = "/";
    }
    cleanUrl.searchParams.delete(ACCESS_QUERY_PARAM);

    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(ACCESS_COOKIE, accessSecret, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure: true,
    });
    return response;
  }

  if (cookieAccess === accessSecret) {
    return NextResponse.next();
  }

  const constructionUrl = request.nextUrl.clone();
  constructionUrl.pathname = "/under-construction";
  constructionUrl.search = "";

  return NextResponse.rewrite(constructionUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

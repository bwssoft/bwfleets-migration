"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  console.log("🚀 ~ middleware ~ sessionCookie:", sessionCookie, request.url);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && request.url.includes("/login")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/wwt/:path*", "/home"], // Specify the routes the middleware applies to
};

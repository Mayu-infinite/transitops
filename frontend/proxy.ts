import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/session";

// Next.js 16 replaces `middleware` with `proxy` (Node.js runtime). This is an
// OPTIMISTIC guard based on presence of the session cookie — it keeps anonymous
// users out of the app and signed-in users out of the auth pages before the
// client renders. Real authorization is still enforced by the backend on every
// request and re-checked client-side once the token is validated.

// Public routes that must stay reachable without a session.
const AUTH_ROUTES = ["/login", "/register"];

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);
  const onAuthRoute = isAuthRoute(pathname);

  // Signed-in user hitting an auth page → send to the dashboard.
  if (hasSession && onAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Anonymous user hitting a protected page → send to login (preserve target).
  if (!hasSession && !onAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, static assets, and files with an
  // extension (images, icons, etc.).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

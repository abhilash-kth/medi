// // proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  const isAdminPath = pathname.startsWith("/admin");
  const isMedicinePath = pathname.startsWith("/medicine"); // ✅ added
  const isLoginPath = pathname === "/login";

  // Redirect logged-in users away from login page
  if (token && isLoginPath) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // ✅ Protect BOTH /admin and /medicine
  if (isAdminPath || isMedicinePath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    let decoded;
    try {
      decoded = verifyToken(token);
      if (!decoded) throw new Error("Invalid token");
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set({
        name: "auth_token",
        value: "",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("x-user", JSON.stringify(decoded));
    return response;
  }

  return NextResponse.next();
}

// ✅ Updated matcher
export const config = {
  matcher: ["/admin/:path*", "/medicine/:path*", "/login"],
};

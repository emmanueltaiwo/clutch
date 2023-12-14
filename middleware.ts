import { verifyUserStatus } from "./lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/app"];

const middleware = async (req: NextRequest) => {
  const isAuthenticated: boolean = await verifyUserStatus();

  if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }
};

export default middleware;

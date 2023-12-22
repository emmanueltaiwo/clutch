import { getSessionStatus } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/feed"];

export default async function middleware(req: NextRequest) {
  try {
    const sessionStatus = await getSessionStatus();

    if (!sessionStatus && protectedRoutes.includes(req.nextUrl.pathname)) {
      const absoluteUrl = new URL("/", req.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
    }
  } catch (error) {
    return NextResponse.error();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";

// Returns the currently signed-in wallet address (or null).
export async function GET(req: NextRequest) {
  const address = verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ address });
}

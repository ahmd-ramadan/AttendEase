import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const allCookies = (await cookieStore).getAll();

  return NextResponse.json({ cookies: allCookies });
}

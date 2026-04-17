import { NextResponse } from "next/server";
import { getRuntimeConfigStatus } from "@/lib/runtime-config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getRuntimeConfigStatus());
}

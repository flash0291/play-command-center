// ============================================================
// GET /api/campaigns — Get campaign overview
// ============================================================

import { NextResponse } from "next/server";
import { CAMPAIGN } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({ campaign: CAMPAIGN });
}

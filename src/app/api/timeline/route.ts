// ============================================================
// GET /api/timeline — Get timeline events
// ============================================================

import { NextResponse } from "next/server";
import { TIMELINE_EVENTS } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({ events: TIMELINE_EVENTS });
}

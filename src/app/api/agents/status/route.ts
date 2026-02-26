// ============================================================
// GET /api/agents/status — Get all agent statuses
// ============================================================

import { NextResponse } from "next/server";
import { AGENT_DEFINITIONS } from "@/lib/agents";

export async function GET() {
  return NextResponse.json({ agents: AGENT_DEFINITIONS });
}

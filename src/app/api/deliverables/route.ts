// ============================================================
// GET /api/deliverables — Get all deliverables
// POST /api/deliverables — Update deliverable status
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { DELIVERABLES } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({ deliverables: DELIVERABLES });
}

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const deliverable = DELIVERABLES.find((d) => d.id === id);
    if (!deliverable) {
      return NextResponse.json({ error: "Deliverable not found" }, { status: 404 });
    }
    // In production this would update a database
    deliverable.status = status;
    if (status === "completed") {
      deliverable.completedAt = new Date().toISOString();
    }
    return NextResponse.json({ deliverable });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

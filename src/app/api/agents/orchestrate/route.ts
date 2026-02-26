// ============================================================
// POST /api/agents/orchestrate — Invoke an AI agent
// ============================================================

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { agentId, systemPrompt, userPrompt } = await req.json();

    if (!agentId || !userPrompt) {
      return NextResponse.json({ error: "Missing agentId or userPrompt" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback: generate a smart mock response when no API key
      const mockResponse = generateMockResponse(agentId, userPrompt);
      return NextResponse.json(mockResponse);
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return NextResponse.json({ error: "AI agent invocation failed" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text ?? "No response generated.";

    return NextResponse.json({
      agentId,
      content,
      actions: [],
      metadata: { model: data.model, tokens: data.usage },
    });
  } catch (error) {
    console.error("Agent orchestration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateMockResponse(agentId: string, prompt: string): { agentId: string; content: string; actions: never[]; metadata: Record<string, string> } {
  const responses: Record<string, string> = {
    orchestrator: "Sprint Day 1 status: All 7 agents are online and calibrated. Brand Asset Library is 80% complete (Content Engine). Nordstrom buyer meeting confirmed for March 3 (Retail Agent). Creator outreach Wave 1 has 3 confirmed mega-influencers (Influencer Agent). NYC launch venue secured at Spring Studios (Events Agent). Budget burn rate is on track at $48K/week (Budget Agent). Priority actions: 1) Approve social content calendar by EOD, 2) Finalize Nordstrom buy sheet, 3) Greenlight Emma Chamberlain deal.",
    retail: "Retail pipeline update: 12 doors confirmed (target: 25). Nordstrom showing strong interest — buyer wants exclusive colorway for 8-10 SKUs. Ssense application submitted, FWRD vendor setup at 60%. DTC Shopify build scheduled for Week 3. Sell-through on initial boutique orders averaging 34%. Recommendation: prioritize Nordstrom exclusive to lock in Q2 buy.",
    influencer: "Creator network status: 14 active creators (target: 30). Wave 1 outreach: 45% response rate. Top opportunity: Emma Chamberlain ($45K, 72% audience overlap). 3 mega-influencers confirmed for launch week content. Celebrity seeding list at 20 targets, packaging in production. UGC micro campaign (Wave 2) prep starting Week 5.",
    content: "Content engine update: 34 assets produced (target: 120). Asset library at 247 items. Instagram grid strategy approved — 'Palm Life' aesthetic direction. 5 social posts in approval queue. TikTok series 'How Palm Angels Plays' in pre-production. Week 1-2 content calendar 70% complete. Brand consistency score: 94/100.",
    events: "Events pipeline: NYC Launch (March 14) — venue confirmed at Spring Studios, DJ booked, guest list at 180/250. LA Pop-Up (March 21) — Melrose Ave lease in final negotiation. Miami Art Basel activation in early planning. Press preview scheduling for Week 2. Total events budget: $48K spent of $250K allocated.",
    budget: "Budget status: $287K spent of $1M total (28.7%). Burn rate: $48K/week (target: $50K). Influencer line item pacing 8% ahead — will breach allocation if Chamberlain deal approved without reallocation. Recommend shifting $25K from events buffer. 6 pending invoices totaling $34K. Compliance score: 96%.",
    performance: "Performance snapshot: 8.4M total impressions (+2.1M this week). Earned media value: $320K. Sentiment score: 87/100 (positive). Social followers: +12K this week. Competitor alert: Off-White launching similar line March 10. Share of voice: 12% (target: 25%). Recommendation: accelerate teaser content to establish SOV before Off-White launch.",
  };

  return {
    agentId,
    content: responses[agentId] ?? "Agent response generated successfully.",
    actions: [],
    metadata: { model: "mock", note: "Set ANTHROPIC_API_KEY for live AI responses" },
  };
}

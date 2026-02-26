// ============================================================
// Autonomous Outreach Pipeline
//
// Flow: Discovery → Score → Template Select → Personalize → Send → Track
// Completely autonomous — no human in the loop for initial outreach
// ============================================================

import { OutreachTemplate, OutreachAttempt, InfluencerRecord } from "@/types/crm";

// ---- Outreach Templates ----
export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: "tpl-initial-dm",
    name: "Initial DM — High-Value Creator",
    type: "dm",
    platform: "instagram",
    body: `Hey {{name}}! \uD83D\uDC4B

Loved your content — your style is exactly what we're looking for.

We're launching PLAY by Palm Angels in the U.S. and building a creator-first community. Your aesthetic is a perfect fit.

Would love to send you some pieces and chat about a potential collab. Interested?

\u2014 PLAY Team`,
    variables: ["name", "handle", "follower_count"],
    category: "initial_outreach",
    performanceStats: { sent: 342, opened: 298, replied: 89, converted: 34, responseRate: 26.0, conversionRate: 9.9 },
    createdBy: "system",
    active: true,
  },
  {
    id: "tpl-initial-dm-mega",
    name: "Initial DM — Mega/Macro Creator",
    type: "dm",
    platform: "instagram",
    body: `Hi {{name}},

Your work speaks for itself \u2014 {{follower_count}} followers and that engagement rate? Incredible.

PLAY by Palm Angels is launching in the U.S. with a $1M campaign, and we'd love you to be a founding creator. Think exclusive product, creative freedom, and premium compensation.

Can we set up a quick call this week? Happy to go through your manager if preferred.

\u2014 PLAY Creative Team`,
    variables: ["name", "handle", "follower_count"],
    category: "initial_outreach",
    performanceStats: { sent: 48, opened: 45, replied: 22, converted: 12, responseRate: 45.8, conversionRate: 25.0 },
    createdBy: "system",
    active: true,
  },
  {
    id: "tpl-follow-up-1",
    name: "Follow-Up #1 — 3 Days After",
    type: "dm",
    platform: "instagram",
    body: `Hey {{name}}, just circling back! \uD83D\uDE4F

We're putting together the creator roster for PLAY by Palm Angels' U.S. launch and your name keeps coming up.

No pressure at all \u2014 just wanted to make sure this didn't get buried. Would love to chat if you're open to it!`,
    variables: ["name", "handle"],
    category: "follow_up",
    performanceStats: { sent: 186, opened: 152, replied: 48, converted: 18, responseRate: 25.8, conversionRate: 9.7 },
    createdBy: "system",
    active: true,
  },
  {
    id: "tpl-follow-up-2",
    name: "Follow-Up #2 — 7 Days After",
    type: "email",
    platform: "email",
    subject: "PLAY by Palm Angels \u2014 Creator Opportunity",
    body: `Hi {{name}},

I reached out on Instagram a few days ago about a creator opportunity with PLAY by Palm Angels.

We're launching in the U.S. market with major retail partners (Nordstrom, Ssense, FWRD) and investing heavily in our creator community.

Here's what we're offering:
\u2022 Free product from the new collection
\u2022 Competitive compensation (ESTIMATED_FEE range)
\u2022 Creative freedom on content
\u2022 Invite to our NYC launch event (March 14)

Would love to connect. What works for your schedule?

Best,
PLAY by Palm Angels Creator Team`,
    variables: ["name", "handle", "estimated_fee"],
    category: "follow_up",
    performanceStats: { sent: 124, opened: 98, replied: 31, converted: 14, responseRate: 25.0, conversionRate: 11.3 },
    createdBy: "system",
    active: true,
  },
  {
    id: "tpl-scraper-discovery",
    name: "Scraper Discovery — Comment-Based Outreach",
    type: "dm",
    platform: "instagram",
    body: `Hey {{name}}! \uD83D\uDE4C

We noticed you vibing with PLAY by Palm Angels \u2014 love your energy!

We're building a creator community for the U.S. launch and your profile caught our eye. Would love to send you some pieces.

Interested in being part of something big? \uD83D\uDE80`,
    variables: ["name", "handle"],
    category: "initial_outreach",
    performanceStats: { sent: 567, opened: 412, replied: 134, converted: 52, responseRate: 23.6, conversionRate: 9.2 },
    createdBy: "scraper-agent",
    active: true,
  },
];

// Select the best template based on influencer profile
export function selectTemplate(influencer: {
  tier: string;
  source: string;
  platform: string;
}): OutreachTemplate {
  // Mega/macro creators get the premium template
  if (influencer.tier === "mega" || influencer.tier === "macro") {
    return OUTREACH_TEMPLATES.find((t) => t.id === "tpl-initial-dm-mega")!;
  }

  // Scraper discoveries get the comment-based template
  if (influencer.source.startsWith("scraper_")) {
    return OUTREACH_TEMPLATES.find((t) => t.id === "tpl-scraper-discovery")!;
  }

  // Default to standard initial DM
  return OUTREACH_TEMPLATES.find((t) => t.id === "tpl-initial-dm")!;
}

// Personalize a template with influencer data
export function personalizeTemplate(
  template: OutreachTemplate,
  influencer: InfluencerRecord
): string {
  let message = template.body;
  message = message.replace(/\{\{name\}\}/g, influencer.name || influencer.handle);
  message = message.replace(/\{\{handle\}\}/g, `@${influencer.handle}`);
  message = message.replace(/\{\{follower_count\}\}/g, formatFollowers(influencer.followers));
  message = message.replace(/ESTIMATED_FEE/g, estimateFee(influencer));
  return message;
}

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
}

function estimateFee(influencer: InfluencerRecord): string {
  // Fee estimation based on tier and engagement
  const baseFees: Record<string, number> = {
    mega: 25000, macro: 8000, mid: 3000, micro: 800, nano: 250,
  };
  const base = baseFees[influencer.tier] || 1000;
  const engagementMultiplier = Math.min(influencer.engagementRate / 3, 2);
  const fee = Math.round(base * engagementMultiplier);
  return `${(fee - fee * 0.2).toLocaleString()}-${(fee + fee * 0.2).toLocaleString()}`;
}

// Execute autonomous outreach for a newly discovered influencer
export function executeAutoOutreach(
  influencer: InfluencerRecord
): OutreachAttempt | null {
  if (influencer.score < 50) return null; // Don't reach out to low-score profiles

  const template = selectTemplate({
    tier: influencer.tier,
    source: influencer.source,
    platform: influencer.platform,
  });

  const personalizedMessage = personalizeTemplate(template, influencer);

  return {
    id: `outreach-${Date.now()}-${influencer.handle}`,
    type: influencer.platform === "instagram" ? "dm_instagram" : influencer.platform === "tiktok" ? "dm_tiktok" : "email",
    sentAt: new Date().toISOString(),
    templateId: template.id,
    status: "sent",
    message: personalizedMessage,
    automated: true,
  };
}

// Get pipeline conversion stats
export function calculatePipelineStats(influencers: InfluencerRecord[]): {
  funnel: { stage: string; count: number; pct: number }[];
  responseRate: number;
  conversionRate: number;
  avgScore: number;
} {
  const stages = [
    "discovered", "researching", "qualified", "outreach_sent",
    "responded", "negotiating", "contracted", "onboarded",
    "active", "content_live", "completed",
  ];

  const stageCounts = stages.map((stage) => ({
    stage,
    count: influencers.filter((i) => i.stage === stage).length,
  }));

  const total = influencers.length || 1;
  const funnel = stageCounts.map((sc) => ({
    ...sc,
    pct: Math.round((sc.count / total) * 100),
  }));

  const outreachSent = influencers.filter((i) =>
    ["outreach_sent", "responded", "negotiating", "contracted", "onboarded", "active", "content_live", "completed"].includes(i.stage)
  ).length;
  const responded = influencers.filter((i) =>
    ["responded", "negotiating", "contracted", "onboarded", "active", "content_live", "completed"].includes(i.stage)
  ).length;
  const contracted = influencers.filter((i) =>
    ["contracted", "onboarded", "active", "content_live", "completed"].includes(i.stage)
  ).length;

  return {
    funnel,
    responseRate: outreachSent > 0 ? Math.round((responded / outreachSent) * 100) : 0,
    conversionRate: outreachSent > 0 ? Math.round((contracted / outreachSent) * 100) : 0,
    avgScore: influencers.length > 0 ? Math.round(influencers.reduce((sum, i) => sum + i.score, 0) / influencers.length) : 0,
  };
}

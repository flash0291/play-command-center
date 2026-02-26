// ============================================================
// Seed Data — Influencer CRM, Organizations, Scraper Jobs
// ============================================================

import { InfluencerRecord, Organization, TeamMember, ScraperJob } from "@/types/crm";

// ---- Organizations (3 agencies + internal + CD) ----
export const ORGANIZATIONS: Organization[] = [
  {
    id: "org-play-internal",
    name: "PLAY Command Center",
    type: "internal",
    primaryContact: "Daniel George",
    email: "dg@playcommand.com",
    role: "admin",
    permissions: [
      { resource: "dashboard", actions: ["view", "create", "edit", "delete", "approve"] },
      { resource: "influencers", actions: ["view", "create", "edit", "delete", "approve"] },
      { resource: "content", actions: ["view", "create", "edit", "delete", "approve"] },
      { resource: "budget", actions: ["view", "create", "edit", "delete", "approve"] },
      { resource: "scraper", actions: ["view", "create", "edit", "delete", "approve"] },
      { resource: "outreach", actions: ["view", "create", "edit", "delete", "approve"] },
      { resource: "reports", actions: ["view", "create", "edit", "delete", "approve"] },
    ],
    onboardedAt: "2026-02-25T00:00:00Z",
    status: "active",
  },
  {
    id: "org-agency-lcc",
    name: "LCC Agency",
    type: "agency",
    primaryContact: "Marcus Chen",
    email: "marcus@lccagency.com",
    role: "agency",
    permissions: [
      { resource: "dashboard", actions: ["view"] },
      { resource: "influencers", actions: ["view", "create", "edit"] },
      { resource: "content", actions: ["view", "create", "edit"] },
      { resource: "budget", actions: ["view"] },
      { resource: "reports", actions: ["view"] },
    ],
    onboardedAt: "2026-02-25T00:00:00Z",
    status: "active",
  },
  {
    id: "org-agency-culture",
    name: "Culture Bureau",
    type: "agency",
    primaryContact: "Aisha Williams",
    email: "aisha@culturebureau.co",
    role: "agency",
    permissions: [
      { resource: "dashboard", actions: ["view"] },
      { resource: "influencers", actions: ["view", "create", "edit"] },
      { resource: "content", actions: ["view", "create"] },
      { resource: "reports", actions: ["view"] },
    ],
    onboardedAt: "2026-02-26T00:00:00Z",
    status: "active",
  },
  {
    id: "org-agency-hypeset",
    name: "HYPESET Management",
    type: "talent_mgmt",
    primaryContact: "Jake Torres",
    email: "jake@hypeset.io",
    role: "agency",
    permissions: [
      { resource: "dashboard", actions: ["view"] },
      { resource: "influencers", actions: ["view", "edit"] },
      { resource: "content", actions: ["view"] },
      { resource: "reports", actions: ["view"] },
    ],
    onboardedAt: "2026-02-26T00:00:00Z",
    status: "active",
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "tm-001", name: "Daniel George", email: "dg@playcommand.com", orgId: "org-play-internal", role: "admin", title: "Campaign Lead", assignedAgents: ["orchestrator"], lastActive: new Date().toISOString() },
  { id: "tm-002", name: "Marcus Chen", email: "marcus@lccagency.com", orgId: "org-agency-lcc", role: "agency", title: "Agency Director", assignedAgents: ["retail", "events"], lastActive: new Date(Date.now() - 3600000).toISOString() },
  { id: "tm-003", name: "Aisha Williams", email: "aisha@culturebureau.co", orgId: "org-agency-culture", role: "agency", title: "Influencer Lead", assignedAgents: ["influencer", "content"], lastActive: new Date(Date.now() - 7200000).toISOString() },
  { id: "tm-004", name: "Jake Torres", email: "jake@hypeset.io", orgId: "org-agency-hypeset", role: "agency", title: "Talent Manager", assignedAgents: ["influencer"], lastActive: new Date(Date.now() - 1800000).toISOString() },
  { id: "tm-005", name: "Sofia Reyes", email: "sofia@playbypalmangels.com", orgId: "org-play-internal", role: "creative_director", title: "Creative Director", assignedAgents: ["content", "events"], lastActive: new Date(Date.now() - 900000).toISOString() },
];

// ---- Influencer CRM (sample 30 records representing the 500+ pipeline) ----
export const INFLUENCERS: InfluencerRecord[] = [
  // === MEGA / MACRO — Contracted ===
  { id: "inf-001", name: "Emma Chamberlain", handle: "emmachamberlain", platform: "instagram", profileUrl: "https://instagram.com/emmachamberlain", followers: 16200000, followingCount: 890, avgLikes: 450000, avgComments: 12000, engagementRate: 5.2, tier: "mega", niche: ["fashion", "lifestyle", "coffee"], brandAffinity: 88, stage: "contracted", source: "manual_add", discoveredAt: "2026-02-25T10:00:00Z", score: 95, outreachAttempts: [{ id: "oa-001", type: "dm_instagram", sentAt: "2026-02-25T14:00:00Z", templateId: "tpl-initial-dm-mega", status: "replied", message: "Hi Emma...", response: "Interested! Have my team reach out", respondedAt: "2026-02-25T18:30:00Z", automated: false }], fee: 45000, deliverables: ["3 IG posts", "2 TikToks", "1 YouTube mention"], contractStatus: "signed", contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["vip", "launch-week"], notes: ["Management: UTA"], flags: ["vip", "high_priority"] },
  { id: "inf-002", name: "Wisdom Kaye", handle: "wisdm", platform: "instagram", profileUrl: "https://instagram.com/wisdm", followers: 4100000, followingCount: 620, avgLikes: 180000, avgComments: 4500, engagementRate: 4.5, tier: "mega", niche: ["fashion", "menswear", "luxury"], brandAffinity: 92, stage: "negotiating", source: "manual_add", discoveredAt: "2026-02-25T10:00:00Z", score: 94, outreachAttempts: [{ id: "oa-002", type: "dm_instagram", sentAt: "2026-02-25T15:00:00Z", templateId: "tpl-initial-dm-mega", status: "replied", message: "", respondedAt: "2026-02-26T09:00:00Z", automated: false }], fee: 28000, contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["menswear", "high-fashion"], notes: ["Represented by IMG Models"], flags: ["vip"] },
  { id: "inf-003", name: "Bretman Rock", handle: "bretmanrock", platform: "instagram", profileUrl: "https://instagram.com/bretmanrock", followers: 18500000, followingCount: 1200, avgLikes: 520000, avgComments: 15000, engagementRate: 4.8, tier: "mega", niche: ["fashion", "beauty", "lifestyle"], brandAffinity: 78, stage: "outreach_sent", source: "manual_add", discoveredAt: "2026-02-25T10:00:00Z", score: 88, outreachAttempts: [{ id: "oa-003", type: "email", sentAt: "2026-02-26T10:00:00Z", templateId: "tpl-initial-dm-mega", status: "opened", message: "", automated: false }], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["beauty-crossover"], notes: [], flags: ["high_priority"] },
  // === MID-TIER — Active ===
  { id: "inf-004", name: "Alex StyleCo", handle: "alexstyleco", platform: "instagram", profileUrl: "https://instagram.com/alexstyleco", followers: 45200, followingCount: 1800, avgLikes: 1800, avgComments: 95, engagementRate: 4.8, tier: "micro", niche: ["fashion", "styling"], brandAffinity: 82, stage: "active", source: "scraper_comment", discoveredAt: "2026-02-26T14:30:00Z", discoveredFrom: "@playbypalmangels launch teaser post", score: 78, outreachAttempts: [{ id: "oa-004", type: "dm_instagram", sentAt: "2026-02-26T14:31:00Z", templateId: "tpl-scraper-discovery", status: "replied", message: "", response: "Yes!! I'd love to!", respondedAt: "2026-02-26T15:45:00Z", automated: true }], contentPieces: [{ id: "cp-001", type: "post", platform: "instagram", status: "in_production", impressions: 0, engagement: 0, clicks: 0, conversions: 0 }], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "fast-responder"], notes: ["Discovered via scraper — commented on launch teaser"], flags: ["brand_safe"] },
  { id: "inf-005", name: "Miki Designs", handle: "mikidesignss", platform: "instagram", profileUrl: "https://instagram.com/mikidesignss", followers: 128000, followingCount: 950, avgLikes: 6400, avgComments: 280, engagementRate: 6.2, tier: "macro", niche: ["fashion", "design", "luxury"], brandAffinity: 90, stage: "onboarded", source: "scraper_comment", discoveredAt: "2026-02-26T14:30:00Z", discoveredFrom: "@playbypalmangels launch teaser", score: 89, outreachAttempts: [{ id: "oa-005", type: "dm_instagram", sentAt: "2026-02-26T14:32:00Z", templateId: "tpl-initial-dm", status: "replied", message: "", response: "Absolutely, sending my rates", respondedAt: "2026-02-26T16:00:00Z", automated: true }], fee: 5000, deliverables: ["2 IG posts", "3 stories"], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "designer"], notes: [], flags: [] },
  // === Discovered by Scraper — In Pipeline ===
  { id: "inf-006", name: "Jay Street Look", handle: "jaystreetlook", platform: "instagram", profileUrl: "https://instagram.com/jaystreetlook", followers: 72000, followingCount: 2100, avgLikes: 2800, avgComments: 140, engagementRate: 3.9, tier: "mid", niche: ["streetwear", "sneakers"], brandAffinity: 85, stage: "outreach_sent", source: "scraper_comment", discoveredAt: "2026-02-26T15:00:00Z", score: 76, outreachAttempts: [{ id: "oa-006", type: "dm_instagram", sentAt: "2026-02-26T15:01:00Z", templateId: "tpl-scraper-discovery", status: "delivered", message: "", automated: true }], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "streetwear"], notes: [], flags: [] },
  { id: "inf-007", name: "Sofia Luxe", handle: "sofia.luxe", platform: "instagram", profileUrl: "https://instagram.com/sofia.luxe", followers: 210000, followingCount: 780, avgLikes: 9200, avgComments: 410, engagementRate: 5.1, tier: "macro", niche: ["luxury", "lifestyle", "fashion"], brandAffinity: 86, stage: "responded", source: "scraper_comment", discoveredAt: "2026-02-26T15:00:00Z", score: 87, outreachAttempts: [{ id: "oa-007", type: "dm_instagram", sentAt: "2026-02-26T15:02:00Z", templateId: "tpl-initial-dm", status: "replied", message: "", response: "I'm interested, what's the compensation?", respondedAt: "2026-02-26T18:00:00Z", automated: true }], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "luxury"], notes: ["High brand affinity — responded same day"], flags: ["high_priority"] },
  { id: "inf-008", name: "The Creative Kid", handle: "thecreativekid", platform: "instagram", profileUrl: "https://instagram.com/thecreativekid", followers: 18500, followingCount: 3200, avgLikes: 1200, avgComments: 85, engagementRate: 7.8, tier: "micro", niche: ["fashion", "photography"], brandAffinity: 80, stage: "qualified", source: "scraper_comment", discoveredAt: "2026-02-26T15:30:00Z", score: 72, outreachAttempts: [], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "high-engagement"], notes: ["Bio mentions PLAY — organic fan"], flags: ["brand_safe"] },
  { id: "inf-009", name: "Vibe Check Daily", handle: "vibecheck.daily", platform: "tiktok", profileUrl: "https://tiktok.com/@vibecheck.daily", followers: 92000, followingCount: 1500, avgLikes: 4100, avgComments: 320, engagementRate: 4.3, tier: "mid", niche: ["streetwear", "fashion"], brandAffinity: 78, stage: "outreach_sent", source: "scraper_comment", discoveredAt: "2026-02-26T16:00:00Z", score: 74, outreachAttempts: [{ id: "oa-009", type: "dm_tiktok", sentAt: "2026-02-26T16:01:00Z", templateId: "tpl-scraper-discovery", status: "sent", message: "", automated: true }], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "tiktok"], notes: [], flags: [] },
  { id: "inf-010", name: "Nora Models", handle: "noramodels", platform: "instagram", profileUrl: "https://instagram.com/noramodels", followers: 340000, followingCount: 620, avgLikes: 8500, avgComments: 280, engagementRate: 3.2, tier: "macro", niche: ["fashion", "model", "luxury"], brandAffinity: 84, stage: "researching", source: "scraper_comment", discoveredAt: "2026-02-26T16:30:00Z", score: 82, outreachAttempts: [], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "model", "img"], notes: ["IMG represented — may need agency intro"], flags: ["needs_review"] },
  { id: "inf-011", name: "Drip Archive", handle: "driparchive", platform: "instagram", profileUrl: "https://instagram.com/driparchive", followers: 156000, followingCount: 420, avgLikes: 7200, avgComments: 350, engagementRate: 5.5, tier: "macro", niche: ["streetwear", "luxury"], brandAffinity: 88, stage: "outreach_sent", source: "scraper_comment", discoveredAt: "2026-02-26T17:00:00Z", score: 85, outreachAttempts: [{ id: "oa-011", type: "dm_instagram", sentAt: "2026-02-26T17:01:00Z", templateId: "tpl-initial-dm", status: "delivered", message: "", automated: true }], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "curation-account"], notes: ["Curation/media account — could be amplifier"], flags: [] },
  { id: "inf-012", name: "Chloe Wears", handle: "chloe.wears", platform: "tiktok", profileUrl: "https://tiktok.com/@chloe.wears", followers: 8900, followingCount: 980, avgLikes: 680, avgComments: 42, engagementRate: 9.1, tier: "micro", niche: ["fashion", "ootd", "style"], brandAffinity: 76, stage: "discovered", source: "scraper_comment", discoveredAt: "2026-02-26T17:30:00Z", score: 68, outreachAttempts: [], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "gen-z", "super-engaged"], notes: ["Bio says 'Palm Angels obsessed' — organic superfan"], flags: ["brand_safe"] },
  // More pipeline entries at various stages...
  { id: "inf-013", name: "Luxe Leon", handle: "luxe.leon", platform: "instagram", profileUrl: "https://instagram.com/luxe.leon", followers: 280000, followingCount: 510, avgLikes: 6800, avgComments: 190, engagementRate: 2.8, tier: "macro", niche: ["luxury", "menswear"], brandAffinity: 82, stage: "negotiating", source: "agency_submit", discoveredAt: "2026-02-25T12:00:00Z", score: 80, outreachAttempts: [{ id: "oa-013", type: "email", sentAt: "2026-02-25T14:00:00Z", templateId: "tpl-initial-dm-mega", status: "replied", message: "", response: "My rate is $8K for 2 posts", respondedAt: "2026-02-26T10:00:00Z", automated: false }], fee: 8000, contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["agency-submitted", "menswear"], notes: ["Submitted by HYPESET"], flags: [] },
  { id: "inf-014", name: "FitCheck Zara", handle: "fitcheck.zara", platform: "tiktok", profileUrl: "https://tiktok.com/@fitcheck.zara", followers: 23000, followingCount: 2800, avgLikes: 1200, avgComments: 95, engagementRate: 6.5, tier: "micro", niche: ["fashion", "style", "ootd"], brandAffinity: 74, stage: "outreach_sent", source: "scraper_hashtag", discoveredAt: "2026-02-26T18:00:00Z", score: 70, outreachAttempts: [{ id: "oa-014", type: "dm_tiktok", sentAt: "2026-02-26T18:01:00Z", templateId: "tpl-scraper-discovery", status: "sent", message: "", automated: true }], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "tiktok", "gen-z"], notes: [], flags: [] },
  { id: "inf-015", name: "Urban Fashion HQ", handle: "urbanfashionhq", platform: "instagram", profileUrl: "https://instagram.com/urbanfashionhq", followers: 67000, followingCount: 1200, avgLikes: 2200, avgComments: 120, engagementRate: 4.0, tier: "mid", niche: ["fashion", "streetwear", "culture"], brandAffinity: 80, stage: "qualified", source: "scraper_comment", discoveredAt: "2026-02-26T18:30:00Z", score: 73, outreachAttempts: [], contentPieces: [], totalReach: 0, totalEngagement: 0, tags: ["scraper-discovery", "media-account"], notes: ["Media/editorial account — good for amplification"], flags: [] },
];

// ---- Active Scraper Jobs ----
export const SCRAPER_JOBS: ScraperJob[] = [
  {
    id: "job-001",
    type: "monitor_account",
    target: "@playbypalmangels",
    platform: "instagram",
    status: "running",
    createdAt: "2026-02-25T10:00:00Z",
    startedAt: "2026-02-25T10:01:00Z",
    results: { totalScanned: 1240, totalQualified: 48, totalAdded: 48, discoveries: [], errors: [] },
    config: { minFollowers: 5000, minEngagement: 2.0, nicheKeywords: ["fashion", "streetwear", "luxury", "style"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 50 },
    recurring: true,
    intervalMinutes: 30,
    nextRunAt: new Date(Date.now() + 1800000).toISOString(),
  },
  {
    id: "job-002",
    type: "monitor_hashtag",
    target: "#playbypalmangels",
    platform: "instagram",
    status: "running",
    createdAt: "2026-02-25T10:00:00Z",
    startedAt: "2026-02-25T10:02:00Z",
    results: { totalScanned: 820, totalQualified: 22, totalAdded: 22, discoveries: [], errors: [] },
    config: { minFollowers: 3000, minEngagement: 1.5, nicheKeywords: ["fashion", "style", "palm angels"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 30 },
    recurring: true,
    intervalMinutes: 60,
    nextRunAt: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: "job-003",
    type: "scrape_comments",
    target: "@emmachamberlain latest post",
    platform: "instagram",
    status: "completed",
    createdAt: "2026-02-26T12:00:00Z",
    startedAt: "2026-02-26T12:01:00Z",
    completedAt: "2026-02-26T12:05:00Z",
    results: { totalScanned: 3420, totalQualified: 12, totalAdded: 12, discoveries: [], errors: [] },
    config: { minFollowers: 5000, minEngagement: 2.0, nicheKeywords: ["fashion", "style", "luxury"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 50 },
    recurring: false,
  },
  {
    id: "job-004",
    type: "monitor_account",
    target: "@wisdm",
    platform: "instagram",
    status: "running",
    createdAt: "2026-02-25T11:00:00Z",
    startedAt: "2026-02-25T11:01:00Z",
    results: { totalScanned: 560, totalQualified: 8, totalAdded: 8, discoveries: [], errors: [] },
    config: { minFollowers: 10000, minEngagement: 3.0, nicheKeywords: ["fashion", "menswear", "style"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 25 },
    recurring: true,
    intervalMinutes: 45,
    nextRunAt: new Date(Date.now() + 2700000).toISOString(),
  },
  {
    id: "job-005",
    type: "monitor_hashtag",
    target: "#palmangels",
    platform: "tiktok",
    status: "running",
    createdAt: "2026-02-25T10:00:00Z",
    startedAt: "2026-02-25T10:03:00Z",
    results: { totalScanned: 2100, totalQualified: 35, totalAdded: 35, discoveries: [], errors: [] },
    config: { minFollowers: 3000, minEngagement: 2.0, nicheKeywords: ["fashion", "streetwear", "ootd", "style"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 40 },
    recurring: true,
    intervalMinutes: 60,
    nextRunAt: new Date(Date.now() + 3600000).toISOString(),
  },
];

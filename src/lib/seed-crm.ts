// ============================================================
// Seed Data — Generated from Autonomous Discovery Engine
// 120+ influencers across 8 verticals, all auto-discovered
// No manual adds — everything is AI-driven
// ============================================================

import { Organization, TeamMember, ScraperJob } from "@/types/crm";
import { generateAllInfluencers } from "@/lib/influencer-generator";

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

// ---- Generated Influencers (120+ across all verticals) ----
export const INFLUENCERS = generateAllInfluencers();

// ---- Active Scraper Jobs (expanded across verticals) ----
export const SCRAPER_JOBS: ScraperJob[] = [
  // Fashion vertical scrapers
  {
    id: "job-001",
    type: "monitor_account",
    target: "@playbypalmangels",
    platform: "instagram",
    status: "running",
    createdAt: "2026-02-25T10:00:00Z",
    startedAt: "2026-02-25T10:01:00Z",
    results: { totalScanned: 3240, totalQualified: 86, totalAdded: 86, discoveries: [], errors: [] },
    config: { minFollowers: 5000, minEngagement: 2.0, nicheKeywords: ["fashion", "streetwear", "luxury", "style", "play", "palm angels"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 50 },
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
    results: { totalScanned: 1820, totalQualified: 44, totalAdded: 44, discoveries: [], errors: [] },
    config: { minFollowers: 3000, minEngagement: 1.5, nicheKeywords: ["fashion", "style", "palm angels", "play"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 30 },
    recurring: true,
    intervalMinutes: 60,
    nextRunAt: new Date(Date.now() + 3600000).toISOString(),
  },
  // Influencer comment scraping
  {
    id: "job-003",
    type: "scrape_comments",
    target: "@emmachamberlain latest post",
    platform: "instagram",
    status: "completed",
    createdAt: "2026-02-26T12:00:00Z",
    startedAt: "2026-02-26T12:01:00Z",
    completedAt: "2026-02-26T12:05:00Z",
    results: { totalScanned: 5420, totalQualified: 18, totalAdded: 18, discoveries: [], errors: [] },
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
    results: { totalScanned: 1560, totalQualified: 24, totalAdded: 24, discoveries: [], errors: [] },
    config: { minFollowers: 10000, minEngagement: 3.0, nicheKeywords: ["fashion", "menswear", "style", "luxury"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 25 },
    recurring: true,
    intervalMinutes: 45,
    nextRunAt: new Date(Date.now() + 2700000).toISOString(),
  },
  // Music vertical scrapers
  {
    id: "job-005",
    type: "monitor_hashtag",
    target: "#hiphopfashion",
    platform: "instagram",
    status: "running",
    createdAt: "2026-02-25T12:00:00Z",
    startedAt: "2026-02-25T12:01:00Z",
    results: { totalScanned: 2800, totalQualified: 32, totalAdded: 32, discoveries: [], errors: [] },
    config: { minFollowers: 5000, minEngagement: 2.0, nicheKeywords: ["music", "hip-hop", "rap", "fashion", "style"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 40 },
    recurring: true,
    intervalMinutes: 60,
    nextRunAt: new Date(Date.now() + 3600000).toISOString(),
  },
  // Sports vertical
  {
    id: "job-006",
    type: "monitor_hashtag",
    target: "#skatestyle",
    platform: "tiktok",
    status: "running",
    createdAt: "2026-02-25T13:00:00Z",
    startedAt: "2026-02-25T13:01:00Z",
    results: { totalScanned: 1900, totalQualified: 22, totalAdded: 22, discoveries: [], errors: [] },
    config: { minFollowers: 3000, minEngagement: 2.5, nicheKeywords: ["skate", "skateboard", "streetwear", "fashion"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 30 },
    recurring: true,
    intervalMinutes: 60,
    nextRunAt: new Date(Date.now() + 3600000).toISOString(),
  },
  // Gaming vertical
  {
    id: "job-007",
    type: "monitor_hashtag",
    target: "#gamingfashion",
    platform: "tiktok",
    status: "running",
    createdAt: "2026-02-26T08:00:00Z",
    startedAt: "2026-02-26T08:01:00Z",
    results: { totalScanned: 980, totalQualified: 14, totalAdded: 14, discoveries: [], errors: [] },
    config: { minFollowers: 5000, minEngagement: 3.0, nicheKeywords: ["gaming", "streamer", "fashion", "drip", "streetwear"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 25 },
    recurring: true,
    intervalMinutes: 90,
    nextRunAt: new Date(Date.now() + 5400000).toISOString(),
  },
  // TikTok broad fashion
  {
    id: "job-008",
    type: "monitor_hashtag",
    target: "#palmangels",
    platform: "tiktok",
    status: "running",
    createdAt: "2026-02-25T10:00:00Z",
    startedAt: "2026-02-25T10:03:00Z",
    results: { totalScanned: 4100, totalQualified: 58, totalAdded: 58, discoveries: [], errors: [] },
    config: { minFollowers: 3000, minEngagement: 2.0, nicheKeywords: ["fashion", "streetwear", "ootd", "style", "palm angels"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 40 },
    recurring: true,
    intervalMinutes: 60,
    nextRunAt: new Date(Date.now() + 3600000).toISOString(),
  },
  // Culture / Lifestyle
  {
    id: "job-009",
    type: "scrape_comments",
    target: "@travisscott latest post",
    platform: "instagram",
    status: "completed",
    createdAt: "2026-02-26T14:00:00Z",
    startedAt: "2026-02-26T14:01:00Z",
    completedAt: "2026-02-26T14:08:00Z",
    results: { totalScanned: 8200, totalQualified: 28, totalAdded: 28, discoveries: [], errors: [] },
    config: { minFollowers: 5000, minEngagement: 2.0, nicheKeywords: ["fashion", "music", "culture", "style", "hip-hop"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 50 },
    recurring: false,
  },
  // Art / Creative
  {
    id: "job-010",
    type: "monitor_hashtag",
    target: "#streetartfashion",
    platform: "instagram",
    status: "running",
    createdAt: "2026-02-26T09:00:00Z",
    startedAt: "2026-02-26T09:01:00Z",
    results: { totalScanned: 720, totalQualified: 12, totalAdded: 12, discoveries: [], errors: [] },
    config: { minFollowers: 3000, minEngagement: 2.0, nicheKeywords: ["art", "photography", "design", "fashion", "creative"], excludeHandles: [], autoOutreach: true, outreachTemplateId: "tpl-scraper-discovery", maxDiscoveriesPerRun: 20 },
    recurring: true,
    intervalMinutes: 120,
    nextRunAt: new Date(Date.now() + 7200000).toISOString(),
  },
];

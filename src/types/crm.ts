// ============================================================
// PLAY Command Center — CRM, Scraper & Multi-Org Types
// Influencer pipeline at scale + autonomous discovery
// ============================================================

// ---- Multi-Org Role System ----
export type OrgRole = "admin" | "agency" | "creative_director" | "influencer" | "viewer";

export interface Organization {
  id: string;
  name: string;
  type: "internal" | "agency" | "talent_mgmt";
  logo?: string;
  primaryContact: string;
  email: string;
  role: OrgRole;
  permissions: Permission[];
  onboardedAt: string;
  status: "pending" | "active" | "suspended";
}

export interface Permission {
  resource: "dashboard" | "influencers" | "content" | "budget" | "scraper" | "outreach" | "reports";
  actions: ("view" | "create" | "edit" | "delete" | "approve")[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  orgId: string;
  role: OrgRole;
  avatar?: string;
  title: string;
  assignedAgents: string[];
  lastActive: string;
}

// ---- Influencer CRM at Scale ----
export type InfluencerStage =
  | "discovered"      // Found by scraper or manual add
  | "researching"     // AI is analyzing their profile
  | "qualified"       // Meets criteria, ready for outreach
  | "outreach_sent"   // Auto-DM or email sent
  | "responded"       // They replied
  | "negotiating"     // Terms being discussed
  | "contracted"      // Deal signed
  | "onboarded"       // Product shipped, brief sent
  | "active"          // Currently creating content
  | "content_live"    // Content published
  | "completed"       // Campaign deliverables done
  | "declined"        // They passed
  | "unresponsive";   // No response after X attempts

export type DiscoverySource =
  | "scraper_comment"    // Found via comment scraping
  | "scraper_follower"   // Found via follower analysis
  | "scraper_hashtag"    // Found via hashtag monitoring
  | "scraper_mention"    // Found via brand mention
  | "manual_add"         // Added by team member
  | "agency_submit"      // Submitted by agency partner
  | "inbound_apply"      // Applied through creator portal
  | "referral";          // Referred by existing creator

export interface InfluencerRecord {
  id: string;
  // Profile
  name: string;
  handle: string;
  email?: string;
  phone?: string;
  platform: "instagram" | "tiktok" | "youtube" | "twitter" | "multi";
  profileUrl: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  // Metrics
  followers: number;
  followingCount: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  audienceDemo?: AudienceDemographics;
  // Classification
  tier: "mega" | "macro" | "mid" | "micro" | "nano";
  niche: string[];
  brandAffinity: number; // 0-100 — how aligned with PLAY brand
  // Pipeline
  stage: InfluencerStage;
  source: DiscoverySource;
  discoveredAt: string;
  discoveredFrom?: string; // which post/account they were found from
  score: number; // 0-100 composite score
  // Outreach
  outreachAttempts: OutreachAttempt[];
  lastContactedAt?: string;
  responseRate?: number;
  // Contract
  fee?: number;
  deliverables?: string[];
  contractStatus?: "draft" | "sent" | "signed" | "expired";
  // Content
  contentPieces: ContentDelivery[];
  totalReach: number;
  totalEngagement: number;
  roi?: number;
  // Management
  assignedTo?: string; // team member ID
  agencyId?: string;
  tags: string[];
  notes: string[];
  flags: InfluencerFlag[];
}

export interface AudienceDemographics {
  ageRanges: Record<string, number>;
  genderSplit: { male: number; female: number; other: number };
  topCountries: { country: string; pct: number }[];
  topCities: { city: string; pct: number }[];
  interests: string[];
}

export interface OutreachAttempt {
  id: string;
  type: "dm_instagram" | "dm_tiktok" | "email" | "phone" | "agency_intro";
  sentAt: string;
  templateId: string;
  status: "sent" | "delivered" | "opened" | "replied" | "bounced" | "ignored";
  message: string;
  response?: string;
  respondedAt?: string;
  automated: boolean;
}

export interface ContentDelivery {
  id: string;
  type: "post" | "story" | "reel" | "tiktok" | "youtube" | "tweet";
  platform: string;
  postUrl?: string;
  scheduledDate?: string;
  publishedDate?: string;
  status: "briefed" | "in_production" | "submitted" | "revision" | "approved" | "published";
  impressions: number;
  engagement: number;
  clicks: number;
  conversions: number;
}

export type InfluencerFlag = "high_priority" | "vip" | "competitor_risk" | "fake_followers" | "brand_safe" | "needs_review" | "do_not_contact";

// ---- Social Scraper Engine ----
export type ScraperJobType =
  | "monitor_post"     // Watch a specific post for comments
  | "monitor_hashtag"  // Watch a hashtag for new posts
  | "monitor_account"  // Watch an account for new posts
  | "scrape_comments"  // Scrape all comments on a post
  | "scrape_followers" // Scrape followers of an account
  | "analyze_profile"; // Deep-analyze a discovered profile

export type ScraperJobStatus = "queued" | "running" | "completed" | "failed" | "paused";

export interface ScraperJob {
  id: string;
  type: ScraperJobType;
  target: string; // URL, handle, or hashtag
  platform: "instagram" | "tiktok" | "youtube" | "twitter";
  status: ScraperJobStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  results: ScraperResult;
  config: ScraperConfig;
  recurring: boolean;
  intervalMinutes?: number; // for recurring jobs
  nextRunAt?: string;
  error?: string;
}

export interface ScraperConfig {
  minFollowers: number;       // Minimum followers to qualify
  minEngagement: number;      // Minimum engagement rate
  maxFollowers?: number;      // Cap to exclude mega-celebrities
  nicheKeywords: string[];    // Must match at least one
  excludeHandles: string[];   // Blacklist
  autoOutreach: boolean;      // Auto-send DM if qualified
  outreachTemplateId?: string;
  maxDiscoveriesPerRun: number;
}

export interface ScraperResult {
  totalScanned: number;
  totalQualified: number;
  totalAdded: number;
  discoveries: ScraperDiscovery[];
  errors: string[];
}

export interface ScraperDiscovery {
  id: string;
  handle: string;
  platform: string;
  profileUrl: string;
  followers: number;
  engagementRate: number;
  bio: string;
  foundVia: string; // "comment on @handle's post" etc.
  comment?: string; // the actual comment they left
  score: number;
  autoOutreachSent: boolean;
  addedToInfluencerCRM: boolean;
  timestamp: string;
}

// ---- Outreach Templates ----
export interface OutreachTemplate {
  id: string;
  name: string;
  type: "dm" | "email";
  platform?: "instagram" | "tiktok" | "email";
  subject?: string; // for email
  body: string;
  variables: string[]; // e.g. {{name}}, {{handle}}, {{follower_count}}
  category: "initial_outreach" | "follow_up" | "negotiation" | "onboarding" | "re_engagement";
  performanceStats: {
    sent: number;
    opened: number;
    replied: number;
    converted: number;
    responseRate: number;
    conversionRate: number;
  };
  createdBy: string;
  active: boolean;
}

// ---- Autonomous Pipeline Stats ----
export interface PipelineStats {
  totalDiscovered: number;
  totalQualified: number;
  totalOutreachSent: number;
  totalResponded: number;
  totalContracted: number;
  totalActive: number;
  conversionFunnel: {
    stage: InfluencerStage;
    count: number;
    pctOfPrevious: number;
  }[];
  discoveryRate: number; // per day
  outreachRate: number; // per day
  responseRate: number; // percentage
  avgTimeToResponse: number; // hours
  avgTimeToContract: number; // days
  topPerformingTemplate: string;
  scrapersRunning: number;
  scrapersQueued: number;
}

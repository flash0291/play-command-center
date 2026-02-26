// ============================================================
// Social Scraper Engine — Autonomous Influencer Discovery
//
// The scraper runs as a background loop:
// 1. Monitor posts from existing PLAY influencers
// 2. When they post, scrape all comments
// 3. For each commenter, check if they're an influencer
// 4. Score them against PLAY brand criteria
// 5. If qualified, add to CRM and trigger auto-outreach
// ============================================================

import {
  ScraperJob, ScraperJobType, ScraperConfig, ScraperDiscovery,
} from "@/types/crm";

// Default scraper configuration
export const DEFAULT_SCRAPER_CONFIG: ScraperConfig = {
  minFollowers: 5000,
  minEngagement: 2.0,
  maxFollowers: 5000000,
  nicheKeywords: [
    "fashion", "streetwear", "luxury", "style", "ootd",
    "designer", "sneakers", "hypebeast", "palm angels", "play",
    "menswear", "womenswear", "lifestyle", "creative",
  ],
  excludeHandles: [],
  autoOutreach: true,
  outreachTemplateId: "tpl-initial-dm",
  maxDiscoveriesPerRun: 50,
};

// Score an influencer profile (0-100)
export function scoreInfluencer(profile: {
  followers: number;
  engagementRate: number;
  bio: string;
  niche: string[];
  platform: string;
}): number {
  let score = 0;

  // Follower tier scoring (max 25)
  if (profile.followers >= 100000) score += 25;
  else if (profile.followers >= 50000) score += 22;
  else if (profile.followers >= 25000) score += 18;
  else if (profile.followers >= 10000) score += 14;
  else if (profile.followers >= 5000) score += 10;
  else score += 5;

  // Engagement rate scoring (max 25)
  if (profile.engagementRate >= 8) score += 25;
  else if (profile.engagementRate >= 5) score += 22;
  else if (profile.engagementRate >= 3) score += 18;
  else if (profile.engagementRate >= 2) score += 14;
  else if (profile.engagementRate >= 1) score += 8;

  // Niche alignment (max 25)
  const fashionKeywords = ["fashion", "style", "streetwear", "luxury", "designer", "ootd", "hypebeast"];
  const nicheMatches = profile.niche.filter((n) =>
    fashionKeywords.some((kw) => n.toLowerCase().includes(kw))
  ).length;
  score += Math.min(nicheMatches * 5, 25);

  // Bio relevance (max 15)
  const bioLower = profile.bio.toLowerCase();
  const bioKeywords = ["fashion", "style", "creative", "brand", "model", "photographer", "designer", "influencer"];
  const bioMatches = bioKeywords.filter((kw) => bioLower.includes(kw)).length;
  score += Math.min(bioMatches * 3, 15);

  // Platform bonus (max 10)
  if (profile.platform === "instagram") score += 10;
  else if (profile.platform === "tiktok") score += 9;
  else if (profile.platform === "youtube") score += 7;
  else score += 5;

  return Math.min(score, 100);
}

// Classify tier based on follower count
export function classifyTier(followers: number): "mega" | "macro" | "mid" | "micro" | "nano" {
  if (followers >= 1000000) return "mega";
  if (followers >= 100000) return "macro";
  if (followers >= 25000) return "mid";
  if (followers >= 5000) return "micro";
  return "nano";
}

// Simulate scraping comments from a post and discovering influencers
export function simulateCommentScrape(
  postOwnerHandle: string,
  postUrl: string,
  config: ScraperConfig
): ScraperDiscovery[] {
  // In production, this calls Instagram Graph API / Apify / custom scraper
  // For now, simulate realistic discoveries
  const SIMULATED_COMMENTERS = [
    { handle: "alexstyleco", followers: 45200, engagement: 4.8, bio: "Fashion creative | NYC | Styling for brands", niche: ["fashion", "styling"], platform: "instagram" },
    { handle: "mikidesignss", followers: 128000, engagement: 6.2, bio: "Designer & visual storyteller. DM for collabs.", niche: ["fashion", "design", "luxury"], platform: "instagram" },
    { handle: "jaystreetlook", followers: 72000, engagement: 3.9, bio: "Streetwear | Sneakers | Palm Angels fan", niche: ["streetwear", "sneakers", "hypebeast"], platform: "instagram" },
    { handle: "sofia.luxe", followers: 210000, engagement: 5.1, bio: "Luxury lifestyle | Brand ambassador | NY/LA", niche: ["luxury", "lifestyle", "fashion"], platform: "instagram" },
    { handle: "thecreativekid", followers: 18500, engagement: 7.8, bio: "Content creator | Fashion photography | PLAY \u2764\uFE0F", niche: ["fashion", "photography", "creative"], platform: "instagram" },
    { handle: "vibecheck.daily", followers: 92000, engagement: 4.3, bio: "Daily fashion inspo | Streetwear culture", niche: ["streetwear", "fashion", "ootd"], platform: "tiktok" },
    { handle: "noramodels", followers: 340000, engagement: 3.2, bio: "Model | Fashion Week regular | Represented by IMG", niche: ["fashion", "model", "luxury"], platform: "instagram" },
    { handle: "driparchive", followers: 156000, engagement: 5.5, bio: "Curating the best in streetwear and luxury", niche: ["streetwear", "luxury", "hypebeast"], platform: "instagram" },
    { handle: "chloe.wears", followers: 8900, engagement: 9.1, bio: "OOTD queen | Fashion student | Palm Angels obsessed", niche: ["fashion", "ootd", "style"], platform: "tiktok" },
    { handle: "urbanfashionhq", followers: 67000, engagement: 4.0, bio: "Urban fashion & culture magazine", niche: ["fashion", "streetwear", "culture"], platform: "instagram" },
    { handle: "luxe.leon", followers: 280000, engagement: 2.8, bio: "Luxury menswear | Travel | Partnerships: leon@mgmt.co", niche: ["luxury", "menswear", "fashion"], platform: "instagram" },
    { handle: "fitcheck.zara", followers: 23000, engagement: 6.5, bio: "Fit checks & fashion hauls | Gen-Z style", niche: ["fashion", "style", "ootd"], platform: "tiktok" },
  ];

  const discoveries: ScraperDiscovery[] = [];

  for (const commenter of SIMULATED_COMMENTERS) {
    // Apply filters
    if (commenter.followers < config.minFollowers) continue;
    if (commenter.engagement < config.minEngagement) continue;
    if (config.maxFollowers && commenter.followers > config.maxFollowers) continue;
    if (config.excludeHandles.includes(commenter.handle)) continue;

    // Check niche overlap
    const hasNicheMatch = commenter.niche.some((n) =>
      config.nicheKeywords.some((kw) => n.toLowerCase().includes(kw.toLowerCase()))
    );
    if (!hasNicheMatch) continue;

    const score = scoreInfluencer({
      followers: commenter.followers,
      engagementRate: commenter.engagement,
      bio: commenter.bio,
      niche: commenter.niche,
      platform: commenter.platform,
    });

    discoveries.push({
      id: `disc-${Date.now()}-${commenter.handle}`,
      handle: commenter.handle,
      platform: commenter.platform,
      profileUrl: `https://${commenter.platform === "tiktok" ? "tiktok.com" : "instagram.com"}/${commenter.handle}`,
      followers: commenter.followers,
      engagementRate: commenter.engagement,
      bio: commenter.bio,
      foundVia: `Comment on @${postOwnerHandle}'s post`,
      comment: generateSimulatedComment(),
      score,
      autoOutreachSent: config.autoOutreach && score >= 60,
      addedToInfluencerCRM: true,
      timestamp: new Date().toISOString(),
    });

    if (discoveries.length >= config.maxDiscoveriesPerRun) break;
  }

  return discoveries.sort((a, b) => b.score - a.score);
}

function generateSimulatedComment(): string {
  const comments = [
    "This is fire \uD83D\uDD25\uD83D\uDD25",
    "Need this whole fit!! Where's the jacket from?",
    "PLAY goes crazy, Palm Angels never misses",
    "Obsessed with this collection",
    "The styling on this is insane",
    "Just ordered mine \uD83D\uDE4C",
    "This brand is about to blow up",
    "Collab? DM me \uD83D\uDE4F",
    "Adding to cart rn",
    "The quality on PA is unmatched",
    "Need to shoot in this piece",
    "Fashion goals tbh",
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

// Create a new scraper job
export function createScraperJob(
  type: ScraperJobType,
  target: string,
  platform: "instagram" | "tiktok" | "youtube" | "twitter",
  config: Partial<ScraperConfig> = {},
  recurring = false,
  intervalMinutes = 60
): ScraperJob {
  return {
    id: `job-${Date.now()}`,
    type,
    target,
    platform,
    status: "queued",
    createdAt: new Date().toISOString(),
    results: { totalScanned: 0, totalQualified: 0, totalAdded: 0, discoveries: [], errors: [] },
    config: { ...DEFAULT_SCRAPER_CONFIG, ...config },
    recurring,
    intervalMinutes: recurring ? intervalMinutes : undefined,
    nextRunAt: recurring ? new Date(Date.now() + intervalMinutes * 60000).toISOString() : undefined,
  };
}

// Run a scraper job (simulated)
export function runScraperJob(job: ScraperJob): ScraperJob {
  const discoveries = simulateCommentScrape(
    job.target.replace("@", ""),
    job.target,
    job.config
  );

  return {
    ...job,
    status: "completed",
    startedAt: new Date(Date.now() - 30000).toISOString(),
    completedAt: new Date().toISOString(),
    results: {
      totalScanned: Math.floor(Math.random() * 200) + 50,
      totalQualified: discoveries.length,
      totalAdded: discoveries.length,
      discoveries,
      errors: [],
    },
    nextRunAt: job.recurring
      ? new Date(Date.now() + (job.intervalMinutes || 60) * 60000).toISOString()
      : undefined,
  };
}

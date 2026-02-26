// ============================================================
// CRM Store — Influencer Pipeline + Scraper + Outreach
// Enhanced with vertical/tag filtering, auto-population
// ============================================================

import { create } from "zustand";
import { InfluencerRecord, InfluencerStage, ScraperJob, Organization, TeamMember, ScraperDiscovery } from "@/types/crm";
import { INFLUENCERS, ORGANIZATIONS, TEAM_MEMBERS, SCRAPER_JOBS } from "@/lib/seed-crm";
import { OUTREACH_TEMPLATES } from "@/agents/outreach/pipeline";
import type { OutreachTemplate } from "@/types/crm";
import { runScraperJob } from "@/agents/scraper/engine";
import type { PlayVertical } from "@/lib/play-verticals";

interface CRMState {
  influencers: InfluencerRecord[];
  organizations: Organization[];
  teamMembers: TeamMember[];
  scraperJobs: ScraperJob[];
  templates: OutreachTemplate[];
  liveDiscoveries: ScraperDiscovery[];

  // Filters
  stageFilter: InfluencerStage | "all";
  sourceFilter: string;
  searchQuery: string;
  verticalFilter: PlayVertical | "all";
  tagFilter: string[];
  tierFilter: string;
  platformFilter: string;

  // Actions
  setStageFilter: (stage: InfluencerStage | "all") => void;
  setSourceFilter: (source: string) => void;
  setSearchQuery: (query: string) => void;
  setVerticalFilter: (vertical: PlayVertical | "all") => void;
  setTagFilter: (tags: string[]) => void;
  setTierFilter: (tier: string) => void;
  setPlatformFilter: (platform: string) => void;
  toggleTag: (tag: string) => void;
  updateInfluencerStage: (id: string, stage: InfluencerStage) => void;
  addInfluencer: (inf: InfluencerRecord) => void;
  runScraper: (jobId: string) => void;
  addDiscovery: (discovery: ScraperDiscovery) => void;

  // Computed
  getFilteredInfluencers: () => InfluencerRecord[];
  getStageCount: (stage: InfluencerStage) => number;
  getVerticalCount: (vertical: string) => number;
  getTagCounts: () => Record<string, number>;
  getTierDistribution: () => Record<string, number>;
  getPipelineStats: () => {
    total: number;
    discovered: number;
    outreachSent: number;
    responded: number;
    contracted: number;
    active: number;
    responseRate: number;
    conversionRate: number;
    scrapersRunning: number;
    totalDiscoveredToday: number;
    avgEngagement: number;
    avgScore: number;
    topVertical: string;
    autoDiscovered: number;
  };
}

export const useCRMStore = create<CRMState>((set, get) => ({
  influencers: INFLUENCERS,
  organizations: ORGANIZATIONS,
  teamMembers: TEAM_MEMBERS,
  scraperJobs: SCRAPER_JOBS,
  templates: OUTREACH_TEMPLATES,
  liveDiscoveries: [],
  stageFilter: "all",
  sourceFilter: "all",
  searchQuery: "",
  verticalFilter: "all",
  tagFilter: [],
  tierFilter: "all",
  platformFilter: "all",

  setStageFilter: (stage) => set({ stageFilter: stage }),
  setSourceFilter: (source) => set({ sourceFilter: source }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setVerticalFilter: (vertical) => set({ verticalFilter: vertical }),
  setTagFilter: (tags) => set({ tagFilter: tags }),
  setTierFilter: (tier) => set({ tierFilter: tier }),
  setPlatformFilter: (platform) => set({ platformFilter: platform }),

  toggleTag: (tag) =>
    set((s) => ({
      tagFilter: s.tagFilter.includes(tag)
        ? s.tagFilter.filter((t) => t !== tag)
        : [...s.tagFilter, tag],
    })),

  updateInfluencerStage: (id, stage) =>
    set((s) => ({
      influencers: s.influencers.map((i) => (i.id === id ? { ...i, stage } : i)),
    })),

  addInfluencer: (inf) => set((s) => ({ influencers: [inf, ...s.influencers] })),

  runScraper: (jobId) =>
    set((s) => {
      const job = s.scraperJobs.find((j) => j.id === jobId);
      if (!job) return s;
      const updated = runScraperJob(job);
      return {
        scraperJobs: s.scraperJobs.map((j) => (j.id === jobId ? updated : j)),
        liveDiscoveries: [...updated.results.discoveries, ...s.liveDiscoveries],
      };
    }),

  addDiscovery: (discovery) =>
    set((s) => ({ liveDiscoveries: [discovery, ...s.liveDiscoveries] })),

  getFilteredInfluencers: () => {
    const { influencers, stageFilter, sourceFilter, searchQuery, verticalFilter, tagFilter, tierFilter, platformFilter } = get();
    return influencers.filter((i) => {
      if (stageFilter !== "all" && i.stage !== stageFilter) return false;
      if (sourceFilter !== "all" && i.source !== sourceFilter) return false;
      if (tierFilter !== "all" && i.tier !== tierFilter) return false;
      if (platformFilter !== "all" && i.platform !== platformFilter) return false;

      // Vertical filter: check if any of the influencer's niches or tags match the vertical
      if (verticalFilter !== "all") {
        const allTags = [...i.niche, ...i.tags].map((t) => t.toLowerCase());
        if (!allTags.some((t) => t.includes(verticalFilter))) return false;
      }

      // Tag filter: influencer must have ALL selected tags
      if (tagFilter.length > 0) {
        const allTags = [...i.niche, ...i.tags].map((t) => t.toLowerCase());
        if (!tagFilter.every((ft) => allTags.some((t) => t.includes(ft.toLowerCase())))) return false;
      }

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          i.name.toLowerCase().includes(q) ||
          i.handle.toLowerCase().includes(q) ||
          i.niche.some((n) => n.toLowerCase().includes(q)) ||
          i.tags.some((t) => t.toLowerCase().includes(q)) ||
          (i.bio && i.bio.toLowerCase().includes(q))
        );
      }
      return true;
    });
  },

  getStageCount: (stage) => get().influencers.filter((i) => i.stage === stage).length,

  getVerticalCount: (vertical) => {
    const v = vertical.toLowerCase();
    return get().influencers.filter((i) =>
      [...i.niche, ...i.tags].some((t) => t.toLowerCase().includes(v))
    ).length;
  },

  getTagCounts: () => {
    const counts: Record<string, number> = {};
    for (const inf of get().influencers) {
      for (const tag of [...inf.niche, ...inf.tags]) {
        const t = tag.toLowerCase();
        counts[t] = (counts[t] || 0) + 1;
      }
    }
    return counts;
  },

  getTierDistribution: () => {
    const dist: Record<string, number> = { mega: 0, macro: 0, mid: 0, micro: 0, nano: 0 };
    for (const inf of get().influencers) {
      dist[inf.tier] = (dist[inf.tier] || 0) + 1;
    }
    return dist;
  },

  getPipelineStats: () => {
    const { influencers, scraperJobs, liveDiscoveries } = get();
    const total = influencers.length;
    const discovered = influencers.filter((i) => ["discovered", "researching", "qualified"].includes(i.stage)).length;
    const outreachSent = influencers.filter((i) => ["outreach_sent", "responded", "negotiating", "contracted", "onboarded", "active", "content_live", "completed"].includes(i.stage)).length;
    const responded = influencers.filter((i) => ["responded", "negotiating", "contracted", "onboarded", "active", "content_live", "completed"].includes(i.stage)).length;
    const contracted = influencers.filter((i) => ["contracted", "onboarded", "active", "content_live", "completed"].includes(i.stage)).length;
    const active = influencers.filter((i) => ["active", "content_live"].includes(i.stage)).length;

    // Calculate averages
    const avgEngagement = total > 0 ? Number((influencers.reduce((sum, i) => sum + i.engagementRate, 0) / total).toFixed(1)) : 0;
    const avgScore = total > 0 ? Math.round(influencers.reduce((sum, i) => sum + i.score, 0) / total) : 0;

    // Auto-discovered count (all non-agency sources)
    const autoDiscovered = influencers.filter((i) =>
      i.source.startsWith("scraper_") || i.source === "inbound_apply"
    ).length;

    // Top vertical
    const verticalCounts: Record<string, number> = {};
    for (const inf of influencers) {
      for (const niche of inf.niche) {
        const v = niche.toLowerCase();
        verticalCounts[v] = (verticalCounts[v] || 0) + 1;
      }
    }
    const topVertical = Object.entries(verticalCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([v]) => v)[0] || "fashion";

    return {
      total,
      discovered,
      outreachSent,
      responded,
      contracted,
      active,
      responseRate: outreachSent > 0 ? Math.round((responded / outreachSent) * 100) : 0,
      conversionRate: outreachSent > 0 ? Math.round((contracted / outreachSent) * 100) : 0,
      scrapersRunning: scraperJobs.filter((j) => j.status === "running").length,
      totalDiscoveredToday: liveDiscoveries.length + influencers.filter((i) => {
        const disc = new Date(i.discoveredAt);
        const today = new Date();
        return disc.toDateString() === today.toDateString();
      }).length,
      avgEngagement,
      avgScore,
      topVertical,
      autoDiscovered,
    };
  },
}));

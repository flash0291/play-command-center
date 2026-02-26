// ============================================================
// CRM Store — Influencer Pipeline + Scraper + Outreach
// ============================================================

import { create } from "zustand";
import { InfluencerRecord, InfluencerStage, ScraperJob, Organization, TeamMember, ScraperDiscovery } from "@/types/crm";
import { INFLUENCERS, ORGANIZATIONS, TEAM_MEMBERS, SCRAPER_JOBS } from "@/lib/seed-crm";
import { OUTREACH_TEMPLATES } from "@/agents/outreach/pipeline";
import type { OutreachTemplate } from "@/types/crm";
import { runScraperJob } from "@/agents/scraper/engine";

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

  // Actions
  setStageFilter: (stage: InfluencerStage | "all") => void;
  setSourceFilter: (source: string) => void;
  setSearchQuery: (query: string) => void;
  updateInfluencerStage: (id: string, stage: InfluencerStage) => void;
  addInfluencer: (inf: InfluencerRecord) => void;
  runScraper: (jobId: string) => void;
  addDiscovery: (discovery: ScraperDiscovery) => void;

  // Computed
  getFilteredInfluencers: () => InfluencerRecord[];
  getStageCount: (stage: InfluencerStage) => number;
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

  setStageFilter: (stage) => set({ stageFilter: stage }),
  setSourceFilter: (source) => set({ sourceFilter: source }),
  setSearchQuery: (query) => set({ searchQuery: query }),

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
    const { influencers, stageFilter, sourceFilter, searchQuery } = get();
    return influencers.filter((i) => {
      if (stageFilter !== "all" && i.stage !== stageFilter) return false;
      if (sourceFilter !== "all" && i.source !== sourceFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          i.name.toLowerCase().includes(q) ||
          i.handle.toLowerCase().includes(q) ||
          i.niche.some((n) => n.toLowerCase().includes(q))
        );
      }
      return true;
    });
  },

  getStageCount: (stage) => get().influencers.filter((i) => i.stage === stage).length,

  getPipelineStats: () => {
    const { influencers, scraperJobs, liveDiscoveries } = get();
    const total = influencers.length;
    const discovered = influencers.filter((i) => ["discovered", "researching", "qualified"].includes(i.stage)).length;
    const outreachSent = influencers.filter((i) => ["outreach_sent", "responded", "negotiating", "contracted", "onboarded", "active", "content_live", "completed"].includes(i.stage)).length;
    const responded = influencers.filter((i) => ["responded", "negotiating", "contracted", "onboarded", "active", "content_live", "completed"].includes(i.stage)).length;
    const contracted = influencers.filter((i) => ["contracted", "onboarded", "active", "content_live", "completed"].includes(i.stage)).length;
    const active = influencers.filter((i) => ["active", "content_live"].includes(i.stage)).length;

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
      totalDiscoveredToday: liveDiscoveries.length + influencers.filter((i) => i.source.startsWith("scraper_")).length,
    };
  },
}));

// ============================================================
// Campaign Initializer — Wires Onboarding Data → Live Stores
//
// Called once when user clicks "Launch Campaign".
// Maps all onboarding wizard inputs into the campaign store
// (deliverables, budget, timeline) and CRM store (scraper config).
// Also exposes syncSettingsToStores() for post-launch edits.
// ============================================================

import { useCampaignStore } from "@/store/campaign-store";
import { useCRMStore } from "@/store/crm-store";
import { DELIVERABLES, TIMELINE_EVENTS, BUDGET } from "@/lib/seed-data";
import { AGENT_DEFINITIONS } from "@/lib/agents";
import type { OnboardingState } from "@/store/onboarding-store";
import type { AgentId, BudgetOverview } from "@/types";
import type { ScraperJob } from "@/types/crm";

// Hardcoded anchor date — all seed deliverables/events are relative to this
const SEED_START_DATE = new Date("2026-02-25");

// ---- Helpers ----

/** Return the number of calendar days between two dates */
function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

/** Shift an ISO date string by `offsetDays` calendar days */
function shiftDate(isoDate: string, offsetDays: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0]; // keep YYYY-MM-DD
}

/** Build a merged keyword list from selected verticals + user-provided niche keywords */
function buildNicheKeywords(ob: OnboardingState): string[] {
  const kwSet = new Set<string>();

  // From selected verticals' target keywords
  for (const v of ob.verticals) {
    for (const kw of v.targetKeywords) {
      kwSet.add(kw.toLowerCase());
    }
  }

  // From influencer strategy niche keywords
  for (const kw of ob.influencer.nicheKeywords) {
    kwSet.add(kw.toLowerCase());
  }

  // Add vertical names themselves as keywords
  for (const v of ob.verticals) {
    kwSet.add(v.vertical);
  }

  // Add brand name as keyword
  if (ob.brand.brandName) {
    kwSet.add(ob.brand.brandName.toLowerCase());
  }

  return Array.from(kwSet);
}

// ---- Main Initializers ----

/**
 * Maps onboarding data → campaign store state.
 * Rebases all deliverable/timeline dates relative to the user's chosen start date.
 * Overlays campaign metadata (name, client, budget) from onboarding inputs.
 */
export function initializeCampaignFromOnboarding(ob: OnboardingState): void {
  const campaignStore = useCampaignStore.getState();

  // Calculate date offset
  const userStart = ob.campaign.startDate
    ? new Date(ob.campaign.startDate)
    : SEED_START_DATE;
  const offsetDays = daysBetween(SEED_START_DATE, userStart);

  // Rebase all 17 deliverables
  const rebasedDeliverables = DELIVERABLES.map((d) => ({
    ...d,
    startDate: shiftDate(d.startDate, offsetDays),
    dueDate: shiftDate(d.dueDate, offsetDays),
    // Reset completed items if dates moved forward significantly
    ...(offsetDays > 7 && d.status === "completed"
      ? { status: "not_started" as const, completedAt: undefined }
      : {}),
  }));

  // Rebase timeline events
  const rebasedTimeline = TIMELINE_EVENTS.map((e) => ({
    ...e,
    date: shiftDate(e.date, offsetDays),
    // Reset completed events too if rebased
    ...(offsetDays > 7 && e.status === "completed"
      ? { status: "not_started" as const }
      : {}),
  }));

  // Build budget overview from onboarding allocations
  const byAgent: BudgetOverview["byAgent"] = {} as BudgetOverview["byAgent"];
  const agentIds: AgentId[] = [
    "orchestrator", "retail", "influencer", "content",
    "events", "budget", "performance",
  ];

  for (const id of agentIds) {
    const allocation = ob.budget.agentAllocations.find(
      (a) => a.agentId === id
    );
    byAgent[id] = {
      allocated: allocation?.allocated ?? BUDGET.byAgent[id]?.allocated ?? 0,
      spent: 0, // fresh launch — nothing spent yet
    };
  }

  const totalBudget = ob.budget.totalBudget > 0
    ? ob.budget.totalBudget
    : BUDGET.total;

  const budget: BudgetOverview = {
    total: totalBudget,
    spent: 0,
    committed: 0,
    remaining: totalBudget,
    byAgent,
  };

  // Compute end date from sprint duration
  const endDate = ob.campaign.endDate
    ? ob.campaign.endDate
    : (() => {
        const end = new Date(userStart);
        end.setDate(end.getDate() + (ob.campaign.sprintDuration || 60));
        return end.toISOString().split("T")[0];
      })();

  // Total weeks from sprint duration
  const totalWeeks = Math.ceil((ob.campaign.sprintDuration || 60) / 7);

  // Build campaign name
  const campaignName = ob.campaign.campaignName || campaignStore.campaign.name;
  const clientName = ob.brand.clientName || campaignStore.campaign.client;

  // Apply everything to campaign store
  useCampaignStore.setState({
    campaign: {
      ...campaignStore.campaign,
      id: `campaign-${Date.now()}`,
      name: campaignName,
      client: clientName,
      budget,
      startDate: userStart.toISOString().split("T")[0],
      endDate,
      currentPhase: "pre_launch",
      currentWeek: 1,
      totalWeeks,
      healthScore: 100, // fresh start
      agents: AGENT_DEFINITIONS,
      deliverables: rebasedDeliverables,
    },
    deliverables: rebasedDeliverables,
    timeline: rebasedTimeline,
  });
}

/**
 * Maps onboarding influencer strategy → CRM scraper job configs.
 * Updates all existing scraper jobs with the user's min followers,
 * min engagement, niche keywords, outreach settings, and scan interval.
 * Keeps the 120+ influencer profiles untouched (great demo data).
 */
export function initializeCRMFromOnboarding(ob: OnboardingState): void {
  const crmStore = useCRMStore.getState();
  const nicheKeywords = buildNicheKeywords(ob);

  const updatedJobs: ScraperJob[] = crmStore.scraperJobs.map((job) => ({
    ...job,
    config: {
      ...job.config,
      minFollowers: ob.influencer.minFollowers || job.config.minFollowers,
      minEngagement: ob.influencer.minEngagement || job.config.minEngagement,
      maxFollowers: ob.influencer.maxFollowers || job.config.maxFollowers,
      nicheKeywords: nicheKeywords.length > 0
        ? [...new Set([...job.config.nicheKeywords, ...nicheKeywords])]
        : job.config.nicheKeywords,
      excludeHandles: ob.influencer.excludeHandles.length > 0
        ? [...new Set([...job.config.excludeHandles, ...ob.influencer.excludeHandles])]
        : job.config.excludeHandles,
      autoOutreach: ob.influencer.autoOutreach,
    },
    // Update recurring interval if user specified one
    intervalMinutes: ob.influencer.scraperScanInterval || job.intervalMinutes,
  }));

  useCRMStore.setState({
    scraperJobs: updatedJobs,
  });
}

/**
 * Post-launch sync: re-applies current onboarding store values
 * to campaign + CRM stores. Called from Settings page when user edits config.
 */
export function syncSettingsToStores(ob: OnboardingState): void {
  // Re-sync budget
  const campaignStore = useCampaignStore.getState();
  const agentIds: AgentId[] = [
    "orchestrator", "retail", "influencer", "content",
    "events", "budget", "performance",
  ];

  const byAgent: BudgetOverview["byAgent"] = {} as BudgetOverview["byAgent"];
  for (const id of agentIds) {
    const allocation = ob.budget.agentAllocations.find(
      (a) => a.agentId === id
    );
    const currentSpent = campaignStore.campaign.budget.byAgent[id]?.spent ?? 0;
    byAgent[id] = {
      allocated: allocation?.allocated ?? 0,
      spent: currentSpent, // preserve actual spend
    };
  }

  const totalBudget = ob.budget.totalBudget > 0
    ? ob.budget.totalBudget
    : campaignStore.campaign.budget.total;

  const totalSpent = campaignStore.campaign.budget.spent;
  const totalCommitted = campaignStore.campaign.budget.committed;

  useCampaignStore.setState({
    campaign: {
      ...campaignStore.campaign,
      name: ob.campaign.campaignName || campaignStore.campaign.name,
      client: ob.brand.clientName || campaignStore.campaign.client,
      budget: {
        total: totalBudget,
        spent: totalSpent,
        committed: totalCommitted,
        remaining: totalBudget - totalSpent - totalCommitted,
        byAgent,
      },
    },
  });

  // Re-sync scraper config
  initializeCRMFromOnboarding(ob);
}

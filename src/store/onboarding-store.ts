// ============================================================
// Onboarding Store — Multi-Step Campaign Setup Wizard
// Collects all inputs needed to configure the OS from scratch
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayVertical } from "@/lib/play-verticals";

// ---- Step definitions ----
export type OnboardingStep =
  | "brand"
  | "campaign"
  | "verticals"
  | "platforms"
  | "influencer"
  | "budget"
  | "team"
  | "review";

export const ONBOARDING_STEPS: { id: OnboardingStep; label: string; number: number }[] = [
  { id: "brand", label: "Brand Identity", number: 1 },
  { id: "campaign", label: "Campaign Config", number: 2 },
  { id: "verticals", label: "Target Verticals", number: 3 },
  { id: "platforms", label: "Social & APIs", number: 4 },
  { id: "influencer", label: "Influencer Strategy", number: 5 },
  { id: "budget", label: "Budget Allocation", number: 6 },
  { id: "team", label: "Team & Roles", number: 7 },
  { id: "review", label: "Review & Launch", number: 8 },
];

// ---- Data Models ----

export interface BrandIdentity {
  brandName: string;
  clientName: string;
  tagline: string;
  description: string;
  aesthetic: string; // e.g. "Streetwear meets luxury"
  targetAudience: string;
  brandValues: string[];
  primaryColor: string;
  secondaryColor: string;
  websiteUrl: string;
  logoUrl: string;
}

export interface CampaignConfig {
  campaignName: string;
  objective: string;
  startDate: string;
  endDate: string;
  sprintDuration: number; // days
  phases: { name: string; startWeek: number; endWeek: number }[];
  primaryGoals: string[];
  kpiTargets: { metric: string; target: string }[];
  timezone: string;
}

export interface VerticalSelection {
  vertical: PlayVertical;
  priority: "primary" | "secondary" | "explore";
  targetKeywords: string[];
  notes: string;
}

export interface PlatformConfig {
  platform: "instagram" | "tiktok" | "youtube" | "twitter";
  enabled: boolean;
  handle: string;
  apiConnected: boolean;
  priority: number; // 1 = highest
  contentTypes: string[];
}

export interface InfluencerStrategy {
  tierAllocation: { tier: string; targetCount: number; maxFee: number }[];
  minFollowers: number;
  minEngagement: number;
  maxFollowers: number;
  autoOutreach: boolean;
  autoOutreachMaxPerDay: number;
  scraperEnabled: boolean;
  scraperScanInterval: number; // minutes
  nicheKeywords: string[];
  excludeHandles: string[];
  outreachTone: "professional" | "casual" | "luxury" | "creative";
  contentRequirements: string[];
}

export interface BudgetAllocation {
  totalBudget: number;
  currency: string;
  agentAllocations: {
    agentId: string;
    agentName: string;
    allocated: number;
    notes: string;
  }[];
  paymentTerms: string;
  alertThreshold: number; // percentage
  clientBillingFrequency: "weekly" | "biweekly" | "monthly";
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agency" | "creative_director" | "account_manager" | "viewer";
  assignedAgents: string[];
  receivesBriefs: boolean;
  receivesAlerts: boolean;
}

// ---- Store ----

export interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  isLaunched: boolean;

  // Step data
  brand: BrandIdentity;
  campaign: CampaignConfig;
  verticals: VerticalSelection[];
  platforms: PlatformConfig[];
  influencer: InfluencerStrategy;
  budget: BudgetAllocation;
  team: TeamMember[];

  // Actions
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepComplete: (step: OnboardingStep) => void;
  updateBrand: (data: Partial<BrandIdentity>) => void;
  updateCampaign: (data: Partial<CampaignConfig>) => void;
  setVerticals: (verticals: VerticalSelection[]) => void;
  toggleVertical: (vertical: PlayVertical) => void;
  updateVerticalPriority: (vertical: PlayVertical, priority: VerticalSelection["priority"]) => void;
  setPlatforms: (platforms: PlatformConfig[]) => void;
  updatePlatform: (platform: string, data: Partial<PlatformConfig>) => void;
  updateInfluencer: (data: Partial<InfluencerStrategy>) => void;
  updateBudget: (data: Partial<BudgetAllocation>) => void;
  updateAgentAllocation: (agentId: string, allocated: number) => void;
  addTeamMember: (member: TeamMember) => void;
  removeTeamMember: (id: string) => void;
  updateTeamMember: (id: string, data: Partial<TeamMember>) => void;
  launchCampaign: () => void;

  // Computed
  getStepProgress: () => number;
  isStepValid: (step: OnboardingStep) => boolean;
  getCompletionPercentage: () => number;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
  currentStep: "brand",
  completedSteps: [],
  isLaunched: false,

  // Default data
  brand: {
    brandName: "",
    clientName: "",
    tagline: "",
    description: "",
    aesthetic: "",
    targetAudience: "",
    brandValues: [],
    primaryColor: "#6C63FF",
    secondaryColor: "#EC4899",
    websiteUrl: "",
    logoUrl: "",
  },

  campaign: {
    campaignName: "",
    objective: "",
    startDate: "",
    endDate: "",
    sprintDuration: 60,
    phases: [
      { name: "Pre-Launch", startWeek: 1, endWeek: 2 },
      { name: "Launch Week", startWeek: 3, endWeek: 4 },
      { name: "Sustain", startWeek: 5, endWeek: 6 },
      { name: "Optimize", startWeek: 7, endWeek: 8 },
    ],
    primaryGoals: [],
    kpiTargets: [],
    timezone: "America/New_York",
  },

  verticals: [],

  platforms: [
    { platform: "instagram", enabled: true, handle: "", apiConnected: false, priority: 1, contentTypes: ["posts", "stories", "reels"] },
    { platform: "tiktok", enabled: true, handle: "", apiConnected: false, priority: 2, contentTypes: ["videos", "lives"] },
    { platform: "youtube", enabled: false, handle: "", apiConnected: false, priority: 3, contentTypes: ["shorts", "videos"] },
    { platform: "twitter", enabled: false, handle: "", apiConnected: false, priority: 4, contentTypes: ["tweets", "threads"] },
  ],

  influencer: {
    tierAllocation: [
      { tier: "mega", targetCount: 3, maxFee: 50000 },
      { tier: "macro", targetCount: 8, maxFee: 15000 },
      { tier: "mid", targetCount: 15, maxFee: 5000 },
      { tier: "micro", targetCount: 50, maxFee: 1500 },
      { tier: "nano", targetCount: 100, maxFee: 500 },
    ],
    minFollowers: 5000,
    minEngagement: 2.0,
    maxFollowers: 10000000,
    autoOutreach: true,
    autoOutreachMaxPerDay: 25,
    scraperEnabled: true,
    scraperScanInterval: 30,
    nicheKeywords: [],
    excludeHandles: [],
    outreachTone: "creative",
    contentRequirements: [],
  },

  budget: {
    totalBudget: 0,
    currency: "USD",
    agentAllocations: [
      { agentId: "orchestrator", agentName: "Campaign Orchestrator", allocated: 0, notes: "" },
      { agentId: "retail", agentName: "Retail Partner Agent", allocated: 0, notes: "" },
      { agentId: "influencer", agentName: "Influencer & Talent", allocated: 0, notes: "" },
      { agentId: "content", agentName: "Content Engine", allocated: 0, notes: "" },
      { agentId: "events", agentName: "Events & Activations", allocated: 0, notes: "" },
      { agentId: "budget", agentName: "Budget & Compliance", allocated: 0, notes: "" },
      { agentId: "performance", agentName: "Performance Analytics", allocated: 0, notes: "" },
    ],
    paymentTerms: "net30",
    alertThreshold: 80,
    clientBillingFrequency: "biweekly",
  },

  team: [],

  // Actions
  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const steps = ONBOARDING_STEPS.map((s) => s.id);
    const currentIdx = steps.indexOf(get().currentStep);
    if (currentIdx < steps.length - 1) {
      const current = get().currentStep;
      set((s) => ({
        currentStep: steps[currentIdx + 1],
        completedSteps: s.completedSteps.includes(current)
          ? s.completedSteps
          : [...s.completedSteps, current],
      }));
    }
  },

  prevStep: () => {
    const steps = ONBOARDING_STEPS.map((s) => s.id);
    const currentIdx = steps.indexOf(get().currentStep);
    if (currentIdx > 0) {
      set({ currentStep: steps[currentIdx - 1] });
    }
  },

  markStepComplete: (step) =>
    set((s) => ({
      completedSteps: s.completedSteps.includes(step)
        ? s.completedSteps
        : [...s.completedSteps, step],
    })),

  updateBrand: (data) =>
    set((s) => ({ brand: { ...s.brand, ...data } })),

  updateCampaign: (data) =>
    set((s) => ({ campaign: { ...s.campaign, ...data } })),

  setVerticals: (verticals) => set({ verticals }),

  toggleVertical: (vertical) =>
    set((s) => {
      const exists = s.verticals.find((v) => v.vertical === vertical);
      if (exists) {
        return { verticals: s.verticals.filter((v) => v.vertical !== vertical) };
      }
      return {
        verticals: [
          ...s.verticals,
          { vertical, priority: "secondary", targetKeywords: [], notes: "" },
        ],
      };
    }),

  updateVerticalPriority: (vertical, priority) =>
    set((s) => ({
      verticals: s.verticals.map((v) =>
        v.vertical === vertical ? { ...v, priority } : v
      ),
    })),

  setPlatforms: (platforms) => set({ platforms }),

  updatePlatform: (platform, data) =>
    set((s) => ({
      platforms: s.platforms.map((p) =>
        p.platform === platform ? { ...p, ...data } : p
      ),
    })),

  updateInfluencer: (data) =>
    set((s) => ({ influencer: { ...s.influencer, ...data } })),

  updateBudget: (data) =>
    set((s) => ({ budget: { ...s.budget, ...data } })),

  updateAgentAllocation: (agentId, allocated) =>
    set((s) => ({
      budget: {
        ...s.budget,
        agentAllocations: s.budget.agentAllocations.map((a) =>
          a.agentId === agentId ? { ...a, allocated } : a
        ),
      },
    })),

  addTeamMember: (member) =>
    set((s) => ({ team: [...s.team, member] })),

  removeTeamMember: (id) =>
    set((s) => ({ team: s.team.filter((t) => t.id !== id) })),

  updateTeamMember: (id, data) =>
    set((s) => ({
      team: s.team.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),

  launchCampaign: () => {
    set({ isLaunched: true });
    // Defer initialization to avoid circular import issues at module load time
    import("@/lib/campaign-initializer").then(({ initializeCampaignFromOnboarding, initializeCRMFromOnboarding }) => {
      const state = get();
      initializeCampaignFromOnboarding(state);
      initializeCRMFromOnboarding(state);
    });
  },

  // Computed
  getStepProgress: () => {
    const steps = ONBOARDING_STEPS.map((s) => s.id);
    return steps.indexOf(get().currentStep) + 1;
  },

  isStepValid: (step) => {
    const s = get();
    switch (step) {
      case "brand":
        return s.brand.brandName.length > 0 && s.brand.clientName.length > 0;
      case "campaign":
        return s.campaign.campaignName.length > 0 && s.campaign.startDate.length > 0;
      case "verticals":
        return s.verticals.length > 0;
      case "platforms":
        return s.platforms.some((p) => p.enabled && p.handle.length > 0);
      case "influencer":
        return s.influencer.nicheKeywords.length > 0 || s.verticals.length > 0;
      case "budget":
        return s.budget.totalBudget > 0;
      case "team":
        return true; // Team is optional
      case "review":
        return true;
      default:
        return false;
    }
  },

  getCompletionPercentage: () => {
    const s = get();
    return Math.round((s.completedSteps.length / ONBOARDING_STEPS.length) * 100);
  },
    }),
    {
      name: "play-onboarding",
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        isLaunched: state.isLaunched,
        brand: state.brand,
        campaign: state.campaign,
        verticals: state.verticals,
        platforms: state.platforms,
        influencer: state.influencer,
        budget: state.budget,
        team: state.team,
      }),
    }
  )
);

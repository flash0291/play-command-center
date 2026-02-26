// ============================================================
// Zustand Store — Campaign State Management
// ============================================================

import { create } from "zustand";
import { Agent, AgentId, AgentMessage, Campaign, Deliverable, DeliverableStatus } from "@/types";
import { CAMPAIGN, DELIVERABLES, TIMELINE_EVENTS } from "@/lib/seed-data";
import { AGENT_DEFINITIONS } from "@/lib/agents";
import type { TimelineEvent } from "@/types";

interface CampaignState {
  campaign: Campaign;
  deliverables: Deliverable[];
  timeline: TimelineEvent[];
  agents: Agent[];
  messages: AgentMessage[];
  selectedAgent: AgentId | null;
  sidebarOpen: boolean;

  // Actions
  setSelectedAgent: (id: AgentId | null) => void;
  toggleSidebar: () => void;
  updateDeliverableStatus: (id: string, status: DeliverableStatus) => void;
  addMessage: (message: AgentMessage) => void;
  markMessageRead: (id: string) => void;
  getAgentDeliverables: (agentId: AgentId) => Deliverable[];
  getAgentMessages: (agentId: AgentId) => AgentMessage[];
  getDeliverablesByPhase: (phase: string) => Deliverable[];
  getOverdueDeliverables: () => Deliverable[];
  getStats: () => {
    totalDeliverables: number;
    completed: number;
    inProgress: number;
    overdue: number;
    blocked: number;
    completionRate: number;
  };
}

const INITIAL_MESSAGES: AgentMessage[] = [
  {
    id: "msg-001",
    agentId: "orchestrator",
    type: "status",
    title: "Sprint Day 1 — All Systems Go",
    content: "Campaign initialized. All 7 agents calibrated with brand guidelines. 17 deliverables loaded into sprint tracker. First milestone: Brand Asset Library due in 3 days.",
    timestamp: new Date().toISOString(),
    read: false,
    actionRequired: false,
  },
  {
    id: "msg-002",
    agentId: "retail",
    type: "insight",
    title: "Nordstrom Buyer Interest Confirmed",
    content: "Nordstrom women's contemporary buyer responded to our deck. Meeting scheduled for March 3. They're interested in 8-10 SKUs for 12 doors initially. Recommend preparing exclusive colorway.",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
    actionRequired: true,
    actions: [
      { id: "a-001", label: "Approve Exclusive Colorway", type: "approve" },
      { id: "a-002", label: "Counter with Standard Line", type: "modify" },
    ],
  },
  {
    id: "msg-003",
    agentId: "influencer",
    type: "recommendation",
    title: "High-Priority Creator Opportunity",
    content: "Emma Chamberlain's team responded to our outreach — interested in a PLAY collaboration. Fee: $45K for 3 Instagram posts + 2 TikToks. Her audience overlap with our target demo is 72%.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    actionRequired: true,
    actions: [
      { id: "a-003", label: "Approve Deal", type: "approve" },
      { id: "a-004", label: "Negotiate Lower", type: "modify" },
      { id: "a-005", label: "Pass", type: "reject" },
    ],
  },
  {
    id: "msg-004",
    agentId: "content",
    type: "action",
    title: "5 Social Posts Awaiting Approval",
    content: "Week 1 Instagram grid posts are ready for review. 3 product shots, 1 lifestyle, 1 brand story carousel. All follow Palm Angels brand guidelines. Need approval by EOD to meet posting schedule.",
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    read: false,
    actionRequired: true,
    actions: [
      { id: "a-006", label: "Approve All", type: "approve" },
      { id: "a-007", label: "Review Individually", type: "modify" },
    ],
  },
  {
    id: "msg-005",
    agentId: "budget",
    type: "alert",
    title: "Influencer Budget Pacing Ahead",
    content: "Influencer spend is at $68K (34% of allocated $200K) in Week 1. If the Emma Chamberlain deal goes through, we'll be at $113K (56.5%) by Week 2. Recommend reallocating $25K from events buffer.",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    actionRequired: true,
    actions: [
      { id: "a-008", label: "Approve Reallocation", type: "approve" },
      { id: "a-009", label: "Hold Current Budget", type: "reject" },
      { id: "a-010", label: "Escalate to Client", type: "escalate" },
    ],
  },
  {
    id: "msg-006",
    agentId: "performance",
    type: "insight",
    title: "Competitor Alert: Off-White Launch",
    content: "Off-White is launching a similar streetwear-meets-luxury line on March 10, 4 days before our NYC event. Recommend accelerating our teaser content to establish share of voice before their launch.",
    timestamp: new Date(Date.now() - 9000000).toISOString(),
    read: false,
    actionRequired: true,
    actions: [
      { id: "a-011", label: "Accelerate Teasers", type: "approve" },
      { id: "a-012", label: "Hold Current Schedule", type: "reject" },
    ],
  },
];

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaign: CAMPAIGN,
  deliverables: DELIVERABLES,
  timeline: TIMELINE_EVENTS,
  agents: AGENT_DEFINITIONS,
  messages: INITIAL_MESSAGES,
  selectedAgent: null,
  sidebarOpen: true,

  setSelectedAgent: (id) => set({ selectedAgent: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  updateDeliverableStatus: (id, status) =>
    set((s) => ({
      deliverables: s.deliverables.map((d) =>
        d.id === id ? { ...d, status, ...(status === "completed" ? { completedAt: new Date().toISOString() } : {}) } : d
      ),
    })),

  addMessage: (message) => set((s) => ({ messages: [message, ...s.messages] })),

  markMessageRead: (id) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
    })),

  getAgentDeliverables: (agentId) => get().deliverables.filter((d) => d.agentId === agentId),
  getAgentMessages: (agentId) => get().messages.filter((m) => m.agentId === agentId),
  getDeliverablesByPhase: (phase) => get().deliverables.filter((d) => d.phase === phase),

  getOverdueDeliverables: () => {
    const now = new Date();
    return get().deliverables.filter(
      (d) => d.status !== "completed" && new Date(d.dueDate) < now
    );
  },

  getStats: () => {
    const deliverables = get().deliverables;
    const now = new Date();
    const completed = deliverables.filter((d) => d.status === "completed").length;
    const inProgress = deliverables.filter((d) => d.status === "in_progress").length;
    const overdue = deliverables.filter((d) => d.status !== "completed" && new Date(d.dueDate) < now).length;
    const blocked = deliverables.filter((d) => d.status === "blocked").length;
    return {
      totalDeliverables: deliverables.length,
      completed,
      inProgress,
      overdue,
      blocked,
      completionRate: Math.round((completed / deliverables.length) * 100),
    };
  },
}));

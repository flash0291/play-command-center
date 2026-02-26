// ============================================================
// Zustand Store — Campaign State Management
// Full interactivity: approve/reject, subtask toggle, agent chat,
// brief generation, action execution
// ============================================================

import { create } from "zustand";
import { Agent, AgentId, AgentMessage, Campaign, Deliverable, DeliverableStatus } from "@/types";
import { CAMPAIGN, DELIVERABLES, TIMELINE_EVENTS } from "@/lib/seed-data";
import { AGENT_DEFINITIONS } from "@/lib/agents";
import type { TimelineEvent } from "@/types";

// Chat message type for agent conversations
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  agentId?: AgentId;
}

// Brief type
export interface DailyBrief {
  id: string;
  type: "morning" | "eod";
  date: string;
  content: string;
  agentSummaries: { agentId: AgentId; summary: string; status: string }[];
  keyMetrics: { label: string; value: string; change: string }[];
  actionItems: { text: string; priority: "high" | "medium" | "low"; completed: boolean }[];
  generatedAt: string;
}

interface CampaignState {
  campaign: Campaign;
  deliverables: Deliverable[];
  timeline: TimelineEvent[];
  agents: Agent[];
  messages: AgentMessage[];
  selectedAgent: AgentId | null;
  sidebarOpen: boolean;

  // Chat state
  chatHistory: Record<string, ChatMessage[]>;
  chatLoading: boolean;

  // Brief state
  briefs: DailyBrief[];
  currentBrief: DailyBrief | null;
  briefLoading: boolean;

  // Actions
  setSelectedAgent: (id: AgentId | null) => void;
  toggleSidebar: () => void;
  updateDeliverableStatus: (id: string, status: DeliverableStatus) => void;
  toggleSubtask: (deliverableId: string, subtaskId: string) => void;
  addMessage: (message: AgentMessage) => void;
  markMessageRead: (id: string) => void;
  executeAction: (messageId: string, actionId: string) => void;
  sendChatMessage: (agentId: AgentId, content: string) => Promise<void>;
  generateBrief: (type: "morning" | "eod") => Promise<void>;

  // Computed
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
    healthScore: number;
    actionsNeeded: number;
  };
  getChatHistory: (agentId: AgentId) => ChatMessage[];
}

const INITIAL_MESSAGES: AgentMessage[] = [
  {
    id: "msg-001",
    agentId: "orchestrator",
    type: "status",
    title: "Sprint Day 2 — All Systems Active",
    content: "Campaign running strong. All 7 agents calibrated with Palm Angels brand guidelines. 17 deliverables loaded. Scraper discovered 42 new creators overnight. 7 auto-DMs sent. First milestone: Brand Asset Library due in 2 days.",
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
    content: "Emma Chamberlain's team responded to our outreach — interested in a PLAY collaboration. Fee: $45K for 3 Instagram posts + 2 TikToks. Her audience overlap with our target demo is 72%. ROI projection: 8.2x based on historical performance.",
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
    title: "Influencer Budget Pacing Update",
    content: "Influencer spend is at $68K (34% of $200K allocated) in Week 1. If the Emma Chamberlain deal closes, we'll be at $113K (56.5%) by Week 2. Performance Agent confirms her projected ROI is 8.2x — well above the 3x threshold. Recommend approval.",
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
  {
    id: "msg-007",
    agentId: "events",
    type: "action",
    title: "Miami Pop-Up Venue Confirmed",
    content: "Wynwood Walls space secured for March 15-17. Deposit of $12,000 processed. Capacity: 300 guests. Need final guest list by March 8. Content Engine has drafted 4 teaser posts for the event.",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    read: false,
    actionRequired: false,
  },
  {
    id: "msg-008",
    agentId: "influencer",
    type: "status",
    title: "Autonomous Pipeline Update",
    content: "Scraper found 12 new fashion creators from @emmachamberlain's latest post comments. 7 auto-qualified (score 75+). Auto-DMs sent to all 7. 3 already responded within 2 hours — fastest response batch yet.",
    timestamp: new Date(Date.now() - 12600000).toISOString(),
    read: false,
    actionRequired: false,
  },
  {
    id: "msg-009",
    agentId: "orchestrator",
    type: "insight",
    title: "Cross-Agent Intelligence: Gaming Vertical Opportunity",
    content: "Scraper detected 5x growth in Palm Angels mentions from gaming creators. Performance Agent confirms gaming audience has 2.1x higher purchase intent. Recommend launching dedicated gaming vertical scraper targeting Twitch and YouTube Gaming.",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    read: false,
    actionRequired: true,
    actions: [
      { id: "a-013", label: "Launch Gaming Scraper", type: "approve" },
      { id: "a-014", label: "Add to Backlog", type: "defer" },
    ],
  },
  {
    id: "msg-010",
    agentId: "content",
    type: "recommendation",
    title: "Content Performance: Experiential > Studio",
    content: "Analysis of first 48 hours: UGC and experiential content is driving 340% more engagement than studio product shots. Recommend shifting 60% of remaining content budget to experiential shoots at the Miami pop-up.",
    timestamp: new Date(Date.now() - 16200000).toISOString(),
    read: false,
    actionRequired: true,
    actions: [
      { id: "a-015", label: "Shift to Experiential", type: "approve" },
      { id: "a-016", label: "Keep Current Mix", type: "reject" },
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
  chatHistory: {},
  chatLoading: false,
  briefs: [],
  currentBrief: null,
  briefLoading: false,

  setSelectedAgent: (id) => set({ selectedAgent: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  updateDeliverableStatus: (id, status) =>
    set((s) => ({
      deliverables: s.deliverables.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              ...(status === "completed" ? { completedAt: new Date().toISOString() } : {}),
            }
          : d
      ),
    })),

  toggleSubtask: (deliverableId, subtaskId) =>
    set((s) => ({
      deliverables: s.deliverables.map((d) =>
        d.id === deliverableId
          ? {
              ...d,
              subtasks: d.subtasks.map((sub) =>
                sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
              ),
            }
          : d
      ),
    })),

  addMessage: (message) => set((s) => ({ messages: [message, ...s.messages] })),

  markMessageRead: (id) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
    })),

  executeAction: (messageId, actionId) =>
    set((s) => {
      const msg = s.messages.find((m) => m.id === messageId);
      if (!msg) return s;
      const action = msg.actions?.find((a) => a.id === actionId);
      if (!action) return s;

      // Mark message as read and action as executed
      const updatedMessages = s.messages.map((m) => {
        if (m.id === messageId) {
          return { ...m, read: true, actionRequired: false };
        }
        return m;
      });

      // Generate response message based on action type
      const responseContent = action.type === "approve"
        ? `Approved: "${action.label}" — Executing now. All downstream agents have been notified.`
        : action.type === "reject"
        ? `Declined: "${action.label}" — Agents have been updated. No further action will be taken.`
        : action.type === "modify"
        ? `Modification requested: "${action.label}" — The responsible agent is preparing alternatives.`
        : action.type === "escalate"
        ? `Escalated: "${action.label}" — This has been flagged for client review. Report will be generated.`
        : `Deferred: "${action.label}" — Added to backlog for future consideration.`;

      const responseMsg: AgentMessage = {
        id: `msg-response-${Date.now()}`,
        agentId: msg.agentId,
        type: "status",
        title: `Action Executed: ${action.label}`,
        content: responseContent,
        timestamp: new Date().toISOString(),
        read: false,
        actionRequired: false,
      };

      return { messages: [responseMsg, ...updatedMessages] };
    }),

  sendChatMessage: async (agentId, content) => {
    const chatId = agentId;
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}-user`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      agentId,
    };

    // Add user message
    set((s) => ({
      chatHistory: {
        ...s.chatHistory,
        [chatId]: [...(s.chatHistory[chatId] || []), userMsg],
      },
      chatLoading: true,
    }));

    try {
      // Call the Anthropic API through our orchestrate endpoint
      const res = await fetch("/api/agents/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          userPrompt: content,
          systemPrompt: `You are the ${agentId} agent for the PLAY by Palm Angels campaign command center. You manage a specific domain of the campaign and provide intelligent, actionable responses. Be concise, specific, and data-driven. Reference real campaign metrics and deliverables when possible. Current date: February 26, 2026. Campaign: 60-day sprint, Pre-Launch phase, $1M budget.`,
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `chat-${Date.now()}-assistant`,
        role: "assistant",
        content: data.response || data.content || "I've processed your request. Let me analyze the current campaign data and get back to you with specific recommendations.",
        timestamp: new Date().toISOString(),
        agentId,
      };

      set((s) => ({
        chatHistory: {
          ...s.chatHistory,
          [chatId]: [...(s.chatHistory[chatId] || []), assistantMsg],
        },
        chatLoading: false,
      }));
    } catch {
      // Fallback response if API fails
      const fallbackMsg: ChatMessage = {
        id: `chat-${Date.now()}-assistant`,
        role: "assistant",
        content: generateFallbackResponse(agentId, content),
        timestamp: new Date().toISOString(),
        agentId,
      };

      set((s) => ({
        chatHistory: {
          ...s.chatHistory,
          [chatId]: [...(s.chatHistory[chatId] || []), fallbackMsg],
        },
        chatLoading: false,
      }));
    }
  },

  generateBrief: async (type) => {
    set({ briefLoading: true });

    try {
      const res = await fetch("/api/agents/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "orchestrator",
          userPrompt: type === "morning"
            ? "Generate a comprehensive morning brief for the PLAY campaign. Include status of all agents, key metrics, priorities for today, and any risks or opportunities."
            : "Generate an end-of-day recap for the PLAY campaign. Summarize what was accomplished today, metrics changes, key decisions made, and priorities for tomorrow.",
          systemPrompt: "You are the Campaign Orchestrator for PLAY by Palm Angels. Generate a structured campaign brief. Be specific with numbers and metrics. Current date: February 26, 2026. Sprint Day 2. Pre-Launch phase.",
        }),
      });

      const data = await res.json();
      const brief: DailyBrief = {
        id: `brief-${Date.now()}`,
        type,
        date: new Date().toISOString(),
        content: data.response || data.content || generateFallbackBrief(type),
        agentSummaries: generateAgentSummaries(),
        keyMetrics: generateKeyMetrics(),
        actionItems: generateActionItems(),
        generatedAt: new Date().toISOString(),
      };

      set((s) => ({
        currentBrief: brief,
        briefs: [brief, ...s.briefs],
        briefLoading: false,
      }));
    } catch {
      const brief: DailyBrief = {
        id: `brief-${Date.now()}`,
        type,
        date: new Date().toISOString(),
        content: generateFallbackBrief(type),
        agentSummaries: generateAgentSummaries(),
        keyMetrics: generateKeyMetrics(),
        actionItems: generateActionItems(),
        generatedAt: new Date().toISOString(),
      };

      set((s) => ({
        currentBrief: brief,
        briefs: [brief, ...s.briefs],
        briefLoading: false,
      }));
    }
  },

  // Computed
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
    const { deliverables, messages } = get();
    const now = new Date();
    const completed = deliverables.filter((d) => d.status === "completed").length;
    const inProgress = deliverables.filter((d) => d.status === "in_progress").length;
    const overdue = deliverables.filter((d) => d.status !== "completed" && new Date(d.dueDate) < now).length;
    const blocked = deliverables.filter((d) => d.status === "blocked").length;
    const actionsNeeded = messages.filter((m) => m.actionRequired && !m.read).length;

    // Health score: 100 - penalties
    let health = 100;
    health -= overdue * 5; // -5 per overdue
    health -= blocked * 8; // -8 per blocked
    health -= Math.max(0, actionsNeeded - 3) * 2; // -2 per action beyond 3 pending
    const completionRate = deliverables.length > 0 ? Math.round((completed / deliverables.length) * 100) : 0;
    if (completionRate < 20 && now > new Date("2026-03-10")) health -= 10;

    return {
      totalDeliverables: deliverables.length,
      completed,
      inProgress,
      overdue,
      blocked,
      completionRate,
      healthScore: Math.max(0, Math.min(100, health)),
      actionsNeeded,
    };
  },

  getChatHistory: (agentId) => get().chatHistory[agentId] || [],
}));

// ---- Fallback Generators ----

function generateFallbackResponse(agentId: AgentId, userMessage: string): string {
  const responses: Record<AgentId, string[]> = {
    orchestrator: [
      "All 7 agents are operating within parameters. Current sprint velocity is 15% ahead of projections. Key focus areas for today: finalize Nordstrom exclusive colorway and approve content batch for Week 1.",
      "Cross-agent analysis complete. The Influencer Agent and Performance Agent are aligned on creator priorities. Budget Agent confirms adequate runway for the next 2 weeks of planned spend.",
    ],
    retail: [
      "Nordstrom meeting prep is underway. I've compiled a pitch deck with our top 8 SKUs, wholesale pricing, and sell-through projections. SSENSE has also expressed interest in an exclusive digital editorial.",
      "Retail pipeline: Nordstrom (meeting March 3), SSENSE (deck sent), Kith (warm intro via brand contact). Total projected wholesale: $340K across 3 partners.",
    ],
    influencer: [
      "Current pipeline: 120+ creators discovered, 42 auto-qualified, 28 outreach sent, 12 responded, 3 contracted. Emma Chamberlain is our highest-value deal at $45K. Scraper is running 24/7 across Instagram and TikTok.",
      "The autonomous discovery engine found 8 new creators in the last 4 hours from comments on @wisdm's latest post. 3 scored above 80 — auto-DMs sent. Average response time for auto-outreach: 3.2 hours.",
    ],
    content: [
      "Content calendar is 75% populated through Week 4. 5 posts pending approval for this week. Experiential content from the Miami scouting trip is outperforming studio shots by 340%. Recommend pivoting remaining budget.",
      "I've prepared 3 content variations for the launch teaser: minimalist product focus, lifestyle/street, and editorial. Each follows Palm Angels brand guidelines. Ready for your review.",
    ],
    events: [
      "Miami pop-up (March 15-17) at Wynwood Walls is confirmed. LA launch party venue shortlist: Chateau Marmont, Delilah, The Highlight Room. Budget allocated: $85K across both events.",
      "Guest list for Miami: 180 confirmed, 120 pending. VIP section reserved for contracted influencers. Content Engine has scheduled 4 photographers and 2 videographers for coverage.",
    ],
    budget: [
      "Total budget: $1,000,000. Committed to date: $168,000 (16.8%). Largest line items: Influencer contracts $113K, Events deposits $35K, Content production $20K. Runway is healthy through Week 4.",
      "Burn rate analysis: Current weekly spend is $84K. At this rate, we'll use 80% of budget by Week 6, leaving 20% buffer for optimization in the final 2 weeks. This is within target parameters.",
    ],
    performance: [
      "Early performance signals are strong. Total impressions: 2.4M across all channels. Engagement rate: 4.8% (target: 3.5%). Top performing content: Emma Chamberlain teaser post (1.2M impressions, 7.2% engagement).",
      "Competitor analysis: Off-White's similar launch is tracking at 2.1M impressions but 2.8% engagement. Our engagement rate is 71% higher. Recommend emphasizing community-driven content to maintain advantage.",
    ],
  };

  const agentResponses = responses[agentId] || responses.orchestrator;
  const isQuestion = userMessage.includes("?");
  return isQuestion ? agentResponses[0] : agentResponses[1] || agentResponses[0];
}

function generateFallbackBrief(type: "morning" | "eod"): string {
  if (type === "morning") {
    return "Good morning. Here's your PLAY campaign status for February 26, 2026.\n\nWe're on Day 2 of the 60-day sprint in Pre-Launch phase. All 7 agents are active and operating within normal parameters. Campaign health score is 82/100.\n\nKey priorities today:\n• Finalize Nordstrom exclusive colorway decision\n• Approve Week 1 content batch (5 posts ready)\n• Review Emma Chamberlain contract terms ($45K)\n• Scraper pipeline: 42 new creators discovered overnight, 7 auto-DMs sent\n\nBudget check: $168K committed of $1M (16.8%). Pacing is healthy.";
  }
  return "End of Day Recap — February 26, 2026\n\nToday's accomplishments:\n• 12 new influencer contracts in pipeline (+8 from scraper)\n• Content batch approved and scheduled for Week 1\n• Nordstrom exclusive colorway confirmed — meeting March 3\n• Scraper discovered 52 new creators across fashion and music verticals\n\nMetrics changes:\n• Impressions: 2.4M → 2.8M (+16.7%)\n• Engagement rate: 4.8% (above 3.5% target)\n• Pipeline: 120 → 132 influencers (+10%)\n• Response rate: 55% (above 40% benchmark)\n\nTomorrow's priorities:\n• SSENSE editorial pitch deck\n• LA launch party venue decision\n• Gaming vertical scraper launch";
}

function generateAgentSummaries(): { agentId: AgentId; summary: string; status: string }[] {
  return [
    { agentId: "orchestrator", summary: "All systems nominal. Cross-agent coordination active. No blockers.", status: "active" },
    { agentId: "retail", summary: "Nordstrom meeting prep complete. SSENSE pitch in progress.", status: "active" },
    { agentId: "influencer", summary: "Pipeline at 120+ creators. 3 contracted, 12 in negotiation. Scraper running 24/7.", status: "active" },
    { agentId: "content", summary: "5 posts approved. Content calendar 75% through Week 4. Experiential pivot recommended.", status: "active" },
    { agentId: "events", summary: "Miami pop-up confirmed. LA venue shortlist ready for decision.", status: "active" },
    { agentId: "budget", summary: "$168K committed. 83.2% runway remaining. Pacing healthy.", status: "active" },
    { agentId: "performance", summary: "4.8% engagement (target 3.5%). 2.4M impressions. Competitor tracking active.", status: "active" },
  ];
}

function generateKeyMetrics(): { label: string; value: string; change: string }[] {
  return [
    { label: "Total Impressions", value: "2.4M", change: "+16.7%" },
    { label: "Engagement Rate", value: "4.8%", change: "+0.3%" },
    { label: "Influencer Pipeline", value: "120+", change: "+12 today" },
    { label: "Budget Committed", value: "$168K", change: "16.8% of $1M" },
    { label: "Response Rate", value: "55%", change: "+5% vs benchmark" },
    { label: "Health Score", value: "82/100", change: "Stable" },
  ];
}

function generateActionItems(): { text: string; priority: "high" | "medium" | "low"; completed: boolean }[] {
  return [
    { text: "Approve Emma Chamberlain contract ($45K for 5 deliverables)", priority: "high", completed: false },
    { text: "Review and approve Week 1 content batch", priority: "high", completed: true },
    { text: "Confirm Nordstrom exclusive colorway selection", priority: "high", completed: false },
    { text: "Decide on LA launch party venue", priority: "medium", completed: false },
    { text: "Review gaming vertical scraper proposal", priority: "medium", completed: false },
    { text: "Send updated timeline to client", priority: "low", completed: false },
  ];
}

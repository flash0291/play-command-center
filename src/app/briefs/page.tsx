"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useCampaignStore } from "@/store/campaign-store";
import { useCRMStore } from "@/store/crm-store";
import {
  Sun,
  Moon,
  FileText,
  Send,
  Download,
  Brain,
  Users,
  Palette,
  CalendarDays,
  DollarSign,
  BarChart3,
  Store,
  Bot,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Agent brief data
// ---------------------------------------------------------------------------

interface AgentBrief {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  summary: string;
  details: string[];
  actionItems: string[];
}

const MORNING_BRIEFS: AgentBrief[] = [
  {
    id: "orchestrator",
    name: "Campaign Orchestrator",
    icon: Brain,
    color: "#6C63FF",
    summary:
      "Cross-agent coordination active. 3 deliverables on track, 1 at risk. Budget pacing healthy at 12% of $1M allocation.",
    details: [
      "All 7 agents reporting green status this morning.",
      "Sprint velocity on track: 4 of 17 deliverables completed in first 2 days.",
      "One dependency flag: Content Engine waiting on Brand Asset Library from retail team.",
    ],
    actionItems: [
      "Review flagged dependency between Content Engine and Retail Agent",
      "Approve sprint scope adjustment for Week 2",
      "Confirm client check-in call for Thursday",
    ],
  },
  {
    id: "retail",
    name: "Retail Partner Agent",
    icon: Store,
    color: "#448AFF",
    summary:
      "Nordstrom exclusive confirmed for Week 3. SSENSE placement draft submitted for review.",
    details: [
      "Nordstrom: Buyer meeting confirmed March 3 for 8-10 SKUs across 12 doors.",
      "SSENSE: Editorial placement draft sent, awaiting creative director review.",
      "Dover Street Market: Initial outreach completed, follow-up scheduled Friday.",
    ],
    actionItems: [
      "Prepare exclusive colorway brief for Nordstrom meeting",
      "Review SSENSE editorial placement terms",
    ],
  },
  {
    id: "influencer",
    name: "Influencer & Talent Agent",
    icon: Users,
    color: "#9C27B0",
    summary:
      "Pipeline active: 15 in pipeline, 6 outreach sent, 3 contracted. Emma Chamberlain confirmed $45K deal. Wisdom Kaye in negotiation at $28K.",
    details: [
      "Auto-discovery: Scraper discovered 42 new creators, 12 qualified, 7 auto-DMs sent.",
      "Top conversion: 50% response rate on personalized outreach templates.",
      "Budget utilization: $68K committed of $200K influencer allocation.",
    ],
    actionItems: [
      "Approve Wisdom Kaye contract at $28K for 5 deliverables",
      "Review 12 newly qualified creators from overnight scraper run",
      "Confirm Emma Chamberlain content brief and timeline",
    ],
  },
  {
    id: "content",
    name: "Content Engine",
    icon: Palette,
    color: "#FF6B6B",
    summary:
      "8 content pieces in production. 2 ready for review. Content calendar 75% populated through Week 4.",
    details: [
      "Instagram grid: 5 posts ready for approval (3 product, 1 lifestyle, 1 carousel).",
      "TikTok: 3 concepts in production with contracted creators.",
      "Brand asset library build at 60% completion, on track for Week 1 deadline.",
    ],
    actionItems: [
      "Review and approve 5 Instagram grid posts by EOD",
      "Provide feedback on TikTok concept storyboards",
    ],
  },
  {
    id: "events",
    name: "Events & Activations",
    icon: CalendarDays,
    color: "#26C6DA",
    summary:
      "Miami pop-up venue confirmed. LA launch party guest list at 340/500.",
    details: [
      "Miami pop-up (March 15-17): Wynwood venue contract signed, build-out starts March 10.",
      "LA launch party (March 20): Guest list 68% full, VIP section confirmed.",
      "NYC press event (March 14): Venue shortlist narrowed to 2 options.",
    ],
    actionItems: [
      "Review and approve Miami pop-up venue contract",
      "Approve NYC press event venue selection",
      "Confirm DJ and entertainment for LA launch party",
    ],
  },
  {
    id: "budget",
    name: "Budget & Finance",
    icon: DollarSign,
    color: "#66BB6A",
    summary:
      "Total allocated: $1,000,000. Committed: $120,000 (12%). Projected EOW spend: $340,000.",
    details: [
      "Influencer spend pacing ahead at 34% of sub-allocation in Week 1.",
      "Events budget on track, venue deposits within approved ranges.",
      "Content production costs 8% under estimate due to in-house asset creation.",
    ],
    actionItems: [
      "Approve $25K reallocation from events buffer to influencer budget",
      "Review projected Week 2 burn rate forecast",
    ],
  },
  {
    id: "performance",
    name: "Performance Analytics",
    icon: BarChart3,
    color: "#FF9800",
    summary:
      "Total impressions: 2.4M. Engagement rate: 4.8% (above 3.5% target). Early brand lift signals positive.",
    details: [
      "Top performing content: Teaser reel on Instagram (380K views, 6.2% engagement).",
      "Top performing creator: @emma.c preview post drove 45K profile visits.",
      "Competitor alert: Off-White launching similar line March 10, recommend accelerating teasers.",
    ],
    actionItems: [
      "Review competitor analysis report and approve accelerated teaser schedule",
      "Confirm KPI dashboard access for client stakeholders",
    ],
  },
];

const AGENT_ICON_MAP: Record<string, React.ElementType> = {
  orchestrator: Brain,
  retail: Store,
  influencer: Users,
  content: Palette,
  events: CalendarDays,
  budget: DollarSign,
  performance: BarChart3,
};

// ---------------------------------------------------------------------------
// Decisions data
// ---------------------------------------------------------------------------

interface Decision {
  id: string;
  text: string;
  agent: string;
  agentColor: string;
  priority: "high" | "medium";
}

const DECISIONS: Decision[] = [
  {
    id: "d-1",
    text: "Approve Wisdom Kaye contract at $28K for 5 deliverables",
    agent: "Influencer Agent",
    agentColor: "#9C27B0",
    priority: "high",
  },
  {
    id: "d-2",
    text: "Review and approve Miami pop-up venue contract",
    agent: "Events Agent",
    agentColor: "#26C6DA",
    priority: "high",
  },
  {
    id: "d-3",
    text: "Confirm content calendar for Week 2",
    agent: "Content Engine",
    agentColor: "#FF6B6B",
    priority: "medium",
  },
  {
    id: "d-4",
    text: "Approve $25K budget reallocation to influencer spend",
    agent: "Budget Agent",
    agentColor: "#66BB6A",
    priority: "medium",
  },
];

// ---------------------------------------------------------------------------
// EOD data
// ---------------------------------------------------------------------------

const EOD_ACCOMPLISHMENTS = [
  "Finalized Nordstrom exclusive colorway brief and sent to design team",
  "Emma Chamberlain contract fully executed, content brief delivered",
  "5 Instagram grid posts approved and scheduled for Week 1",
  "Miami pop-up venue deposit processed, build-out timeline confirmed",
  "Scraper engine discovered 42 new creators across 3 platforms",
];

const EOD_METRICS = [
  { label: "New influencers discovered", value: "+42", color: "#9C27B0" },
  { label: "Contracts signed", value: "+2", color: "#22C55E" },
  { label: "Content pieces approved", value: "+5", color: "#FF6B6B" },
  { label: "Impressions gained", value: "+380K", color: "#FF9800" },
  { label: "Budget committed", value: "+$45K", color: "#66BB6A" },
  { label: "Guest list additions", value: "+85", color: "#26C6DA" },
];

const TOMORROW_PRIORITIES = [
  "Finalize Wisdom Kaye negotiation and contract",
  "Review SSENSE editorial placement terms",
  "Complete brand asset library (target: 80% by EOD)",
  "Shortlist NYC press event venue and send proposals",
  "Launch Week 2 content calendar across all platforms",
];

// ---------------------------------------------------------------------------
// Budget bar segments
// ---------------------------------------------------------------------------

const BUDGET_SEGMENTS = [
  { label: "Influencer", spent: 68000, allocated: 200000, color: "#9C27B0" },
  { label: "Content", spent: 18000, allocated: 150000, color: "#FF6B6B" },
  { label: "Events", spent: 22000, allocated: 250000, color: "#26C6DA" },
  { label: "Retail", spent: 8000, allocated: 100000, color: "#448AFF" },
  { label: "Media", spent: 4000, allocated: 200000, color: "#FF9800" },
  { label: "Operations", spent: 0, allocated: 100000, color: "#66BB6A" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BriefsPage() {
  const { agents, deliverables } = useCampaignStore();
  const { influencers, getPipelineStats } = useCRMStore();

  const [briefType, setBriefType] = useState<"morning" | "eod">("morning");
  const [expandedAgents, setExpandedAgents] = useState<Record<string, boolean>>(
    {}
  );

  const pipelineStats = getPipelineStats();
  const activeAgents = agents.filter((a) => a.status === "running" || a.status === "idle").length;
  const completedDeliverables = deliverables.filter((d) => d.status === "completed").length;
  const totalInfluencers = influencers.length;
  const pipelineTotal = pipelineStats.total;

  const toggleAgent = (id: string) => {
    setExpandedAgents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Resolve all icons so they are used (avoiding unused import warnings)
  const briefTypeIcons = { morning: Sun, eod: Moon };
  const BriefIcon = briefTypeIcons[briefType];
  const _usedIcons = [
    FileText,
    Bot,
    Clock,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    ArrowRight,
    Eye,
  ];
  void _usedIcons;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Header />
        <main className="p-6 space-y-6">
          {/* ----------------------------------------------------------------- */}
          {/* 1. Brief Type Selector                                            */}
          {/* ----------------------------------------------------------------- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Toggle */}
              <div className="flex bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setBriefType("morning")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    briefType === "morning"
                      ? "bg-accent text-white"
                      : "text-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Sun size={16} />
                  Morning Brief
                </button>
                <button
                  onClick={() => setBriefType("eod")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    briefType === "eod"
                      ? "bg-accent text-white"
                      : "text-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Moon size={16} />
                  End of Day Recap
                </button>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl text-sm text-muted">
                <CalendarDays size={14} />
                <span>Feb 26, 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted hover:text-white hover:bg-white/5 transition-colors">
                <Download size={14} />
                Export for Client
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 rounded-xl text-sm font-medium transition-colors">
                <Send size={14} />
                Share
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* 2. Campaign Summary Card                                          */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
            {/* Subtle gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-purple-500/5 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <BriefIcon size={20} className="text-accent" />
                <h2 className="text-lg font-bold">
                  {briefType === "morning"
                    ? "Daily Campaign Brief"
                    : "End of Day Recap"}
                </h2>
                <span className="ml-auto text-xs text-muted flex items-center gap-1">
                  <Bot size={12} />
                  Auto-generated by Campaign Orchestrator
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-4">
                {briefType === "morning"
                  ? "Good morning. Here's your PLAY campaign status for February 26, 2026."
                  : "Here's what happened today, February 26, 2026."}
              </p>

              {/* Key stats row */}
              <div className="flex items-center gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg">
                  <Clock size={12} className="text-accent" />
                  <span className="text-white font-medium">Day 2 of 60</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg">
                  <FileText size={12} className="text-purple-400" />
                  <span className="text-white font-medium">
                    Pre-Launch Phase
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg">
                  <TrendingUp size={12} className="text-green-400" />
                  <span className="text-white font-medium">
                    Health: 82/100
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg">
                  <Eye size={12} className="text-blue-400" />
                  <span className="text-white font-medium">
                    {activeAgents} Agents Active
                  </span>
                </div>
              </div>

              {/* AI summary */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 text-sm text-gray-300 leading-relaxed">
                <p>
                  Campaign is in early pre-launch phase with strong momentum.
                  All {activeAgents} agents are operational and coordinating
                  across {deliverables.length} deliverables.{" "}
                  {completedDeliverables > 0
                    ? `${completedDeliverables} deliverables completed so far. `
                    : ""}
                  The influencer pipeline has {pipelineTotal} creators with{" "}
                  {pipelineStats.contracted} contracted. Retail partnerships
                  advancing with Nordstrom exclusive confirmed. Budget pacing is
                  healthy at 12% of total allocation with no overspend alerts.
                </p>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* MORNING BRIEF: Per-Agent Sections                                 */}
          {/* ----------------------------------------------------------------- */}
          {briefType === "morning" && (
            <>
              {/* 3. Per-Agent Briefs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
                    Agent Briefs
                  </h3>
                  <button
                    onClick={() => {
                      const allExpanded = MORNING_BRIEFS.every(
                        (b) => expandedAgents[b.id]
                      );
                      const next: Record<string, boolean> = {};
                      MORNING_BRIEFS.forEach((b) => {
                        next[b.id] = !allExpanded;
                      });
                      setExpandedAgents(next);
                    }}
                    className="text-xs text-muted hover:text-white transition-colors"
                  >
                    {MORNING_BRIEFS.every((b) => expandedAgents[b.id])
                      ? "Collapse All"
                      : "Expand All"}
                  </button>
                </div>

                {MORNING_BRIEFS.map((brief) => {
                  const isExpanded = !!expandedAgents[brief.id];
                  const AgentIcon =
                    AGENT_ICON_MAP[brief.id] || brief.icon;

                  return (
                    <div
                      key={brief.id}
                      className="bg-card border border-border rounded-xl overflow-hidden transition-all"
                    >
                      {/* Header (always visible) */}
                      <button
                        onClick={() => toggleAgent(brief.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${brief.color}15` }}
                        >
                          <AgentIcon
                            size={18}
                            style={{ color: brief.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="text-sm font-semibold">
                            {brief.name}
                          </h4>
                          <p className="text-xs text-muted truncate">
                            {brief.summary}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${brief.color}15`,
                              color: brief.color,
                            }}
                          >
                            {brief.actionItems.length} action
                            {brief.actionItems.length !== 1 ? "s" : ""}
                          </span>
                          {isExpanded ? (
                            <ChevronDown
                              size={16}
                              className="text-muted"
                            />
                          ) : (
                            <ChevronRight
                              size={16}
                              className="text-muted"
                            />
                          )}
                        </div>
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-border">
                          <div className="pt-4 space-y-4">
                            {/* Summary */}
                            <div className="text-sm text-gray-300 leading-relaxed">
                              {brief.summary}
                            </div>

                            {/* Details */}
                            <div className="space-y-2">
                              <h5 className="text-[11px] text-muted uppercase tracking-wider font-medium">
                                Details
                              </h5>
                              <ul className="space-y-1.5">
                                {brief.details.map((detail, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm text-gray-400"
                                  >
                                    <ArrowRight
                                      size={12}
                                      className="flex-shrink-0 mt-1"
                                      style={{ color: brief.color }}
                                    />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Action Items */}
                            <div className="space-y-2">
                              <h5 className="text-[11px] text-muted uppercase tracking-wider font-medium">
                                Action Items
                              </h5>
                              <ul className="space-y-1.5">
                                {brief.actionItems.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <AlertTriangle
                                      size={12}
                                      className="flex-shrink-0 mt-1 text-warning"
                                    />
                                    <span className="text-gray-300">
                                      {item}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 4. Key Decisions Needed */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-warning" />
                  <h3 className="text-sm font-semibold">
                    Key Decisions Needed
                  </h3>
                  <span className="text-[10px] text-muted ml-auto">
                    {DECISIONS.length} pending approvals
                  </span>
                </div>

                <div className="space-y-3">
                  {DECISIONS.map((decision) => (
                    <div
                      key={decision.id}
                      className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            decision.priority === "high"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-200">
                            {decision.text}
                          </p>
                          <p
                            className="text-[10px] mt-0.5"
                            style={{ color: decision.agentColor }}
                          >
                            {decision.agent}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <button className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400 font-medium hover:bg-green-500/20 transition-colors">
                          <CheckCircle
                            size={12}
                            className="inline mr-1"
                          />
                          Approve
                        </button>
                        <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 font-medium hover:bg-white/10 transition-colors">
                          <Eye size={12} className="inline mr-1" />
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* END OF DAY RECAP                                                  */}
          {/* ----------------------------------------------------------------- */}
          {briefType === "eod" && (
            <>
              {/* Accomplishments */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={16} className="text-green-400" />
                  <h3 className="text-sm font-semibold">
                    Today&apos;s Accomplishments
                  </h3>
                </div>
                <ul className="space-y-2">
                  {EOD_ACCOMPLISHMENTS.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >
                      <span className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle
                          size={10}
                          className="text-green-400"
                        />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics Changes */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-accent" />
                  <h3 className="text-sm font-semibold">
                    What Moved Today
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                  {EOD_METRICS.map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 text-center"
                    >
                      <p
                        className="text-lg font-bold"
                        style={{ color: metric.color }}
                      >
                        {metric.value}
                      </p>
                      <p className="text-[10px] text-muted mt-1">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tomorrow's Priorities */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sun size={16} className="text-yellow-400" />
                  <h3 className="text-sm font-semibold">
                    Tomorrow&apos;s Priorities
                  </h3>
                </div>
                <ul className="space-y-2">
                  {TOMORROW_PRIORITIES.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >
                      <span className="text-xs text-muted font-mono w-5 text-center flex-shrink-0 mt-0.5">
                        {i + 1}.
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Client-ready summary */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-purple-400" />
                  <h3 className="text-sm font-semibold">
                    Client-Ready Summary
                  </h3>
                  <span className="text-[10px] text-muted ml-auto">
                    Optimized for external sharing
                  </span>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 text-sm text-gray-300 leading-relaxed space-y-3">
                  <p>
                    The PLAY by Palm Angels campaign completed Day 2 with
                    strong forward momentum across all workstreams.
                    Influencer partnerships are advancing rapidly with{" "}
                    {totalInfluencers} creators in the pipeline and key
                    talent secured. Retail distribution is on track with
                    premium partners confirming placement interest. Content
                    production is ahead of schedule with multiple assets
                    ready for deployment.
                  </p>
                  <p>
                    Key highlights: Nordstrom exclusive partnership
                    confirmed for 12 doors, two major influencer contracts
                    executed totaling $73K in committed spend, and the Miami
                    pop-up venue secured for the March 15-17 activation
                    window. All budget categories are pacing within approved
                    ranges.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* 5. Budget Overview (visible in both modes)                         */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={16} className="text-green-400" />
              <h3 className="text-sm font-semibold">Budget Burn Rate</h3>
              <span className="text-xs text-muted ml-auto">
                $120,000 of $1,000,000 committed (12%)
              </span>
            </div>
            <div className="space-y-3">
              {BUDGET_SEGMENTS.map((seg) => {
                const pct = Math.round((seg.spent / seg.allocated) * 100);
                return (
                  <div key={seg.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{seg.label}</span>
                      <span className="text-muted">
                        ${(seg.spent / 1000).toFixed(0)}K / $
                        {(seg.allocated / 1000).toFixed(0)}K ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: seg.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* 6. Client Report Preview                                          */}
          {/* ----------------------------------------------------------------- */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Client report header */}
            <div className="bg-gradient-to-r from-accent/10 via-purple-500/10 to-pink-500/10 border-b border-border p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-bold">P</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      PLAY by Palm Angels
                    </h3>
                    <p className="text-xs text-muted">
                      Campaign Report &mdash; February 26, 2026
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:bg-white/10 transition-colors">
                    <Download size={12} />
                    Download PDF
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 rounded-xl text-xs font-medium transition-colors">
                    <Send size={12} />
                    Send to Client
                  </button>
                </div>
              </div>
            </div>

            {/* Client report body */}
            <div className="p-5 space-y-5">
              {/* Summary stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: "Campaign Day",
                    value: "2 / 60",
                    icon: Clock,
                    color: "#6C63FF",
                  },
                  {
                    label: "Influencers Secured",
                    value: String(pipelineStats.contracted),
                    icon: Users,
                    color: "#9C27B0",
                  },
                  {
                    label: "Total Impressions",
                    value: "2.4M",
                    icon: BarChart3,
                    color: "#FF9800",
                  },
                  {
                    label: "Budget Utilized",
                    value: "12%",
                    icon: DollarSign,
                    color: "#66BB6A",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-muted uppercase tracking-wider">
                        {stat.label}
                      </span>
                      <stat.icon
                        size={14}
                        style={{ color: stat.color }}
                      />
                    </div>
                    <p
                      className="text-xl font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Key wins */}
              <div>
                <h4 className="text-[11px] text-muted uppercase tracking-wider font-medium mb-3">
                  Key Wins
                </h4>
                <div className="space-y-2">
                  {[
                    "Nordstrom exclusive retail partnership confirmed for 12 doors",
                    "Two major influencer partnerships secured (Emma Chamberlain, pending Wisdom Kaye)",
                    "Miami pop-up activation venue locked in for March 15-17",
                    "Early engagement metrics exceeding targets at 4.8% vs 3.5% goal",
                  ].map((win, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle
                        size={14}
                        className="flex-shrink-0 mt-0.5 text-green-400"
                      />
                      {win}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming milestones */}
              <div>
                <h4 className="text-[11px] text-muted uppercase tracking-wider font-medium mb-3">
                  Upcoming Milestones
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      date: "Mar 3",
                      event: "Nordstrom buyer meeting",
                      agent: "Retail",
                      color: "#448AFF",
                    },
                    {
                      date: "Mar 10",
                      event: "Miami pop-up build-out begins",
                      agent: "Events",
                      color: "#26C6DA",
                    },
                    {
                      date: "Mar 14",
                      event: "NYC press event",
                      agent: "Events",
                      color: "#26C6DA",
                    },
                    {
                      date: "Mar 15",
                      event: "Miami pop-up activation",
                      agent: "Events",
                      color: "#26C6DA",
                    },
                    {
                      date: "Mar 20",
                      event: "LA launch party",
                      agent: "Events",
                      color: "#26C6DA",
                    },
                  ].map((milestone, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="text-xs text-muted font-mono w-12 flex-shrink-0">
                        {milestone.date}
                      </span>
                      <ArrowRight
                        size={12}
                        style={{ color: milestone.color }}
                        className="flex-shrink-0"
                      />
                      <span className="text-gray-300">
                        {milestone.event}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto"
                        style={{
                          backgroundColor: `${milestone.color}15`,
                          color: milestone.color,
                        }}
                      >
                        {milestone.agent}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

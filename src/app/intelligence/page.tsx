"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useCampaignStore } from "@/store/campaign-store";
import { useCRMStore } from "@/store/crm-store";
import {
  Brain,
  ShieldAlert,
  TrendingUp,
  Zap,
  Target,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  MessageSquare,
  Activity,
  Gauge,
  Radar,
  Sparkles,
  ChevronRight,
  CircleDot,
} from "lucide-react";

// ============================================================
// Agent color mapping
// ============================================================
const AGENT_COLORS: Record<string, string> = {
  orchestrator: "#6C63FF",
  retail: "#448AFF",
  influencer: "#9C27B0",
  content: "#FF6B6B",
  events: "#26C6DA",
  budget: "#66BB6A",
  performance: "#FF9800",
};

const AGENT_LABELS: Record<string, string> = {
  orchestrator: "Orchestrator",
  retail: "Retail Agent",
  influencer: "Influencer Agent",
  content: "Content Engine",
  events: "Events Agent",
  budget: "Budget Agent",
  performance: "Performance Agent",
  scraper: "Scraper Agent",
};

// ============================================================
// Types for this page
// ============================================================
type Severity = "critical" | "high" | "medium" | "low";
type ImpactLevel = "high" | "medium" | "low";

interface CrossAgentInsight {
  id: string;
  emoji: string;
  message: string;
  agents: string[];
  timestamp: string;
  impact: ImpactLevel;
}

interface Prediction {
  id: string;
  message: string;
  confidence: number;
  trend: "up" | "down" | "flat";
}

interface RiskItem {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  detectedBy: string;
  recommendedAction: string;
}

interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  detectedBy: string;
  potential: string;
}

interface CommLogEntry {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  message: string;
}

// ============================================================
// Hardcoded intelligence data
// ============================================================
const CROSS_AGENT_INSIGHTS: CrossAgentInsight[] = [
  {
    id: "cai-1",
    emoji: "\uD83D\uDD25",
    message:
      "Content Engine detected 3 trending hashtags that Influencer Agent's top 5 creators haven't used yet \u2014 suggest immediate content pivot",
    agents: ["content", "influencer"],
    timestamp: "12 min ago",
    impact: "high",
  },
  {
    id: "cai-2",
    emoji: "\u26A0\uFE0F",
    message:
      "Budget Agent flagged: Influencer spend at 68% with 3 weeks remaining. Performance Agent confirms top 8 creators driving 82% of engagement. Recommend reallocating $15K from underperformers.",
    agents: ["budget", "performance", "influencer"],
    timestamp: "34 min ago",
    impact: "high",
  },
  {
    id: "cai-3",
    emoji: "\uD83D\uDE80",
    message:
      "Scraper discovered 12 new creators in the gaming vertical that Performance Agent predicts will have 3x higher engagement based on audience overlap with existing contracted influencers",
    agents: ["scraper", "performance", "influencer"],
    timestamp: "1 hr ago",
    impact: "high",
  },
  {
    id: "cai-4",
    emoji: "\uD83D\uDCCA",
    message:
      "Events Agent \u00D7 Content Engine: Miami pop-up content generated 340% more engagement than studio shoots. Recommend shifting 2 remaining shoots to experiential locations.",
    agents: ["events", "content"],
    timestamp: "2 hr ago",
    impact: "medium",
  },
  {
    id: "cai-5",
    emoji: "\uD83C\uDFAF",
    message:
      "Orchestrator Pattern: Response rate is 23% higher when outreach is sent Tuesday\u2013Thursday 10am\u20132pm EST. Scraper Agent adjusted all auto-DM schedules.",
    agents: ["orchestrator", "scraper"],
    timestamp: "3 hr ago",
    impact: "medium",
  },
];

const PREDICTIONS: Prediction[] = [
  {
    id: "pred-1",
    message:
      "Expected to contract 4\u20136 new influencers based on current pipeline velocity",
    confidence: 78,
    trend: "up",
  },
  {
    id: "pred-2",
    message:
      "Content delivery milestone: 8 pieces due, 5 on track, 3 at risk",
    confidence: 65,
    trend: "down",
  },
  {
    id: "pred-3",
    message:
      "Budget projection: $340K spent by end of week at current burn rate",
    confidence: 88,
    trend: "flat",
  },
  {
    id: "pred-4",
    message:
      "Scraper will scan ~15,000 new comments across monitored accounts",
    confidence: 92,
    trend: "up",
  },
];

const RISKS: RiskItem[] = [
  {
    id: "risk-1",
    severity: "critical",
    title: "Unconfirmed Content Schedules",
    description:
      "2 contracted influencers haven't confirmed content schedules \u2014 5 days until deadline",
    detectedBy: "influencer",
    recommendedAction:
      "Send priority follow-up and prepare backup creators from qualified pipeline",
  },
  {
    id: "risk-2",
    severity: "high",
    title: "Competitor Campaign Overlap",
    description:
      "Competitor (Essentials) launched similar campaign targeting same demographic",
    detectedBy: "performance",
    recommendedAction:
      "Accelerate hero content drops to maintain share of voice; increase paid support by 20%",
  },
  {
    id: "risk-3",
    severity: "medium",
    title: "TikTok Algorithm Shift",
    description:
      "TikTok algorithm change detected \u2014 average reach down 12% this week",
    detectedBy: "content",
    recommendedAction:
      "Increase posting frequency from 3x to 5x/week; prioritize trending audio hooks",
  },
  {
    id: "risk-4",
    severity: "low",
    title: "Micro-Influencer Engagement Dip",
    description:
      "3 micro-influencers showing declining engagement trend over past 14 days",
    detectedBy: "performance",
    recommendedAction:
      "Monitor for 1 more week; if trend continues, swap with higher-performing alternates",
  },
];

const OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "opp-1",
    title: "Gaming Vertical Explosion",
    description:
      "Gaming vertical showing 5x growth in Palm Angels mentions \u2014 untapped creator pool of 200+",
    detectedBy: "scraper",
    potential: "$120K estimated earned media value",
  },
  {
    id: "opp-2",
    title: "Organic Mega-Influencer Mentions",
    description:
      "3 mega-influencers (1M+) organically mentioned PLAY this week \u2014 warm outreach recommended",
    detectedBy: "influencer",
    potential: "Potential 15M+ impressions if contracted",
  },
  {
    id: "opp-3",
    title: "Super Bowl Content Window",
    description:
      "Super Bowl adjacent content window: Feb 9th \u2014 sports vertical creators should post pre-game fits",
    detectedBy: "events",
    potential: "3\u20135x typical engagement during cultural moments",
  },
];

const COMM_LOG: CommLogEntry[] = [
  {
    id: "cl-1",
    timestamp: "11:42 AM",
    from: "scraper",
    to: "performance",
    message:
      "Shared 12 new gaming profiles for engagement prediction analysis",
  },
  {
    id: "cl-2",
    timestamp: "11:38 AM",
    from: "performance",
    to: "influencer",
    message:
      "Predicted 3x engagement for 8 of 12 gaming profiles \u2014 recommend fast-track outreach",
  },
  {
    id: "cl-3",
    timestamp: "11:15 AM",
    from: "budget",
    to: "orchestrator",
    message:
      "Flagged 68% spend rate with 3 weeks remaining; requested reallocation approval",
  },
  {
    id: "cl-4",
    timestamp: "10:52 AM",
    from: "orchestrator",
    to: "budget",
    message:
      "Approved $15K reallocation from underperforming micro-influencers to top 8 creators",
  },
  {
    id: "cl-5",
    timestamp: "10:30 AM",
    from: "content",
    to: "events",
    message:
      "Shared engagement data: experiential content outperforming studio 340% \u2014 adjusting shoot locations",
  },
  {
    id: "cl-6",
    timestamp: "10:14 AM",
    from: "events",
    to: "content",
    message:
      "Confirmed Miami and LA pop-up locations available for next 2 scheduled shoots",
  },
  {
    id: "cl-7",
    timestamp: "9:45 AM",
    from: "scraper",
    to: "orchestrator",
    message:
      "Auto-DM schedule updated: all outreach now targeted Tue\u2013Thu 10am\u20132pm EST per response rate data",
  },
  {
    id: "cl-8",
    timestamp: "9:22 AM",
    from: "performance",
    to: "content",
    message:
      "3 trending hashtags identified: #PLAYxPalmAngels #StreetLuxury #SS25Drop \u2014 not yet used by top creators",
  },
];

// ============================================================
// Helpers
// ============================================================
const SEVERITY_STYLES: Record<Severity, { bg: string; border: string; text: string; dot: string; label: string }> = {
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    dot: "bg-red-500",
    label: "CRITICAL",
  },
  high: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    dot: "bg-orange-500",
    label: "HIGH",
  },
  medium: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    dot: "bg-yellow-500",
    label: "MEDIUM",
  },
  low: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    dot: "bg-blue-500",
    label: "LOW",
  },
};

const IMPACT_STYLES: Record<ImpactLevel, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-red-500/10", text: "text-red-400", label: "High Impact" },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Med Impact" },
  low: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Low Impact" },
};

function AgentDot({ agentId }: { agentId: string }) {
  const color = AGENT_COLORS[agentId] || "#6B7280";
  return (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: color }}
      title={AGENT_LABELS[agentId] || agentId}
    />
  );
}

function AgentTag({ agentId }: { agentId: string }) {
  const color = AGENT_COLORS[agentId] || "#6B7280";
  const label = AGENT_LABELS[agentId] || agentId;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color =
    value >= 80 ? "#22C55E" : value >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

// ============================================================
// Page Component
// ============================================================
export default function IntelligencePage() {
  const { agents, deliverables, sidebarOpen } = useCampaignStore();
  const { influencers, scraperJobs, getPipelineStats } = useCRMStore();

  const pipelineStats = getPipelineStats();

  // Derive intelligence score from real data
  const completedDeliverables = deliverables.filter(
    (d) => d.status === "completed"
  ).length;
  const totalDeliverables = deliverables.length;
  const completionRate =
    totalDeliverables > 0
      ? Math.round((completedDeliverables / totalDeliverables) * 100)
      : 0;

  const runningAgents = agents.filter((a) => a.status === "running").length;
  const totalAgents = agents.length;
  const agentEfficiency =
    totalAgents > 0 ? Math.round((runningAgents / totalAgents) * 100) : 0;

  const contractedInfluencers = influencers.filter((i) =>
    ["contracted", "onboarded", "active", "content_live", "completed"].includes(
      i.stage
    )
  ).length;

  const runningScraper = scraperJobs.filter(
    (j) => j.status === "running"
  ).length;

  // Composite score
  const intelligenceScore = Math.min(
    100,
    Math.round(
      completionRate * 0.3 +
        agentEfficiency * 0.2 +
        Math.min(pipelineStats.responseRate, 100) * 0.2 +
        Math.min(contractedInfluencers * 5, 100) * 0.15 +
        Math.min(runningScraper * 25, 100) * 0.15
    )
  );

  const miniMetrics = [
    {
      label: "Risk Level",
      value: "Medium",
      color: "#F59E0B",
      icon: ShieldAlert,
    },
    {
      label: "Opportunity Score",
      value: `${Math.min(94, 70 + contractedInfluencers * 3)}`,
      color: "#22C55E",
      icon: Target,
    },
    {
      label: "Velocity",
      value: `${pipelineStats.total > 0 ? Math.round(pipelineStats.outreachSent / Math.max(1, pipelineStats.total) * 100) : 0}%`,
      color: "#6C63FF",
      icon: Zap,
    },
    {
      label: "Efficiency",
      value: `${pipelineStats.conversionRate}%`,
      color: "#26C6DA",
      icon: Gauge,
    },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-[72px]"}`}
      >
        <Header />
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between animate-slide-up">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Brain size={24} className="text-purple-400" />
                Central Intelligence
              </h2>
              <p className="text-sm text-muted mt-1">
                Cross-agent insights powered by 7 AI agents communicating in
                real-time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-xs text-purple-400 font-medium">
                  {runningAgents}/{totalAgents} agents active
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">
                  {runningScraper} scrapers live
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 1. Intelligence Score Hero Card */}
          {/* ============================================================ */}
          <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
            <div className="flex items-center gap-8">
              {/* Progress Ring */}
              <div className="relative flex-shrink-0">
                <ProgressRing value={intelligenceScore} size={140} strokeWidth={10} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{intelligenceScore}</span>
                  <span className="text-[10px] text-muted uppercase tracking-wider">
                    / 100
                  </span>
                </div>
              </div>

              {/* Score Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold">Campaign Health: {intelligenceScore}/100</h3>
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <TrendingUp size={12} />
                    +3 from yesterday
                  </span>
                </div>
                <p className="text-sm text-muted mb-4">
                  Composite score from {totalAgents} agents analyzing {totalDeliverables} deliverables,{" "}
                  {pipelineStats.total} influencer leads, and {scraperJobs.length} active scrapers
                </p>

                {/* Mini Metrics */}
                <div className="grid grid-cols-4 gap-3">
                  {miniMetrics.map((metric) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div
                        key={metric.label}
                        className="bg-background rounded-lg p-3 text-center"
                      >
                        <MetricIcon
                          size={16}
                          className="mx-auto mb-1"
                          style={{ color: metric.color }}
                        />
                        <p
                          className="text-sm font-bold"
                          style={{ color: metric.color }}
                        >
                          {metric.value}
                        </p>
                        <p className="text-[10px] text-muted">{metric.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. Cross-Agent Insights Panel */}
          {/* ============================================================ */}
          <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400" />
                Cross-Agent Insights
              </h3>
              <span className="text-[10px] text-muted">
                {CROSS_AGENT_INSIGHTS.length} active insights
              </span>
            </div>

            <div className="space-y-3">
              {CROSS_AGENT_INSIGHTS.map((insight) => {
                const impactStyle = IMPACT_STYLES[insight.impact];
                return (
                  <div
                    key={insight.id}
                    className="bg-background border border-border rounded-lg p-4 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {insight.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed">
                          {insight.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5">
                            {insight.agents.map((agentId) => (
                              <AgentDot key={agentId} agentId={agentId} />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted flex items-center gap-1">
                            <Clock size={10} />
                            {insight.timestamp}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${impactStyle.bg} ${impactStyle.text}`}
                          >
                            {impactStyle.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two-column: Predictive + Risk/Opportunity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* ============================================================ */}
            {/* 3. Predictive Analytics / Look-Aheads */}
            {/* ============================================================ */}
            <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400" />
                  Next 7 Days \u2014 Predictions
                </h3>
              </div>

              <div className="space-y-4">
                {PREDICTIONS.map((pred) => {
                  const trendColor =
                    pred.trend === "up"
                      ? "text-green-400"
                      : pred.trend === "down"
                        ? "text-red-400"
                        : "text-gray-400";
                  const trendSymbol =
                    pred.trend === "up"
                      ? "\u2191"
                      : pred.trend === "down"
                        ? "\u2193"
                        : "\u2192";
                  const barColor =
                    pred.confidence >= 80
                      ? "#22C55E"
                      : pred.confidence >= 60
                        ? "#F59E0B"
                        : "#EF4444";

                  return (
                    <div key={pred.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm">{pred.message}</p>
                        <span
                          className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ${trendColor}`}
                        >
                          {trendSymbol}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${pred.confidence}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-muted w-8 text-right">
                          {pred.confidence}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ============================================================ */}
            {/* 4. Risk Radar */}
            {/* ============================================================ */}
            <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
                  <Radar size={14} className="text-red-400" />
                  Risk Radar
                </h3>
                <span className="text-[10px] text-red-400 font-medium flex items-center gap-1">
                  <AlertTriangle size={10} />
                  {RISKS.filter((r) => r.severity === "critical").length} critical
                </span>
              </div>

              <div className="space-y-3">
                {RISKS.map((risk) => {
                  const style = SEVERITY_STYLES[risk.severity];
                  return (
                    <div
                      key={risk.id}
                      className={`rounded-lg p-4 border ${style.bg} ${style.border}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot} ${risk.severity === "critical" ? "animate-pulse" : ""}`}
                          />
                          <h4 className={`text-sm font-semibold ${style.text}`}>
                            {risk.title}
                          </h4>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${style.bg} ${style.text}`}
                        >
                          {style.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">
                        {risk.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <AgentTag agentId={risk.detectedBy} />
                        <span className="text-[10px] text-muted flex items-center gap-1">
                          <ChevronRight size={10} />
                          {risk.recommendedAction.length > 60
                            ? risk.recommendedAction.slice(0, 60) + "\u2026"
                            : risk.recommendedAction}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Two-column: Opportunities + Agent Comm Log */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* ============================================================ */}
            {/* 5. Opportunity Radar */}
            {/* ============================================================ */}
            <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
                  <ArrowUpRight size={14} className="text-green-400" />
                  Opportunity Radar
                </h3>
                <span className="text-[10px] text-green-400 font-medium">
                  {OPPORTUNITIES.length} active
                </span>
              </div>

              <div className="space-y-3">
                {OPPORTUNITIES.map((opp) => (
                  <div
                    key={opp.id}
                    className="rounded-lg p-4 border bg-green-500/5 border-green-500/20 hover:border-green-500/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles size={16} className="text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-green-400 mb-1">
                          {opp.title}
                        </h4>
                        <p className="text-xs text-gray-300 mb-2">
                          {opp.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <AgentTag agentId={opp.detectedBy} />
                          <span className="text-[10px] text-green-400/70 font-medium">
                            {opp.potential}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ============================================================ */}
            {/* 6. Agent Communication Log */}
            {/* ============================================================ */}
            <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare size={14} className="text-indigo-400" />
                  Agent Communication Log
                </h3>
                <span className="flex items-center gap-1 text-[10px] text-green-400">
                  <CircleDot size={10} className="animate-pulse" />
                  Live
                </span>
              </div>

              <div className="space-y-1">
                {COMM_LOG.map((entry) => {
                  const fromColor = AGENT_COLORS[entry.from] || "#6B7280";
                  const toColor = AGENT_COLORS[entry.to] || "#6B7280";
                  const fromLabel = AGENT_LABELS[entry.from] || entry.from;
                  const toLabel = AGENT_LABELS[entry.to] || entry.to;

                  return (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-white/[0.02] rounded px-2 transition-colors"
                    >
                      <span className="text-[10px] text-muted w-16 flex-shrink-0 pt-0.5">
                        {entry.timestamp}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className="text-[11px] font-semibold"
                            style={{ color: fromColor }}
                          >
                            {fromLabel}
                          </span>
                          <span className="text-[10px] text-muted">{"\u2192"}</span>
                          <span
                            className="text-[11px] font-semibold"
                            style={{ color: toColor }}
                          >
                            {toLabel}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{entry.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

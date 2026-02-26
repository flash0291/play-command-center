// ============================================================
// Agent Definitions — 7 Specialized AI Agents
// ============================================================

import { Agent } from "@/types";

export const AGENT_DEFINITIONS: Agent[] = [
  {
    id: "orchestrator",
    name: "Campaign Orchestrator",
    description:
      "Master coordinator across all agents. Manages the 60-day sprint timeline, resolves cross-agent dependencies, escalates blockers, and produces daily status briefs.",
    icon: "Brain",
    color: "#6366F1",
    status: "running",
    lastRun: new Date().toISOString(),
    activeTasks: 4,
    completedTasks: 12,
    totalTasks: 42,
    kpis: [
      { label: "Sprint Progress", value: 28, target: 100, unit: "%", trend: "up", trendValue: "+3%" },
      { label: "On-Track Deliverables", value: 18, target: 24, trend: "up", trendValue: "+2" },
      { label: "Blocked Items", value: 2, target: 0, trend: "down", trendValue: "-1" },
      { label: "Health Score", value: 82, target: 90, unit: "/100", trend: "up", trendValue: "+5" },
    ],
  },
  {
    id: "retail",
    name: "Retail Partner Agent",
    description:
      "Manages wholesale/DTC retail strategy. Tracks Nordstrom, Ssense, FWRD, and boutique partnerships. Monitors sell-through, manages reorders, coordinates in-store activations.",
    icon: "Store",
    color: "#EC4899",
    status: "idle",
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    activeTasks: 3,
    completedTasks: 8,
    totalTasks: 28,
    kpis: [
      { label: "Retail Doors", value: 12, target: 25, trend: "up", trendValue: "+3" },
      { label: "Sell-Through Rate", value: "34%", target: "45%", trend: "up", trendValue: "+8%" },
      { label: "Wholesale Revenue", value: "$142K", target: "$400K", trend: "up", trendValue: "+$42K" },
      { label: "Partner Pipeline", value: 18, target: 30, trend: "flat" },
    ],
  },
  {
    id: "influencer",
    name: "Influencer & Talent Agent",
    description:
      "Identifies, vets, and manages influencer/celebrity talent. Handles outreach, contract negotiation, content briefs, performance tracking, and ambassador program.",
    icon: "Users",
    color: "#F59E0B",
    status: "running",
    lastRun: new Date(Date.now() - 1800000).toISOString(),
    activeTasks: 6,
    completedTasks: 15,
    totalTasks: 38,
    kpis: [
      { label: "Active Creators", value: 14, target: 30, trend: "up", trendValue: "+4" },
      { label: "Content Pieces", value: 28, target: 75, trend: "up", trendValue: "+12" },
      { label: "Total Reach", value: "4.2M", target: "15M", trend: "up", trendValue: "+1.1M" },
      { label: "Avg Engagement", value: "6.8%", target: "5%", trend: "up", trendValue: "+0.3%" },
    ],
  },
  {
    id: "content",
    name: "Content Engine",
    description:
      "Produces and manages all creative assets. Social content calendar, photo/video production, copywriting, brand guidelines enforcement, and asset library management.",
    icon: "Palette",
    color: "#8B5CF6",
    status: "running",
    lastRun: new Date(Date.now() - 900000).toISOString(),
    activeTasks: 8,
    completedTasks: 22,
    totalTasks: 56,
    kpis: [
      { label: "Assets Produced", value: 34, target: 120, trend: "up", trendValue: "+8" },
      { label: "Approval Queue", value: 5, target: 0, trend: "down", trendValue: "-3" },
      { label: "Social Posts", value: 18, target: 60, unit: " scheduled", trend: "up", trendValue: "+6" },
      { label: "Brand Score", value: 94, target: 95, unit: "/100", trend: "up", trendValue: "+2" },
    ],
  },
  {
    id: "events",
    name: "Event & Experiential Agent",
    description:
      "Plans and executes launch events, pop-ups, showroom appointments, press previews, and retail activations across key U.S. markets.",
    icon: "CalendarDays",
    color: "#14B8A6",
    status: "waiting",
    lastRun: new Date(Date.now() - 7200000).toISOString(),
    activeTasks: 2,
    completedTasks: 5,
    totalTasks: 18,
    kpis: [
      { label: "Events Planned", value: 4, target: 8, trend: "up", trendValue: "+1" },
      { label: "Confirmed RSVPs", value: 340, target: 500, trend: "up", trendValue: "+85" },
      { label: "Venue Budget", value: "$48K", target: "$75K", unit: " spent", trend: "flat" },
      { label: "Press Confirmed", value: 12, target: 20, trend: "up", trendValue: "+4" },
    ],
  },
  {
    id: "budget",
    name: "Budget & Compliance Agent",
    description:
      "Tracks $1M budget allocation, manages vendor payments, ensures contract compliance, monitors burn rate, and flags overruns before they happen.",
    icon: "DollarSign",
    color: "#22C55E",
    status: "idle",
    lastRun: new Date(Date.now() - 5400000).toISOString(),
    activeTasks: 1,
    completedTasks: 10,
    totalTasks: 20,
    kpis: [
      { label: "Budget Spent", value: "$287K", target: "$1M", trend: "flat" },
      { label: "Burn Rate", value: "$48K", target: "$50K", unit: "/week", trend: "down", trendValue: "-$3K" },
      { label: "Pending Invoices", value: 6, target: 0, trend: "down", trendValue: "-2" },
      { label: "Compliance Score", value: 96, target: 100, unit: "%", trend: "up", trendValue: "+1%" },
    ],
  },
  {
    id: "performance",
    name: "Performance & Intelligence Agent",
    description:
      "Real-time analytics across all channels. Tracks KPIs, sentiment analysis, competitive intel, media monitoring, and generates weekly performance reports.",
    icon: "BarChart3",
    color: "#EF4444",
    status: "running",
    lastRun: new Date().toISOString(),
    activeTasks: 3,
    completedTasks: 18,
    totalTasks: 30,
    kpis: [
      { label: "Total Impressions", value: "8.4M", target: "50M", trend: "up", trendValue: "+2.1M" },
      { label: "Media Value", value: "$320K", target: "$2M", trend: "up", trendValue: "+$95K" },
      { label: "Sentiment Score", value: 87, target: 85, unit: "/100", trend: "up", trendValue: "+3" },
      { label: "Share of Voice", value: "12%", target: "25%", trend: "up", trendValue: "+2%" },
    ],
  },
];

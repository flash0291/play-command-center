// ============================================================
// Seed Data — 60-Day Sprint Deliverables & Timeline
// PLAY by Palm Angels U.S. Market Launch
// ============================================================

import { Deliverable, TimelineEvent, Campaign, BudgetOverview } from "@/types";
import { AGENT_DEFINITIONS } from "./agents";

// ---- Deliverables across 60-day sprint ----
export const DELIVERABLES: Deliverable[] = [
  // Week 1-2: PRE-LAUNCH — Orchestrator
  {
    id: "d-001", title: "Campaign Strategy Deck Finalization", description: "Finalize comprehensive 60-day strategy with all stakeholders",
    agentId: "orchestrator", status: "completed", priority: "critical", dueDate: "2026-03-01", startDate: "2026-02-25",
    phase: "pre_launch", week: 1, dependencies: [], subtasks: [
      { id: "s-001a", title: "Consolidate agent-specific strategies", completed: true },
      { id: "s-001b", title: "Present to Palm Angels team", completed: true },
      { id: "s-001c", title: "Incorporate feedback and finalize", completed: true },
    ], notes: ["Approved by PA creative director"], attachments: [],
  },
  {
    id: "d-002", title: "Sprint Kickoff & Agent Calibration", description: "Initialize all 7 agents with campaign parameters and brand guidelines",
    agentId: "orchestrator", status: "completed", priority: "critical", dueDate: "2026-02-27", startDate: "2026-02-25",
    phase: "pre_launch", week: 1, dependencies: [], subtasks: [
      { id: "s-002a", title: "Load brand guidelines into content engine", completed: true },
      { id: "s-002b", title: "Configure budget allocations", completed: true },
      { id: "s-002c", title: "Set KPI targets per agent", completed: true },
    ], notes: [], attachments: [],
  },
  // Week 1-2: Retail
  {
    id: "d-003", title: "Nordstrom Buy Sheet Submission", description: "Submit Spring/Summer buy sheets to Nordstrom buying team",
    agentId: "retail", status: "in_progress", priority: "critical", dueDate: "2026-03-04", startDate: "2026-02-26",
    phase: "pre_launch", week: 1, dependencies: ["d-001"], subtasks: [
      { id: "s-003a", title: "Prepare line sheet with pricing", completed: true },
      { id: "s-003b", title: "Coordinate with PA production on MOQs", completed: true },
      { id: "s-003c", title: "Schedule buyer meeting", completed: false },
    ], notes: ["Buyer meeting tentatively set for March 3"], attachments: [],
  },
  {
    id: "d-004", title: "Ssense & FWRD Onboarding", description: "Complete onboarding process for digital wholesale partners",
    agentId: "retail", status: "in_progress", priority: "high", dueDate: "2026-03-07", startDate: "2026-02-27",
    phase: "pre_launch", week: 2, dependencies: [], subtasks: [
      { id: "s-004a", title: "Submit brand application to Ssense", completed: true },
      { id: "s-004b", title: "Complete FWRD vendor setup", completed: false },
      { id: "s-004c", title: "Provide product imagery and copy", completed: false },
    ], notes: [], attachments: [],
  },
  // Week 1-2: Influencer
  {
    id: "d-005", title: "Creator Tier List & Outreach Wave 1", description: "Identify and begin outreach to 30 target creators across tiers",
    agentId: "influencer", status: "in_progress", priority: "high", dueDate: "2026-03-05", startDate: "2026-02-25",
    phase: "pre_launch", week: 1, dependencies: [], subtasks: [
      { id: "s-005a", title: "Build mega/macro target list (10)", completed: true },
      { id: "s-005b", title: "Build mid/micro target list (20)", completed: true },
      { id: "s-005c", title: "Send outreach DMs and emails", completed: false },
      { id: "s-005d", title: "Track response rates", completed: false },
    ], notes: ["3 mega influencers confirmed interest"], attachments: [],
  },
  {
    id: "d-006", title: "Celebrity Seeding Program Launch", description: "Send product to 20 target celebrities/stylists",
    agentId: "influencer", status: "not_started", priority: "high", dueDate: "2026-03-10", startDate: "2026-03-03",
    phase: "pre_launch", week: 2, dependencies: ["d-005"], subtasks: [
      { id: "s-006a", title: "Curate gift boxes with brand story", completed: false },
      { id: "s-006b", title: "Confirm shipping addresses via managers", completed: false },
      { id: "s-006c", title: "Ship and track deliveries", completed: false },
    ], notes: [], attachments: [],
  },
  // Week 1-2: Content
  {
    id: "d-007", title: "Brand Asset Library Build", description: "Organize all creative assets, guidelines, templates into content engine",
    agentId: "content", status: "completed", priority: "critical", dueDate: "2026-02-28", startDate: "2026-02-25",
    phase: "pre_launch", week: 1, dependencies: [], subtasks: [
      { id: "s-007a", title: "Import PA brand guidelines", completed: true },
      { id: "s-007b", title: "Organize product photography", completed: true },
      { id: "s-007c", title: "Create social templates", completed: true },
    ], notes: ["Asset library live at 247 items"], attachments: [],
  },
  {
    id: "d-008", title: "Social Content Calendar (Month 1)", description: "30-day content calendar across Instagram, TikTok, Twitter",
    agentId: "content", status: "in_progress", priority: "high", dueDate: "2026-03-05", startDate: "2026-02-26",
    phase: "pre_launch", week: 1, dependencies: ["d-007"], subtasks: [
      { id: "s-008a", title: "Draft Instagram grid strategy", completed: true },
      { id: "s-008b", title: "Plan TikTok content series", completed: true },
      { id: "s-008c", title: "Write copy for Week 1-2 posts", completed: false },
      { id: "s-008d", title: "Get creative director approval", completed: false },
    ], notes: [], attachments: [],
  },
  // Week 3-4: LAUNCH WEEK
  {
    id: "d-009", title: "NYC Launch Event Execution", description: "Flagship launch event in NYC — venue, catering, guest list, press",
    agentId: "events", status: "in_progress", priority: "critical", dueDate: "2026-03-14", startDate: "2026-02-25",
    phase: "launch_week", week: 3, dependencies: ["d-005", "d-008"], subtasks: [
      { id: "s-009a", title: "Secure venue (SoHo)", completed: true },
      { id: "s-009b", title: "Finalize guest list (250)", completed: false },
      { id: "s-009c", title: "Book DJ and entertainment", completed: true },
      { id: "s-009d", title: "Coordinate press arrivals", completed: false },
      { id: "s-009e", title: "Setup brand installation", completed: false },
    ], notes: ["Venue confirmed: Spring Studios, NYC"], attachments: [],
  },
  {
    id: "d-010", title: "LA Pop-Up Store (2 weeks)", description: "Temporary retail activation in LA — Melrose Ave concept",
    agentId: "events", status: "not_started", priority: "high", dueDate: "2026-03-21", startDate: "2026-03-07",
    phase: "launch_week", week: 4, dependencies: ["d-009"], subtasks: [
      { id: "s-010a", title: "Finalize Melrose Ave lease", completed: false },
      { id: "s-010b", title: "Design store layout/buildout", completed: false },
      { id: "s-010c", title: "Hire pop-up staff", completed: false },
      { id: "s-010d", title: "Plan opening event", completed: false },
    ], notes: [], attachments: [],
  },
  // Budget
  {
    id: "d-011", title: "Week 2 Budget Reconciliation", description: "Reconcile all spend against projections, flag variances",
    agentId: "budget", status: "in_progress", priority: "high", dueDate: "2026-03-07", startDate: "2026-03-06",
    phase: "pre_launch", week: 2, dependencies: [], subtasks: [
      { id: "s-011a", title: "Collect all invoices from vendors", completed: true },
      { id: "s-011b", title: "Update budget tracker", completed: false },
      { id: "s-011c", title: "Flag any overruns to orchestrator", completed: false },
    ], notes: [], attachments: [],
  },
  // Performance
  {
    id: "d-012", title: "Pre-Launch Baseline Report", description: "Establish baseline metrics before campaign activation",
    agentId: "performance", status: "completed", priority: "high", dueDate: "2026-02-28", startDate: "2026-02-25",
    phase: "pre_launch", week: 1, dependencies: [], subtasks: [
      { id: "s-012a", title: "Pull current social metrics", completed: true },
      { id: "s-012b", title: "Document competitor landscape", completed: true },
      { id: "s-012c", title: "Set benchmark targets", completed: true },
    ], notes: ["Baseline report delivered to all agents"], attachments: [],
  },
  // Week 5-8: SUSTAIN & OPTIMIZE
  {
    id: "d-013", title: "Influencer Wave 2 — Micro/UGC Campaign", description: "Activate 50 micro-influencers for UGC content blitz",
    agentId: "influencer", status: "not_started", priority: "medium", dueDate: "2026-04-01", startDate: "2026-03-18",
    phase: "sustain", week: 5, dependencies: ["d-005", "d-006"], subtasks: [
      { id: "s-013a", title: "Identify 50 micro creators", completed: false },
      { id: "s-013b", title: "Send product + brief kits", completed: false },
      { id: "s-013c", title: "Monitor and amplify top content", completed: false },
    ], notes: [], attachments: [],
  },
  {
    id: "d-014", title: "Miami Art Basel Activation Planning", description: "Plan experiential activation around Miami Art Basel",
    agentId: "events", status: "not_started", priority: "medium", dueDate: "2026-04-10", startDate: "2026-03-25",
    phase: "sustain", week: 6, dependencies: ["d-009", "d-010"], subtasks: [
      { id: "s-014a", title: "Secure Miami venue", completed: false },
      { id: "s-014b", title: "Design immersive brand experience", completed: false },
      { id: "s-014c", title: "Plan VIP guest list", completed: false },
    ], notes: [], attachments: [],
  },
  {
    id: "d-015", title: "Mid-Campaign Performance Review", description: "Comprehensive performance analysis at 30-day mark",
    agentId: "performance", status: "not_started", priority: "critical", dueDate: "2026-03-27", startDate: "2026-03-25",
    phase: "sustain", week: 5, dependencies: ["d-012"], subtasks: [
      { id: "s-015a", title: "Compile metrics across all channels", completed: false },
      { id: "s-015b", title: "Analyze ROI by agent area", completed: false },
      { id: "s-015c", title: "Generate optimization recommendations", completed: false },
    ], notes: [], attachments: [],
  },
  {
    id: "d-016", title: "DTC E-Commerce Launch", description: "Launch direct-to-consumer shop on playbypalmangels.com",
    agentId: "retail", status: "not_started", priority: "critical", dueDate: "2026-03-21", startDate: "2026-03-07",
    phase: "launch_week", week: 4, dependencies: ["d-003", "d-004"], subtasks: [
      { id: "s-016a", title: "Shopify store setup and theming", completed: false },
      { id: "s-016b", title: "Product upload and pricing", completed: false },
      { id: "s-016c", title: "Payment and shipping configuration", completed: false },
      { id: "s-016d", title: "QA and launch", completed: false },
    ], notes: [], attachments: [],
  },
  {
    id: "d-017", title: "Campaign Wrap Report & Phase 2 Proposal", description: "Final 60-day report with results, learnings, and Phase 2 recommendations",
    agentId: "orchestrator", status: "not_started", priority: "critical", dueDate: "2026-04-25", startDate: "2026-04-18",
    phase: "optimize", week: 8, dependencies: ["d-015"], subtasks: [
      { id: "s-017a", title: "Aggregate all agent reports", completed: false },
      { id: "s-017b", title: "Calculate total ROI", completed: false },
      { id: "s-017c", title: "Draft Phase 2 proposal", completed: false },
      { id: "s-017d", title: "Present to Palm Angels leadership", completed: false },
    ], notes: [], attachments: [],
  },
];

// ---- Timeline Events ----
export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "t-001", title: "Campaign Kickoff", date: "2026-02-25", type: "milestone", agentId: "orchestrator", status: "completed", description: "All agents initialized" },
  { id: "t-002", title: "Brand Asset Library Complete", date: "2026-02-28", type: "deliverable", agentId: "content", status: "completed" },
  { id: "t-003", title: "Baseline Metrics Report", date: "2026-02-28", type: "deliverable", agentId: "performance", status: "completed" },
  { id: "t-004", title: "Nordstrom Buyer Meeting", date: "2026-03-03", type: "meeting", agentId: "retail", status: "in_progress" },
  { id: "t-005", title: "Creator Outreach Wave 1 Complete", date: "2026-03-05", type: "deliverable", agentId: "influencer", status: "in_progress" },
  { id: "t-006", title: "Content Calendar Approved", date: "2026-03-05", type: "deliverable", agentId: "content", status: "in_progress" },
  { id: "t-007", title: "Celebrity Seeding Ships", date: "2026-03-10", type: "milestone", agentId: "influencer", status: "not_started" },
  { id: "t-008", title: "NYC Launch Event", date: "2026-03-14", type: "event", agentId: "events", status: "in_progress", description: "Spring Studios, SoHo" },
  { id: "t-009", title: "LA Pop-Up Opens", date: "2026-03-21", type: "event", agentId: "events", status: "not_started", description: "Melrose Ave, 2-week run" },
  { id: "t-010", title: "DTC Site Goes Live", date: "2026-03-21", type: "milestone", agentId: "retail", status: "not_started" },
  { id: "t-011", title: "Mid-Campaign Review", date: "2026-03-27", type: "deadline", agentId: "performance", status: "not_started" },
  { id: "t-012", title: "Micro-Influencer Wave 2", date: "2026-04-01", type: "milestone", agentId: "influencer", status: "not_started" },
  { id: "t-013", title: "Miami Activation", date: "2026-04-10", type: "event", agentId: "events", status: "not_started" },
  { id: "t-014", title: "Campaign Wrap & Phase 2 Proposal", date: "2026-04-25", type: "deadline", agentId: "orchestrator", status: "not_started" },
];

// ---- Budget Overview ----
export const BUDGET: BudgetOverview = {
  total: 1000000,
  spent: 287000,
  committed: 148000,
  remaining: 565000,
  byAgent: {
    orchestrator: { allocated: 80000, spent: 35000 },
    retail: { allocated: 150000, spent: 42000 },
    influencer: { allocated: 200000, spent: 68000 },
    content: { allocated: 180000, spent: 52000 },
    events: { allocated: 250000, spent: 48000 },
    budget: { allocated: 40000, spent: 12000 },
    performance: { allocated: 100000, spent: 30000 },
  },
};

// ---- Campaign ----
export const CAMPAIGN: Campaign = {
  id: "play-us-launch-2026",
  name: "PLAY by Palm Angels — U.S. Market Launch",
  client: "Palm Angels / New Guards Group",
  budget: BUDGET,
  startDate: "2026-02-25",
  endDate: "2026-04-25",
  currentPhase: "pre_launch",
  currentWeek: 1,
  totalWeeks: 8,
  healthScore: 82,
  agents: AGENT_DEFINITIONS,
  deliverables: DELIVERABLES,
};

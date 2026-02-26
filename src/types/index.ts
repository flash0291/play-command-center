// ============================================================
// PLAY Command Center — Core Types
// Campaign management for PLAY by Palm Angels U.S. Launch
// ============================================================

export type AgentId =
  | "orchestrator"
  | "retail"
  | "influencer"
  | "content"
  | "events"
  | "budget"
  | "performance";

export type AgentStatus = "idle" | "running" | "completed" | "error" | "waiting";
export type DeliverableStatus = "not_started" | "in_progress" | "in_review" | "completed" | "overdue" | "blocked";
export type Priority = "critical" | "high" | "medium" | "low";
export type SprintPhase = "pre_launch" | "launch_week" | "sustain" | "optimize";

export interface Agent {
  id: AgentId;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: AgentStatus;
  lastRun: string | null;
  activeTasks: number;
  completedTasks: number;
  totalTasks: number;
  kpis: KPI[];
}

export interface KPI {
  label: string;
  value: string | number;
  target: string | number;
  unit?: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  agentId: AgentId;
  status: DeliverableStatus;
  priority: Priority;
  dueDate: string;
  startDate: string;
  assignee?: string;
  phase: SprintPhase;
  week: number;
  dependencies: string[];
  subtasks: Subtask[];
  notes: string[];
  attachments: string[];
  completedAt?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  client: string;
  budget: BudgetOverview;
  startDate: string;
  endDate: string;
  currentPhase: SprintPhase;
  currentWeek: number;
  totalWeeks: number;
  healthScore: number; // 0-100
  agents: Agent[];
  deliverables: Deliverable[];
}

export interface BudgetOverview {
  total: number;
  spent: number;
  committed: number;
  remaining: number;
  byAgent: Record<AgentId, { allocated: number; spent: number }>;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  type: "milestone" | "deliverable" | "event" | "meeting" | "deadline";
  agentId: AgentId;
  status: DeliverableStatus;
  description?: string;
}

export interface AgentMessage {
  id: string;
  agentId: AgentId;
  type: "action" | "insight" | "alert" | "recommendation" | "status";
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  actions?: AgentAction[];
}

export interface AgentAction {
  id: string;
  label: string;
  type: "approve" | "reject" | "modify" | "escalate" | "defer";
}

export interface RetailPartner {
  id: string;
  name: string;
  type: "department_store" | "boutique" | "online" | "pop_up";
  status: "prospecting" | "negotiating" | "confirmed" | "live" | "declined";
  contactName: string;
  contactEmail: string;
  revenue: number;
  doors: number;
  region: string;
  notes: string;
}

export interface InfluencerProfile {
  id: string;
  name: string;
  handle: string;
  platform: "instagram" | "tiktok" | "youtube" | "twitter";
  followers: number;
  engagementRate: number;
  tier: "mega" | "macro" | "mid" | "micro" | "nano";
  status: "identified" | "outreach" | "negotiating" | "contracted" | "active" | "completed" | "declined";
  fee: number;
  deliverables: string[];
  niche: string[];
}

export interface ContentPiece {
  id: string;
  title: string;
  type: "social_post" | "video" | "photo_shoot" | "lookbook" | "press_release" | "email" | "ad_creative" | "story";
  platform: string;
  status: "ideation" | "production" | "review" | "approved" | "published" | "archived";
  scheduledDate?: string;
  publishedDate?: string;
  creator: string;
  metrics?: ContentMetrics;
}

export interface ContentMetrics {
  impressions: number;
  engagement: number;
  clicks: number;
  conversions: number;
  engagementRate: number;
}

export interface EventRecord {
  id: string;
  name: string;
  type: "launch_party" | "pop_up" | "showroom" | "press_preview" | "influencer_event" | "retail_activation";
  date: string;
  venue: string;
  city: string;
  budget: number;
  expectedAttendees: number;
  confirmedAttendees: number;
  status: "planning" | "confirmed" | "in_progress" | "completed" | "cancelled";
  vendors: string[];
}

export interface BudgetLineItem {
  id: string;
  category: string;
  agentId: AgentId;
  description: string;
  amount: number;
  spent: number;
  vendor?: string;
  invoiceStatus: "pending" | "submitted" | "approved" | "paid";
  date: string;
}

export interface PerformanceMetric {
  date: string;
  impressions: number;
  engagement: number;
  websiteTraffic: number;
  socialFollowers: number;
  revenue: number;
  mediaValue: number;
  sentimentScore: number;
}

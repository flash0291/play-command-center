"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useCampaignStore } from "@/store/campaign-store";
import { formatDistanceToNow } from "date-fns";
import {
  Inbox,
  CheckCheck,
  Circle,
  AlertTriangle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  ArrowUpRight,
  Bell,
  Filter,
  ShieldCheck,
  ListChecks,
  BotMessageSquare,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Agent colour map
// ---------------------------------------------------------------------------
const AGENT_COLORS: Record<string, string> = {
  orchestrator: "#6C63FF",
  retail: "#448AFF",
  influencer: "#9C27B0",
  content: "#FF6B6B",
  events: "#26C6DA",
  budget: "#66BB6A",
  performance: "#FF9800",
};

const AGENT_NAMES: Record<string, string> = {
  orchestrator: "Orchestrator",
  retail: "Retail Agent",
  influencer: "Influencer Agent",
  content: "Content Engine",
  events: "Events Agent",
  budget: "Budget Agent",
  performance: "Performance Agent",
};

// ---------------------------------------------------------------------------
// Local message type (super-set of store AgentMessage, with extra fields)
// ---------------------------------------------------------------------------
interface LocalMessage {
  id: string;
  agentId: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: "urgent" | "high" | "normal";
  type: "action" | "update" | "approval" | "notification";
  actions?: { id: string; label: string; type: "approve" | "reject" | "modify" | "escalate" }[];
}

// ---------------------------------------------------------------------------
// Hardcoded supplementary messages
// ---------------------------------------------------------------------------
const now = Date.now();
const SUPPLEMENTARY_MESSAGES: LocalMessage[] = [
  {
    id: "local-001",
    agentId: "influencer",
    content:
      "Discovered 12 new fashion creators from @emmachamberlain's latest post comments. 7 auto-DMs sent. 3 already qualified (score 75+).",
    timestamp: new Date(now - 1 * 3600000).toISOString(),
    read: false,
    priority: "normal",
    type: "update",
  },
  {
    id: "local-002",
    agentId: "performance",
    content:
      "Weekly engagement report: Average 4.8% across all contracted creators. Emma Chamberlain content drove 62% of total impressions.",
    timestamp: new Date(now - 3 * 3600000).toISOString(),
    read: false,
    priority: "normal",
    type: "notification",
  },
  {
    id: "local-003",
    agentId: "budget",
    content:
      "Influencer payment of $45,000 for Emma Chamberlain contract is due March 5. Funds available in campaign budget.",
    timestamp: new Date(now - 5 * 3600000).toISOString(),
    read: false,
    priority: "high",
    type: "approval",
    actions: [
      { id: "la-001", label: "Approve Payment", type: "approve" },
      { id: "la-002", label: "Defer", type: "modify" },
    ],
  },
  {
    id: "local-004",
    agentId: "events",
    content:
      "Miami pop-up venue (Wynwood Walls) confirmed for March 15. Deposit of $12,000 processed. Need final headcount by March 8.",
    timestamp: new Date(now - 8 * 3600000).toISOString(),
    read: true,
    priority: "high",
    type: "action",
    actions: [
      { id: "la-003", label: "Submit Headcount", type: "approve" },
      { id: "la-004", label: "Escalate to Team", type: "escalate" },
    ],
  },
  {
    id: "local-005",
    agentId: "content",
    content:
      "3 content pieces pending review: Wisdom Kaye lookbook (draft), SSENSE editorial (in production), Launch teaser reel (ready for approval).",
    timestamp: new Date(now - 12 * 3600000).toISOString(),
    read: false,
    priority: "urgent",
    type: "approval",
    actions: [
      { id: "la-005", label: "Review Now", type: "approve" },
      { id: "la-006", label: "Delegate", type: "modify" },
    ],
  },
  {
    id: "local-006",
    agentId: "orchestrator",
    content:
      "Campaign velocity is 15% ahead of schedule. All agents are operating within parameters. No blockers detected.",
    timestamp: new Date(now - 20 * 3600000).toISOString(),
    read: true,
    priority: "normal",
    type: "notification",
  },
];

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------
const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "action", label: "Actions Required" },
  { id: "update", label: "Agent Updates" },
  { id: "approval", label: "Approvals" },
  { id: "notification", label: "Notifications" },
] as const;

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function MessagesPage() {
  const { messages: storeMessages, markMessageRead, sidebarOpen } = useCampaignStore();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>(SUPPLEMENTARY_MESSAGES);

  // ---- Normalise store messages into LocalMessage shape ----
  const normalisedStoreMessages: LocalMessage[] = storeMessages.map((m) => ({
    id: m.id,
    agentId: m.agentId,
    content: m.content,
    timestamp: m.timestamp,
    read: m.read,
    priority: m.actionRequired ? "high" : "normal",
    type: m.type === "action" || m.type === "recommendation"
      ? "action"
      : m.type === "alert"
        ? "approval"
        : m.type === "insight"
          ? "update"
          : "notification",
    actions: m.actions?.map((a) => ({
      id: a.id,
      label: a.label,
      type: a.type as "approve" | "reject" | "modify" | "escalate",
    })),
  }));

  // ---- Merge & sort by timestamp descending ----
  const allMessages = [...normalisedStoreMessages, ...localMessages].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // ---- Apply filter ----
  const filteredMessages =
    activeFilter === "all"
      ? allMessages
      : allMessages.filter((m) => m.type === activeFilter);

  // ---- Counts ----
  const unreadCount = allMessages.filter((m) => !m.read).length;
  const pendingApprovals = allMessages.filter((m) => m.type === "approval" && !m.read).length;
  const overdueItems = allMessages.filter((m) => m.priority === "urgent").length;
  const agentRequests = allMessages.filter((m) => m.type === "action" && !m.read).length;

  // ---- Handlers ----
  function handleClickMessage(msg: LocalMessage) {
    // Mark read in store if it came from there
    const isStoreMsg = storeMessages.some((s) => s.id === msg.id);
    if (isStoreMsg) {
      markMessageRead(msg.id);
    } else {
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
      );
    }
  }

  function handleAction(msg: LocalMessage, actionType: string) {
    handleClickMessage(msg);
    // In a real app this would dispatch an action — here we just mark read
    void actionType;
  }

  function handleMarkAllRead() {
    storeMessages.forEach((m) => {
      if (!m.read) markMessageRead(m.id);
    });
    setLocalMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  }

  // ---- Priority helpers ----
  function priorityDot(priority: string) {
    if (priority === "urgent") return "bg-red-500";
    if (priority === "high") return "bg-orange-400";
    return "bg-gray-500";
  }

  function priorityLabel(priority: string) {
    if (priority === "urgent") return "text-red-400";
    if (priority === "high") return "text-orange-400";
    return "text-muted";
  }

  function actionButtonStyle(type: string) {
    switch (type) {
      case "approve":
        return "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border-emerald-600/30";
      case "reject":
        return "bg-red-600/20 text-red-400 hover:bg-red-600/30 border-red-600/30";
      case "modify":
        return "bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 border-amber-600/30";
      case "escalate":
        return "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border-purple-600/30";
      default:
        return "bg-white/5 text-gray-400 hover:bg-white/10 border-white/10";
    }
  }

  function actionIcon(type: string) {
    switch (type) {
      case "approve":
        return <ThumbsUp size={12} />;
      case "reject":
        return <ThumbsDown size={12} />;
      case "modify":
        return <Pencil size={12} />;
      case "escalate":
        return <ArrowUpRight size={12} />;
      default:
        return null;
    }
  }

  // ---- Render ----
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-[72px]"
        }`}
      >
        <Header />
        <main className="p-6 space-y-6">
          {/* ------- Inbox Header ------- */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Inbox size={20} className="text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Messages &amp; Actions</h1>
                <p className="text-xs text-muted">
                  Agent communications, approvals, and notifications
                </p>
              </div>
              {unreadCount > 0 && (
                <span className="ml-2 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-accent/20 text-accent">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-border transition-colors"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          </div>

          {/* ------- Filter Tabs ------- */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-border w-fit">
            <Filter size={14} className="text-muted ml-2 mr-1" />
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeFilter === tab.id
                    ? "bg-accent text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ------- Two-Column Layout ------- */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* ---- Message List ---- */}
            <div className="space-y-3">
              {filteredMessages.length === 0 && (
                <div className="rounded-xl bg-card border border-border p-12 text-center">
                  <Bell size={32} className="mx-auto mb-3 text-muted" />
                  <p className="text-sm text-muted">No messages match this filter.</p>
                </div>
              )}
              {filteredMessages.map((msg) => {
                const color = AGENT_COLORS[msg.agentId] || "#888";
                const agentName = AGENT_NAMES[msg.agentId] || msg.agentId;
                const initials = agentName.charAt(0).toUpperCase();

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleClickMessage(msg)}
                    className="relative rounded-xl bg-card/60 backdrop-blur border border-border hover:border-white/10 transition-all cursor-pointer group"
                    style={{
                      borderLeftWidth: msg.read ? undefined : "3px",
                      borderLeftColor: msg.read ? undefined : color,
                    }}
                  >
                    <div className="p-4 flex gap-4">
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{ backgroundColor: color + "30", color }}
                      >
                        {initials}
                      </div>

                      {/* Body */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        {/* Top row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="text-sm font-semibold truncate"
                              style={{ color }}
                            >
                              {agentName}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${priorityLabel(
                                msg.priority
                              )}`}
                            >
                              {msg.priority !== "normal" ? msg.priority : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[11px] text-muted whitespace-nowrap">
                              {formatDistanceToNow(new Date(msg.timestamp), {
                                addSuffix: true,
                              })}
                            </span>
                            {!msg.read && (
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${priorityDot(
                                  msg.priority
                                )} flex-shrink-0`}
                              />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <p
                          className={`text-sm leading-relaxed ${
                            msg.read ? "text-muted" : "text-gray-300"
                          }`}
                        >
                          {msg.content}
                        </p>

                        {/* Actions */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1.5">
                            {msg.actions.map((action) => (
                              <button
                                key={action.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(msg, action.type);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${actionButtonStyle(
                                  action.type
                                )}`}
                              >
                                {actionIcon(action.type)}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---- Quick Actions Panel (right side) ---- */}
            <div className="space-y-4">
              <div className="rounded-xl bg-card/60 backdrop-blur border border-border p-5 space-y-5">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <ListChecks size={16} className="text-accent" />
                  Quick Actions
                </h3>

                {/* Pending Approvals */}
                <button
                  onClick={() => setActiveFilter("approval")}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-border transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <ShieldCheck size={16} className="text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-200 group-hover:text-white">
                        Pending Approvals
                      </p>
                      <p className="text-[11px] text-muted">Needs your sign-off</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-400">
                    {pendingApprovals}
                  </span>
                </button>

                {/* Overdue Items */}
                <button
                  onClick={() => setActiveFilter("action")}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-border transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle size={16} className="text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-200 group-hover:text-white">
                        Overdue Items
                      </p>
                      <p className="text-[11px] text-muted">Requires immediate attention</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-red-400">{overdueItems}</span>
                </button>

                {/* Agent Requests */}
                <button
                  onClick={() => setActiveFilter("action")}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-border transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
                      <BotMessageSquare size={16} className="text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-200 group-hover:text-white">
                        Agent Requests
                      </p>
                      <p className="text-[11px] text-muted">Action items from agents</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-accent">{agentRequests}</span>
                </button>
              </div>

              {/* Recent Activity Summary */}
              <div className="rounded-xl bg-card/60 backdrop-blur border border-border p-5 space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Clock size={16} className="text-muted" />
                  Activity Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Messages today</span>
                    <span className="font-medium text-gray-300">
                      {
                        allMessages.filter(
                          (m) =>
                            new Date(m.timestamp).getTime() > now - 24 * 3600000
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Unread</span>
                    <span className="font-medium text-gray-300">{unreadCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Actions pending</span>
                    <span className="font-medium text-gray-300">
                      {allMessages.filter((m) => m.actions && m.actions.length > 0 && !m.read).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Read rate</span>
                    <span className="font-medium text-gray-300">
                      {allMessages.length > 0
                        ? Math.round(
                            (allMessages.filter((m) => m.read).length /
                              allMessages.length) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Agent Status Legend */}
              <div className="rounded-xl bg-card/60 backdrop-blur border border-border p-5 space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Circle size={14} className="text-muted" />
                  Agent Legend
                </h3>
                <div className="space-y-2">
                  {Object.entries(AGENT_NAMES).map(([agentId, name]) => (
                    <div key={agentId} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: AGENT_COLORS[agentId] }}
                      />
                      <span className="text-gray-400">{name}</span>
                      <span className="ml-auto text-muted">
                        {allMessages.filter((m) => m.agentId === agentId).length} msgs
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

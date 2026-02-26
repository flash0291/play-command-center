"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AgentDetail } from "@/components/agents/agent-detail";
import { useCampaignStore } from "@/store/campaign-store";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { getAgentColor, getAgentName } from "@/agents/engine";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Search } from "lucide-react";
import { AgentId, DeliverableStatus } from "@/types";

export default function DeliverablesPage() {
  const { sidebarOpen, selectedAgent, deliverables } = useCampaignStore();
  const [filterAgent, setFilterAgent] = useState<AgentId | "all">("all");
  const [filterStatus, setFilterStatus] = useState<DeliverableStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = deliverables.filter((d) => {
    if (filterAgent !== "all" && d.agentId !== filterAgent) return false;
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const agentIds: AgentId[] = ["orchestrator", "retail", "influencer", "content", "events", "budget", "performance"];
  const statuses: DeliverableStatus[] = ["not_started", "in_progress", "in_review", "completed", "overdue", "blocked"];

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-[72px]"}`}>
        <Header />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">All Deliverables</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 w-48"
                />
              </div>
              <select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value as AgentId | "all")}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
              >
                <option value="all">All Agents</option>
                {agentIds.map((id) => (
                  <option key={id} value={id}>{getAgentName(id)}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as DeliverableStatus | "all")}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
              >
                <option value="all">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {sorted.map((d) => {
              const done = d.subtasks.filter((s) => s.completed).length;
              const total = d.subtasks.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const agentColor = getAgentColor(d.agentId);

              return (
                <div key={d.id} className="bg-card border border-border rounded-xl p-5 hover:border-white/10 transition-colors animate-slide-up">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: `${agentColor}15`, color: agentColor }}
                        >
                          {getAgentName(d.agentId)}
                        </span>
                        <span className="text-[10px] text-muted uppercase tracking-wide">
                          Week {d.week} &middot; {d.phase.replace(/_/g, " ")}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold mb-1">{d.title}</h3>
                      <p className="text-xs text-muted">{d.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <PriorityBadge priority={d.priority} />
                      <StatusBadge status={d.status} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span>Start: {format(parseISO(d.startDate), "MMM d")}</span>
                      <span>Due: {format(parseISO(d.dueDate), "MMM d")}</span>
                      {d.dependencies.length > 0 && (
                        <span>{d.dependencies.length} dependencies</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#22C55E" : agentColor }} />
                      </div>
                      <span className="text-[10px] text-muted">{done}/{total}</span>
                    </div>
                  </div>

                  {/* Subtasks */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {d.subtasks.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-2 text-xs">
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                          sub.completed ? "bg-green-500/20 border-green-500/40 text-green-400" : "border-border"
                        }`}>
                          {sub.completed && <span className="text-[8px]">{"\u2713"}</span>}
                        </span>
                        <span className={sub.completed ? "text-muted line-through" : "text-gray-300"}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      {selectedAgent && <AgentDetail />}
    </div>
  );
}

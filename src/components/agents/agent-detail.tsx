"use client";

import { useCampaignStore } from "@/store/campaign-store";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { KPICard } from "@/components/ui/kpi-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { format, parseISO } from "date-fns";
import {
  X, Brain, Store, Users, Palette, CalendarDays, DollarSign, BarChart3,
  Send,
} from "lucide-react";
import { useState } from "react";

const ICONS: Record<string, React.ElementType> = {
  Brain, Store, Users, Palette, CalendarDays, DollarSign, BarChart3,
};

export function AgentDetail() {
  const { selectedAgent, setSelectedAgent, agents, getAgentDeliverables, getAgentMessages } = useCampaignStore();
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "deliverables" | "feed" | "chat">("overview");

  if (!selectedAgent) return null;

  const agent = agents.find((a) => a.id === selectedAgent);
  if (!agent) return null;

  const Icon = ICONS[agent.icon] || Brain;
  const deliverables = getAgentDeliverables(selectedAgent);
  const agentMessages = getAgentMessages(selectedAgent);
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "deliverables", label: `Deliverables (${deliverables.length})` },
    { id: "feed", label: `Feed (${agentMessages.length})` },
    { id: "chat", label: "Chat" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAgent(null)} />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-border overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agent.color}15` }}>
                <Icon size={20} style={{ color: agent.color }} />
              </div>
              <div>
                <h2 className="text-lg font-bold">{agent.name}</h2>
                <StatusBadge status={agent.status} />
              </div>
            </div>
            <button onClick={() => setSelectedAgent(null)} className="p-2 rounded-lg hover:bg-white/5">
              <X size={18} className="text-muted" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id ? "bg-white/10 text-white" : "text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              {/* Description */}
              <p className="text-sm text-muted leading-relaxed">{agent.description}</p>

              {/* Progress */}
              <div className="flex items-center gap-6">
                <ProgressRing value={agent.completedTasks} max={agent.totalTasks} size={100} strokeWidth={8} color={agent.color} label="Complete" />
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted">Active:</span>
                    <span className="font-medium">{agent.activeTasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted">Completed:</span>
                    <span className="font-medium text-green-400">{agent.completedTasks}/{agent.totalTasks}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted">Last Run:</span>
                    <span className="font-medium">{agent.lastRun ? format(parseISO(agent.lastRun), "MMM d, h:mm a") : "Never"}</span>
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  {agent.kpis.map((kpi) => (
                    <KPICard key={kpi.label} kpi={kpi} color={agent.color} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "deliverables" && (
            <div className="space-y-3 animate-fade-in">
              {deliverables.map((d) => {
                const done = d.subtasks.filter((s) => s.completed).length;
                return (
                  <div key={d.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold">{d.title}</h4>
                        <p className="text-xs text-muted mt-0.5">{d.description}</p>
                      </div>
                      <PriorityBadge priority={d.priority} />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <StatusBadge status={d.status} />
                      <span className="text-xs text-muted">Due {format(parseISO(d.dueDate), "MMM d")}</span>
                    </div>
                    {/* Subtasks */}
                    <div className="space-y-1.5">
                      {d.subtasks.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2 text-xs">
                          <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            sub.completed ? "bg-green-500/20 border-green-500/40 text-green-400" : "border-border"
                          }`}>
                            {sub.completed && <span className="text-[10px]">{"\u2713"}</span>}
                          </span>
                          <span className={sub.completed ? "text-muted line-through" : "text-gray-300"}>{sub.title}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.subtasks.length > 0 ? (done / d.subtasks.length) * 100 : 0}%`, backgroundColor: agent.color }} />
                      </div>
                      <span className="text-[10px] text-muted">{done}/{d.subtasks.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "feed" && (
            <div className="space-y-3 animate-fade-in">
              {agentMessages.length === 0 ? (
                <p className="text-sm text-muted text-center py-8">No messages from this agent yet.</p>
              ) : (
                agentMessages.map((msg) => (
                  <div key={msg.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-wide text-muted">{msg.type}</span>
                      <span className="text-[10px] text-muted">{format(parseISO(msg.timestamp), "MMM d, h:mm a")}</span>
                    </div>
                    <h4 className="text-sm font-semibold">{msg.title}</h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{msg.content}</p>
                    {msg.actions && (
                      <div className="flex gap-2 mt-3">
                        {msg.actions.map((a) => (
                          <button key={a.id} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors">
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="animate-fade-in">
              <div className="bg-card border border-border rounded-xl p-6 text-center mb-4">
                <Icon size={32} style={{ color: agent.color }} className="mx-auto mb-3" />
                <h4 className="text-sm font-semibold mb-1">Chat with {agent.name}</h4>
                <p className="text-xs text-muted">Ask questions, request analysis, or give instructions.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask ${agent.name.split(" ")[0]}...`}
                  className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
                <button className="p-3 bg-accent hover:bg-accent/90 rounded-lg transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

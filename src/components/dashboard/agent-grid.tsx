"use client";

import { useCampaignStore } from "@/store/campaign-store";
import { Agent } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  Brain, Store, Users, Palette, CalendarDays, DollarSign, BarChart3,
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  Brain, Store, Users, Palette, CalendarDays, DollarSign, BarChart3,
};

function AgentCard({ agent }: { agent: Agent }) {
  const { setSelectedAgent } = useCampaignStore();
  const Icon = ICONS[agent.icon] || Brain;
  return (
    <button
      onClick={() => setSelectedAgent(agent.id)}
      className="bg-card border border-border rounded-xl p-5 hover:border-white/10 transition-all group text-left animate-slide-up"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${agent.color}15` }}
          >
            <Icon size={20} style={{ color: agent.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold group-hover:text-white transition-colors">
              {agent.name}
            </h3>
            <StatusBadge status={agent.status} />
          </div>
        </div>
        <ProgressRing
          value={agent.completedTasks}
          max={agent.totalTasks}
          size={48}
          strokeWidth={4}
          color={agent.color}
        />
      </div>

      <p className="text-xs text-muted line-clamp-2 mb-4">{agent.description}</p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-muted">
            <span className="text-white font-medium">{agent.activeTasks}</span> active
          </span>
          <span className="text-muted">
            <span className="text-green-400 font-medium">{agent.completedTasks}</span>/{agent.totalTasks}
          </span>
        </div>
        <span className="text-muted opacity-0 group-hover:opacity-100 transition-opacity">
          View details &rarr;
        </span>
      </div>
    </button>
  );
}

export function AgentGrid() {
  const { agents } = useCampaignStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Agent Status</h3>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full status-running" /> Running
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full status-waiting" /> Waiting
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full status-idle" /> Idle
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

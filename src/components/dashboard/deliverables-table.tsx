"use client";

import { useCampaignStore } from "@/store/campaign-store";
import { StatusBadge, PriorityBadge } from "@/components/ui/status-badge";
import { getAgentColor, getAgentName } from "@/agents/engine";
import { format, parseISO } from "date-fns";
import { ChevronRight } from "lucide-react";

export function DeliverablesTable() {
  const { deliverables } = useCampaignStore();

  // Sort: overdue first, then by due date
  const sorted = [...deliverables].sort((a, b) => {
    const now = new Date();
    const aOverdue = a.status !== "completed" && new Date(a.dueDate) < now;
    const bOverdue = b.status !== "completed" && new Date(b.dueDate) < now;
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Deliverables</h3>
        <a href="/deliverables" className="text-xs text-accent hover:text-accent/80 flex items-center gap-1">
          View All <ChevronRight size={12} />
        </a>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="text-left px-4 py-3 font-medium">Deliverable</th>
              <th className="text-left px-4 py-3 font-medium">Agent</th>
              <th className="text-left px-4 py-3 font-medium">Priority</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Due</th>
              <th className="text-left px-4 py-3 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 8).map((d) => {
              const totalSubs = d.subtasks.length;
              const doneSubs = d.subtasks.filter((s) => s.completed).length;
              const pct = totalSubs > 0 ? Math.round((doneSubs / totalSubs) * 100) : 0;
              const agentColor = getAgentColor(d.agentId);

              return (
                <tr
                  key={d.id}
                  className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-[10px] text-muted mt-0.5 line-clamp-1">{d.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${agentColor}15`, color: agentColor }}
                    >
                      {getAgentName(d.agentId).split(" ")[0]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={d.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted">
                      {format(parseISO(d.dueDate), "MMM d")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: pct === 100 ? "#22C55E" : agentColor,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted">{doneSubs}/{totalSubs}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

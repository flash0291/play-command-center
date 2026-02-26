"use client";

import { useCampaignStore } from "@/store/campaign-store";
import { AGENT_DEFINITIONS } from "@/lib/agents";

export function BudgetChart() {
  const { campaign } = useCampaignStore();
  const budget = campaign.budget;
  const totalSpentPct = Math.round((budget.spent / budget.total) * 100);
  const committedPct = Math.round((budget.committed / budget.total) * 100);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Budget Allocation</h3>
        <span className="text-xs text-muted">${(budget.total / 1000).toFixed(0)}K total</span>
      </div>

      {/* Overall bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted">Total Burn</span>
          <span>
            <span className="text-green-400 font-medium">${(budget.spent / 1000).toFixed(0)}K</span>
            <span className="text-muted"> spent</span>
            <span className="text-yellow-400 font-medium ml-2">${(budget.committed / 1000).toFixed(0)}K</span>
            <span className="text-muted"> committed</span>
          </span>
        </div>
        <div className="h-3 bg-border rounded-full overflow-hidden flex">
          <div
            className="h-full bg-green-500 transition-all duration-1000"
            style={{ width: `${totalSpentPct}%` }}
          />
          <div
            className="h-full bg-yellow-500/50 transition-all duration-1000"
            style={{ width: `${committedPct}%` }}
          />
        </div>
      </div>

      {/* Per-agent breakdown */}
      <div className="space-y-3">
        {AGENT_DEFINITIONS.map((agent) => {
          const agentBudget = budget.byAgent[agent.id];
          if (!agentBudget) return null;
          const pct = Math.round((agentBudget.spent / agentBudget.allocated) * 100);
          return (
            <div key={agent.id}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                  <span className="text-gray-300">{agent.name.split(" ").slice(0, 2).join(" ")}</span>
                </div>
                <span className="text-muted">
                  ${(agentBudget.spent / 1000).toFixed(0)}K / ${(agentBudget.allocated / 1000).toFixed(0)}K
                  <span className="ml-1 text-[10px]">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: pct > 90 ? "#EF4444" : pct > 70 ? "#F59E0B" : agent.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

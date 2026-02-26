"use client";

import { useCampaignStore } from "@/store/campaign-store";
import { TrendingUp, CheckCircle2, AlertTriangle, Clock, DollarSign, Target } from "lucide-react";

export function StatsRow() {
  const { campaign, getStats } = useCampaignStore();
  const stats = getStats();
  const budget = campaign.budget;

  const cards = [
    {
      label: "Sprint Progress",
      value: `Week ${campaign.currentWeek}`,
      sub: `of ${campaign.totalWeeks} weeks`,
      icon: Clock,
      color: "#6366F1",
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
    {
      label: "Deliverables Done",
      value: `${stats.completed}/${stats.totalDeliverables}`,
      sub: `${stats.completionRate}% complete`,
      icon: CheckCircle2,
      color: "#22C55E",
      bgColor: "rgba(34, 197, 94, 0.1)",
    },
    {
      label: "In Progress",
      value: stats.inProgress.toString(),
      sub: `${stats.blocked} blocked`,
      icon: TrendingUp,
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      label: "Budget Spent",
      value: `$${Math.round(budget.spent / 1000)}K`,
      sub: `of $${Math.round(budget.total / 1000)}K (${Math.round((budget.spent / budget.total) * 100)}%)`,
      icon: DollarSign,
      color: "#22C55E",
      bgColor: "rgba(34, 197, 94, 0.1)",
    },
    {
      label: "Health Score",
      value: campaign.healthScore.toString(),
      sub: "/100",
      icon: Target,
      color: campaign.healthScore >= 80 ? "#22C55E" : campaign.healthScore >= 60 ? "#F59E0B" : "#EF4444",
      bgColor: campaign.healthScore >= 80 ? "rgba(34, 197, 94, 0.1)" : campaign.healthScore >= 60 ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
    },
    {
      label: "Actions Needed",
      value: useCampaignStore.getState().messages.filter((m) => m.actionRequired && !m.read).length.toString(),
      sub: "pending review",
      icon: AlertTriangle,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card border border-border rounded-xl p-4 hover:border-white/10 transition-colors animate-slide-up"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-muted uppercase tracking-wider">{card.label}</span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: card.bgColor }}
            >
              <card.icon size={16} style={{ color: card.color }} />
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: card.color }}>
            {card.value}
          </p>
          <p className="text-xs text-muted mt-0.5">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}

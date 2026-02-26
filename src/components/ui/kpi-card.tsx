"use client";

import { KPI } from "@/types";

export function KPICard({ kpi, color }: { kpi: KPI; color?: string }) {
  const trendColor = kpi.trend === "up" ? "text-green-400" : kpi.trend === "down" ? "text-red-400" : "text-gray-400";
  const trendIcon = kpi.trend === "up" ? "\u2191" : kpi.trend === "down" ? "\u2193" : "\u2192";

  return (
    <div className="bg-card rounded-xl p-4 border border-border hover:border-border/80 transition-colors">
      <p className="text-xs text-muted mb-1">{kpi.label}</p>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold" style={{ color: color ?? "#fff" }}>
            {kpi.value}
          </span>
          {kpi.unit && <span className="text-xs text-muted">{kpi.unit}</span>}
        </div>
        {kpi.trendValue && (
          <span className={`text-xs font-medium ${trendColor}`}>
            {trendIcon} {kpi.trendValue}
          </span>
        )}
      </div>
      <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${Math.min((parseFloat(String(kpi.value).replace(/[^0-9.]/g, "")) / parseFloat(String(kpi.target).replace(/[^0-9.]/g, ""))) * 100, 100)}%`,
            backgroundColor: color ?? "#6366F1",
          }}
        />
      </div>
    </div>
  );
}

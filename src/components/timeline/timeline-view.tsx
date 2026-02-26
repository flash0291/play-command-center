"use client";

import { useCampaignStore } from "@/store/campaign-store";
import { getAgentColor } from "@/agents/engine";
import { StatusBadge } from "@/components/ui/status-badge";
import { format, differenceInDays, parseISO } from "date-fns";
import { Milestone, CalendarDays, Flag, Users, Clock } from "lucide-react";

const TYPE_ICONS: Record<string, React.ElementType> = {
  milestone: Milestone,
  deliverable: Flag,
  event: CalendarDays,
  meeting: Users,
  deadline: Clock,
};

export function TimelineView() {
  const { timeline, campaign } = useCampaignStore();
  const startDate = parseISO(campaign.startDate);
  const endDate = parseISO(campaign.endDate);
  const totalDays = differenceInDays(endDate, startDate);
  const today = new Date();
  const daysSinceStart = differenceInDays(today, startDate);
  const progressPct = Math.min(Math.max((daysSinceStart / totalDays) * 100, 0), 100);

  const sorted = [...timeline].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group by phase
  const phases = [
    { id: "pre_launch", label: "Pre-Launch", weeks: "Week 1-2", start: 0, end: 23 },
    { id: "launch_week", label: "Launch Week", weeks: "Week 3-4", start: 23, end: 47 },
    { id: "sustain", label: "Sustain", weeks: "Week 5-6", start: 47, end: 73 },
    { id: "optimize", label: "Optimize", weeks: "Week 7-8", start: 73, end: 100 },
  ];

  return (
    <div>
      {/* Progress Bar */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">60-Day Sprint Progress</h3>
          <span className="text-xs text-muted">
            Day {Math.max(daysSinceStart, 0)} of {totalDays}
          </span>
        </div>
        <div className="relative">
          <div className="h-8 bg-border rounded-lg overflow-hidden flex">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="h-full border-r border-background/50 flex items-center justify-center text-[10px] font-medium"
                style={{
                  width: `${phase.end - phase.start}%`,
                  backgroundColor:
                    phase.id === campaign.currentPhase
                      ? "rgba(99, 102, 241, 0.2)"
                      : "transparent",
                }}
              >
                <span className="text-muted">{phase.label}</span>
              </div>
            ))}
          </div>
          {/* Today marker */}
          <div
            className="absolute top-0 h-8 w-0.5 bg-accent z-10"
            style={{ left: `${progressPct}%` }}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-[10px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
              Today
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {sorted.map((event, i) => {
            const Icon = TYPE_ICONS[event.type] || Flag;
            const color = getAgentColor(event.agentId);
            const eventDate = parseISO(event.date);
            const isPast = eventDate < today;
            const isToday = format(eventDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

            return (
              <div key={event.id} className="relative pl-14 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                {/* Dot on timeline */}
                <div
                  className={`absolute left-[18px] w-4 h-4 rounded-full border-2 border-background flex items-center justify-center ${
                    isToday ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""
                  }`}
                  style={{ backgroundColor: isPast ? color : `${color}40`, top: "8px" }}
                >
                  {event.status === "completed" && (
                    <span className="text-[8px] text-white font-bold">{"\u2713"}</span>
                  )}
                </div>

                <div className={`bg-card border border-border rounded-xl p-4 hover:border-white/10 transition-colors ${
                  isPast ? "opacity-70" : ""
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon size={14} style={{ color }} />
                      <span className="text-xs font-medium" style={{ color }}>
                        {event.type.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={event.status} />
                      <span className="text-xs text-muted">{format(eventDate, "MMM d")}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold">{event.title}</h4>
                  {event.description && (
                    <p className="text-xs text-muted mt-1">{event.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

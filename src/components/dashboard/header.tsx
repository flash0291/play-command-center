"use client";

import { useCampaignStore } from "@/store/campaign-store";
import { Bell, Search, Zap, Loader2 } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { campaign, messages, generateBrief, briefLoading, getStats } = useCampaignStore();
  const unread = messages.filter((m) => !m.read).length;
  const actionRequired = messages.filter((m) => m.actionRequired && !m.read).length;
  const stats = getStats();

  const phaseLabels: Record<string, string> = {
    pre_launch: "Pre-Launch",
    launch_week: "Launch Week",
    sustain: "Sustain",
    optimize: "Optimize",
  };

  const handleRunBrief = () => {
    if (!briefLoading) {
      generateBrief("morning");
    }
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-bold">Command Center</h2>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Week {campaign.currentWeek}/{campaign.totalWeeks}</span>
            <span className="text-border">|</span>
            <span className="text-accent">{phaseLabels[campaign.currentPhase] || campaign.currentPhase}</span>
            <span className="text-border">|</span>
            <span>Health: {stats.healthScore}/100</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search deliverables..."
            className="bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 w-64"
          />
        </div>

        {/* Run Brief */}
        <button
          onClick={handleRunBrief}
          disabled={briefLoading}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
        >
          {briefLoading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          {briefLoading ? "Generating..." : "Run Brief"}
        </button>

        {/* Notifications */}
        <Link href="/messages" className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell size={18} className="text-gray-400" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger rounded-full text-[10px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </Link>

        {/* Action Required */}
        {actionRequired > 0 && (
          <Link href="/messages" className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-lg hover:bg-warning/15 transition-colors">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse-dot" />
            <span className="text-xs text-warning font-medium">{actionRequired} actions needed</span>
          </Link>
        )}
      </div>
    </header>
  );
}

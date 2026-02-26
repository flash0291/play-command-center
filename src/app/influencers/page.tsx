"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useCRMStore } from "@/store/crm-store";
import { InfluencerStage } from "@/types/crm";
import {
  Search, Users,
  TrendingUp, Bot, Send, Eye, MessageCircle, Star,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const STAGE_LABELS: Record<InfluencerStage, { label: string; color: string }> = {
  discovered: { label: "Discovered", color: "#6B7280" },
  researching: { label: "Researching", color: "#8B5CF6" },
  qualified: { label: "Qualified", color: "#3B82F6" },
  outreach_sent: { label: "Outreach Sent", color: "#F59E0B" },
  responded: { label: "Responded", color: "#22C55E" },
  negotiating: { label: "Negotiating", color: "#EC4899" },
  contracted: { label: "Contracted", color: "#14B8A6" },
  onboarded: { label: "Onboarded", color: "#6366F1" },
  active: { label: "Active", color: "#22C55E" },
  content_live: { label: "Content Live", color: "#10B981" },
  completed: { label: "Completed", color: "#6B7280" },
  declined: { label: "Declined", color: "#EF4444" },
  unresponsive: { label: "Unresponsive", color: "#9CA3AF" },
};

const TIER_COLORS: Record<string, string> = {
  mega: "#EF4444", macro: "#F59E0B", mid: "#3B82F6", micro: "#22C55E", nano: "#6B7280",
};

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export default function InfluencersPage() {
  const {
    stageFilter, sourceFilter, searchQuery,
    setStageFilter, setSourceFilter, setSearchQuery,
    getFilteredInfluencers, getPipelineStats, getStageCount,
  } = useCRMStore();

  const filtered = getFilteredInfluencers();
  const stats = getPipelineStats();

  const stages: InfluencerStage[] = [
    "discovered", "researching", "qualified", "outreach_sent",
    "responded", "negotiating", "contracted", "onboarded", "active", "content_live", "completed",
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Header />
        <main className="p-6 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            {[
              { label: "Total Pipeline", value: stats.total, icon: Users, color: "#6366F1" },
              { label: "Discovered Today", value: stats.totalDiscoveredToday, icon: Bot, color: "#8B5CF6" },
              { label: "Outreach Sent", value: stats.outreachSent, icon: Send, color: "#F59E0B" },
              { label: "Responded", value: stats.responded, icon: MessageCircle, color: "#22C55E" },
              { label: "Contracted", value: stats.contracted, icon: Star, color: "#14B8A6" },
              { label: "Active Creators", value: stats.active, icon: Zap, color: "#EC4899" },
              { label: "Response Rate", value: `${stats.responseRate}%`, icon: TrendingUp, color: "#3B82F6" },
              { label: "Scrapers Live", value: stats.scrapersRunning, icon: Eye, color: "#EF4444" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted uppercase tracking-wider">{stat.label}</span>
                  <stat.icon size={14} style={{ color: stat.color }} />
                </div>
                <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Pipeline Funnel */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Autonomous Pipeline Funnel</h3>
            <div className="flex items-end gap-1">
              {stages.map((stage) => {
                const count = getStageCount(stage);
                const maxCount = Math.max(...stages.map((s) => getStageCount(s)), 1);
                const height = Math.max((count / maxCount) * 120, 8);
                const stageInfo = STAGE_LABELS[stage];
                const isActive = stageFilter === stage;

                return (
                  <button
                    key={stage}
                    onClick={() => setStageFilter(isActive ? "all" : stage)}
                    className={`flex-1 flex flex-col items-center gap-1 group transition-all ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                  >
                    <span className="text-xs font-bold" style={{ color: stageInfo.color }}>
                      {count}
                    </span>
                    <div
                      className="w-full rounded-t-md transition-all group-hover:opacity-90"
                      style={{
                        height: `${height}px`,
                        backgroundColor: stageInfo.color,
                        opacity: isActive ? 1 : 0.6,
                      }}
                    />
                    <span className="text-[9px] text-muted text-center leading-tight">
                      {stageInfo.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators by name, handle, or niche..."
                className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:border-accent/50"
              />
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as InfluencerStage | "all")}
              className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
            >
              <option value="all">All Stages</option>
              {stages.map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s].label} ({getStageCount(s)})</option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
            >
              <option value="all">All Sources</option>
              <option value="scraper_comment">Scraper — Comment</option>
              <option value="scraper_hashtag">Scraper — Hashtag</option>
              <option value="manual_add">Manual Add</option>
              <option value="agency_submit">Agency Submit</option>
            </select>
            <span className="text-xs text-muted">{filtered.length} creators</span>
          </div>

          {/* Influencer Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-[11px] text-muted uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Creator</th>
                  <th className="text-left px-4 py-3 font-medium">Followers</th>
                  <th className="text-left px-4 py-3 font-medium">Engagement</th>
                  <th className="text-left px-4 py-3 font-medium">Score</th>
                  <th className="text-left px-4 py-3 font-medium">Stage</th>
                  <th className="text-left px-4 py-3 font-medium">Source</th>
                  <th className="text-left px-4 py-3 font-medium">Outreach</th>
                  <th className="text-left px-4 py-3 font-medium">Discovered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.sort((a, b) => b.score - a.score).map((inf) => {
                  const stageInfo = STAGE_LABELS[inf.stage];
                  const tierColor = TIER_COLORS[inf.tier] || "#6B7280";
                  const lastOutreach = inf.outreachAttempts[inf.outreachAttempts.length - 1];
                  const sourceLabel = inf.source.replace(/_/g, " ").replace(/scraper /g, "");

                  return (
                    <tr key={inf.id} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold" style={{ color: tierColor }}>
                            {inf.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{inf.name}</span>
                              {inf.flags.includes("vip") && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                              {inf.flags.includes("high_priority") && <Zap size={12} className="text-orange-400" />}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted">
                              <span>@{inf.handle}</span>
                              <span className="text-border">|</span>
                              <span className="capitalize">{inf.platform}</span>
                              <span className="text-border">|</span>
                              <span className="uppercase text-[10px] font-medium" style={{ color: tierColor }}>{inf.tier}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium">{formatNumber(inf.followers)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${inf.engagementRate >= 5 ? "text-green-400" : inf.engagementRate >= 3 ? "text-yellow-400" : "text-gray-400"}`}>
                          {inf.engagementRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold" style={{
                            borderColor: inf.score >= 80 ? "#22C55E" : inf.score >= 60 ? "#F59E0B" : "#EF4444",
                            color: inf.score >= 80 ? "#22C55E" : inf.score >= 60 ? "#F59E0B" : "#EF4444",
                          }}>
                            {inf.score}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{
                          backgroundColor: `${stageInfo.color}15`,
                          color: stageInfo.color,
                        }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stageInfo.color }} />
                          {stageInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${inf.source.startsWith("scraper") ? "text-purple-400" : "text-gray-400"}`}>
                          {inf.source.startsWith("scraper") && <Bot size={10} className="inline mr-1" />}
                          {sourceLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {lastOutreach ? (
                          <span className={`text-xs ${
                            lastOutreach.status === "replied" ? "text-green-400" :
                            lastOutreach.status === "opened" ? "text-blue-400" :
                            lastOutreach.status === "delivered" ? "text-yellow-400" :
                            "text-gray-400"
                          }`}>
                            {lastOutreach.automated && <Bot size={10} className="inline mr-1" />}
                            {lastOutreach.status}
                          </span>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted">
                          {formatDistanceToNow(new Date(inf.discoveredAt), { addSuffix: true })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

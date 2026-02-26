"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useCRMStore } from "@/store/crm-store";
import { InfluencerStage } from "@/types/crm";
import { PLAY_VERTICALS, type PlayVertical } from "@/lib/play-verticals";
import {
  Search, Users, TrendingUp, Bot, Send, Eye, MessageCircle, Star,
  Zap, Filter, BarChart3, Globe, Target, ArrowUpDown,
  ChevronDown, Percent, Hash, Sparkles, Radio,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useMemo } from "react";

// ============================================================
// Constants
// ============================================================

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

const TIER_LABELS: Record<string, string> = {
  mega: "Mega (1M+)", macro: "Macro (100K-1M)", mid: "Mid (50K-100K)", micro: "Micro (10K-50K)", nano: "Nano (<10K)",
};

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

// ============================================================
// Page Component
// ============================================================

export default function InfluencersPage() {
  const {
    stageFilter, sourceFilter, searchQuery, verticalFilter, tagFilter, tierFilter, platformFilter,
    setStageFilter, setSourceFilter, setSearchQuery, setVerticalFilter, setTierFilter, setPlatformFilter,
    toggleTag,
    getFilteredInfluencers, getPipelineStats, getStageCount, getVerticalCount, getTagCounts, getTierDistribution,
  } = useCRMStore();

  const [sortBy, setSortBy] = useState<"score" | "followers" | "engagement" | "discovered">("score");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [showTagCloud, setShowTagCloud] = useState(false);
  const [view, setView] = useState<"table" | "grid">("table");

  const filtered = getFilteredInfluencers();
  const stats = getPipelineStats();
  const tierDist = getTierDistribution();
  const tagCounts = getTagCounts();

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "desc" ? -1 : 1;
    arr.sort((a, b) => {
      switch (sortBy) {
        case "score": return (b.score - a.score) * dir;
        case "followers": return (b.followers - a.followers) * dir;
        case "engagement": return (b.engagementRate - a.engagementRate) * dir;
        case "discovered": return (new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime()) * dir;
        default: return 0;
      }
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  // Top tags for cloud
  const topTags = useMemo(() => {
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40);
  }, [tagCounts]);

  const stages: InfluencerStage[] = [
    "discovered", "researching", "qualified", "outreach_sent",
    "responded", "negotiating", "contracted", "onboarded", "active", "content_live", "completed",
  ];

  function toggleSort(field: typeof sortBy) {
    if (sortBy === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Header />
        <main className="p-6 space-y-6">

          {/* ============================================================ */}
          {/* 1. Hero Stats Bar                                            */}
          {/* ============================================================ */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            {[
              { label: "Total Pipeline", value: stats.total, icon: Users, color: "#6366F1" },
              { label: "Auto-Discovered", value: stats.autoDiscovered, icon: Bot, color: "#8B5CF6" },
              { label: "Outreach Sent", value: stats.outreachSent, icon: Send, color: "#F59E0B" },
              { label: "Responded", value: stats.responded, icon: MessageCircle, color: "#22C55E" },
              { label: "Contracted", value: stats.contracted, icon: Star, color: "#14B8A6" },
              { label: "Avg Engagement", value: `${stats.avgEngagement}%`, icon: Percent, color: "#EC4899" },
              { label: "Avg Score", value: stats.avgScore, icon: Target, color: "#3B82F6" },
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

          {/* ============================================================ */}
          {/* 2. Industry Verticals Breakdown                              */}
          {/* ============================================================ */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-accent" />
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Industry Verticals</h3>
              </div>
              <span className="text-xs text-muted">
                Top Vertical: <span className="text-white font-medium capitalize">{stats.topVertical}</span>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {(Object.values(PLAY_VERTICALS) as { id: PlayVertical; label: string; color: string; bgColor: string; description: string }[]).map((vertical) => {
                const count = getVerticalCount(vertical.id);
                const isActive = verticalFilter === vertical.id;
                return (
                  <button
                    key={vertical.id}
                    onClick={() => setVerticalFilter(isActive ? "all" : vertical.id)}
                    className={`relative rounded-xl p-3 border transition-all text-left group ${
                      isActive
                        ? "border-white/30 bg-white/10 ring-1 ring-white/20"
                        : "border-border hover:border-white/10 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: vertical.color }}
                      />
                      <span className="text-xs font-medium text-gray-300 group-hover:text-white truncate">
                        {vertical.label}
                      </span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: vertical.color }}>
                      {count}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5 truncate">
                      {vertical.description.split(",")[0]}
                    </p>
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. Tier Distribution + Pipeline Funnel (side by side)        */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
            {/* Tier Distribution */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-accent" />
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Tier Breakdown</h3>
              </div>
              <div className="space-y-3">
                {(["mega", "macro", "mid", "micro", "nano"] as const).map((tier) => {
                  const count = tierDist[tier] || 0;
                  const maxCount = Math.max(...Object.values(tierDist), 1);
                  const pct = Math.round((count / stats.total) * 100) || 0;
                  const isActive = tierFilter === tier;
                  return (
                    <button
                      key={tier}
                      onClick={() => setTierFilter(isActive ? "all" : tier)}
                      className={`w-full text-left transition-all rounded-lg p-1.5 ${isActive ? "bg-white/10" : "hover:bg-white/[0.03]"}`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium capitalize" style={{ color: TIER_COLORS[tier] }}>
                          {TIER_LABELS[tier]}
                        </span>
                        <span className="text-muted">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(count / maxCount) * 100}%`,
                            backgroundColor: TIER_COLORS[tier],
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pipeline Funnel */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-accent" />
                  <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Autonomous Pipeline Funnel</h3>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted">
                  <span className="flex items-center gap-1">
                    <Bot size={10} />
                    {stats.autoDiscovered} auto-discovered
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp size={10} />
                    {stats.responseRate}% response rate
                  </span>
                </div>
              </div>
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
          </div>

          {/* ============================================================ */}
          {/* 4. Tag Cloud (collapsible)                                   */}
          {/* ============================================================ */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowTagCloud(!showTagCloud)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-accent" />
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Tag Cloud</h3>
                {tagFilter.length > 0 && (
                  <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold rounded-full">
                    {tagFilter.length} active
                  </span>
                )}
              </div>
              <ChevronDown size={16} className={`text-muted transition-transform ${showTagCloud ? "rotate-180" : ""}`} />
            </button>
            {showTagCloud && (
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                {topTags.map(([tag, count]) => {
                  const isActive = tagFilter.includes(tag);
                  // Find the vertical color for this tag
                  let tagColor = "#6B7280";
                  for (const v of Object.values(PLAY_VERTICALS)) {
                    if (v.subTags.includes(tag) || v.keywords.includes(tag)) {
                      tagColor = v.color;
                      break;
                    }
                  }
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all border ${
                        isActive
                          ? "border-white/30 bg-white/15 text-white font-medium"
                          : "border-border text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tagColor }} />
                      <span>{tag}</span>
                      <span className="text-muted text-[10px]">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* 5. Filters Bar                                               */}
          {/* ============================================================ */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, handle, niche, tags, or bio..."
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
              <option value="scraper_comment">🤖 Scraper — Comments</option>
              <option value="scraper_hashtag">🤖 Scraper — Hashtag</option>
              <option value="scraper_follower">🤖 Scraper — Follower</option>
              <option value="scraper_mention">🤖 Scraper — Mention</option>
              <option value="agency_submit">Agency Submit</option>
              <option value="inbound_apply">Inbound Apply</option>
              <option value="referral">Referral</option>
              <option value="ai_recommended">AI Recommended</option>
            </select>

            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter/X</option>
              <option value="multi">Multi-Platform</option>
            </select>

            <div className="flex items-center gap-1 bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setView("table")}
                className={`px-3 py-2.5 text-xs ${view === "table" ? "bg-accent text-white" : "text-muted hover:text-white"}`}
              >
                Table
              </button>
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-2.5 text-xs ${view === "grid" ? "bg-accent text-white" : "text-muted hover:text-white"}`}
              >
                Grid
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {(verticalFilter !== "all" || tagFilter.length > 0 || tierFilter !== "all" || platformFilter !== "all" || stageFilter !== "all" || sourceFilter !== "all") && (
                <button
                  onClick={() => {
                    setVerticalFilter("all");
                    setTierFilter("all");
                    setPlatformFilter("all");
                    setStageFilter("all");
                    setSourceFilter("all");
                    setSearchQuery("");
                    // Clear all tags
                    tagFilter.forEach((t) => toggleTag(t));
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg transition-colors"
                >
                  <Filter size={12} />
                  Clear All Filters
                </button>
              )}
              <span className="text-xs text-muted">{filtered.length} of {stats.total} creators</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 6. Influencer Table / Grid                                   */}
          {/* ============================================================ */}
          {view === "table" ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-[11px] text-muted uppercase tracking-wider">
                    <th className="text-left px-4 py-3 font-medium">Creator</th>
                    <th className="text-left px-4 py-3 font-medium">
                      <button onClick={() => toggleSort("followers")} className="flex items-center gap-1 hover:text-white transition-colors">
                        Followers
                        {sortBy === "followers" && <ArrowUpDown size={10} className="text-accent" />}
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      <button onClick={() => toggleSort("engagement")} className="flex items-center gap-1 hover:text-white transition-colors">
                        Engagement
                        {sortBy === "engagement" && <ArrowUpDown size={10} className="text-accent" />}
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      <button onClick={() => toggleSort("score")} className="flex items-center gap-1 hover:text-white transition-colors">
                        Score
                        {sortBy === "score" && <ArrowUpDown size={10} className="text-accent" />}
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 font-medium">Verticals</th>
                    <th className="text-left px-4 py-3 font-medium">Stage</th>
                    <th className="text-left px-4 py-3 font-medium">Source</th>
                    <th className="text-left px-4 py-3 font-medium">
                      <button onClick={() => toggleSort("discovered")} className="flex items-center gap-1 hover:text-white transition-colors">
                        Discovered
                        {sortBy === "discovered" && <ArrowUpDown size={10} className="text-accent" />}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((inf) => {
                    const stageInfo = STAGE_LABELS[inf.stage];
                    const tierColor = TIER_COLORS[inf.tier] || "#6B7280";
                    const lastOutreach = inf.outreachAttempts[inf.outreachAttempts.length - 1];
                    const sourceLabel = inf.source.replace(/_/g, " ").replace(/scraper /g, "🤖 ");

                    // Figure out which verticals this influencer belongs to
                    const infVerticals: { id: string; color: string; label: string }[] = [];
                    const allInfTags = [...inf.niche, ...inf.tags].map((t) => t.toLowerCase());
                    for (const v of Object.values(PLAY_VERTICALS)) {
                      if (allInfTags.some((t) => t.includes(v.id) || v.keywords.some((kw) => t.includes(kw)))) {
                        infVerticals.push({ id: v.id, color: v.color, label: v.label });
                      }
                    }
                    // Deduplicate
                    const uniqueVerticals = infVerticals.filter((v, i, arr) => arr.findIndex((a) => a.id === v.id) === i).slice(0, 3);

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
                                {inf.source.startsWith("scraper") && <Bot size={10} className="text-purple-400" />}
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
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${inf.engagementRate >= 5 ? "text-green-400" : inf.engagementRate >= 3 ? "text-yellow-400" : "text-gray-400"}`}>
                              {inf.engagementRate.toFixed(1)}%
                            </span>
                            <span className="text-[9px] text-muted">
                              ({formatNumber(inf.avgLikes)} avg)
                            </span>
                          </div>
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
                          <div className="flex flex-wrap gap-1">
                            {uniqueVerticals.map((v) => (
                              <span
                                key={v.id}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium"
                                style={{ backgroundColor: `${v.color}15`, color: v.color }}
                              >
                                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: v.color }} />
                                {v.label}
                              </span>
                            ))}
                            {uniqueVerticals.length === 0 && (
                              <span className="text-[10px] text-muted">—</span>
                            )}
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
                          <div className="flex flex-col">
                            <span className={`text-xs ${inf.source.startsWith("scraper") ? "text-purple-400" : "text-gray-400"}`}>
                              {sourceLabel}
                            </span>
                            {lastOutreach && (
                              <span className={`text-[10px] mt-0.5 ${
                                lastOutreach.status === "replied" ? "text-green-400" :
                                lastOutreach.status === "opened" ? "text-blue-400" :
                                lastOutreach.status === "delivered" ? "text-yellow-400" :
                                "text-gray-500"
                              }`}>
                                {lastOutreach.automated && <Bot size={8} className="inline mr-0.5" />}
                                outreach: {lastOutreach.status}
                              </span>
                            )}
                          </div>
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
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sorted.map((inf) => {
                const stageInfo = STAGE_LABELS[inf.stage];
                const tierColor = TIER_COLORS[inf.tier] || "#6B7280";

                // Figure out verticals
                const allInfTags = [...inf.niche, ...inf.tags].map((t) => t.toLowerCase());
                const infVerticals: { id: string; color: string; label: string }[] = [];
                for (const v of Object.values(PLAY_VERTICALS)) {
                  if (allInfTags.some((t) => t.includes(v.id) || v.keywords.some((kw) => t.includes(kw)))) {
                    infVerticals.push({ id: v.id, color: v.color, label: v.label });
                  }
                }
                const uniqueVerticals = infVerticals.filter((v, i, arr) => arr.findIndex((a) => a.id === v.id) === i).slice(0, 3);

                return (
                  <div key={inf.id} className="bg-card border border-border rounded-xl p-4 hover:border-white/10 transition-all group">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold" style={{ color: tierColor }}>
                          {inf.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold">{inf.name}</span>
                            {inf.flags.includes("vip") && <Star size={10} className="text-yellow-400 fill-yellow-400" />}
                          </div>
                          <p className="text-xs text-muted">@{inf.handle}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold" style={{
                        borderColor: inf.score >= 80 ? "#22C55E" : inf.score >= 60 ? "#F59E0B" : "#EF4444",
                        color: inf.score >= 80 ? "#22C55E" : inf.score >= 60 ? "#F59E0B" : "#EF4444",
                      }}>
                        {inf.score}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-1.5 bg-white/[0.03] rounded-lg">
                        <p className="text-sm font-bold">{formatNumber(inf.followers)}</p>
                        <p className="text-[9px] text-muted">Followers</p>
                      </div>
                      <div className="text-center p-1.5 bg-white/[0.03] rounded-lg">
                        <p className={`text-sm font-bold ${inf.engagementRate >= 5 ? "text-green-400" : inf.engagementRate >= 3 ? "text-yellow-400" : "text-gray-400"}`}>
                          {inf.engagementRate.toFixed(1)}%
                        </p>
                        <p className="text-[9px] text-muted">Engagement</p>
                      </div>
                      <div className="text-center p-1.5 bg-white/[0.03] rounded-lg">
                        <p className="text-sm font-bold capitalize" style={{ color: tierColor }}>{inf.tier}</p>
                        <p className="text-[9px] text-muted">Tier</p>
                      </div>
                    </div>

                    {/* Verticals */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {uniqueVerticals.map((v) => (
                        <span
                          key={v.id}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium"
                          style={{ backgroundColor: `${v.color}15`, color: v.color }}
                        >
                          {v.label}
                        </span>
                      ))}
                    </div>

                    {/* Stage + Source */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{
                        backgroundColor: `${stageInfo.color}15`,
                        color: stageInfo.color,
                      }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stageInfo.color }} />
                        {stageInfo.label}
                      </span>
                      <div className="flex items-center gap-1">
                        {inf.source.startsWith("scraper") && <Bot size={10} className="text-purple-400" />}
                        <span className="capitalize text-[10px] text-muted">{inf.platform}</span>
                        <Radio size={10} className="text-muted" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ============================================================ */}
          {/* 7. Engagement Methodology                                    */}
          {/* ============================================================ */}
          <div className="bg-card/50 border border-border rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Zap size={14} className="text-accent" />
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-1 text-gray-300">How Engagement & Score Work</h4>
              <p className="text-[11px] text-muted leading-relaxed">
                <strong>Engagement Rate</strong> = (avg likes + avg comments) / followers × 100.
                Green = 5%+ (exceptional), Yellow = 3-5% (good), Gray = &lt;3% (average).
                <strong className="ml-2">Score</strong> = weighted composite: engagement (30%) + brand alignment (25%) + content quality (20%) + audience fit (15%) + growth rate (10%).
                All metrics are auto-calculated by the scraper engine and updated in real-time.
                <strong className="ml-2">{stats.autoDiscovered}</strong> of {stats.total} creators were discovered autonomously by AI scrapers.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

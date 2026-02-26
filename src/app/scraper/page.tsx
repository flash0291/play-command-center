"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useCRMStore } from "@/store/crm-store";
import {
  Bot, RefreshCw, Eye, Users, Send, CheckCircle,
  Clock, Hash, User,
  MessageSquare, ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { InfluencerStage } from "@/types/crm";

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

const JOB_TYPE_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  monitor_account: { label: "Monitor Account", icon: User, color: "#6366F1" },
  monitor_hashtag: { label: "Monitor Hashtag", icon: Hash, color: "#8B5CF6" },
  scrape_comments: { label: "Scrape Comments", icon: MessageSquare, color: "#F59E0B" },
  scrape_followers: { label: "Scrape Followers", icon: Users, color: "#EC4899" },
  analyze_profile: { label: "Analyze Profile", icon: Eye, color: "#14B8A6" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  running: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  queued: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  completed: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  failed: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  paused: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
};

export default function ScraperPage() {
  const { scraperJobs, influencers, runScraper, getPipelineStats } = useCRMStore();
  const stats = getPipelineStats();

  const totalScanned = scraperJobs.reduce((sum, j) => sum + j.results.totalScanned, 0);
  const totalDiscovered = scraperJobs.reduce((sum, j) => sum + j.results.totalQualified, 0);
  const autoOutreachSent = influencers.filter((i) =>
    i.outreachAttempts.some((o) => o.automated)
  ).length;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Header />
        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bot size={24} className="text-purple-400" />
                Autonomous Scraper Engine
              </h2>
              <p className="text-sm text-muted mt-1">
                Monitors posts, scrapes comments, discovers creators, and sends outreach — zero human touch
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">{stats.scrapersRunning} scrapers live</span>
              </div>
            </div>
          </div>

          {/* Pipeline Flow Visualization */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Autonomous Discovery Pipeline</h3>
            <div className="flex items-center justify-between">
              {[
                { label: "Posts Scanned", value: totalScanned.toLocaleString(), icon: Eye, color: "#6366F1", sub: "across all jobs" },
                { label: "", value: "", icon: ArrowRight, color: "#3a3a4a", sub: "" },
                { label: "Creators Found", value: totalDiscovered.toString(), icon: Users, color: "#8B5CF6", sub: "qualified profiles" },
                { label: "", value: "", icon: ArrowRight, color: "#3a3a4a", sub: "" },
                { label: "Auto-Outreach", value: autoOutreachSent.toString(), icon: Send, color: "#F59E0B", sub: "DMs sent autonomously" },
                { label: "", value: "", icon: ArrowRight, color: "#3a3a4a", sub: "" },
                { label: "Responded", value: stats.responded.toString(), icon: MessageSquare, color: "#22C55E", sub: `${stats.responseRate}% response rate` },
                { label: "", value: "", icon: ArrowRight, color: "#3a3a4a", sub: "" },
                { label: "Contracted", value: stats.contracted.toString(), icon: CheckCircle, color: "#14B8A6", sub: `${stats.conversionRate}% conversion` },
              ].map((step, i) => (
                step.label === "" ? (
                  <step.icon key={i} size={16} style={{ color: step.color }} className="flex-shrink-0" />
                ) : (
                  <div key={i} className="text-center flex-1">
                    <div className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${step.color}15` }}>
                      <step.icon size={20} style={{ color: step.color }} />
                    </div>
                    <p className="text-lg font-bold" style={{ color: step.color }}>{step.value}</p>
                    <p className="text-[10px] text-muted">{step.label}</p>
                    <p className="text-[9px] text-muted/50">{step.sub}</p>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Scraper Jobs */}
            <div className="xl:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Active Scraper Jobs</h3>
              {scraperJobs.map((job) => {
                const typeInfo = JOB_TYPE_LABELS[job.type] || JOB_TYPE_LABELS.monitor_account;
                const statusStyle = STATUS_STYLES[job.status] || STATUS_STYLES.queued;
                const TypeIcon = typeInfo.icon;

                return (
                  <div key={job.id} className="bg-card border border-border rounded-xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${typeInfo.color}15` }}>
                          <TypeIcon size={18} style={{ color: typeInfo.color }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">{typeInfo.label}</h4>
                          <p className="text-xs text-muted">{job.target}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${job.status === "running" ? "animate-pulse" : ""}`} />
                          {job.status}
                        </span>
                        {job.status === "running" && (
                          <button
                            onClick={() => runScraper(job.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            title="Run now"
                          >
                            <RefreshCw size={12} className="text-muted" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-xs font-bold">{job.results.totalScanned.toLocaleString()}</p>
                        <p className="text-[9px] text-muted">Scanned</p>
                      </div>
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-xs font-bold text-purple-400">{job.results.totalQualified}</p>
                        <p className="text-[9px] text-muted">Qualified</p>
                      </div>
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-xs font-bold text-green-400">{job.results.totalAdded}</p>
                        <p className="text-[9px] text-muted">Added to CRM</p>
                      </div>
                      <div className="text-center p-2 bg-background rounded-lg">
                        <p className="text-xs font-bold text-yellow-400">
                          {job.config.autoOutreach ? "ON" : "OFF"}
                        </p>
                        <p className="text-[9px] text-muted">Auto-Outreach</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted">
                      <div className="flex items-center gap-3">
                        {job.recurring && (
                          <span className="flex items-center gap-1">
                            <RefreshCw size={10} /> Every {job.intervalMinutes}min
                          </span>
                        )}
                        <span>Min {job.config.minFollowers.toLocaleString()} followers</span>
                        <span>Min {job.config.minEngagement}% engagement</span>
                      </div>
                      {job.nextRunAt && (
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> Next: {formatDistanceToNow(new Date(job.nextRunAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Discovery Feed */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Discovery Feed
              </h3>

              {/* Recent discoveries from CRM */}
              {influencers
                .filter((i) => i.source.startsWith("scraper_"))
                .sort((a, b) => new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime())
                .slice(0, 10)
                .map((inf) => {
                  const lastOutreach = inf.outreachAttempts[inf.outreachAttempts.length - 1];
                  return (
                    <div key={inf.id} className="bg-card border border-border rounded-xl p-4 animate-slide-up">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-400">
                          {inf.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{inf.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium"
                              style={{ backgroundColor: `${STAGE_LABELS[inf.stage]?.color || "#6B7280"}15`, color: STAGE_LABELS[inf.stage]?.color || "#6B7280" }}>
                              {STAGE_LABELS[inf.stage]?.label || inf.stage}
                            </span>
                          </div>
                          <p className="text-xs text-muted">
                            @{inf.handle} &middot; {(inf.followers / 1000).toFixed(0)}K &middot; {inf.engagementRate}% eng
                          </p>
                          {inf.discoveredFrom && (
                            <p className="text-[10px] text-purple-400/70 mt-1">
                              <Bot size={10} className="inline mr-1" />
                              {inf.discoveredFrom}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-muted">
                              Score: <span className={`font-bold ${inf.score >= 80 ? "text-green-400" : inf.score >= 60 ? "text-yellow-400" : "text-gray-400"}`}>{inf.score}</span>
                            </span>
                            {lastOutreach?.automated && (
                              <span className="text-[10px] text-yellow-400/70 flex items-center gap-1">
                                <Send size={8} /> Auto-DM {lastOutreach.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[9px] text-muted flex-shrink-0">
                          {formatDistanceToNow(new Date(inf.discoveredAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

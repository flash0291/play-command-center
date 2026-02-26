"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useState, useCallback } from "react";
import { useOnboardingStore } from "@/store/onboarding-store";
import { syncSettingsToStores } from "@/lib/campaign-initializer";
import {
  Settings as SettingsIcon,
  Bell,
  Key,
  Users,
  Bot,
  Globe,
  Shield,
  Zap,
  Database,
  Mail,
} from "lucide-react";

// ── Agent data ────────────────────────────────────────────
const AGENTS = [
  { id: "orchestrator", name: "Campaign Orchestrator", color: "#6366F1" },
  { id: "retail", name: "Retail Partner Agent", color: "#EC4899" },
  { id: "influencer", name: "Influencer & Talent Agent", color: "#F59E0B" },
  { id: "content", name: "Content Engine", color: "#8B5CF6" },
  { id: "events", name: "Event & Experiential Agent", color: "#14B8A6" },
  { id: "budget", name: "Budget & Compliance Agent", color: "#22C55E" },
  { id: "performance", name: "Performance & Intelligence Agent", color: "#EF4444" },
];

// ── Integration defaults ──────────────────────────────────
const INTEGRATIONS_DEFAULT = [
  { name: "Anthropic API", key: "anthropic", connected: true },
  { name: "Instagram Graph API", key: "instagram", connected: false },
  { name: "TikTok API", key: "tiktok", connected: false },
  { name: "Twitter/X API", key: "twitter", connected: false },
  { name: "Stripe (Payments)", key: "stripe", connected: false },
  { name: "Google Analytics", key: "google_analytics", connected: false },
];

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  agency: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  creative_director: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  account_manager: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  viewer: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  agency: "Agency",
  creative_director: "Creative Director",
  account_manager: "Account Manager",
  viewer: "Viewer",
};

// ── Toggle component ──────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        on ? "bg-green-500" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          on ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function SettingsPage() {
  // ── Onboarding store bindings ───────────────────────────
  const campaignName = useOnboardingStore((s) => s.campaign.campaignName);
  const startDate = useOnboardingStore((s) => s.campaign.startDate);
  const endDate = useOnboardingStore((s) => s.campaign.endDate);
  const sprintDuration = useOnboardingStore((s) => s.campaign.sprintDuration);
  const influencer = useOnboardingStore((s) => s.influencer);
  const team = useOnboardingStore((s) => s.team);
  const totalBudget = useOnboardingStore((s) => s.budget.totalBudget);
  const agentAllocations = useOnboardingStore((s) => s.budget.agentAllocations);
  const updateInfluencer = useOnboardingStore((s) => s.updateInfluencer);
  const updateCampaign = useOnboardingStore((s) => s.updateCampaign);
  const updateBudget = useOnboardingStore((s) => s.updateBudget);
  const updateAgentAllocation = useOnboardingStore((s) => s.updateAgentAllocation);

  // Sync changes to campaign/CRM stores
  const syncAll = useCallback(() => {
    const state = useOnboardingStore.getState();
    syncSettingsToStores(state);
  }, []);

  // Campaign settings — current phase (local, affects campaign store directly)
  const [currentPhase, setCurrentPhase] = useState("pre_launch");
  const [warningThreshold] = useState(70);
  const [criticalThreshold] = useState(50);

  // Agent configuration (local state for toggles/automation modes)
  const [agentStatuses, setAgentStatuses] = useState<boolean[]>(
    AGENTS.map(() => true)
  );
  const [agentAutomation, setAgentAutomation] = useState<string[]>(
    AGENTS.map(() => "full_auto")
  );

  // Integrations
  const [integrations, setIntegrations] = useState(
    INTEGRATIONS_DEFAULT.map((i) => ({ ...i }))
  );

  // Keyword input for scraper
  const [keywordInput, setKeywordInput] = useState("");

  // Notification preferences
  const [dailyMorningBrief, setDailyMorningBrief] = useState(true);
  const [endOfDayRecap, setEndOfDayRecap] = useState(true);
  const [realTimeAlerts, setRealTimeAlerts] = useState(true);
  const [agentActionApprovals, setAgentActionApprovals] = useState(true);
  const [clientReportAutoSend, setClientReportAutoSend] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState(
    "dg@playcommand.com"
  );

  // ── Helpers ─────────────────────────────────────────────
  const toggleAgent = (index: number) => {
    setAgentStatuses((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const changeAutomation = (index: number, value: string) => {
    setAgentAutomation((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const toggleIntegration = (index: number) => {
    setIntegrations((prev) => {
      const next = prev.map((i) => ({ ...i }));
      next[index].connected = !next[index].connected;
      return next;
    });
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !influencer.nicheKeywords.includes(trimmed)) {
      updateInfluencer({ nicheKeywords: [...influencer.nicheKeywords, trimmed] });
      setKeywordInput("");
      syncAll();
    }
  };

  const removeKeyword = (kw: string) => {
    updateInfluencer({ nicheKeywords: influencer.nicheKeywords.filter((k) => k !== kw) });
    syncAll();
  };

  // Format date for display
  const formatDate = (d: string) => {
    if (!d) return "Not set";
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return d; }
  };

  const sprintLabel = `${sprintDuration} days${startDate ? ` (${formatDate(startDate)} - ${formatDate(endDate || "")})` : ""}`;

  // Budget per agent
  const getAgentBudget = (agentId: string) => {
    const alloc = agentAllocations.find((a) => a.agentId === agentId);
    return alloc?.allocated ?? 0;
  };

  // Automation label
  const automationLabel = (val: string) => {
    switch (val) {
      case "full_auto":
        return "Full Auto";
      case "semi_auto":
        return "Semi-Auto";
      case "manual":
        return "Manual Approval";
      default:
        return val;
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Header />
        <main className="p-6 space-y-6">
          {/* ── Header ──────────────────────────────────── */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <SettingsIcon size={24} className="text-indigo-400" />
              Settings
            </h2>
            <p className="text-sm text-muted mt-1">
              Manage your campaign configuration, integrations, and preferences
            </p>
          </div>

          {/* ── Settings grid ───────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* ── Campaign Settings ─────────────────────── */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-5">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Zap size={16} className="text-indigo-400" />
                Campaign Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={campaignName || "PLAY by Palm Angels — U.S. Market Launch"}
                    onChange={(e) => {
                      updateCampaign({ campaignName: e.target.value });
                      syncAll();
                    }}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted mb-1">
                    Sprint Duration
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={sprintLabel}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted mb-1">
                    Total Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted">$</span>
                    <input
                      type="number"
                      value={totalBudget || 1000000}
                      onChange={(e) => {
                        updateBudget({ totalBudget: Number(e.target.value) });
                        syncAll();
                      }}
                      className="w-full bg-background border border-border rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-muted mb-1">
                    Current Phase
                  </label>
                  <select
                    value={currentPhase}
                    onChange={(e) => setCurrentPhase(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                  >
                    <option value="pre_launch">Pre-Launch</option>
                    <option value="launch_week">Launch Week</option>
                    <option value="sustain">Sustain</option>
                    <option value="optimize">Optimize</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-muted mb-1">
                    Health Score Thresholds
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[10px] text-muted mb-1">
                        <span>Warning</span>
                        <span className="text-yellow-400 font-medium">
                          {warningThreshold}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${warningThreshold}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[10px] text-muted mb-1">
                        <span>Critical</span>
                        <span className="text-red-400 font-medium">
                          {criticalThreshold}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-400 rounded-full"
                          style={{ width: `${criticalThreshold}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Agent Configuration ───────────────────── */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Bot size={16} className="text-purple-400" />
                Agent Configuration
              </h3>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {AGENTS.map((agent, i) => {
                  const budget = getAgentBudget(agent.id);
                  return (
                    <div
                      key={agent.name}
                      className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: agent.color }}
                        />
                        <div className="min-w-0">
                          <span className="text-sm font-medium truncate block">
                            {agent.name}
                          </span>
                          {budget > 0 && (
                            <span className="text-[10px] text-muted">
                              ${(budget / 1000).toFixed(0)}K allocated
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => {
                            updateAgentAllocation(agent.id, Number(e.target.value));
                            syncAll();
                          }}
                          className="w-20 bg-card border border-border rounded-md px-2 py-1 text-[11px] text-white focus:outline-none focus:border-accent/50"
                          placeholder="Budget"
                        />

                        <select
                          value={agentAutomation[i]}
                          onChange={(e) => changeAutomation(i, e.target.value)}
                          className="bg-card border border-border rounded-md px-2 py-1 text-[11px] text-white focus:outline-none"
                        >
                          <option value="full_auto">Full Auto</option>
                          <option value="semi_auto">Semi-Auto</option>
                          <option value="manual">Manual Approval</option>
                        </select>

                        <Toggle
                          on={agentStatuses[i]}
                          onToggle={() => toggleAgent(i)}
                        />

                        <span
                          className={`text-[10px] w-12 text-center font-medium ${
                            agentStatuses[i] ? "text-green-400" : "text-gray-500"
                          }`}
                        >
                          {agentStatuses[i] ? "Active" : "Paused"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-muted">
                All agents default to{" "}
                <span className="text-white font-medium">
                  {automationLabel("full_auto")}
                </span>{" "}
                automation.
              </p>
            </div>

            {/* ── API & Integrations ────────────────────── */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Key size={16} className="text-yellow-400" />
                API & Integrations
              </h3>

              <div className="space-y-3">
                {integrations.map((integ, i) => (
                  <div
                    key={integ.key}
                    className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          integ.connected ? "bg-green-400" : "bg-gray-500"
                        }`}
                      />
                      <div>
                        <span className="text-sm font-medium">
                          {integ.name}
                        </span>
                        {integ.connected && (
                          <span className="ml-2 text-[10px] text-green-400">
                            Connected
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleIntegration(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        integ.connected
                          ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                          : "bg-white/5 text-gray-400 border border-border hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {integ.connected ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted">
                <Globe size={12} />
                <span>
                  API keys are encrypted and stored securely in your vault.
                </span>
              </div>
            </div>

            {/* ── Scraper Configuration ─────────────────── */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Database size={16} className="text-teal-400" />
                Scraper Configuration
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1">
                    Min Followers
                  </label>
                  <input
                    type="number"
                    value={influencer.minFollowers}
                    onChange={(e) => {
                      updateInfluencer({ minFollowers: Number(e.target.value) });
                      syncAll();
                    }}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">
                    Min Engagement Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={influencer.minEngagement}
                      onChange={(e) => {
                        updateInfluencer({ minEngagement: Number(e.target.value) });
                        syncAll();
                      }}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Auto-Outreach</span>
                </div>
                <Toggle
                  on={influencer.autoOutreach}
                  onToggle={() => {
                    updateInfluencer({ autoOutreach: !influencer.autoOutreach });
                    syncAll();
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1">
                    Max DMs per Day
                  </label>
                  <input
                    type="number"
                    value={influencer.autoOutreachMaxPerDay}
                    onChange={(e) => {
                      updateInfluencer({ autoOutreachMaxPerDay: Number(e.target.value) });
                      syncAll();
                    }}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">
                    Scan Interval
                  </label>
                  <select
                    value={String(influencer.scraperScanInterval)}
                    onChange={(e) => {
                      updateInfluencer({ scraperScanInterval: Number(e.target.value) });
                      syncAll();
                    }}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                  >
                    <option value="15">Every 15 min</option>
                    <option value="30">Every 30 min</option>
                    <option value="60">Every 1 hr</option>
                    <option value="120">Every 2 hr</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted mb-1">
                  Niche Keywords
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {influencer.nicheKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-medium"
                    >
                      {kw}
                      <button
                        onClick={() => removeKeyword(kw)}
                        className="hover:text-white transition-colors"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                    placeholder="Add keyword..."
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-400 font-medium hover:bg-purple-500/20 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* ── Notification Preferences ──────────────── */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Bell size={16} className="text-blue-400" />
                Notification Preferences
              </h3>

              <div className="space-y-3">
                {[
                  {
                    label: "Daily Morning Brief",
                    value: dailyMorningBrief,
                    setter: setDailyMorningBrief,
                  },
                  {
                    label: "End of Day Recap",
                    value: endOfDayRecap,
                    setter: setEndOfDayRecap,
                  },
                  {
                    label: "Real-time Alerts",
                    value: realTimeAlerts,
                    setter: setRealTimeAlerts,
                  },
                  {
                    label: "Agent Action Approvals",
                    value: agentActionApprovals,
                    setter: setAgentActionApprovals,
                  },
                  {
                    label: "Client Report Auto-send",
                    value: clientReportAutoSend,
                    setter: setClientReportAutoSend,
                  },
                ].map((pref) => (
                  <div
                    key={pref.label}
                    className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3"
                  >
                    <span className="text-sm">{pref.label}</span>
                    <Toggle
                      on={pref.value}
                      onToggle={() => pref.setter(!pref.value)}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs text-muted mb-1 flex items-center gap-1.5">
                  <Mail size={12} />
                  Email notifications to
                </label>
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>

            {/* ── Team & Permissions ────────────────────── */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Users size={16} className="text-pink-400" />
                  Team & Permissions
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-muted">
                  <Shield size={12} />
                  <span>Role-based access</span>
                </div>
              </div>

              <div className="space-y-3">
                {team.length > 0 ? (
                  team.map((member) => {
                    const colors = ["#6366F1", "#EC4899", "#F59E0B", "#8B5CF6", "#14B8A6", "#22C55E"];
                    const memberColor = colors[member.name.length % colors.length];
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: `${memberColor}15`,
                              color: memberColor,
                            }}
                          >
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <span className="text-sm font-medium block">{member.name}</span>
                            <span className="text-[10px] text-muted">{member.email}</span>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                            ROLE_COLORS[member.role] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }`}
                        >
                          {ROLE_LABELS[member.role] || member.role}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  // Fallback — show default team if none configured
                  [
                    { name: "Daniel George", role: "Admin", color: "#6366F1" },
                    { name: "Marcus Chen", role: "Agency", color: "#F59E0B" },
                    { name: "Aisha Williams", role: "Agency", color: "#EC4899" },
                    { name: "Sofia Rodriguez", role: "Creative Director", color: "#8B5CF6" },
                  ].map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: `${member.color}15`,
                            color: member.color,
                          }}
                        >
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-sm font-medium">{member.name}</span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                          ROLE_COLORS[member.role.toLowerCase().replace(/ /g, "_")] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <button className="w-full px-4 py-2.5 bg-white/5 border border-border rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Users size={14} />
                Invite Member
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import {
  useOnboardingStore,
  ONBOARDING_STEPS,
  type OnboardingStep,
  type TeamMember as OnboardingTeamMember,
} from "@/store/onboarding-store";
import { PLAY_VERTICALS } from "@/lib/play-verticals";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Building2,
  Target,
  Globe,
  Instagram,
  Youtube,
  Users,
  DollarSign,
  Rocket,
  Plus,
  X,
  Bot,
  Zap,
  Shield,
  Eye,
  Palette,
  TrendingUp,
  Hash,
  Mail,
  Send,
  ChevronRight,
  Music,
  Trophy,
  Gamepad2,
  Heart,
  Mountain,
  Brush,
} from "lucide-react";
import { useState } from "react";

// ============================================================
// Step Progress Bar
// ============================================================
function StepProgress({ currentStep, completedSteps }: { currentStep: OnboardingStep; completedSteps: OnboardingStep[] }) {
  const { setStep, isStepValid } = useOnboardingStore();

  return (
    <div className="flex items-center gap-1">
      {ONBOARDING_STEPS.map((step, i) => {
        const isCurrent = step.id === currentStep;
        const isComplete = completedSteps.includes(step.id);
        const isValid = isStepValid(step.id);
        const canNavigate = isComplete || isCurrent;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => canNavigate && setStep(step.id)}
              disabled={!canNavigate}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isCurrent
                  ? "bg-accent text-white"
                  : isComplete
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-white/5 text-muted"
              } ${canNavigate ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isComplete ? "bg-green-500 text-white" : isCurrent ? "bg-white text-accent" : "bg-white/10 text-muted"
              }`}>
                {isComplete ? <Check size={10} /> : step.number}
              </span>
              <span className="hidden lg:inline">{step.label}</span>
              {isValid && !isComplete && isCurrent && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              )}
            </button>
            {i < ONBOARDING_STEPS.length - 1 && (
              <ChevronRight size={14} className="text-muted/30 mx-0.5" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Step 1: Brand Identity
// ============================================================
function StepBrand() {
  const { brand, updateBrand } = useOnboardingStore();
  const [newValue, setNewValue] = useState("");

  const addBrandValue = () => {
    if (newValue.trim() && !brand.brandValues.includes(newValue.trim())) {
      updateBrand({ brandValues: [...brand.brandValues, newValue.trim()] });
      setNewValue("");
    }
  };

  const removeValue = (val: string) => {
    updateBrand({ brandValues: brand.brandValues.filter((v) => v !== val) });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tell us about your brand</h2>
        <p className="text-muted text-sm">This information powers every agent in the system — from content tone to influencer matching and retail positioning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Brand Name *</label>
            <input
              value={brand.brandName}
              onChange={(e) => updateBrand({ brandName: e.target.value })}
              placeholder="e.g. PLAY by Palm Angels"
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Client / Parent Company *</label>
            <input
              value={brand.clientName}
              onChange={(e) => updateBrand({ clientName: e.target.value })}
              placeholder="e.g. Palm Angels / New Guards Group"
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Tagline</label>
            <input
              value={brand.tagline}
              onChange={(e) => updateBrand({ tagline: e.target.value })}
              placeholder="e.g. Where luxury meets the streets"
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Brand Description</label>
            <textarea
              value={brand.description}
              onChange={(e) => updateBrand({ description: e.target.value })}
              placeholder="Describe the brand in 2-3 sentences. What makes it unique? What story does it tell?"
              rows={3}
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Website URL</label>
            <input
              value={brand.websiteUrl}
              onChange={(e) => updateBrand({ websiteUrl: e.target.value })}
              placeholder="https://playbypalmangels.com"
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Brand Aesthetic / Vibe</label>
            <input
              value={brand.aesthetic}
              onChange={(e) => updateBrand({ aesthetic: e.target.value })}
              placeholder="e.g. Streetwear meets Italian luxury, bold, youthful, rebellious"
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
            <p className="text-[10px] text-muted mt-1">The Content Engine and Influencer Agent use this to match brand tone</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Target Audience</label>
            <textarea
              value={brand.targetAudience}
              onChange={(e) => updateBrand({ targetAudience: e.target.value })}
              placeholder="e.g. Gen Z & Millennials (18-35), fashion-forward, culture-obsessed, social media native, urban lifestyle"
              rows={2}
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none"
            />
          </div>

          {/* Brand Colors */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Brand Colors</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => updateBrand({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <div>
                  <p className="text-xs font-medium">Primary</p>
                  <p className="text-[10px] text-muted">{brand.primaryColor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brand.secondaryColor}
                  onChange={(e) => updateBrand({ secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <div>
                  <p className="text-xs font-medium">Secondary</p>
                  <p className="text-[10px] text-muted">{brand.secondaryColor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Values */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Brand Values / Pillars</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {brand.brandValues.map((val) => (
                <span key={val} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 text-accent rounded-lg text-xs">
                  {val}
                  <button onClick={() => removeValue(val)} className="hover:text-white transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addBrandValue()}
                placeholder="Add a value (e.g. Authenticity, Innovation)"
                className="flex-1 bg-white/5 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
              <button onClick={addBrandValue} className="p-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-accent transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Preview */}
      {brand.brandName && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">AI Agent Preview</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            All 7 agents will be calibrated with <strong className="text-white">{brand.brandName}</strong>{brand.aesthetic && <> and the <strong className="text-white">{brand.aesthetic}</strong> aesthetic</>}.
            {brand.targetAudience && <> Influencer Agent will prioritize creators who resonate with <strong className="text-white">{brand.targetAudience}</strong>.</>}
            {brand.brandValues.length > 0 && <> Content Engine will align all outputs with your brand pillars: <strong className="text-white">{brand.brandValues.join(", ")}</strong>.</>}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Step 2: Campaign Configuration
// ============================================================
function StepCampaign() {
  const { campaign, updateCampaign } = useOnboardingStore();
  const [newGoal, setNewGoal] = useState("");
  const [newKpiMetric, setNewKpiMetric] = useState("");
  const [newKpiTarget, setNewKpiTarget] = useState("");

  const addGoal = () => {
    if (newGoal.trim()) {
      updateCampaign({ primaryGoals: [...campaign.primaryGoals, newGoal.trim()] });
      setNewGoal("");
    }
  };

  const addKpi = () => {
    if (newKpiMetric.trim() && newKpiTarget.trim()) {
      updateCampaign({
        kpiTargets: [...campaign.kpiTargets, { metric: newKpiMetric.trim(), target: newKpiTarget.trim() }],
      });
      setNewKpiMetric("");
      setNewKpiTarget("");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configure your campaign</h2>
        <p className="text-muted text-sm">Define the campaign timeline, objectives, and KPIs. Every agent will coordinate against these targets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Campaign Name *</label>
            <input
              value={campaign.campaignName}
              onChange={(e) => updateCampaign({ campaignName: e.target.value })}
              placeholder="e.g. PLAY U.S. Market Launch"
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Campaign Objective</label>
            <textarea
              value={campaign.objective}
              onChange={(e) => updateCampaign({ objective: e.target.value })}
              placeholder="What is the primary objective of this campaign? e.g. Launch PLAY sub-brand in the U.S. market, establish brand presence, secure 25 retail doors, hit $2M in first-quarter revenue"
              rows={3}
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Start Date *</label>
              <input
                type="date"
                value={campaign.startDate}
                onChange={(e) => updateCampaign({ startDate: e.target.value })}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">End Date</label>
              <input
                type="date"
                value={campaign.endDate}
                onChange={(e) => updateCampaign({ endDate: e.target.value })}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Sprint Duration</label>
            <select
              value={campaign.sprintDuration}
              onChange={(e) => updateCampaign({ sprintDuration: Number(e.target.value) })}
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
            >
              <option value={30}>30 days (4 weeks)</option>
              <option value={45}>45 days (6 weeks)</option>
              <option value={60}>60 days (8 weeks)</option>
              <option value={90}>90 days (12 weeks)</option>
              <option value={120}>120 days (16 weeks)</option>
            </select>
          </div>
        </div>

        <div className="space-y-5">
          {/* Primary Goals */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Primary Goals</label>
            <div className="space-y-2 mb-2">
              {campaign.primaryGoals.map((goal, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <Target size={12} className="text-accent flex-shrink-0" />
                  <span className="text-sm flex-1">{goal}</span>
                  <button onClick={() => updateCampaign({ primaryGoals: campaign.primaryGoals.filter((_, j) => j !== i) })} className="text-muted hover:text-red-400">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGoal()}
                placeholder="Add a goal..."
                className="flex-1 bg-white/5 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
              <button onClick={addGoal} className="p-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-accent transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* KPI Targets */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">KPI Targets</label>
            <div className="space-y-2 mb-2">
              {campaign.kpiTargets.map((kpi, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <TrendingUp size={12} className="text-green-400 flex-shrink-0" />
                  <span className="text-sm flex-1">{kpi.metric}: <strong className="text-accent">{kpi.target}</strong></span>
                  <button onClick={() => updateCampaign({ kpiTargets: campaign.kpiTargets.filter((_, j) => j !== i) })} className="text-muted hover:text-red-400">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newKpiMetric}
                onChange={(e) => setNewKpiMetric(e.target.value)}
                placeholder="Metric (e.g. Impressions)"
                className="flex-1 bg-white/5 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
              <input
                value={newKpiTarget}
                onChange={(e) => setNewKpiTarget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKpi()}
                placeholder="Target (e.g. 10M)"
                className="w-32 bg-white/5 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
              <button onClick={addKpi} className="p-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-accent transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Sprint Phases Preview */}
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Sprint Phases</label>
            <div className="space-y-2">
              {campaign.phases.map((phase, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                  <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">{i + 1}</span>
                  <span className="text-sm font-medium">{phase.name}</span>
                  <span className="text-xs text-muted ml-auto">Weeks {phase.startWeek}-{phase.endWeek}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 3: Target Verticals
// ============================================================

const VERTICAL_ICONS: Record<string, React.ElementType> = {
  fashion: Palette, music: Music, sports: Trophy, gaming: Gamepad2,
  outdoors: Mountain, health: Heart, art: Brush, culture: Globe,
};

function StepVerticals() {
  const { verticals, toggleVertical, updateVerticalPriority } = useOnboardingStore();

  const allVerticals = Object.values(PLAY_VERTICALS);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose your industry verticals</h2>
        <p className="text-muted text-sm">Select the industries you want to stretch your brand into. The scraper and influencer agents will focus discovery and outreach on these verticals.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allVerticals.map((v) => {
          const isSelected = verticals.some((s) => s.vertical === v.id);
          const selection = verticals.find((s) => s.vertical === v.id);
          const VerticalIcon = VERTICAL_ICONS[v.id] || Globe;

          return (
            <div
              key={v.id}
              className={`relative rounded-xl border-2 p-5 transition-all cursor-pointer group ${
                isSelected
                  ? "border-white/30 bg-white/5"
                  : "border-border hover:border-white/10 hover:bg-white/[0.02]"
              }`}
            >
              <button
                onClick={() => toggleVertical(v.id)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${v.color}20` }}
                  >
                    <VerticalIcon size={20} style={{ color: v.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{v.label}</h4>
                    <p className="text-[10px] text-muted">{v.subTags.length} sub-tags</p>
                  </div>
                  {isSelected && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted leading-relaxed">{v.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {v.subTags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted">{tag}</span>
                  ))}
                  {v.subTags.length > 4 && (
                    <span className="text-[9px] px-1.5 py-0.5 text-muted">+{v.subTags.length - 4} more</span>
                  )}
                </div>
              </button>

              {/* Priority selector */}
              {isSelected && selection && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-1">
                  {(["primary", "secondary", "explore"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateVerticalPriority(v.id, p)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium capitalize transition-colors ${
                        selection.priority === p
                          ? p === "primary" ? "bg-accent text-white" : p === "secondary" ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-gray-300"
                          : "bg-white/5 text-muted hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {verticals.length > 0 && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bot size={16} className="text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Scraper Configuration</span>
          </div>
          <p className="text-sm text-gray-300">
            The AI scraper will monitor <strong className="text-white">{verticals.length} verticals</strong> —{" "}
            {verticals.filter((v) => v.priority === "primary").length > 0 && (
              <>Primary focus: <strong className="text-white">{verticals.filter((v) => v.priority === "primary").map((v) => PLAY_VERTICALS[v.vertical].label).join(", ")}</strong>. </>
            )}
            {verticals.filter((v) => v.priority === "secondary").length > 0 && (
              <>Secondary: <strong className="text-white">{verticals.filter((v) => v.priority === "secondary").map((v) => PLAY_VERTICALS[v.vertical].label).join(", ")}</strong>. </>
            )}
            All vertical keywords will be fed into the discovery engine for autonomous influencer finding.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Step 4: Social Platforms & APIs
// ============================================================

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram, tiktok: Zap, youtube: Youtube, twitter: Hash,
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E1306C", tiktok: "#000000", youtube: "#FF0000", twitter: "#1DA1F2",
};

function StepPlatforms() {
  const { platforms, updatePlatform } = useOnboardingStore();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Connect your social platforms</h2>
        <p className="text-muted text-sm">Enable platforms and enter your handles. API connections can be configured later in Settings — this gets the agents started.</p>
      </div>

      <div className="space-y-4">
        {platforms.map((p) => {
          const PlatIcon = PLATFORM_ICONS[p.platform] || Globe;
          const color = PLATFORM_COLORS[p.platform] || "#6366F1";

          return (
            <div
              key={p.platform}
              className={`rounded-xl border p-5 transition-all ${
                p.enabled ? "border-white/20 bg-white/[0.03]" : "border-border opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <PlatIcon size={24} style={{ color }} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-bold capitalize">{p.platform === "twitter" ? "Twitter / X" : p.platform}</h4>
                    <button
                      onClick={() => updatePlatform(p.platform, { enabled: !p.enabled })}
                      className={`relative w-10 h-5 rounded-full transition-colors ${p.enabled ? "bg-green-500" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${p.enabled ? "left-5.5 translate-x-0" : "left-0.5"}`}
                        style={{ left: p.enabled ? "22px" : "2px" }}
                      />
                    </button>
                    {p.enabled && (
                      <span className="text-[10px] text-green-400 font-medium">Enabled</span>
                    )}
                  </div>

                  {p.enabled && (
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                        <input
                          value={p.handle}
                          onChange={(e) => updatePlatform(p.platform, { handle: e.target.value })}
                          placeholder="your_handle"
                          className="w-full bg-white/5 border border-border rounded-lg pl-7 pr-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
                        />
                      </div>

                      <select
                        value={p.priority}
                        onChange={(e) => updatePlatform(p.platform, { priority: Number(e.target.value) })}
                        className="bg-white/5 border border-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value={1}>Priority 1 (Primary)</option>
                        <option value={2}>Priority 2</option>
                        <option value={3}>Priority 3</option>
                        <option value={4}>Priority 4</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {p.enabled && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.contentTypes.map((ct) => (
                    <span key={ct} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted capitalize">{ct}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Step 5: Influencer Strategy
// ============================================================
function StepInfluencer() {
  const { influencer, updateInfluencer } = useOnboardingStore();
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = () => {
    if (newKeyword.trim() && !influencer.nicheKeywords.includes(newKeyword.trim())) {
      updateInfluencer({ nicheKeywords: [...influencer.nicheKeywords, newKeyword.trim()] });
      setNewKeyword("");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Define your influencer strategy</h2>
        <p className="text-muted text-sm">Configure the autonomous scraper and outreach engine. Everything here runs on autopilot — the AI finds, qualifies, and contacts creators for you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          {/* Tier Allocation */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Creator Tier Allocation</h4>
            <div className="space-y-4">
              {influencer.tierAllocation.map((tier) => (
                <div key={tier.tier} className="flex items-center gap-4">
                  <span className="text-xs font-medium capitalize w-16" style={{
                    color: tier.tier === "mega" ? "#EF4444" : tier.tier === "macro" ? "#F59E0B" : tier.tier === "mid" ? "#3B82F6" : tier.tier === "micro" ? "#22C55E" : "#6B7280"
                  }}>{tier.tier}</span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] text-muted">Count:</label>
                      <input
                        type="number"
                        value={tier.targetCount}
                        onChange={(e) => {
                          const updated = influencer.tierAllocation.map((t) =>
                            t.tier === tier.tier ? { ...t, targetCount: Number(e.target.value) } : t
                          );
                          updateInfluencer({ tierAllocation: updated });
                        }}
                        className="w-16 bg-white/5 border border-border rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-accent/50"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] text-muted">Max $:</label>
                      <input
                        type="number"
                        value={tier.maxFee}
                        onChange={(e) => {
                          const updated = influencer.tierAllocation.map((t) =>
                            t.tier === tier.tier ? { ...t, maxFee: Number(e.target.value) } : t
                          );
                          updateInfluencer({ tierAllocation: updated });
                        }}
                        className="w-24 bg-white/5 border border-border rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-accent/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted">Total target creators:</span>
                <span className="font-bold text-accent">{influencer.tierAllocation.reduce((s, t) => s + t.targetCount, 0)}</span>
              </div>
            </div>
          </div>

          {/* Scraper Settings */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Scraper Engine Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-muted block mb-1">Min Followers</label>
                <input
                  type="number"
                  value={influencer.minFollowers}
                  onChange={(e) => updateInfluencer({ minFollowers: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted block mb-1">Min Engagement %</label>
                <input
                  type="number"
                  step="0.1"
                  value={influencer.minEngagement}
                  onChange={(e) => updateInfluencer({ minEngagement: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted block mb-1">Scan Interval</label>
                <select
                  value={influencer.scraperScanInterval}
                  onChange={(e) => updateInfluencer({ scraperScanInterval: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value={15}>Every 15 min</option>
                  <option value={30}>Every 30 min</option>
                  <option value={60}>Every hour</option>
                  <option value={120}>Every 2 hours</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted block mb-1">Max DMs / Day</label>
                <input
                  type="number"
                  value={influencer.autoOutreachMaxPerDay}
                  onChange={(e) => updateInfluencer({ autoOutreachMaxPerDay: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <label className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => updateInfluencer({ autoOutreach: !influencer.autoOutreach })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${influencer.autoOutreach ? "bg-green-500" : "bg-white/10"}`}
                >
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ left: influencer.autoOutreach ? "22px" : "2px" }}
                  />
                </button>
                Auto-Outreach
              </label>
              <label className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => updateInfluencer({ scraperEnabled: !influencer.scraperEnabled })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${influencer.scraperEnabled ? "bg-green-500" : "bg-white/10"}`}
                >
                  <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ left: influencer.scraperEnabled ? "22px" : "2px" }}
                  />
                </button>
                Scraper Engine
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Niche Keywords */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Discovery Keywords</h4>
            <p className="text-[10px] text-muted mb-3">The scraper uses these keywords to find relevant creators across all platforms</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {influencer.nicheKeywords.map((kw) => (
                <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs">
                  {kw}
                  <button onClick={() => updateInfluencer({ nicheKeywords: influencer.nicheKeywords.filter((k) => k !== kw) })} className="hover:text-white">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                placeholder="Add keyword (e.g. streetwear, hip-hop)"
                className="flex-1 bg-white/5 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
              />
              <button onClick={addKeyword} className="p-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-accent transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Outreach Tone */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Outreach Tone</h4>
            <div className="grid grid-cols-2 gap-2">
              {(["professional", "casual", "luxury", "creative"] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => updateInfluencer({ outreachTone: tone })}
                  className={`py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                    influencer.outreachTone === tone
                      ? "bg-accent text-white ring-1 ring-accent/50"
                      : "bg-white/5 text-muted hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tone === "professional" && "🤝 "}
                  {tone === "casual" && "✌️ "}
                  {tone === "luxury" && "💎 "}
                  {tone === "creative" && "🎨 "}
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 6: Budget Allocation
// ============================================================
function StepBudget() {
  const { budget, updateBudget, updateAgentAllocation } = useOnboardingStore();

  const totalAllocated = budget.agentAllocations.reduce((s, a) => s + a.allocated, 0);
  const remaining = budget.totalBudget - totalAllocated;

  const AGENT_COLORS: Record<string, string> = {
    orchestrator: "#6C63FF", retail: "#448AFF", influencer: "#9C27B0",
    content: "#FF6B6B", events: "#26C6DA", budget: "#66BB6A", performance: "#FF9800",
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Set your budget</h2>
        <p className="text-muted text-sm">Define the total campaign budget and how it should be distributed across the 7 AI agents. The Budget Agent will monitor spend and alert you on variances.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5">
          {/* Total Budget */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Total Campaign Budget *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                  <input
                    type="number"
                    value={budget.totalBudget || ""}
                    onChange={(e) => updateBudget({ totalBudget: Number(e.target.value) })}
                    placeholder="1,000,000"
                    className="w-full bg-white/5 border border-border rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Currency</label>
                <select
                  value={budget.currency}
                  onChange={(e) => updateBudget({ currency: e.target.value })}
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Agent Allocations */}
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Agent Budget Allocation</h4>
            <div className="space-y-3">
              {budget.agentAllocations.map((agent) => {
                const pct = budget.totalBudget > 0 ? Math.round((agent.allocated / budget.totalBudget) * 100) : 0;
                return (
                  <div key={agent.agentId} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: AGENT_COLORS[agent.agentId] }} />
                    <span className="text-xs font-medium w-40 truncate">{agent.agentName}</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">$</span>
                      <input
                        type="number"
                        value={agent.allocated || ""}
                        onChange={(e) => updateAgentAllocation(agent.agentId, Number(e.target.value))}
                        className="w-full bg-white/5 border border-border rounded-lg pl-6 pr-3 py-2 text-xs focus:outline-none focus:border-accent/50"
                        placeholder="0"
                      />
                    </div>
                    <span className="text-xs text-muted w-10 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>

            {/* Allocation Bar */}
            {budget.totalBudget > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted">Allocated: ${totalAllocated.toLocaleString()}</span>
                  <span className={`font-medium ${remaining < 0 ? "text-red-400" : remaining === 0 ? "text-green-400" : "text-yellow-400"}`}>
                    {remaining < 0 ? "Over by " : "Remaining: "}${Math.abs(remaining).toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
                  {budget.agentAllocations.map((agent) => {
                    const w = budget.totalBudget > 0 ? (agent.allocated / budget.totalBudget) * 100 : 0;
                    return w > 0 ? (
                      <div
                        key={agent.agentId}
                        className="h-full transition-all"
                        style={{ width: `${w}%`, backgroundColor: AGENT_COLORS[agent.agentId] }}
                        title={`${agent.agentName}: $${agent.allocated.toLocaleString()}`}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Payment & Billing</h4>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-muted block mb-1">Payment Terms</label>
                <select
                  value={budget.paymentTerms}
                  onChange={(e) => updateBudget({ paymentTerms: e.target.value })}
                  className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="net15">Net 15</option>
                  <option value="net30">Net 30</option>
                  <option value="net45">Net 45</option>
                  <option value="net60">Net 60</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted block mb-1">Client Billing Frequency</label>
                <select
                  value={budget.clientBillingFrequency}
                  onChange={(e) => updateBudget({ clientBillingFrequency: e.target.value as "weekly" | "biweekly" | "monthly" })}
                  className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted block mb-1">Alert When Budget Hits</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={budget.alertThreshold}
                    onChange={(e) => updateBudget({ alertThreshold: Number(e.target.value) })}
                    className="w-20 bg-white/5 border border-border rounded-lg px-3 py-2 text-xs text-center focus:outline-none focus:border-accent/50"
                  />
                  <span className="text-xs text-muted">% of allocation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 7: Team & Permissions
// ============================================================
function StepTeam() {
  const { team, addTeamMember, removeTeamMember, updateTeamMember } = useOnboardingStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OnboardingTeamMember["role"]>("agency");

  const handleAdd = () => {
    if (name.trim() && email.trim()) {
      addTeamMember({
        id: `tm-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role,
        assignedAgents: [],
        receivesBriefs: true,
        receivesAlerts: role === "admin" || role === "agency",
      });
      setName("");
      setEmail("");
    }
  };

  const ROLE_LABELS: Record<string, { label: string; color: string }> = {
    admin: { label: "Admin", color: "#EF4444" },
    agency: { label: "Agency", color: "#6366F1" },
    creative_director: { label: "Creative Director", color: "#EC4899" },
    account_manager: { label: "Account Manager", color: "#F59E0B" },
    viewer: { label: "Viewer", color: "#6B7280" },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Add your team</h2>
        <p className="text-muted text-sm">Add team members who will receive daily briefs, action alerts, and have access to the command center. You can always add more later.</p>
      </div>

      {/* Add Member Form */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Add Team Member</h4>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[150px]">
            <label className="text-[10px] text-muted block mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Daniel George"
              className="w-full bg-white/5 border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-[10px] text-muted block mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="daniel@limitless.agency"
              className="w-full bg-white/5 border border-border rounded-lg px-3 py-2.5 text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
            />
          </div>
          <div className="w-48">
            <label className="text-[10px] text-muted block mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as OnboardingTeamMember["role"])}
              className="w-full bg-white/5 border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
            >
              <option value="admin">Admin</option>
              <option value="agency">Agency</option>
              <option value="creative_director">Creative Director</option>
              <option value="account_manager">Account Manager</option>
              <option value="viewer">Viewer (Read-Only)</option>
            </select>
          </div>
          <button onClick={handleAdd} className="px-4 py-2.5 bg-accent hover:bg-accent/90 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* Team List */}
      {team.length > 0 ? (
        <div className="space-y-3">
          {team.map((member) => {
            const roleInfo = ROLE_LABELS[member.role] || ROLE_LABELS.viewer;
            return (
              <div key={member.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold" style={{ color: roleInfo.color }}>
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{member.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${roleInfo.color}15`, color: roleInfo.color }}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-[10px] text-muted">
                    <input
                      type="checkbox"
                      checked={member.receivesBriefs}
                      onChange={(e) => updateTeamMember(member.id, { receivesBriefs: e.target.checked })}
                      className="rounded"
                    />
                    Briefs
                  </label>
                  <label className="flex items-center gap-1.5 text-[10px] text-muted">
                    <input
                      type="checkbox"
                      checked={member.receivesAlerts}
                      onChange={(e) => updateTeamMember(member.id, { receivesAlerts: e.target.checked })}
                      className="rounded"
                    />
                    Alerts
                  </label>
                  <button onClick={() => removeTeamMember(member.id)} className="p-1.5 rounded hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card/50 border border-border rounded-xl p-8 text-center">
          <Users size={32} className="mx-auto mb-3 text-muted" />
          <p className="text-sm text-muted">No team members added yet. You can skip this and add people later from Settings.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Step 8: Review & Launch
// ============================================================
function StepReview() {
  const { brand, campaign, verticals, platforms, influencer, budget, team, isStepValid, launchCampaign, isLaunched } = useOnboardingStore();

  const sections = [
    { label: "Brand Identity", step: "brand" as OnboardingStep, icon: Building2, color: "#6C63FF", summary: brand.brandName ? `${brand.brandName} — ${brand.tagline || brand.aesthetic || "Configured"}` : "Not configured", valid: isStepValid("brand") },
    { label: "Campaign Config", step: "campaign" as OnboardingStep, icon: Target, color: "#EC4899", summary: campaign.campaignName ? `${campaign.campaignName} — ${campaign.sprintDuration} days` : "Not configured", valid: isStepValid("campaign") },
    { label: "Target Verticals", step: "verticals" as OnboardingStep, icon: Globe, color: "#22C55E", summary: verticals.length > 0 ? `${verticals.length} verticals selected` : "None selected", valid: isStepValid("verticals") },
    { label: "Social Platforms", step: "platforms" as OnboardingStep, icon: Instagram, color: "#E1306C", summary: platforms.filter((p) => p.enabled).length > 0 ? `${platforms.filter((p) => p.enabled && p.handle).length} platforms connected` : "None connected", valid: isStepValid("platforms") },
    { label: "Influencer Strategy", step: "influencer" as OnboardingStep, icon: Users, color: "#9C27B0", summary: `${influencer.tierAllocation.reduce((s, t) => s + t.targetCount, 0)} target creators, ${influencer.nicheKeywords.length} keywords`, valid: isStepValid("influencer") },
    { label: "Budget", step: "budget" as OnboardingStep, icon: DollarSign, color: "#66BB6A", summary: budget.totalBudget > 0 ? `$${budget.totalBudget.toLocaleString()} total budget` : "Not set", valid: isStepValid("budget") },
    { label: "Team", step: "team" as OnboardingStep, icon: Shield, color: "#F59E0B", summary: team.length > 0 ? `${team.length} team members` : "No members added", valid: true },
  ];

  const allValid = sections.filter((s) => s.step !== "team").every((s) => s.valid);

  if (isLaunched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-pulse">
          <Rocket size={40} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Campaign Launched! 🚀</h2>
        <p className="text-muted text-center max-w-md mb-8">
          All 7 AI agents have been initialized with your configuration. The scraper engine is warming up, and your first morning brief will be ready tomorrow.
        </p>
        <a
          href="/"
          className="px-8 py-3 bg-accent hover:bg-accent/90 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
        >
          Enter Command Center
          <ArrowRight size={16} />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Launch</h2>
        <p className="text-muted text-sm">Review your configuration before launching. All 7 agents will be initialized with this data.</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.step} className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${section.valid ? "border-border" : "border-red-500/30"}`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${section.color}15` }}>
              <section.icon size={20} style={{ color: section.color }} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold">{section.label}</h4>
              <p className="text-xs text-muted">{section.summary}</p>
            </div>
            {section.valid ? (
              <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check size={14} className="text-green-400" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center">
                <X size={14} className="text-red-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Agent Preview */}
      <div className="bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 border border-accent/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-accent" />
          <h3 className="text-base font-bold">What Happens When You Launch</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Bot, label: "7 AI Agents", desc: "Initialize & calibrate" },
            { icon: Eye, label: "Scraper Engine", desc: "Start discovering creators" },
            { icon: Send, label: "Auto-Outreach", desc: "Begin personalized DMs" },
            { icon: Mail, label: "Morning Brief", desc: "Daily at 8:00 AM" },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 rounded-lg p-3">
              <item.icon size={16} className="text-accent mb-2" />
              <p className="text-xs font-semibold">{item.label}</p>
              <p className="text-[10px] text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={launchCampaign}
        disabled={!allValid}
        className={`w-full py-4 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-3 ${
          allValid
            ? "bg-gradient-to-r from-accent via-purple-500 to-pink-500 hover:opacity-90 text-white"
            : "bg-white/5 text-muted cursor-not-allowed"
        }`}
      >
        <Rocket size={20} />
        Launch Campaign
      </button>
      {!allValid && (
        <p className="text-center text-xs text-red-400">Please complete all required sections before launching.</p>
      )}
    </div>
  );
}

// ============================================================
// Main Onboarding Page
// ============================================================
export default function OnboardingPage() {
  const { currentStep, completedSteps, nextStep, prevStep, getCompletionPercentage } = useOnboardingStore();

  const stepMap: Record<OnboardingStep, React.ReactNode> = {
    brand: <StepBrand />,
    campaign: <StepCampaign />,
    verticals: <StepVerticals />,
    platforms: <StepPlatforms />,
    influencer: <StepInfluencer />,
    budget: <StepBudget />,
    team: <StepTeam />,
    review: <StepReview />,
  };

  const currentIdx = ONBOARDING_STEPS.findIndex((s) => s.id === currentStep);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === ONBOARDING_STEPS.length - 1;
  const completionPct = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">P</span>
              </div>
              <div>
                <h1 className="text-sm font-bold">PLAY Command Center</h1>
                <p className="text-[10px] text-muted">Campaign Onboarding</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">{completionPct}% complete</span>
              <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
          </div>
          <StepProgress currentStep={currentStep} completedSteps={completedSteps} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {stepMap[currentStep]}
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={isFirst}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isFirst ? "text-muted cursor-not-allowed" : "bg-white/5 text-white hover:bg-white/10 border border-border"
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-2">
            {ONBOARDING_STEPS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIdx ? "bg-accent w-6" : i < currentIdx ? "bg-green-500" : "bg-white/10"}`} />
            ))}
          </div>

          {!isLast && (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 rounded-xl text-sm font-medium transition-colors"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          )}
          {isLast && <div />}
        </div>
      </div>
    </div>
  );
}

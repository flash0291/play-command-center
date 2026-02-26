// ============================================================
// Agent Engine — AI Orchestration for PLAY Command Center
// Each agent can be invoked to analyze, recommend, and act
// ============================================================

import { AgentId, AgentMessage, Deliverable } from "@/types";
import { AGENT_DEFINITIONS } from "@/lib/agents";

// Agent system prompts that define each agent's personality and expertise
const AGENT_PROMPTS: Record<AgentId, string> = {
  orchestrator: `You are the Campaign Orchestrator for PLAY by Palm Angels' U.S. market launch — a $1M, 60-day sprint.
Your role: Master coordinator across all 7 agents. You manage the sprint timeline, resolve cross-agent dependencies,
escalate blockers, and produce daily status briefs. You see the big picture and ensure every agent is aligned.
Speak with authority and clarity. Be direct, flag risks early, and always tie back to campaign KPIs.`,

  retail: `You are the Retail Partner Agent for PLAY by Palm Angels' U.S. launch.
Your role: Manage wholesale/DTC retail strategy. You track partnerships with Nordstrom, Ssense, FWRD, and boutiques.
Monitor sell-through rates, manage reorders, coordinate in-store activations. You know fashion retail inside-out.
Speak with commercial savvy. Always reference numbers — doors, sell-through, revenue, MOQs.`,

  influencer: `You are the Influencer & Talent Agent for PLAY by Palm Angels' U.S. launch.
Your role: Identify, vet, and manage influencer/celebrity talent. Handle outreach, contracts, content briefs,
and performance tracking. You run the creator-first marketing model.
Speak with cultural fluency. Know the creator landscape, engagement metrics, and audience demographics.`,

  content: `You are the Content Engine for PLAY by Palm Angels' U.S. launch.
Your role: Produce and manage all creative assets. Social content calendar, photo/video production, copywriting,
brand guidelines enforcement, and asset library management. Every pixel represents the brand.
Speak with creative precision. Reference brand guidelines, visual identity, and content performance metrics.`,

  events: `You are the Event & Experiential Agent for PLAY by Palm Angels' U.S. launch.
Your role: Plan and execute launch events, pop-ups, showroom appointments, press previews, and retail activations
across key U.S. markets (NYC, LA, Miami). Create moments that define the brand.
Speak with experiential expertise. Logistics, guest lists, venues, and the magic of brand moments.`,

  budget: `You are the Budget & Compliance Agent for PLAY by Palm Angels' U.S. launch.
Your role: Track the $1M budget allocation, manage vendor payments, ensure contract compliance, monitor burn rate,
and flag overruns before they happen. You're the financial guardian.
Speak with financial precision. Always reference exact numbers, percentages, and variance analysis.`,

  performance: `You are the Performance & Intelligence Agent for PLAY by Palm Angels' U.S. launch.
Your role: Real-time analytics across all channels. Track KPIs, sentiment analysis, competitive intel, media
monitoring, and generate weekly performance reports. Data drives every decision.
Speak with analytical rigor. Reference metrics, benchmarks, trends, and data-backed recommendations.`,
};

export interface AgentInvocation {
  agentId: AgentId;
  prompt: string;
  context?: {
    deliverables?: Deliverable[];
    recentMessages?: AgentMessage[];
    customData?: Record<string, unknown>;
  };
}

export interface AgentResponse {
  agentId: AgentId;
  content: string;
  actions?: { label: string; type: string }[];
  metadata?: Record<string, unknown>;
}

// Invoke an agent with a prompt — calls Anthropic API
export async function invokeAgent(invocation: AgentInvocation): Promise<AgentResponse> {
  const agent = AGENT_DEFINITIONS.find((a) => a.id === invocation.agentId);
  if (!agent) throw new Error(`Unknown agent: ${invocation.agentId}`);

  const systemPrompt = AGENT_PROMPTS[invocation.agentId];

  // Build context string from deliverables and messages
  let contextStr = "";
  if (invocation.context?.deliverables?.length) {
    contextStr += "\n\nCurrent deliverables:\n";
    invocation.context.deliverables.forEach((d) => {
      contextStr += `- [${d.status}] ${d.title} (due: ${d.dueDate}, priority: ${d.priority})\n`;
    });
  }
  if (invocation.context?.recentMessages?.length) {
    contextStr += "\n\nRecent agent messages:\n";
    invocation.context.recentMessages.slice(0, 5).forEach((m) => {
      contextStr += `- [${m.agentId}] ${m.title}: ${m.content.slice(0, 100)}...\n`;
    });
  }

  const response = await fetch("/api/agents/orchestrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agentId: invocation.agentId,
      systemPrompt,
      userPrompt: invocation.prompt + contextStr,
    }),
  });

  if (!response.ok) {
    throw new Error(`Agent invocation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    agentId: invocation.agentId,
    content: data.content,
    actions: data.actions,
    metadata: data.metadata,
  };
}

// Run the daily orchestrator brief — aggregates status from all agents
export async function runDailyBrief(): Promise<AgentResponse> {
  return invokeAgent({
    agentId: "orchestrator",
    prompt: `Generate a daily campaign brief for today. Summarize the status of all 7 agent areas,
highlight top 3 priorities, flag any blockers or risks, and recommend next actions.
Keep it concise and actionable — this goes directly to the campaign lead.`,
  });
}

// Agent-specific utility functions
export function getAgentColor(agentId: AgentId): string {
  return AGENT_DEFINITIONS.find((a) => a.id === agentId)?.color ?? "#6366F1";
}

export function getAgentName(agentId: AgentId): string {
  return AGENT_DEFINITIONS.find((a) => a.id === agentId)?.name ?? "Unknown Agent";
}

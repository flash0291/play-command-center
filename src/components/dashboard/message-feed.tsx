"use client";

import { useCampaignStore } from "@/store/campaign-store";
import { AgentMessage } from "@/types";
import { getAgentColor, getAgentName } from "@/agents/engine";
import { AlertCircle, Lightbulb, Zap, BarChart3, MessageCircle, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const TYPE_ICONS: Record<string, React.ElementType> = {
  action: Zap,
  insight: Lightbulb,
  alert: AlertCircle,
  recommendation: MessageCircle,
  status: BarChart3,
};

function MessageCard({ message }: { message: AgentMessage }) {
  const { markMessageRead, executeAction } = useCampaignStore();
  const Icon = TYPE_ICONS[message.type] || MessageCircle;
  const agentColor = getAgentColor(message.agentId);
  const agentName = getAgentName(message.agentId);

  return (
    <div
      className={`bg-card border rounded-xl p-4 transition-all hover:border-white/10 animate-slide-up ${
        !message.read ? "border-accent/30" : "border-border"
      }`}
      onClick={() => !message.read && markMessageRead(message.id)}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: `${agentColor}15` }}
        >
          <Icon size={16} style={{ color: agentColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${agentColor}15`, color: agentColor }}>
              {agentName}
            </span>
            <span className="text-[10px] text-muted">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
            {!message.read && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </div>
          <h4 className="text-sm font-semibold mb-1">{message.title}</h4>
          <p className="text-xs text-muted leading-relaxed">{message.content}</p>

          {message.actions && message.actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {message.actions.map((action) => {
                const styles: Record<string, string> = {
                  approve: "bg-green-500/10 text-green-400 hover:bg-green-500/20",
                  reject: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
                  modify: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
                  escalate: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20",
                  defer: "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20",
                };
                return (
                  <button
                    key={action.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      executeAction(message.id, action.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${styles[action.type] || styles.defer}`}
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MessageFeed() {
  const { messages } = useCampaignStore();
  const sorted = [...messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Agent Feed</h3>
        <Link href="/messages" className="text-xs text-accent hover:text-accent/80 flex items-center gap-1">
          View All <ChevronRight size={12} />
        </Link>
      </div>
      <div className="space-y-3">
        {sorted.slice(0, 6).map((msg) => (
          <MessageCard key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}

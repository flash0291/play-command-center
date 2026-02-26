"use client";

import { AgentStatus, DeliverableStatus, Priority } from "@/types";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  // Agent statuses
  running: { bg: "bg-green-500/10", text: "text-green-400", label: "Running" },
  idle: { bg: "bg-gray-500/10", text: "text-gray-400", label: "Idle" },
  completed: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Completed" },
  error: { bg: "bg-red-500/10", text: "text-red-400", label: "Error" },
  waiting: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Waiting" },
  // Deliverable statuses
  not_started: { bg: "bg-gray-500/10", text: "text-gray-400", label: "Not Started" },
  in_progress: { bg: "bg-blue-500/10", text: "text-blue-400", label: "In Progress" },
  in_review: { bg: "bg-purple-500/10", text: "text-purple-400", label: "In Review" },
  overdue: { bg: "bg-red-500/10", text: "text-red-400", label: "Overdue" },
  blocked: { bg: "bg-orange-500/10", text: "text-orange-400", label: "Blocked" },
};

const priorityStyles: Record<Priority, { bg: string; text: string }> = {
  critical: { bg: "bg-red-500/10", text: "text-red-400" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400" },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
  low: { bg: "bg-gray-500/10", text: "text-gray-400" },
};

export function StatusBadge({ status }: { status: AgentStatus | DeliverableStatus }) {
  const style = statusStyles[status] || statusStyles.idle;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "running" ? "status-running animate-pulse-dot" : ""} ${style.text.replace("text-", "bg-")}`} />
      {style.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const style = priorityStyles[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${style.bg} ${style.text}`}>
      {priority}
    </span>
  );
}

"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { TimelineView } from "@/components/timeline/timeline-view";
import { AgentDetail } from "@/components/agents/agent-detail";
import { useCampaignStore } from "@/store/campaign-store";

export default function TimelinePage() {
  const { sidebarOpen, selectedAgent } = useCampaignStore();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-[72px]"}`}>
        <Header />
        <main className="p-6">
          <h2 className="text-xl font-bold mb-6">60-Day Sprint Timeline</h2>
          <TimelineView />
        </main>
      </div>
      {selectedAgent && <AgentDetail />}
    </div>
  );
}

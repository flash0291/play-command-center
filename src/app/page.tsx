"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { StatsRow } from "@/components/dashboard/stats-row";
import { AgentGrid } from "@/components/dashboard/agent-grid";
import { MessageFeed } from "@/components/dashboard/message-feed";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { DeliverablesTable } from "@/components/dashboard/deliverables-table";
import { AgentDetail } from "@/components/agents/agent-detail";
import { useCampaignStore } from "@/store/campaign-store";

export default function Dashboard() {
  const { sidebarOpen, selectedAgent } = useCampaignStore();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-[72px]"}`}>
        <Header />
        <main className="p-6 space-y-6">
          {/* Stats Overview */}
          <StatsRow />

          {/* Agent Grid */}
          <AgentGrid />

          {/* Two-column: Deliverables + Budget/Messages */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <DeliverablesTable />
            </div>
            <div className="space-y-6">
              <BudgetChart />
            </div>
          </div>

          {/* Message Feed */}
          <MessageFeed />
        </main>
      </div>

      {/* Agent Detail Slide-Over */}
      {selectedAgent && <AgentDetail />}
    </div>
  );
}

"use client";

import { useCampaignStore } from "@/store/campaign-store";
import {
  Brain,
  Store,
  Users,
  Palette,
  CalendarDays,
  DollarSign,
  BarChart3,
  LayoutDashboard,
  Clock,
  CheckSquare,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  UserPlus,
} from "lucide-react";

const AGENT_ICONS: Record<string, React.ElementType> = {
  Brain, Store, Users, Palette, CalendarDays, DollarSign, BarChart3,
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "timeline", label: "Timeline", icon: Clock, href: "/timeline" },
  { id: "deliverables", label: "Deliverables", icon: CheckSquare, href: "/deliverables" },
  { id: "influencers", label: "Influencer CRM", icon: UserPlus, href: "/influencers" },
  { id: "scraper", label: "Scraper Engine", icon: Bot, href: "/scraper" },
];

export function Sidebar() {
  const { agents, sidebarOpen, toggleSidebar, selectedAgent, setSelectedAgent, messages } = useCampaignStore();
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-card border-r border-border z-40 transition-all duration-300 flex flex-col ${
        sidebarOpen ? "w-64" : "w-[72px]"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold">P</span>
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold truncate">PLAY Command</h1>
              <p className="text-[10px] text-muted truncate">Palm Angels</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarOpen && <p className="text-[10px] uppercase tracking-wider text-muted mb-2 px-2">Navigation</p>}
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors group"
          >
            <item.icon size={18} className="flex-shrink-0 group-hover:text-accent" />
            {sidebarOpen && <span>{item.label}</span>}
          </a>
        ))}

        {/* Messages */}
        <a
          href="#messages"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors group relative"
        >
          <MessageSquare size={18} className="flex-shrink-0 group-hover:text-accent" />
          {sidebarOpen && <span>Messages</span>}
          {unreadCount > 0 && (
            <span className="absolute right-2 top-1.5 w-5 h-5 bg-accent rounded-full text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </a>

        {/* Agents */}
        <div className="pt-4">
          {sidebarOpen && <p className="text-[10px] uppercase tracking-wider text-muted mb-2 px-2">Agents</p>}
          {agents.map((agent) => {
            const Icon = AGENT_ICONS[agent.icon] || Brain;
            const isSelected = selectedAgent === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isSelected
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={18} style={{ color: agent.color }} />
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full status-${agent.status}`}
                  />
                </div>
                {sidebarOpen && (
                  <div className="min-w-0 text-left">
                    <p className="truncate">{agent.name.split(" ").slice(0, 2).join(" ")}</p>
                    <p className="text-[10px] text-muted">{agent.activeTasks} active</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings + Collapse */}
      <div className="border-t border-border p-3 space-y-1">
        <a
          href="#settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings size={18} />
          {sidebarOpen && <span>Settings</span>}
        </a>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          {sidebarOpen && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

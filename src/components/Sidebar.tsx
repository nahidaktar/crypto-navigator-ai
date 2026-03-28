import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Bot, BookOpen, Wallet, History, TrendingUp,
  Settings, ChevronLeft, ChevronRight, LayoutDashboard, Sparkles
} from "lucide-react";
import UserProfileMenu from "@/components/UserProfileMenu";
import logo from "@/assets/logo.jpg";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "trading", label: "AI Trading", icon: TrendingUp },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "portfolio", label: "Portfolio", icon: Wallet },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "history", label: "History", icon: History },
  { id: "learn", label: "Learn & Earn", icon: BookOpen },
  { id: "ai-chat", label: "AI Assistant", icon: Bot },
  { id: "monad", label: "Monad", icon: Sparkles },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      className="h-screen glass-card border-r border-border/50 flex flex-col justify-between sticky top-0 z-30"
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <img src={logo} alt="MonX" className="w-8 h-8 rounded-lg" />
                <span className="text-lg font-bold text-gradient">MonX</span>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && <img src={logo} alt="MonX" className="w-8 h-8 rounded-lg" />}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  active
                    ? "bg-primary/15 text-primary glow-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2">
            <UserProfileMenu />
          </div>
        )}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors text-sm">
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </motion.aside>
  );
}

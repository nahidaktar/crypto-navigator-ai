import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHome from "@/components/DashboardHome";
import AITradingPanel from "@/components/AITradingPanel";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import PortfolioPanel from "@/components/PortfolioPanel";
import HistoryPanel from "@/components/HistoryPanel";
import LearnPanel from "@/components/LearnPanel";
import AIChatPanel from "@/components/AIChatPanel";
import MonadPanel from "@/components/MonadPanel";
import MarketOverview from "@/components/MarketOverview";
import WalletPanel from "@/components/WalletPanel";
import SplashScreen from "@/components/SplashScreen";

const PANELS: Record<string, React.FC> = {
  dashboard: DashboardHome,
  trading: AITradingPanel,
  analytics: AnalyticsPanel,
  portfolio: PortfolioPanel,
  wallet: WalletPanel,
  history: HistoryPanel,
  learn: LearnPanel,
  "ai-chat": AIChatPanel,
  monad: MonadPanel,
};

export default function Index() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  const ActivePanel = PANELS[activeTab] || DashboardHome;
  const showMarketSidebar = ["dashboard", "trading", "analytics"].includes(activeTab);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className="flex min-h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 flex">
          <div className="flex-1 p-6 overflow-y-auto max-h-screen">
            <ActivePanel />
          </div>
          {showMarketSidebar && (
            <aside className="w-80 border-l border-border/30 p-4 overflow-y-auto max-h-screen hidden xl:block">
              <MarketOverview />
            </aside>
          )}
        </main>
      </div>
    </>
  );
}

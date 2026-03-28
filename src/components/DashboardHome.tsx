import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, BarChart3, Brain, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getMarketData, getAISignal, type CryptoPrice } from "@/lib/api";

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: any; label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`glass-card p-5 space-y-2 ${accent ? "border-primary/30 glow-primary" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className={`w-4 h-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <p className="text-2xl font-bold font-mono">{value}</p>
      <p className={`text-xs flex items-center gap-1 ${sub.startsWith("+") ? "text-chart-up" : sub.startsWith("-") ? "text-chart-down" : "text-muted-foreground"}`}>
        {sub.startsWith("+") ? <ArrowUpRight className="w-3 h-3" /> : sub.startsWith("-") ? <ArrowDownRight className="w-3 h-3" /> : null}
        {sub}
      </p>
    </div>
  );
}

export default function DashboardHome() {
  const [topCoins, setTopCoins] = useState<CryptoPrice[]>([]);
  const [displayName, setDisplayName] = useState("Trader");

  useEffect(() => {
    setTopCoins(getMarketData().slice(0, 6));
    const id = setInterval(() => setTopCoins(getMarketData().slice(0, 6)), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    import("@/integrations/supabase/client").then(async ({ supabase }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", session.user.id)
          .single();
        if (data?.display_name) setDisplayName(data.display_name);
      }
    });
  }, []);

  const signal = getAISignal("BTC");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {displayName}</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your market overview for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Portfolio Value" value="$127,843" sub="+3.42% today" accent />
        <StatCard icon={BarChart3} label="24h Volume" value="$4.2B" sub="+12% vs yesterday" />
        <StatCard icon={Brain} label="AI Accuracy" value="87.3%" sub="Last 30 days" />
        <StatCard icon={TrendingUp} label="Active Trades" value="5" sub="3 profitable" />
      </div>

      <div className="glass-card p-5 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> AI Top Signal
          </h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            signal.action === "BUY" ? "bg-chart-up/15 text-chart-up" :
            signal.action === "SELL" ? "bg-chart-down/15 text-chart-down" :
            "bg-warning/15 text-warning"
          }`}>{signal.action} BTC</span>
        </div>
        <p className="text-sm text-muted-foreground">{signal.reason}</p>
        <p className="text-xs text-muted-foreground mt-2 font-mono">Confidence: {signal.confidence.toFixed(1)}%</p>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Top Movers</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {topCoins.map((coin, i) => (
            <motion.div
              key={coin.symbol}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                    {coin.symbol.slice(0, 3)}
                  </div>
                  <span className="font-semibold text-sm">{coin.symbol}</span>
                </div>
                <span className={`text-xs font-mono ${coin.change24h >= 0 ? "text-chart-up" : "text-chart-down"}`}>
                  {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                </span>
              </div>
              <p className="font-mono font-bold">${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

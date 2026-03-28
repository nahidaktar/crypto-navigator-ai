import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getMarketData, type CryptoPrice } from "@/lib/api";

function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 80},${40 - ((v - min) / range) * 36}`).join(" ");
  return (
    <svg width="80" height="40" className="flex-shrink-0">
      <polyline fill="none" stroke={up ? "hsl(162 78% 50%)" : "hsl(0 72% 55%)"} strokeWidth="1.5" points={points} />
    </svg>
  );
}

export default function MarketOverview() {
  const [data, setData] = useState<CryptoPrice[]>([]);

  useEffect(() => {
    setData(getMarketData());
    const interval = setInterval(() => setData(getMarketData()), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Market Overview</h2>
        <span className="text-xs text-muted-foreground font-mono animate-pulse-glow flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary" /> LIVE
        </span>
      </div>
      <div className="grid gap-3">
        {data.map((coin, i) => (
          <motion.div
            key={coin.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card p-4 flex items-center justify-between hover:border-primary/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-primary flex-shrink-0">
                {coin.symbol.slice(0, 3)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">{coin.name}</p>
                <p className="text-xs text-muted-foreground">{coin.symbol}/USDT</p>
              </div>
            </div>
            <MiniSparkline data={coin.sparkline} up={coin.change24h >= 0} />
            <div className="text-right">
              <p className="font-mono font-semibold text-sm">${coin.price < 1 ? coin.price.toFixed(6) : coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className={`text-xs font-mono flex items-center justify-end gap-0.5 ${coin.change24h >= 0 ? "text-chart-up" : "text-chart-down"}`}>
                {coin.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(coin.change24h).toFixed(2)}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { History, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRADES = [
  { id: 1, type: "buy", pair: "BTC/USDT", amount: "0.15 BTC", price: "$67,120", total: "$10,068", time: "2025-10-03 22:14", pnl: "+$312.40" },
  { id: 2, type: "sell", pair: "ETH/USDT", amount: "2.0 ETH", price: "$3,520", total: "$7,040", time: "2025-10-03 18:30", pnl: "+$180.00" },
  { id: 3, type: "buy", pair: "SOL/USDT", amount: "25 SOL", price: "$178.50", total: "$4,462.50", time: "2025-10-03 14:05", pnl: "-$87.50" },
  { id: 4, type: "buy", pair: "MONAD/USDT", amount: "500 MONAD", price: "$2.40", total: "$1,200", time: "2025-10-02 11:22", pnl: "+$25.00" },
  { id: 5, type: "sell", pair: "DOGE/USDT", amount: "10000 DOGE", price: "$0.165", total: "$1,650", time: "2025-10-02 09:15", pnl: "+$150.00" },
  { id: 6, type: "buy", pair: "LINK/USDT", amount: "100 LINK", price: "$14.30", total: "$1,430", time: "2025-10-01 16:45", pnl: "+$50.00" },
  { id: 7, type: "sell", pair: "ADA/USDT", amount: "5000 ADA", price: "$0.62", total: "$3,100", time: "2025-10-01 12:00", pnl: "-$155.00" },
  { id: 8, type: "buy", pair: "AVAX/USDT", amount: "30 AVAX", price: "$38.10", total: "$1,143", time: "2025-09-30 20:30", pnl: "+$45.60" },
];

export default function HistoryPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <History className="w-6 h-6 text-primary" /> Trade History
        </h2>
        <Button variant="outline" size="sm" className="text-xs">
          <Download className="w-3 h-3 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-7 gap-2 p-3 text-xs font-semibold text-muted-foreground border-b border-border/30">
          <span>Type</span><span>Pair</span><span>Amount</span><span>Price</span><span>Total</span><span>P&L</span><span>Time</span>
        </div>
        {TRADES.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-7 gap-2 p-3 text-sm items-center hover:bg-secondary/30 transition-colors border-b border-border/10"
          >
            <span className={`flex items-center gap-1 font-medium ${t.type === "buy" ? "text-chart-up" : "text-chart-down"}`}>
              {t.type === "buy" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {t.type.toUpperCase()}
            </span>
            <span className="font-medium">{t.pair}</span>
            <span className="font-mono text-xs">{t.amount}</span>
            <span className="font-mono text-xs">{t.price}</span>
            <span className="font-mono text-xs">{t.total}</span>
            <span className={`font-mono text-xs ${t.pnl.startsWith("+") ? "text-chart-up" : "text-chart-down"}`}>{t.pnl}</span>
            <span className="text-xs text-muted-foreground">{t.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

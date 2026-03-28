import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

const PORTFOLIO = [
  { name: "BTC", value: 45, amount: 0.82, price: 67234, color: "hsl(38 92% 55%)" },
  { name: "ETH", value: 25, amount: 4.2, price: 3521, color: "hsl(228 70% 60%)" },
  { name: "SOL", value: 12, amount: 42, price: 178.9, color: "hsl(162 78% 50%)" },
  { name: "MONAD", value: 8, amount: 1200, price: 2.45, color: "hsl(265 80% 65%)" },
  { name: "Others", value: 10, amount: 0, price: 0, color: "hsl(220 10% 40%)" },
];

const TOTAL_VALUE = 127843.50;

const HISTORY = [
  { type: "buy", asset: "SOL", amount: "+12 SOL", value: "$2,146.80", time: "2h ago", positive: true },
  { type: "sell", asset: "DOGE", amount: "-5000 DOGE", value: "$825.00", time: "5h ago", positive: false },
  { type: "buy", asset: "MONAD", amount: "+500 MONAD", value: "$1,225.00", time: "1d ago", positive: true },
  { type: "buy", asset: "ETH", amount: "+1.5 ETH", value: "$5,282.70", time: "2d ago", positive: true },
];

export default function PortfolioPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Wallet className="w-6 h-6 text-primary" /> Portfolio
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <p className="text-3xl font-bold font-mono">${TOTAL_VALUE.toLocaleString()}</p>
          <p className="text-sm text-chart-up flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +$4,231.20 (3.42%) today
          </p>
        </div>
        <div className="glass-card p-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PORTFOLIO} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                {PORTFOLIO.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(228 22% 11%)", border: "1px solid hsl(228 15% 18%)", borderRadius: "8px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">HOLDINGS</h3>
        {PORTFOLIO.filter(p => p.name !== "Others").map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: p.color + "30", color: p.color }}>{p.name}</div>
              <div>
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.amount} tokens</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-semibold">${(p.amount * p.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">{p.value}%</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">RECENT TRADES</h3>
        {HISTORY.map((h, i) => (
          <div key={i} className="glass-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${h.positive ? "bg-chart-up/10 text-chart-up" : "bg-chart-down/10 text-chart-down"}`}>
                {h.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">{h.amount}</p>
                <p className="text-xs text-muted-foreground">{h.time}</p>
              </div>
            </div>
            <p className="font-mono text-sm">{h.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

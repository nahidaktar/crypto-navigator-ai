import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";

const chartData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  btc: 60000 + Math.random() * 10000 + i * 200,
  eth: 3000 + Math.random() * 600 + i * 15,
}));

export default function AnalyticsPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" /> Market Analytics
      </h2>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">BTC / USDT — 30 Day</h3>
          <div className="flex gap-1">
            {["1D", "1W", "1M", "3M", "1Y"].map((t) => (
              <button key={t} className={`px-2 py-1 rounded text-xs ${t === "1M" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(162 78% 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(162 78% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 15% 18%)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(220 10% 55%)" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(220 10% 55%)" }} domain={["dataMin - 1000", "dataMax + 1000"]} />
            <Tooltip contentStyle={{ background: "hsl(228 22% 11%)", border: "1px solid hsl(228 15% 18%)", borderRadius: "8px", fontSize: "12px" }} />
            <Area type="monotone" dataKey="btc" stroke="hsl(162 78% 50%)" fill="url(#grad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "RSI (14)", value: "52.3", signal: "Neutral" },
          { label: "MACD", value: "Bullish", signal: "Crossover" },
          { label: "Bollinger", value: "Mid-band", signal: "Neutral" },
          { label: "EMA 200", value: "Above", signal: "Bullish" },
        ].map((ind) => (
          <div key={ind.label} className="glass-card p-4">
            <p className="text-xs text-muted-foreground">{ind.label}</p>
            <p className="font-bold text-sm mt-1">{ind.value}</p>
            <p className={`text-xs mt-0.5 ${ind.signal === "Bullish" ? "text-chart-up" : ind.signal === "Neutral" ? "text-warning" : "text-chart-down"}`}>
              {ind.signal}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

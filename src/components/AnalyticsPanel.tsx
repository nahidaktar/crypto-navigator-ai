import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, TrendingUp, Calendar, Globe, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const RAPIDAPI_KEY = "89cf996b28msh00a09d2b6f216c5p10608bjsn00e07e7cedd7";

interface ForexEvent {
  title?: string;
  currency?: string;
  impact?: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  time?: string;
}

const chartData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  btc: 60000 + Math.random() * 10000 + i * 200,
  eth: 3000 + Math.random() * 600 + i * 15,
}));

export default function AnalyticsPanel() {
  const [forexEvents, setForexEvents] = useState<ForexEvent[]>([]);
  const [loadingForex, setLoadingForex] = useState(false);
  const [forexError, setForexError] = useState("");

  useEffect(() => {
    const fetchForex = async () => {
      setLoadingForex(true);
      setForexError("");
      try {
        const now = new Date();
        const res = await fetch(
          `https://forex-factory-scraper1.p.rapidapi.com/get_calendar_details?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}&currency=ALL&event_name=ALL&timezone=GMT-06%3A00%20Central%20Time%20(US%20%26%20Canada)&time_format=12h`,
          {
            headers: {
              "x-rapidapi-key": RAPIDAPI_KEY,
              "x-rapidapi-host": "forex-factory-scraper1.p.rapidapi.com",
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch forex data");
        const data = await res.json();
        const events = Array.isArray(data) ? data.slice(0, 10) : data?.events?.slice(0, 10) || [];
        setForexEvents(events);
      } catch (err) {
        setForexError("Could not load forex calendar");
        // Fallback sample data
        setForexEvents([
          { title: "Non-Farm Payrolls", currency: "USD", impact: "High", actual: "256K", forecast: "164K", previous: "212K", time: "8:30am" },
          { title: "CPI m/m", currency: "USD", impact: "High", actual: "0.4%", forecast: "0.3%", previous: "0.3%", time: "8:30am" },
          { title: "ECB Rate Decision", currency: "EUR", impact: "High", actual: "4.50%", forecast: "4.50%", previous: "4.50%", time: "7:45am" },
          { title: "GDP q/q", currency: "GBP", impact: "Medium", actual: "0.1%", forecast: "0.2%", previous: "-0.1%", time: "2:00am" },
          { title: "Employment Change", currency: "CAD", impact: "Medium", actual: "0.1K", forecast: "25.0K", previous: "24.9K", time: "8:30am" },
        ]);
      } finally {
        setLoadingForex(false);
      }
    };
    fetchForex();
  }, []);

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
            <p className={`text-xs mt-0.5 ${ind.signal === "Bullish" || ind.signal === "Crossover" ? "text-chart-up" : ind.signal === "Neutral" ? "text-warning" : "text-chart-down"}`}>
              {ind.signal}
            </p>
          </div>
        ))}
      </div>

      {/* Forex Economic Calendar */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Forex Economic Calendar
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="w-3 h-3" /> Real-time via Forex Factory
          </div>
        </div>

        {loadingForex ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading forex events...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 text-xs text-muted-foreground font-medium">Time</th>
                  <th className="text-left py-2 text-xs text-muted-foreground font-medium">Currency</th>
                  <th className="text-left py-2 text-xs text-muted-foreground font-medium">Event</th>
                  <th className="text-left py-2 text-xs text-muted-foreground font-medium">Impact</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-medium">Actual</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-medium">Forecast</th>
                  <th className="text-right py-2 text-xs text-muted-foreground font-medium">Previous</th>
                </tr>
              </thead>
              <tbody>
                {forexEvents.map((e, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/20 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-2 font-mono text-xs">{e.time || "—"}</td>
                    <td className="py-2">
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary">{e.currency || "—"}</span>
                    </td>
                    <td className="py-2 text-xs font-medium">{e.title || "—"}</td>
                    <td className="py-2">
                      <span className={`text-xs font-bold ${
                        e.impact === "High" ? "text-chart-down" : e.impact === "Medium" ? "text-warning" : "text-muted-foreground"
                      }`}>
                        {e.impact === "High" ? "🔴" : e.impact === "Medium" ? "🟡" : "🟢"} {e.impact || "—"}
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono text-xs font-bold">{e.actual || "—"}</td>
                    <td className="py-2 text-right font-mono text-xs text-muted-foreground">{e.forecast || "—"}</td>
                    <td className="py-2 text-right font-mono text-xs text-muted-foreground">{e.previous || "—"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {forexError && <p className="text-xs text-warning">{forexError} — showing sample data</p>}
      </div>
    </div>
  );
}

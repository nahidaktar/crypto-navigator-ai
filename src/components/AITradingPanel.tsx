import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Shield, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getAISignal } from "@/lib/api";
import { Button } from "@/components/ui/button";

const POPULAR = ["BTC", "ETH", "SOL", "BNB", "MONAD", "AVAX", "ADA", "LINK"];

interface Signal {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reason: string;
}

export default function AITradingPanel() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [mode, setMode] = useState<"auto" | "semi" | "manual">("semi");
  const [scanning, setScanning] = useState(false);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setSignals(POPULAR.map((s) => ({ symbol: s, ...getAISignal(s) })));
      setScanning(false);
    }, 1500);
  };

  const actionColors = { BUY: "text-chart-up", SELL: "text-chart-down", HOLD: "text-warning" };
  const actionIcons = { BUY: TrendingUp, SELL: TrendingDown, HOLD: Minus };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" /> AI Trading Engine
        </h2>
        <div className="flex gap-1 glass-card p-1">
          {(["auto", "semi", "manual"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "semi" ? "Semi-Auto" : m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Zap, label: "Strategy", value: "Swing Trading", sub: "Multi-timeframe" },
          { icon: Shield, label: "Risk Level", value: "Medium", sub: "Stop-loss: -5%" },
          { icon: Brain, label: "AI Confidence", value: "87%", sub: "Last scan: 2m ago" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <s.icon className="w-4 h-4" />
              <span className="text-xs">{s.label}</span>
            </div>
            <p className="font-bold text-lg">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <Button onClick={runScan} disabled={scanning} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
        {scanning ? (
          <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
            Scanning Markets...
          </motion.span>
        ) : (
          <>
            <Brain className="w-4 h-4 mr-2" /> Run AI Market Scan
          </>
        )}
      </Button>

      {signals.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">AI SIGNALS</h3>
          {signals.map((sig, i) => {
            const Icon = actionIcons[sig.action];
            return (
              <motion.div
                key={sig.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-start justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-secondary ${actionColors[sig.action]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{sig.symbol}</span>
                      <span className={`text-xs font-bold ${actionColors[sig.action]}`}>{sig.action}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 max-w-md">{sig.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="font-mono font-bold text-sm">{sig.confidence.toFixed(1)}%</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Globe, Code, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Zap, title: "10,000+ TPS", desc: "Massively parallel transaction processing" },
  { icon: Shield, title: "MonadBFT", desc: "Byzantine fault-tolerant consensus" },
  { icon: Code, title: "EVM Compatible", desc: "Deploy existing Solidity contracts" },
  { icon: Globe, title: "Decentralized", desc: "True decentralization at scale" },
];

const ECOSYSTEM = [
  { name: "MonadSwap", type: "DEX", status: "Live" },
  { name: "MonadLend", type: "Lending", status: "Testnet" },
  { name: "MonadNFT", type: "NFT Marketplace", status: "Coming Soon" },
  { name: "MonadBridge", type: "Cross-chain", status: "Live" },
];

export default function MonadPanel() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-accent/20">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Monad</h2>
              <p className="text-sm text-muted-foreground">Next-Gen Parallel Execution Blockchain</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mb-4">
            Monad is a high-performance Layer 1 blockchain achieving 10,000+ TPS through parallel execution
            while maintaining full EVM compatibility. Build the future of DeFi on Monad.
          </p>
          <div className="flex gap-3">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent">
              <Sparkles className="w-4 h-4 mr-2" /> Explore Monad
            </Button>
            <Button variant="outline">View Docs</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 space-y-2"
          >
            <f.icon className="w-5 h-5 text-accent" />
            <p className="font-bold text-sm">{f.title}</p>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent" /> Ecosystem
        </h3>
        <div className="grid gap-3">
          {ECOSYSTEM.map((proj) => (
            <div key={proj.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-semibold text-sm">{proj.name}</p>
                <p className="text-xs text-muted-foreground">{proj.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  proj.status === "Live" ? "bg-chart-up/15 text-chart-up" :
                  proj.status === "Testnet" ? "bg-warning/15 text-warning" :
                  "bg-muted text-muted-foreground"
                }`}>{proj.status}</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold mb-3">MONAD/USDT Market</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Price", value: "$2.45" },
            { label: "24h Change", value: "+12.4%", green: true },
            { label: "Market Cap", value: "$2.94B" },
            { label: "Volume", value: "$847M" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`font-mono font-bold ${s.green ? "text-chart-up" : ""}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

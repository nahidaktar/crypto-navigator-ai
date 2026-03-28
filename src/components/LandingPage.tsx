import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, TrendingUp, BookOpen, Wallet, BarChart3, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import SplashScreen from "@/components/SplashScreen";

const FEATURES = [
  { icon: Bot, title: "AI Trading Agent", desc: "Real-time signals, technical analysis & automated insights powered by advanced AI" },
  { icon: TrendingUp, title: "Live Market Data", desc: "Crypto & forex analytics with real-time charts, indicators and calendar events" },
  { icon: BookOpen, title: "Learn & Earn", desc: "Gamified education with XP, badges, quests and step-by-step trading guides" },
  { icon: Wallet, title: "Multi-Wallet", desc: "Connect MetaMask, WalletConnect, Trust and more for seamless Web3 integration" },
  { icon: Sparkles, title: "Monad Integration", desc: "Explore the next-gen parallel execution blockchain with 10,000+ TPS" },
  { icon: BarChart3, title: "Forex Calendar", desc: "Real-time economic event tracking from Forex Factory for informed decisions" },
];

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [showSplash, setShowSplash] = useState(false);

  const handleClick = () => {
    setShowSplash(true);
  };

  const handleSplashDone = () => {
    setShowSplash(false);
    onGetStarted();
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashDone} />}
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, hsl(162 78% 50% / 0.15), transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, hsl(265 80% 65% / 0.12), transparent 70%)" }} />
        </div>

        {/* Nav */}
        <header className="relative z-10 flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MonX" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold text-gradient">MonX</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://docs.monad.xyz/" target="_blank" rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</a>
            <a href="https://app.monad.xyz/" target="_blank" rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">Monad</a>
          </div>
        </header>

        {/* Hero */}
        <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mb-6">
              <motion.div
                className="absolute inset-[-6px] rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, hsl(162 78% 50%), hsl(265 80% 65%), hsl(185 80% 55%), hsl(162 78% 50%))",
                  filter: "blur(8px)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative w-20 h-20 rounded-full border-2 border-border/50 overflow-hidden bg-background mx-auto">
                <img src={logo} alt="MonX" className="w-full h-full object-cover" />
              </div>
            </div>
          
            <p className="text-sm text-muted-foreground/70 max-w-lg mx-auto mb-8">
              Real-time market analytics • AI agent workflows • Monad ecosystem • Gamified learning
            </p>

            <Button
              onClick={handleClick}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-lg px-10 py-6 rounded-2xl gap-3"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </section>

        {/* Features grid *
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 text-center pb-8">
          <p className="text-xs text-muted-foreground/50">
            Powered by Lovable AI • Monad Blockchain • Built for Traders
          </p>
        </footer>
      </div>
    </>
  );
}

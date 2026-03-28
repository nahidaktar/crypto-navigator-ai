import { useState } from "react";
import { ArrowRight, Bot, TrendingUp, BookOpen, Wallet, BarChart3, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";

const FEATURES = [
  { icon: Bot, title: "AI Trading Agent", desc: "Real-time signals, technical analysis & automated insights powered by advanced AI" },
  { icon: TrendingUp, title: "Live Market Data", desc: "Crypto & forex analytics with real-time charts, indicators and calendar events" },
  { icon: BookOpen, title: "Learn & Earn", desc: "Gamified education with XP, badges, quests and step-by-step trading guides" },
  { icon: Wallet, title: "Multi-Wallet", desc: "Connect MetaMask, WalletConnect, Trust and more for seamless Web3 integration" },
  { icon: Sparkles, title: "Monad Integration", desc: "Explore the next-gen parallel execution blockchain with 10,000+ TPS" },
  { icon: BarChart3, title: "Forex Calendar", desc: "Real-time economic event tracking from Forex Factory for informed decisions" },
  };

  return (
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
            Powered by ggits • Monad Blockchain • Built for Monad
          </p>
        </footer>
      </div>
    </>
  );
}

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "What is Monad blockchain?",
  "Should I buy BTC now?",
  "Explain DeFi in simple terms",
  "Best crypto trading strategies",
];

const AI_RESPONSES: Record<string, string> = {
  "monad": `## Monad Blockchain 🔮

Monad is a **high-performance Layer 1 blockchain** designed for EVM compatibility with massively parallel execution.

### Key Features:
- **10,000+ TPS** throughput with sub-second finality
- **Full EVM bytecode compatibility** — deploy existing Solidity contracts
- **Parallel execution** — processes transactions concurrently
- **MonadBFT** consensus mechanism for security
- **Optimistic concurrency control** for state access

### Why It Matters:
Monad solves the blockchain trilemma by achieving high throughput without sacrificing decentralization. It's positioned as the next-gen DeFi infrastructure.

*Current market sentiment: Bullish — strong developer adoption and growing ecosystem.*`,

  "buy": `## BTC Market Analysis 📊

Based on current technical indicators:

| Indicator | Signal |
|-----------|--------|
| RSI (14) | 52.3 — Neutral |
| MACD | Bullish crossover forming |
| 200 EMA | Price above — Bullish |
| Volume | Increasing — Positive |

### AI Recommendation: **HOLD / Cautious BUY** 🟡

**Reasoning:** BTC is showing consolidation above key support at $65,000. Wait for a confirmed breakout above $68,500 for a stronger entry. Set stop-loss at $63,000.

⚠️ *This is AI analysis, not financial advice. Always DYOR.*`,

  "defi": `## DeFi Explained Simply 🏦

**DeFi = Decentralized Finance** — banking without banks!

### Think of it like this:
1. **Lending** — Earn interest by lending your crypto (like a savings account)
2. **Borrowing** — Use crypto as collateral to borrow funds
3. **Trading** — Swap tokens directly, no middleman (DEXs)
4. **Yield Farming** — Earn rewards for providing liquidity
5. **Staking** — Lock tokens to secure the network and earn rewards

### Popular DeFi Protocols:
- 🦄 **Uniswap** — Token swapping
- 👻 **Aave** — Lending/borrowing
- 🏗️ **MakerDAO** — Stablecoin (DAI)

*Start with small amounts and always understand the risks!*`,

  "default": `## AI Trading Insights 🤖

I've analyzed the current market conditions:

### Market Summary:
- **BTC Dominance**: 52.3% — Altseason not yet triggered
- **Fear & Greed Index**: 65 (Greed)
- **Total Market Cap**: $2.4T (+2.1%)

### Top Strategies Right Now:
1. **Dollar-Cost Averaging** into BTC and ETH
2. **Swing trading** SOL on 4H timeframe
3. **Watch Monad** for potential early entry

### Risk Alerts:
⚠️ High volatility expected around upcoming FOMC meeting
⚠️ Monitor BTC $65K support level

*Ask me anything about specific tokens, strategies, or market analysis!*`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("monad")) return AI_RESPONSES["monad"];
  if (lower.includes("buy") || lower.includes("btc") || lower.includes("sell")) return AI_RESPONSES["buy"];
  if (lower.includes("defi") || lower.includes("simple")) return AI_RESPONSES["defi"];
  if (lower.includes("strateg")) return AI_RESPONSES["default"];
  return AI_RESPONSES["default"];
}

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! I'm your **NexTrade AI Assistant** 🤖\n\nI can help you with:\n- 📊 Market analysis & trading signals\n- 🔮 Monad blockchain insights\n- 📚 Crypto education\n- 💡 Strategy recommendations\n\nWhat would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(text) }]);
      setTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-primary/15">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Assistant</h2>
          <p className="text-xs text-muted-foreground">Powered by advanced market intelligence</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "glass-card rounded-bl-md"
              }`}>
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-muted-foreground text-sm">
            <Sparkles className="w-4 h-4 animate-pulse-glow text-primary" />
            AI is thinking...
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-xs px-3 py-1.5 rounded-full glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask about crypto, trading, or Monad..."
            className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
          />
          <Button onClick={() => send(input)} size="icon" className="bg-primary text-primary-foreground rounded-xl h-[46px] w-[46px] hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

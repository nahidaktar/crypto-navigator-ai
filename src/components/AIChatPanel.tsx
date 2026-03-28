import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Loader2, Cpu, Search, BarChart3, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface WorkflowStep {
  label: string;
  status: "pending" | "active" | "done";
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const QUICK_PROMPTS = [
  "What is Monad blockchain?",
  "Should I buy BTC now?",
  "Explain DeFi in simple terms",
  "Best crypto trading strategies",
  "Analyze ETH technical indicators",
  "How does staking work?",
];

function AgentWorkflow({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="glass-card p-3 mb-3 space-y-1.5">
      <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
        <Cpu className="w-3.5 h-3.5" /> AI Agent Workflow
      </p>
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-2 text-xs"
        >
          {s.status === "done" ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-chart-up flex-shrink-0" />
          ) : s.status === "active" ? (
            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin flex-shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          )}
          <span className={s.status === "done" ? "text-muted-foreground" : s.status === "active" ? "text-foreground" : "text-muted-foreground/60"}>
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

async function streamChat({ messages, onDelta, onDone, onError }: {
  messages: Message[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({ error: "Request failed" }));
      onError(errData.error || `Error ${resp.status}`);
      return;
    }
    if (!resp.body) { onError("No response body"); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Connection failed");
  }
}

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm **MonX AI Agent** 🤖\n\nI work like an AI agent — when you ask me something, I'll:\n1. 🔍 Analyze your query\n2. 📊 Search market data & knowledge\n3. 🧠 Process with reasoning\n4. 💡 Deliver actionable insights\n\nTry asking me anything about crypto, trading, Monad, or Web3!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, workflowSteps]);

  const simulateWorkflow = async () => {
    const steps: WorkflowStep[] = [
      { label: "Analyzing user query...", status: "active" },
      { label: "Searching knowledge base", status: "pending" },
      { label: "Fetching market data", status: "pending" },
      { label: "Processing with AI reasoning", status: "pending" },
      { label: "Generating response", status: "pending" },
    ];
    setWorkflowSteps([...steps]);
    setShowWorkflow(true);

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
      steps[i].status = "done";
      if (i + 1 < steps.length) steps[i + 1].status = "active";
      setWorkflowSteps([...steps]);
    }
  };

  const send = (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    let assistantSoFar = "";

    simulateWorkflow().then(() => {
      streamChat({
        messages: updatedMessages,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && prev.length > updatedMessages.length) {
              return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
            }
            return [...prev, { role: "assistant", content: assistantSoFar }];
          });
        },
        onDone: () => {
          setIsStreaming(false);
          setShowWorkflow(false);
        },
        onError: (err) => {
          toast.error(err);
          setIsStreaming(false);
          setShowWorkflow(false);
        },
      });
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-primary/15">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">MonX AI Agent</h2>
          <p className="text-xs text-muted-foreground">Real-time workflow • Global search • Market intelligence</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "glass-card rounded-bl-md"
              }`}>
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {showWorkflow && <AgentWorkflow steps={workflowSteps} />}

        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && !showWorkflow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-primary" /> MonX AI is thinking...
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button key={p} onClick={() => send(p)} disabled={isStreaming}
              className="text-xs px-3 py-1.5 rounded-full glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50">
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask the AI agent anything — crypto, markets, analysis..."
            className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
            disabled={isStreaming} />
          <Button onClick={() => send(input)} size="icon"
            className="bg-primary text-primary-foreground rounded-xl h-[46px] w-[46px] hover:bg-primary/90"
            disabled={isStreaming}>
            {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

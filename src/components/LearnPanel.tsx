import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Star, Zap, CheckCircle2, Lock, Map, Target, Rocket, GraduationCap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const COURSES = [
  { id: 1, title: "Blockchain Basics", desc: "Learn how blockchain works", xp: 100, progress: 100, unlocked: true, lessons: 5 },
  { id: 2, title: "Crypto Trading 101", desc: "Master the fundamentals of trading", xp: 200, progress: 65, unlocked: true, lessons: 8 },
  { id: 3, title: "Web3 Wallets", desc: "Understand wallets and security", xp: 150, progress: 30, unlocked: true, lessons: 4 },
  { id: 4, title: "DeFi Deep Dive", desc: "Explore decentralized finance", xp: 300, progress: 0, unlocked: false, lessons: 10 },
  { id: 5, title: "Monad Ecosystem", desc: "Learn about Monad blockchain", xp: 250, progress: 0, unlocked: false, lessons: 6 },
  { id: 6, title: "Advanced Trading", desc: "Pro strategies and risk management", xp: 500, progress: 0, unlocked: false, lessons: 12 },
  { id: 7, title: "NFT Mastery", desc: "Create, trade, and understand NFTs", xp: 200, progress: 0, unlocked: false, lessons: 7 },
  { id: 8, title: "Smart Contracts", desc: "Build and deploy contracts on Solidity", xp: 400, progress: 0, unlocked: false, lessons: 9 },
  { id: 9, title: "Tokenomics", desc: "Understand token economics & valuation", xp: 350, progress: 0, unlocked: false, lessons: 8 },
];

const BADGES = [
  { name: "First Trade", icon: "🏆", earned: true },
  { name: "Quick Learner", icon: "📚", earned: true },
  { name: "Diamond Hands", icon: "💎", earned: true },
  { name: "Whale Watcher", icon: "🐋", earned: false },
  { name: "DeFi Master", icon: "🔮", earned: false },
  { name: "Monad Pioneer", icon: "⚡", earned: false },
  { name: "NFT Creator", icon: "🎨", earned: false },
  { name: "Code Wizard", icon: "🧙", earned: false },
];

const ROADMAP = [
  { phase: "Phase 1", title: "Foundation", status: "completed", items: ["Blockchain basics course", "Wallet setup guide", "First trade tutorial", "XP system launch"] },
  { phase: "Phase 2", title: "Growth", status: "active", items: ["DeFi courses", "AI trading signals", "Monad integration", "Community challenges"] },
  { phase: "Phase 3", title: "Mastery", status: "upcoming", items: ["Smart contract courses", "Cross-chain trading", "NFT marketplace", "Governance voting"] },
  { phase: "Phase 4", title: "MonX Ecosystem", status: "upcoming", items: ["MonX token launch", "Staking rewards", "DAO governance", "Real-yield sharing"] },
];

const DAILY_QUESTS = [
  { title: "Complete 1 lesson", reward: 25, done: true },
  { title: "Make a practice trade", reward: 50, done: false },
  { title: "Read market analysis", reward: 15, done: false },
  { title: "Connect your wallet", reward: 100, done: false },
];

type Tab = "courses" | "roadmap" | "quests";

export default function LearnPanel() {
  const [virtualBalance] = useState(10000);
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const totalXP = 450;
  const level = Math.floor(totalXP / 200) + 1;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-primary" /> Learn & Earn
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-warning">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium">Level {level}</span>
          </div>
          <p className="text-2xl font-bold font-mono">{totalXP} XP</p>
          <Progress value={(totalXP % 200) / 2} className="h-2" />
          <p className="text-xs text-muted-foreground">{200 - (totalXP % 200)} XP to next level</p>
        </div>
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">Practice Account</span>
          </div>
          <p className="text-2xl font-bold font-mono">${virtualBalance.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Virtual trading balance</p>
        </div>
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-medium">Achievements</span>
          </div>
          <p className="text-2xl font-bold font-mono">{BADGES.filter(b => b.earned).length}/{BADGES.length}</p>
          <div className="flex gap-1 flex-wrap">
            {BADGES.map((b) => (
              <span key={b.name} className={`text-lg ${b.earned ? "" : "opacity-30 grayscale"}`} title={b.name}>{b.icon}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { id: "courses" as Tab, label: "Courses", icon: GraduationCap },
          { id: "roadmap" as Tab, label: "Roadmap", icon: Map },
          { id: "quests" as Tab, label: "Daily Quests", icon: Gift },
        ]).map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="gap-2"
          >
            <tab.icon className="w-4 h-4" />{tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "courses" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">COURSES</h3>
          {COURSES.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card p-4 ${!course.unlocked ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {course.progress === 100 ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : !course.unlocked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="font-semibold text-sm">{course.title}</p>
                    <p className="text-xs text-muted-foreground">{course.desc} • {course.lessons} lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-warning">+{course.xp} XP</span>
                  {course.unlocked && course.progress < 100 && (
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      {course.progress > 0 ? "Continue" : "Start"}
                    </Button>
                  )}
                </div>
              </div>
              {course.unlocked && <Progress value={course.progress} className="h-1.5" />}
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "roadmap" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">MONX ROADMAP</h3>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
            {ROADMAP.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12 pb-8 last:pb-0"
              >
                <div className={`absolute left-3 w-5 h-5 rounded-full border-2 ${
                  phase.status === "completed" ? "bg-primary border-primary" :
                  phase.status === "active" ? "bg-accent border-accent animate-pulse" :
                  "bg-muted border-border"
                }`}>
                  {phase.status === "completed" && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                  {phase.status === "active" && <Rocket className="w-3 h-3 text-accent-foreground m-0.5" />}
                </div>
                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                      phase.status === "completed" ? "bg-primary/20 text-primary" :
                      phase.status === "active" ? "bg-accent/20 text-accent" :
                      "bg-muted text-muted-foreground"
                    }`}>{phase.phase}</span>
                    <span className="font-semibold text-sm">{phase.title}</span>
                  </div>
                  <ul className="space-y-1">
                    {phase.items.map((item) => (
                      <li key={item} className="text-xs text-muted-foreground flex items-center gap-2">
                        <Target className="w-3 h-3 flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "quests" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">DAILY QUESTS</h3>
          {DAILY_QUESTS.map((quest, i) => (
            <motion.div
              key={quest.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 flex items-center justify-between ${quest.done ? "opacity-60" : ""}`}
            >
              <div className="flex items-center gap-3">
                {quest.done ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                )}
                <span className={`text-sm ${quest.done ? "line-through text-muted-foreground" : "font-medium"}`}>
                  {quest.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-warning">+{quest.reward} XP</span>
                {!quest.done && <Button size="sm" variant="outline" className="text-xs h-7">Claim</Button>}
              </div>
            </motion.div>
          ))}
          <div className="glass-card p-4 bg-primary/5 border-primary/20">
            <p className="text-sm font-semibold text-primary">🔥 Complete all quests for bonus 200 XP!</p>
            <Progress value={25} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">1/4 completed</p>
          </div>
        </div>
      )}
    </div>
  );
}

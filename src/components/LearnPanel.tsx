import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Star, Zap, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const COURSES = [
  { id: 1, title: "Blockchain Basics", desc: "Learn how blockchain works", xp: 100, progress: 100, unlocked: true, lessons: 5 },
  { id: 2, title: "Crypto Trading 101", desc: "Master the fundamentals of trading", xp: 200, progress: 65, unlocked: true, lessons: 8 },
  { id: 3, title: "Web3 Wallets", desc: "Understand wallets and security", xp: 150, progress: 30, unlocked: true, lessons: 4 },
  { id: 4, title: "DeFi Deep Dive", desc: "Explore decentralized finance", xp: 300, progress: 0, unlocked: false, lessons: 10 },
  { id: 5, title: "Monad Ecosystem", desc: "Learn about Monad blockchain", xp: 250, progress: 0, unlocked: false, lessons: 6 },
  { id: 6, title: "Advanced Trading", desc: "Pro strategies and risk management", xp: 500, progress: 0, unlocked: false, lessons: 12 },
];

const BADGES = [
  { name: "First Trade", icon: "🏆", earned: true },
  { name: "Quick Learner", icon: "📚", earned: true },
  { name: "Diamond Hands", icon: "💎", earned: true },
  { name: "Whale Watcher", icon: "🐋", earned: false },
  { name: "DeFi Master", icon: "🔮", earned: false },
];

export default function LearnPanel() {
  const [virtualBalance] = useState(10000);
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
          <div className="flex gap-1">
            {BADGES.map((b) => (
              <span key={b.name} className={`text-lg ${b.earned ? "" : "opacity-30 grayscale"}`} title={b.name}>{b.icon}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">COURSES</h3>
        {COURSES.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-card p-4 ${!course.unlocked ? "opacity-60" : ""}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {course.progress === 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-chart-up" />
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
                  <Button size="sm" variant="outline" className="text-xs h-7">Continue</Button>
                )}
              </div>
            </div>
            {course.unlocked && (
              <Progress value={course.progress} className="h-1.5" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

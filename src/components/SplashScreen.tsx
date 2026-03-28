import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.jpg";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "expanding" | "done">("loading");

  useEffect(() => {
    const duration = 2000;
    const interval = 20;
    const step = 100 / (duration / interval);
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + step + Math.random() * 0.5, 100);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setPhase("expanding"), 200);
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 1000);
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "hsl(228 25% 8%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background glow orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsla(220, 90%, 56%, 0.08) 0%, transparent 70%)",
              }}
              animate={phase === "expanding" ? { scale: 3, opacity: 0 } : { scale: [1, 1.1, 1], opacity: 1 }}
              transition={phase === "expanding" ? { duration: 0.8 } : { duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsla(265, 80%, 65%, 0.06) 0%, transparent 70%)",
              }}
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
              phase === "expanding"
                ? { scale: 1.3, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: phase === "expanding" ? 0.6 : 0.6, ease: "easeOut" }}
            className="relative mb-8"
          >
            {/* Glow ring */}
            <motion.div
              className="absolute inset-[-4px] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, hsl(220 90% 56%), hsl(265 80% 65%), hsl(185 80% 55%), hsl(220 90% 56%))",
                filter: "blur(6px)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative w-24 h-24 rounded-full border-2 border-border/50 overflow-hidden bg-background">
              <img src={logo} alt="MonX" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={phase === "expanding" ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-bold tracking-wider mb-8"
            style={{
              background: "linear-gradient(90deg, hsl(220 90% 65%), hsl(265 80% 65%), hsl(185 80% 60%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MonX
          </motion.h1>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={
              phase === "expanding"
                ? { opacity: 0, scaleY: 3 }
                : { opacity: 1, width: 280 }
            }
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="h-1 w-[280px] rounded-full overflow-hidden bg-border/30">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(220 90% 56%), hsl(265 80% 65%), hsl(185 80% 55%))",
                  width: `${progress}%`,
                  boxShadow: "0 0 20px hsla(220, 90%, 56%, 0.5), 0 0 40px hsla(265, 80%, 65%, 0.3)",
                }}
              />
            </div>
            <motion.p
              className="text-xs text-muted-foreground text-center mt-3 font-mono tracking-widest"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {progress < 30 ? "INITIALIZING" : progress < 60 ? "CONNECTING" : progress < 90 ? "LOADING MODULES" : "READY"}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

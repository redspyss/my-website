"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarField from "./effects/StarField";
import Particles from "./effects/Particles";
import { config } from "@/site.config";
import { useAudio } from "@/lib/AudioProvider";

// Girişten sonra, mektup bölümünden önce oynayan sinematik baykuş sahnesi.
export default function OwlDelivery({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"approach" | "drop" | "done">("approach");
  const audio = useAudio();

  useEffect(() => {
    const t1 = window.setTimeout(() => {
      setPhase("drop");
      audio.play("owl");
    }, 3400);
    const t2 = window.setTimeout(() => setPhase("done"), 5200);
    const t3 = window.setTimeout(onDone, 6400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [onDone, audio]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] overflow-hidden bg-night-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#16224a_0%,#070b1a_45%,#04060f_100%)]" />
      <StarField count={120} />
      <div className="fog drift" />
      <div className="fog drift" style={{ animationDelay: "-16s" }} />

      {/* ay */}
      <div
        className="absolute right-[14%] top-[12%] h-44 w-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle, #fdf6e3 0%, #f3e7c4 30%, rgba(205,185,138,0.3) 60%, transparent 75%)",
        }}
      />

      {/* baykuş: uzaktan yaklaşıp merkeze gelir */}
      <motion.div
        className="absolute"
        initial={{ left: "82%", top: "20%", scale: 0.18, opacity: 0.2 }}
        animate={
          phase === "approach"
            ? { left: "50%", top: "44%", scale: 1, opacity: 1 }
            : { left: "50%", top: "44%", scale: 1, opacity: phase === "done" ? 0 : 1 }
        }
        transition={{ duration: 3.4, ease: [0.4, 0, 0.3, 1] }}
        style={{ x: "-50%", y: "-50%" }}
      >
        <Owl flapping={phase === "approach"} carrying={phase !== "drop" && phase !== "done"} />
        {/* baykuş etrafında ışık */}
        <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.25),transparent_70%)] blur-xl" />
      </motion.div>

      {/* düşen mektup */}
      <AnimatePresence>
        {(phase === "drop" || phase === "done") && (
          <motion.div
            className="absolute left-1/2 top-[44%]"
            initial={{ y: 0, opacity: 0, rotate: -8 }}
            animate={{ y: 180, opacity: 1, rotate: [-8, 6, -3, 0] }}
            transition={{ duration: 1.6, ease: "easeIn" }}
            style={{ x: "-50%" }}
          >
            <div className="relative h-16 w-24 rounded-sm bg-[linear-gradient(135deg,#e8dcc0,#cdb98a)] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <div
                className="absolute left-0 right-0 top-0 h-1/2 origin-top"
                style={{
                  background: "linear-gradient(180deg,#dccfa8,#c2ad7c)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />
              <div className="absolute left-1/2 top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#8c2230,#4d0d15)] text-sm text-gold-light">
                ⚜
              </div>
            </div>
            {phase === "done" && <Particles count={40} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* alt yazı */}
      <div className="absolute inset-x-0 bottom-[14%] text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase === "approach" ? "a" : "b"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-xl italic text-parchment/80 sm:text-2xl"
          >
            {phase === "approach" ? config.owl.line : config.owl.delivered}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Owl({ flapping, carrying }: { flapping: boolean; carrying: boolean }) {
  return (
    <div className="relative drop-shadow-[0_10px_18px_rgba(0,0,0,0.7)]">
      <svg viewBox="0 0 120 90" width="150" height="112">
        {/* gövde */}
        <ellipse cx="60" cy="50" rx="16" ry="22" fill="#1a1408" />
        {/* baş */}
        <circle cx="60" cy="28" r="14" fill="#241a0c" />
        {/* kulak tüyleri */}
        <path d="M50 18 L48 8 L56 16 Z" fill="#241a0c" />
        <path d="M70 18 L72 8 L64 16 Z" fill="#241a0c" />
        {/* gözler */}
        <circle cx="54" cy="27" r="4.5" fill="#f5e6a8" />
        <circle cx="66" cy="27" r="4.5" fill="#f5e6a8" />
        <circle cx="54" cy="27" r="2" fill="#1a1408" />
        <circle cx="66" cy="27" r="2" fill="#1a1408" />
        {/* gaga */}
        <path d="M58 32 L62 32 L60 38 Z" fill="#caa24a" />

        {/* kanatlar */}
        <motion.path
          d="M44 44 Q14 30 6 52 Q26 50 44 60 Z"
          fill="#2a1f0e"
          style={{ originX: "44px", originY: "50px" }}
          animate={flapping ? { rotate: [0, -22, 0], y: [0, -4, 0] } : { rotate: -6 }}
          transition={{ duration: 0.42, repeat: flapping ? Infinity : 0, ease: "easeInOut" }}
        />
        <motion.path
          d="M76 44 Q106 30 114 52 Q94 50 76 60 Z"
          fill="#2a1f0e"
          style={{ originX: "76px", originY: "50px" }}
          animate={flapping ? { rotate: [0, 22, 0], y: [0, -4, 0] } : { rotate: 6 }}
          transition={{ duration: 0.42, repeat: flapping ? Infinity : 0, ease: "easeInOut" }}
        />

        {/* taşıdığı mektup */}
        {carrying && (
          <rect x="52" y="66" width="16" height="11" rx="1.5" fill="#e8dcc0" />
        )}
      </svg>
    </div>
  );
}

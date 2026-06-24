"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Eyebrow, Title, Reveal } from "@/components/ui/Section";
import ScrollCta from "@/components/ui/ScrollCta";
import StarField from "@/components/effects/StarField";
import Particles from "@/components/effects/Particles";
import { houses } from "@/data/site";
import { config } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";

export default function SectionSorting({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<"idle" | "thinking" | "revealed">("idle");
  const [lineIndex, setLineIndex] = useState(0);
  const audio = useAudio();
  const house = houses[config.house];
  const c = config.sorting;
  const lines = c.hatLines;

  const begin = () => {
    if (phase !== "idle") return;
    setPhase("thinking");
    audio.play("sorting");
  };

  useEffect(() => {
    if (phase !== "thinking") return;
    if (lineIndex < lines.length - 1) {
      const t = window.setTimeout(() => {
        setLineIndex((i) => i + 1);
        audio.play("sorting");
      }, 1900);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setPhase("revealed");
      // ev açıklanınca arka planda havai fişek
      audio.play("fireworks");
    }, 2200);
    return () => window.clearTimeout(t);
  }, [phase, lineIndex, audio, lines.length]);

  return (
    <Section id="sorting" className="min-h-[100dvh] flex items-center justify-center">
        <SceneBackdrop {...config.scenes.sorting} />
      <motion.div
        className="absolute inset-0"
        animate={{
          background:
            phase === "revealed"
              ? `radial-gradient(ellipse at 50% 35%, ${house.primary}cc 0%, #070b1a 60%, #04060f 100%)`
              : "radial-gradient(ellipse at 50% 35%, #101a36 0%, #070b1a 60%, #04060f 100%)",
        }}
        transition={{ duration: 1.6 }}
      />
      <StarField count={80} />
      {/* altın toz parçacıkları (yazıları rahatsız etmeyecek şekilde) */}
      <Particles count={22} />
      {phase === "revealed" && <Particles count={70} color={house.accent} />}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <Reveal>
          <Title>{c.title}</Title>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-xl font-serif text-lg text-parchment/70">
            {c.subtitle}
          </p>
        </Reveal>

        <div className="relative mt-10">
          <SortingHat talking={phase === "thinking"} />
        </div>

        <div className="mt-8 min-h-[120px]">
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.button
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={begin}
                className="rounded-full border border-gold/40 px-8 py-3 font-display text-sm uppercase tracking-[0.25em] text-gold transition hover:bg-gold/10 hover:shadow-[0_0_24px_rgba(212,175,55,0.3)]"
              >
                {c.startLabel}
              </motion.button>
            )}

            {phase === "thinking" && (
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-serif text-2xl italic text-gold-light glow-gold"
              >
                “{lines[lineIndex]}”
              </motion.p>
            )}

            {phase === "revealed" && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 16 }}
              >
                <motion.h3
                  className="heading-display font-black uppercase tracking-wider whitespace-nowrap"
                  style={{ color: house.secondary, fontSize: "clamp(2rem, 10vw, 4.5rem)" }}
                  animate={{
                    textShadow: [
                      `0 0 10px ${house.glow}`,
                      `0 0 40px ${house.glow}`,
                      `0 0 10px ${house.glow}`,
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {house.name}!
                </motion.h3>
                <p className="mt-5 font-serif text-xl italic text-parchment/90">
                  {house.trait}
                </p>
                <p className="mt-2 font-display text-xs uppercase tracking-[0.35em] text-parchment/50">
                  {house.motto}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {phase === "revealed" && <ScrollCta onContinue={onComplete} />}
      </div>
    </Section>
  );
}

function SortingHat({ talking }: { talking: boolean }) {
  return (
    <motion.div
      animate={
        talking
          ? { rotate: [0, -3, 3, -2, 2, 0], y: [0, -4, 0] }
          : { rotate: 0, y: [0, -6, 0] }
      }
      transition={
        talking
          ? { duration: 1.2, repeat: Infinity }
          : { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
      className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
    >
      <svg viewBox="0 0 200 220" width="150" height="165">
        <defs>
          <linearGradient id="hatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b5836" />
            <stop offset="60%" stopColor="#3e3019" />
            <stop offset="100%" stopColor="#241a0c" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="200" rx="80" ry="16" fill="#1a1305" />
        <path
          d="M100 12 C120 60 90 80 130 120 C100 130 95 150 100 184 C70 184 40 184 40 184 C40 150 70 130 60 110 C70 80 88 70 100 12 Z"
          fill="url(#hatGrad)"
          stroke="#1a1305"
          strokeWidth="3"
        />
        <path d="M70 150 q12 -10 24 0" stroke="#1a1305" strokeWidth="3" fill="none" />
        <path d="M104 152 q12 -8 22 2" stroke="#1a1305" strokeWidth="3" fill="none" />
        <path
          d={talking ? "M78 172 q22 18 44 0" : "M80 172 q22 8 40 0"}
          stroke="#1a1305"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Section } from "@/components/ui/Section";
import ScrollCta from "@/components/ui/ScrollCta";
import StarField from "@/components/effects/StarField";
import Particles from "@/components/effects/Particles";
import { config } from "@/site.config";
import { useAudio } from "@/lib/AudioProvider";

type Phase = "idle" | "approach" | "ready" | "letter";

export default function SectionPatronusLetter({ onComplete }: { onComplete?: () => void }) {
  const c = config.patronusLetter;
  const sign = c.sign.replace("{you}", config.yourName);
  const greeting = c.greeting.replace("{name}", config.girlfriendName);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30%" });
  const [phase, setPhase] = useState<Phase>("idle");
  const audio = useAudio();

  useEffect(() => {
    if (!inView) return;
    setPhase((p) => (p === "idle" ? "approach" : p));
    audio.play("patronus");
    const t = window.setTimeout(
      () => setPhase((p) => (p === "approach" ? "ready" : p)),
      3000
    );
    return () => window.clearTimeout(t);
    // Yalnızca inView değiştiğinde tetiklenir; phase'i bağımlılığa eklemiyoruz
    // (aksi halde setPhase, kendi zamanlayıcısını iptal eder).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const openLetter = () => {
    setPhase("letter");
    audio.play("patronus");
  };

  return (
    <Section id="patronus-letter" className="flex min-h-[100dvh] items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0a1226_0%,#050813_60%,#020308_100%)]" />
      <StarField count={110} />
      <div className="fog drift" style={{ opacity: 0.5 }} />

      <div ref={ref} className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
        {/* Patronus ışığı */}
        <AnimatePresence>
          {phase !== "letter" && (
            <motion.div
              key="patronus"
              initial={{ scale: 0.1, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 2.4, ease: [0.3, 0, 0.3, 1] }}
              className="relative grid h-44 w-full place-items-center"
            >
              <PatronusStag />
              <Particles count={24} color="#bfe3ff" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {(phase === "approach" || phase === "ready") && (
            <motion.div
              key="carry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2"
            >
              <p
                className="font-serif text-xl italic text-[#cfeeff]"
                style={{ textShadow: "0 0 18px rgba(159,216,255,0.6)" }}
              >
                {c.carry}
              </p>
              {phase === "ready" && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={openLetter}
                  className="mt-6 rounded-full border border-[#9fd8ff]/50 px-8 py-3 font-display text-sm uppercase tracking-[0.25em] text-[#cfeeff] transition hover:bg-[#9fd8ff]/10 hover:shadow-[0_0_30px_rgba(159,216,255,0.4)]"
                >
                  {c.openLabel}
                </motion.button>
              )}
            </motion.div>
          )}

          {phase === "letter" && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-2 w-full"
            >
              <div className="absolute -inset-4 rounded-2xl bg-[#9fd8ff]/10 blur-2xl" />
              {/* uzun parşömen mektup */}
              <div className="parchment-panel relative mx-auto max-w-xl rounded-md px-7 py-10 text-left sm:px-12">
                <div className="text-center font-display text-sm uppercase tracking-[0.4em] text-bordeaux">
                  {c.title}
                </div>
                <div className="mx-auto my-5 h-px w-28 bg-gradient-to-r from-transparent via-[#7c5a22] to-transparent" />
                <p className="font-serif text-xl leading-relaxed text-[#3a230f]">
                  {greeting}
                </p>
                <div className="mt-4 space-y-4">
                  {c.paragraphs.map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.6, duration: 1.2 }}
                      className="font-serif text-lg leading-relaxed text-[#4a3115]"
                    >
                      {para}
                    </motion.p>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + c.paragraphs.length * 0.6, duration: 1.2 }}
                  className="mt-6 text-right font-serif text-lg italic text-[#5a3d1a]"
                >
                  {sign}
                </motion.p>
              </div>
              <ScrollCta onContinue={onComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function PatronusStag() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ filter: "drop-shadow(0 0 22px rgba(159,216,255,0.9))" }}
    >
      <svg viewBox="0 0 200 160" width="190" height="150">
        <g
          fill="none"
          stroke="#dff1ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        >
          <path d="M86 44 C80 26 70 20 60 14 M86 44 C84 28 78 22 72 12 M86 44 C90 30 96 24 104 16" />
          <path d="M114 44 C120 26 130 20 140 14 M114 44 C116 28 122 22 128 12 M114 44 C110 30 104 24 96 16" />
          <path d="M88 48 Q100 40 112 48 Q116 60 110 70 L120 96" />
          <path d="M110 70 Q140 64 156 86 Q160 104 150 120" />
          <path d="M120 96 L118 140 M150 120 L152 146 M128 104 L126 142 M144 110 L146 144" />
          <path d="M110 70 Q96 84 100 120 L98 142" />
        </g>
      </svg>
    </motion.div>
  );
}

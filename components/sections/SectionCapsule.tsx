"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Eyebrow, Title, Reveal } from "@/components/ui/Section";
import ScrollCta from "@/components/ui/ScrollCta";
import SmartImage from "@/components/SmartImage";
import Particles from "@/components/effects/Particles";
import StarField from "@/components/effects/StarField";
import { config, CapsuleItem } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";

type Phase = "closed" | "opening" | "items" | "finale";

export default function SectionCapsule({ onComplete }: { onComplete?: () => void }) {
  const c = config.capsule;
  const [phase, setPhase] = useState<Phase>("closed");
  const [index, setIndex] = useState(0);
  const audio = useAudio();

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    audio.play("capsule");
    window.setTimeout(() => audio.play("capsule"), 500);
    window.setTimeout(() => setPhase("items"), 1800);
  };

  const next = () => {
    audio.play("capsule");
    if (index < c.items.length - 1) setIndex((i) => i + 1);
    else setPhase("finale");
  };

  return (
    <Section id="capsule" className="flex min-h-[100dvh] flex-col items-center justify-center">
        <SceneBackdrop {...config.scenes.capsule} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#0d0a1c_0%,#080611_60%,#04060f_100%)]" />
      {/* taş duvar dokusu */}
      <div className="absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(0deg,transparent,transparent_46px,#000_47px),repeating-linear-gradient(90deg,transparent,transparent_70px,#000_71px)]" />
      <StarField count={60} />
      <div className="fog drift" style={{ opacity: 0.6 }} />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <Reveal>
          <Title>{c.title}</Title>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg text-parchment/70">
            {c.subtitle}
          </p>
        </Reveal>

        <div className="relative mt-10 grid min-h-[360px] place-items-center">
          {/* dönen büyü enerjisi */}
          {phase !== "finale" && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute h-72 w-72 rounded-full border border-gold/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.12), transparent 40%)",
              }}
            />
          )}

          <AnimatePresence mode="wait">
            {(phase === "closed" || phase === "opening") && (
              <motion.div
                key="chest"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="relative"
              >
                <Chest opening={phase === "opening"} />
                {phase === "opening" && <Particles count={60} />}
                {phase === "closed" && (
                  <button
                    onClick={open}
                    className="mt-8 rounded-full border border-gold/40 px-8 py-3 font-display text-sm uppercase tracking-[0.25em] text-gold transition hover:bg-gold/10 hover:shadow-[0_0_24px_rgba(212,175,55,0.3)]"
                  >
                    {c.openLabel}
                  </button>
                )}
              </motion.div>
            )}

            {phase === "items" && (
              <motion.div
                key={`item-${index}`}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md"
              >
                <CapsuleCard item={c.items[index]} />
                <div className="mt-6 flex items-center justify-center gap-3">
                  {c.items.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index ? "w-6 bg-gold" : "w-1.5 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="mt-6 rounded-full bg-gradient-to-b from-[#6a1420] to-[#3d0a12] px-7 py-2.5 font-display text-xs uppercase tracking-[0.25em] text-gold-light shadow-lg transition hover:from-[#7c1f2e]"
                >
                  {index < c.items.length - 1 ? "Sonraki" : "Sandığı Kapat"}
                </button>
              </motion.div>
            )}

            {phase === "finale" && (
              <motion.div
                key="finale"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="relative"
              >
                <Particles count={50} />
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 1.2 }}
                  className="heading-display mx-auto max-w-xl text-2xl leading-relaxed text-gradient-gold sm:text-3xl"
                >
                  {c.finaleMessage}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 1.2 }}
                  className="mt-6 font-display text-xs uppercase tracking-[0.35em] text-parchment/50"
                >
                  {c.sealedLine}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {phase === "finale" && <ScrollCta onContinue={onComplete} />}
      </div>
    </Section>
  );
}

function CapsuleCard({ item }: { item: CapsuleItem }) {
  if (item.kind === "photo") {
    return (
      <motion.figure
        initial={{ filter: "blur(14px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 1.1 }}
        className="rounded-lg border border-gold/25 bg-[#0a1228] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        <SmartImage
          src={item.photo}
          video={item.video}
          alt={item.title}
          icon="📷"
          fit="contain"
          className="max-h-[45vh] w-full rounded bg-black/30"
        />
        <figcaption className="px-2 py-3 text-left">
          <div className="heading-display text-lg text-gold-light">{item.title}</div>
          <p className="mt-1 font-serif text-base italic text-parchment/85">{item.body}</p>
        </figcaption>
      </motion.figure>
    );
  }

  if (item.kind === "note") {
    return (
      <div className="rounded-xl border border-[#9fd8ff]/25 bg-night-700/60 p-7 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="font-display text-xs uppercase tracking-[0.3em] text-[#9fd8ff]/70">
          {item.title}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6 }}
          className="mt-4 font-serif text-xl italic leading-relaxed text-[#dbe6ff]"
          style={{ textShadow: "0 0 18px rgba(159,216,255,0.5)" }}
        >
          {item.body}
        </motion.p>
      </div>
    );
  }

  // letter / parchment
  return (
    <motion.div
      initial={{ rotateX: 70, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "top" }}
      className="parchment-panel rounded-md px-7 py-8 text-left"
    >
      <div className="text-center font-display text-xs uppercase tracking-[0.35em] text-bordeaux">
        {item.title}
      </div>
      <div className="mx-auto my-4 h-px w-20 bg-gradient-to-r from-transparent via-[#7c5a22] to-transparent" />
      <p className="font-serif text-lg leading-relaxed text-[#3a230f]">{item.body}</p>
    </motion.div>
  );
}

function Chest({ opening }: { opening: boolean }) {
  return (
    <div className="relative mx-auto h-44 w-56 [perspective:800px]">
      {/* parıltı */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,210,90,0.5), transparent 65%)" }}
        animate={opening ? { scale: [1, 3], opacity: [0.7, 0] } : { opacity: [0.25, 0.5, 0.25] }}
        transition={opening ? { duration: 1.6 } : { duration: 3, repeat: Infinity }}
      />
      <svg viewBox="0 0 220 170" className="relative h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)]">
        <defs>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b4a24" />
            <stop offset="100%" stopColor="#3a2713" />
          </linearGradient>
          <linearGradient id="goldT" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5e6a8" />
            <stop offset="100%" stopColor="#9c7c1f" />
          </linearGradient>
        </defs>
        {/* gövde */}
        <rect x="30" y="78" width="160" height="78" rx="8" fill="url(#wood)" stroke="url(#goldT)" strokeWidth="3" />
        <rect x="30" y="100" width="160" height="6" fill="url(#goldT)" opacity="0.8" />
        {/* kapak */}
        <motion.g
          style={{ transformOrigin: "110px 78px" }}
          animate={opening ? { rotateX: -110 } : { rotateX: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d="M30 78 Q30 40 110 40 Q190 40 190 78 Z" fill="url(#wood)" stroke="url(#goldT)" strokeWidth="3" />
          <path d="M30 78 Q30 40 110 40 Q190 40 190 78" fill="none" stroke="url(#goldT)" strokeWidth="2" opacity="0.7" />
        </motion.g>
        {/* kilit + mühür */}
        {!opening && (
          <g>
            <rect x="98" y="86" width="24" height="26" rx="3" fill="url(#goldT)" />
            <circle cx="110" cy="99" r="4" fill="#3a2713" />
            <motion.circle
              cx="110"
              cy="99"
              r="14"
              fill="none"
              stroke="#ffd86b"
              strokeWidth="1.5"
              animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              style={{ transformOrigin: "110px 99px" }}
            />
          </g>
        )}
      </svg>
    </div>
  );
}

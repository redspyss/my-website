"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Eyebrow, Title, Reveal } from "@/components/ui/Section";
import ScrollCta from "@/components/ui/ScrollCta";
import Particles from "@/components/effects/Particles";
import { config } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";

export default function SectionProphecy({ onComplete }: { onComplete?: () => void }) {
  const c = config.prophecy;
  // Kehanetler bir kez karıştırılır; tekrar etmeden tümü gösterilir.
  const [order] = useState<number[]>(() =>
    shuffle(c.prophecies.map((_, i) => i))
  );
  const [pos, setPos] = useState(0);
  const audio = useAudio();

  const revealed = pos > 0;
  const done = pos >= order.length; // tüm kehanetler okundu

  const nextProphecy = () => {
    if (pos >= order.length) return; // hepsi bitti
    setPos((p) => p + 1);
    audio.play("prophecy");
    window.setTimeout(() => audio.play("prophecy"), 400);
  };

  const currentIndex = pos > 0 ? order[pos - 1] : null;
  const prophecy = currentIndex !== null ? c.prophecies[currentIndex] : "";

  return (
    <Section id="prophecy" className="flex min-h-[100dvh] flex-col items-center justify-center">
        <SceneBackdrop {...config.scenes.prophecy} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0a0a18_0%,#06060f_55%,#020207_100%)]" />

      {/* sonsuza giden raflar + kehanet küreleri */}
      <ShelfWall side="left" dim={revealed} />
      <ShelfWall side="right" dim={revealed} />

      {/* taş sütunlar */}
      <div className="pointer-events-none absolute inset-y-0 left-[7%] w-10 bg-gradient-to-b from-[#0c0c18] via-[#15151f] to-[#0c0c18] opacity-70 blur-[1px] sm:left-[12%]" />
      <div className="pointer-events-none absolute inset-y-0 right-[7%] w-10 bg-gradient-to-b from-[#0c0c18] via-[#15151f] to-[#0c0c18] opacity-70 blur-[1px] sm:right-[12%]" />

      {/* sis */}
      <div className="fog drift" style={{ opacity: revealed ? 0.9 : 0.5 }} />
      <div className="fog drift" style={{ animationDelay: "-12s", opacity: revealed ? 0.8 : 0.4 }} />

      {/* tıklayınca çevreyi karartan örtü */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        animate={{ opacity: revealed ? 0.55 : 0 }}
        transition={{ duration: 1.2 }}
      />

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

        {/* MERKEZ KEHANET KÜRESİ */}
        <div className="relative mt-10 grid min-h-[360px] place-items-center">
          <motion.button
            onClick={nextProphecy}
            aria-label={c.approach}
            className="group relative"
            animate={{ y: revealed ? -28 : [0, -10, 0] }}
            transition={
              revealed
                ? { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
                : { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }
            whileHover={{ scale: 1.04 }}
          >
            <ProphecyOrb active={revealed} />
            {!revealed && (
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[10px] uppercase tracking-[0.3em] text-gold/50 transition group-hover:text-gold">
                {c.approach}
              </span>
            )}
          </motion.button>

          {revealed && <Particles count={50} />}
        </div>

        {/* KEHANET METNİ — havada yazılıyormuş gibi */}
        <div className="mt-2 min-h-[120px]">
          <AnimatePresence mode="wait">
            {revealed && (
              <motion.div key={`${pos}-${currentIndex}`} className="mx-auto max-w-xl">
                <p className="heading-display text-2xl leading-relaxed sm:text-3xl">
                  {prophecy.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                      className="text-gradient-gold"
                      style={{ display: "inline-block", marginRight: "0.28em" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>

                {!done && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + prophecy.split(" ").length * 0.12 + 0.4 }}
                    onClick={nextProphecy}
                    className="mt-8 rounded-full border border-gold/40 px-7 py-2.5 font-display text-xs uppercase tracking-[0.25em] text-gold transition hover:bg-gold/10 hover:shadow-[0_0_24px_rgba(212,175,55,0.3)]"
                  >
                    {c.again}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Yola devam, yalnızca tüm kehanetler okunduktan sonra aktifleşir */}
        {done && <ScrollCta onContinue={onComplete} />}
      </div>
    </Section>
  );
}

function ProphecyOrb({ active }: { active: boolean }) {
  return (
    <div className="relative h-44 w-44 sm:h-52 sm:w-52">
      {/* dış parıltı */}
      <motion.div
        className="absolute inset-[-30%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.35), rgba(180,200,255,0.15) 45%, transparent 70%)",
        }}
        animate={{ opacity: active ? [0.7, 1, 0.7] : [0.4, 0.7, 0.4], scale: active ? 1.15 : 1 }}
        transition={{ duration: active ? 1.8 : 4, repeat: Infinity }}
      />
      {/* cam küre */}
      <div className="absolute inset-0 overflow-hidden rounded-full border border-white/30 shadow-[inset_0_0_40px_rgba(180,200,255,0.4),0_10px_40px_rgba(0,0,0,0.6)]">
        {/* içteki enerji — altın/gümüş dönen sis */}
        <motion.div
          className="absolute inset-[-40%]"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(212,175,55,0.7), rgba(200,220,255,0.5), rgba(150,180,255,0.6), rgba(245,230,168,0.7), rgba(212,175,55,0.7))",
            filter: "blur(10px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: active ? 6 : 14, repeat: Infinity, ease: "linear" }}
        />
        {/* duman akışı */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.55), transparent 55%)",
          }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: active ? 2.4 : 5, repeat: Infinity }}
        />
        {/* enerji çizgileri */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, transparent 0deg, rgba(255,245,200,0.25) 4deg, transparent 8deg)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: active ? 8 : 20, repeat: Infinity, ease: "linear" }}
        />
        {/* cam parlaması */}
        <div className="absolute left-[18%] top-[14%] h-10 w-10 rounded-full bg-white/60 blur-md" />
      </div>
    </div>
  );
}

// Sonsuza giden raf duvarı (kehanet küreleri)
function ShelfWall({ side, dim }: { side: "left" | "right"; dim: boolean }) {
  const rows = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, r) => ({
        r,
        count: 5,
        top: 8 + r * 12,
        depth: 1 - r * 0.11,
      })),
    []
  );
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 w-[34%]"
      style={{
        [side]: 0,
        perspective: "600px",
        transformStyle: "preserve-3d",
      }}
      animate={{ opacity: dim ? 0.18 : 0.8 }}
      transition={{ duration: 1.2 }}
    >
      {rows.map((row) =>
        Array.from({ length: row.count }).map((_, i) => {
          const t = i / row.count;
          return (
            <motion.span
              key={`${row.r}-${i}`}
              className="absolute rounded-full bg-[#d4c27a]"
              style={{
                top: `${row.top + i * 9}%`,
                [side]: `${6 + t * 26}%`,
                width: 7 * row.depth,
                height: 7 * row.depth,
                boxShadow: "0 0 8px 2px rgba(212,175,55,0.6)",
              }}
              animate={{ opacity: [0.3 * row.depth, 0.9 * row.depth, 0.3 * row.depth] }}
              transition={{ duration: 3 + row.r, repeat: Infinity, delay: i * 0.3 }}
            />
          );
        })
      )}
    </motion.div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

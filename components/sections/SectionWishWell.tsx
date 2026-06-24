"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Eyebrow, Title, Reveal } from "@/components/ui/Section";
import ScrollCta from "@/components/ui/ScrollCta";
import StarField from "@/components/effects/StarField";
import HogwartsSilhouette from "@/components/HogwartsSilhouette";
import { config } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";

// Yıldızlar yalnızca ÜST yay üzerinde durur — alt orta (kuyu) bölgesi boş kalır,
// böylece hiçbir yıldız kuyunun/suyun altında kalıp tıklanamaz hale gelmez.
function ringPos(i: number, total: number) {
  const t = total <= 1 ? 0.5 : i / (total - 1);
  const angle = ((-200 + t * 220) * Math.PI) / 180; // -200° → 20°
  return {
    x: 50 + Math.cos(angle) * 36,
    y: 40 + Math.sin(angle) * 24, // en alçak yıldız ~%48 — kuyunun üstünde
  };
}
// Toplanan yıldızların gökyüzündeki konumu (takımyıldız)
const SKY = [
  { x: 22, y: 18 },
  { x: 35, y: 12 },
  { x: 48, y: 20 },
  { x: 60, y: 11 },
  { x: 72, y: 19 },
  { x: 84, y: 13 },
];

export default function SectionWishWell({ onComplete }: { onComplete?: () => void }) {
  const c = config.wishWell;
  const dreams = c.dreams;
  const [collected, setCollected] = useState<number[]>([]);
  const [flying, setFlying] = useState<{ i: number; x: number; y: number } | null>(null);
  const [reveal, setReveal] = useState<{ icon: string; text: string; key: number } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const audio = useAudio();
  const done = collected.length === dreams.length;
  const constellation = c.constellation
    .replace("{you}", config.yourName)
    .replace("{name}", config.girlfriendName);

  const dropStar = (i: number) => {
    if (collected.includes(i) || flying) return;
    const p = ringPos(i, dreams.length);
    setFlying({ i, x: p.x, y: p.y });
    audio.play("pensieve");
  };

  const onLanded = (i: number) => {
    setRippleKey((k) => k + 1);
    setReveal({ icon: dreams[i].icon, text: dreams[i].text, key: Date.now() });
    setCollected((prev) => (prev.includes(i) ? prev : [...prev, i]));
    setFlying(null);
    audio.play("final");
  };

  return (
    <Section id="wishwell" className="flex min-h-[100dvh] flex-col items-center justify-center">
        <SceneBackdrop {...config.scenes.wishwell} />
      {/* huzurlu gece gradyanı */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: done
            ? "radial-gradient(ellipse at 50% 0%, #1a2a55 0%, #0a1430 45%, #050a1c 100%)"
            : "radial-gradient(ellipse at 50% 0%, #0e1c40 0%, #081026 50%, #04060f 100%)",
        }}
        transition={{ duration: 2 }}
      />
      <StarField count={done ? 200 : 120} />

      {/* uzak Hogwarts */}
      <div className="absolute bottom-0 left-0 right-0 h-[26%] opacity-70">
        <HogwartsSilhouette className="absolute bottom-0 h-full w-full" />
      </div>

      {/* gökyüzünde toplanan yıldızlar + takımyıldız */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/3">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 33" preserveAspectRatio="none">
          {done &&
            collected.map((_, i) =>
              i < SKY.length - 1 ? (
                <motion.line
                  key={i}
                  x1={SKY[i].x}
                  y1={SKY[i].y}
                  x2={SKY[i + 1].x}
                  y2={SKY[i + 1].y}
                  stroke="#d4af37"
                  strokeWidth="0.2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ delay: i * 0.2, duration: 0.8 }}
                />
              ) : null
            )}
        </svg>
        {collected.map((ci, idx) => {
          const sp = SKY[idx % SKY.length];
          return (
            <motion.span
              key={ci}
              className="absolute text-gold"
              style={{ left: `${sp.x}%`, top: `${sp.y * 3}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.8], scale: 1 }}
              transition={{ duration: 1 }}
            >
              <span
                className="block text-xs"
                style={{ textShadow: "0 0 10px rgba(212,175,55,0.9)" }}
              >
                ✦
              </span>
            </motion.span>
          );
        })}
      </div>

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

        {/* SAHNE: yıldızlar + kuyu */}
        <div className="relative mx-auto mt-8 h-[460px] w-full max-w-xl sm:h-[500px]">
          {/* süzülen hayal yıldızları */}
          {dreams.map((d, i) => {
            if (collected.includes(i) || flying?.i === i) return null;
            const p = ringPos(i, dreams.length);
            return (
              <motion.button
                key={i}
                onClick={() => dropStar(i)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.25 }}
                aria-label={d.text}
              >
                <span
                  className="block text-2xl transition"
                  style={{ filter: "drop-shadow(0 0 10px rgba(212,175,55,0.8))" }}
                >
                  ⭐
                </span>
                <span className="absolute left-1/2 top-9 w-40 -translate-x-1/2 font-display text-[9px] uppercase tracking-[0.15em] text-parchment/40 opacity-0 transition group-hover:opacity-100">
                  {d.text}
                </span>
              </motion.button>
            );
          })}

          {/* uçan yıldız (kuyuya bırakılıyor) */}
          <AnimatePresence>
            {flying && (
              <motion.span
                key={`fly-${flying.i}`}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-2xl"
                style={{ filter: "drop-shadow(0 0 14px rgba(212,175,55,1))" }}
                initial={{ left: `${flying.x}%`, top: `${flying.y}%`, scale: 1, opacity: 1 }}
                animate={{ left: "50%", top: "76%", scale: [1, 1.6, 0.4], opacity: [1, 1, 0] }}
                transition={{ duration: 1.2, ease: "easeIn" }}
                onAnimationComplete={() => onLanded(flying.i)}
              >
                ⭐
              </motion.span>
            )}
          </AnimatePresence>

          {/* KUYU */}
          <div className="absolute bottom-0 left-1/2 h-[150px] w-[70%] -translate-x-1/2">
            {/* taş gövde */}
            <div className="absolute inset-x-0 bottom-0 h-[58%] rounded-b-[50%] bg-gradient-to-b from-[#2c2417] to-[#15110a] shadow-[0_20px_40px_rgba(0,0,0,0.6)]" />
            <div className="absolute inset-x-[4%] bottom-[44%] h-3 rounded-full bg-gradient-to-r from-[#9c7c1f] via-[#f5e6a8] to-[#9c7c1f] opacity-80" />
            {/* su yüzeyi — yıldız yansıtan */}
            <div className="absolute inset-x-[8%] top-0 h-[58%] overflow-hidden rounded-[50%] border-2 border-[#7c5a22]/70">
              <motion.div
                className="absolute inset-[-30%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, #0a1f45, #16386f, #0c2752, #1d4d8c, #0a1f45)",
                  filter: "blur(4px)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(200,220,255,0.4),transparent_60%)]" />
              {/* yansıyan yıldızlar */}
              {[20, 45, 70, 35, 60].map((x, i) => (
                <motion.span
                  key={i}
                  className="absolute h-0.5 w-0.5 rounded-full bg-white"
                  style={{ left: `${x}%`, top: `${20 + (i % 3) * 22}%` }}
                  animate={{ opacity: [0.2, 0.9, 0.2] }}
                  transition={{ duration: 2 + i, repeat: Infinity }}
                />
              ))}
              {/* dalga halkaları (yıldız düştüğünde) */}
              <AnimatePresence>
                <motion.div
                  key={rippleKey}
                  className="absolute left-1/2 top-1/2 rounded-[50%] border border-gold/70"
                  style={{ width: "30%", height: "44%", x: "-50%", y: "-50%" }}
                  initial={{ scale: 0.2, opacity: 0.9 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 1.4 }}
                />
              </AnimatePresence>
            </div>
            {rippleKey > 0 && (
              <div className="pointer-events-none absolute inset-x-0 top-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.span
                    key={`${rippleKey}-${i}`}
                    className="absolute left-1/2 top-2 h-1 w-1 rounded-full bg-gold"
                    initial={{ y: 0, opacity: 1, x: (i - 3) * 8 }}
                    animate={{ y: -60, opacity: 0 }}
                    transition={{ duration: 1.2, delay: i * 0.05 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* açığa çıkan hayal metni */}
        <div className="mt-2 min-h-[60px]">
          <AnimatePresence mode="wait">
            {reveal && !done && (
              <motion.p
                key={reveal.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-serif text-xl italic text-gold-light"
                style={{ textShadow: "0 0 18px rgba(212,175,55,0.5)" }}
              >
                {reveal.icon} {reveal.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ilerleme */}
        {!done && (
          <p className="mt-2 font-display text-xs uppercase tracking-[0.3em] text-parchment/40">
            {collected.length} / {dreams.length} hayal gökyüzünde
          </p>
        )}

        {/* FİNAL — takımyıldız + mesaj */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1.4 }}
              className="mt-4"
            >
              <h3
                className="heading-display text-3xl font-bold text-gold-light sm:text-4xl"
                style={{ textShadow: "0 0 30px rgba(212,175,55,0.8)" }}
              >
                {constellation}
              </h3>
              <p className="mt-4 font-serif text-xl italic text-parchment/90">
                {c.finaleMessage}
              </p>
              <ScrollCta onContinue={onComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

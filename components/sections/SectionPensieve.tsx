"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Eyebrow, Title, Reveal } from "@/components/ui/Section";
import SmartImage from "@/components/SmartImage";
import ScrollCta from "@/components/ui/ScrollCta";
import { config } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";
import StarField from "@/components/effects/StarField";
import Particles from "@/components/effects/Particles";

export default function SectionPensieve({ onComplete }: { onComplete?: () => void }) {
  const c = config.pensieve;
  const [index, setIndex] = useState(-1); // -1 = henüz dokunulmadı
  const audio = useAudio();
  const memory = index >= 0 ? c.memories[index] : null;

  const surface = () => {
    audio.play("pensieve");
    setIndex((i) => (i + 1) % c.memories.length);
  };

  return (
    <Section id="pensieve" className="flex min-h-[100dvh] flex-col items-center justify-center">
        <SceneBackdrop {...config.scenes.pensieve} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,#0c1530_0%,#070b1a_55%,#04060f_100%)]" />
      <StarField count={80} />
      <Particles count={20} />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <Reveal>
          <Title>{c.title}</Title>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg text-parchment/70">
            {c.subtitle}
          </p>
        </Reveal>

        {/* Yükselen anı + havuz */}
        <div className="relative mt-6 flex w-full max-w-2xl flex-col items-center gap-6">
          {/* yükselen anı — kendi yüksekliğini içeriğe göre alır */}
          <div className="pointer-events-none flex min-h-[260px] w-full items-center justify-center sm:min-h-[300px]">
            <AnimatePresence>
              {memory && (
                <motion.figure
                  key={index}
                  initial={{ y: 120, scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                  animate={{
                    y: [120, -6, 0],
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    rotateZ: [0, 1.5, -1.5, 0],
                  }}
                  exit={{ y: -40, scale: 0.7, opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-56 sm:w-72"
                >
                  {/* enerji halkası */}
                  <motion.div
                    className="absolute -inset-5 rounded-2xl"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(190,220,255,0.35), transparent 70%)",
                    }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative rounded-lg border border-[#bcdcff]/30 bg-[#0a1228] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                  >
                    <SmartImage
                      src={memory.src}
                      video={memory.video}
                      alt={memory.title}
                      icon="✦"
                      fit="contain"
                      className="max-h-[32vh] w-full rounded bg-black/30 sm:max-h-[38vh]"
                    />
                  </motion.div>
                  {/* figcaption: fotoğrafın altında, havuzun üstünde — hiçbir zaman üst üste gelmiyor */}
                  <figcaption className="mt-4 px-1">
                    {memory.date ? (
                      <div className="font-display text-[11px] uppercase tracking-[0.3em] text-[#9fc4ff]/70">
                        {memory.date}
                      </div>
                    ) : null}
                    <div className="heading-display text-xl text-[#dbe6ff]">
                      {memory.title}
                    </div>
                    <p className="mt-1 font-serif text-sm leading-relaxed italic text-parchment/80 sm:text-base">
                      {memory.caption}
                    </p>
                  </figcaption>
                </motion.figure>
              )}
            </AnimatePresence>
            {!memory && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="font-serif text-lg italic text-[#9fc4ff]/70"
              >
                {c.hint}
              </motion.p>
            )}
          </div>

          {/* PENSIEVE HAVUZU */}
          <button
            onClick={surface}
            aria-label="Düşünce havuzuna dokun"
            className="group relative h-[150px] w-[88%] max-w-xl sm:h-[180px]"
          >
            {/* taş kaide */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[50%] bg-gradient-to-b from-[#2a3346] to-[#11151f] shadow-[0_20px_40px_rgba(0,0,0,0.6)]" />
            {/* gümüş sıvı yüzeyi */}
            <div className="absolute inset-x-[6%] top-0 h-[64%] overflow-hidden rounded-[50%] border-2 border-[#3a4660]">
              <motion.div
                className="absolute inset-[-30%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, #dfeeff, #8fb3d6, #c9dcf0, #6f8aa6, #eaf4ff, #9bbada, #dfeeff)",
                  filter: "blur(6px)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.5),transparent_60%)]" />
              {/* dalga halkaları */}
              {[0, 1, 2].map((r) => (
                <motion.div
                  key={r}
                  className="absolute left-1/2 top-1/2 rounded-[50%] border border-white/40"
                  style={{ width: "40%", height: "60%", x: "-50%", y: "-50%" }}
                  animate={{ scale: [0.4, 1.4], opacity: [0.6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: r }}
                />
              ))}
            </div>
            <div className="absolute inset-x-[6%] top-0 h-[64%] rounded-[50%] shadow-[inset_0_0_30px_rgba(120,160,220,0.6)] transition group-hover:shadow-[inset_0_0_40px_rgba(180,210,255,0.9)]" />
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[10px] uppercase tracking-[0.3em] text-[#9fc4ff]/60 transition group-hover:text-[#9fc4ff]">
              {c.hint}
            </span>
          </button>
        </div>

        {/* anı göstergeleri */}
        <div className="mt-10 flex items-center gap-2">
          {c.memories.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-[#9fc4ff]" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* En az bir anı yükselmeden devam edilemez */}
        {index >= 0 && <ScrollCta onContinue={onComplete} />}
      </div>
    </Section>
  );
}

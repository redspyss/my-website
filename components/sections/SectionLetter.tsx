"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import Particles from "@/components/effects/Particles";
import StarField from "@/components/effects/StarField";
import { config } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";

export default function SectionLetter({ onComplete }: { onComplete?: () => void }) {
  const [opened, setOpened] = useState(false);
  const audio = useAudio();
  const c = config.letter;

  const greeting = c.greeting.replace("{name}", config.girlfriendName);
  const signature = c.signature.replace("{you}", config.yourName);

  return (
    <Section id="letter" className="flex min-h-[100dvh] items-center justify-center">
        <SceneBackdrop {...config.scenes.letter} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,#101a36_0%,#070b1a_55%,#04060f_100%)]" />
      {/* uzak kule ışıkları */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3">
        {[12, 28, 50, 72, 88].map((x, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#ffcf6b]"
            style={{ left: `${x}%`, bottom: `${10 + (i % 3) * 12}%` }}
            animate={{ opacity: [0.3, 1, 0.4], boxShadow: ["0 0 6px #ffcf6b", "0 0 16px #ffcf6b", "0 0 6px #ffcf6b"] }}
            transition={{ duration: 3 + i, repeat: Infinity }}
          />
        ))}
      </div>
      <StarField count={70} />
      <Particles count={40} />
      <div className="fog drift" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>

        <div className="relative mt-6 w-full max-w-xl [perspective:1600px]">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.button
                key="envelope"
                onClick={() => {
                  setOpened(true);
                  audio.play("letter");
                }}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: [0, -14, 0] }}
                transition={{
                  opacity: { duration: 0.8 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="group relative mx-auto block aspect-[3/2] w-full rounded-md"
                aria-label="Mührü kır ve mektubu aç"
              >
                <div className="absolute -inset-6 rounded-2xl bg-gold/10 blur-2xl transition group-hover:bg-gold/20" />
                <div className="absolute inset-0 rounded-md bg-[linear-gradient(135deg,#e8dcc0,#cdb98a)] shadow-[0_30px_70px_rgba(0,0,0,0.6)]" />
                <div className="absolute inset-0 rounded-md [background:repeating-linear-gradient(45deg,transparent,transparent_18px,rgba(124,90,34,0.08)_19px,transparent_20px)]" />
                <div
                  className="absolute left-0 right-0 top-0 h-1/2 origin-top rounded-t-md"
                  style={{
                    background: "linear-gradient(180deg,#dccfa8,#c2ad7c)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                />
                <div className="absolute left-1/2 top-1/2 z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#8c2230,#4d0d15)] text-2xl text-gold-light shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition group-hover:scale-110 group-hover:animate-glow">
                  ⚜
                </div>
                <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-xs uppercase tracking-[0.35em] text-gold/70">
                  {c.sealHint}
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="letter"
                initial={{ opacity: 0, scale: 0.85, rotateX: 40 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-xl bg-gold/15 blur-2xl" />
                {opened && <Particles count={30} />}
                <div className="parchment-panel relative mx-auto w-full rounded-md px-7 py-10 text-left sm:px-12">
                  <div className="text-center font-display text-sm uppercase tracking-[0.4em] text-bordeaux">
                    {c.title}
                  </div>
                  <div className="mx-auto my-5 h-px w-32 bg-gradient-to-r from-transparent via-[#7c5a22] to-transparent" />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-serif text-xl leading-relaxed text-[#3a230f] sm:text-2xl"
                  >
                    {greeting}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-4 font-serif text-lg leading-relaxed text-[#4a3115] sm:text-xl"
                  >
                    {c.body}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 text-right font-serif text-lg italic text-[#5a3d1a]"
                  >
                    {signature}
                  </motion.p>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => {
                        audio.play("letter");
                        onComplete?.();
                      }}
                      className="group relative overflow-hidden rounded-full bg-gradient-to-b from-[#6a1420] to-[#3d0a12] px-8 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] text-gold-light shadow-lg transition hover:from-[#7c1f2e]"
                    >
                      <span className="relative z-10">{c.buttonLabel}</span>
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

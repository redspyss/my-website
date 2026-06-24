"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Section } from "@/components/ui/Section";
import ScrollCta from "@/components/ui/ScrollCta";
import Particles from "@/components/effects/Particles";
import { config } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";

export default function SectionGreatHall({ onComplete }: { onComplete?: () => void }) {
  const messages = config.greatHallFinale.messages;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30%" });
  const [step, setStep] = useState(-1);
  const audio = useAudio();

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    setStep(0);
    audio.play("final");
    const id = window.setInterval(() => {
      i += 1;
      if (i >= messages.length) {
        window.clearInterval(id);
        return;
      }
      setStep(i);
      audio.play("final");
    }, 2600);
    return () => window.clearInterval(id);
  }, [inView, messages.length, audio]);

  const candles = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        dur: 10 + Math.random() * 10,
        size: 4 + Math.random() * 7,
        sway: (Math.random() - 0.5) * 30,
      })),
    []
  );

  return (
    <Section id="greathall" className="flex min-h-[100dvh] items-center justify-center">
        <SceneBackdrop {...config.scenes.greathall} />
      {/* gökyüzü yavaşça kararır */}
      <motion.div
        className="absolute inset-0"
        initial={{ background: "radial-gradient(ellipse at 50% 20%, #16224a 0%, #070b1a 55%, #04060f 100%)" }}
        whileInView={{ background: "radial-gradient(ellipse at 50% 30%, #0a1024 0%, #050813 55%, #020308 100%)" }}
        viewport={{ once: true }}
        transition={{ duration: 4 }}
      />

      {/* yükselen mumlar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {candles.map((c) => (
          <span
            key={c.id}
            className="gh-candle"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 2.4,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.dur}s`,
              ["--sway" as string]: `${c.sway}px`,
            }}
          />
        ))}
      </div>

      <Particles count={50} />

      <div ref={ref} className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <div className="grid min-h-[160px] place-items-center">
          <AnimatePresence mode="wait">
            {step >= 0 && (
              <motion.h2
                key={step}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className={`heading-display ${
                  step === 0
                    ? "text-4xl text-gradient-gold sm:text-6xl"
                    : "text-2xl text-parchment/90 sm:text-4xl"
                }`}
                style={step !== 0 ? { textShadow: "0 0 24px rgba(212,175,55,0.4)" } : undefined}
              >
                {messages[step]}
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        {step >= messages.length - 1 && <ScrollCta onContinue={onComplete} />}
      </div>

      <style jsx>{`
        .gh-candle {
          position: absolute;
          bottom: -10%;
          border-radius: 50% 50% 45% 45%;
          background: radial-gradient(
            circle at 50% 30%,
            #fff3c4 0%,
            #ffcf6b 45%,
            #ff9b3b 80%,
            rgba(255, 155, 59, 0) 100%
          );
          box-shadow: 0 0 14px 5px rgba(255, 180, 80, 0.5);
          animation-name: gh-rise;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
        }
        @keyframes gh-rise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-118vh) translateX(var(--sway, 0));
            opacity: 0;
          }
        }
      `}</style>
    </Section>
  );
}

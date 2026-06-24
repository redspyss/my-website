"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Section } from "@/components/ui/Section";
import StarField from "@/components/effects/StarField";
import Particles from "@/components/effects/Particles";
import HogwartsSilhouette from "@/components/HogwartsSilhouette";
import { config } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";

export default function SectionFinale() {
  const c = config.finale;
  const starName = c.starName
    .replace("{you}", config.yourName)
    .replace("{name}", config.girlfriendName);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [step, setStep] = useState(0);
  const [hiddenOpen, setHiddenOpen] = useState(false);
  const audio = useAudio();

  // Adımlar: 1=isim, 2=line1, 3=line2, 4..(3+N)=extraLines, (4+N)=closing, (5+N)=gizli
  const extra = c.extraLines ?? [];
  const closingStep = 4 + extra.length;
  const hiddenStep = 5 + extra.length;

  useEffect(() => {
    if (!inView) return;
    const totalSteps = hiddenStep;
    const timers: number[] = [];
    for (let s = 1; s <= totalSteps; s++) {
      timers.push(
        window.setTimeout(() => {
          setStep(s);
          if (s < hiddenStep) audio.play("final");
        }, 1200 + (s - 1) * 1900)
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, audio, hiddenStep]);

  const lanterns = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 12 + Math.random() * 12,
        size: 6 + Math.random() * 9,
        sway: (Math.random() - 0.5) * 30,
      })),
    []
  );

  return (
    <Section id="finale" className="flex min-h-[100dvh] items-start justify-center pt-[12vh] sm:pt-[14vh]">
        <SceneBackdrop {...config.scenes.finale} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#0b1430_0%,#070b1a_45%,#04060f_100%)]" />
      <StarField count={170} />
      <Particles count={36} />

      {/* uçan fenerler */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {lanterns.map((l) => (
          <span
            key={l.id}
            className="fin-lantern"
            style={{
              left: `${l.left}%`,
              width: l.size,
              height: l.size * 1.4,
              animationDelay: `${l.delay}s`,
              animationDuration: `${l.dur}s`,
              ["--sway" as string]: `${l.sway}px`,
            }}
          />
        ))}
      </div>

      {/* uzakta Hogwarts + göl yansıması */}
      <div className="absolute bottom-0 left-0 right-0 h-[38%]">
        <HogwartsSilhouette className="absolute bottom-[28%] h-[72%] w-full opacity-90" />
        <div className="absolute bottom-0 h-[30%] w-full bg-[linear-gradient(180deg,#0a1430,#04060f)]" />
        <HogwartsSilhouette
          className="absolute bottom-0 h-[72%] w-full -scale-y-100 opacity-15 blur-[2px]"
          glow={false}
        />
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        {/* YILDIZ İSMİ (takımyıldız) */}
        <div className="relative mb-10">
          <ConstellationName name={starName} show={step >= 1} />
        </div>

        <AnimatePresence>
          {step >= 2 && (
            <motion.p
              key="l1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="heading-display text-2xl font-semibold leading-relaxed text-gradient-gold sm:text-3xl"
            >
              {c.line1}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 3 && (
            <motion.p
              key="l2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="mt-3 font-serif text-xl leading-relaxed text-parchment/90 sm:text-2xl"
            >
              {c.line2}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Kendi kapanış satırların (config: finale.extraLines) */}
        <div className="mt-5 space-y-3">
          {extra.map((line, i) => (
            <AnimatePresence key={i}>
              {step >= 4 + i && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="font-serif text-lg leading-relaxed text-parchment/85 sm:text-xl"
                >
                  {line}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>

        <AnimatePresence>
          {step >= closingStep && (
            <motion.p
              key="closing"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.6 }}
              className="mt-12 font-display text-2xl uppercase tracking-[0.3em] text-gold-light sm:text-3xl"
              style={{ textShadow: "0 0 26px rgba(212,175,55,0.7)" }}
            >
              {c.closing}
            </motion.p>
          )}
        </AnimatePresence>

        {/* GİZLİ MEKTUP yıldızı */}
        <AnimatePresence>
          {step >= hiddenStep && (
            <motion.button
              key="hidden"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
              onClick={() => {
                setHiddenOpen(true);
                audio.play("final");
              }}
              className="group mx-auto mt-10 block"
              aria-label={config.finale.hiddenTitle}
              title={config.finale.hiddenHint}
            >
              <motion.span
                className="block text-2xl"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  textShadow: [
                    "0 0 8px rgba(212,175,55,0.5)",
                    "0 0 22px rgba(212,175,55,1)",
                    "0 0 8px rgba(212,175,55,0.5)",
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                ✦
              </motion.span>
              <span className="mt-2 block font-display text-[9px] uppercase tracking-[0.3em] text-gold/40 transition group-hover:text-gold/80">
                {config.finale.hiddenHint}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* GİZLİ MEKTUP */}
      <AnimatePresence>
        {hiddenOpen && (
          <motion.div
            className="fixed inset-0 z-[180] flex items-center justify-center bg-black/85 px-5 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHiddenOpen(false)}
          >
            <Particles count={50} />
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="parchment-panel relative max-w-lg rounded-xl px-8 py-10 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-3xl">✦</div>
              <h3 className="heading-display mt-2 text-2xl text-bordeaux">
                {config.finale.hiddenTitle}
              </h3>
              <div className="mx-auto my-4 h-px w-24 bg-gradient-to-r from-transparent via-[#7c5a22] to-transparent" />
              <p className="font-serif text-lg leading-relaxed text-[#3a230f]">
                {config.finale.hiddenBody}
              </p>
              <p className="mt-6 font-serif text-base italic text-[#5a3d1a]">
                — {config.yourName}
              </p>
              <button
                onClick={() => setHiddenOpen(false)}
                className="mt-6 rounded-full bg-gradient-to-b from-[#6a1420] to-[#3d0a12] px-6 py-2 font-display text-xs uppercase tracking-[0.25em] text-gold-light transition hover:from-[#7c1f2e]"
              >
                Nox
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .fin-lantern {
          position: absolute;
          bottom: -8%;
          border-radius: 50% 50% 45% 45%;
          background: radial-gradient(
            circle at 50% 35%,
            #fff3c4 0%,
            #ffcf6b 45%,
            #ff8c2b 80%,
            rgba(255, 140, 43, 0) 100%
          );
          box-shadow: 0 0 16px 6px rgba(255, 180, 80, 0.55);
          animation-name: fin-up;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
        }
        @keyframes fin-up {
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
            transform: translateY(-115vh) translateX(var(--sway, 0));
            opacity: 0;
          }
        }
      `}</style>
    </Section>
  );
}

// İsmin yıldızlardan oluşması efekti
function ConstellationName({ name, show }: { name: string; show: boolean }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 26 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        d: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="relative mx-auto flex h-28 max-w-2xl items-center justify-center">
      {/* dağınık yıldızlar toplanıyor */}
      <div aria-hidden className="absolute inset-0">
        {dots.map((dot, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{ left: `${dot.x}%`, top: `${dot.y}%`, boxShadow: "0 0 6px #fff" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              show
                ? { opacity: [0, 1, 0.5], scale: [0, 1.4, 1] }
                : { opacity: 0 }
            }
            transition={{ duration: 1.4, delay: dot.d * 0.3 }}
          />
        ))}
      </div>
      <motion.h2
        initial={{ opacity: 0, scale: 0.8, letterSpacing: "0.5em" }}
        animate={
          show
            ? { opacity: 1, scale: 1, letterSpacing: "0.05em" }
            : { opacity: 0 }
        }
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="relative heading-display text-3xl font-bold text-gold-light sm:text-5xl"
        style={{ textShadow: "0 0 30px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4)" }}
      >
        {name}
      </motion.h2>
    </div>
  );
}

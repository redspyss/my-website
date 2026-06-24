"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import ScrollCta from "@/components/ui/ScrollCta";
import { config } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";

export default function SectionPatronus({ onComplete }: { onComplete?: () => void }) {
  const [cast, setCast] = useState(false);
  const audio = useAudio();
  const c = config.patronus;

  return (
    <Section id="patronus" className="flex min-h-[100dvh] items-center justify-center">
        <SceneBackdrop {...config.scenes.patronus} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#0a1024_0%,#04060f_70%,#000_100%)]" />

      {/* Karanlık + yoğun sis (cast edilmeden önce) */}
      <AnimatePresence>
        {!cast && (
          <motion.div
            key="dark"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
          >
            <div className="absolute inset-0 bg-black/55" />
            <div className="fog drift" style={{ opacity: 0.9 }} />
            <div className="fog drift" style={{ animationDelay: "-10s", opacity: 0.8 }} />
            <Dementors />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>

        {!cast && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mb-4 font-serif text-lg italic text-parchment/60"
          >
            {c.intro}
          </motion.p>
        )}

        <div className="relative grid h-[320px] w-full place-items-center sm:h-[400px]">
          <PatronusCanvas active={cast} />
        </div>

        <AnimatePresence mode="wait">
          {!cast ? (
            <motion.button
              key="cast"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setCast(true);
                audio.play("patronus");
                window.setTimeout(() => audio.play("patronus"), 500);
              }}
              className="rounded-full border border-[#9fd8ff]/40 px-8 py-3 font-display text-sm uppercase tracking-[0.25em] text-[#cfeeff] transition hover:bg-[#9fd8ff]/10 hover:shadow-[0_0_30px_rgba(159,216,255,0.4)]"
            >
              {c.castLabel}
            </motion.button>
          ) : (
            <motion.div
              key="msg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.2 }}
            >
              <p
                className="heading-display text-2xl text-[#cfeeff] sm:text-4xl"
                style={{ textShadow: "0 0 28px rgba(159,216,255,0.8)" }}
              >
                {c.message}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1.4 }}
                className="mx-auto mt-4 max-w-lg font-serif text-lg italic text-parchment/80"
              >
                {c.submessage}
              </motion.p>
              <ScrollCta onContinue={onComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function Dementors() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-64 w-40 blur-2xl"
          style={{
            left: `${8 + i * 20}%`,
            top: `${12 + (i % 3) * 22}%`,
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(15,15,25,0.95), transparent 70%)",
          }}
          animate={{ x: [0, 20, -15, 0], y: [0, -18, 12, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function PatronusCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    size();
    window.addEventListener("resize", size);

    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };
    const particles: P[] = [];
    let raf = 0;
    let t = 0;
    const cx = () => canvas.width / 2;
    const cy = () => canvas.height / 2;

    const loop = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spawn = active ? 16 : 2;
      for (let i = 0; i < spawn; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = active ? (Math.random() * 0.5 + 0.5) * 120 * dpr : 24 * dpr;
        particles.push({
          x: cx() + Math.cos(angle) * radius * Math.random() * 0.4,
          y: cy() + Math.sin(angle) * radius * Math.random() * 0.4,
          vx: Math.cos(angle) * (Math.random() * 1.2 + 0.3) * dpr,
          vy: Math.sin(angle) * (Math.random() * 1.2 + 0.3) * dpr - (active ? 0.4 : 0),
          life: 0,
          max: 60 + Math.random() * 60,
          r: (Math.random() * 2 + 1) * dpr,
        });
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.004 * dpr;
        if (p.life > p.max) {
          particles.splice(i, 1);
          continue;
        }
        const alpha = (1 - p.life / p.max) * (active ? 0.9 : 0.35);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(220,245,255,${alpha})`);
        grad.addColorStop(0.4, `rgba(150,210,255,${alpha * 0.8})`);
        grad.addColorStop(1, "rgba(120,180,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (active) {
        const pulse = 0.6 + Math.sin(t * 3) * 0.3;
        const core = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), 100 * dpr);
        core.addColorStop(0, `rgba(200,240,255,${0.5 * pulse})`);
        core.addColorStop(1, "rgba(150,210,255,0)");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(cx(), cy(), 100 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ filter: active ? "none" : "saturate(0.5) brightness(0.8)" }}
    />
  );
}

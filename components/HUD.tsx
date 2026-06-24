"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/lib/ExperienceProvider";
import { useAudio } from "@/lib/AudioProvider";
import { config } from "@/site.config";

export default function HUD() {
  const { lumos, toggleLumos } = useExperience();
  const audio = useAudio();
  const [eggOpen, setEggOpen] = useState(false);
  const egg = config.easterEgg;

  return (
    <>
      {/* Lumos overlay — ekranı yumuşak altın ışıkla aydınlatır */}
      <AnimatePresence>
        {lumos && (
          <motion.div
            key="lumos"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[90] mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(245,230,168,0.20) 0%, rgba(212,175,55,0.08) 35%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 z-[130] flex flex-col items-end gap-3">
        <HudButton
          label={lumos ? "Nox" : "Lumos"}
          title={lumos ? "Işığı söndür (Nox)" : "Işığı yak (Lumos)"}
          onClick={() => {
            toggleLumos();
            audio.play("ui");
          }}
        >
          {lumos ? "🌙" : "✨"}
        </HudButton>

        <HudButton
          label={audio.enabled ? "Ses" : "Sessiz"}
          title={audio.enabled ? "Sesi kapat" : "Sesi aç"}
          onClick={() => audio.toggle()}
        >
          {audio.enabled ? "🔊" : "🔇"}
        </HudButton>

        <HudButton
          label="Sır"
          title="Gizli büyü"
          onClick={() => {
            setEggOpen(true);
            audio.play("ui");
          }}
        >
          🪄
        </HudButton>
      </div>

      {/* Easter Egg */}
      <AnimatePresence>
        {eggOpen && (
          <motion.div
            className="fixed inset-0 z-[180] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEggOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="glass-dark max-w-md rounded-2xl px-8 py-10 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 text-5xl">{egg.icon}</div>
              <h3 className="heading-display text-xl text-gradient-gold">
                {egg.title}
              </h3>
              <p className="mt-4 font-serif text-lg leading-relaxed text-parchment/90">
                {egg.quote}
              </p>
              <p className="mt-4 font-serif text-sm italic text-gold/70">
                {egg.sign}
              </p>
              <button
                onClick={() => setEggOpen(false)}
                className="mt-6 rounded-full border border-gold/40 px-6 py-2 font-display text-xs uppercase tracking-[0.25em] text-gold transition hover:bg-gold/10"
              >
                Nox
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HudButton({
  children,
  label,
  title,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="glass-dark group flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-parchment/90 shadow-lg transition hover:border-gold/50 hover:text-gold"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-base transition group-hover:scale-110">
        {children}
      </span>
      <span className="font-display text-[10px] uppercase tracking-[0.25em]">
        {label}
      </span>
    </button>
  );
}

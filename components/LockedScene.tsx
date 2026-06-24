"use client";

import { motion } from "framer-motion";

// Henüz açılmamış bölüm — soluk, mühürlü, etkileşime kapalı.
export default function LockedScene({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <section
      id={id}
      aria-hidden
      className="relative flex min-h-[70vh] w-full select-none items-center justify-center overflow-hidden section-pad"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#080b16_0%,#05070f_60%,#04060f_100%)]" />
      <div className="fog drift" style={{ opacity: 0.35 }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="relative z-10 flex flex-col items-center gap-5 text-center opacity-50"
      >
        {/* mühür */}
        <motion.div
          className="grid h-20 w-20 place-items-center rounded-full border border-gold/30 bg-night-800/60"
          animate={{ boxShadow: ["0 0 0 0 rgba(212,175,55,0.0)", "0 0 24px 2px rgba(212,175,55,0.15)", "0 0 0 0 rgba(212,175,55,0.0)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-gold/70">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </motion.div>
        <h3 className="heading-display text-xl tracking-[0.15em] text-parchment/50 blur-[1px]">
          {title}
        </h3>
        <p className="font-display text-[10px] uppercase tracking-[0.4em] text-gold/40">
          Mühürlü · Önceki bölümü tamamla
        </p>
      </motion.div>
    </section>
  );
}

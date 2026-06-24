"use client";

import { motion } from "framer-motion";

// Bir bölüm tamamlandığında görünen "devam" düğmesi.
// Tıklanınca bir sonraki mühürlü bölümün kilidini açar (onContinue).
export default function ScrollCta({
  onContinue,
  label = "Yola Devam Et",
  className = "",
}: {
  onContinue?: () => void;
  label?: string;
  className?: string;
}) {
  if (!onContinue) return null;

  return (
    <motion.button
      onClick={onContinue}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className={`group mx-auto mt-12 flex flex-col items-center gap-2 ${className}`}
      aria-label={`${label} — sonraki bölümün kilidini aç`}
    >
      <span className="font-display text-[11px] uppercase tracking-[0.35em] text-gold/70 transition group-hover:text-gold">
        {label}
      </span>
      <motion.span
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-gold transition group-hover:bg-gold/10 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    </motion.button>
  );
}

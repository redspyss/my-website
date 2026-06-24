"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Sahneler arası sert çizgi olmaması için üst/alt yumuşak geçiş maskeleri.
export function Section({
  id,
  children,
  className = "",
  fade = true,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  fade?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden section-pad ${className}`}
    >
      {children}
      {fade && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-32 bg-gradient-to-b from-night-900/90 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 bg-gradient-to-t from-night-900/90 to-transparent"
          />
        </>
      )}
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 inline-block font-display text-xs uppercase tracking-[0.45em] text-gold/80">
      {children}
    </span>
  );
}

export function Title({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`heading-display text-3xl font-bold leading-tight text-gradient-gold sm:text-4xl md:text-5xl ${className}`}
    >
      {children}
    </h2>
  );
}

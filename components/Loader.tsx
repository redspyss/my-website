"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Particles from "./effects/Particles";
import { config } from "@/site.config";

// Yükleme ekranı: Hogwarts arması + büyülü ışık halkaları (progress bar yok).
export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const id = window.setInterval(() => {
      p += Math.random() * 13 + 4;
      if (p >= 100) {
        p = 100;
        window.clearInterval(id);
        window.setTimeout(onDone, 750);
      }
      setProgress(Math.min(100, Math.round(p)));
    }, 230);
    return () => window.clearInterval(id);
  }, [onDone]);

  const t = progress / 100; // 0 → 1

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-night-900"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* yükleme ilerledikçe yoğunlaşan büyü parçacıkları */}
      <Particles count={Math.round(18 + t * 34)} />

      <div className="relative flex flex-col items-center gap-10 px-6 text-center">
        <div className="relative grid place-items-center">
          {/* arka glow — ilerledikçe güçlenir */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 320,
              height: 320,
              background:
                "radial-gradient(circle, rgba(212,175,55,0.45), rgba(212,175,55,0.12) 45%, transparent 70%)",
            }}
            animate={{ opacity: 0.25 + t * 0.6, scale: [1, 1.06, 1] }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* genişleyen ışık halkaları */}
          {[0, 1, 2].map((r) => (
            <motion.span
              key={r}
              className="absolute rounded-full border border-gold/40"
              style={{ width: 200, height: 200 }}
              animate={{ scale: [0.7, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, delay: r * 1.1, ease: "easeOut" }}
            />
          ))}

          {/* yavaş dönen büyü çemberi */}
          <motion.span
            aria-hidden
            className="absolute rounded-full border-t border-gold/30"
            style={{ width: 260, height: 260 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />

          {/* ARMA — nefes alıyormuş gibi */}
          <motion.img
            src="/photos/hogwarts-logo.png"
            alt="Hogwarts arması"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: [1, 1.045, 1] }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="relative w-[clamp(190px,42vw,330px)] select-none"
            style={{
              filter: `drop-shadow(0 0 ${10 + t * 26}px rgba(212,175,55,${
                0.4 + t * 0.5
              })) drop-shadow(0 8px 24px rgba(0,0,0,0.6))`,
            }}
            draggable={false}
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="heading-display text-xl font-semibold tracking-[0.25em] text-gradient-gold sm:text-2xl"
        >
          {config.loader.text}
        </motion.h1>
      </div>
    </motion.div>
  );
}

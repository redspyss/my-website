"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import StarField from "./effects/StarField";
import Particles from "./effects/Particles";
import { useAudio } from "@/lib/AudioProvider";
import { config } from "@/site.config";

export default function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const audio = useAudio();
  const g = config.gate;

  // Hafif mouse parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18 });
  const sy = useSpring(py, { stiffness: 40, damping: 18 });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      px.set(x * 14);
      py.set(y * 10);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [px, py]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    setStatus("loading");
    setMessage("");
    audio.enable();

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        audio.play("gate");
        window.setTimeout(() => audio.play("gate"), 700);
        window.setTimeout(onUnlock, 3200);
      } else {
        setStatus("error");
        setMessage(data.message || g.errorMessage);
        audio.play("gate");
        window.setTimeout(() => setStatus("idle"), 900);
      }
    } catch {
      setStatus("error");
      setMessage("Büyü bağlantısı kurulamadı. Tekrar dene.");
      window.setTimeout(() => setStatus("idle"), 900);
    }
  };

  const success = status === "success";

  return (
    <div ref={rootRef} className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* SİNEMATİK ARKA PLAN GÖRSELİ */}
      <motion.div
        className="absolute inset-0"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          className="absolute inset-[-6%] bg-cover bg-center"
          style={{ backgroundImage: `url('${g.backgroundImage}')` }}
          initial={{ scale: 1.0 }}
          animate={
            success
              ? { scale: 1.75, y: "-6%", filter: "brightness(1.3)" }
              : { scale: [1.0, 1.08, 1.0] }
          }
          transition={
            success
              ? { duration: 3.2, ease: [0.7, 0, 0.3, 1] }
              : { duration: 28, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>

      {/* Atmosferik karartma + vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_25%,rgba(0,0,0,0.55)_75%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Ay ışığı huzmesi */}
      <motion.div
        className="absolute left-[8%] top-[4%] h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(220,230,255,0.35) 0%, rgba(180,200,255,0.12) 40%, transparent 70%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hareket eden bulutlar / sis katmanları */}
      <div className="fog drift" />
      <div className="fog drift" style={{ animationDelay: "-14s", opacity: 0.7 }} />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgba(120,140,180,0.18), transparent)",
        }}
      />

      <StarField count={90} />
      <Particles count={40} />

      {/* PARŞÖMEN ŞİFRE KUTUSU */}
      <div className="relative z-20 flex h-full items-center justify-center px-5">
        <AnimatePresence>
          {!success && (
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full max-w-md ${
                status === "error" ? "animate-shake" : ""
              }`}
            >
              {/* altın glow halesi */}
              <div className="absolute -inset-3 rounded-[20px] bg-gold/10 blur-2xl" />
              <div className="parchment-panel relative overflow-hidden rounded-[14px] px-6 py-9 text-center sm:px-10">
                {/* altın işlemeli köşe süsleri */}
                <Corner className="left-2 top-2" />
                <Corner className="right-2 top-2 rotate-90" />
                <Corner className="bottom-2 left-2 -rotate-90" />
                <Corner className="bottom-2 right-2 rotate-180" />

                <div className="mb-1 font-serif text-xs uppercase tracking-[0.45em] text-bordeaux/80">
                  {config.anniversaryDate}
                </div>
                <h1 className="heading-display text-2xl font-bold leading-tight text-[#3a230f] sm:text-3xl">
                  {g.title}
                </h1>
                <div className="mx-auto my-4 h-px w-24 bg-gradient-to-r from-transparent via-[#7c5a22] to-transparent" />
                <p className="mx-auto max-w-sm font-serif text-base italic leading-relaxed text-[#4a3115] sm:text-lg">
                  {g.subtitle}
                </p>

                <div className="mt-7">
                  <label htmlFor="spell" className="sr-only">
                    Büyü sözcüğü
                  </label>
                  <input
                    id="spell"
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={g.placeholder}
                    disabled={status === "loading"}
                    className="w-full rounded-md border border-[#7c5a22]/50 bg-[#f3ead2]/80 px-5 py-3 text-center font-serif text-lg tracking-[0.3em] text-[#3a230f] placeholder:text-[#8a6c3a]/60 outline-none transition focus:border-[#7c5a22] focus:shadow-[0_0_0_3px_rgba(124,90,34,0.25)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative mt-5 w-full overflow-hidden rounded-md bg-gradient-to-b from-[#6a1420] to-[#3d0a12] px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.25em] text-gold-light shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition hover:from-[#7c1f2e] hover:to-[#4a0d16] disabled:opacity-70"
                >
                  <span className="relative z-10">
                    {status === "loading" ? g.loadingLabel : g.buttonLabel}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>

                <AnimatePresence>
                  {message && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 font-serif text-base italic text-[#7c1f2e]"
                    >
                      {message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* BAŞARI — Lumos patlaması + altın parçacıklar + hoş geldin */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Particles count={90} />
            {/* lumos parlaması */}
            <motion.div
              className="absolute h-40 w-40 rounded-full bg-gold-light"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 26, opacity: [1, 1, 0] }}
              transition={{ duration: 2.6, ease: "easeOut" }}
              style={{
                boxShadow:
                  "0 0 120px 60px rgba(245,230,168,0.9), 0 0 240px 120px rgba(212,175,55,0.55)",
              }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: [0, 1, 1, 0], y: 0, scale: 1 }}
              transition={{ duration: 3, times: [0, 0.3, 0.8, 1] }}
              className="relative z-10 heading-display text-3xl font-bold text-gold-light sm:text-5xl"
              style={{ textShadow: "0 0 30px rgba(212,175,55,0.8)" }}
            >
              {g.welcome}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={`pointer-events-none absolute h-8 w-8 text-[#7c5a22]/60 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M4 36 V12 Q4 4 12 4 H36" />
      <path d="M10 32 Q10 22 22 22 M10 32 Q20 32 20 20" opacity="0.6" />
      <circle cx="9" cy="31" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

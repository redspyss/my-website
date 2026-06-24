"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, Eyebrow, Title, Reveal } from "@/components/ui/Section";
import ScrollCta from "@/components/ui/ScrollCta";
import SmartImage from "@/components/SmartImage";
import { config, MapStop } from "@/site.config";
import SceneBackdrop from "@/components/SceneBackdrop";
import { useAudio } from "@/lib/AudioProvider";
import StarField from "@/components/effects/StarField";
import Particles from "@/components/effects/Particles";

// Durakların rota üzerindeki konumları (sırayla, yumuşak bir patika)
const NODES = [
  { x: 14, y: 30 },
  { x: 30, y: 62 },
  { x: 46, y: 32 },
  { x: 60, y: 66 },
  { x: 76, y: 34 },
  { x: 88, y: 62 },
];

export default function SectionMap({ onComplete }: { onComplete?: () => void }) {
  const [active, setActive] = useState<MapStop | null>(null);
  const [routeReady, setRouteReady] = useState(false);
  const audio = useAudio();
  const c = config.map;
  const stops = c.stops.map((s, i) => ({ ...s, ...NODES[i % NODES.length] }));

  // Yumuşak (Catmull-Rom benzeri) eğri yolu
  const pathD = buildSmoothPath(stops.map((s) => [s.x, s.y]));

  // Rota çizilip duraklar belirene kadar "devam" düğmesi görünmez
  useEffect(() => {
    const t = window.setTimeout(() => setRouteReady(true), 3600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <Section id="map" className="flex min-h-[100dvh] flex-col items-center justify-center">
        <SceneBackdrop {...config.scenes.map} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#0e1430_0%,#070b1a_60%,#04060f_100%)]" />
      <StarField count={60} />
      <Particles count={15} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <Reveal>
          <Title>{c.title}</Title>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg text-parchment/70">
            {c.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <div className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-lg border-2 border-[#5a3a16]/60 bg-[#e3d2a6] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            {/* eski parşömen — leke ve ton geçişleri */}
            <div className="absolute inset-0 [background:radial-gradient(ellipse_at_25%_18%,#efe3c2,transparent_55%),radial-gradient(ellipse_at_80%_78%,#cdb582,transparent_55%),radial-gradient(ellipse_at_60%_40%,#e8d9b0,transparent_70%)]" />
            {/* kahverengi lekeler */}
            <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_15%_72%,rgba(110,75,30,0.18),transparent_12%),radial-gradient(circle_at_88%_25%,rgba(110,75,30,0.16),transparent_10%),radial-gradient(circle_at_45%_88%,rgba(90,60,20,0.14),transparent_9%)]" />
            {/* ince elyaf dokusu */}
            <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(46deg,transparent,transparent_18px,rgba(120,90,40,0.1)_19px),repeating-linear-gradient(-44deg,transparent,transparent_24px,rgba(120,90,40,0.07)_25px)]" />
            {/* katlama izleri */}
            <div className="absolute inset-y-0 left-1/3 w-px bg-[#5a3a16]/12" />
            <div className="absolute inset-y-0 left-2/3 w-px bg-[#5a3a16]/12" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#5a3a16]/12" />
            {/* yıpranmış koyu kenarlar */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(70,45,15,0.55)]" />
            {/* iç süslü çerçeve */}
            <div className="absolute inset-2 rounded-[4px] border border-[#5a3a16]/40" />
            <div className="absolute inset-[10px] rounded-[3px] border border-[#5a3a16]/20" />

            {/* çizili harita öğeleri (dağlar, ağaçlar, kale, nehir, pusula) */}
            <MapDecor />

            <svg
              viewBox="0 0 100 62.5"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              {/* mürekkep rota — yavaşça çizilir */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="#5a3a16"
                strokeOpacity="0.7"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeDasharray="0.1 1.6"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.path
                d={pathD}
                fill="none"
                stroke="#7c1f2e"
                strokeOpacity="0.45"
                strokeWidth="0.25"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3.2, ease: "easeInOut" }}
              />
            </svg>

            {/* yol boyunca yürüyen ayak izleri */}
            <Footsteps nodes={stops.map((s) => [s.x, s.y])} />

            {/* duraklar */}
            {stops.map((ev, i) => (
              <button
                key={ev.id}
                onClick={() => {
                  setActive(ev);
                  audio.play("map");
                }}
                style={{ left: `${ev.x}%`, top: `${ev.y}%`, zIndex: 6 }}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                aria-label={`${i + 1}. ${ev.title} – ${ev.date}`}
              >
                <motion.span
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-bordeaux bg-[#7c1f2e] font-display text-[11px] font-bold text-gold-light shadow-lg"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(124,31,46,0.5)",
                      "0 0 0 12px rgba(124,31,46,0)",
                    ],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
                >
                  {i + 1}
                </motion.span>
                <span className="absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap rounded bg-[#efe4c4] px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.12em] text-[#4a2c10] opacity-0 shadow transition group-hover:opacity-100">
                  {ev.title}
                </span>
              </button>
            ))}

            <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center font-display text-[10px] uppercase tracking-[0.35em] text-[#4a2c10]/70 sm:text-[11px]">
              Messrs Moony · Wormtail · Padfoot &amp; Prongs
            </div>
          </div>
        </Reveal>

        {routeReady && <ScrollCta onContinue={onComplete} />}
      </div>

      {/* detay modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className="glass-dark grid w-full max-w-3xl overflow-hidden rounded-2xl md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage
                src={active.photo}
                video={active.video}
                alt={active.title}
                icon={active.icon}
                fit="contain"
                className="max-h-[50vh] w-full self-center bg-black/30 md:max-h-[70vh]"
              />
              <div className="p-7 text-left">
                <div className="font-display text-xs uppercase tracking-[0.3em] text-gold/70">
                  {active.date} · {active.location}
                </div>
                <h3 className="heading-display mt-2 text-2xl text-gradient-gold">
                  {active.title}
                </h3>
                <p className="mt-4 font-serif text-lg leading-relaxed text-parchment/90">
                  {active.story}
                </p>
                <button
                  onClick={() => setActive(null)}
                  className="mt-6 rounded-full border border-gold/40 px-6 py-2 font-display text-xs uppercase tracking-[0.25em] text-gold transition hover:bg-gold/10"
                >
                  Kapat · Mischief Managed
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

// Eski haritaya çizilmiş öğeler — dağlar, ağaçlar, kale, nehir, pusula.
// Hepsi soluk kahverengi mürekkep; rota ve durakların önüne geçmez.
function MapDecor() {
  const ink = "#5a3a16";
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 62.5"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <g stroke={ink} strokeWidth="0.25" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* dağ sıraları */}
        <g opacity="0.4">
          <path d="M6 22 l3 -5 l3 5 M9 17 l1.5 2.5 M12 22 l3 -6 l3 6 M15 16 l1.5 3" />
          <path d="M82 14 l3 -5 l3 5 M88 14 l3 -6 l3 6 M91 8 l1.5 3" />
          <path d="M70 52 l2.5 -4 l2.5 4 M75 52 l2.5 -5 l2.5 5" />
        </g>
        {/* ağaç kümeleri (çam) */}
        <g opacity="0.38">
          {[
            [26, 14],
            [30, 16],
            [60, 12],
            [64, 14],
            [20, 48],
            [24, 50],
          ].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} l-1.4 3 h2.8 z M${x} ${y + 1.6} l-1.7 3.4 h3.4 z M${x} ${y + 4.6} v1.6`} />
          ))}
        </g>
        {/* nehir (dalgalı) */}
        <path d="M2 40 q8 -4 14 0 t14 2 t14 -3 t14 1" opacity="0.3" strokeWidth="0.3" />
        {/* deniz dalgaları (sağ alt) */}
        <g opacity="0.28" strokeWidth="0.2">
          <path d="M84 54 q1.5 -1.5 3 0 t3 0 t3 0" />
          <path d="M84 57 q1.5 -1.5 3 0 t3 0 t3 0" />
        </g>
        {/* kale ikonu (sol alt) */}
        <g opacity="0.4">
          <path d="M10 56 v-5 h1 v2 h1 v-2 h1 v2 h1 v-2 h1 v5 z" />
          <path d="M11.5 56 v-2.5 h2 v2.5" />
        </g>
        {/* pusula gülü (sağ üst) */}
        <g transform="translate(90,52)" opacity="0.5">
          <circle r="3.2" strokeWidth="0.25" />
          <circle r="1.4" strokeWidth="0.2" />
          <path d="M0 -4.4 L0.9 -0.6 L0 0 L-0.9 -0.6 Z" fill={ink} stroke="none" />
          <path d="M0 4.4 L0.9 0.6 L0 0 L-0.9 0.6 Z" />
          <path d="M-4.4 0 L-0.6 0.9 L0 0 L-0.6 -0.9 Z" />
          <path d="M4.4 0 L0.6 0.9 L0 0 L0.6 -0.9 Z" />
        </g>
      </g>
      {/* pusula N harfi */}
      <text x="90" y="46.6" fontSize="2.2" fill={ink} opacity="0.55" textAnchor="middle" fontFamily="serif">N</text>
    </svg>
  );
}

// Yumuşak eğri yol (basit Catmull-Rom → cubic bezier)
function buildSmoothPath(pts: number[][]) {
  if (pts.length < 2) return "";
  const p = pts.map(([x, y]) => [x, y * 0.625] as [number, number]); // viewBox 0-62.5
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

// Rota boyunca sırayla beliren ayak izleri
function Footsteps({ nodes }: { nodes: number[][] }) {
  const steps: { x: number; y: number; angle: number }[] = [];
  const perSeg = 5;
  for (let s = 0; s < nodes.length - 1; s++) {
    const a = nodes[s];
    const b = nodes[s + 1];
    const angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    for (let k = 0; k < perSeg; k++) {
      const t = (k + 0.5) / perSeg;
      steps.push({
        x: a[0] + (b[0] - a[0]) * t,
        y: a[1] + (b[1] - a[1]) * t,
        angle,
      });
    }
  }
  const total = steps.length;
  const cycle = total * 0.26 + 1.6;

  return (
    <div aria-hidden className="absolute inset-0">
      {steps.map((st, i) => (
        <motion.span
          key={i}
          className="absolute text-[12px] text-[#5a3a16]"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            transform: `translate(-50%,-50%) rotate(${st.angle + 90}deg)`,
          }}
          animate={{ opacity: [0, 0.85, 0.85, 0] }}
          transition={{
            duration: 1,
            times: [0, 0.2, 0.8, 1],
            repeat: Infinity,
            repeatDelay: cycle - 1,
            delay: (i / total) * cycle,
          }}
        >
          👣
        </motion.span>
      ))}
    </div>
  );
}

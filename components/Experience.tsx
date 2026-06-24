"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import HUD from "./HUD";
import LockedScene from "./LockedScene";
import { scrollToId } from "@/lib/scroll";
import SectionLetter from "./sections/SectionLetter";
import SectionSorting from "./sections/SectionSorting";
import SectionMap from "./sections/SectionMap";
import SectionPensieve from "./sections/SectionPensieve";
import SectionPatronus from "./sections/SectionPatronus";
import SectionProphecy from "./sections/SectionProphecy";
import SectionWishWell from "./sections/SectionWishWell";
import SectionCapsule from "./sections/SectionCapsule";
import SectionGreatHall from "./sections/SectionGreatHall";
import SectionPatronusLetter from "./sections/SectionPatronusLetter";
import SectionFinale from "./sections/SectionFinale";

const MagicBackground = dynamic(() => import("./three/MagicBackground"), {
  ssr: false,
});

type SceneProps = { onComplete?: () => void };

// Hikâye sırası — kullanıcı yalnızca tamamladıkça ilerleyebilir.
const SCENES: { id: string; title: string; Comp: React.ComponentType<SceneProps> }[] = [
  { id: "letter", title: "Hogwarts Mektubu", Comp: SectionLetter },
  { id: "sorting", title: "Büyük Salon · Seçim Töreni", Comp: SectionSorting },
  { id: "map", title: "Çapulcu Haritası", Comp: SectionMap },
  { id: "pensieve", title: "Düşünce Havuzu", Comp: SectionPensieve },
  { id: "patronus", title: "Patronus", Comp: SectionPatronus },
  { id: "prophecy", title: "Kehanet Salonu", Comp: SectionProphecy },
  { id: "wishwell", title: "Dilek Kuyusu", Comp: SectionWishWell },
  { id: "capsule", title: "Zaman Kapsülü", Comp: SectionCapsule },
  { id: "greathall", title: "Büyük Salon", Comp: SectionGreatHall },
  { id: "patronus-letter", title: "Patronus Mektubu", Comp: SectionPatronusLetter },
  { id: "finale", title: "Final", Comp: SectionFinale },
];

export default function Experience() {
  const [unlocked, setUnlocked] = useState(0);

  // Scroll kilidini uygula: tamamlanmamış bölümün başının ötesine geçilemesin
  useEffect(() => {
    const getScrollLimit = () => {
      // Bir sonraki kilitli bölümün üst sınırını bul
      const nextLockedId = SCENES[unlocked + 1]?.id;
      if (!nextLockedId) return Infinity; // hepsi açıksa sınır yok
      const el = document.getElementById(nextLockedId);
      if (!el) return Infinity;
      return el.getBoundingClientRect().top + window.scrollY - 1;
    };

    const enforceLimit = () => {
      const limit = getScrollLimit();
      if (window.scrollY > limit) {
        window.scrollTo({ top: limit, behavior: "instant" });
      }
    };

    window.addEventListener("scroll", enforceLimit, { passive: true });

    // Lenis varsa ona da yönlendirme ekle
    const lenis = (window as unknown as { __lenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void } }).__lenis;
    if (lenis) {
      lenis.on("scroll", enforceLimit);
    }

    return () => {
      window.removeEventListener("scroll", enforceLimit);
      if (lenis) lenis.off("scroll", enforceLimit);
    };
  }, [unlocked]);

  const complete = useCallback((i: number) => {
    setUnlocked((u) => Math.max(u, i + 1));
    const next = SCENES[i + 1];
    if (next) window.setTimeout(() => scrollToId(next.id), 300);
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4 }}
      className="relative"
    >
      <MagicBackground />
      <HUD />

      {/* küresel sis katmanı (sahneleri birbirine bağlar) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
        <div className="fog drift" />
        <div className="fog drift" style={{ animationDelay: "-18s" }} />
      </div>

      <div className="relative z-[2]">
        {SCENES.map((s, i) => {
          if (i <= unlocked) {
            const Comp = s.Comp;
            return <Comp key={s.id} onComplete={() => complete(i)} />;
          }
          if (i === unlocked + 1) {
            return <LockedScene key={s.id} id={s.id} title={s.title} />;
          }
          return null;
        })}
      </div>
    </motion.main>
  );
}

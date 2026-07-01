"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import Gate from "@/components/Gate";
import OwlDelivery from "@/components/OwlDelivery";
import Experience from "@/components/Experience";
import WandCursor from "@/components/effects/WandCursor";
import { useExperience } from "@/lib/ExperienceProvider";

type Phase = "loading" | "gate" | "owl" | "experience";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("loading");
  const { unlock } = useExperience();

  return (
    <>
      <WandCursor />

      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <Loader key="loader" onDone={() => setPhase("gate")} />
        )}
      </AnimatePresence>

      {phase === "gate" && <Gate onUnlock={() => setPhase("owl")} />}

      <AnimatePresence mode="wait">
        {phase === "owl" && (
          <OwlDelivery
            key="owl"
            onDone={() => {
              unlock();
              setPhase("experience");
            }}
          />
        )}
      </AnimatePresence>

      {phase === "experience" && <Experience />}
    </>
  );
}

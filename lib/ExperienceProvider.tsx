"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

interface ExperienceState {
  unlocked: boolean;
  unlock: () => void;
  lumos: boolean;
  toggleLumos: () => void;
}

const Ctx = createContext<ExperienceState | null>(null);

export function useExperience() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useExperience must be used within ExperienceProvider");
  return c;
}

export default function ExperienceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [lumos, setLumos] = useState(false);

  const unlock = useCallback(() => setUnlocked(true), []);
  const toggleLumos = useCallback(() => setLumos((l) => !l), []);

  useEffect(() => {
    const root = document.documentElement;
    if (lumos) {
      root.classList.add("lumos-mode");
      root.classList.remove("nox-mode");
    } else {
      root.classList.add("nox-mode");
      root.classList.remove("lumos-mode");
    }
  }, [lumos]);

  return (
    <Ctx.Provider value={{ unlocked, unlock, lumos, toggleLumos }}>
      {children}
    </Ctx.Provider>
  );
}

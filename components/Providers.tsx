"use client";

import { ReactNode } from "react";
import ExperienceProvider from "@/lib/ExperienceProvider";
import AudioProvider from "@/lib/AudioProvider";
import SmoothScroll from "@/lib/SmoothScroll";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ExperienceProvider>
      <AudioProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </AudioProvider>
    </ExperienceProvider>
  );
}

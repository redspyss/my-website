"use client";

import { useEffect, useMemo, useState } from "react";

// Parlayan yıldızlar — gece gökyüzü için.
export default function StarField({ count = 120 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 70,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
        dur: 2 + Math.random() * 4,
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
      <style jsx>{`
        .star {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
          animation: twinkle ease-in-out infinite;
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

// Altın büyü parçacıkları — hafif, performanslı, dekoratif.
export default function Particles({
  count = 40,
  color = "#d4af37",
  className = "",
}: {
  count?: number;
  color?: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 10,
        drift: (Math.random() - 0.5) * 40,
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {dots.map((d) => (
        <span
          key={d.id}
          className="particle"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: color,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            ["--drift" as string]: `${d.drift}px`,
          }}
        />
      ))}
      <style jsx>{`
        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          box-shadow: 0 0 6px currentColor;
          animation-name: rise;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        @keyframes rise {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6);
          }
          15% {
            opacity: 0.9;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: translate(var(--drift), -120px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

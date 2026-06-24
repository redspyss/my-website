"use client";

import { useEffect, useRef } from "react";

interface Trail {
  x: number;
  y: number;
  life: number;
  size: number;
  hue: number;
}

// Özel büyü değneği imleci + altın iz efekti (canvas tabanlı).
export default function WandCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.documentElement.classList.add("wand-cursor-active");

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const tip = tipRef.current!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const trails: Trail[] = [];
    const mouse = { x: w / 2, y: h / 2 };
    let raf = 0;

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      tip.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      for (let i = 0; i < 2; i++) {
        trails.push({
          x: e.clientX,
          y: e.clientY,
          life: 1,
          size: Math.random() * 3 + 1.5,
          hue: 45 + Math.random() * 15,
        });
      }
      if (trails.length > 220) trails.splice(0, trails.length - 220);
    };

    const onDown = () => {
      for (let i = 0; i < 24; i++) {
        const a = (Math.PI * 2 * i) / 24;
        trails.push({
          x: mouse.x,
          y: mouse.y,
          life: 1,
          size: Math.random() * 3 + 2,
          hue: 45 + Math.random() * 20,
        });
        void a;
      }
      tip.classList.add("wand-cast");
      window.setTimeout(() => tip.classList.remove("wand-cast"), 300);
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.life -= 0.025;
        if (t.life <= 0) {
          trails.splice(i, 1);
          continue;
        }
        const alpha = t.life;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(
          t.x,
          t.y,
          0,
          t.x,
          t.y,
          t.size * 4
        );
        grad.addColorStop(0, `hsla(${t.hue}, 90%, 70%, ${alpha})`);
        grad.addColorStop(1, `hsla(${t.hue}, 90%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(t.x, t.y, t.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.classList.remove("wand-cursor-active");
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9998]"
      />
      <div
        ref={tipRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[6px] -mt-[6px]"
      >
        <div className="wand-tip" />
      </div>
      <style jsx>{`
        .wand-tip {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #fff 0%,
            #f5e6a8 40%,
            rgba(212, 175, 55, 0.6) 70%,
            transparent 100%
          );
          box-shadow: 0 0 12px 4px rgba(212, 175, 55, 0.7),
            0 0 30px 8px rgba(212, 175, 55, 0.35);
          transition: transform 0.12s ease-out;
        }
        :global(.wand-cast) .wand-tip {
          transform: scale(2.2);
        }
      `}</style>
    </>
  );
}

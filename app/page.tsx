"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(true);

  // Sayfa açılır açılmaz videoyu (sessiz) oynatmayı garanti et.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  // Dokununca sesi aç ve giriş katmanını kaldır.
  const enableSound = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = false;
      v.volume = 1;
      v.currentTime = 0; // şarkıyı baştan başlat
      v.play().catch(() => {});
    }
    setNeedsTap(false);
  };

  return (
    <main
      onClick={needsTap ? enableSound : undefined}
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        cursor: needsTap ? "pointer" : "default",
      }}
    >
      <video
        ref={videoRef}
        src="/video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "#ffffff",
        }}
      />

      {needsTap && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.82)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
            color: "#fff",
            textAlign: "center",
            padding: 24,
            zIndex: 10000,
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 1.8s ease-in-out infinite",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 0.5 }}>
            Ses için dokun
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.12); opacity: 0.7; }
            }
          `}</style>
        </div>
      )}
    </main>
  );
}

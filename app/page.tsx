"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sayfa açılır açılmaz videoyu oynatmayı garanti et.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  // Tarayıcılar sesli otomatik oynatmayı engeller; ekrana dokununca sesi aç.
  const unmute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    v.play().catch(() => {});
  };

  return (
    <main
      onClick={unmute}
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <video
        ref={videoRef}
        src="/wegh-tuzak.mp4"
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
    </main>
  );
}

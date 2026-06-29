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
    <main onClick={needsTap ? enableSound : undefined} className="stage">
      <video
        ref={videoRef}
        className="bgvideo"
        src="/video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Dikey telefon ipucu (kısa süre görünür) */}
      <div className="rotateHint">↻ Daha büyük görüntü için telefonu yan çevir</div>

      {needsTap && (
        <div className="gate">
          <div className="gateIcon">
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
          <div className="gateTitle">Ses için dokun</div>
        </div>
      )}

      <style>{`
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          background: #ffffff;
          overflow: hidden;
        }
        .stage {
          position: fixed;
          inset: 0;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }
        .bgvideo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #ffffff;
        }
        .gate {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.82);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 22px;
          color: #fff;
          text-align: center;
          padding: 24px;
          z-index: 10000;
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }
        .gateIcon {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 1.8s ease-in-out infinite;
        }
        .gateTitle {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .rotateHint {
          display: none;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.7;
          }
        }

        /* Dikey telefon: videoyu 90° döndürüp ekranı doldur */
        @media (orientation: portrait) and (max-width: 900px) {
          .bgvideo {
            width: 100vh;
            height: 100vw;
            max-width: none;
            transform: rotate(90deg);
          }
          .rotateHint {
            display: block;
            position: fixed;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10001;
            background: rgba(0, 0, 0, 0.55);
            color: #fff;
            font-size: 12px;
            padding: 7px 14px;
            border-radius: 999px;
            white-space: nowrap;
            animation: hintfade 6s ease forwards;
          }
        }
        @keyframes hintfade {
          0%,
          65% {
            opacity: 0.85;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }
      `}</style>
    </main>
  );
}

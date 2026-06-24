"use client";

import { useState } from "react";

export type MediaType = "image" | "video";

export function detectMediaType(src?: string, override?: MediaType): MediaType {
  if (override) return override;
  if (!src) return "image";
  return /\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(src) ? "video" : "image";
}

// Fotoğraf VEYA video — aynı sistemle.
// Her alana hem `src` (fotoğraf) hem `video` verebilirsin; `video` doluysa video
// gösterilir, değilse fotoğraf. (Uzantısı video olan bir `src` de video sayılır.)
export default function SmartMedia({
  src,
  video,
  alt,
  icon = "✦",
  className = "",
  poster,
  fit = "cover",
}: {
  src?: string;
  video?: string;
  alt: string;
  icon?: string;
  className?: string;
  poster?: string;
  // "cover" = kabı doldurur (kırpabilir) · "contain" = tamamı sığar (kırpmaz)
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  // hangisi gösterilecek?
  const videoSrc =
    video || (detectMediaType(src) === "video" ? src : undefined);
  const imageSrc = detectMediaType(src) === "image" ? src : undefined;
  const hasMedia = !!(videoSrc || imageSrc);

  if (failed || !hasMedia) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex min-h-[200px] items-center justify-center overflow-hidden ${className}`}
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #1a2342 0%, #0a0f24 55%, #04060f 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(135deg,transparent,transparent_14px,rgba(212,175,55,0.12)_15px,transparent_16px)]" />
        <span className="text-4xl text-gold/70 drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">
          {icon}
        </span>
        <span className="absolute bottom-3 px-3 text-center font-serif text-xs uppercase tracking-[0.3em] text-parchment/50">
          {alt}
        </span>
      </div>
    );
  }

  if (videoSrc) {
    return (
      <video
        src={videoSrc}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        onError={() => setFailed(true)}
        aria-label={alt}
        className={`${fitClass} ${className}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${fitClass} ${className}`}
    />
  );
}

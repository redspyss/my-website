"use client";

import { detectMediaType } from "./SmartMedia";

// Sahne arka planı — düşük opaklık + bulanıklık + gradyan yumuşatma.
// Ana içeriğin önüne geçmez (pointer-events yok, z düşük). Hafif sinematik
// kayma ile yaşıyormuş hissi verir. Mobilde de hafiftir.
export default function SceneBackdrop({
  image,
  video,
  opacity = 0.14,
  blur = 3,
}: {
  image?: string;
  video?: string;
  opacity?: number;
  blur?: number;
}) {
  const src = video || image;
  if (!src) return null;
  const isVideo = !!video || detectMediaType(src) === "video";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {isVideo ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="drift absolute inset-[-6%] h-[112%] w-[112%] object-cover"
          style={{ opacity, filter: `blur(${blur}px) saturate(0.9)` }}
        />
      ) : (
        <div
          className="drift absolute inset-[-6%] bg-cover bg-center"
          style={{
            backgroundImage: `url('${src}')`,
            opacity,
            filter: `blur(${blur}px) saturate(0.9)`,
          }}
        />
      )}
      {/* gradyan yumuşatma — kenarlar koyuya akar, okunabilirlik korunur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(4,6,15,0.35)_0%,rgba(4,6,15,0.7)_70%,rgba(4,6,15,0.92)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-night-900/70 via-transparent to-night-900/80" />
    </div>
  );
}

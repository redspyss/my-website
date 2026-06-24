"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { config } from "@/site.config";

// Her bölümün kendi ses kimliği var. Aynı efekt üst üste çalmaz; her seferinde
// rastgele bir varyasyon seçilir. Tüm sesler Web Audio API ile sentezlenir.
export type Scene =
  | "gate"
  | "owl"
  | "letter"
  | "sorting"
  | "fireworks"
  | "map"
  | "pensieve"
  | "patronus"
  | "prophecy"
  | "capsule"
  | "final"
  | "ui";

interface AudioState {
  enabled: boolean;
  toggle: () => void;
  enable: () => void;
  play: (scene: Scene) => void;
  /** @deprecated geriye dönük uyum — play kullan */
  chime: (type?: "spark" | "soft" | "deep") => void;
}

const AudioCtx = createContext<AudioState | null>(null);

const MUSIC_SRC = config.audio.src;
const MUSIC_VOLUME = config.audio.volume;
const MIN_GAP = 0.22; // aynı sahnenin sesi için minimum aralık (sn)

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    return {
      enabled: false,
      toggle: () => {},
      enable: () => {},
      play: () => {},
      chime: () => {},
    } as AudioState;
  }
  return ctx;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export default function AudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  // throttle: her sahnenin son çalınma zamanı + son varyasyon
  const lastTime = useRef<Record<string, number>>({});
  const lastVar = useRef<Record<string, number>>({});

  const ensureContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.85;
      master.connect(ctx.destination);

      // basit reverb (sentetik impuls)
      const conv = ctx.createConvolver();
      const len = ctx.sampleRate * 1.6;
      const imp = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = imp.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
        }
      }
      conv.buffer = imp;
      const revGain = ctx.createGain();
      revGain.gain.value = 0.32;
      conv.connect(revGain);
      revGain.connect(master);

      // gürültü tamponu (rüzgar, fısıltı, kanat dokusu)
      const nlen = ctx.sampleRate * 2;
      const nbuf = ctx.createBuffer(1, nlen, ctx.sampleRate);
      const nd = nbuf.getChannelData(0);
      for (let i = 0; i < nlen; i++) nd[i] = Math.random() * 2 - 1;

      ctxRef.current = ctx;
      masterRef.current = master;
      reverbRef.current = conv;
      noiseRef.current = nbuf;
    }
    return ctxRef.current;
  }, []);

  // ---- düşük seviye yapı taşları --------------------------------------------
  const out = useCallback((node: AudioNode, reverbSend = 0.6) => {
    const ctx = ctxRef.current!;
    node.connect(masterRef.current!);
    if (reverbRef.current && reverbSend > 0) {
      const send = ctx.createGain();
      send.gain.value = reverbSend;
      node.connect(send);
      send.connect(reverbRef.current);
    }
  }, []);

  const tone = useCallback(
    (
      freq: number,
      dur: number,
      opts: {
        type?: OscillatorType;
        gain?: number;
        attack?: number;
        glideTo?: number;
        reverb?: number;
        delay?: number;
      } = {}
    ) => {
      const ctx = ctxRef.current!;
      const t0 = ctx.currentTime + (opts.delay ?? 0);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = opts.type ?? "sine";
      osc.frequency.setValueAtTime(freq, t0);
      if (opts.glideTo) osc.frequency.exponentialRampToValueAtTime(opts.glideTo, t0 + dur);
      const peak = opts.gain ?? 0.1;
      const atk = opts.attack ?? 0.012;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      out(g, opts.reverb ?? 0.6);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    },
    [out]
  );

  const noise = useCallback(
    (
      dur: number,
      opts: {
        filter?: number;
        q?: number;
        gain?: number;
        type?: BiquadFilterType;
        sweepTo?: number;
        reverb?: number;
        delay?: number;
      } = {}
    ) => {
      const ctx = ctxRef.current!;
      if (!noiseRef.current) return;
      const t0 = ctx.currentTime + (opts.delay ?? 0);
      const src = ctx.createBufferSource();
      src.buffer = noiseRef.current;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = opts.type ?? "bandpass";
      f.frequency.setValueAtTime(opts.filter ?? 800, t0);
      if (opts.sweepTo) f.frequency.exponentialRampToValueAtTime(opts.sweepTo, t0 + dur);
      f.Q.value = opts.q ?? 1;
      const g = ctx.createGain();
      const peak = opts.gain ?? 0.06;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + dur * 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(f);
      f.connect(g);
      out(g, opts.reverb ?? 0.5);
      src.start(t0);
      src.stop(t0 + dur + 0.05);
    },
    [out]
  );

  const chord = useCallback(
    (freqs: number[], dur: number, type: OscillatorType = "sine", gain = 0.05) => {
      freqs.forEach((f, i) =>
        tone(f, dur, { type, gain, attack: 0.02, delay: i * 0.04, reverb: 0.7 })
      );
    },
    [tone]
  );

  // ---- sahne sesleri (her biri varyasyonlu) ---------------------------------
  const voices: Record<Scene, (() => void)[]> = {
    gate: [
      () => {
        noise(1.6, { filter: 300, q: 0.7, gain: 0.05, sweepTo: 140, reverb: 0.8 });
        tone(rnd(70, 90), 1.8, { type: "sine", gain: 0.08, reverb: 0.9 });
        tone(rnd(300, 360), 1.4, { type: "triangle", gain: 0.04, glideTo: 520, delay: 0.2 });
      },
      () => {
        tone(rnd(90, 110), 1.6, { type: "sine", gain: 0.09, reverb: 0.9 });
        noise(1.2, { filter: 220, q: 0.6, gain: 0.045, reverb: 0.8 });
      },
    ],
    owl: [
      () => {
        for (let i = 0; i < 3; i++)
          noise(0.18, { filter: rnd(500, 900), q: 1.2, gain: 0.05, delay: i * 0.16, reverb: 0.3 });
        noise(0.9, { filter: 320, q: 0.6, gain: 0.03, reverb: 0.5 });
      },
      () => {
        for (let i = 0; i < 2; i++)
          noise(0.2, { filter: rnd(600, 1000), q: 1, gain: 0.05, delay: i * 0.2 });
      },
    ],
    letter: [
      () => {
        noise(0.22, { filter: 2600, q: 0.8, gain: 0.05, type: "highpass" });
        tone(rnd(1180, 1320), 0.7, { type: "sine", gain: 0.07, delay: 0.12, reverb: 0.7 });
        tone(rnd(1760, 1980), 0.5, { type: "sine", gain: 0.04, delay: 0.16 });
      },
      () => {
        noise(0.18, { filter: 3000, q: 0.7, gain: 0.045, type: "highpass" });
        chord([880, 1320, 1760], 0.6, "sine", 0.04);
      },
    ],
    sorting: [
      () => chord([pick([220, 247, 262]), 330, 415], 0.9, "triangle", 0.045),
      () => {
        tone(rnd(180, 240), 1, { type: "sine", gain: 0.06, reverb: 0.8 });
        tone(rnd(330, 392), 0.8, { type: "triangle", gain: 0.035, delay: 0.1 });
      },
    ],
    fireworks: [
      () => {
        // büyük patlama + çıtırtılar + ışıltı çanları
        tone(rnd(50, 70), 0.5, { type: "sine", gain: 0.13, reverb: 0.7 });
        noise(0.3, { filter: 200, q: 0.7, gain: 0.08, type: "lowpass", reverb: 0.6 });
        for (let i = 0; i < 14; i++)
          noise(0.05, { filter: rnd(2200, 6500), q: 2.4, gain: 0.045, delay: 0.1 + Math.random() * 0.9, reverb: 0.4 });
        for (let i = 0; i < 6; i++)
          tone(pick([1568, 1760, 2093, 2349, 2637]), 0.45, { type: "sine", gain: 0.03, delay: 0.2 + i * 0.13, reverb: 0.9 });
      },
      () => {
        for (let b = 0; b < 2; b++) {
          tone(rnd(55, 78), 0.5, { type: "sine", gain: 0.11, delay: b * 0.45, reverb: 0.7 });
          for (let i = 0; i < 11; i++)
            noise(0.05, { filter: rnd(2600, 6800), q: 2.6, gain: 0.04, delay: b * 0.45 + 0.08 + Math.random() * 0.55, reverb: 0.4 });
          for (let i = 0; i < 4; i++)
            tone(pick([1760, 2093, 2349, 2637]), 0.4, { type: "sine", gain: 0.025, delay: b * 0.45 + 0.25 + i * 0.1, reverb: 0.9 });
        }
      },
    ],
    map: [
      () => {
        noise(0.5, { filter: rnd(700, 1100), q: 0.8, gain: 0.04, sweepTo: 300, reverb: 0.4 });
        tone(rnd(520, 660), 0.3, { type: "triangle", gain: 0.03, delay: 0.05 });
      },
      () => noise(0.4, { filter: 900, q: 1, gain: 0.035, sweepTo: 400 }),
    ],
    pensieve: [
      () => {
        const base = pick([523, 587, 659]);
        tone(base, 0.8, { type: "sine", gain: 0.06, glideTo: base * 1.04, reverb: 0.9 });
        tone(base * 1.5, 0.7, { type: "sine", gain: 0.03, delay: 0.08, reverb: 0.9 });
      },
      () => {
        for (let i = 0; i < 3; i++)
          tone(pick([659, 784, 880, 988]), 0.5, { type: "sine", gain: 0.035, delay: i * 0.09, reverb: 0.9 });
      },
    ],
    patronus: [
      () => {
        tone(rnd(110, 140), 2, { type: "sawtooth", gain: 0.05, glideTo: rnd(330, 420), reverb: 0.9 });
        tone(rnd(880, 1100), 1.6, { type: "sine", gain: 0.03, glideTo: 1760, delay: 0.3, reverb: 1 });
      },
      () => {
        tone(rnd(140, 170), 1.8, { type: "triangle", gain: 0.05, glideTo: 520, reverb: 0.9 });
        chord([784, 1175, 1568], 1.4, "sine", 0.025);
      },
    ],
    prophecy: [
      () => {
        const f = pick([1320, 1480, 1660]);
        tone(f, 1.4, { type: "sine", gain: 0.045, reverb: 1 });
        tone(f * 1.005, 1.4, { type: "sine", gain: 0.03, reverb: 1 }); // hafif beating
        noise(1.2, { filter: 4200, q: 6, gain: 0.015, type: "bandpass", reverb: 0.8 });
      },
      () => {
        noise(1.4, { filter: rnd(3000, 5000), q: 8, gain: 0.018, reverb: 0.9 });
        tone(pick([988, 1175, 1318]), 1.2, { type: "sine", gain: 0.035, reverb: 1 });
      },
    ],
    capsule: [
      () => {
        tone(rnd(60, 80), 0.5, { type: "sine", gain: 0.09 });
        noise(0.3, { filter: 500, q: 0.8, gain: 0.05, type: "lowpass" });
        chord([523, 659, 784, 1047], 1, "triangle", 0.03);
      },
      () => {
        tone(rnd(70, 90), 0.4, { type: "sine", gain: 0.08 });
        for (let i = 0; i < 4; i++)
          tone(pick([659, 784, 880, 1047, 1319]), 0.6, { type: "sine", gain: 0.03, delay: i * 0.1, reverb: 0.9 });
      },
    ],
    final: [
      () => {
        for (let i = 0; i < 4; i++)
          tone(pick([1047, 1319, 1568, 1760, 2093]), 0.9, { type: "sine", gain: 0.03, delay: i * 0.12, reverb: 1 });
        tone(rnd(196, 262), 2.2, { type: "sine", gain: 0.04, reverb: 1 });
      },
      () => {
        chord([262, 392, 523, 659], 2, "sine", 0.03);
        tone(pick([1568, 1760, 2093]), 1, { type: "sine", gain: 0.025, delay: 0.3, reverb: 1 });
      },
    ],
    ui: [
      () => tone(pick([660, 740, 820]), 0.4, { type: "triangle", gain: 0.05, reverb: 0.5 }),
      () => tone(pick([560, 620, 700]), 0.5, { type: "sine", gain: 0.045, reverb: 0.6 }),
    ],
  };

  const play = useCallback(
    (scene: Scene) => {
      const ctx = ctxRef.current;
      if (!ctx || !enabled) return;
      const now = ctx.currentTime;
      // throttle: aynı sahne çok yakın aralıkla çalmasın
      if (lastTime.current[scene] && now - lastTime.current[scene] < MIN_GAP) return;
      lastTime.current[scene] = now;

      const variations = voices[scene];
      let idx = Math.floor(Math.random() * variations.length);
      if (variations.length > 1 && idx === lastVar.current[scene]) {
        idx = (idx + 1) % variations.length; // arka arkaya aynı varyasyon olmasın
      }
      lastVar.current[scene] = idx;
      variations[idx]();
    },
    // voices her render'da yeniden kurulur ama saf fonksiyonlardır
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled]
  );

  const chime = useCallback(
    (type: "spark" | "soft" | "deep" = "spark") => {
      play(type === "deep" ? "patronus" : type === "soft" ? "pensieve" : "letter");
    },
    [play]
  );

  // ---- arka plan müziği ------------------------------------------------------
  const ensureMusic = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!musicRef.current) {
      const audio = new Audio(MUSIC_SRC);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;
      musicRef.current = audio;
    }
    return musicRef.current;
  }, []);

  const fadeTo = useCallback((target: number, ms = 900) => {
    const audio = musicRef.current;
    if (!audio) return;
    const start = audio.volume;
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / ms);
      audio.volume = start + (target - start) * t;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const enable = useCallback(() => {
    ensureContext();
    const ctx = ctxRef.current;
    if (ctx && ctx.state === "suspended") void ctx.resume();
    const audio = ensureMusic();
    if (audio) {
      const pr = audio.play();
      if (pr && typeof pr.then === "function") pr.then(() => fadeTo(MUSIC_VOLUME)).catch(() => {});
      else fadeTo(MUSIC_VOLUME);
    }
    setEnabled(true);
  }, [ensureContext, ensureMusic, fadeTo]);

  const toggle = useCallback(() => {
    if (enabled) {
      fadeTo(0, 600);
      window.setTimeout(() => musicRef.current?.pause(), 620);
      setEnabled(false);
    } else {
      enable();
    }
  }, [enabled, enable, fadeTo]);

  // 📱 Mobil güvence: bazı tarayıcılar ilk play() çağrısını engelleyebilir.
  // Ses açıkken müzik durmuşsa, herhangi bir dokunuş/tıklamada tekrar başlatılır.
  useEffect(() => {
    if (!enabled) return;
    const kick = () => {
      const ctx = ctxRef.current;
      if (ctx && ctx.state === "suspended") void ctx.resume();
      const a = musicRef.current;
      if (a && a.paused) {
        const pr = a.play();
        if (pr && typeof pr.then === "function")
          pr.then(() => fadeTo(MUSIC_VOLUME)).catch(() => {});
      }
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("touchstart", kick, { passive: true });
    window.addEventListener("keydown", kick);
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("touchstart", kick);
      window.removeEventListener("keydown", kick);
    };
  }, [enabled, fadeTo]);

  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.src = "";
        musicRef.current = null;
      }
      if (ctxRef.current) void ctxRef.current.close();
    };
  }, []);

  return (
    <AudioCtx.Provider value={{ enabled, toggle, enable, play, chime }}>
      {children}
    </AudioCtx.Provider>
  );
}

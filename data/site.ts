// Tüm içerik artık /site.config.ts içinden yönetilir.
// Bu dosya geriye dönük uyumluluk için config'i yeniden dışa aktarır
// ve ev (house) renk/stil tanımlarını içerir.
import { config, type HouseKey } from "@/site.config";

export { config };
export type { HouseKey };

// Bileşenlerin kullandığı kısayol
export const site = config;

export interface House {
  key: HouseKey;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  motto: string;
  trait: string;
}

// Ev renk paletleri ve karakter metinleri
export const houses: Record<HouseKey, House> = {
  gryffindor: {
    key: "gryffindor",
    name: "Gryffindor",
    primary: "#7f0909",
    secondary: "#d4af37",
    accent: "#ffd700",
    glow: "rgba(212,175,55,0.55)",
    motto: "Cesaret, yüreklilik ve şövalye ruhu",
    trait: "Cesur kalbinle her zorluğun üstesinden gelirsin.",
  },
  slytherin: {
    key: "slytherin",
    name: "Slytherin",
    primary: "#0d3b2e",
    secondary: "#c0c0c0",
    accent: "#2a9d6e",
    glow: "rgba(42,157,110,0.55)",
    motto: "Hırs, kurnazlık ve kararlılık",
    trait: "Zekan ve kararlılığınla hedefine ulaşırsın.",
  },
  ravenclaw: {
    key: "ravenclaw",
    name: "Ravenclaw",
    primary: "#0e2a5e",
    secondary: "#946b2d",
    accent: "#5b8cff",
    glow: "rgba(91,140,255,0.5)",
    motto: "Bilgelik, zekâ ve yaratıcılık",
    trait: "Merakın ve bilgeliğinle dünyayı aydınlatırsın.",
  },
  hufflepuff: {
    key: "hufflepuff",
    name: "Hufflepuff",
    primary: "#5d4a1a",
    secondary: "#f0c75e",
    accent: "#ffd966",
    glow: "rgba(240,199,94,0.55)",
    motto: "Sadakat, sabır ve dürüstlük",
    trait: "Sadık ve sıcak kalbinle herkesi kendine bağlarsın.",
  },
};

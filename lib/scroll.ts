// Lenis varsa onunla, yoksa native ile yumuşak kaydırma yardımcıları.

type LenisLike = {
  scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void;
};

function getLenis(): LenisLike | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

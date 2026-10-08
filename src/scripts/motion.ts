import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: "expo.out", duration: 1.2 });

export { gsap, ScrollTrigger, SplitText };

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
/** Breakpoint for pinned/horizontal scroll choreography. */
export const DESKTOP = "(min-width: 900px)";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export function initSmoothScroll() {
  if (lenis || reducedMotion) return lenis;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView();
  }
}

/** Current scroll velocity in px/frame, 0 when smooth scroll is off. */
export function scrollVelocity() {
  return lenis?.velocity ?? 0;
}

/* --------------------------------------------------------------------------
   Ready gate — resolved by the preloader once fonts + WebGL are up, so every
   section can queue its intro animation without racing the loader.
   -------------------------------------------------------------------------- */
let resolveReady!: () => void;
const ready = new Promise<void>((resolve) => (resolveReady = resolve));

export function markReady() {
  document.documentElement.classList.add("is-ready");
  resolveReady();
}

export function onReady(cb: () => void) {
  ready.then(cb);
}

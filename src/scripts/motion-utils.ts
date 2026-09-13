import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const EASE = "power3.out";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Executes a callback reliably across Astro module scripts regardless of
 * whether DOMContentLoaded has already fired or is yet to fire.
 */
export function onReady(fn: () => void): void {
  if (typeof document === "undefined") return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    // If the DOM is already parsed/interactive, run immediately on the next animation frame
    requestAnimationFrame(fn);
  }
}

function formatCount(value: number, decimals: number): string {
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
}

/**
 * Wires up scroll-triggered reveal animations for [data-reveal] (single
 * elements) and [data-reveal-group] (staggers direct children), plus
 * count-up animation for [data-count] number elements.
 */
export function initScrollReveal(root: ParentNode = document): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (prefersReducedMotion()) return;

  const start = "top 90%";

  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    if (el.closest("[data-reveal-group]")) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: EASE,
        scrollTrigger: { trigger: el, start, once: true },
      }
    );
  });

  root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    if (children.length === 0) return;

    gsap.fromTo(
      children,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.09,
        ease: EASE,
        scrollTrigger: { trigger: group, start, once: true },
      }
    );
  });

  root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const raw = el.textContent?.trim() ?? "";
    const match = raw.match(/^-?[\d.]+/);
    if (!match) return;

    const numeric = parseFloat(match[0]);
    if (Number.isNaN(numeric)) return;

    const suffix = raw.slice(match[0].length);
    const decimals = match[0].includes(".") ? match[0].split(".")[1].length : 0;

    el.textContent = `${formatCount(0, decimals)}${suffix}`;

    const counter = { value: 0 };
    gsap.to(counter, {
      value: numeric,
      duration: 1.4,
      ease: EASE,
      scrollTrigger: { trigger: el, start, once: true },
      onUpdate: () => {
        el.textContent = `${formatCount(counter.value, decimals)}${suffix}`;
      },
    });
  });

  // Recalculate ScrollTrigger positions once fonts and images load to prevent offset mismatch
  if (document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

/**
 * A soft "glide" highlight that slides behind whichever tab/link the
 * pointer is over, then fades out when the pointer leaves the group.
 * Purely a hover affordance — it never claims to represent "active" state,
 * so it layers safely on top of each component's existing active styling.
 */
export function initHoverGlide(
  container: HTMLElement | null,
  indicator: HTMLElement | null,
  buttons: HTMLElement[]
): void {
  if (!container || !indicator || buttons.length === 0) return;
  if (prefersReducedMotion()) return;

  function place(el: HTMLElement) {
    const containerRect = container!.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    gsap.to(indicator, {
      x: rect.left - containerRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.3,
      ease: EASE,
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => place(btn));
    btn.addEventListener("focus", () => place(btn));
  });

  container.addEventListener("mouseleave", () => {
    gsap.to(indicator, { opacity: 0, duration: 0.2, ease: EASE });
  });
}


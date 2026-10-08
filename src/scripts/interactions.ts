import { gsap, ScrollTrigger, SplitText, finePointer, reducedMotion, scrollToTarget } from "./motion";
import { defaultScene, intro, sceneState, type SceneState } from "./webgl/state";

/* --------------------------------------------------------------------------
   Custom cursor — a dot that sticks to the pointer and a trailing ring that
   swells over interactive elements and can carry a label (data-cursor).
   -------------------------------------------------------------------------- */
export function initCursor() {
  if (!finePointer || reducedMotion) return;
  const root = document.querySelector<HTMLElement>("[data-cursor-root]");
  if (!root) return;
  const dot = root.querySelector<HTMLElement>(".cursor-dot")!;
  const ring = root.querySelector<HTMLElement>(".cursor-ring")!;
  const label = root.querySelector<HTMLElement>(".cursor-label")!;

  document.documentElement.classList.add("has-cursor");
  const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

  let shown = false;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (!shown) {
        shown = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        gsap.to(root, { autoAlpha: 1, duration: 0.4 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => {
    shown = false;
    gsap.to(root, { autoAlpha: 0, duration: 0.3 });
  });
  window.addEventListener("pointerdown", () => root.classList.add("is-down"));
  window.addEventListener("pointerup", () => root.classList.remove("is-down"));

  const interactive = "a, button, [data-cursor], input, select, textarea, label";
  document.addEventListener("pointerover", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>(interactive);
    if (!target) return;
    const text = target.dataset.cursor;
    root.classList.toggle("is-text", target.matches("input[type=text], input[type=email], textarea"));
    root.classList.add("is-hover");
    if (text) {
      label.textContent = text;
      root.classList.add("has-label");
    }
  });
  document.addEventListener("pointerout", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>(interactive);
    if (!target || target.contains(e.relatedTarget as Node)) return;
    root.classList.remove("is-hover", "has-label", "is-text");
  });
}

/* --------------------------------------------------------------------------
   Magnetic elements — [data-magnetic] pulls toward the cursor; an optional
   [data-magnetic-inner] child travels further for a parallax feel.
   -------------------------------------------------------------------------- */
export function initMagnetic(scope: ParentNode = document) {
  if (!finePointer || reducedMotion) return;
  scope.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || "0.35");
    const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3" });
    const ixTo = inner && gsap.quickTo(inner, "x", { duration: 0.8, ease: "power3" });
    const iyTo = inner && gsap.quickTo(inner, "y", { duration: 0.8, ease: "power3" });

    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      ixTo?.(dx * strength * 0.5);
      iyTo?.(dy * strength * 0.5);
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.4)" });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll reveals
   [data-split]          masked line reveal (SplitText)
   [data-split="chars"]  per-character rise
   [data-split="words"]  words light up as they scrub through the viewport
   [data-reveal]         fade + rise (children stagger with [data-reveal="stagger"])
   [data-count]          number counts up from 0
   [data-parallax]       y drift relative to scroll, value = strength
   -------------------------------------------------------------------------- */
export function initReveals(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>("[data-split]:not([data-split-manual])").forEach((el) => {
    const mode = el.dataset.split || "lines";
    if (reducedMotion) return;

    if (mode === "words") {
      SplitText.create(el, {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.12 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
            },
          );
        },
      });
      return;
    }

    SplitText.create(el, {
      type: mode === "chars" ? "lines,chars" : "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit(self) {
        const targets = mode === "chars" ? self.chars : self.lines;
        return gsap.from(targets, {
          yPercent: 115,
          rotate: mode === "chars" ? 6 : 0,
          duration: mode === "chars" ? 1.1 : 1.3,
          stagger: mode === "chars" ? 0.025 : 0.09,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      },
    });
  });

  scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const stagger = el.dataset.reveal === "stagger";
    const targets = stagger ? Array.from(el.children) : el;
    gsap.set(el, { opacity: 1 });
    if (reducedMotion) return;
    gsap.from(targets, {
      opacity: 0,
      y: 48,
      duration: 1.2,
      stagger: stagger ? 0.08 : 0,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  scope.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count || "0");
    const decimals = (el.dataset.count || "").split(".")[1]?.length ?? 0;
    if (reducedMotion) return;
    const obj = { v: 0 };
    el.textContent = (0).toFixed(decimals);
    gsap.to(obj, {
      v: end,
      duration: 2.2,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = obj.v.toFixed(decimals)),
    });
  });

  if (!reducedMotion) {
    scope.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
      const strength = parseFloat(el.dataset.parallax || "0.2");
      gsap.fromTo(
        el,
        { yPercent: -strength * 50 },
        {
          yPercent: strength * 50,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  }
}

/* --------------------------------------------------------------------------
   Background scene choreography — each [data-scene='{...}'] section morphs
   the orb from the previous section's state into its own while it enters.
   -------------------------------------------------------------------------- */
export function initSceneStates() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
  let previous: SceneState = { ...defaultScene };
  sections.forEach((section, index) => {
    const next: SceneState = { ...previous, ...JSON.parse(section.dataset.scene || "{}") };
    if (index === 0) {
      previous = next;
      Object.assign(sceneState, next);
      return;
    }
    gsap.fromTo(sceneState, { ...previous }, {
      ...next,
      ease: "none",
      immediateRender: false,
      scrollTrigger: { trigger: section, start: "top 75%", end: "top 15%", scrub: true },
    });
    previous = next;
  });
}

/** Brings the orb to life: it swells out of nothing with an exaggerated wobble. */
export function introScene() {
  if (reducedMotion) {
    Object.assign(intro, { reveal: 1, wobble: 0 });
    return;
  }
  gsap.to(intro, { reveal: 1, wobble: 0, duration: 2.6, ease: "expo.out" });
}

/* --------------------------------------------------------------------------
   Navigation — smooth anchor scrolling plus a curtain wipe between pages.
   -------------------------------------------------------------------------- */
export function initNavigation() {
  const curtain = document.querySelector<HTMLElement>("[data-curtain]");

  document.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;

    const samePage = url.pathname === location.pathname;
    if (samePage && url.hash) {
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;
      e.preventDefault();
      document.dispatchEvent(new CustomEvent("nav:close"));
      scrollToTarget(target);
      history.pushState(null, "", url.hash);
      return;
    }
    if (samePage || !curtain || reducedMotion) return;

    e.preventDefault();
    document.dispatchEvent(new CustomEvent("nav:close"));
    gsap.timeline({ onComplete: () => (location.href = url.href) })
      .set(curtain, { display: "block", clipPath: "inset(100% 0 0 0)" })
      .to(curtain, { clipPath: "inset(0% 0 0 0)", duration: 0.75, ease: "expo.inOut" });
  });

  // Restore from bfcache with the curtain lifted.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted && curtain) gsap.set(curtain, { display: "none" });
  });
}

export function refreshOnLoad() {
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

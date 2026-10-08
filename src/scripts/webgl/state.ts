/**
 * Shared, renderer-agnostic state for the background scene. Sections tween
 * these numbers with ScrollTrigger; the WebGL loop reads them every frame.
 * Keeping it free of three.js lets sections animate before the scene loads.
 */
export interface SceneState {
  /** Horizontal offset as a fraction of the viewport half-width (-1..1). */
  x: number;
  /** Vertical offset as a fraction of the viewport half-height (-1..1). */
  y: number;
  scale: number;
  /** Noise displacement amplitude. */
  distort: number;
  /** Shifts the iridescent palette around the colour wheel (0..1). */
  hue: number;
  /** Overall brightness, 0 hides the orb. */
  intensity: number;
}

export const defaultScene: SceneState = {
  x: 0.42,
  y: 0,
  scale: 1,
  distort: 0.24,
  hue: 0,
  intensity: 1,
};

export const sceneState: SceneState = { ...defaultScene };

/**
 * Page-load intro, kept separate from the scroll-driven state so the two never
 * fight: `reveal` multiplies scale + intensity, `wobble` adds to distortion.
 */
export const intro = { reveal: 0, wobble: 1.1 };

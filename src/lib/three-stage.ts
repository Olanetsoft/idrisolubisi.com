/**
 * What every three.js piece shares, so they read as one site: a renderer that
 * draws only while something moves, the brand's tokens as colours for the
 * current theme, one lighting rig, the site's type for textures, and a dispose
 * that hands back the GL context and frees what a scene holds (three.js itself
 * keeps a little of each renderer for the life of the page). Reached only through a piece's dynamic import in
 * src/lib/three-shell.ts. A piece imports from "three" by name too, never the
 * namespace, so the chunk carries only what it uses.
 */

import {
  CanvasTexture,
  Color,
  DirectionalLight,
  HemisphereLight,
  SRGBColorSpace,
  Texture,
  WebGLRenderer,
  setConsoleFunction,
  type Material,
  type Mesh,
  type Object3D,
  type ShaderMaterial,
  type Scene,
  type WebGLRendererParameters,
} from "three";
import type { Stage } from "@/lib/three-shell";
import type { Theme } from "@/lib/theme";

const MAX_DPR = 2;
const MAX_STEP = 1 / 20; // s, so a stall does not throw the scene forward
// Brass from the accent, same hue: shaded down on black, and lifted on paper,
// where the light theme's darker accent shaded down would read as brown wood.
const BRASS = { dark: 0.62, light: 1.8 };

// The site writes nothing to the console. Errors still show while developing.
if (process.env.NODE_ENV === "production") setConsoleFunction(() => {});

type RendererOptions = WebGLRendererParameters & {
  /** Draws one frame with renderer.render. Return true to be called again next frame. */
  draw: (dt: number, now: number) => boolean | void;
  /** The canvas size in CSS pixels: called straight away and on every change. */
  resize?: (width: number, height: number) => void;
};

export type StageRenderer = {
  renderer: WebGLRenderer;
  /** Something changed: draw again. Reduced-motion visitors get the one frame. */
  wake: () => void;
  /** Stops drawing and hands the GL context back. */
  dispose: () => void;
};

/**
 * A renderer on the stage's canvas, transparent so the stage's own background
 * and grid show through and a theme change needs no redraw of the backdrop. It
 * draws only while `draw` asks for another frame, and is otherwise idle until
 * wake(): on any input, say, or once a texture has arrived.
 */
export function createRenderer(
  { canvas, reduced }: Stage,
  { draw, resize, ...parameters }: RendererOptions,
): StageRenderer {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, ...parameters });
  let frame = 0;
  let last = 0;
  let size = "";

  const tick = (now: number) => {
    const dt = Math.min(Math.max(now - last, 0) / 1000, MAX_STEP);
    last = now;
    frame = 0;
    if (draw(dt, now) && !reduced) frame = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const measure = () => {
    const { clientWidth: width, clientHeight: height } = canvas;
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const next = `${width} ${height} ${ratio}`;
    if (!width || !height || next === size) return;
    size = next;
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    resize?.(width, height);
    wake();
  };
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(canvas);

  return {
    renderer,
    wake,
    dispose: () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      const lost = renderer.getContext().isContextLost();
      renderer.dispose();
      if (!lost) renderer.forceContextLoss();
    },
  };
}

/** Frees every geometry, material and texture under `root`, and a scene's own textures. */
export function disposeObject(root: Object3D) {
  const free = (value: unknown) => {
    if (value instanceof Texture) value.dispose();
  };
  const { background, environment } = root as Scene;
  free(background);
  free(environment);
  root.traverse((node) => {
    const { geometry, material } = node as Mesh;
    geometry?.dispose();
    for (const each of [material].flat() as (Material | undefined)[]) {
      if (!each) continue;
      Object.values(each).forEach(free);
      Object.values((each as ShaderMaterial).uniforms ?? {}).forEach((u) => free(u.value));
      each.dispose();
    }
  });
}

/** The site's colours, as the current theme has them. These are the only colours a piece uses. */
export type Brand = {
  theme: Theme;
  /** --bg: the black stage or the paper stage. */
  bg: Color;
  /** --surface and --raised, solid. */
  surface: Color;
  raised: Color;
  /** --text, --text-2 and --text-3: warm ink. */
  ink: Color;
  ink2: Color;
  ink3: Color;
  /** --line and --line-strong: hairlines. */
  line: Color;
  lineStrong: Color;
  /** --accent, and the brass drawn from it. There is no environment map, so keep metalness low. */
  amber: Color;
  brass: Color;
  /** A sheet of warm paper: pale on the black stage, a shade down from the paper stage. */
  paper: Color;
  /** Ink for anything drawn on that sheet, which is dark in both themes. */
  paperInk: Color;
};

/** Reads the tokens as the stage sees them, so forced colours and both themes come through. */
export function readBrand({ dialog }: Stage): Brand {
  const probe = document.createElement("i");
  probe.style.forcedColorAdjust = "none";
  dialog.append(probe);
  const style = getComputedStyle(probe);
  const read = (token: string) => {
    probe.style.color = `var(${token})`;
    const [r = 0, g = 0, b = 0, a = 1] = style.color.match(/[\d.]+/g)?.map(Number) ?? [];
    return { color: new Color().setRGB(r / 255, g / 255, b / 255, SRGBColorSpace), a };
  };
  const solid = (token: string) => read(token).color;

  const theme: Theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  const bg = solid("--bg");
  const raised = solid("--raised");
  const ink = solid("--text");
  const amber = solid("--accent");
  const surface = read("--surface");
  const brand = {
    theme,
    bg,
    surface: bg.clone().lerp(surface.color, surface.a),
    raised,
    ink,
    ink2: solid("--text-2"),
    ink3: solid("--text-3"),
    line: solid("--line"),
    lineStrong: solid("--line-strong"),
    amber,
    brass: amber.clone().multiplyScalar(BRASS[theme]),
    paper: theme === "light" ? raised.clone() : ink.clone(),
    paperInk: theme === "light" ? ink.clone() : raised.clone(),
  };
  probe.remove();
  return brand;
}

/** Calls `change` with fresh colours whenever the theme changes. Returns a function that stops it. */
export function watchBrand(stage: Stage, change: (brand: Brand) => void) {
  const observer = new MutationObserver(() => change(readBrand(stage)));
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/**
 * The one lighting rig. The black stage is lit low and hard, with amber
 * catching the far edge; the paper stage is broad and even, so a shape reads
 * as ink and shade on paper. Returns a function to call with new colours.
 */
export function lightStage(scene: Object3D, brand: Brand) {
  const fill = new HemisphereLight();
  const key = new DirectionalLight();
  const edge = new DirectionalLight();
  key.position.set(-2, 4, 5);
  edge.position.set(4, 1, -3);
  scene.add(fill, key, edge);

  const relight = ({ theme, ink, ink3, surface, raised, amber }: Brand) => {
    const paper = theme === "light";
    fill.color.copy(paper ? surface : ink3);
    fill.groundColor.copy(paper ? raised : ink3).multiplyScalar(paper ? 1 : 0.2);
    fill.intensity = paper ? 2.4 : 0.7;
    key.color.copy(paper ? surface : ink);
    key.intensity = paper ? 1.1 : 3.4;
    edge.color.copy(amber);
    edge.intensity = paper ? 0.5 : 2.6;
  };
  relight(brand);
  return relight;
}

/**
 * IBM Plex Sans and Mono as canvas font families, once they have loaded, so
 * type drawn into a texture never comes out in a fallback. Weights: sans 400
 * and 600, mono 400 (`400 26px ${mono}`, the site's label style, in ink3).
 */
export async function brandFonts() {
  const tokens = getComputedStyle(document.documentElement);
  const sans = tokens.getPropertyValue("--font-sans").trim();
  const mono = tokens.getPropertyValue("--font-mono-stack").trim();
  await Promise.all(
    [`400 16px ${sans}`, `600 16px ${sans}`, `400 16px ${mono}`].map((font) =>
      document.fonts.load(font).catch(() => []),
    ),
  );
  return { sans, mono };
}

/** A texture painted with the 2D canvas API, in the right colour space. */
export function canvasTexture(
  width: number,
  height: number,
  paint: (context: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  paint(canvas.getContext("2d")!);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

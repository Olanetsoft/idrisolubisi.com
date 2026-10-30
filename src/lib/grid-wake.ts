/**
 * The hero grid's pointer wake: a WebGL layer over the grid that lights the
 * lines in amber along the pointer's recent path, fading as it goes, and bends
 * them a few pixels around the pointer like a lens. It draws only while
 * something is moving, and stops on the first idle frame. No library.
 * HeroBackdrop decides who gets it (a desktop with a mouse, motion allowed);
 * if WebGL is missing this returns null and the CSS glow stays.
 */

const POINTS = 24;
/** How long a wake point takes to fade, in ms. */
const LIFE = 1100;
/** How far the pointer travels before the wake gets a new point, in px. */
const STEP = 18;

const VERTEX = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

// Works in CSS pixels with y down, like the grid it draws over. A pixel is on
// a line when it sits within half a pixel of a line centre (the CSS grid draws
// 1px lines at the start of each cell). The lens samples the grid nearer the
// pointer, so the lines appear pushed outwards.
const FRAGMENT = `
precision mediump float;
uniform vec2 uSize;
uniform float uDpr;
uniform float uCell;
uniform vec3 uPts[${POINTS}];
uniform vec2 uPointer;
uniform float uLens;
uniform vec3 uColor;
void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 d = p - uPointer;
  float bend = uLens * 6.0 * exp(-dot(d, d) / 9800.0);
  vec2 q = p - normalize(d + 0.0001) * bend;
  vec2 g = abs(fract((q - 0.5) / uCell + 0.5) - 0.5) * uCell;
  float aa = 0.5 / uDpr;
  float line = 1.0 - smoothstep(0.5 - aa, 0.5 + aa, min(g.x, g.y));
  if (line < 0.01) { gl_FragColor = vec4(0.0); return; }
  float w = uLens * 0.9 * exp(-dot(d, d) / 24200.0);
  for (int i = 0; i < ${POINTS}; i++) {
    vec2 e = p - uPts[i].xy;
    w += uPts[i].z * exp(-dot(e, e) / 16200.0);
  }
  float a = line * (1.0 - exp(-1.6 * w)) * 0.65;
  gl_FragColor = vec4(uColor * a, a);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

/** "rgb(233, 180, 76)" as 0..1 channels. */
function channels(color: string): [number, number, number] {
  const [r = 0, g = 0, b = 0] = color.match(/[\d.]+/g)?.map(Number) ?? [];
  return [r / 255, g / 255, b / 255];
}

/**
 * Starts the wake on `box` (the .hero-bg grid), listening for the pointer on
 * `host` (the hero). Returns a function that stops it, or null without WebGL.
 */
export function startGridWake(box: HTMLElement, host: HTMLElement): (() => void) | null {
  const canvas = document.createElement("canvas");
  canvas.className = "hero-wake";
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
  });
  if (!gl) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One triangle that covers the whole canvas.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  const u = (name: string) => gl.getUniformLocation(program, name);
  const uSize = u("uSize");
  const uDpr = u("uDpr");
  const uCell = u("uCell");
  const uPts = u("uPts");
  const uPointer = u("uPointer");
  const uLens = u("uLens");
  const uColor = u("uColor");

  // Beside the grid, not inside it: the grid's own mask fades out above the
  // intro, and the wake should show wherever the pointer is.
  box.after(canvas);

  let width = 0;
  let height = 0;
  let dpr = 1;
  const measure = () => {
    const rect = box.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uSize, width, height);
    gl.uniform1f(uDpr, dpr);
    // The grid's cell, as the CSS resolved it ("57.5px 57.5px").
    gl.uniform1f(uCell, parseFloat(getComputedStyle(box).backgroundSize) || width / 16);
  };
  measure();
  const resize = new ResizeObserver(() => measure());
  resize.observe(box);

  const trail: { x: number; y: number; t: number }[] = [];
  const points = new Float32Array(POINTS * 3);
  let pointer = { x: -1e4, y: -1e4 };
  let inside = false;
  let lens = 0;
  let frame = 0;

  const draw = (now: number) => {
    lens += ((inside ? 1 : 0) - lens) * 0.12;
    let alive = 0;
    points.fill(0);
    trail.forEach((p, i) => {
      const left = 1 - (now - p.t) / LIFE;
      if (left <= 0) return;
      points.set([p.x, p.y, left * left * 0.35], i * 3);
      alive++;
    });
    gl.uniform3fv(uPts, points);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.uniform1f(uLens, lens);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    frame = alive || lens > 0.01 ? requestAnimationFrame(draw) : 0;
  };
  const wake = () => {
    if (frame) return;
    // The theme may have changed since the last run.
    canvas.style.color = "var(--accent)";
    gl.uniform3f(uColor, ...channels(getComputedStyle(canvas).color));
    frame = requestAnimationFrame(draw);
  };

  const move = (event: PointerEvent) => {
    const rect = box.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    inside = true;
    const last = trail[trail.length - 1];
    if (!last || Math.hypot(pointer.x - last.x, pointer.y - last.y) >= STEP) {
      trail.push({ ...pointer, t: performance.now() });
      if (trail.length > POINTS) trail.shift();
    }
    wake();
  };
  const leave = () => {
    inside = false;
    wake();
  };
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerleave", leave);

  return () => {
    cancelAnimationFrame(frame);
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerleave", leave);
    resize.disconnect();
    canvas.remove();
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}

/**
 * The slow step: the game behind the highlighted clause in the hero. Beads pour
 * off the end of the clause and down five gates, and a pile shows which gate is
 * the real bottleneck. Three fixes, each a real project, move the pile on. It
 * draws on a canvas in the current theme's colours, only while something is
 * moving, and stops by itself. Reduced-motion visitors get a still drawing,
 * redrawn on each fix. No library. SlowStep.tsx holds the dialog and loads this
 * on first intent.
 */

import { markPlayed } from "@/lib/played";

export type SlowStepItem = { key: string; step: string; name: string; line: string };

const GRAVITY = 1500; // px/s2
const SUBSTEP = 1 / 120; // s
const GUSH = 34; // beads/s for the first moments, so a pile reads by second three
const GUSH_FOR = 1.5; // s
const STEADY = 8; // beads/s afterwards
const CAP_FULL = 168; // beads alive
const CAP_SLOW = 104; // when a phone can't hold the frame rate
const WAIT_MIN = 5.5; // s in a pile before a bead gives up
const WAIT_MAX = 9;
const DIM_FOR = 1.8; // s of dimming before it goes
const RATES = [1.3, 2.4, 3.8]; // beads/s through the narrowest gate, the next, the next
const FREE = 42; // beads/s through any other gate
const NECKS = [1.3, 1.6, 2]; // half-widths in bead radii
const NECK_WIDE = 3.2;
const NECK_LOUD = 3.9;
const OPEN = 14; // half-width of a fixed gate, in bead radii
const IDLE_STOP = 60; // s without a touch before the pour tapers off
const END_STOP = 60; // s of stream after the last fix
const TICK_SPEED = 150; // px/s along the line at the bottom
const ARM_PULL = 620; // px/s2 along a bare arm, on top of gravity
const ARM_MAX = 300; // px/s, so nothing leaves the lip like a ramp
const HINT_AFTER = 4.6; // s without a tap before the one-line hint
const LONG_PRESS = 450; // ms: a touch held this long is not a tap

const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];

type RGB = readonly [number, number, number];
type Spring = { x: number; v: number; t: number };
type Bead = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  px: number;
  py: number;
  /** The chamber it is in: the gate below it, or 5 once past the last. */
  ci: number;
  pass: number;
  sleep: number;
  still: number;
  nap: number;
  sp: number;
  touch: number;
  ground: number;
  on: number;
  lip: number;
  wait: number;
  lim: number;
  dim: number;
  ghost: number;
  gv: number;
  side: number;
  fade: number;
  flash: number;
  nx: number;
  ny: number;
  vn: number;
  age: number;
};
type Gate = {
  i: number;
  step: SlowStepItem;
  el: HTMLElement;
  status: Element;
  y: number;
  depth: number;
  gap: Spring;
  rate: number;
  tokens: number;
  open: boolean;
  held: boolean;
  loud: boolean;
  flash: number;
  blip: number;
  press: number;
  cand: Bead | null;
  candY: number;
  inAt: number;
};

// Kept between plays, so the narrowest gate is never the same twice running.
let lastFirst = -1;

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const blend = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const rgba = (c: RGB, alpha = 1) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${alpha})`;

function spring(s: Spring, k: number, c: number, dt: number) {
  s.v += (-k * (s.x - s.t) - c * s.v) * dt;
  s.x += s.v * dt;
}

function buzz(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
}

function make<K extends keyof HTMLElementTagNameMap>(tag: K, text = "", className = "") {
  const el = document.createElement(tag);
  el.textContent = text;
  el.className = className;
  return el;
}

/** Rattles in fits, and it is the brightest thing on the screen when it does. */
function loudness(t: number) {
  return (t * 0.85) % 1 < 0.62 ? 1 : 0;
}

/**
 * Starts a round in the open `dialog`, whose clause began to rise by `lift` at
 * `openedAt`. Returns a function that stops it. A result link closes the dialog
 * with its href as the return value, for SlowStep.tsx to follow.
 */
export function startSlowStep(
  dialog: HTMLDialogElement,
  steps: SlowStepItem[],
  lift: { x: number; y: number },
  openedAt: number,
): () => void {
  markPlayed("slow-step");
  const canvas = make("canvas", "", "slow-step-canvas");
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d")!;
  const panel = make("section", "", "slow-step-panel");
  panel.setAttribute("aria-label", "What shipped");
  const say = make("p", "", "sr-only");
  say.setAttribute("aria-live", "polite");
  dialog.append(canvas, panel, say);
  const clause = dialog.querySelector<HTMLElement>(".slow-step-clause")!;
  const clauseText = clause.firstElementChild!;
  const gatesBox = dialog.querySelector<HTMLElement>(".slow-step-gates")!;
  const pips = [...dialog.querySelectorAll<HTMLElement>(".slow-step-pip")];
  const buttons = [...gatesBox.querySelectorAll<HTMLElement>(".slow-step-gate")];
  const play = make("div");
  let end: HTMLElement | null = null;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cleanups: (() => void)[] = [];

  let width = 0;
  let height = 0;
  let stageW = 0;
  let wide = false;
  let dpr = 1;
  let cx = 0;
  let halfW = 0;
  let topY = 0;
  let panelTop = 0;
  let playH = 116;
  let radius = 4;
  let diameter = 8;
  let diameter2 = 64;
  let cell = 10;
  let cols = 1;
  let rows = 1;
  let clock = 0;
  let last = 0;
  let carry = 0;
  let raf = 0;
  let running = false;
  let live = false;
  let cap = CAP_FULL;
  let slowFrames = 0;
  let gushAt = 0;
  let gushing = false;
  let drainAt = Infinity;
  let roundAt = 0;
  let emitAcc = 0;
  let phase: "play" | "end" = "play";
  let fixes = 3;
  let chain: number[] = [];
  let picks: number[] = [];
  let hintOn = false;
  let usingKeys = false;
  let longHold = false;
  let downAt = 0;
  let endX = 0;
  let endY = 0;
  const beat: { at: number; fn: () => void }[] = [];
  const flip: Spring = { x: 1, v: 0, t: 0 };
  const pan: Spring = { x: 116, v: 0, t: 116 };
  const cam: Spring = { x: 0, v: 0, t: 0 };
  const beads: Bead[] = [];
  const pool: Bead[] = [];
  let head = new Int16Array(1);
  const next = new Int16Array(CAP_FULL + 8);
  const cells = new Int32Array(CAP_FULL + 8);
  const tickBirth = new Float32Array(240);
  let tickN = 0;
  let grad: CanvasGradient;
  let spriteAmber: HTMLCanvasElement;
  let spriteAsh: HTMLCanvasElement;
  let spritePale: HTMLCanvasElement;
  let spriteSize = 0;
  let bg: RGB;
  let text: RGB;
  let accent: RGB;
  let line: RGB;
  let lineStrong: RGB;

  const gates: Gate[] = steps.map((step, i) => ({
    i,
    step,
    el: buttons[i],
    status: buttons[i].lastElementChild!,
    y: 0,
    depth: 30,
    gap: { x: 8, v: 0, t: 8 },
    rate: FREE,
    tokens: 1,
    open: false,
    held: false,
    loud: false,
    flash: 0,
    blip: 0,
    press: 0,
    cand: null,
    candY: 0,
    inAt: 0,
  }));

  // ---- layout ----

  /** A token as channels: the canvas normalises any colour to #rrggbb. */
  function token(style: CSSStyleDeclaration, name: string): RGB {
    ctx.fillStyle = style.getPropertyValue(name).trim();
    const hex = ctx.fillStyle as string;
    const channel = (at: number) => parseInt(hex.slice(at, at + 2), 16);
    return [channel(1), channel(3), channel(5)];
  }

  function sprite(inner: RGB, mid: RGB, outer: RGB) {
    const c = document.createElement("canvas");
    spriteSize = Math.ceil((radius + 1.5) * 2 * dpr);
    c.width = c.height = spriteSize;
    const x = c.getContext("2d")!;
    const m = spriteSize / 2;
    const g = x.createRadialGradient(
      m - radius * dpr * 0.3,
      m - radius * dpr * 0.35,
      0,
      m,
      m,
      radius * dpr,
    );
    g.addColorStop(0, rgba(inner));
    g.addColorStop(0.55, rgba(mid));
    g.addColorStop(1, rgba(outer));
    x.fillStyle = g;
    x.beginPath();
    x.arc(m, m, radius * dpr, 0, 6.2832);
    x.fill();
    return c;
  }

  function readColours() {
    const style = getComputedStyle(dialog);
    bg = token(style, "--bg");
    text = token(style, "--text");
    accent = token(style, "--accent");
    line = token(style, "--line");
    lineStrong = token(style, "--line-strong");
    spriteAmber = sprite(
      blend(accent, WHITE, 0.45),
      blend(accent, WHITE, 0.1),
      blend(accent, BLACK, 0.15),
    );
    spriteAsh = sprite(blend(lineStrong, WHITE, 0.25), blend(lineStrong, WHITE, 0.11), lineStrong);
    spritePale = sprite(WHITE, blend(accent, WHITE, 0.75), blend(accent, WHITE, 0.45));
    grad = ctx.createLinearGradient(0, 0, stageW, 0);
    grad.addColorStop(0, rgba(accent, 0));
    grad.addColorStop(0.12, rgba(accent, 0.7));
    grad.addColorStop(0.5, rgba(blend(accent, text, 0.3)));
    grad.addColorStop(0.88, rgba(accent, 0.7));
    grad.addColorStop(1, rgba(accent, 0));
  }

  function measure() {
    const box = dialog.getBoundingClientRect();
    width = box.width;
    height = box.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    wide = width > height && height < 520; // the landscape rule in globals.css
    stageW = wide ? Math.round(width * 0.58) : width;
    cx = stageW / 2;
    halfW = cx - 14;
    topY = clause.offsetTop + clause.offsetHeight;
    playH = parseFloat(getComputedStyle(gatesBox).marginBottom) || 0;
    pan.t = playH;
    if (phase === "end") fitEnd();
    pan.x = pan.t;
    const ch = (height - playH - topY - 40) / 5;
    radius = clamp(ch / 24, 3, 4.1);
    diameter = radius * 2;
    diameter2 = diameter * diameter;
    cell = diameter + 1;
    cols = Math.ceil(width / cell) + 2;
    rows = Math.ceil((height + 40) / cell) + 2;
    head = new Int16Array(cols * rows).fill(-1);
    readColours();
    // Where the last word of the clause ends, whichever line that is on, and
    // wherever the lift has got to.
    const rects = clauseText.getClientRects();
    const lastLine = rects[rects.length - 1];
    const shift = new DOMMatrixReadOnly(getComputedStyle(clause).transform);
    endX = lastLine.right - box.left - shift.m41;
    endY = lastLine.bottom - box.top - 8 - shift.m42;
    place();
    setNecks();
  }

  function place() {
    panelTop = height - pan.x;
    const chamber = (panelTop - 30 - topY - 6) / 5;
    for (let i = 0; i < 5; i++) {
      const g = gates[i];
      g.y = topY + 6 + chamber * (i + 1);
      g.depth = Math.min(chamber * 0.5, 62);
      // From its place in the CSS, by transform so that this is not a layout shift.
      g.el.style.transform = `translateY(${(((playH - pan.x) * (i + 1)) / 5).toFixed(1)}px)`;
    }
    panel.style.transform = wide ? "none" : `translateY(${panelTop.toFixed(1)}px)`;
  }

  /** Lifts the panel just far enough for the list, on whatever screen this is now. */
  function fitEnd() {
    panel.style.height = "";
    if (wide || !end) return;
    const want = end.offsetHeight + 12;
    pan.t = Math.min(want, height * 0.62);
    if (want > pan.t) panel.style.height = `${pan.t + 24}px`;
  }

  function setNecks() {
    for (const g of gates) {
      if (g.open) {
        g.gap.t = OPEN * radius;
        continue;
      }
      const at = chain.indexOf(g.i);
      g.gap.t = (at >= 0 ? NECKS[at] : g.loud ? NECK_LOUD : NECK_WIDE) * radius;
    }
  }

  // ---- beads ----

  function originY() {
    return endY + lift.y * flip.x;
  }

  function spawn() {
    if (beads.length >= cap) return;
    const b = pool.pop() ?? ({} as Bead);
    b.x = Math.min(endX + lift.x * flip.x - rand(0, 5), cx + halfW - radius * 3);
    b.y = originY() + rand(-2, 2);
    b.vx = rand(-170, -70) * (b.x > cx ? 1 : -0.4);
    b.vy = rand(30, 120);
    b.px = b.x;
    b.py = b.y;
    b.ci = 0;
    b.pass = 0;
    b.sleep = 0;
    b.still = 0;
    b.sp = 200;
    b.touch = 0;
    b.ground = 0;
    b.on = 0;
    b.lip = 0;
    b.nap = 0;
    b.wait = 0;
    b.lim = rand(WAIT_MIN, WAIT_MAX);
    b.dim = 0;
    b.ghost = 0;
    b.gv = 0;
    b.side = 1;
    b.fade = 1;
    b.flash = 0;
    b.nx = 0;
    b.ny = 0;
    b.vn = 0;
    b.age = 0;
    beads.push(b);
  }

  function kill(i: number) {
    const b = beads[i];
    beads[i] = beads[beads.length - 1];
    beads.pop();
    pool.push(b);
  }

  function wakeNear(x: number, y: number, rad: number, ci: number) {
    for (const b of beads) {
      if (b.sleep && b.ci === ci) {
        const dx = b.x - x;
        const dy = b.y - y;
        if (dx * dx + dy * dy < rad * rad) {
          b.sleep = 0;
          b.still = 0;
        }
      }
    }
  }

  function wakeChamber(ci: number) {
    for (const b of beads) {
      if (b.ci === ci) {
        b.sleep = 0;
        b.still = 0;
      }
    }
  }

  function floor(b: Bead) {
    const g = gates[b.ci];
    const gap = g.gap.x;
    const gy = g.y;
    const dx = b.x - cx;
    const ax = dx < 0 ? -dx : dx;
    const sx = dx < 0 ? -1 : 1;
    const slope = g.depth / (halfW - gap);
    const nlen = Math.sqrt(1 + slope * slope);
    if (ax >= gap) {
      if (ax > halfW + radius) {
        b.ghost = 2;
        b.side = sx;
        b.vx = sx * 40;
        b.vy = Math.max(b.vy, 0);
        return;
      }
      const fy = gy - slope * (ax - gap);
      const d = (b.y - fy) / nlen;
      if (d > -radius && d < radius + 12) {
        const push = d + radius;
        const nx = (-sx * slope) / nlen;
        const ny = -1 / nlen;
        b.x += nx * push;
        b.y += ny * push;
        b.ground = 1;
        const vn = b.vx * nx + b.vy * ny;
        if (vn < b.vn) {
          b.vn = vn;
          b.nx = nx;
          b.ny = ny;
        }
      }
    } else if (g.held && !b.pass) {
      const capY = gy - 0.5;
      if (b.y + radius > capY) {
        b.y = capY - radius;
        b.ground = 1;
      }
    }
    // The lip itself.
    const ex = b.x - (cx + sx * gap);
    const ey = b.y - gy;
    const e2 = ex * ex + ey * ey;
    if (e2 < radius * radius && e2 > 0.001) {
      const e = Math.sqrt(e2);
      const p = (radius - e) / e;
      b.x += ex * p;
      b.y += ey * p;
      b.lip = 1;
    }
    // Who goes next.
    if (g.held && !b.pass && ax < gap + radius * 0.4 && b.y > gy - radius * 2.6 && b.y > g.candY) {
      g.cand = b;
      g.candY = b.y;
    }
    if (b.y > gy + radius + 1 && ax < gap + radius) {
      b.ci++;
      b.pass = 0;
      b.wait = 0;
      b.dim = 0;
      b.touch = 0;
      // Through the neck a bead falls straight: the stream stays a stream.
      b.px += (b.x - b.px) * 0.8;
    }
  }

  function ghostStep(b: Bead, dt: number) {
    if (b.ghost === 1) {
      const g = gates[b.ci];
      b.gv = Math.min(b.gv + 240 * dt, 120);
      b.x += b.side * b.gv * dt;
      const ax = Math.abs(b.x - cx);
      const gap = g.gap.x;
      const slope = g.depth / (halfW - gap);
      const fy = g.y - slope * Math.max(ax - gap, 0) - radius - 0.5;
      b.y += (fy - b.y) * Math.min(1, dt * 9);
      if (ax >= halfW) {
        b.ghost = 2;
        b.vx = b.side * 46;
        b.vy = 6;
      }
    } else {
      b.vy += GRAVITY * 0.5 * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.fade -= dt * 1.5;
    }
  }

  function step(dt: number) {
    clock += dt;

    spring(flip, 170, 21, dt);
    spring(cam, 900, 26, dt);
    const panWas = pan.x;
    spring(pan, 190, 25, dt);
    if (Math.abs(pan.x - panWas) > 0.002) {
      place();
      for (const b of beads) {
        b.sleep = 0;
        b.still = 0;
      }
    }

    for (let i = 0; i < 5; i++) {
      const g = gates[i];
      const pre = g.gap.x;
      spring(g.gap, g.open ? 320 : 420, g.open ? 15 : 30, dt);
      if (g.gap.x < radius * 1.08) g.gap.x = radius * 1.08;
      g.flash = Math.max(0, g.flash - dt * 2.2);
      g.blip = Math.max(0, g.blip - dt * 9);
      g.held = !g.open && g.rate < FREE;
      if (g.held) g.tokens = Math.min(g.tokens + g.rate * dt, 1.5);
      g.cand = null;
      g.candY = -1e9;
      if (Math.abs(g.gap.x - pre) > 0.02) wakeChamber(i);
    }

    // Pour, once the clause has risen clear of the first gate.
    if (clock < drainAt && originY() < gates[0].y - gates[0].depth - 8) {
      if (gushing) {
        gushing = false;
        gushAt = clock;
      }
      const since = clock - gushAt;
      const rate =
        since < GUSH_FOR
          ? GUSH
          : STEADY + Math.max(0, (GUSH - STEADY) * (1 - (since - GUSH_FOR) / 0.7));
      emitAcc += rate * dt;
      while (emitAcc >= 1) {
        spawn();
        emitAcc -= 1;
      }
    }

    // Move.
    for (const b of beads) {
      if (b.ghost) {
        ghostStep(b, dt);
        continue;
      }
      if (b.sleep) {
        b.nap -= dt;
        if (b.nap > 0) continue;
        b.sleep = 0;
        b.still = 0.2;
        b.vx = b.vy = 0;
        b.sp = 0;
      }
      b.age += dt;
      b.vy += GRAVITY * dt;
      b.px = b.x;
      b.py = b.y;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.touch = 0;
      b.ground = 0;
      b.on = 0;
      b.vn = 0;
      b.lip = 0;
    }

    // Grid.
    let cellN = 0;
    for (let i = 0; i < beads.length; i++) {
      const b = beads[i];
      if (b.ghost) continue;
      const c = Math.floor(b.x / cell) + 1;
      const r = Math.floor((b.y + 20) / cell) + 1;
      if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
      const k = r * cols + c;
      if (head[k] === -1) cells[cellN++] = k;
      next[i] = head[k];
      head[k] = i;
    }

    // Neighbour pushes and floors.
    for (let it = 0; it < 2; it++) {
      for (let ci = 0; ci < cellN; ci++) {
        const key = cells[ci];
        for (let i = head[key]; i !== -1; i = next[i]) {
          const a = beads[i];
          for (let ny = -1; ny <= 1; ny++) {
            for (let nx = -1; nx <= 1; nx++) {
              const o = key + ny * cols + nx;
              if (o < 0 || o >= head.length) continue;
              for (let j = head[o]; j !== -1; j = next[j]) {
                if (j <= i) continue;
                const b = beads[j];
                if (a.ci !== b.ci || a.age < 0.16 || b.age < 0.16) continue;
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const d2 = dx * dx + dy * dy;
                if (d2 >= diameter2 || d2 < 1e-4) continue;
                let wa = a.sleep ? 0 : 1;
                let wb = b.sleep ? 0 : 1;
                if (!wa && !wb) continue;
                if (!wa && b.sp > 40) {
                  a.sleep = 0;
                  a.still = 0;
                  wa = 1;
                  a.px = a.x;
                  a.py = a.y;
                }
                if (!wb && a.sp > 40) {
                  b.sleep = 0;
                  b.still = 0;
                  wb = 1;
                  b.px = b.x;
                  b.py = b.y;
                }
                const d = Math.sqrt(d2);
                const ov = (diameter - d) / d;
                const w = wa + wb;
                const pushX = (dx * ov * 0.92) / w;
                const pushY = (dy * ov * 0.92) / w;
                if (wa) {
                  a.x -= pushX;
                  a.y -= pushY;
                }
                if (wb) {
                  b.x += pushX;
                  b.y += pushY;
                }
                if (it === 0) {
                  a.touch++;
                  b.touch++;
                  if (dy > radius * 0.9) a.on++;
                  else if (dy < -radius * 0.9) b.on++;
                }
              }
            }
          }
        }
      }
      for (const b of beads) {
        if (b.ghost || b.sleep || b.ci > 4) continue;
        floor(b);
      }
    }
    for (let i = 0; i < cellN; i++) head[cells[i]] = -1;

    // Release one bead per token at each gate that isn't open.
    for (let i = 0; i < 5; i++) {
      const g = gates[i];
      if (g.held && g.tokens >= 1 && g.cand) {
        g.tokens -= 1;
        g.blip = 1;
        const c = g.cand;
        c.pass = 1;
        c.sleep = 0;
        c.still = 0;
        c.vy = Math.max(c.vy, 30);
        wakeNear(c.x, c.y, diameter * 3, i);
      }
    }

    // Velocities, sleep, patience.
    for (let i = beads.length - 1; i >= 0; i--) {
      const b = beads[i];
      if (b.ghost) {
        if (b.ghost === 2 && (b.fade <= 0 || b.y > height + 10 || b.x < -10 || b.x > width + 10))
          kill(i);
        continue;
      }
      if (!b.sleep) {
        let vx = (b.x - b.px) / dt;
        let vy = (b.y - b.py) / dt;
        // On the arm alone a bead rolls freely; deep in a pile it can barely move.
        if (b.ground && b.ci < 5) {
          const inward = b.x > cx ? -1 : 1;
          if (!b.on) vx += inward * ARM_PULL * dt;
          if (vx * inward < 0) vx *= 0.95; // climbing the far arm: gives up quickly
          if (vx > ARM_MAX) vx = ARM_MAX;
          else if (vx < -ARM_MAX) vx = -ARM_MAX;
        }
        if (b.on > 0) {
          vx *= 0.93;
          vy *= 0.965;
        } else if (b.touch > 0) {
          vx *= 0.993;
          vy *= 0.998;
        }
        if (b.lip) {
          vx *= 0.72;
          vy = vy < 0 ? vy * 0.4 : vy;
        }
        if (b.vn < -110) {
          // A little patter when a bead lands.
          const e = -b.vn * 0.2;
          vx += b.nx * e;
          vy += b.ny * e;
        }
        // A squeeze can move a bead but must not fire it.
        let sp = Math.sqrt(vx * vx + vy * vy);
        const lim = Math.max(b.sp, 150) + 34;
        if (sp > lim) {
          vx *= lim / sp;
          vy *= lim / sp;
          sp = lim;
        }
        if (vy > 1000) vy = 1000;
        b.vx = vx;
        b.vy = vy;
        b.sp = sp;
        if (b.sp < 16 && (b.on > 0 || (b.ground && b.touch > 1))) {
          b.still += dt;
          if (b.still > 0.3) {
            b.sleep = 1;
            b.nap = rand(0.26, 0.42);
            b.vx = b.vy = 0;
            b.sp = 0;
          }
        } else b.still = 0;
      }
      b.flash = Math.max(0, b.flash - dt * 2.4);

      if (b.ci > 4) {
        if (b.y > panelTop) {
          tickBirth[tickN % tickBirth.length] = clock;
          tickN++;
          kill(i);
          continue;
        }
      } else {
        if (b.sp < 60) b.wait += dt;
        else if (b.wait > 0) b.wait = Math.max(0, b.wait - dt * 4);
        b.dim = clamp((b.wait - (b.lim - DIM_FOR)) / DIM_FOR, 0, 1);
        if (b.wait > b.lim && !b.pass) {
          b.ghost = 1;
          b.side = b.x >= cx ? 1 : -1;
          b.gv = 0;
          b.dim = 1;
          b.sleep = 0;
          wakeNear(b.x, b.y, diameter * 2.5, b.ci);
        }
      }
      if (b.y > height + 30) kill(i);
    }
  }

  // ---- drawing ----

  function drawGate(g: Gate) {
    let show = reduced ? 1 : clamp((clock - roundAt - g.inAt) / 0.36, 0, 1);
    if (show <= 0) return;
    show = 1 - (1 - show) * (1 - show);
    const gap = g.gap.x + g.blip * 1.1 - g.press * 1.2;
    const gy = g.y;
    const ry = gy - g.depth;
    let jx = 0;
    let jy = 0;
    const loud = g.loud && !g.open && clock < drainAt && !reduced ? loudness(clock) : 0;
    if (loud) {
      jx = (Math.sin(clock * 83) + 0.6 * Math.sin(clock * 57)) * 1.5;
      jy = Math.sin(clock * 71) * 1.2;
    }
    const rest = loud || (g.loud && reduced) ? blend(lineStrong, text, 0.63) : lineStrong;
    ctx.strokeStyle = rgba(
      g.open
        ? blend(blend(accent, bg, 0.25), text, g.flash * 0.75)
        : blend(rest, text, Math.max(g.flash, g.press)),
    );
    ctx.lineWidth = g.open ? 1.5 : 1.25;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let s = -1; s <= 1; s += 2) {
      const tipX = cx + s * gap + jx;
      const tipY = gy + jy;
      const rimX = cx + s * halfW + jx * 0.4;
      const rimY = ry + jy * 0.4;
      ctx.moveTo(tipX, tipY + (g.open ? 0 : 4));
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(tipX + (rimX - tipX) * show, tipY + (rimY - tipY) * show);
    }
    ctx.stroke();
    if (loud || (g.loud && reduced && !g.open)) {
      // Rattle marks either side of the neck.
      ctx.strokeStyle = rgba(text, reduced ? 0.6 : 0.5 + 0.4 * Math.abs(Math.sin(clock * 40)));
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let m = -1; m <= 1; m += 2) {
        for (let n = 0; n < 2; n++) {
          const ax = cx + m * (gap + 9 + n * 5) + jx * 1.4;
          const ay = gy - 13 - n * 2 + jy;
          ctx.moveTo(ax, ay - 5 + n);
          ctx.quadraticCurveTo(ax + m * 3, ay, ax, ay + 5 - n);
        }
      }
      ctx.stroke();
    }
  }

  function drawBeads() {
    const s = spriteSize / dpr;
    const h = s / 2;
    for (const b of beads) {
      if (b.ghost) {
        ctx.globalAlpha = 0.62 * Math.max(0, b.fade);
        ctx.drawImage(spriteAsh, b.x - h, b.y - h, s, s);
      }
    }
    for (const b of beads) {
      if (b.ghost) continue;
      if (b.dim > 0) {
        ctx.globalAlpha = 1;
        ctx.drawImage(spriteAsh, b.x - h, b.y - h, s, s);
        ctx.globalAlpha = 1 - b.dim;
      } else ctx.globalAlpha = 1;
      if (b.sp > 320 && !b.sleep) {
        // Fast beads stretch along their path.
        const q = Math.min((b.sp - 320) / 900, 1);
        const c = b.vy / b.sp;
        const n = b.vx / b.sp;
        ctx.setTransform(dpr * c, -dpr * n, dpr * n, dpr * c, dpr * b.x, dpr * (b.y + cam.x));
        ctx.drawImage(
          spriteAmber,
          -h * (1 - q * 0.22),
          -h * (1 + q * 0.75),
          s * (1 - q * 0.22),
          s * (1 + q * 0.75),
        );
        ctx.setTransform(dpr, 0, 0, dpr, 0, cam.x * dpr);
      } else ctx.drawImage(spriteAmber, b.x - h, b.y - h, s, s);
      if (b.flash > 0) {
        ctx.globalAlpha = b.flash;
        ctx.drawImage(spritePale, b.x - h, b.y - h, s, s);
      }
    }
    ctx.globalAlpha = 1;
  }

  /**
   * The line at the bottom: each bead that gets through runs along it, so a
   * trickle is a few dashes and a full stream is a lit line.
   */
  function drawLine() {
    const y = Math.round(panelTop) - 0.5;
    ctx.strokeStyle = rgba(line);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(stageW, y);
    ctx.stroke();
    if (reduced) return;
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.lineCap = "butt";
    ctx.beginPath();
    for (let i = Math.max(0, tickN - tickBirth.length); i < tickN; i++) {
      const d = (clock - tickBirth[i % tickBirth.length]) * TICK_SPEED;
      if (d > cx + 20) continue;
      const e = Math.max(0, d - 15);
      ctx.moveTo(cx + d, y);
      ctx.lineTo(cx + e, y);
      ctx.moveTo(cx - d, y);
      ctx.lineTo(cx - e, y);
    }
    ctx.stroke();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(0, cam.x);
    for (let i = 0; i < 5; i++) drawGate(gates[i]);
    drawBeads();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawLine();
  }

  /** The canvas now shows the gates, so the shell's CSS gates step aside. */
  function goLive() {
    if (live) return;
    live = true;
    dialog.dataset.live = "";
  }

  function heap(g: Gate, n: number, dimFrom: number) {
    const s = spriteSize / dpr;
    const h = s / 2;
    const slope = g.depth / (halfW - g.gap.x);
    const gapX = radius * 1.8;
    let row = 0;
    let placed = 0;
    while (placed < n && row < 14) {
      const y = g.y - radius - 1 - row * radius * 1.62;
      const w = Math.min(g.gap.x + (g.y - y - radius) / slope, gapX * 9.5 - row * gapX * 0.72);
      const across = Math.max(1, Math.floor((w * 2) / gapX));
      const x0 = cx - ((across - 1) * gapX) / 2;
      for (let c = 0; c < across && placed < n; c++) {
        const far = Math.abs(c - (across - 1) / 2) / (across / 2);
        ctx.drawImage(
          placed > dimFrom && far > 0.55 ? spriteAsh : spriteAmber,
          x0 + c * gapX - h,
          y - h,
          s,
          s,
        );
        placed++;
      }
      row++;
    }
  }

  /** Reduced motion: a still drawing of how long each queue is, redrawn on each fix. */
  function drawStill() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const cur = current();
    const s = spriteSize / dpr;
    const h = s / 2;
    for (let i = 0; i < 5; i++) {
      gates[i].gap.x = gates[i].gap.t;
      drawGate(gates[i]);
    }
    const pileY = cur === undefined ? null : gates[cur].y;
    // Dots down the centre: close together where people get through freely,
    // far apart below the pile.
    const rim = gates[0].y - gates[0].depth;
    for (let y = endY + 16; y < rim; y += 15) {
      const x = cx + (endX - cx) * (1 - (y - endY) / (gates[0].y - endY));
      ctx.drawImage(spriteAmber, x - h, y - h, s, s);
    }
    for (let y = gates[0].y - 24; y < panelTop - 6; y += pileY !== null && y > pileY ? 46 : 15) {
      if (pileY !== null && y > pileY - radius * 12 && y < pileY) continue;
      ctx.drawImage(spriteAmber, cx - h, y - h, s, s);
    }
    if (cur !== undefined) heap(gates[cur], 58, 30);
    drawLine();
    const dashes = cur === undefined ? 34 : [8, 14, 22][chain.indexOf(cur)];
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const y = Math.round(panelTop) - 0.5;
    const gapX = stageW / dashes;
    for (let q = 0; q < dashes; q++) {
      ctx.moveTo(q * gapX, y);
      ctx.lineTo(q * gapX + 12, y);
    }
    ctx.stroke();
    goLive();
  }

  // ---- the loop ----

  function busy() {
    if (clock < drainAt || beads.length) return true;
    if (Math.abs(flip.x - flip.t) > 0.002 || Math.abs(pan.x - pan.t) > 0.2) return true;
    return tickN > 0 && clock - tickBirth[(tickN - 1) % tickBirth.length] < (cx + 20) / TICK_SPEED;
  }

  function frame(now: number) {
    raf = 0;
    if (!running) return;
    const ft = Math.min((now - last) / 1000, 1 / 18);
    last = now;
    if (ft > 0) {
      if (ft > 0.026) {
        if (++slowFrames > 40) cap = CAP_SLOW;
      } else if (slowFrames > 0) slowFrames--;
      // The remainder carries over, so a 90 or 144 Hz screen runs at true speed.
      const want = ft + carry;
      const n = clamp(Math.round(want / SUBSTEP), 0, 5);
      carry = clamp(want - n * SUBSTEP, -SUBSTEP, SUBSTEP);
      for (let i = 0; i < n; i++) step(SUBSTEP);
    }
    if (!hintOn && !picks.length && phase === "play" && clock - roundAt > HINT_AFTER) showHint();
    for (const g of gates) {
      const l = g.loud && !g.open && clock < drainAt && loudness(clock) > 0;
      g.el.toggleAttribute("data-loud", l);
    }
    for (let b = beat.length - 1; b >= 0; b--) {
      if (clock >= beat[b].at) {
        const { fn } = beat[b];
        beat.splice(b, 1);
        fn();
      }
    }
    draw();
    goLive();
    if (busy() || beat.length) kick();
    else running = false;
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function run() {
    if (reduced || document.hidden) return;
    if (!running) {
      running = true;
      last = performance.now();
    }
    kick();
  }

  function poke() {
    if (phase === "play") drainAt = clock + IDLE_STOP;
    run();
  }

  function later(s: number, fn: () => void) {
    if (reduced) {
      const timer = window.setTimeout(fn, s * 1000);
      cleanups.push(() => window.clearTimeout(timer));
    } else beat.push({ at: clock + s, fn });
  }

  // ---- the round ----

  function current() {
    return chain.find((i) => !gates[i].open);
  }

  /**
   * Three gates in path order, so a fix sends the crowd on to the next one. The
   * narrowest changes every round, so it can't be learned.
   */
  function shuffle() {
    let first;
    do {
      first = Math.floor(Math.random() * 3);
    } while (first === lastFirst);
    lastFirst = first;
    const rest: number[] = [];
    for (let i = first + 1; i < 5; i++) rest.push(i);
    for (let j = rest.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [rest[j], rest[k]] = [rest[k], rest[j]];
    }
    chain = [first, ...rest.slice(0, 2).sort((a, b) => a - b)];
    const others = [0, 1, 2, 3, 4].filter((n) => !chain.includes(n));
    const loud = others[Math.floor(Math.random() * others.length)];
    for (const g of gates) {
      const at = chain.indexOf(g.i);
      g.loud = g.i === loud;
      g.open = false;
      g.rate = at >= 0 ? RATES[at] : FREE;
      g.tokens = 1;
      g.flash = 0;
      g.inAt = 0.1 + g.i * 0.05;
    }
    setNecks();
  }

  function labelGates() {
    const cur = current();
    for (const g of gates) {
      g.el.setAttribute("aria-disabled", g.open || phase !== "play" ? "true" : "false");
      g.el.tabIndex = phase === "play" ? 0 : -1;
      if (g.open) {
        g.el.dataset.state = "fixed";
        g.status.textContent = ", fixed";
        continue;
      }
      delete g.el.dataset.state;
      g.status.textContent =
        g.i === cur
          ? ", a pile is growing here"
          : g.loud
            ? ", rattling, nothing queued"
            : ", flowing";
    }
  }

  function startRound(first: boolean) {
    phase = "play";
    fixes = 3;
    picks = [];
    hintOn = false;
    beat.length = 0;
    for (const pip of pips) delete pip.dataset.spent;
    play.replaceChildren();
    panel.replaceChildren(play);
    panel.style.height = "";
    end = null;
    say.textContent = "";
    dialog.dataset.phase = "play";
    shuffle();
    roundAt = first ? clock : clock - 1;
    gushAt = clock;
    drainAt = clock + IDLE_STOP;
    gushing = true;
    pan.t = playH;
    if (reduced) {
      pan.x = pan.t;
      place();
      showHint();
    }
    labelGates();
  }

  function showHint() {
    hintOn = true;
    play.replaceChildren(make("p", "Tap a gate to ship a fix.", "slow-step-hint"));
  }

  function note(g: Gate, status: string, hit: boolean) {
    const box = make("div", "", "slow-step-note");
    box.toggleAttribute("data-hit", hit);
    box.style.setProperty("--beat", hit ? "160ms" : "520ms");
    box.append(make("b", g.step.name), make("span", g.step.line), make("em", status));
    play.replaceChildren(box);
  }

  function fix(i: number) {
    const g = gates[i];
    const cur = current();
    if (g.open || fixes <= 0 || phase !== "play") return;
    const hit = i === cur;
    fixes--;
    pips[2 - fixes].dataset.spent = "";
    g.open = true;
    g.loud = false;
    g.gap.t = OPEN * radius;
    g.gap.v += reduced ? 0 : 300;
    g.flash = reduced ? 0 : 1;
    picks.push(i);
    if (!reduced) wakeChamber(i);
    const status = hit
      ? current() === undefined
        ? "The pile is gone."
        : "The pile moved."
      : "The pile did not move.";
    note(g, status, hit);
    const left = ["", " One fix left.", " Two fixes left."][fixes];
    say.textContent = `${g.step.step} fixed. ${g.step.name}. ${g.step.line}. ${status}${left}`;
    if (hit) {
      buzz([14, 36, 26]);
      for (const b of beads) {
        if (b.ci === i && !b.ghost) {
          b.sleep = 0;
          b.still = 0;
          b.vx += (cx - b.x) * 2.4;
          b.vy += 90;
          b.flash = 0.7;
          b.wait = 0;
          b.dim = 0;
        }
      }
      cam.v += 90;
    } else {
      buzz(10);
      // The crowd that didn't move answers a beat later, once the thumb is off.
      later(0.42, () => {
        const at = current();
        if (at === undefined) return;
        for (const b of beads) {
          if (b.ci === at && !b.ghost) {
            b.sleep = 0;
            b.still = 0;
            b.vy = -rand(110, 300) * clamp(1.15 - Math.abs(b.x - cx) / 170, 0.3, 1);
            b.px = b.x;
            b.py = b.y;
            b.flash = 0.8;
          }
        }
        gates[at].flash = reduced ? 0 : 1;
        buzz(6);
      });
    }
    if (fixes === 0) later(hit ? 1.5 : 1.7, finish);
    labelGates();
    poke();
    if (reduced) {
      place();
      drawStill();
    }
  }

  function finish() {
    phase = "end";
    dialog.dataset.phase = "end";
    const list = make("ul", "", "slow-step-list");
    for (const i of picks) {
      const { key, name, line: tagline } = gates[i].step;
      const link = make("a");
      link.href = `#${key}`;
      link.append(make("b", name), make("span", tagline));
      const item = make("li");
      item.append(link);
      list.append(item);
    }
    const again = make("button", "Again", "btn");
    again.type = "button";
    const foot = make("div", "", "slow-step-foot");
    foot.append(again, make("p", "An illustration, not measured data."));
    end = make("div", "", "slow-step-end");
    end.append(make("p", "Unlocked", "slow-step-end-label"), list, foot);
    panel.replaceChildren(end);
    fitEnd();
    if (reduced) pan.x = pan.t;
    drainAt = clock + END_STOP;
    labelGates();
    say.textContent = "All three fixes used. What you unlocked is listed below.";
    if (usingKeys && document.activeElement?.classList.contains("slow-step-gate")) again.focus();
    if (reduced) {
      place();
      drawStill();
    } else run();
  }

  // ---- the wiring ----

  function on(
    target: EventTarget,
    type: string,
    fn: (event: never) => void,
    options?: AddEventListenerOptions | boolean,
  ) {
    target.addEventListener(type, fn as EventListener, options);
    cleanups.push(() => target.removeEventListener(type, fn as EventListener, options));
  }

  const repaint = () => {
    if (reduced) drawStill();
    else if (!running) {
      for (const g of gates) g.gap.x = g.gap.t;
      draw();
    }
  };

  on(gatesBox, "pointerdown", (event: PointerEvent) => {
    const el = (event.target as Element).closest<HTMLElement>(".slow-step-gate");
    if (!el) return;
    downAt = event.pointerType === "mouse" ? 0 : event.timeStamp;
    longHold = false;
    const g = gates[buttons.indexOf(el)];
    if (!g.open) {
      g.press = 1;
      el.dataset.press = "";
    }
  });
  for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
    on(
      gatesBox,
      type,
      (event: PointerEvent) => {
        if (downAt && event.timeStamp - downAt > LONG_PRESS) longHold = true;
        for (const g of gates) {
          g.press = 0;
          delete g.el.dataset.press;
        }
      },
      true,
    );
  }
  on(gatesBox, "click", (event: MouseEvent) => {
    const el = (event.target as Element).closest<HTMLElement>(".slow-step-gate");
    // detail is 0 for Enter and Space, which have no press to measure.
    if (el && !(event.detail && longHold)) fix(buttons.indexOf(el));
  });
  on(panel, "click", (event: MouseEvent) => {
    const target = event.target as Element;
    if (target.closest(".btn")) {
      startRound(false);
      poke();
      if (reduced) {
        place();
        drawStill();
      }
      gates[0].el.focus({ preventScroll: true });
      return;
    }
    const link = target.closest("a");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.close(link.getAttribute("href")!);
  });
  // iOS: keep the page behind still while a thumb is down in here.
  on(
    dialog,
    "touchmove",
    (event: TouchEvent) => {
      if (event.touches.length > 1) return;
      if (!(event.target as Element).closest(".slow-step-panel")) event.preventDefault();
    },
    { passive: false },
  );
  on(document, "keydown", () => (usingKeys = true), true);
  on(document, "pointerdown", () => (usingKeys = false), true);
  on(document, "visibilitychange", () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    } else run();
  });
  on(window, "resize", () => {
    measure();
    repaint();
  });

  // Once the dialog has gone, the canvas, panel and live region go with it;
  // startRound resets the rest.
  dialog.addEventListener(
    "close",
    () => {
      canvas.remove();
      panel.remove();
      say.remove();
      delete dialog.dataset.live;
    },
    { once: true },
  );

  // ---- open ----

  const since = Math.max(0, (performance.now() - openedAt) / 1000);
  measure();
  startRound(true);
  place();
  // The shell has been showing since the tap, with every gate this wide: pick
  // up from there, whether that was a moment ago or a slow download ago.
  roundAt = -since;
  for (let t = 0; t < Math.min(since, 1); t += SUBSTEP) spring(flip, 170, 21, SUBSTEP);
  for (const g of gates) g.gap.x = NECK_WIDE * radius;
  if (reduced) {
    drawStill();
  } else {
    emitAcc = 1;
    if (since < 0.2) buzz(8);
    run();
  }

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
    for (const cleanup of cleanups) cleanup();
  };
}

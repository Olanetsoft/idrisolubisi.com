/**
 * Loose Leaf: the door on the "How Merkle proofs work" row opens eight articles
 * hung as a Merkle tree. Each leaf is the SHA-256 of a title, each arm the
 * SHA-256 of its two children, hashed on this device, and tearing a leaf away
 * tilts its path to the root and changes the root hash above. This module is
 * the lesson and the SVG drawing of the mobile, which stands in until the 3D
 * arrives and is the whole piece without WebGL or with reduced motion. A tap
 * means the same in both: it names the leaf and lights its path, and a pull
 * tears it. src/lib/loose-leaf-sim.ts holds the weight, and
 * src/lib/loose-leaf-three.ts draws it in three.js, behind one more import.
 */

import "@/app/loose-leaf.css";
import {
  LEAF_H,
  LEAF_W,
  SLOPE,
  STRETCH,
  WALL_Z,
  clamp,
  makeSim,
  pathOf,
  project,
  rad,
  tiltFor,
  type Pad,
  type Sim,
  type View,
} from "@/lib/loose-leaf-sim";
import type { StartStage } from "@/lib/three-shell";

export type Article = { title: string; outlet: string; href: string; date: string };

/** The press under way, in pixels from the stage's top left corner. */
export type Press = {
  id: number | null;
  x0: number;
  y0: number;
  x: number;
  y: number;
  leaf: number;
  mode: "press" | "pull" | "spin" | "held" | null;
  moved: boolean;
  committed: boolean;
  ox: number;
  oy: number;
  Y0: number;
  spinBase: number;
  trail: [number, number, number][];
};

/** What the 3D offers the lesson once it has arrived. */
export type Piece = {
  sim: Sim;
  pulse: (leaf: number, path: number[], seconds: number) => void;
  light: (leaf: number, on: boolean) => void;
  down: (event: PointerEvent) => void;
  move: (event: PointerEvent) => void;
  up: (event: PointerEvent) => void;
  autoTear: (leaf: number) => void;
  autoRehang: (leaf: number) => void;
  spinBy: (speed: number) => void;
};

type Tree = Awaited<ReturnType<typeof hashTree>>;

export type Lesson = {
  dialog: HTMLDialogElement;
  slot: HTMLElement;
  articles: Article[];
  /** The leaf for the post the door sits on. */
  doorLeaf: number;
  torn: boolean[];
  tree: Tree | null;
  /** Settles once the first root is on show. */
  hashed: Promise<void>;
  view: View;
  home: Sim;
  piece: Piece | null;
  press: Press;
  /** The visitor has touched something, so the leaf's own tug is not needed. */
  touched: boolean;
  /** The torn leaf whose card is up, or -1. */
  card: number;
  /** The leaf named in the foot by a press, or -1. */
  named: number;
  chipPath: number[] | null;
  /** How far the drawn leaf under a finger has been pulled, in px. */
  drag: [number, number];
  size: string;
  roll: number;
  timers: Set<number>;
  chipTimer: number;
  nameTimer: number;
  els: {
    svg: SVGSVGElement;
    root: HTMLElement;
    hash: HTMLElement;
    digits: HTMLElement[];
    state: HTMLElement;
    message: HTMLElement;
    all: HTMLElement;
    list: HTMLElement;
    live: HTMLElement;
    chips: HTMLElement[];
    foot: HTMLElement;
  };
  /** Ends whatever the lesson started. Safe to call twice. */
  end: () => void;
};

const SIDEWAYS = "(orientation: landscape) and (max-height: 519px)";
const ROLL_DIGIT = 7; // ms between one digit starting to roll and the next
const ROLL_FOR = 240; // ms a digit rolls
const NAME_FOR = 3200; // ms a tapped leaf's name stays in the foot
const FLICK_UP = 40; // px up a torn page travels to count as thrown at its hook
const HEX = "0123456789abcdef";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function buzz(pattern: number) {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
}

/* ---------- SHA-256: WebCrypto, or by hand on a LAN address, which has no crypto.subtle ---------- */

const encoder = new TextEncoder();

async function sha(bytes: Uint8Array<ArrayBuffer>) {
  if (crypto.subtle) return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return shaByHand(bytes);
}

function shaByHand(message: Uint8Array) {
  const K: number[] = [];
  const H: number[] = [];
  const frac = (x: number) => ((x - Math.floor(x)) * 4294967296) | 0;
  for (let n = 2, c = 0; c < 64; n++) {
    let prime = true;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) prime = false;
    if (!prime) continue;
    if (c < 8) H[c] = frac(Math.sqrt(n));
    K[c++] = frac(Math.cbrt(n));
  }
  const length = message.length;
  const m = new Uint8Array((length + 9 + 63) & ~63);
  m.set(message);
  m[length] = 128;
  const view = new DataView(m.buffer);
  view.setUint32(m.length - 4, length * 8);
  view.setUint32(m.length - 8, Math.floor(length / 536870912));
  const r = (x: number, y: number) => (x >>> y) | (x << (32 - y));
  const w = new Int32Array(64);
  for (let o = 0; o < m.length; o += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getInt32(o + i * 4);
    for (let i = 16; i < 64; i++) {
      const a = w[i - 15];
      const b = w[i - 2];
      w[i] = (w[i - 16] + (r(a, 7) ^ r(a, 18) ^ (a >>> 3)) + w[i - 7]) | 0;
      w[i] = (w[i] + (r(b, 17) ^ r(b, 19) ^ (b >>> 10))) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, h].forEach((v, i) => {
      H[i] = (H[i] + v) | 0;
    });
  }
  const out = new DataView(new ArrayBuffer(32));
  H.forEach((v, i) => out.setInt32(i * 4, v));
  return new Uint8Array(out.buffer);
}

const hex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

function joined(a: Uint8Array, b: Uint8Array) {
  const both = new Uint8Array(64);
  both.set(a);
  both.set(b, 32);
  return both;
}

/** In heap order: arm 0 is the root, 1 and 2 the next level, 3 to 6 the lowest. */
async function hashTree(titles: string[]) {
  const empty = await sha(new Uint8Array(0));
  const leaves = await Promise.all(titles.map((t) => sha(encoder.encode(t))));
  const current = leaves.slice();
  const nodes = new Array<Uint8Array>(7);
  const child = (a: number, side: number) =>
    a >= 3 ? current[(a - 3) * 2 + side] : nodes[a * 2 + 1 + side];
  const rehash = async (a: number) => {
    nodes[a] = await sha(joined(child(a, 0), child(a, 1)));
  };
  for (let a = 6; a >= 0; a--) await rehash(a);
  const original = nodes.map(hex);

  return {
    /** Only the three parents on this leaf's path are hashed again. */
    set: async (leaf: number, present: boolean) => {
      current[leaf] = present ? leaves[leaf] : empty;
      const path = pathOf(leaf);
      for (const a of path) await rehash(a);
      return path;
    },
    root: () => hex(nodes[0]),
    node: (a: number) => hex(nodes[a]),
    dirty: (a: number) => hex(nodes[a]) !== original[a],
    matches: () => hex(nodes[0]) === original[0],
  };
}

/* ---------- the one layout: the same numbers for the SVG, three.js and picking ---------- */

export function layout({ dialog, slot, els }: Lesson): View {
  const side = window.matchMedia(SIDEWAYS).matches;
  const W = slot.clientWidth;
  const H = dialog.clientHeight;
  const top = side
    ? 36
    : els.root.getBoundingClientRect().bottom - dialog.getBoundingClientRect().top;
  const footTop = side ? H : H - els.foot.offsetHeight;
  const floorH = side ? 44 : clamp(H * 0.165, 84, 170);
  const seamPx = footTop - floorH;
  const rootPx = top + clamp(H * 0.035, 14, 40);
  const u = Math.min(clamp((W - 20) / 9, 20, 200), (seamPx - rootPx) / 9.35);
  const D = 18;
  const ye = -6.4;
  const f = u * D;
  const eye = rootPx + u * -ye;
  const cx = W / 2;
  const seamY = ye - ((seamPx - eye) * (D - WALL_Z)) / f; // at the wall's depth
  const floorY = (z: number) => seamY - (z - WALL_Z) * SLOPE;
  const view: View = {
    W,
    H,
    u,
    D,
    ye,
    f,
    cx,
    eye,
    rootPx,
    topPx: top,
    seamPx,
    footTop,
    seamY,
    ceil: (rootPx - top - 3) / u,
    pads: [],
  };
  view.pads = Array.from({ length: 8 }, (_, i): Pad => {
    const want = footTop - (side ? (i % 2 ? 24 : 44) : i % 2 ? 54 : 76);
    const x = (i - 3.5) * Math.min(0.92, (W - 90) / u / 7.2);
    let a = WALL_Z;
    let b = 4;
    for (let n = 0; n < 24; n++) {
      const z = (a + b) / 2;
      if (project(view, 0, floorY(z), z).y < want) a = z;
      else b = z;
    }
    const z = (a + b) / 2;
    return {
      x: (x * (D - z)) / D,
      y: floorY(z) + 0.16,
      z,
      jitter: rad([-9, 6, -4, 11, -7, 8, -12, 5][i]),
    };
  });
  dialog.style.setProperty("--seam", `${seamPx}px`);
  dialog.style.setProperty("--pool-y", `${Math.round((((rootPx + seamPx) / 2 - 20) / H) * 100)}%`);
  return view;
}

export function wrapTitle(
  title: string,
  context: CanvasRenderingContext2D,
  max: number,
  limit: number,
) {
  const lines: string[] = [];
  let line = "";
  for (const word of title.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length > limit) {
    lines.length = limit;
    lines[limit - 1] = lines[limit - 1].replace(/\s*\S*$/, "") + "…";
  }
  return lines;
}

/* ---------- the SVG: already the whole lesson ---------- */

const px = (n: number) => n.toFixed(1);
const period = (i: number) => `${(2.6 + ((i * 7) % 5) * 0.34).toFixed(2)}s`;

function drawMobile(lesson: Lesson) {
  const { view: V, home, articles, els } = lesson;
  const P = (x: number, y: number, z: number) => project(V, x, y, z);
  const family = getComputedStyle(lesson.dialog).getPropertyValue("--font-sans");
  const context = document.createElement("canvas").getContext("2d")!;
  context.font = `600 30px ${family}`;

  const leaf = (i: number) => {
    const l = home.leaves[i];
    const t = P(...l.arm.tip[i & 1]);
    const e = P(l.x, l.y, l.z);
    const w = LEAF_W * e.k;
    const h = LEAF_H * e.k;
    const size = (28 * w) / 256;
    const left = px(-w / 2 + w * 0.09);
    const lines = wrapTitle(articles[i].title, context, 226, 6);
    return `<g class="three-leaf-node" data-l="${i}"><g class="three-leaf-sway" style="--ox:${px(t.x)}px;--oy:${px(t.y)}px;--d:${period(i + 3)};--a:${(1.6 + (i % 3) * 0.5).toFixed(1)}deg">
      <line class="three-leaf-thread" data-lt="${i}" x1="${px(t.x)}" y1="${px(t.y)}" x2="${px(e.x)}" y2="${px(e.y)}"/>
      <g class="three-leaf-drag"><g class="three-leaf-paper" transform="translate(${px(e.x)} ${px(e.y)}) scale(${Math.max(0.72, Math.cos(l.Y)).toFixed(3)} 1)">
        <rect x="${px(-w / 2)}" y="-${px(h * 0.06)}" width="${px(w)}" height="${px(h)}" rx="1"/>
        <circle cx="0" cy="${px(h * 0.025)}" r="${px(w * 0.03)}"/>
        <text class="three-leaf-outlet" x="${left}" y="${px(h * 0.13)}" font-size="${px(size * 0.7)}">${esc(articles[i].outlet)}</text>
        ${lines.map((line, n) => `<text x="${left}" y="${px(h * 0.26 + n * size * 1.16)}" font-size="${px(size)}">${esc(line)}</text>`).join("")}
      </g></g></g></g>`;
  };

  const arm = (i: number): string => {
    const a = home.arms[i];
    const hub = P(a.x, a.y, a.z);
    const L = P(...a.tip[0]);
    const R = P(...a.tip[1]);
    const up = a.parent < 0 ? { x: V.cx, y: V.topPx + 3 } : P(...home.arms[a.parent].tip[a.side]);
    const t = 1.5 + (2 - a.lv) * 0.75;
    const lx = (L.x + hub.x) / 2;
    const ly = (L.y + hub.y) / 2;
    const rx = (R.x + hub.x) / 2;
    const ry = (R.y + hub.y) / 2;
    const shape = [
      `M${px(L.x)} ${px(L.y)}`,
      `Q${px(lx)} ${px(ly - 0.6 * t)} ${px(hub.x)} ${px(hub.y - t)}`,
      `Q${px(rx)} ${px(ry - 0.6 * t)} ${px(R.x)} ${px(R.y)}`,
      `Q${px(rx)} ${px(ry + 0.6 * t)} ${px(hub.x)} ${px(hub.y + t)}`,
      `Q${px(lx)} ${px(ly + 0.6 * t)} ${px(L.x)} ${px(L.y)}Z`,
    ].join("");
    const below =
      i >= 3 ? leaf((i - 3) * 2) + leaf((i - 3) * 2 + 1) : arm(i * 2 + 1) + arm(i * 2 + 2);
    return `<g class="three-leaf-node" data-a="${i}"><g class="three-leaf-sway" style="--ox:${px(up.x)}px;--oy:${px(up.y)}px;--d:${period(i)};--a:${(1.3 - a.lv * 0.25).toFixed(2)}deg">
      <line class="three-leaf-thread" data-at="${i}" x1="${px(up.x)}" y1="${px(up.y)}" x2="${px(hub.x)}" y2="${px(hub.y)}"/>
      <path class="three-leaf-arm" data-arm="${i}" style="--hx:${px(hub.x)}px;--hy:${px(hub.y)}px" d="${shape}"/>
      <circle class="three-leaf-hub" data-hub="${i}" cx="${px(hub.x)}" cy="${px(hub.y)}" r="${px(t + 1)}"/>
      ${below}</g></g>`;
  };

  els.svg.setAttribute("viewBox", `0 0 ${V.W} ${V.H}`);
  els.svg.innerHTML = `<g class="three-leaf-tree" style="--gx:${px(V.cx)}px;--gy:${px(V.H / 2)}px;--grow:${(96 / Math.max(120, V.u * 8.5)).toFixed(3)}">${arm(0)}</g><g class="three-leaf-floor"></g>`;
}

const find = <T extends Element>({ els }: Lesson, query: string) =>
  els.svg.querySelector<T>(query)!;

/** The tilts, and the path in amber. */
function poseMobile(lesson: Lesson) {
  const { home, torn, tree, view } = lesson;
  for (const a of home.arms) {
    let wl = 0;
    let wr = 0;
    for (const n of a.left) wl += torn[n] ? 0 : 1;
    for (const n of a.right) wr += torn[n] ? 0 : 1;
    const phi = tiltFor(wl, wr);
    const hub = project(view, a.x, a.y, a.z);
    find<SVGElement>(lesson, `[data-arm="${a.i}"]`).style.transform = `rotate(${phi}rad)`;
    // What hangs from each tip goes where the tilt has taken that tip.
    a.tip.forEach((tip, side) => {
      const t = project(view, ...tip);
      const dx = t.x - hub.x;
      const dy = t.y - hub.y;
      const x = dx * (Math.cos(phi) - 1) - dy * Math.sin(phi);
      const y = dx * Math.sin(phi) + dy * (Math.cos(phi) - 1);
      const below =
        a.i >= 3 ? `[data-l="${(a.i - 3) * 2 + side}"]` : `[data-a="${a.i * 2 + 1 + side}"]`;
      find<SVGElement>(lesson, below).style.transform = `translate(${x}px, ${y}px)`;
    });
    const delay = reduced() ? 0 : (2 - a.lv) * 90;
    for (const part of armParts(lesson, a.i)) {
      part.style.transitionDelay = `${delay}ms`;
      part.classList.toggle("three-leaf-lit", !!tree?.dirty(a.i));
    }
  }
}

const armParts = (lesson: Lesson, a: number) =>
  [`[data-arm="${a}"]`, `[data-hub="${a}"]`, `[data-at="${a}"]`].map((query) =>
    find<SVGElement>(lesson, query),
  );

/** A torn leaf, moved from its thread to its place on the floor. */
function dropToFloor(lesson: Lesson, i: number) {
  const { view: V, home, els } = lesson;
  const l = home.leaves[i];
  const e = project(V, l.x, l.y, l.z);
  const pad = V.pads[i];
  const q = project(V, pad.x, pad.y, pad.z);
  const page = document.createElementNS("http://www.w3.org/2000/svg", "g");
  page.setAttribute("class", "three-leaf-fallen");
  page.dataset.fallen = String(i);
  page.style.transform = `translate(${e.x + lesson.drag[0]}px, ${e.y + lesson.drag[1]}px)`;
  const paper = find(lesson, `[data-l="${i}"] .three-leaf-paper`).cloneNode(true) as SVGElement;
  paper.setAttribute("transform", "");
  page.append(paper);
  els.svg.querySelector(".three-leaf-floor")!.append(page);
  const place = () => {
    const at = `translate(${q.x}px, ${q.y - LEAF_H * q.k * 0.3}px)`;
    page.style.transform = `${at} rotate(${pad.jitter}rad) scale(1, 0.62)`;
  };
  if (reduced()) place();
  else requestAnimationFrame(() => requestAnimationFrame(place));
  find(lesson, `[data-l="${i}"]`).classList.add("three-leaf-gone");
}

function refit(lesson: Lesson) {
  lesson.view = layout(lesson);
  lesson.els.svg.setAttribute("data-grown", "");
  drawMobile(lesson);
  lesson.torn.forEach((gone, i) => {
    if (gone) dropToFloor(lesson, i);
  });
  poseMobile(lesson);
}

/* ---------- the lesson, whichever is drawing it ---------- */

const alive = ({ dialog }: Lesson) => dialog.isConnected;

export function later(lesson: Lesson, ms: number, then: () => void) {
  const timer = window.setTimeout(() => {
    lesson.timers.delete(timer);
    if (alive(lesson)) then();
  }, ms);
  lesson.timers.add(timer);
}

export async function leafGone(lesson: Lesson, i: number) {
  if (lesson.torn[i] || !lesson.tree) return;
  lesson.torn[i] = true;
  const path = await lesson.tree.set(i, false);
  if (alive(lesson)) afterHash(lesson, i, path, true);
}

export async function leafBack(lesson: Lesson, i: number) {
  if (!lesson.torn[i] || !lesson.tree) return;
  lesson.torn[i] = false;
  const path = await lesson.tree.set(i, true);
  if (alive(lesson)) afterHash(lesson, i, path, false);
}

function afterHash(lesson: Lesson, i: number, path: number[], gone: boolean) {
  const { piece, tree, articles, els } = lesson;
  const still = reduced();
  const reach = still ? 0 : piece ? 620 : 240;
  if (piece) {
    piece.pulse(i, path, reach / 1000);
  } else {
    if (gone) {
      dropToFloor(lesson, i);
    } else {
      els.svg.querySelector(`[data-fallen="${i}"]`)?.remove();
      find(lesson, `[data-l="${i}"]`).classList.remove("three-leaf-gone");
    }
    poseMobile(lesson);
  }
  chips(lesson, path, reach);
  const root = tree!.root();
  const matches = tree!.matches();
  later(lesson, reach, () => {
    rollHash(lesson, root, !matches);
    setState(lesson, matches ? "back" : "changed");
    if (!gone) buzz(8);
  });
  const { title } = articles[i];
  const said = matches ? "matches the original" : "changed";
  els.live.textContent = `${gone ? "Removed" : "Hung back"}: ${title}. Root hash ${said}, now starts ${root.slice(0, 8)}.`;
  const button = lesson.dialog.querySelector(`[data-tear="${i}"]`)!;
  button.textContent = gone ? "Hang back" : "Tear off";
  button.setAttribute("aria-label", `${gone ? "Hang back" : "Tear off"}: ${title}`);
  if (gone) {
    if (!piece) showCard(lesson, i);
  } else if (lesson.card === i || matches) {
    showHint(lesson, matches);
  }
}

function chips(lesson: Lesson, path: number[], reach: number) {
  const { els, tree } = lesson;
  lesson.chipPath = path;
  path.forEach((a, n) => {
    const chip = els.chips[n];
    chip.textContent = tree!.node(a).slice(0, 6);
    placeChip(lesson, n, a);
    later(lesson, (reach * (n + 1)) / 3, () => {
      chip.dataset.on = "";
    });
  });
  window.clearTimeout(lesson.chipTimer);
  lesson.chipTimer = window.setTimeout(() => {
    lesson.chipPath = null;
    els.chips.forEach((chip) => delete chip.dataset.on);
  }, reach + 2400);
}

function placeChip(lesson: Lesson, n: number, a: number) {
  const { arms } = lesson.piece?.sim ?? lesson.home;
  const { x, y, z } = arms[a];
  const p = project(lesson.view, x, y, z);
  const left = clamp(p.x + 7, 2, lesson.view.W - 50);
  lesson.els.chips[n].style.transform =
    `translate(${left.toFixed(1)}px, ${(p.y + 4).toFixed(1)}px)`;
}

/** The hashes that have just changed stay beside their arms as the arms move. */
export function placeChips(lesson: Lesson) {
  lesson.chipPath?.forEach((a, n) => placeChip(lesson, n, a));
}

function setState(lesson: Lesson, state: "home" | "back" | "changed") {
  const gone = lesson.torn.filter(Boolean).length;
  lesson.els.state.textContent =
    state === "home"
      ? "Root of eight articles, hashed on this device"
      : state === "back"
        ? "Back to the original root, digit for digit"
        : `Root changed. ${gone} of 8 gone. 3 of 7 parents rehashed`;
}

function rollHash(lesson: Lesson, next: string, dirty: boolean) {
  const { digits, hash } = lesson.els;
  const before = digits.map((d) => d.textContent);
  hash.toggleAttribute("data-dirty", dirty);
  if (reduced()) {
    digits.forEach((d, i) => {
      d.textContent = next[i];
    });
    return;
  }
  const started = performance.now();
  const mine = ++lesson.roll;
  const tick = () => {
    if (!alive(lesson) || mine !== lesson.roll) return;
    const t = performance.now() - started;
    let rolling = false;
    for (let i = 0; i < 64; i++) {
      const from = i * ROLL_DIGIT;
      if (t >= from + ROLL_FOR) {
        if (digits[i].textContent !== next[i]) digits[i].textContent = next[i];
        continue;
      }
      rolling = true;
      if (t >= from && Math.floor(t / 34) !== Math.floor((t - 17) / 34)) {
        digits[i].textContent = HEX[Math.floor(Math.random() * 16)];
      } else if (t < from && before[i] === "·") {
        digits[i].textContent = before[i];
      }
    }
    if (rolling) requestAnimationFrame(tick);
  };
  tick();
}

export function showHint(lesson: Lesson, restored = false) {
  // A card going with the focus in it would leave the arrow keys nothing to reach.
  if (lesson.els.message.contains(document.activeElement)) {
    lesson.els.all.focus({ preventScroll: true });
  }
  lesson.card = -1;
  lesson.named = -1;
  lesson.els.message.innerHTML = restored
    ? `<p class="three-leaf-hint"><b>Same leaves, same root.</b>Change one and only its path to the root moves.</p>`
    : lesson.torn.some(Boolean)
      ? `<p class="three-leaf-hint">Pull another, or tap a page on the floor.</p>`
      : `<p class="three-leaf-hint"><b>Pull a leaf until the thread snaps.</b>Swipe sideways to spin it.</p>`;
}

export function clearMessage(lesson: Lesson) {
  lesson.named = -1;
  lesson.els.message.textContent = "";
}

/** A tap or a press on a hanging leaf, in the SVG and in 3D alike. */
export function nameLeaf(lesson: Lesson, i: number) {
  const { title, outlet, date } = lesson.articles[i];
  lesson.card = -1;
  lesson.named = i;
  window.clearTimeout(lesson.nameTimer);
  lesson.els.message.innerHTML = `<p class="three-leaf-hint"><b>${esc(title)}</b>${esc(outlet)}, ${esc(date)}. Pull to tear it off.</p>`;
}

/** The finger has come off a leaf it did not tear: its name stays a moment longer. */
export function fadeName(lesson: Lesson) {
  const i = lesson.named;
  window.clearTimeout(lesson.nameTimer);
  lesson.nameTimer = window.setTimeout(() => {
    if (alive(lesson) && lesson.card === -1 && lesson.named === i) showHint(lesson);
  }, NAME_FOR);
}

export function showCard(lesson: Lesson, i: number) {
  const { title, outlet, date, href } = lesson.articles[i];
  lesson.card = i;
  lesson.named = -1;
  lesson.els.message.innerHTML = `<div class="three-leaf-card"><p>${esc(date)} · ${esc(outlet)}</p><a class="three-leaf-title" href="${esc(href)}">${esc(title)}</a>
    <div class="three-leaf-again"><button class="three-leaf-rehang" type="button" data-rehang="${i}">Hang it back</button><small>or flick it up at its hook</small></div></div>`;
}

function tearRequest(lesson: Lesson, i: number) {
  if (lesson.torn[i]) return;
  if (lesson.piece) lesson.piece.autoTear(i);
  else void leafGone(lesson, i);
}

function rehangRequest(lesson: Lesson, i: number) {
  if (!lesson.torn[i]) return;
  if (lesson.piece) lesson.piece.autoRehang(i);
  else void leafBack(lesson, i);
}

/* ---------- gestures ---------- */

function pickLeaf({ view: V, piece, torn, home }: Lesson, x: number, y: number) {
  const sim = piece?.sim;
  let best = -1;
  let bestD = 1e9;
  for (let i = 0; i < 8; i++) {
    let c;
    let down = torn[i];
    if (sim) {
      const l = sim.leaves[i];
      down = l.state !== "hung";
      if (l.state === "hung") {
        const hk = l.arm.tip[i & 1];
        const d = Math.hypot(l.x - hk[0], l.y - hk[1], l.z - hk[2]) || 1;
        const k = (LEAF_H * 0.5) / d;
        c = project(V, l.x + (l.x - hk[0]) * k, l.y + (l.y - hk[1]) * k, l.z + (l.z - hk[2]) * k);
      } else if (l.state === "rest") {
        c = project(V, l.x, l.y, l.z);
      } else {
        continue;
      }
    } else if (down) {
      const p = V.pads[i];
      c = project(V, p.x, p.y, p.z);
    } else {
      const l = home.leaves[i];
      c = project(V, l.x, l.y - LEAF_H * 0.5, l.z);
    }
    const hw = Math.max(LEAF_W * 0.5 * c.k + 8, 30);
    const hh = down ? Math.max(LEAF_H * 0.3 * c.k + 10, 34) : Math.max(LEAF_H * 0.5 * c.k + 8, 36);
    const dx = Math.abs(x - c.x) / hw;
    const dy = Math.abs(y - c.y) / hh;
    if (dx > 1 || dy > 1) continue;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

/** The path of the leaf under a finger, in amber, until it lifts. */
function lightLeaf(lesson: Lesson, i: number, on: boolean) {
  const { tree, piece } = lesson;
  if (piece) {
    piece.light(i, on);
    return;
  }
  lesson.els.svg.querySelector(`[data-lt="${i}"]`)?.classList.toggle("three-leaf-lit", on);
  lesson.els.svg.querySelector(`[data-l="${i}"]`)?.classList.toggle("three-leaf-held", on);
  for (const a of pathOf(i)) {
    for (const part of armParts(lesson, a)) {
      part.style.transitionDelay = "0ms";
      part.classList.toggle("three-leaf-lit", on || !!tree?.dirty(a));
    }
  }
}

function drawnDown(lesson: Lesson) {
  const { leaf } = lesson.press;
  if (leaf < 0) return;
  if (lesson.torn[leaf]) {
    showCard(lesson, leaf);
    return;
  }
  lightLeaf(lesson, leaf, true);
  nameLeaf(lesson, leaf);
  buzz(5);
}

/** The drawn leaf follows the finger on its stretched thread, as far as the 3D's breaks. */
function stretch(lesson: Lesson, i: number, dx: number, dy: number) {
  const { view: V, home } = lesson;
  const l = home.leaves[i];
  const t = project(V, ...l.arm.tip[i & 1]);
  const e = project(V, l.x, l.y, l.z);
  const pulled = !!(dx || dy);
  const scale = Math.hypot(e.x + dx - t.x, e.y + dy - t.y) / Math.hypot(e.x - t.x, e.y - t.y);
  const turn = Math.atan2(e.y + dy - t.y, e.x + dx - t.x) - Math.atan2(e.y - t.y, e.x - t.x);
  lesson.drag = [dx, dy];
  find(lesson, `[data-l="${i}"]`).classList.toggle("three-leaf-pulled", pulled);
  find<SVGElement>(lesson, `[data-lt="${i}"]`).style.transform = pulled
    ? `rotate(${turn}rad) scale(${scale})`
    : "";
  find<SVGElement>(lesson, `[data-l="${i}"] .three-leaf-drag`).style.transform = pulled
    ? `translate(${dx}px, ${dy}px)`
    : "";
}

function drawnMove(lesson: Lesson) {
  const { press: p, torn, view, els } = lesson;
  const dx = p.x - p.x0;
  const dy = p.y - p.y0;
  const onLeaf = p.leaf >= 0 && !torn[p.leaf];
  if (onLeaf && !p.committed && Math.hypot(dx, dy) > 10) {
    if (Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Sideways from a leaf is a spin: a swipe should not need to find empty space.
      lightLeaf(lesson, p.leaf, false);
      showHint(lesson);
      p.leaf = -1;
    } else {
      p.committed = true;
    }
  }
  if (onLeaf && p.committed) {
    stretch(lesson, p.leaf, dx, dy);
    if (dy > 0 && Math.hypot(dx, dy) > STRETCH * view.u) {
      const leaf = p.leaf;
      lightLeaf(lesson, leaf, false);
      p.leaf = -1;
      p.committed = false;
      buzz(14);
      void leafGone(lesson, leaf).then(() => stretch(lesson, leaf, 0, 0));
    }
  } else if (p.leaf < 0) {
    const tree = els.svg.querySelector<SVGElement>(".three-leaf-tree")!;
    tree.style.transition = "none";
    tree.style.transform = `skewX(${clamp(dx * 0.05, -9, 9)}deg)`;
  }
}

function drawnUp(lesson: Lesson, cancelled: boolean) {
  const { press: p, torn, els } = lesson;
  const tree = els.svg.querySelector<SVGElement>(".three-leaf-tree")!;
  tree.style.transition = "transform calc(var(--dur-2) * 2) var(--ease)";
  tree.style.transform = "";
  if (p.leaf < 0) return;
  if (torn[p.leaf]) {
    if (!cancelled && p.y0 - p.y > FLICK_UP) void leafBack(lesson, p.leaf);
    return;
  }
  lightLeaf(lesson, p.leaf, false);
  stretch(lesson, p.leaf, 0, 0);
  fadeName(lesson);
  p.committed = false;
  if (reduced()) return;
  const sway = find(lesson, `[data-l="${p.leaf}"] .three-leaf-sway`);
  const side = p.x0 < project(lesson.view, 0, 0, 0).x ? 1 : -1;
  sway.animate(
    [0, 3.2 * side, -2 * side, 1.1 * side, 0].map((d) => ({ transform: `rotate(${d}deg)` })),
    { duration: 900, easing: "ease-out", composite: "add" },
  );
}

function wire(lesson: Lesson, signal: AbortSignal) {
  const { dialog, press: p, els } = lesson;
  const on = { signal };

  const closeList = () => {
    els.list.removeAttribute("data-open");
    els.all.setAttribute("aria-expanded", "false");
  };

  // Escape folds the list first. It reaches this before the shell, which would leave.
  dialog.addEventListener(
    "cancel",
    (event) => {
      if (event.target !== dialog || !els.list.matches("[data-open], :focus-within")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeList();
      els.all.focus({ preventScroll: true });
    },
    { capture: true, signal },
  );

  dialog.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element;
      if (target.closest(".three-leaf-all")) {
        const open = !els.list.hasAttribute("data-open");
        els.list.toggleAttribute("data-open", open);
        els.all.setAttribute("aria-expanded", String(open));
      }
      const tear = target.closest<HTMLElement>("[data-tear]");
      if (tear) {
        const i = Number(tear.dataset.tear);
        if (lesson.torn[i]) rehangRequest(lesson, i);
        else tearRequest(lesson, i);
      }
      const rehang = target.closest<HTMLElement>("[data-rehang]");
      if (rehang) rehangRequest(lesson, Number(rehang.dataset.rehang));
    },
    on,
  );

  dialog.addEventListener(
    "keydown",
    (event) => {
      if (!lesson.piece || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
      event.preventDefault();
      lesson.piece.spinBy(event.key === "ArrowRight" ? 3 : -3);
    },
    on,
  );

  const where = (event: PointerEvent) => {
    const box = dialog.getBoundingClientRect();
    p.x = event.clientX - box.left;
    p.y = event.clientY - box.top;
  };

  dialog.addEventListener(
    "pointerdown",
    (event) => {
      if ((event.target as Element).closest("button, a, .three-leaf-list") || p.id !== null) return;
      if (els.list.hasAttribute("data-open")) {
        closeList();
        return;
      }
      p.id = event.pointerId;
      try {
        dialog.setPointerCapture(event.pointerId);
      } catch {}
      where(event);
      p.x0 = p.x;
      p.y0 = p.y;
      lesson.touched = true;
      for (const l of lesson.piece?.sim.leaves ?? []) {
        if (l.grab && l.state === "hung") lesson.piece!.sim.release(l);
      }
      p.leaf = pickLeaf(lesson, p.x, p.y);
      p.mode = "press";
      p.moved = false;
      p.committed = false;
      if (lesson.piece) lesson.piece.down(event);
      else drawnDown(lesson);
    },
    on,
  );

  dialog.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerId !== p.id) return;
      where(event);
      if (Math.hypot(p.x - p.x0, p.y - p.y0) > 9) p.moved = true;
      if (lesson.piece) lesson.piece.move(event);
      else drawnMove(lesson);
    },
    on,
  );

  const up = (event: PointerEvent) => {
    if (event.pointerId !== p.id) return;
    p.id = null;
    if (lesson.piece) lesson.piece.up(event);
    else drawnUp(lesson, event.type === "pointercancel");
  };
  dialog.addEventListener("pointerup", up, on);
  dialog.addEventListener("pointercancel", up, on);
}

/* ---------- the stage ---------- */

function articlesFromPage() {
  const data = document.getElementById("loose-leaf-articles")?.textContent ?? "[]";
  return (JSON.parse(data) as string[][]).map(([title, outlet, href, date]) => ({
    title,
    outlet,
    href,
    date,
  }));
}

function open(slot: HTMLElement) {
  const dialog = slot.closest("dialog")!;
  const foot = dialog.querySelector<HTMLElement>(".three-stage-foot")!;
  const articles = articlesFromPage();
  const door = document.querySelector('a[data-three="loose-leaf"]')?.getAttribute("href");

  foot.innerHTML = `<div class="three-leaf-foot"><div class="three-leaf-message"></div><button class="three-leaf-all" type="button" aria-expanded="false" aria-controls="three-leaf-list">All eight</button></div>`;
  dialog.insertAdjacentHTML(
    "beforeend",
    `<div class="three-leaf-root">
      <p><span class="sr-only">Root hash: </span><code class="three-leaf-hash"></code></p>
      <p class="three-leaf-state"></p>
    </div>
    <div class="three-leaf-chips" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="three-leaf-sheet"><section class="three-leaf-list" id="three-leaf-list" aria-label="The eight articles">
      <ul>${articles
        .map(
          ({ title, outlet, href, date }, i) =>
            `<li><div><a href="${esc(href)}">${esc(title)}</a><span>${esc(outlet)}, ${esc(date)}</span></div><button type="button" data-tear="${i}" aria-label="Tear off: ${esc(title)}">Tear off</button></li>`,
        )
        .join("")}</ul>
      <p class="three-leaf-note">Each leaf is SHA-256 of its title. Each parent is SHA-256 of its left and right child, hashed on this device. An empty hook hashes as empty input, which is a choice for this demo and not a standard. The tilt is drawn larger than life.</p>
    </section></div>
    <p class="sr-only" aria-live="polite"></p>`,
  );
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "three-leaf-svg");
  svg.setAttribute("aria-hidden", "true");
  slot.append(svg);

  const part = <T extends Element>(name: string) => dialog.querySelector<T>(`.three-leaf-${name}`)!;
  const hash = part<HTMLElement>("hash");
  // Placeholders first, so the hash has its height before the layout is measured.
  hash.innerHTML = `<span>${"<i>·</i>".repeat(32)}</span><span>${"<i>·</i>".repeat(32)}</span>`;

  const nothing = () => {};
  const home = makeSim(nothing, nothing, nothing);
  const lesson: Lesson = {
    dialog,
    slot,
    articles,
    doorLeaf: articles.findIndex(({ href }) => href === door),
    torn: articles.map(() => false),
    tree: null,
    hashed: Promise.resolve(),
    view: null as unknown as View,
    home,
    piece: null,
    press: {
      id: null,
      x0: 0,
      y0: 0,
      x: 0,
      y: 0,
      leaf: -1,
      mode: null,
      moved: false,
      committed: false,
      ox: 0,
      oy: 0,
      Y0: 0,
      spinBase: 0,
      trail: [],
    },
    touched: false,
    card: -1,
    named: -1,
    chipPath: null,
    drag: [0, 0],
    size: "",
    roll: 0,
    timers: new Set(),
    chipTimer: 0,
    nameTimer: 0,
    els: {
      svg,
      root: part("root"),
      hash,
      digits: Array.from(hash.querySelectorAll("i")),
      state: part("state"),
      message: part("message"),
      all: part("all"),
      list: part("list"),
      live: dialog.querySelector<HTMLElement>('[aria-live="polite"]')!,
      chips: Array.from(dialog.querySelectorAll<HTMLElement>(".three-leaf-chips span")),
      foot: part("foot"),
    },
    end: () => {
      abort.abort();
      observer.disconnect();
      lesson.timers.forEach((timer) => window.clearTimeout(timer));
      lesson.timers.clear();
      window.clearTimeout(lesson.chipTimer);
      window.clearTimeout(lesson.nameTimer);
      lesson.roll++;
    },
  };

  const abort = new AbortController();
  showHint(lesson);
  setState(lesson, "home");
  lesson.view = layout(lesson);
  drawMobile(lesson);
  lesson.size = `${lesson.view.W} ${lesson.view.H}`;
  wire(lesson, abort.signal);

  // The 3D fits itself; until then, and without it, the drawing does.
  const observer = new ResizeObserver(() => {
    const size = `${slot.clientWidth} ${dialog.clientHeight}`;
    if (size === lesson.size || lesson.piece) return;
    lesson.size = size;
    refit(lesson);
  });
  observer.observe(dialog);
  dialog.addEventListener("close", lesson.end, { signal: abort.signal, once: true });

  lesson.hashed = hashTree(articles.map(({ title }) => title)).then((tree) => {
    lesson.tree = tree;
    if (alive(lesson)) rollHash(lesson, tree.root(), false);
  });
  return lesson;
}

const lessons = new WeakMap<HTMLElement, Lesson>();

function lessonFor(slot: HTMLElement) {
  let lesson = lessons.get(slot);
  if (!lesson) {
    lesson = open(slot);
    lessons.set(slot, lesson);
  }
  return lesson;
}

export function standIn(slot: HTMLElement) {
  lessonFor(slot);
}

export const start: StartStage = async (stage) => {
  const lesson = lessonFor(stage.slot);
  // A still drawing already answers everything the 3D does, and three.js stays unfetched.
  if (stage.reduced) return lesson.end;
  await lesson.hashed;
  const { mount } = await import("@/lib/loose-leaf-three");
  const stop = await mount(lesson, stage);
  return () => {
    stop();
    lesson.end();
  };
};

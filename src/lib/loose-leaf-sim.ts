/**
 * The weight behind Loose Leaf: seven arms and eight paper leaves as plain
 * numbers, stepped at a fixed rate. Each arm hangs from the tip of the arm
 * above and tilts to where its two sides balance, so losing a leaf moves its
 * path to the root and nothing else, exactly as a Merkle tree does. Arm 0 is
 * the root, 1 and 2 the next level, 3 to 6 the lowest. Once the visitor has
 * gone quiet the draft dies, the air thickens and even a wound thread lets go,
 * so the whole thing rests within seconds. It unwinds again at the next touch.
 * No DOM and no three.js: the drawings read this.
 */

export type Vec3 = [number, number, number];

/** What the page's drawing needs to turn a point in the air into a pixel, and back. */
export type View = {
  W: number;
  H: number;
  u: number;
  D: number;
  ye: number;
  f: number;
  cx: number;
  eye: number;
  rootPx: number;
  topPx: number;
  seamPx: number;
  footTop: number;
  seamY: number;
  ceil: number;
  pads: Pad[];
};

export type Pad = { x: number; y: number; z: number; jitter: number };

type Swing = {
  sx: number;
  sz: number;
  svx: number;
  svz: number;
  hxp: number;
  hzp: number;
  hvx: number;
  hvz: number;
  hax: number;
  haz: number;
  swingMax: number;
};

export type Arm = Swing & {
  i: number;
  lv: number;
  parent: number;
  side: number;
  r: number;
  Y: number;
  Yv: number;
  Ya: number;
  yh: number;
  I: number;
  k: number;
  c: number;
  phi: number;
  pv: number;
  x: number;
  y: number;
  z: number;
  xp: number;
  yp: number;
  zp: number;
  L: number;
  tip: [Vec3, Vec3];
  left: number[];
  right: number[];
  /** How far amber has run up each half, and up the thread above. */
  lit: [number, number];
  litT: number;
  om: number;
  zeta: number;
};

export type Leaf = Swing & {
  i: number;
  arm: Arm;
  state: "hung" | "fall" | "rest" | "held" | "fly";
  x: number;
  y: number;
  z: number;
  xp: number;
  yp: number;
  zp: number;
  L: number;
  Ls: number;
  Lv: number;
  Lk: number;
  Lc: number;
  Y: number;
  Yv: number;
  yh: number;
  I: number;
  k: number;
  c: number;
  w: [number, number, number];
  wAt: [number, number, number];
  tension: number;
  grab: { x: number; y: number; z: number } | null;
  wave: number;
  stub: number;
  stubV: number;
  lit: number;
  ext: number;
  hyp: number;
  hvy: number;
  vx: number;
  vy: number;
  vz: number;
  ta: number;
  tb: number;
  tav: number;
  tbv: number;
  flyT: number;
  seed: number;
  curl: number;
};

export type Sim = ReturnType<typeof makeSim>;

const G = 14;
export const LEAF_W = 1.5;
export const LEAF_H = 2;
export const WALL_Z = -3.5;
export const SLOPE = 0.72;
export const BOW = 0.13;
const ARMS = [
  { yaw: -5, r: 2.02, y: 0 },
  { yaw: 22, r: 1.08, y: -1.5 },
  { yaw: -24, r: 1.1, y: -2.35 },
  { yaw: -14, r: 0.54, y: -3.35 },
  { yaw: 44, r: 0.7, y: -3 },
  { yaw: 36, r: 0.62, y: -4.1 },
  { yaw: -30, r: 0.58, y: -3.85 },
];
const LEAF_Y = [-4.75, -6.85, -4.95, -6.95, -4.85, -7.05, -4.7, -6.8];
const LEAF_YAW = [-12, 9, 14, -8, -16, 11, 8, -14];
const OMEGA = [3.5, 5, 6.6];
const ZETA = [0.075, 0.085, 0.1];
const TILT_MAX = 0.7;
const THREAD_BREAK = G * 3.2;
const K_FINGER = 95;
const K1 = 34;
const K2 = 7;
const THICKEN = 6; // how much harder the arms' tilt is damped in still air

/** How far past its length a thread stretches before it goes, in world units. */
export const STRETCH = 1.07;

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rad = (d: number) => (d * Math.PI) / 180;

/**
 * Torque balance, drawn larger than life near the root: 3 against 4 would be a
 * twitch if it were literal, so the amount is exaggerated while the direction
 * and which arms move stay true.
 */
export const tiltFor = (wl: number, wr: number) => {
  const d = (wr - wl) / (wr + wl + 0.5);
  return clamp(TILT_MAX * Math.sign(d) * Math.pow(Math.abs(d), 0.72), -0.85, 0.85);
};

/** The arms from this leaf up to the root, lowest first. */
export function pathOf(leaf: number) {
  const path: number[] = [];
  for (let a = 3 + (leaf >> 1); ; a = (a - 1) >> 1) {
    path.push(a);
    if (!a) return path;
  }
}

export function project(V: View, x: number, y: number, z: number) {
  const k = V.f / (V.D - z);
  return { x: V.cx + x * k, y: V.eye - (y - V.ye) * k, k };
}

export function unproject(V: View, px: number, py: number, z: number) {
  const k = V.f / (V.D - z);
  return { x: (px - V.cx) / k, y: V.ye + (V.eye - py) / k, z };
}

const swingState = (swingMax: number): Swing => ({
  sx: 0,
  sz: 0,
  svx: 0,
  svz: 0,
  hxp: NaN,
  hzp: NaN,
  hvx: 0,
  hvz: 0,
  hax: 0,
  haz: 0,
  swingMax,
});

export function makeSim(
  onSnap: (leaf: Leaf) => void,
  onCatch: (leaf: Leaf) => void,
  onLand: (leaf: Leaf) => void,
) {
  const arms: Arm[] = ARMS.map((d, i) => {
    const lv = i === 0 ? 0 : i < 3 ? 1 : 2;
    const yaw = rad(d.yaw);
    const I = [1, 0.42, 0.18][lv];
    const om = [0, 1.05, 1.3][lv];
    return {
      ...swingState(0.7),
      i,
      lv,
      parent: i ? (i - 1) >> 1 : -1,
      side: i ? (i - 1) & 1 : 0,
      r: d.r,
      Y: yaw,
      Yv: 0,
      Ya: 0,
      yh: yaw,
      I,
      k: I * om * om,
      c: 2 * 0.2 * I * om,
      phi: 0,
      pv: 0,
      x: 0,
      y: d.y,
      z: 0,
      xp: 0,
      yp: d.y,
      zp: 0,
      L: 0,
      tip: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      left: [],
      right: [],
      lit: [0, 0],
      litT: 0,
      om: OMEGA[lv],
      zeta: ZETA[lv],
    };
  });

  const placeTips = (a: Arm) => {
    const c = Math.cos(a.phi);
    const s = Math.sin(a.phi);
    const ex = Math.cos(a.Y);
    const ez = -Math.sin(a.Y);
    const b = BOW * a.r;
    a.tip[1][0] = a.x + a.r * c * ex;
    a.tip[1][1] = a.y - a.r * s - b;
    a.tip[1][2] = a.z + a.r * c * ez;
    a.tip[0][0] = a.x - a.r * c * ex;
    a.tip[0][1] = a.y + a.r * s - b;
    a.tip[0][2] = a.z - a.r * c * ez;
  };

  for (const a of arms) {
    if (a.parent >= 0) {
      const p = arms[a.parent];
      const t = p.tip[a.side];
      a.x = a.xp = t[0];
      a.z = a.zp = t[2];
      a.L = t[1] - a.y;
      a.yh = a.Y - p.Y;
    }
    placeTips(a);
  }

  const leaves: Leaf[] = LEAF_Y.map((y, i) => {
    const arm = arms[3 + (i >> 1)];
    const t = arm.tip[i & 1];
    const Y = rad(LEAF_YAW[i]);
    return {
      ...swingState(1),
      i,
      arm,
      state: "hung",
      x: t[0],
      y,
      z: t[2],
      xp: t[0],
      yp: y,
      zp: t[2],
      L: t[1] - y,
      Ls: 0,
      Lv: 0,
      Lk: 225,
      Lc: 10,
      Y,
      Yv: 0,
      yh: Y - arm.Y,
      I: 0.05,
      k: 0.05 * 2.2 * 2.2,
      c: 2 * 0.16 * 0.05 * 2.2,
      w: [1, 1, 1],
      wAt: [0, 0, 0],
      tension: 0,
      grab: null,
      wave: 0,
      stub: 0,
      stubV: 0,
      lit: 0,
      ext: 0,
      hyp: t[1],
      hvy: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      ta: 0,
      tb: 0,
      tav: 0,
      tbv: 0,
      flyT: 0,
      seed: i * 1.7 + 0.4,
      curl: 0.1 + ((i * 37) % 10) * 0.018,
    };
  });

  const under = (n: number, out: number[]) => {
    if (n >= 3) {
      out.push((n - 3) * 2, (n - 3) * 2 + 1);
    } else {
      under(n * 2 + 1, out);
      under(n * 2 + 2, out);
    }
  };
  for (const a of arms) {
    if (a.i >= 3) {
      a.left = [(a.i - 3) * 2];
      a.right = [(a.i - 3) * 2 + 1];
    } else {
      under(a.i * 2 + 1, a.left);
      under(a.i * 2 + 2, a.right);
    }
  }

  const sim = {
    arms,
    leaves,
    t: 0,
    /** 1 in moving air, 0 once the visitor has gone quiet. */
    draft: 1,
    spinTo: null as number | null,
    ceil: 3,
    drop: { x: 0, v: 0 },
    pad: [] as Pad[],
    placeTips,
    step,
    release,
    flick,
  };
  const root = arms[0];

  function step(h: number) {
    sim.t += h;
    const t = sim.t;
    const dr = sim.draft;
    const still = 1 - dr;
    // What each level feels: a pull adds to a leaf's weight at once, a loss runs up the path.
    let total = 0;
    for (const l of leaves) {
      const now = l.state === "hung" ? 1 + 2.6 * (1 - Math.exp(-l.tension / 2.2)) : 0;
      for (let lv = 0; lv < 3; lv++) if (t >= l.wAt[lv]) l.w[lv] = now;
      total += l.w[0];
    }
    // The top thread gives a little under load, and a wound thread shortens.
    const D = sim.drop;
    const twist = root.Y - root.yh;
    D.v += (-30 * (D.x - 0.05 * (total - 8)) - 1.9 * D.v) * h;
    D.x += D.v * h;
    const hook0 = sim.ceil - D.x + Math.min(0.32, 0.012 * twist * twist);

    for (const a of arms) a.Ya = 0;
    // Each arm is on a torsion spring to the one above, so a spin runs down the levels late.
    for (let i = 6; i >= 1; i--) {
      const a = arms[i];
      const p = arms[a.parent];
      const tq = -a.k * dr * (a.Y - p.Y - a.yh) - a.c * (a.Yv - p.Yv);
      a.Ya += tq / a.I;
      p.Ya -= tq / p.I;
    }
    if (sim.spinTo !== null) {
      root.Ya += 260 * (sim.spinTo - root.Y) - 32 * root.Yv;
    } else {
      root.Ya +=
        -0.5 * dr * twist -
        0.8 * root.Yv -
        0.05 * root.Yv * Math.abs(root.Yv) +
        dr * (0.09 * Math.sin(t * 0.63) + 0.05 * Math.sin(t * 1.17 + 1));
      if (leaves.some((l) => l.grab)) root.Ya -= 1.6 * root.Yv;
    }
    for (const a of arms) {
      if (a.i) a.Ya -= (0.012 * a.Yv * Math.abs(a.Yv)) / a.I + (0.01 * a.Yv) / a.I;
      a.Yv += a.Ya * h;
      a.Y += a.Yv * h;
      a.Yv *= 1 - 0.02 * still; // the last of it dies in still air, so the loop can stop
    }

    for (const a of arms) {
      // Tilt: a spring to the angle its two sides balance at.
      let wl = 0;
      let wr = 0;
      for (const n of a.left) wl += leaves[n].w[a.lv];
      for (const n of a.right) wr += leaves[n].w[a.lv];
      const damp = 2 * a.zeta * (1 + THICKEN * still) * a.om;
      a.pv += (-a.om * a.om * (a.phi - tiltFor(wl, wr)) - damp * a.pv) * h;
      a.phi += a.pv * h;
      // The hub hangs from the tip above it. Swing is a damped pendulum measured from
      // that tip, driven by how the tip accelerates, so a chain of them can never run away.
      const hk = a.parent < 0 ? null : arms[a.parent].tip[a.side];
      const hx = hk ? hk[0] : 0;
      const hy = hk ? hk[1] : hook0;
      const hz = hk ? hk[2] : 0;
      const L = hk ? a.L : sim.ceil;
      swing(a, hx, hz, h, dr * 0.03, t + a.i * 2.1, a.lv ? 0.4 : 0, hk ? G / a.L : 1.6);
      a.xp = a.x;
      a.yp = a.y;
      a.zp = a.z;
      a.x = hx + a.sx;
      a.z = hz + a.sz;
      a.y = hy - Math.sqrt(Math.max(0.01, L * L - a.sx * a.sx - a.sz * a.sz));
      placeTips(a);
    }

    for (const l of leaves) stepLeaf(l, h, t, dr);
  }

  function swing(
    o: Swing,
    hx: number,
    hz: number,
    h: number,
    push: number,
    phase: number,
    alpha: number,
    w2: number,
  ) {
    if (Number.isNaN(o.hxp)) {
      o.hxp = hx;
      o.hzp = hz;
    }
    const vx = (hx - o.hxp) / h;
    const vz = (hz - o.hzp) / h;
    o.hxp = hx;
    o.hzp = hz;
    o.hax += ((vx - o.hvx) / h - o.hax) * 0.16;
    o.haz += ((vz - o.hvz) / h - o.haz) * 0.16;
    o.hvx = vx;
    o.hvz = vz;
    const w = Math.sqrt(w2);
    const c = 2 * lerp(0.9, 0.075, sim.draft) * w;
    o.svx += (-w2 * o.sx - c * o.svx - alpha * o.hax + push * w2 * Math.sin(phase * 0.9)) * h;
    o.svz += (-w2 * o.sz - c * o.svz - alpha * o.haz + push * w2 * Math.cos(phase * 0.71)) * h;
    o.sx += o.svx * h;
    o.sz += o.svz * h;
    const m = Math.hypot(o.sx, o.sz);
    if (m > o.swingMax) {
      o.sx *= o.swingMax / m;
      o.sz *= o.swingMax / m;
    }
  }

  function stepLeaf(l: Leaf, h: number, t: number, dr: number) {
    const hk = l.arm.tip[l.i & 1];
    l.wave *= Math.exp(-h * 3.2);
    if (l.state !== "hung") {
      // The stub left on the hook whips back.
      l.stubV += (-180 * (l.stub - 0.42) - 15 * l.stubV) * h;
      l.stub += l.stubV * h;
    }
    if (l.state === "hung") {
      const tq = -l.k * dr * (l.Y - l.arm.Y - l.yh) - l.c * (l.Yv - l.arm.Yv);
      l.Yv += (tq / l.I) * h - 0.4 * l.Yv * h;
      l.Y += l.Yv * h;
      l.Yv *= 1 - 0.02 * (1 - dr);
      if (l.grab) {
        const dx = l.x - hk[0];
        const dy = l.y - hk[1];
        const dz = l.z - hk[2];
        const d = Math.hypot(dx, dy, dz) || 1;
        let ax = K_FINGER * (l.grab.x - l.x);
        let ay = K_FINGER * (l.grab.y - l.y) - G;
        let az = K_FINGER * (l.grab.z - l.z);
        const ext = d - l.L;
        let T = 0;
        if (ext > 0) {
          T = K1 * ext + K2 * ext * ext * ext;
          ax -= (T * dx) / d;
          ay -= (T * dy) / d;
          az -= (T * dz) / d;
        }
        l.tension = T / G;
        l.ext = ext;
        if (T > THREAD_BREAK) return snap(l, dx / d, dy / d, dz / d);
        const damp = 0.978;
        const vx = (l.x - l.xp) * damp;
        const vy = (l.y - l.yp) * damp;
        const vz = (l.z - l.zp) * damp;
        l.xp = l.x;
        l.yp = l.y;
        l.zp = l.z;
        l.x += vx + ax * h * h;
        l.y += vy + ay * h * h;
        l.z += vz + az * h * h;
        l.hxp = hk[0];
        l.hzp = hk[2];
        l.hyp = hk[1];
        l.hvx = l.hvz = l.hvy = 0;
        l.hax = l.haz = 0;
        return;
      }
      // Free of the finger: the same pendulum, and the thread's length rings like a spring.
      const vy = (hk[1] - l.hyp) / h;
      l.hyp = hk[1];
      l.hvy += (vy - l.hvy) * 0.3;
      swing(l, hk[0], hk[2], h, dr * 0.018, t * 1.4 + l.seed, 0.5, G / Math.max(0.6, l.L));
      l.Lv += (-l.Lk * l.Ls - l.Lc * l.Lv) * h;
      l.Ls += l.Lv * h;
      l.tension = l.Ls > 0 ? l.Ls * 1.6 : 0;
      const L = Math.max(0.12, l.L + l.Ls);
      const m = Math.hypot(l.sx, l.sz);
      const k = m > L * 0.9 ? (L * 0.9) / m : 1;
      l.xp = l.x;
      l.yp = l.y;
      l.zp = l.z;
      l.x = hk[0] + l.sx * k;
      l.z = hk[2] + l.sz * k;
      l.y = hk[1] - Math.sqrt(Math.max(0.002, L * L - (l.sx * l.sx + l.sz * l.sz) * k * k));
      return;
    }
    if (l.state === "fall") return flutter(l, h, t);
    if (l.state === "rest") {
      const p = sim.pad[l.i];
      const k = 1 - Math.exp(-h * 9);
      l.x = lerp(l.x, p.x, k);
      l.z = lerp(l.z, p.z, k);
      l.y = lerp(l.y, p.y, k);
      return;
    }
    if (l.state === "held") {
      const K = 1 - Math.exp(-h * 26);
      const ox = l.x;
      const oy = l.y;
      l.x = lerp(l.x, l.grab!.x, K);
      l.y = lerp(l.y, l.grab!.y, K);
      l.z = lerp(l.z, l.grab!.z, K);
      l.vx = lerp(l.vx, (l.x - ox) / h, 0.25);
      l.vy = lerp(l.vy, (l.y - oy) / h, 0.25);
      return;
    }
    const g = G * 0.92;
    l.vy -= g * h;
    l.flyT += h;
    const dx = hk[0] - l.x;
    const dy = hk[1] - l.y;
    const dz = hk[2] - l.z;
    const d = Math.hypot(dx, dy, dz);
    // The throw stays its own for a moment, then the line bends to the hook, wherever the
    // mobile has turned it.
    if (l.vy > 0 || dy < 0) {
      // Time left is the climb still to go at this speed, not the time to the top of the arc.
      const T = dy > 0 ? clamp(dy / Math.max(l.vy, 1), 0.08, Math.max(0.08, l.vy / g)) : 0.08;
      const k = 1 - Math.exp(-h * (3 + 26 * clamp(l.flyT / 0.28, 0, 1)));
      l.vx += (dx / T - l.vx) * k;
      l.vz += (dz / T - l.vz) * k;
      const need = Math.sqrt(2 * g * Math.max(0, dy));
      if (l.vy > 0 && l.vy < need) l.vy += (need - l.vy) * k;
    }
    if (d < 3.2) {
      const k = 16 * (1 - d / 3.2);
      l.vx += dx * k * h;
      l.vy += (dy * k + G * 0.5) * h;
      l.vz += dz * k * h;
    }
    l.x += l.vx * h;
    l.y += l.vy * h;
    l.z += l.vz * h;
    if (d < 0.62) return catchLeaf(l, hk);
    if (l.vy < -1.5 && d > 1.2) {
      l.state = "fall";
      l.tb = 0.8;
      l.ta = 0.2;
      l.tav = l.tbv = 0;
    }
  }

  function snap(l: Leaf, ux: number, uy: number, uz: number) {
    // The page pops free of the finger, back up the way the thread was pulling it.
    const side = l.i & 1 ? 1 : -1;
    l.vx = -ux * 5 + side * 0.8;
    l.vy = 8.4;
    l.vz = 0.6;
    // From the eyelet to the middle of the page, the point the flutter tracks.
    l.x += ux * LEAF_H * 0.5;
    l.y += uy * LEAF_H * 0.5;
    l.z += uz * LEAF_H * 0.5;
    l.state = "fall";
    l.grab = null;
    l.tension = 0;
    l.Ls = 0;
    l.Lv = 0;
    l.stub = Math.max(0.6, Math.hypot(ux, uy, uz) * l.L * 0.7);
    l.stubV = 0;
    l.wave = 1;
    l.ta = side * 0.35;
    l.tb = 1.22;
    l.tav = 0;
    l.tbv = 0;
    l.Yv = side * 1.1;
    l.wAt = [sim.t + 0.24, sim.t + 0.12, sim.t];
    onSnap(l);
  }

  /**
   * A flat page is pushed along its own plane when it tilts, and a glide pitches
   * it back the other way: lift, drag and side-slip, which is why paper rocks on
   * the way down instead of dropping.
   */
  function flutter(l: Leaf, h: number, t: number) {
    const sa = Math.sin(l.ta);
    const ca = Math.cos(l.ta);
    const sb = Math.sin(l.tb);
    const cb = Math.cos(l.tb);
    const nx = sa * cb;
    const ny = ca * cb;
    const nz = sb;
    const vn = l.vx * nx + l.vy * ny + l.vz * nz;
    const Ct = 0.5;
    const fn = -3.8 * vn * Math.abs(vn);
    const p = sim.pad[l.i];
    const near = clamp(1 - (l.y - p.y) / 6, 0, 1);
    const ax = fn * nx - Ct * (l.vx - vn * nx) + (p.x - l.x) * 1.4 * near;
    const ay = fn * ny - Ct * (l.vy - vn * ny) - G;
    const az = fn * nz - Ct * (l.vz - vn * nz) + (p.z - l.z) * 1.4 * near;
    l.vx += ax * h;
    l.vy += ay * h;
    l.vz += az * h;
    l.x += l.vx * h;
    l.y += l.vy * h;
    l.z += l.vz * h;
    const K = 9;
    const C = 1.5;
    const Ks = 1.1;
    const F = 8 * (1 - near * 0.7);
    l.tav += (-K * l.ta - C * l.tav - Ks * l.vx + F * Math.sin(t * 3.3 + l.seed)) * h;
    l.tbv += (-K * l.tb - C * l.tbv - Ks * l.vz + F * Math.cos(t * 2.7 + l.seed)) * h;
    l.ta = clamp(l.ta + l.tav * h, -1.1, 1.1);
    l.tb = clamp(l.tb + l.tbv * h, -1.1, 1.25);
    l.Yv *= Math.exp(-h * 0.4);
    l.Y += l.Yv * h;
    if (l.y <= p.y + 0.22 && l.vy < 0) {
      l.state = "rest";
      onLand(l);
    }
    if (l.z > 3) {
      l.z = 3;
      l.vz = -0.2;
    }
  }

  function catchLeaf(l: Leaf, hk: Vec3) {
    l.state = "hung";
    l.x = l.xp = hk[0];
    l.y = l.yp = hk[1] - 0.2;
    l.z = l.zp = hk[2];
    l.tension = 0;
    l.Y = l.arm.Y + l.yh;
    l.Yv = 0;
    l.wave = 0.8;
    // It catches on a short thread and pays out to its length with a bounce.
    l.Ls = 0.2 - l.L;
    l.Lv = 0;
    l.Lk = 81;
    l.Lc = 4;
    l.sx = l.sz = l.svx = l.svz = 0;
    l.hxp = hk[0];
    l.hzp = hk[2];
    l.hyp = hk[1];
    l.hvx = l.hvz = l.hvy = 0;
    l.hax = l.haz = 0;
    l.wAt = [sim.t + 0.46, sim.t + 0.34, sim.t + 0.22];
    onCatch(l);
  }

  function release(l: Leaf) {
    const hk = l.arm.tip[l.i & 1];
    const k = 120 * 0.5;
    l.grab = null;
    l.sx = l.x - hk[0];
    l.sz = l.z - hk[2];
    const lim = Math.max(0.3, l.L * 0.9);
    const m = Math.hypot(l.sx, l.sz);
    if (m > lim) {
      l.sx *= lim / m;
      l.sz *= lim / m;
    }
    l.svx = (l.x - l.xp) * k;
    l.svz = (l.z - l.zp) * k;
    l.Ls = clamp(l.ext || 0, 0.1 - l.L, 2);
    l.Lv = (l.y - l.yp) * -30;
    l.Lk = 225;
    l.Lc = 10;
    l.ext = 0;
  }

  /** The throw that just reaches the hook at the top of its arc. */
  function flick(l: Leaf) {
    const hk = l.arm.tip[l.i & 1];
    const dy = Math.max(0.5, hk[1] - l.y);
    const g = G * 0.92;
    const vy = Math.sqrt(2 * g * dy) * 1.02;
    const T = vy / g;
    return { vx: (hk[0] - l.x) / T, vy, vz: (hk[2] - l.z) / T };
  }

  return sim;
}

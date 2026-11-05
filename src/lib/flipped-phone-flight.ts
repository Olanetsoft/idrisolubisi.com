/**
 * How the flipped phone flies: a rigid slab, as a quaternion and a body-frame
 * spin, with Euler's equations and the slab's real principal moments, and
 * eight corners against the floor. No library, and no three.js, so the stand-in
 * can size itself from here without it. The assist is quiet: the flight stays
 * pure physics, the same integrator runs forward on launches a few percent
 * either side of the flick, and the phone leaves with the nearest one that
 * lands well. Nothing pushes it in the air. Body frame: x across the phone, y
 * along it, z out of the screen.
 */

export const SLAB = { w: 0.75, h: 1.6, t: 0.09, r: 0.115 };
/** The camera at rest, and the same pose for the stand-in: 90 - pitch is its CSS tilt. */
export const VIEW = { fov: 30, pitch: 64 };
/** One physics step, in s. */
export const DT = 1 / 240;
/** The height of the slab's centre when it lies flat. */
export const CZ = SLAB.t / 2;

const G = 15;
const IX = (SLAB.h ** 2 + SLAB.t ** 2) / 12;
const IY = (SLAB.w ** 2 + SLAB.t ** 2) / 12;
const IZ = (SLAB.w ** 2 + SLAB.h ** 2) / 12;
const CX = SLAB.w / 2 - 0.29 * SLAB.r;
const CY = SLAB.h / 2 - 0.29 * SLAB.r;
const CORNERS: number[][] = [];
for (const x of [-CX, CX])
  for (const y of [-CY, CY]) for (const z of [-CZ, CZ]) CORNERS.push([x, y, z]);
const FLAT = Math.SQRT1_2;
/** Bounce above a cut speed, friction, and what contact costs per second. */
const K = { eHi: 0.42, eCut: 0.55, mu: 0.36, spinLoss: 1.5, slideLoss: 0.6 };
const TWISTS = [0.016, 0.024, 0.034, 0.048, 0.066];

export type Body = {
  px: number;
  py: number;
  pz: number;
  vx: number;
  vy: number;
  vz: number;
  qx: number;
  qy: number;
  qz: number;
  qw: number;
  wx: number;
  wy: number;
  wz: number;
  t: number;
  calm: number;
  ghost: number;
  asleep: boolean;
  hit: number;
  peak: number;
  peakT: number;
  impact: number;
  meet: number;
  yawRest: number;
  upRest: number;
};

/** Everything a flick decides. */
type Launch = {
  rx: number;
  rz: number;
  vx: number;
  vy: number;
  vz: number;
  spin: number;
  wy: number;
  wz: number;
};

/** What a launch will do, from running it forward. */
type Forecast = {
  up: boolean | null;
  t: number;
  x: number;
  z: number;
  yaw: number;
  twist: number;
  hit: number;
  meet: number;
};

export type Plan = { launch: Launch; forecast: Forecast };

export type Flick = {
  power: number;
  dx: number;
  right?: readonly [number, number];
  fwd?: readonly [number, number];
};

/** The camera's distance and the stand-in's scale, for a stage of this size. */
export function fit(width: number, height: number) {
  const tan = Math.tan((VIEW.fov * Math.PI) / 360);
  const seen = Math.max(
    (SLAB.h * Math.sin((VIEW.pitch * Math.PI) / 180)) / 0.54,
    SLAB.w / 0.62 / (width / height),
  );
  const distance = seen / (2 * tan);
  const perspective = height / 2 / tan;
  return { distance, perspective, scale: perspective / distance };
}

export function restState(): Body {
  const body: Body = {
    px: 0,
    py: CZ,
    pz: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    qx: 0,
    qy: 0,
    qz: 0,
    qw: 1,
    wx: 0,
    wy: 0,
    wz: 0,
    t: 0,
    calm: 0,
    ghost: 0,
    asleep: false,
    hit: 0,
    peak: 0,
    peakT: 0,
    impact: 0,
    meet: 0,
    yawRest: 0,
    upRest: 1,
  };
  setFlat(body, 0, 1);
  return body;
}

/** Lying flat: the screen normal along world +y or -y, turned by yaw about the vertical. */
function setFlat(s: Body, yaw: number, up: number) {
  const c = Math.cos(yaw / 2);
  const n = Math.sin(yaw / 2);
  // A quarter turn about x (screen up), or a further half turn about y (screen down).
  const [bx, by, bz, bw] = up < 0 ? [0, FLAT, -FLAT, 0] : [-FLAT, 0, 0, FLAT];
  s.qw = c * bw - n * by;
  s.qx = c * bx + n * bz;
  s.qy = c * by + n * bw;
  s.qz = c * bz - n * bx;
}

/** Body to world, into `o`. */
export function rot(s: Body, x: number, y: number, z: number, o: number[]) {
  const { qx, qy, qz, qw } = s;
  const tx = 2 * (qy * z - qz * y);
  const ty = 2 * (qz * x - qx * z);
  const tz = 2 * (qx * y - qy * x);
  o[0] = x + qw * tx + qy * tz - qz * ty;
  o[1] = y + qw * ty + qz * tx - qx * tz;
  o[2] = z + qw * tz + qx * ty - qy * tx;
}

/** World to body, into `o`. */
function unrot(s: Body, x: number, y: number, z: number, o: number[]) {
  const { qw } = s;
  const qx = -s.qx;
  const qy = -s.qy;
  const qz = -s.qz;
  const tx = 2 * (qy * z - qz * y);
  const ty = 2 * (qz * x - qx * z);
  const tz = 2 * (qx * y - qy * x);
  o[0] = x + qw * tx + qy * tz - qz * ty;
  o[1] = y + qw * ty + qz * tx - qx * tz;
  o[2] = z + qw * tz + qx * ty - qy * tx;
}

const va = [0, 0, 0];
const vb = [0, 0, 0];
const vc = [0, 0, 0];

/** Moves the body on by one DT. */
export function step(s: Body) {
  if (s.asleep) return;
  const dt = DT;
  s.t += dt;
  s.vy -= G * dt;
  s.px += s.vx * dt;
  s.py += s.vy * dt;
  s.pz += s.vz * dt;
  // Euler's equations, midpoint: this term is what twists the phone in the air.
  const a1 = (IY - IZ) / IX;
  const a2 = (IZ - IX) / IY;
  const a3 = (IX - IY) / IZ;
  let { wx, wy, wz } = s;
  const hx = wx + 0.5 * dt * a1 * wy * wz;
  const hy = wy + 0.5 * dt * a2 * wz * wx;
  const hz = wz + 0.5 * dt * a3 * wx * wy;
  wx += dt * a1 * hy * hz;
  wy += dt * a2 * hz * hx;
  wz += dt * a3 * hx * hy;
  s.wx = wx;
  s.wy = wy;
  s.wz = wz;
  if (s.hit === 0 && Math.abs(wy) > s.peak) {
    s.peak = Math.abs(wy);
    s.peakT = s.t;
  }
  const { qx, qy, qz, qw } = s;
  const h = 0.5 * dt;
  const nx = qx + h * (qw * wx + qy * wz - qz * wy);
  const ny = qy + h * (qw * wy + qz * wx - qx * wz);
  const nz = qz + h * (qw * wz + qx * wy - qy * wx);
  const nw = qw + h * (-qx * wx - qy * wy - qz * wz);
  const il = 1 / Math.hypot(nx, ny, nz, nw);
  s.qx = nx * il;
  s.qy = ny * il;
  s.qz = nz * il;
  s.qw = nw * il;
  // The floor, not while it leaves the hand.
  if (s.t < s.ghost) return;
  let deep = 0;
  unrot(s, 0, 1, 0, va);
  const [nbx, nby, nbz] = va;
  for (const c of CORNERS) {
    rot(s, c[0], c[1], c[2], vb);
    const y = s.py + vb[1];
    if (y >= 0) continue;
    if (y < deep) deep = y;
    const [rx, ry, rz] = vb;
    rot(s, s.wx, s.wy, s.wz, vc);
    const ux = s.vx + vc[1] * rz - vc[2] * ry;
    const uy = s.vy + vc[2] * rx - vc[0] * rz;
    const uz = s.vz + vc[0] * ry - vc[1] * rx;
    if (uy >= 0) continue;
    if (-uy > s.impact && s.hit === 0) s.impact = -uy;
    if (s.hit === 0) {
      s.hit = s.t;
      rot(s, 0, 0, 1, va);
      s.meet = Math.abs(va[1]);
    }
    const cnx = c[1] * nbz - c[2] * nby;
    const cny = c[2] * nbx - c[0] * nbz;
    const cnz = c[0] * nby - c[1] * nbx;
    const ix = cnx / IX;
    const iy = cny / IY;
    const iz = cnz / IZ;
    const k = 1 + cnx * ix + cny * iy + cnz * iz;
    const e = -uy > K.eCut ? K.eHi * Math.min(1, (-uy - K.eCut) / 2.2 + 0.35) : 0;
    const j = (-(1 + e) * uy) / k;
    s.vy += j;
    s.wx += ix * j;
    s.wy += iy * j;
    s.wz += iz * j;
    // Coulomb friction along the slip.
    const sp = Math.hypot(ux, uz);
    if (sp > 1e-4) {
      const tx = -ux / sp;
      const tz = -uz / sp;
      unrot(s, tx, 0, tz, va);
      const [tbx, tby, tbz] = va;
      const ctx = c[1] * tbz - c[2] * tby;
      const cty = c[2] * tbx - c[0] * tbz;
      const ctz = c[0] * tby - c[1] * tbx;
      const jx = ctx / IX;
      const jy = cty / IY;
      const jz = ctz / IZ;
      const kt = 1 + ctx * jx + cty * jy + ctz * jz;
      const jt = Math.min(sp / kt, K.mu * j);
      s.vx += tx * jt;
      s.vz += tz * jt;
      s.wx += jx * jt;
      s.wy += jy * jt;
      s.wz += jz * jt;
    }
  }
  if (deep < 0) {
    s.py -= deep;
    const d = 1 - K.spinLoss * dt;
    const f = 1 - K.slideLoss * dt;
    s.wx *= d;
    s.wy *= d;
    s.wz *= d;
    s.vx *= f;
    s.vz *= f;
  }
  // Ring-down: once nearly flat and nearly still, ease to exactly flat and stop.
  rot(s, 0, 0, 1, va);
  const face = va[1];
  const energy =
    0.5 * (s.vx ** 2 + s.vy ** 2 + s.vz ** 2) +
    0.5 * (IX * s.wx ** 2 + IY * s.wy ** 2 + IZ * s.wz ** 2);
  if (Math.abs(face) > 0.9975 && energy < 0.035 && s.py < CZ + 0.02) {
    s.calm++;
    // Keep the heading it came to rest on, and let the last degree go.
    const up = face > 0 ? 1 : -1;
    rot(s, 0, 1, 0, va);
    const yaw = Math.atan2(-va[0], -va[2]);
    const { qx: x, qy: y, qz: z, qw: w } = s;
    setFlat(s, yaw, up);
    if (s.calm > 16) {
      s.yawRest = yaw;
      s.upRest = up;
      s.vx = s.vy = s.vz = s.wx = s.wy = s.wz = 0;
      s.py = CZ;
      s.asleep = true;
      return;
    }
    const b = 0.14 * (x * s.qx + y * s.qy + z * s.qz + w * s.qw < 0 ? -1 : 1);
    const lx = x * 0.86 + s.qx * b;
    const ly = y * 0.86 + s.qy * b;
    const lz = z * 0.86 + s.qz * b;
    const lw = w * 0.86 + s.qw * b;
    const scale = 1 / Math.hypot(lx, ly, lz, lw);
    s.qx = lx * scale;
    s.qy = ly * scale;
    s.qz = lz * scale;
    s.qw = lw * scale;
  } else s.calm = 0;
}

export function launch(s: Body, l: Launch) {
  s.asleep = false;
  s.calm = 0;
  s.t = 0;
  s.hit = 0;
  s.peak = 0;
  s.peakT = 0;
  s.impact = 0;
  s.ghost = 0.1;
  s.vx = l.vx;
  s.vy = l.vy;
  s.vz = l.vz;
  // End over end: the near end comes up, whichever way the phone is lying.
  rot(s, 1, 0, 0, va);
  s.wx = (va[0] * l.rx + va[2] * l.rz >= 0 ? -1 : 1) * l.spin;
  s.wy = l.wy;
  s.wz = l.wz;
}

function forecast(start: Body, l: Launch, seconds = 5): Forecast {
  const s = { ...start };
  launch(s, l);
  const steps = Math.round(seconds / DT);
  for (let i = 0; i < steps && !s.asleep; i++) step(s);
  return {
    up: s.asleep ? s.upRest > 0 : null,
    t: s.t,
    x: s.px,
    z: s.pz,
    yaw: s.yawRest,
    twist: s.peakT,
    hit: s.hit,
    meet: s.meet,
  };
}

/**
 * The nearest launch to `flick` that lands well, face up if `want` is true.
 * Runs for at most about `budget` ms once it has one to give.
 */
export function plan(start: Body, flick: Flick, want: boolean | null, budget = 24) {
  const rise = 2.7 + 1.5 * flick.power;
  const spin0 = 8.6 + 3.2 * flick.power;
  const vy0 = Math.sqrt(2 * G * rise);
  const [rx, rz] = flick.right ?? [1, 0];
  const [fx, fz] = flick.fwd ?? [0, -1];
  const vx = rx * flick.dx * 0.9 + fx * 0.12 - start.px * 0.45;
  const vz = rz * flick.dx * 0.9 + fz * 0.12 - start.pz * 0.45;
  const apex = vy0 / G;
  const began = performance.now();
  let best: Plan | null = null;
  let bestCost = Infinity;
  outer: for (let round = 0; round < 3; round++) {
    const scale = 1 + round * 0.8;
    for (const twist of TWISTS) {
      for (const sy of [1, -1])
        for (const dz of [0.5, -0.5])
          for (const ds of [0, 0.035, -0.035]) {
            const spin = spin0 * (1 + ds * scale);
            const l: Launch = {
              rx,
              rz,
              vx,
              vy: vy0 * (1 + (round ? 0.02 * round * sy : 0)),
              vz,
              spin,
              wy: twist * spin * sy,
              wz: twist * spin * dz,
            };
            const f = forecast(start, l);
            if (f.up === null || (want !== null && f.up !== want)) continue;
            const yaw = Math.abs(f.yaw);
            const turn = f.up ? yaw : Math.min(yaw, Math.PI - yaw);
            const cost =
              1.6 * Math.abs(f.twist - apex) +
              0.9 * Math.hypot(f.x, f.z) +
              1.2 * turn +
              2.2 * Math.max(0, f.t - f.hit - 1.3) +
              0.9 * round +
              (f.meet > 0.86 ? 1.5 * (f.meet - 0.86) + 0.3 : 0);
            if (cost < bestCost) {
              bestCost = cost;
              best = { launch: l, forecast: f };
            }
            if (bestCost < 0.45) break outer;
          }
      if (best && performance.now() - began > budget) break outer;
    }
  }
  return best;
}

/**
 * The footer flower's pull. Drag it upward and it grows out of the copyright
 * line on a springy stem, larger the further it goes, with the page dimming
 * behind it. Let go and it whips over, wobbles and lands, and it can be caught
 * on the way. A tap still turns it by one petal. Raw canvas 2D, no library.
 * Bloom.tsx imports this once the flower is in view, and never for
 * reduced-motion users.
 *
 * The SVG is the flower at rest. A full-screen canvas replaces it for as long
 * as the flower is in play, then leaves the page and gives its memory back.
 */

import { markPlayed } from "@/lib/played";

const { abs, atan2, cos, exp, floor, hypot, max, min, pow, random, round, sin, sqrt } = Math;

const TAU = Math.PI * 2;
const PETAL = TAU / 5;
/** The physics step in seconds, the same at any frame rate. */
const STEP = 1 / 240;
/** The flower's size at rest, and how much it can grow, in px. */
const REST = 18;
const SPAN = 152;
/** The head's radius as a share of its size. */
const RAD = 0.433;
/** How far below the head's centre the stem is rooted, in px. */
const ROOT = 7;
const MOTES = 7;
/** How far a thumb drifts on a tap, in px. Any further is a pull. */
const TAP_SLOP = 11;
/** Being pulled, and let go. Zero is at rest. */
const HELD = 1;
const FREE = 2;

/* The petal from Bloom.tsx (ellipse cx 12, cy 6.6, rx 3.1, ry 5) as four cubic
   arcs around the hub: tangent, radial pairs in viewBox units. */
const K = 0.5522847;
const CR = 5.4;
const RA = 5;
const RB = 3.1;
const OUTLINE = [
  [0, CR + RA],
  [K * RB, CR + RA],
  [RB, CR + K * RA],
  [RB, CR],
  [RB, CR - K * RA],
  [K * RB, CR - RA],
  [0, CR - RA],
  [-K * RB, CR - RA],
  [-RB, CR - K * RA],
  [-RB, CR],
  [-RB, CR + K * RA],
  [-K * RB, CR + RA],
  [0, CR + RA],
].flat();
// Each petal rings at its own rate.
const STIFF = [78, 118, 92, 132, 104];
const SLACK = [9.5, 12, 10.5, 12.5, 11];

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const grow = (d: number) => min(1, (1 - exp(-d / 190)) / 0.92);
const buzz = (ms: number) => {
  if (navigator.vibrate && navigator.userActivation?.hasBeenActive) navigator.vibrate(ms);
};
/** The scale and rotation an element has reached, whatever it is in the middle of. */
const readAngle = (el: Element): [number, number] => {
  const m = /matrix\(([^)]+)\)/.exec(getComputedStyle(el).transform);
  if (!m) return [1, 0];
  const v = m[1].split(",").map(Number);
  return [hypot(v[0], v[1]), atan2(v[1], v[0])];
};

/**
 * Starts the pull on `bloom` (the .bloom span), calling `onTurn` for each tap.
 * Returns a function that stops it and leaves the SVG as it found it.
 */
export function startSprungFlower(bloom: HTMLElement, onTurn: () => void): () => void {
  const svg = bloom.querySelector("svg");
  const flower = bloom.querySelector(".bloom-flower");
  const petals = bloom.querySelectorAll(".bloom-petal");
  const line = bloom.parentElement;
  if (!svg || !flower || !line) return () => {};

  const catcher = document.createElement("div");
  catcher.className = "bloom-catch";
  catcher.setAttribute("aria-hidden", "true");

  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null = null;
  let fadeIn: Animation | null = null;
  let fadeOut: Animation | null = null;
  let mode = 0;
  let raf = 0;
  let last = 0;
  let acc = 0;
  let vw = 0;
  let vh = 0;
  let dpr = 1;
  let ax = 0;
  let ay = 0;
  let accent = "";
  let ink = "";
  let blend: GlobalCompositeOperation = "lighter";
  let backing = 0.84;
  // Head, relative to its resting centre, in screen axes.
  let tx = 0;
  let ty = 0;
  let tvx = 0;
  let tvy = 0;
  let hax = 0;
  let hay = 0;
  // Stem control point, head size, 3D tilt, spin, how hard it is being pressed.
  let cx = 0;
  let cy = 0;
  let cvx = 0;
  let cvy = 0;
  let sz = REST;
  let szv = 0;
  let g = 0;
  let tiltX = 0;
  let tiltY = 0;
  let tvX = 0;
  let tvY = 0;
  let spin = 0;
  let spinV = 0;
  let spinTo = 0;
  let spinBase = 0;
  let spinA = 0;
  let spinWarm = 0.7;
  let pressed = 0;
  let dip = 0;
  let dipV = 0;
  let wash = 0;
  // Pointer.
  let pid: number | null = null;
  let ptrX = 0;
  let ptrY = 0;
  let offX = 0;
  let offY = 0;
  let downX = 0;
  let downY = 0;
  let downAt = 0;
  let moved = 0;
  let lastX = 0;
  let lastT = 0;
  let fvx = 0;
  let engaged = false;
  let notch = 0;
  let clear = 34;
  let peek = 38;
  let peekSize = 30;
  // After release: length and angle around the root, like a doorstop spring.
  let L = 0;
  let Ld = 0;
  let th = 0;
  let thd = 0;
  let ox = 0;
  let time = 0;
  let h0 = 0;
  let hold = 0;
  let dur = 0;
  let rate = 2;
  let wL = 13;
  let zL = 0.38;
  let sway = 0;
  let shake = 0;
  let shook = false;

  const ph = new Float32Array(5); // hinge of each petal
  const phv = new Float32Array(5);
  const sw = new Float32Array(5); // swing in the plane
  const swv = new Float32Array(5);
  const pS = new Float32Array(5).fill(1); // scale and rotation, as read from the SVG
  const pR = new Float32Array(5);
  const pts = new Float32Array(130);
  const ribs = new Float32Array(20);
  const motes = Array.from({ length: MOTES }, () => ({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    span: 1,
    r: 1,
  }));

  const measure = () => {
    if (!canvas) return;
    dpr = min(window.devicePixelRatio || 1, 3);
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = round(vw * dpr);
    canvas.height = round(vh * dpr);
    canvas.style.width = `${canvas.width / dpr}px`;
    canvas.style.height = `${canvas.height / dpr}px`;
  };
  const resize = () => {
    if (mode) measure();
  };
  const anchor = () => {
    const b = svg.getBoundingClientRect();
    // Browsers paint an SVG on whole device pixels, so the canvas does too.
    ax = round(b.left * dpr) / dpr + b.width / 2;
    ay = round(b.top * dpr) / dpr + b.height / 2;
  };
  /* A lighter blend washes out on a pale page, so paper multiplies instead.
     Lighter also adds up alpha, which is what closes the petals on black;
     multiply does not, so on paper the ink under them has to be solid. */
  const readTheme = () => {
    const root = document.documentElement;
    const tokens = getComputedStyle(root);
    const paper = root.getAttribute("data-theme") === "light";
    accent = tokens.getPropertyValue("--accent").trim();
    ink = tokens.getPropertyValue("--bg").trim();
    blend = paper ? "multiply" : "lighter";
    backing = paper ? 1 : 0.84;
  };
  const theme = new MutationObserver(readTheme);

  /* Everything the flower needs only while it is in play. */
  const release = () => {
    fadeIn?.cancel();
    fadeOut?.cancel();
    fadeIn = fadeOut = null;
    theme.disconnect();
    window.removeEventListener("resize", resize);
    catcher.remove();
    if (canvas) {
      canvas.remove();
      canvas.width = canvas.height = 0; // give the memory back
    }
    canvas = context = null;
  };

  /* Swap the SVG for the canvas without a visible change: whatever the SVG is
     doing at this moment (mid turn, mid open, hover sway) is read back first. */
  const takeover = () => {
    if (mode) return true;
    release();
    const fresh = document.createElement("canvas");
    context = fresh.getContext("2d");
    if (!context) return false;
    canvas = fresh;
    canvas.className = "bloom-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas, catcher);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    readTheme();
    measure();
    anchor();
    spin = spinTo = spinBase = readAngle(flower)[1];
    petals.forEach((el, i) => {
      [pS[i], pR[i]] = readAngle(el);
    });
    svg.style.visibility = "hidden";
    return true;
  };
  /* Browsers differ on how they place an SVG between device pixels, so the
     last step is a short cross-fade rather than a cut. A one pixel difference
     at 3x does not survive it. */
  const handback = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    mode = 0;
    svg.style.visibility = "";
    catcher.style.display = "none";
    line.style.transform = "";
    const timing = { duration: 140, easing: "linear" };
    fadeIn = svg.animate({ opacity: [0, 1] }, timing);
    if (canvas) {
      fadeOut = canvas.animate({ opacity: [1, 0] }, timing);
      fadeOut.onfinish = release;
    }
    tx = ty = tvx = tvy = cx = cy = cvx = cvy = L = Ld = th = thd = ox = 0;
    tiltX = tiltY = tvX = tvY = dip = dipV = spinV = szv = g = pressed = wash = 0;
    sz = REST;
    ph.fill(0);
    phv.fill(0);
    sw.fill(0);
    swv.fill(0);
  };
  const run = () => {
    if (raf) return;
    last = performance.now();
    acc = 0;
    raf = requestAnimationFrame(frame);
  };
  const frame = (now: number) => {
    anchor();
    acc += min((now - last) / 1000, 0.05);
    last = now;
    while (acc >= STEP) {
      if (mode === HELD) held(STEP);
      else free(STEP);
      shared(STEP);
      acc -= STEP;
    }
    if (mode === FREE && finished()) {
      handback();
      return;
    }
    draw();
    raf = requestAnimationFrame(frame);
  };
  const finished = () => {
    if (time < dur) return false;
    if (time > dur + 1.1) return true;
    let still = L < 0.12 && abs(Ld) < 3 && abs(spin - spinTo) < 0.004 && abs(spinV) < 0.04;
    still = still && abs(dip) < 0.1 && abs(dipV) < 1.5 && sz - REST < 0.1;
    still = still && hypot(tiltX, tiltY) < 0.03;
    for (let i = 0; i < 5; i++) still = still && abs(ph[i]) < 0.09 && abs(sw[i]) < 0.04;
    return still && !motes.some((m) => m.life > 0);
  };

  /* Held: the head chases a point ahead of the thumb, on screen, and never
     under it. Size, stem and petals all read from the distance pulled. */
  const held = (dt: number) => {
    const fx = ptrX - ax - offX;
    const fy = ptrY - ay - offY;
    const dist = hypot(fx, fy);
    const d = max(0, dist - 3);
    g = grow(d);
    const goal = max(peekSize, REST + SPAN * g);
    const r = goal * RAD;
    const lift = peek + (r + clear - peek) * smooth(0, 70, d);
    const ray = smooth(8, 90, d);
    const ux = (dist ? fx / dist : 0) * ray;
    const uy = (dist ? fy / dist : 0) * ray - (1 - ray);
    const ul = hypot(ux, uy) || 1;
    const minX = r + 6 - ax;
    const maxX = vw - r - 6 - ax;
    const minY = r + 6 - ay;
    let hx = clamp(fx + (ux / ul) * lift, minX, maxX);
    const hy = clamp(fy + (uy / ul) * lift, minY, 12);
    const need = r + clear * 0.8;
    const dy = hy - fy;
    if (d > 70 && hypot(hx - fx, dy) < need) {
      const side = ax + fx < vw / 2 ? 1 : -1;
      hx = clamp(fx + side * sqrt(max(0, need * need - dy * dy)), minX, maxX);
    }
    const kx = tvx;
    const ky = tvy;
    tvx += (640 * (hx - tx) - 34 * tvx) * dt;
    tvy += (640 * (hy - ty) - 34 * tvy) * dt;
    tx += tvx * dt;
    ty += tvy * dt;
    hax = (tvx - kx) / dt;
    hay = (tvy - ky) / dt;
    pressed += (1 - pressed) * min(1, dt * 26);
    szv += (620 * (goal - sz) - 40 * szv) * dt;
    sz += szv * dt;
    const lean = tx * 0.0016;
    spinA = 900 * (spinBase + lean - spin) - 42 * spinV;
    spinV += spinA * dt;
    spin += spinV * dt;
    const n = floor(g * 3.2);
    if (n > notch) buzz(3);
    notch = n;
  };

  /* Let go: length falls toward a short height that itself drops to nothing,
     while the angle swings through upright and rings. The stem gets shorter,
     so the ring gets quicker and angular speed gathers, which is the whip. */
  const free = (dt: number) => {
    time += dt;
    const p = clamp((time - hold) / (dur - hold), 0, 1);
    const rest = h0 * (1 - p * p);
    Ld += (wL * wL * (rest - L) - 2 * zL * wL * Ld) * dt;
    L += Ld * dt;
    if (!shook && Ld > 0) {
      shook = true;
      if (shake) {
        spawn(shake);
        buzz(9);
      }
    }
    if (L <= 0) {
      if (Ld < -14) {
        dipV += min(-Ld * 0.36, 72);
        buzz(4);
      }
      L = 0;
      Ld = max(0, -Ld * 0.16);
    }
    const reach = max(L, 44);
    const wT = 15 + 13 * (1 - min(L, 180) / 180);
    const r = sz * RAD;
    ox = max(0, r + 6 + sway * exp(-rate * time) - ax);
    const nx = ox + L * sin(th);
    const ny = -L * cos(th);
    let aT = -wT * wT * th - 2 * rate * thd - 1.3 * clamp(Ld / reach, -9, 9) * thd;
    const leftEdge = ax + nx - r;
    const rightEdge = ax + nx + r;
    if (leftEdge < 3) aT += ((3 - leftEdge) * 900) / reach;
    if (rightEdge > vw - 3) aT -= ((rightEdge - vw + 3) * 900) / reach;
    thd = clamp(thd + aT * dt, -30, 30);
    th = clamp(th + thd * dt, -1.75, 1.75);
    const vx = (nx - tx) / dt;
    const vy = (ny - ty) / dt;
    hax += ((vx - tvx) / dt - hax) * 0.25;
    hay += ((vy - tvy) / dt - hay) * 0.25;
    tvx = vx;
    tvy = vy;
    tx = nx;
    ty = ny;
    g = grow(rest);
    const goal = REST + SPAN * pow(g, 1.3);
    szv += (300 * (goal - sz) - 26 * szv) * dt;
    sz += szv * dt;
    if (sz < REST) {
      sz = REST;
      szv = 0;
    }
    pressed += (0 - pressed) * min(1, dt * 16);
    spinA = 81 * (spinTo - spin) - 18 * spinWarm * spinV;
    spinV += spinA * dt;
    spin += spinV * dt;
    if (L > 16) {
      const s = max(1, (sz * 0.9) / 72);
      catcher.style.display = "block";
      catcher.style.transform = `translate(${ax + tx}px,${ay + ty}px) scale(${s})`;
    } else catcher.style.display = "none";
  };

  const shared = (dt: number) => {
    const loose = mode === FREE;
    const len = hypot(tx, ty - ROOT);
    const taut = smooth(140, 460, len) * (loose ? 0.5 : 0.9);
    const up = ROOT + (ty - ROOT) * 0.62;
    const gx = tx * 0.5 * taut;
    const gy = up + ((ty + ROOT) * 0.5 - up) * taut;
    const ck = loose ? 230 : 520;
    const cc = loose ? 11 : 24;
    cvx += (ck * (gx - cx) - cc * cvx) * dt;
    cvy += (ck * (gy - cy) - cc * cvy) * dt;
    cx += cvx * dt;
    cy += cvy * dt;

    const big = smooth(REST, 64, sz);
    const ex = tx - cx;
    const ey = ty - cy;
    const el = hypot(ex, ey) || 1;
    const lean = (0.16 + 0.32 * g) * big;
    const lag = loose ? 0.00042 : 0.0003;
    let gX = (ex / el) * lean - tvx * lag * min(1, big + 0.25);
    let gY = (ey / el) * lean - tvy * lag * min(1, big + 0.25);
    const gl = hypot(gX, gY);
    if (gl > 1.15) {
      gX *= 1.15 / gl;
      gY *= 1.15 / gl;
    }
    tvX += (190 * (gX - tiltX) - 10.5 * tvX) * dt;
    tvY += (190 * (gY - tiltY) - 10.5 * tvY) * dt;
    tiltX += tvX * dt;
    tiltY += tvY * dt;

    const cup = pressed * 0.62 * (1 - smooth(0.02, 0.62, g)) - 0.26 * smooth(0.62, 1, g);
    const calm = loose ? 1 + 2.6 * smooth(dur * 0.55, dur, time) : 1;
    const flap = loose ? min(hypot(hax, hay) * 0.002, 22) : 0;
    for (let i = 0; i < 5; i++) {
      const a = spin + i * PETAL;
      const push = clamp(-(hax * sin(a) - hay * cos(a)) * 0.0055, -44, 44) * (loose ? 1 : 0.5);
      phv[i] += (STIFF[i] * (cup - ph[i]) - SLACK[i] * 0.3 * calm * phv[i] + push + flap) * dt;
      ph[i] = clamp(ph[i] + phv[i] * dt, -0.95, 1.05);
      swv[i] += (-STIFF[i] * 1.6 * sw[i] - SLACK[i] * 0.34 * calm * swv[i] - spinA * 0.05) * dt;
      sw[i] = clamp(sw[i] + swv[i] * dt, -0.34, 0.34);
      pS[i] += (1 - pS[i]) * min(1, dt * 14);
      pR[i] += (0 - pR[i]) * min(1, dt * 14);
    }

    wash += ((loose ? 0 : 0.5 * smooth(0.04, 0.8, g)) - wash) * min(1, dt * (loose ? 9 : 22));

    const lift = loose ? 0 : -min(1.1, g * 1.5);
    dipV += (440 * (lift - dip) - 15 * dipV) * dt;
    dip += dipV * dt;

    for (let i = 0; i < MOTES; i++) {
      const m = motes[i];
      if (m.life <= 0) continue;
      m.life -= dt;
      m.vy += 640 * dt;
      m.vx -= m.vx * 1.6 * dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
    }
  };

  const spawn = (n: number) => {
    const r = sz * RAD;
    const hx = ax + tx;
    const hy = ay + ty;
    for (let i = 0; i < n; i++) {
      const m = motes[i];
      const a = random() * TAU;
      const s = 70 + random() * 170;
      m.x = hx + sin(a) * r * 0.8;
      m.y = hy - cos(a) * r * 0.8;
      m.vx = sin(a) * s + tvx * 0.12;
      m.vy = -cos(a) * s - 70 + tvy * 0.12;
      m.span = m.life = 0.75 + random() * 0.55;
      m.r = 0.7 + random() * 0.9;
    }
  };

  const draw = () => {
    const ctx = context;
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const hx = ax + tx;
    const hy = ay + ty;
    const u = sz / 24;
    const big = smooth(REST, 64, sz);
    line.style.transform = abs(dip) > 0.02 ? `translateY(${dip.toFixed(2)}px)` : "";

    // A wash of the page colour first, so the flower reads over whatever it passes.
    if (wash > 0.004) {
      ctx.fillStyle = ink;
      ctx.globalAlpha = wash;
      ctx.fillRect(0, 0, vw, vh);
    }
    // Stem.
    const out = hypot(tx, ty);
    if (out > 0.3) {
      ctx.globalAlpha = min(1, out / 5);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1 + 0.25 * big;
      ctx.beginPath();
      ctx.moveTo(ax, ay + ROOT);
      ctx.quadraticCurveTo(ax + cx, ay + cy, hx, hy);
      ctx.stroke();
    }

    // Head: real 3D rotation of the petal outlines, drawn as line art.
    const tl = hypot(tiltX, tiltY);
    const c = cos(tl);
    const s = sin(tl);
    const C = 1 - c;
    const nx = tl ? -tiltY / tl : 0;
    const ny = tl ? tiltX / tl : 0;
    const m00 = c + nx * nx * C;
    const m01 = nx * ny * C;
    const m02 = ny * s;
    const m11 = c + ny * ny * C;
    const m12 = -nx * s;
    const m20 = -ny * s;
    const m21 = nx * s;
    const m22 = c;
    const f = sz * 3.2;
    const spread = smooth(0.3, 1, g);
    const wide = 1 + 0.16 * spread;
    const hub = 0.7 * spread;
    let k = 0;
    let q = 0;
    for (let i = 0; i < 5; i++) {
      const a = spin + i * PETAL + sw[i] + pR[i];
      const ca = cos(a);
      const sa = sin(a);
      const cp = cos(ph[i]);
      const sp = sin(ph[i]);
      const sc = pS[i];
      for (let j = 0; j < 26; j += 2) {
        const T = OUTLINE[j] * wide * sc;
        const R = OUTLINE[j + 1] * sc + hub;
        const r = R * cp;
        const z = R * sp;
        const x = r * sa + T * ca;
        const y = -r * ca + T * sa;
        const X = m00 * x + m01 * y + m02 * z;
        const Y = m01 * x + m11 * y + m12 * z;
        const Z = m20 * x + m21 * y + m22 * z;
        const p = f / (f - Z * u);
        pts[k++] = hx + X * u * p;
        pts[k++] = hy + Y * u * p;
      }
      // Midrib, from the hub out along the petal.
      for (const R of [1.2 + hub, 8.2 * sc + hub]) {
        const r = R * cp;
        const z = R * sp;
        const x = r * sa;
        const y = -r * ca;
        const X = m00 * x + m01 * y + m02 * z;
        const Y = m01 * x + m11 * y + m12 * z;
        const Z = m20 * x + m21 * y + m22 * z;
        const p = f / (f - Z * u);
        ribs[q++] = hx + X * u * p;
        ribs[q++] = hy + Y * u * p;
      }
    }
    const trace = (i: number) => {
      const b = i * 26;
      ctx.moveTo(pts[b], pts[b + 1]);
      for (let j = 2; j < 26; j += 6) {
        ctx.bezierCurveTo(
          pts[b + j],
          pts[b + j + 1],
          pts[b + j + 2],
          pts[b + j + 3],
          pts[b + j + 4],
          pts[b + j + 5],
        );
      }
      ctx.closePath();
    };
    ctx.beginPath();
    for (let i = 0; i < 5; i++) trace(i);
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    if (big > 0) {
      ctx.fillStyle = ink;
      ctx.globalAlpha = backing * big;
      ctx.fill();
    }
    ctx.fillStyle = ctx.strokeStyle = accent;
    ctx.lineWidth = 0.825 + 0.5 * big;
    if (sz > 26) ctx.globalCompositeOperation = blend;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      trace(i);
      ctx.globalAlpha = 0.16;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();
    }
    if (big > 0.02) {
      ctx.lineWidth = 0.75;
      ctx.globalAlpha = 0.42 * big;
      ctx.beginPath();
      for (let i = 0; i < 20; i += 4) {
        ctx.moveTo(ribs[i], ribs[i + 1]);
        ctx.lineTo(ribs[i + 2], ribs[i + 3]);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const rc = 1.9 * u * (1 - 0.34 * spread);
    ctx.beginPath();
    ctx.ellipse(hx, hy, rc, rc * c, tl ? atan2(tiltY, tiltX) : 0, 0, TAU);
    ctx.fill();

    ctx.globalCompositeOperation = blend;
    for (let i = 0; i < MOTES; i++) {
      const m = motes[i];
      if (m.life <= 0) continue;
      ctx.globalAlpha = pow(m.life / m.span, 1.4);
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  };

  const settle = (kind: "bob" | "release") => {
    mode = FREE;
    time = 0;
    shook = false;
    if (kind === "bob") {
      L = th = ox = sway = 0;
      Ld = 250;
      thd = (random() < 0.5 ? -1 : 1) * 1.6;
      h0 = 0;
      hold = 0;
      dur = 0.5;
      rate = 5;
      wL = 13;
      zL = 0.38;
      shake = 0;
      spinWarm = 1;
      spinTo = spinBase = spin;
      return;
    }
    const pulled = hypot(tx, ty);
    const force = clamp(pulled / 380, 0, 1);
    h0 = pulled < 40 ? 0 : 6 + 76 * force;
    sway = 34 * min(1, h0 / 40);
    ox = max(0, sz * RAD + 6 + sway - ax);
    const px = tx - ox;
    const py = ty;
    L = hypot(px, py);
    th = L > 1 ? atan2(px, -py) : 0;
    th = clamp(th, -1.75, 1.75);
    Ld = L > 1 ? (px * tvx + py * tvy) / L : 0;
    thd = L > 1 ? clamp((-py * tvx + px * tvy) / (L * L), -30, 30) : 0;
    dur = 0.55 + 1.35 * force;
    hold = dur * 0.42;
    rate = 2.1 / dur;
    wL = 15 - 3.5 * force;
    zL = 0.42;
    if (pulled > 60) thd -= (th >= 0 ? 1 : -1) * 4.5 * force;
    shake = pulled > 150 ? 3 + floor(4 * force) : 0;
  };

  const press = (e: PointerEvent) => {
    if (pid !== null || !e.isPrimary || e.button) return;
    const wasFree = mode === FREE;
    if (!takeover()) return;
    pid = e.pointerId;
    try {
      (e.currentTarget as Element).setPointerCapture(pid);
    } catch {}
    engaged = true;
    const touch = e.pointerType !== "mouse";
    clear = touch ? 34 : 10;
    peek = touch ? 38 : 12;
    peekSize = touch ? 30 : 22;
    ptrX = downX = lastX = e.clientX;
    ptrY = downY = e.clientY;
    downAt = lastT = e.timeStamp;
    offX = wasFree ? 0 : ptrX - ax;
    offY = wasFree ? 0 : ptrY - ay;
    moved = fvx = notch = 0;
    spinBase = round(spinTo / PETAL) * PETAL;
    mode = HELD;
    buzz(4);
    run();
    draw();
  };
  const move = (e: PointerEvent) => {
    if (e.pointerId !== pid) return;
    const dt = e.timeStamp - lastT;
    if (dt > 0) {
      fvx = fvx * 0.35 + ((e.clientX - lastX) / dt) * 1000 * 0.65;
      lastX = e.clientX;
      lastT = e.timeStamp;
    }
    ptrX = e.clientX;
    ptrY = e.clientY;
    moved = max(moved, hypot(ptrX - downX, ptrY - downY));
    if (moved >= TAP_SLOP) markPlayed("flower");
  };
  const up = (e: PointerEvent) => {
    if (e.pointerId !== pid) return;
    pid = null;
    const cancelled = e.type !== "pointerup";
    const tap = !cancelled && moved < TAP_SLOP && e.timeStamp - downAt < 600;
    const stale = e.timeStamp - lastT > 70;
    const flick = stale || cancelled ? 0 : clamp(fvx * 0.012, -26, 26);
    settle("release");
    if (tap) {
      spinTo = spinBase + PETAL;
      spinWarm = 1;
      onTurn();
    } else {
      spinV += flick;
      spinWarm = 0.72;
      spinTo = round((spin + (spinV * 2 * spinWarm) / 9) / PETAL) * PETAL;
    }
    spinBase = spinTo;
  };
  const noMenu = (e: Event) => e.preventDefault();
  // The catcher moves off as soon as a finger lifts, so on a slow phone the
  // click that finger leaves behind can land on a link underneath.
  const noClick = (e: TouchEvent) => {
    if (e.cancelable) e.preventDefault();
  };
  // A pull, or a tap already counted above, must not also reach Bloom's onClick.
  const swallowClick = (e: Event) => {
    if (engaged) e.stopImmediatePropagation();
    engaged = false;
  };

  const listening = new AbortController();
  const { signal } = listening;
  for (const el of [bloom, catcher]) {
    el.addEventListener("pointerdown", press, { signal });
    el.addEventListener("pointermove", move, { signal });
    el.addEventListener("pointerup", up, { signal });
    el.addEventListener("pointercancel", up, { signal });
    el.addEventListener("lostpointercapture", up, { signal });
    el.addEventListener("contextmenu", noMenu, { signal });
  }
  catcher.addEventListener("touchend", noClick, { passive: false, signal });
  bloom.addEventListener("click", swallowClick, { capture: true, signal });

  // A small nod once the petals have finished opening, to say it is alive.
  const bob = () => {
    if (mode || document.hidden) return;
    const b = svg.getBoundingClientRect();
    if (b.bottom < 0 || b.top > window.innerHeight) return;
    if (!takeover()) return;
    settle("bob");
    run();
  };
  const bobTimer = window.setTimeout(bob, 1150);

  return () => {
    listening.abort();
    window.clearTimeout(bobTimer);
    cancelAnimationFrame(raf);
    raf = 0;
    mode = 0;
    release();
    svg.style.visibility = "";
    line.style.transform = "";
  };
}

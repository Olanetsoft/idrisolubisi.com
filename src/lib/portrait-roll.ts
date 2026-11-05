/**
 * The hero portrait as a loose wheel, on phones. Flick it and it rolls over the
 * name with the letters riding the rim, thumps the screen edge and rocks home;
 * tap for a small roll, drag to roll under the thumb, touch to catch it. One
 * damped spring pulls it home and the angle is always distance over radius, so
 * it cannot end anywhere but home and upright. Transforms only. It does nothing
 * until touched, and clears every style it set once it has stopped. No library.
 * HeroBackdrop decides who gets it (under 760px, motion allowed).
 */

import { markPlayed } from "@/lib/played";

/** The home spring, in rad/s, and its damping ratio. */
const SPRING = 5.2;
const DAMPING = 0.32;
/** Rolling friction, in px/s2, so the last rocks stop rather than fade. */
const FRICTION = 150;
/** The screen edges are a stiff spring: the squash is the overlap. */
const WALL = 95;
const WALL_DAMPING = 0.12;
/** The most the wheel squashes, as a share of its width. */
const SQUASH = 0.28;
/** One step of the physics, in seconds. */
const STEP = 1 / 240;
/** The fastest flick, in px/s. */
const MAX_FLICK = 3800;
/** How much finger history a flick is measured over, in ms. */
const FLICK_WINDOW = 90;

type Letter = {
  el: HTMLSpanElement;
  /** The letter's centre, from the left of the hero. */
  x: number;
  /** How far from the wheel's centre the rim still reaches this letter. */
  reach: number;
  y: number;
  v: number;
  up: boolean;
  lean: number;
};

/**
 * Starts the wheel on the portrait inside `hero`. Returns a function that stops
 * it and puts everything back.
 */
export function startPortraitRoll(hero: HTMLElement): () => void {
  const fig = hero.querySelector<HTMLElement>(".portrait");
  const img = fig?.querySelector("img");
  const h1 = hero.querySelector("h1");
  if (!fig || !img || !h1) return () => {};
  const ring = hero.querySelector(".hero-pulse-ring");
  const dot = hero.querySelector(".live-dot");

  const range = document.createRange();
  let R = 0;
  let home = 0;
  let mid = 0;
  let lo = 0;
  let hi = 0;
  let nameEnd = 0;
  let x = 0;
  let v = 0;
  let inWall = false;
  let press = 1;
  let pressV = 0;
  let pressTo = 1;
  let held: number | null = null;
  let moved = false;
  let grabX = 0;
  let downX = 0;
  let downT = 0;
  let base = 0;
  let trail: { t: number; x: number }[] = [];
  let raf = 0;
  let last = 0;
  let acc = 0;
  let rung = -1e4;
  let sent: Animation | undefined;
  let name: HTMLDivElement | null = null;
  let letters: Letter[] = [];
  let hop = 0;

  const measure = () => {
    const page = hero.getBoundingClientRect();
    const box = fig.getBoundingClientRect();
    R = box.width / 2;
    home = box.left + R - page.left;
    mid = box.top + box.height / 2 - page.top;
    lo = R - home;
    hi = page.width - R - home;
    range.selectNodeContents(h1);
    nameEnd = range.getBoundingClientRect().right - page.left;
    hop = parseFloat(getComputedStyle(h1).fontSize) * 0.8;
  };

  // The name, one span per letter, placed from Range rects so the kerning is
  // the browser's own. The real h1 stays in the tree, only unseen. Without a
  // lone text node to measure, the wheel simply rolls over the name.
  const showName = () => {
    const text = h1.firstChild;
    if (!(text instanceof Text)) return;
    const page = hero.getBoundingClientRect();
    const at = h1.getBoundingClientRect();
    range.setStart(text, 0);
    range.setEnd(text, 1);
    const top = range.getBoundingClientRect().top;
    name = document.createElement("div");
    name.className = "name-clone";
    name.setAttribute("aria-hidden", "true");
    for (let i = 0; i < text.length; i++) {
      if (text.data[i] === " ") continue;
      range.setStart(text, i);
      range.setEnd(text, i + 1);
      const r = range.getBoundingClientRect();
      const el = document.createElement("span");
      el.textContent = text.data[i];
      el.style.left = `${r.left - at.left}px`;
      el.style.top = `${r.top - top}px`;
      name.append(el);
      const dy = r.top + r.height / 2 - page.top - mid;
      letters.push({
        el,
        x: r.left + r.width / 2 - page.left,
        reach: Math.sqrt(Math.max(0, R * R - dy * dy)) + r.width / 2,
        y: 0,
        v: 0,
        up: false,
        lean: 0,
      });
    }
    h1.after(name);
    h1.style.opacity = "0";
  };

  const hideName = () => {
    name?.remove();
    name = null;
    letters = [];
    h1.style.opacity = "";
  };

  const thump = (speed: number, left: boolean) => {
    if (speed < 160) return;
    navigator.vibrate?.(Math.min(22, 6 + speed / 140));
    const now = performance.now();
    if (speed < 520 || !ring || !dot || now - rung < 900) return;
    rung = now;
    const d = dot.getBoundingClientRect();
    const f = fig.getBoundingClientRect();
    const to = `translate(${(left ? f.left : f.right) - d.left - 3}px,${f.top + R - d.top - 3}px)`;
    sent = ring.animate(
      [
        { transform: `${to} scale(.02)`, opacity: 1 },
        { opacity: 0.7, offset: 0.6 },
        { transform: to, opacity: 0 },
      ],
      { duration: 1500, easing: "cubic-bezier(.3,.6,.3,1)" },
    );
  };

  const step = (h: number) => {
    if (held === null) {
      const over = x < lo ? lo - x : x > hi ? hi - x : 0;
      let a = -SPRING * SPRING * x - 2 * DAMPING * SPRING * v - (FRICTION * v) / (Math.abs(v) + 24);
      if (over) {
        if (!inWall) thump(Math.abs(v), over > 0);
        a += WALL * WALL * over - 2 * WALL_DAMPING * WALL * v;
      }
      inWall = over !== 0;
      v += a * h;
      x += v * h;
    }
    pressV += ((pressTo - press) * 1600 - pressV * 44) * h;
    press += pressV * h;
    // The rim lifts each letter: nothing at the edge of the wheel, full height
    // over the crown, tilted along the curve. A fast wheel adds a hop.
    const at = home + x;
    for (const l of letters) {
      const d = (l.x - at) / l.reach;
      const under = d * d < 1;
      if (under) l.lean = d * 13;
      if (under && !l.up) l.v += Math.min(170, Math.abs(v) * 0.09);
      l.up = under;
      l.v += under ? ((hop * Math.sqrt(1 - d * d) - l.y) * 1100 - l.v * 34) * h : -3800 * h;
      l.y += l.v * h;
      if (l.y > hop * 1.2) {
        l.y = hop * 1.2; // never into the status line
        l.v = 0;
      }
      if (l.y <= 0) {
        l.y = 0;
        l.v = l.v < -70 ? -l.v * 0.3 : 0;
      }
    }
  };

  const draw = () => {
    const out = x < lo ? lo - x : x > hi ? x - hi : 0;
    const s = SQUASH * (1 - Math.exp(-out / (2 * R * SQUASH)));
    const c = !out ? x : x < lo ? lo - R * s : hi + R * s;
    const sx = (1 - s) * press;
    const sy = (1 + 0.45 * s) * press;
    fig.style.transform =
      `translate(${c.toFixed(2)}px,${(-R * 0.45 * s).toFixed(2)}px) ` +
      `scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    img.style.transform = `rotate(${(c / R).toFixed(4)}rad)`;
    const edge = home + c - R;
    if (!name && edge < nameEnd + 12) showName();
    else if (name && edge > nameEnd + 12 && letters.every((l) => !l.y)) hideName();
    for (const l of letters) {
      l.el.style.transform = l.y
        ? `translateY(${(-l.y).toFixed(2)}px) rotate(${((l.lean * l.y) / hop).toFixed(2)}deg)`
        : "";
    }
  };

  const calm = () =>
    held === null &&
    Math.abs(x) < 0.35 &&
    Math.abs(v) < 5 &&
    Math.abs(press - 1) < 0.003 &&
    Math.abs(pressV) < 0.05 &&
    letters.every((l) => !l.y);

  const sleep = () => {
    x = v = pressV = 0;
    press = 1;
    fig.style.transform = img.style.transform = "";
    fig.style.willChange = img.style.willChange = "";
    if (name) hideName();
    raf = 0;
  };

  const tick = (now: number) => {
    acc += Math.min(0.05, (now - last) / 1000);
    last = now;
    for (; acc >= STEP; acc -= STEP) step(STEP);
    if (calm()) return sleep();
    draw();
    raf = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (raf) return;
    fig.style.willChange = img.style.willChange = "transform";
    last = performance.now();
    acc = 0;
    raf = requestAnimationFrame(tick);
  };

  const letGo = (e: PointerEvent, cancelled: boolean) => {
    if (e.pointerId !== held) return;
    held = null;
    pressTo = 1;
    delete fig.dataset.held;
    if (cancelled) return;
    markPlayed("wheel");
    const t = e.timeStamp;
    const dx = e.clientX - downX;
    const quick = t - downT < 400;
    if (moved && (Math.abs(dx) > 16 || !quick)) {
      const recent = trail.filter((p) => t - p.t < FLICK_WINDOW);
      // A short flick can report a single move: all it has to compare with is
      // the sample before it, or the press itself.
      if (recent.length === 1) {
        recent.unshift(trail[trail.length - 2] ?? { t: downT, x: downX });
      }
      const a = recent[0];
      const b = recent[recent.length - 1];
      v = recent.length > 1 ? ((b.x - a.x) / Math.max(8, b.t - a.t)) * 1000 : 0;
      v = Math.max(-MAX_FLICK, Math.min(MAX_FLICK, v));
    } else if (quick) {
      // A thumb drifts a little on a tap, which is still a tap. A tap pushes
      // the wheel away from the finger; dead centre, towards the name.
      const off = e.clientX - fig.getBoundingClientRect().left - R;
      const kick = Math.min(560, (home - R - nameEnd + 16) * 8.4); // just reaches the last letter
      v = (Math.abs(dx) > 2 ? Math.sign(dx) : off < -R * 0.35 ? 1 : -1) * kick;
    }
  };

  const listeners = new AbortController();
  const on = { signal: listeners.signal };

  fig.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button || held !== null) return;
      if (!raf) measure();
      held = e.pointerId;
      moved = false;
      v = 0;
      base = x;
      trail = [];
      grabX = downX = e.clientX;
      downT = e.timeStamp;
      pressTo = 0.955;
      fig.dataset.held = "";
      fig.setPointerCapture(held);
      wake();
    },
    on,
  );

  fig.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerId !== held) return;
      if (!moved) {
        if (Math.abs(e.clientX - grabX) < 6) return;
        moved = true;
        grabX = e.clientX; // the browser's slop is not a jump
        markPlayed("wheel"); // a drag; a press alone may be the start of a scroll
      }
      const to = base + e.clientX - grabX;
      // Past the edge the finger is pressing into it, which squashes the wheel.
      x = to < lo ? lo - (lo - to) * 0.4 : to > hi ? hi + (to - hi) * 0.4 : to;
      trail.push({ t: e.timeStamp, x: e.clientX });
      if (trail.length > 12) trail.shift();
    },
    on,
  );

  fig.addEventListener("pointerup", (e) => letGo(e, false), on);
  fig.addEventListener("pointercancel", (e) => letGo(e, true), on);
  // Capture can end with neither of those, and a pointer that never lets go
  // would leave the wheel held for good. Only the wheel's own capture counts:
  // a touch starts captured to the img, and that handover must not let go.
  fig.addEventListener(
    "lostpointercapture",
    (e) => {
      if (e.target === fig) letGo(e, true);
    },
    on,
  );
  // A long press on the photo is a hold, not "save image".
  fig.addEventListener(
    "contextmenu",
    (e) => {
      if (held !== null) e.preventDefault();
    },
    on,
  );
  // A rotate mid-roll moves the hero out from under the wheel: measure again
  // with the wheel lifted off, and let the name rebuild from the new layout.
  let wide = window.innerWidth;
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth === wide) return;
      wide = window.innerWidth;
      if (!raf) return; // asleep: the next press measures
      fig.style.transform = "none";
      measure();
      if (name) hideName();
      draw();
    },
    on,
  );
  img.draggable = false;
  fig.dataset.loose = "";

  return () => {
    listeners.abort();
    cancelAnimationFrame(raf);
    sent?.cancel();
    sleep();
    delete fig.dataset.loose;
    delete fig.dataset.held;
    img.removeAttribute("draggable");
  };
}

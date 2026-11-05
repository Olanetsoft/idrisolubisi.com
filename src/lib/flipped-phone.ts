/**
 * The flipped phone: a phone lies on a table, and a flick of the thumb throws
 * it. Landing face up turns over his stage photos in order, and the last one
 * dives into the keynote hall. This is the part with no three.js in it, loaded
 * after the shell on a door's press: the phone's stand-in, a few CSS faces in
 * the pose the scene will take, which answers the thumb at once; the thumb
 * itself; the words; and the end. The scene (src/lib/flipped-phone-scene.ts)
 * comes after it and takes over at rest, so nothing jumps. Reduced-motion
 * visitors never load it: they keep the stand-in, and the phone turns over
 * with a fade.
 */

import "@/app/flipped-phone.css";
import { recognition } from "@/data/recognition";
import { stagePhotos } from "@/data/talks";
import { SLAB, VIEW, fit } from "@/lib/flipped-phone-flight";
import type { PhoneScene } from "@/lib/flipped-phone-scene";
import type { StartStage } from "@/lib/three-shell";

/** The rooms, in the order he reached them, ending in the keynote hall. */
const ROOMS = ["mara-roadshow-stage", "build-afrika", "blockfest-keynote"].map((name) =>
  stagePhotos.find((photo) => photo.src.includes(name))!,
);
const HALL = ROOMS[ROOMS.length - 1];
/** Each room as cropped for the phone's screen, beside the photo itself. */
const CROPS = ROOMS.map((room) => room.src.replace(".jpg", "-phone.jpg"));
/** Where the last crop's centre sits in the whole picture, in px. */
const HALL_CENTRE = 1224.5;
const STORY = recognition.find((item) => item.by === "The Geek Circle")!;

const SHELL = `
  <div class="three-phone" aria-hidden="true">
    <div class="three-phone-slab">
      <div class="three-phone-face three-phone-face--front">
        <div class="three-phone-nest"><i><i><i></i></i></i></div>
        <img class="three-phone-photo" alt="" hidden>
      </div>
      <div class="three-phone-face three-phone-face--back"></div>
      <div class="three-phone-face three-phone-face--l"></div>
      <div class="three-phone-face three-phone-face--r"></div>
      <div class="three-phone-face three-phone-face--t"></div>
      <div class="three-phone-face three-phone-face--b"></div>
    </div>
  </div>`;

const WORDS = `
  <p class="sr-only" id="three-phone-how">A phone on a table. Flip throws it, and each landing shows a photo from a stage.</p>
  <svg class="three-phone-hint" viewBox="0 0 18 22" aria-hidden="true">
    <path d="M1 7 9 1l8 6" /><path d="M1 14l8-6 8 6" /><path d="M1 21l8-6 8 6" />
  </svg>
  <div class="three-phone-end" hidden>
    <img alt="">
    <div class="three-phone-end-foot">
      <p class="three-phone-end-line"><a></a></p>
      <p class="three-phone-end-by"></p>
    </div>
  </div>`;

const FOOT = `
  <p class="three-phone-tag" aria-hidden="true"></p>
  <p class="sr-only" aria-live="polite"></p>
  <button type="button" class="video-dialog-close three-phone-flip">Flip</button>`;

export const start: StartStage = (stage) => {
  const { dialog, slot, foot, reduced } = stage;
  slot.insertAdjacentHTML("beforeend", SHELL);
  dialog.insertAdjacentHTML("beforeend", WORDS);
  dialog.setAttribute("aria-describedby", "three-phone-how");
  foot.innerHTML = FOOT;
  const find = <T extends Element>(name: string) =>
    dialog.querySelector<T>(`.three-phone-${name}`)!;
  const slab = find<HTMLElement>("slab");
  const shot = find<HTMLImageElement>("photo");
  const tag = find<HTMLElement>("tag");
  const flip = find<HTMLButtonElement>("flip");
  const end = find<HTMLElement>("end");
  const say = foot.querySelector<HTMLElement>("[aria-live]")!;

  let scene: PhoneScene | null = null;
  let arrived: PhoneScene | null = null;
  let stopped = false;
  let flying = false;
  let held = false;
  let photoOnly = reduced; // no scene: the phone turns over with a fade
  let step = 0;
  let frame = 0;
  const timers = new Set<number>();
  const later = (run: () => void, ms: number) => {
    timers.add(window.setTimeout(run, ms));
  };

  const hint = (rest: boolean) => {
    if (rest) dialog.dataset.rest = "";
    else delete dialog.dataset.rest;
  };

  const setTag = (index: number | null) => {
    if (index === null) {
      delete tag.dataset.on;
      return;
    }
    const { alt, tag: words } = ROOMS[index];
    tag.textContent = words;
    tag.dataset.on = "";
    say.textContent = `${alt}. ${words}`;
  };

  // The stand-in takes the size and pose the scene will draw.
  const sizeStand = () => {
    const { perspective, scale } = fit(slot.clientWidth, slot.clientHeight);
    const set = (name: string, value: number) => dialog.style.setProperty(name, `${value}px`);
    set("--phone-p", perspective);
    set("--phone-w", SLAB.w * scale);
    set("--phone-h", SLAB.h * scale);
    set("--phone-d", SLAB.t * scale);
  };
  sizeStand();
  const sizes = new ResizeObserver(sizeStand);
  sizes.observe(slot);
  dialog.style.setProperty("--phone-tilt", `${90 - VIEW.pitch}deg`);

  // It grows from the lifted icon, wherever the lift has got to.
  const icon = slot.querySelector(".three-stage-icon")?.getBoundingClientRect();
  if (icon?.width) {
    const to = slab.getBoundingClientRect();
    dialog.style.setProperty(
      "--phone-from-x",
      `${icon.left + icon.width / 2 - (to.left + to.width / 2)}px`,
    );
    dialog.style.setProperty(
      "--phone-from-y",
      `${icon.top + icon.height / 2 - (to.top + to.height / 2)}px`,
    );
    dialog.style.setProperty("--phone-from-s", `${icon.height / to.height}`);
  }

  const finish = () => {
    const img = end.querySelector("img")!;
    const link = end.querySelector("a")!;
    // The same crop the texture has, on the whole picture.
    const seen = HALL.height * (dialog.clientWidth / dialog.clientHeight);
    const left = HALL_CENTRE - seen / 2;
    const x = Math.max(0, Math.min(100, (left / (HALL.width - seen)) * 100));
    end.style.setProperty("--phone-x", `${x}%`);
    img.src = HALL.src;
    img.alt = HALL.alt;
    link.textContent = STORY.title;
    link.href = STORY.href!;
    find("end-by").textContent = STORY.by;
    end.hidden = false;
    hint(false);
    setTag(null);
    say.textContent = `${HALL.alt}. ${HALL.tag}`;
    const show = () => {
      if (stopped) return;
      frame = requestAnimationFrame(() => {
        end.dataset.on = "";
        later(() => {
          end.dataset.pan = "";
        }, 900);
      });
    };
    img.decode().then(show, show);
    link.focus({ preventScroll: true });
    flip.hidden = true;
    dialog.removeAttribute("aria-describedby");
  };

  // Without the scene: a tap or the button turns over the next photo.
  const nextPhoto = () => {
    if (step >= ROOMS.length) return;
    const index = step++;
    shot.hidden = false;
    shot.src = CROPS[index];
    shot.dataset.on = "";
    setTag(index);
    if (index === ROOMS.length - 1) later(finish, reduced ? 1400 : 1100);
  };

  // The scene takes over only at rest, in the same pose, so nothing jumps.
  const takeOver = () => {
    if (!arrived || flying || held) return;
    scene = arrived;
    arrived = null;
    stage.ready();
  };

  const onStandIn = (event: Event) => {
    if ((event as AnimationEvent).animationName !== "three-phone-flip") return;
    delete slab.dataset.flip;
    flying = false;
    if (photoOnly) nextPhoto();
    hint(true);
    takeOver();
  };
  const flipStandIn = () => {
    if (flying) return;
    flying = true;
    hint(false);
    setTag(null);
    slab.style.removeProperty("--tx");
    slab.style.removeProperty("--ty");
    delete shot.dataset.on;
    slab.dataset.flip = "";
  };

  // The stage: the thumb goes anywhere.
  let trail: { t: number; x: number; y: number }[] = [];
  let x0 = 0;
  let y0 = 0;
  let pointer: number | null = null;

  const down = (event: PointerEvent) => {
    if ((event.target as Element).closest("button, a") || flying || pointer !== null) return;
    if (!end.hidden || (scene && !scene.canHold())) return;
    pointer = event.pointerId;
    held = true;
    dialog.setPointerCapture(pointer);
    x0 = event.clientX;
    y0 = event.clientY;
    trail = [{ t: event.timeStamp, x: x0, y: y0 }];
    hint(false);
    scene?.hold(0, 0);
  };
  const move = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return;
    // On a slow frame the browser hands over several moves at once: use all of them.
    const moves = event.getCoalescedEvents?.() ?? [];
    for (const each of moves.length ? moves : [event])
      trail.push({ t: each.timeStamp, x: each.clientX, y: each.clientY });
    while (trail.length > 32) trail.shift();
    const dx = event.clientX - x0;
    const dy = event.clientY - y0;
    if (scene) scene.hold(dx / window.innerWidth, dy / window.innerHeight);
    else if (!reduced) {
      slab.style.setProperty("--tx", `${Math.max(-18, Math.min(18, -dy * 0.11))}deg`);
      slab.style.setProperty("--ty", `${Math.max(-14, Math.min(14, dx * 0.08))}deg`);
    }
  };
  const up = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return;
    pointer = null;
    held = false;
    const now = trail[trail.length - 1];
    let from = trail[Math.max(0, trail.length - 2)];
    for (let i = trail.length - 2; i >= 0 && now.t - trail[i].t <= 90; i--) from = trail[i];
    const span = Math.max(16, now.t - from.t) / 1000;
    // The whole gesture counts too, so a dropped frame at the end cannot lose a flick.
    const whole = Math.max(16, now.t - trail[0].t) / 1000;
    const vy = Math.min((now.y - from.y) / span, whole < 0.32 ? (now.y - y0) / whole : 0);
    const vx = (now.x - from.x) / span;
    const flicked = event.type === "pointerup" && -vy > 380 && y0 - now.y > 18;
    const power = Math.min(1, Math.max(0, (-vy - 380) / 2600));
    const dx = Math.max(-1, Math.min(1, vx / 1500));
    if (scene) {
      if (flicked) scene.flick(power, dx);
      else scene.drop();
    } else if (flicked && !reduced) flipStandIn();
    else {
      slab.style.removeProperty("--tx");
      slab.style.removeProperty("--ty");
      if (reduced) nextPhoto();
      hint(true);
      takeOver();
    }
  };
  const onFlip = () => {
    flip.dataset.show = "";
    if (scene) scene.flick(0.5, 0, true);
    else if (reduced) nextPhoto();
    else flipStandIn();
  };
  const noDrag = (event: Event) => event.preventDefault();

  dialog.addEventListener("pointerdown", down);
  dialog.addEventListener("pointermove", move);
  dialog.addEventListener("pointerup", up);
  dialog.addEventListener("pointercancel", up);
  dialog.addEventListener("dragstart", noDrag);
  slab.addEventListener("animationend", onStandIn);
  flip.addEventListener("click", onFlip);
  hint(true);

  // A keyboard arrived on Close, and the stage's own control is the one it wants.
  if (dialog.querySelector(".three-stage-close")?.matches(":focus-visible")) flip.focus();

  if (!reduced) {
    import("@/lib/flipped-phone-scene")
      .then(({ startPhoneScene }) =>
        startPhoneScene(stage, CROPS, HALL.src, {
          onLift() {
            hint(false);
            setTag(null);
          },
          onRest: () => hint(true),
          onReveal: setTag,
          onDive: () => setTag(null),
          onDived: finish,
        }),
      )
      .then((made) => {
        if (stopped) {
          made.stop();
          return;
        }
        arrived = made;
        takeOver();
      })
      .catch(() => {
        photoOnly = true;
      });
  }

  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    timers.forEach(clearTimeout);
    sizes.disconnect();
    (scene ?? arrived)?.stop();
    dialog.removeEventListener("pointerdown", down);
    dialog.removeEventListener("pointermove", move);
    dialog.removeEventListener("pointerup", up);
    dialog.removeEventListener("pointercancel", up);
    dialog.removeEventListener("dragstart", noDrag);
    slab.removeEventListener("animationend", onStandIn);
    flip.removeEventListener("click", onFlip);
  };
};

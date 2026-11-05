/**
 * The stage: the one full-screen shell every three.js piece plays in, and the
 * same dialog as the slow step. The door's icon lifts out of the page and
 * stands in until the piece arrives, Close sits in the same place, and Close,
 * Escape and the back button all end here: focus returns to the door and the
 * page has not moved. Reached only from ThreeDoorOpener, on a press, and it
 * brings its own CSS (src/app/three-stage.css). It holds no three.js: each
 * piece is a dynamic import in STAGES, and pulls three.js and
 * src/lib/three-stage.ts in behind it. If WebGL goes away mid-piece the stage
 * closes, and without WebGL the stand-in is the stage, or the door is a link.
 */

import "@/app/three-stage.css";
import { holdScroll } from "@/lib/hold-scroll";

export type Stage = {
  /** The open dialog, for reading tokens and for anything a piece adds to it. */
  dialog: HTMLDialogElement;
  /** Fills the stage, and stays hidden until ready(). */
  canvas: HTMLCanvasElement;
  /** Holds what shows before the piece arrives. */
  slot: HTMLElement;
  /** An overlay at the foot, in the slow step's text styles, for a line or two of words. */
  foot: HTMLElement;
  /** Reduced-motion visitors get a still. */
  reduced: boolean;
  /** The first frame is up: fades the canvas in over the stand-in. Safe to call every frame. */
  ready: () => void;
  /** Leaves, just as Close does. */
  close: () => void;
};

/** A piece's module exports this. Returns a function that ends it, once, whatever it started. */
export type StartStage = (stage: Stage) => (() => void) | Promise<() => void>;

type StageEntry = {
  /** Its module, with three.js behind it. Always a dynamic import. */
  load: () => Promise<{ start: StartStage }>;
  /** A mono label at the top left. */
  label?: string;
  /**
   * Replaces the icon in the slot, at once, and is the whole stage without
   * WebGL. Must not touch three.js. Leave it out and the icon stands in, and
   * without WebGL the door is a plain link.
   */
  standIn?: (slot: HTMLElement) => void;
};

/**
 * Without WebGL the flipped phone is the stage photos in their own dialog
 * (PhotoDialog.tsx). The stage closes before it paints, and the photo opens once
 * the shell has finished, so focus goes back to the door and then returns to it.
 */
function photosWithoutWebgl(slot: HTMLElement) {
  if (webglSupported()) return;
  const dialog = slot.closest("dialog")!;
  queueMicrotask(() => {
    dialog.addEventListener(
      "close",
      () => document.querySelector<HTMLElement>("a[data-photo]")?.click(),
      { once: true },
    );
    dialog.close();
  });
}

/** Every stage, by its door's `stage` prop. One line each, so a new piece adds nothing else here. */
const STAGES: Record<string, StageEntry> = {
  "flipped-phone": { load: () => import("@/lib/flipped-phone"), standIn: photosWithoutWebgl },
  "loose-leaf": {
    load: () => import("@/lib/loose-leaf"),
    label: "How Merkle proofs work",
    // Its drawing is the same module, which has no three.js in it. Without it, the stage leaves.
    standIn: (slot) => {
      import("@/lib/loose-leaf")
        .then(({ standIn }) => standIn(slot))
        .catch(() => slot.parentElement?.dispatchEvent(new Event("cancel")));
    },
  },
};

/** The way out, in ms: as long as the slow step's. */
const LEAVE = 280;

let webgl: boolean | undefined;
let active = false;

/** three.js needs WebGL 2. Asked once, and the test context is handed straight back. */
export function webglSupported() {
  if (webgl === undefined) {
    const gl = document.createElement("canvas").getContext("webgl2");
    webgl = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return webgl;
}

export function openStage(door: HTMLAnchorElement) {
  const entry = STAGES[door.dataset.three!];
  if (active || !door.isConnected) return;
  if (!entry || (!webglSupported() && !entry.standIn)) {
    location.assign(door.href);
    return;
  }
  active = true;

  const dialog = document.createElement("dialog");
  dialog.className = "three-stage";
  dialog.dataset.three = door.dataset.three;
  dialog.setAttribute("aria-label", door.getAttribute("aria-label") ?? "");
  dialog.innerHTML = `
    <canvas class="three-stage-canvas"></canvas>
    <div class="three-stage-slot"><span class="three-door three-stage-icon"></span></div>
    <div class="three-stage-top">
      <p class="three-stage-label"></p>
      <button type="button" class="video-dialog-close three-stage-close">Close</button>
    </div>
    <div class="three-stage-foot"></div>`;
  const find = <T extends Element>(name: string) =>
    dialog.querySelector<T>(`.three-stage-${name}`)!;
  const canvas = find<HTMLCanvasElement>("canvas");
  const slot = find<HTMLElement>("slot");
  const icon = find<HTMLElement>("icon");
  const drawing = door.querySelector("svg");
  if (drawing) icon.append(drawing.cloneNode(true));
  find("label").textContent = entry.label ?? "";
  entry.standIn?.(slot);

  let stop: (() => void) | undefined;
  let leaving = false;
  let finished = false;
  let pushed = false;
  let release = () => {};
  let timer = 0;

  // How far the icon is from its place on the page, wherever the lift has got to.
  const setLift = () => {
    if (!icon.isConnected) return;
    const from = door.getBoundingClientRect();
    const to = icon.getBoundingClientRect();
    const { m41, m42 } = new DOMMatrixReadOnly(getComputedStyle(icon).transform);
    const x = from.left + from.width / 2 - (to.left + to.width / 2) + m41;
    const y = from.top + from.height / 2 - (to.top + to.height / 2) + m42;
    dialog.style.setProperty("--lift", `${x}px, ${y}px`);
  };

  const onPop = () => {
    if (pushed) {
      pushed = false;
      shut();
    }
  };

  // Called for itself as well as on the close event, which a browser holds for
  // the next frame, and a hidden tab has none.
  const finish = () => {
    if (finished) return;
    finished = leaving = true;
    window.clearTimeout(timer);
    window.removeEventListener("popstate", onPop);
    canvas.removeEventListener("webglcontextlost", shut);
    stop?.();
    dialog.remove();
    // three.js keeps a little of each renderer, canvas included: not the whole stage too.
    if (stop) dialog.replaceChildren();
    delete door.dataset.out;
    door.focus({ preventScroll: true });
    // The door stays shut until this entry has gone, or a new stage would take
    // the popstate for its own.
    const free = () => {
      active = false;
      release();
    };
    if (pushed) {
      pushed = false;
      window.addEventListener("popstate", free, { once: true });
      history.back();
    } else {
      free();
    }
  };

  const shut = () => {
    if (!dialog.open || leaving) return;
    leaving = true;
    const end = () => {
      dialog.close();
      finish();
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      end();
      return;
    }
    // The icon goes back to its door. The piece runs on under the fade.
    setLift();
    dialog.dataset.closing = "";
    timer = window.setTimeout(end, LEAVE);
  };

  const onEvent = (event: Event) => {
    switch (event.type) {
      case "click":
        if ((event.target as Element).closest(".three-stage-close")) shut();
        break;
      case "keydown": {
        const { key, repeat } = event as KeyboardEvent;
        // A held key presses once, not again on whatever has the focus by now.
        if (repeat && (key === " " || key === "Enter")) event.preventDefault();
        break;
      }
      case "cancel":
        if (event.target === dialog) {
          event.preventDefault();
          shut();
        }
        break;
      case "close":
        if (event.target === dialog) finish();
    }
  };

  for (const type of ["click", "keydown", "cancel", "close"])
    dialog.addEventListener(type, onEvent);
  window.addEventListener("popstate", onPop);
  canvas.addEventListener("webglcontextlost", shut);

  document.body.append(dialog);
  dialog.showModal();
  if (icon.isConnected) {
    door.dataset.out = "";
    setLift();
  }
  // An entry of its own, so the back button leaves the stage and not the page.
  try {
    release = holdScroll();
    history.pushState({ threeStage: true }, "");
    pushed = true;
  } catch {}

  if (!webglSupported()) return;
  const stage: Stage = {
    dialog,
    canvas,
    slot,
    foot: find<HTMLElement>("foot"),
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ready: () => {
      dialog.dataset.live = "";
    },
    close: shut,
  };
  entry
    .load()
    .then(async ({ start }) => {
      if (leaving) return;
      const end = await start(stage);
      // It may have closed while the piece was getting ready.
      if (finished) {
        end();
        dialog.replaceChildren();
      } else stop = end;
    })
    // With nothing to show, the stage leaves; a stand-in that drew stays, with its Close.
    .catch(() => {
      if (!entry.standIn || slot.childElementCount < 2) shut();
    });
}

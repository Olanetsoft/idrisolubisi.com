"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { holdScroll } from "@/lib/hold-scroll";
import type { SlowStepItem } from "@/lib/slow-step";

const EVENTS = [
  "click",
  "contextmenu",
  "keydown",
  "focusin",
  "pointerdown",
  "pointerup",
  "pointercancel",
  "cancel",
  "close",
];

/**
 * The door in the hero intro: a tap, Enter or Space on the highlighted clause
 * opens the slow step, a full-screen game. This is all that ships in the first
 * load: one delegated listener, and a dialog rendered only on first intent, so
 * the prerendered HTML is unchanged. The dialog, the clause's lift and the
 * gates are CSS, so they paint at once; the game itself, src/lib/slow-step.ts,
 * starts loading on the first press or keyboard focus and takes over when it
 * arrives. Close, Escape and the back button all end here: focus returns to
 * the door and the page has not moved. A long press on a touch screen opens it
 * too, in place of the link menu. A modified click, a middle-click or no
 * script is an ordinary link to Projects.
 */
export function SlowStep({ steps }: { steps: SlowStepItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // A reload or a discarded tab keeps the game's history entry but not the game.
    if (history.state?.slowStep) history.back();
    // The bead falls to the buttons, however the sentence has wrapped.
    const pitch = document.querySelector<HTMLElement>(".hero-pitch");
    const lines = pitch?.querySelector("[data-slow-step]")?.getClientRects();
    const button = document.querySelector(".actions .btn")?.getBoundingClientRect();
    if (lines?.length && button) {
      pitch!.style.setProperty("--drip", `${button.top - lines[lines.length - 1].bottom + 4}px`);
    }

    let door: HTMLElement | null = null;
    let pressed: HTMLElement | null = null;
    let stop: (() => void) | undefined;
    let opening = 0;
    let pushed = false;
    let release = () => {};
    let timer = 0;

    // Without the game the dialog still opens, shows the gates and closes.
    const load = () => import("@/lib/slow-step").catch(() => null);
    const halt = () => {
      opening++;
      stop?.();
      stop = undefined;
    };

    // How far the clause is from its place in the sentence, wherever the lift has got to.
    const setLift = (link: HTMLElement, dialog: HTMLDialogElement) => {
      const clause = dialog.querySelector("h2")!;
      const from = link.firstElementChild!.getClientRects();
      const to = clause.firstElementChild!.getClientRects()[0];
      const { m41, m42 } = new DOMMatrixReadOnly(getComputedStyle(clause).transform);
      // A clause that wraps can't slide sideways into a different wrap, so it only lifts.
      const lift = {
        x: from.length > 1 ? 0 : from[0].left - to.left + m41,
        y: from[0].top - to.top + m42,
      };
      dialog.style.setProperty("--lift", `${lift.x}px, ${lift.y}px`);
      return lift;
    };

    const open = (link: HTMLElement) => {
      flushSync(() => setArmed(true));
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      door = link;
      const text = dialog.querySelector("h2 span")!;
      text.textContent = link.textContent;
      dialog.style.removeProperty("--lift");
      dialog.showModal();
      const lift = setLift(link, dialog);
      // An entry of its own, so the back button leaves the game and not the page.
      try {
        release = holdScroll();
        history.pushState({ slowStep: true }, "");
        pushed = true;
      } catch {}
      const openedAt = performance.now();
      const mine = ++opening;
      load().then((game) => {
        if (game && mine === opening) stop = game.startSlowStep(dialog, steps, lift, openedAt);
      });
    };

    const shut = () => {
      const dialog = dialogRef.current;
      if (!dialog?.open || "closing" in dialog.dataset) return;
      halt();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        dialog.close();
        return;
      }
      // The clause goes back into its sentence (see [data-closing] in globals.css).
      setLift(door!, dialog);
      dialog.dataset.closing = "";
      timer = window.setTimeout(() => {
        delete dialog.dataset.closing;
        dialog.close();
      }, 280);
    };

    const onEvent = (event: Event) => {
      const dialog = dialogRef.current;
      const target = event.target as Element;
      const link = target.closest?.<HTMLElement>("[data-slow-step]");
      switch (event.type) {
        case "popstate":
          if (pushed) {
            pushed = false;
            shut();
          }
          break;
        case "pointerup":
        case "pointercancel":
          pressed?.removeAttribute("data-press");
          pressed = null;
          break;
        case "pointerdown":
          if (!link) break;
          link.dataset.press = "";
          pressed = link;
        // falls through
        case "focusin":
          if (!link) break;
          load();
          setArmed(true);
          break;
        case "keydown": {
          const { key, repeat } = event as KeyboardEvent;
          // A held key presses once, not again on whatever has the focus by now.
          if (repeat && (link || dialog?.open) && (key === " " || key === "Enter")) {
            event.preventDefault();
            break;
          }
          // The role is button, so Space works as well as Enter (a link's click).
          if (link && key === " ") {
            event.preventDefault();
            open(link);
          }
          break;
        }
        case "contextmenu":
          if (link && (event as PointerEvent).pointerType === "touch") {
            event.preventDefault();
            open(link);
          }
          break;
        case "cancel":
          if (target === dialog) {
            event.preventDefault();
            shut();
          }
          break;
        case "close":
          if (target !== dialog) break;
          halt();
          door?.focus({ preventScroll: true });
          // A result link replaces this entry, so Back from the card leaves the game behind.
          if (dialog?.returnValue) {
            pushed = false;
            location.replace(dialog.returnValue);
            dialog.returnValue = "";
            release();
          } else if (pushed) {
            pushed = false;
            window.addEventListener("popstate", release, { once: true });
            history.back();
          } else {
            release();
          }
          break;
        case "click": {
          const { button, metaKey, ctrlKey, shiftKey, altKey } = event as MouseEvent;
          if (target.closest?.(".slow-step-close")) shut();
          if (!link || button !== 0 || metaKey || ctrlKey || shiftKey || altKey) break;
          event.preventDefault();
          open(link);
        }
      }
    };

    for (const type of EVENTS) document.addEventListener(type, onEvent, true);
    window.addEventListener("popstate", onEvent);
    return () => {
      for (const type of EVENTS) document.removeEventListener(type, onEvent, true);
      window.removeEventListener("popstate", onEvent);
      window.clearTimeout(timer);
      halt();
    };
  }, [steps]);

  if (!armed) return null;
  return (
    <dialog
      ref={dialogRef}
      className="slow-step"
      aria-labelledby="slow-step-clause"
      aria-describedby="slow-step-how"
    >
      <div className="slow-step-top">
        <p className="slow-step-fixes" aria-hidden="true">
          fixes
          <i className="slow-step-pip" />
          <i className="slow-step-pip" />
          <i className="slow-step-pip" />
        </p>
        <button type="button" className="video-dialog-close slow-step-close">
          Close
        </button>
      </div>
      <h2 className="slow-step-clause" id="slow-step-clause">
        <span />
      </h2>
      <p className="sr-only" id="slow-step-how">
        Five steps on a path, each with a button that ships a fix at that step. You have three
        fixes.
      </p>
      <div className="slow-step-gates">
        {steps.map(({ key, step }, i) => (
          <button
            key={key}
            type="button"
            className="slow-step-gate"
            style={{ "--i": i } as CSSProperties}
          >
            <i className="slow-step-gate-dot" aria-hidden="true" />
            <span className="slow-step-gate-name">{step}</span>
            <span className="sr-only" />
          </button>
        ))}
      </div>
    </dialog>
  );
}

"use client";

import { useEffect } from "react";

let backed = false;

/**
 * The one listener behind every ThreeDoor, and all of the stages that ships in
 * the first load. A click, Enter or Space on a door fetches the shell
 * (src/lib/three-shell.ts), and the shell fetches three.js; a press that turns
 * into a scroll never becomes a click, so it opens nothing. A modified click,
 * a middle-click, a failed fetch or no script is an ordinary link.
 */
export function ThreeDoorOpener() {
  useEffect(() => {
    // A reload or a discarded tab keeps the stage's history entry but not the stage.
    if (history.state?.threeStage && !backed) {
      backed = true;
      history.back();
    }

    const onEvent = (event: Event) => {
      const door = (event.target as Element).closest?.<HTMLAnchorElement>("a[data-three]");
      const { button, key, metaKey, ctrlKey, shiftKey, altKey } = event as MouseEvent &
        KeyboardEvent;
      if (!door || button || metaKey || ctrlKey || shiftKey || altKey) return;
      // The role is button, so Space works as well as Enter (a link's click).
      if (event.type === "keydown" && key !== " ") return;
      event.preventDefault();
      import("@/lib/three-shell")
        .then(({ openStage }) => openStage(door))
        .catch(() => location.assign(door.href));
    };

    document.addEventListener("click", onEvent);
    document.addEventListener("keydown", onEvent);
    return () => {
      document.removeEventListener("click", onEvent);
      document.removeEventListener("keydown", onEvent);
    };
  }, []);

  return null;
}

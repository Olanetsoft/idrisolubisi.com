"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { StagePhoto } from "@/data/talks";

/**
 * The stage photos open larger on the page: a click on one shows it whole
 * (not cropped) in a dialog, with its caption. Previous and Next, or the
 * arrow keys, move between them, and a screen reader hears which photo is
 * showing; Escape, Close or a click outside closes it, and focus returns to
 * the photo. A modified click or no script opens the
 * image file as a normal link. Phones show the lead photo as a plain
 * picture: there the links lose their href, so they are neither a dead tap
 * nor a focus stop, and get it back on a wider screen.
 */
export function PhotoDialog({ photos }: { photos: StagePhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const photo = index === null ? null : photos[index];
  const step = (by: number) =>
    setIndex((i) => (i === null ? i : (i + by + photos.length) % photos.length));

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-photo]");
      if (!link || !dialogRef.current) return;
      event.preventDefault();
      setIndex(Number(link.dataset.photo));
      dialogRef.current.showModal();
    };
    document.addEventListener("click", onClick);
    const phone = window.matchMedia("(max-width: 759px)");
    const sync = () => {
      for (const link of document.querySelectorAll<HTMLAnchorElement>("a[data-photo]")) {
        const href = link.getAttribute("href") ?? link.dataset.href;
        if (!href) continue;
        link.dataset.href = href;
        if (phone.matches) link.removeAttribute("href");
        else link.setAttribute("href", href);
      }
    };
    sync();
    phone.addEventListener("change", sync);
    return () => {
      document.removeEventListener("click", onClick);
      phone.removeEventListener("change", sync);
    };
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="video-dialog photo-dialog"
      aria-label={photo ? `Photo: ${photo.tag}` : "Photo"}
      onClose={() => setIndex(null)}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      <div className="video-dialog-head">
        <p className="video-dialog-title">{photo?.tag}</p>
        <button type="button" className="video-dialog-close" onClick={close}>
          Close
        </button>
      </div>
      {/* Says which photo is showing after Previous, Next or an arrow key. */}
      <p className="sr-only" aria-live="polite">
        {photo && index !== null ? `Photo ${index + 1} of ${photos.length}: ${photo.tag}` : ""}
      </p>
      <div className="photo-dialog-frame">
        {photo && (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 1023px) 100vw, 960px"
            // The box is sized before the image arrives, so the dialog opens
            // at its full size instead of growing from a strip.
            style={{
              aspectRatio: `${photo.width} / ${photo.height}`,
              width: `min(100%, calc((100dvh - 9rem) * ${photo.width} / ${photo.height}))`,
            }}
          />
        )}
      </div>
      {photos.length > 1 && (
        <div className="photo-dialog-foot">
          <button type="button" className="video-dialog-close" onClick={() => step(-1)}>
            Previous
          </button>
          <button type="button" className="video-dialog-close" onClick={() => step(1)}>
            Next
          </button>
        </div>
      )}
    </dialog>
  );
}

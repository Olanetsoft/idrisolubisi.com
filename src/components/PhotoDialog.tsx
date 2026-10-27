"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { StagePhoto } from "@/data/talks";

/**
 * The stage photos open larger on the page: a click on one shows it whole
 * (not cropped) in a dialog, with its caption. Previous and Next, or the
 * arrow keys, move between them; Escape, Close or a click outside closes it,
 * and focus returns to the photo. A modified click or no script opens the
 * image file as a normal link.
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
    return () => document.removeEventListener("click", onClick);
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
      <div className="photo-dialog-frame">
        {photo && (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 1023px) 100vw, 960px"
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

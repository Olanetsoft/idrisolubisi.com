"use client";

import { useEffect, useRef, useState } from "react";

type Video = { id: string; start?: number; title: string; href: string };

/**
 * Talk thumbnails play on the page: a click on a video link opens it in a
 * dialog over the page instead of leaving for YouTube. YouTube (the privacy
 * enhanced player) loads only then. Escape, the close button or a click
 * outside closes it, and focus returns to the thumbnail. Middle-click, a
 * modified click or no script still opens YouTube as a normal link, and so
 * does a tap on a phone, where the YouTube app or page is the better player.
 */
export function VideoDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (window.matchMedia("(max-width: 759px)").matches) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-video-id]");
      if (!link || !dialogRef.current) return;
      event.preventDefault();
      setVideo({
        id: link.dataset.videoId!,
        start: link.dataset.videoStart ? Number(link.dataset.videoStart) : undefined,
        title: link.dataset.videoTitle ?? "Video",
        href: link.href,
      });
      dialogRef.current.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="video-dialog"
      aria-label={video?.title ?? "Video"}
      onClose={() => setVideo(null)}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="video-dialog-head">
        <p className="video-dialog-title">{video?.title}</p>
        <button type="button" className="video-dialog-close" onClick={close}>
          Close
        </button>
      </div>
      <div className="video-dialog-frame">
        {video && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0${video.start ? `&start=${video.start}` : ""}`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}
      </div>
      {video && (
        <p className="video-dialog-foot">
          <a href={video.href}>Watch on YouTube</a>
        </p>
      )}
    </dialog>
  );
}

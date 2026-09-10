"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  id?: string;
};

/** Fades content in the first time it scrolls into view. No-op when JS is unavailable. */
export function Reveal({ children, as = "div", className = "", delay = 0, id }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  const style = { "--delay": `${delay}s` } as CSSProperties;

  return (
    <Tag ref={ref} id={id} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

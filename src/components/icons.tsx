// Logos from Simple Icons (CC0, simpleicons.org) and two-tone icons from
// Phosphor (MIT, phosphoricons.com). The shapes live in icon-data.json and
// are built into one sprite, public/icons.svg (npm run icons), which the
// browser downloads once; each icon here is just a <use> reference to it.
// Brand logos keep their brand colour unless it would vanish on the page.
import type { CSSProperties } from "react";
import data from "./icon-data.json";

type Brand = { title: string; path: string; color: string | null; colorLight?: string };

const BRANDS: Record<string, Brand> = data.brands;

export type BrandName = keyof typeof data.brands;
export type UiName = keyof typeof data.ui;

/** A brand logo, decorative: the link or text next to it carries the name. */
export function BrandIcon({ name, size = 16 }: { name: BrandName; size?: number }) {
  const brand = BRANDS[name];
  const style = {
    "--brand": brand.color ?? "currentColor",
    ...(brand.colorLight ? { "--brand-light": brand.colorLight } : {}),
  } as CSSProperties;
  return (
    <svg
      className="brand-icon"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      <use href={`/icons.svg#b-${name}`} />
    </svg>
  );
}

/** A two-tone icon: a soft filled shape under a crisp outline, in the current colour. Decorative. */
export function UiIcon({ name, size = 16 }: { name: UiName; size?: number }) {
  return (
    <svg
      className="ui-icon"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/icons.svg#u-${name}`} />
    </svg>
  );
}

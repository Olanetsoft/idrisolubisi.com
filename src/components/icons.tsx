// Logos from Simple Icons (CC0, simpleicons.org). The shapes live in
// icon-data.json and are built into one sprite, public/icons.svg (npm run
// icons), which the browser downloads once; each icon here is just a <use>
// reference to it. One rule: a mark appears only where it identifies a
// profile you are about to visit (the Contact links), in the text colour.
import data from "./icon-data.json";

export type BrandName = keyof typeof data.brands;

/** A brand mark, decorative: the link text next to it carries the name. */
export function BrandIcon({ name, size = 16 }: { name: BrandName; size?: number }) {
  return (
    <svg className="brand-icon" width={size} height={size} aria-hidden="true" focusable="false">
      <use href={`/icons.svg#b-${name}`} />
    </svg>
  );
}

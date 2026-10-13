import { lenses } from "@/data/lenses";
import { renderProfileOg } from "@/lib/og-image";

export const alt = lenses.fde.metaTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderProfileOg({
    role: lenses.fde.title,
    blurb: "Embeds with engineering teams, ships the integration through launch, then turns the pattern into tooling.",
    address: "idrisolubisi.com/forward-deployed",
  });
}

import { lenses } from "@/data/lenses";
import { renderProfileOg } from "@/lib/og-image";

export const alt = lenses.ai.metaTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderProfileOg({
    role: lenses.ai.title,
    blurb: "Builds agents and the harness around them: tools, verification, safety layers and observability.",
    address: "idrisolubisi.com/ai-engineer",
  });
}

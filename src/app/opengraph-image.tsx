import { renderProfileOg } from "@/lib/og-image";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderProfileOg({
    role: `${site.role} · UK`,
    blurb:
      "Founder of Web3 Afrika and freeCodeCamp author, helping developers and builders succeed with AI and Web3.",
    address: "idrisolubisi.com",
  });
}

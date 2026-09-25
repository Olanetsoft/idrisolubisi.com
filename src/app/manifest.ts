import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { THEME_COLOR } from "@/lib/theme";

// Served at /manifest.webmanifest, the same address the old site used.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.metaDescription,
    start_url: "/",
    display: "browser",
    background_color: THEME_COLOR.light,
    theme_color: THEME_COLOR.light,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgFont = { name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 600 };

// Request the CSS with a legacy UA so Google serves TTF, which next/og can embed.
async function loadGoogleFont(family: string, weight: 400 | 600): Promise<OgFont | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@${weight}&display=swap`,
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0" } },
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(truetype|opentype|woff)'\)/)?.[1];
    if (!url) return null;
    return { name: family, data: await fetch(url).then((r) => r.arrayBuffer()), style: "normal", weight };
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const fonts = (await Promise.all([loadGoogleFont("Geist", 600), loadGoogleFont("Geist", 400)])).filter(
    (f): f is OgFont => f !== null,
  );
  const family = fonts.length ? "Geist" : "Helvetica, Arial, sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#ffffff",
          color: "#111827",
          fontFamily: family,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 600, letterSpacing: -1.5 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 32, color: "#374151" }}>{site.role} · London</div>
          <div style={{ display: "flex", fontSize: 26, color: "#6b7280", maxWidth: 1000, lineHeight: 1.35 }}>
            {site.tagline}. Built the open-source Midnight MCP server; founder of Web3 Afrika; freeCodeCamp
            author read 10M+ times.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6b7280" }}>
          <div style={{ display: "flex" }}>idrisolubisi.com</div>
          <div style={{ display: "flex" }}>@olanetsoft</div>
        </div>
      </div>
    ),
    fonts.length ? { ...size, fonts } : size,
  );
}

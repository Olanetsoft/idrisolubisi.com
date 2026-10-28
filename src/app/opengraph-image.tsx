import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { COLORS } from "@/lib/tokens";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgFont = { name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 600 };

// Request the CSS with a legacy UA so Google serves TTF, which next/og can embed.
async function loadGoogleFont(family: string, weight: 400 | 600): Promise<OgFont | null> {
  try {
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@${weight}&display=swap`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0",
        },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(truetype|opentype|woff)'\)/)?.[1];
    if (!url) return null;
    // A failed font download would otherwise hand next/og an error page as a font.
    const fontRes = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!fontRes.ok) return null;
    return {
      name: family,
      data: await fontRes.arrayBuffer(),
      style: "normal",
      weight,
    };
  } catch {
    return null;
  }
}

// The share image uses the dark theme, the site's default.
const C = COLORS.dark;

export default async function OpenGraphImage() {
  const fonts = (
    await Promise.all([loadGoogleFont("IBM Plex Sans", 600), loadGoogleFont("IBM Plex Sans", 400)])
  ).filter((f): f is OgFont => f !== null);
  const family = fonts.length ? "IBM Plex Sans" : "Helvetica, Arial, sans-serif";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: C.bg,
        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        color: C.text,
        fontFamily: family,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 600, letterSpacing: 0 }}>
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: C.text2 }}>
          {site.role} · {site.location}, UK
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: C.text3,
            maxWidth: 1000,
            lineHeight: 1.35,
          }}
        >
          Backend engineer turned developer relations engineer and educator, now building AI agents.
          Founder of Web3 Afrika and freeCodeCamp author.
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: C.text3 }}
      >
        <div style={{ display: "flex", color: C.accent }}>idrisolubisi.com</div>
        <div style={{ display: "flex" }}>@olanetsoft</div>
      </div>
    </div>,
    fonts.length ? { ...size, fonts } : size,
  );
}

import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgFont = { name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 500 };

// Request the CSS with a legacy UA so Google serves TTF, which next/og can embed.
async function loadGoogleFont(family: string, weight: 400 | 500): Promise<OgFont | null> {
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
  const fonts = (await Promise.all([loadGoogleFont("Literata", 500), loadGoogleFont("Martian Mono", 400)])).filter(
    (f): f is OgFont => f !== null,
  );
  const serif = fonts.some((f) => f.name === "Literata") ? "Literata" : "Georgia, serif";
  const mono = fonts.some((f) => f.name === "Martian Mono") ? "Martian Mono" : "monospace";
  const f = site.figures.toolCalls;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px 48px",
          background: "#f4f1ea",
          color: "#131311",
          fontFamily: serif,
        }}
      >
        <div style={{ display: "flex", fontFamily: mono, fontSize: 20, color: "#45433e" }}>
          {site.name} · {site.role} · London
        </div>
        <div style={{ display: "flex", fontSize: 58, lineHeight: 1.12, fontWeight: 500, width: 1000 }}>
          The first developer to read your docs is now an AI agent. I built the server it calls.
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", fontFamily: mono, fontSize: 104, lineHeight: 1, letterSpacing: -2 }}>
            {f.value}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              background: "#f2c300",
              color: "#131311",
              padding: "4px 10px",
              marginTop: 14,
            }}
          >
            {f.unit}
          </div>
          <div style={{ display: "flex", fontFamily: mono, fontSize: 20, color: "#66635b", marginTop: 18 }}>
            {f.source} · {f.asOf} · idrisolubisi.com
          </div>
        </div>
      </div>
    ),
    // An empty fonts array disables next/og's built-in fallback, so omit it instead.
    fonts.length ? { ...size, fonts } : size,
  );
}

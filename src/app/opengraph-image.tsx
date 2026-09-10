import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgFont = {
  name: string;
  data: ArrayBuffer;
  style: "normal" | "italic";
  weight: 400 | 500;
};

async function loadFraunces(): Promise<OgFont[]> {
  try {
    // Request the CSS with a legacy UA so Google serves TTF, which next/og can embed.
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,400&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0" } },
    ).then((r) => r.text());
    // Parse each @font-face block: satori accepts TTF/OTF/WOFF (not WOFF2).
    const blocks = [...css.matchAll(/@font-face\s*{([^}]+)}/g)].map((m) => m[1]);
    const faces = blocks.flatMap((b) => {
      const style = /font-style:\s*italic/.test(b) ? "italic" : "normal";
      const weight = /font-weight:\s*400/.test(b) ? 400 : 500;
      const url = b.match(/src:\s*url\(([^)]+)\)\s*format\('(truetype|opentype|woff)'\)/)?.[1];
      return url ? [{ style, weight, url } as const] : [];
    });
    if (faces.length === 0) return [];
    return Promise.all(
      faces.map(async (f): Promise<OgFont> => ({
        name: "Fraunces",
        data: await fetch(f.url).then((r) => r.arrayBuffer()),
        style: f.style,
        weight: f.weight,
      })),
    );
  } catch {
    return [];
  }
}

// satori needs every multi-child element to be flex, so the headline is a wrapping row of words.
const headline = [
  ..."I help developers — and their".split(" ").map((text) => ({ text, accent: false })),
  ..."AI agents".split(" ").map((text) => ({ text, accent: true })),
  ..."— adopt hard technology.".split(" ").map((text) => ({ text, accent: false })),
];

export default async function OpenGraphImage() {
  const [fonts, portrait] = await Promise.all([
    loadFraunces(),
    readFile(path.join(process.cwd(), "public/images/idris-portrait.jpg")).then(
      (b) => `data:image/jpeg;base64,${b.toString("base64")}`,
    ),
  ]);
  const serif = fonts.length ? "Fraunces" : "Georgia, serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f3eee4",
          color: "#1b1813",
          fontFamily: serif,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 0 56px 72px",
            width: 760,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "monospace",
              fontSize: 17,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#57514a",
            }}
          >
            Senior Developer Relations Engineer · AI Engineer
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 72,
              lineHeight: 1.02,
              letterSpacing: -2,
              fontWeight: 500,
            }}
          >
            {headline.map((word, i) => (
              <span
                key={i}
                style={{
                  marginRight: 18,
                  ...(word.accent ? { color: "#c8461c", fontStyle: "italic", fontWeight: 400 } : {}),
                }}
              >
                {word.text}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <div style={{ fontSize: 34, letterSpacing: -1, fontWeight: 500 }}>{site.name}</div>
            <div style={{ fontFamily: "monospace", fontSize: 20, color: "#8a8378" }}>idrisolubisi.com</div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 64,
            width: 340,
            height: 502,
            display: "flex",
            border: "2px solid #c8461c",
            transform: "translate(16px, 16px)",
          }}
        />
        <img
          src={portrait}
          alt=""
          width={340}
          height={502}
          style={{
            position: "absolute",
            right: 72,
            top: 64,
            width: 340,
            height: 502,
            objectFit: "cover",
            objectPosition: "50% 10%",
          }}
        />
      </div>
    ),
    // An empty fonts array disables next/og's built-in fallback, so omit it instead.
    fonts.length ? { ...size, fonts } : size,
  );
}

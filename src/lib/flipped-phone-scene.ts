/**
 * The flipped phone in three.js: reached only through src/lib/flipped-phone.ts,
 * after a press. The table is the hero's grid laid flat, with a pool of amber
 * that follows the phone and the slab's own shadow in one shader, and the
 * stage's background shows through it. A second camera hangs over the phone
 * and its picture feeds the phone's screen, so the screen shows a phone on a
 * table showing a phone, each level turned on the last, 30 times a second.
 * Landing face up falls through that tunnel into a photo.
 */

import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  CustomBlending,
  DataTexture,
  Group,
  HalfFloatType,
  LinearFilter,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  OneFactor,
  OneMinusSrcAlphaFactor,
  PerspectiveCamera,
  Quaternion,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Texture,
  UnsignedByteType,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderTarget,
} from "three";
import {
  CZ,
  DT,
  SLAB,
  VIEW,
  fit,
  launch,
  plan,
  restState,
  rot,
  step,
  type Plan,
} from "@/lib/flipped-phone-flight";
import type { Stage } from "@/lib/three-shell";
import {
  createRenderer,
  disposeObject,
  lightStage,
  readBrand,
  watchBrand,
  type Brand,
} from "@/lib/three-stage";

const { w: W, h: H, t: T, r: R } = SLAB;
const BEZEL = 0.028;
const SW = W - 2 * BEZEL;
const SH = H - 2 * BEZEL;
const SR = R - BEZEL * 0.8;
const ROLL = (7.5 * Math.PI) / 180; // each level of the tunnel turns this much on the last
const LEVEL = 0.6; // and is this much smaller
const TICK = 1 / 30; // the tunnel updates at 30 Hz: one tick behind per level
const DEG = Math.PI / 180;
const CELL = 0.25; // the table's grid, three cells to the phone's width
/** Where the shadow's light hangs: near enough overhead. */
const OVERHEAD = new Vector3(1.8, 9, 3.4).multiplyScalar(2.2);
/** The shared rig's key, for the glint on the glass. */
const KEY = new Vector3(-2, 4, 5).normalize();
/** The look of each theme, where the tokens alone do not settle it. */
const LOOK = {
  dark: { pool: 0.12, wide: 0.02, grid: 0.07, lit: 0.38, shade: 1, feed: 1.45, mirror: 0.24 },
  light: { pool: 0.07, wide: 0.02, grid: 0.07, lit: 0.3, shade: 0.36, feed: 1.42, mirror: 0 },
};

type Callbacks = {
  onLift: () => void;
  onRest: () => void;
  onReveal: (index: number) => void;
  onDive: () => void;
  onDived: () => void;
};

export type PhoneScene = {
  canHold: () => boolean;
  /** The thumb, as fractions of the stage from where it landed. */
  hold: (nx: number, ny: number) => void;
  /** Let go without a flick. */
  drop: () => void;
  flick: (power: number, dx: number, keyboard?: boolean) => void;
  stop: () => void;
};

/** The slab: one indexed mesh with true normals, its faces told apart for a theme to colour. */
function slabGeometry() {
  const seg = 6;
  const ringN = 4;
  const b = T * 0.46;
  const loop: number[][] = [];
  for (let c = 0; c < 4; c++) {
    const cx = (c === 0 || c === 3 ? 1 : -1) * (W / 2 - R);
    const cy = (c < 2 ? 1 : -1) * (H / 2 - R);
    for (let i = 0; i <= seg; i++) {
      const a = (c * Math.PI) / 2 + (i / seg) * (Math.PI / 2);
      loop.push([cx, cy, Math.cos(a), Math.sin(a)]);
    }
  }
  const N = loop.length;
  const position: number[] = [];
  const normal: number[] = [];
  const part: number[] = [];
  const index: number[] = [];
  const RIM = 0;
  const FRONT = 1;
  const BACK = 2;
  const LENS = 3;
  const ring = (th: number) => {
    const s = Math.sin(th);
    const c = Math.cos(th);
    const z = th <= Math.PI / 2 ? -T / 2 + b * (1 - c) : T / 2 - b * (1 + c);
    const off = R - b * (1 - s);
    const tint = th < 0.01 ? BACK : th > Math.PI - 0.01 ? FRONT : RIM;
    for (const [cx, cy, nx, ny] of loop) {
      position.push(cx + off * nx, cy + off * ny, z);
      normal.push(s * nx, s * ny, -c);
      part.push(tint);
    }
  };
  const rings = ringN * 2;
  for (let r = 0; r <= rings; r++) ring((r / rings) * Math.PI);
  for (let r = 0; r < rings; r++) {
    for (let i = 0; i < N; i++) {
      const a = r * N + i;
      const b2 = r * N + ((i + 1) % N);
      index.push(a, a + N, b2, b2, a + N, b2 + N);
    }
  }
  const cap = (at: number, z: number, nz: number, tint: number, flip: boolean) => {
    const o = position.length / 3;
    position.push(0, 0, z);
    normal.push(0, 0, nz);
    part.push(tint);
    for (let i = 0; i < N; i++) {
      const a = at * N + i;
      const b2 = at * N + ((i + 1) % N);
      if (flip) index.push(o, b2, a);
      else index.push(o, a, b2);
    }
  };
  cap(0, -T / 2, -1, BACK, true);
  cap(rings, T / 2, 1, FRONT, false);
  // Side buttons, so the edge reads as a phone when it comes round.
  const button = (x: number, y: number, length: number) => {
    const o = position.length / 3;
    const dx = Math.sign(x) * 0.012;
    for (const [sy, sz] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      position.push(x + dx, y + (sy * length) / 2, sz * 0.016);
      normal.push(Math.sign(x), 0, 0);
      part.push(RIM);
    }
    if (x > 0) index.push(o, o + 1, o + 2, o, o + 2, o + 3);
    else index.push(o, o + 2, o + 1, o, o + 3, o + 2);
  };
  button(W / 2, 0.28, 0.26);
  button(-W / 2, 0.36, 0.14);
  button(-W / 2, 0.16, 0.14);
  // A small amber dot on its back, for the camera.
  const lens = position.length / 3;
  const LENS_AT = [W / 2 - 0.17, H / 2 - 0.17, -T / 2 - 0.001];
  position.push(...LENS_AT);
  normal.push(0, 0, -1);
  part.push(LENS);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    position.push(LENS_AT[0] + 0.026 * Math.cos(a), LENS_AT[1] + 0.026 * Math.sin(a), LENS_AT[2]);
    normal.push(0, 0, -1);
    part.push(LENS);
    index.push(lens, lens + 1 + ((i + 1) % 12), lens + 1 + i);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(position), 3));
  geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normal), 3));
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(position.length), 3));
  geometry.setIndex(index);
  /** Colours each part: rim, front, back, lens. */
  return (colors?: Color[]) => {
    if (colors) {
      const attribute = geometry.getAttribute("color") as BufferAttribute;
      part.forEach((p, i) => attribute.setXYZ(i, colors[p].r, colors[p].g, colors[p].b));
      attribute.needsUpdate = true;
    }
    return geometry;
  };
}

function screenGeometry() {
  const seg = 6;
  const points = [[0, 0]];
  for (let c = 0; c < 4; c++) {
    const cx = (c === 0 || c === 3 ? 1 : -1) * (SW / 2 - SR);
    const cy = (c < 2 ? 1 : -1) * (SH / 2 - SR);
    for (let i = 0; i <= seg; i++) {
      const a = (c * Math.PI) / 2 + (i / seg) * (Math.PI / 2);
      points.push([cx + SR * Math.cos(a), cy + SR * Math.sin(a)]);
    }
  }
  const n = points.length;
  const position = new Float32Array(n * 3);
  const normal = new Float32Array(n * 3);
  const uv = new Float32Array(n * 2);
  const index: number[] = [];
  points.forEach(([x, y], i) => {
    position.set([x, y, T / 2 + 0.001], i * 3);
    normal.set([0, 0, 1], i * 3);
    uv.set([x / SW + 0.5, y / SH + 0.5], i * 2);
    if (i) index.push(0, i, i === n - 1 ? 1 : i + 1);
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("normal", new BufferAttribute(normal, 3));
  geometry.setAttribute("uv", new BufferAttribute(uv, 2));
  geometry.setIndex(index);
  return geometry;
}

const SCREEN_VERTEX = `
varying vec2 vScr;
varying vec3 vN, vV;
void main() {
  vScr = uv;
  vec4 p = modelViewMatrix * vec4(position, 1.0);
  vN = normalMatrix * normal;
  vV = -p.xyz;
  gl_Position = projectionMatrix * p;
}
`;

const SCREEN_FRAGMENT = `
varying vec2 vScr;
varying vec3 vN, vV;
uniform sampler2D uTun, uPhoto;
uniform float uDive, uFull, uPill, uGlass, uFeed;
uniform vec3 uSheen, uLight;
const float ASPECT = ${(SW / SH).toFixed(5)};
vec2 turn(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}
float box(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + r;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}
void main() {
  vec2 c = (vScr - 0.5) * vec2(ASPECT, 1.0);
  // uDive falls through whole levels of the tunnel: each one smaller and turned.
  float lv = uDive;
  vec2 tp = turn(c, -${ROLL.toFixed(4)} * lv) * pow(${LEVEL.toFixed(3)}, lv);
  vec3 tun = texture2D(uTun, tp / vec2(ASPECT, 1.0) + 0.5).rgb;
  // Every level darkens toward its own edges: nested, that is what makes it a tunnel.
  tun *= mix(0.6, 1.0, 1.0 - smoothstep(0.1, 0.66, length(c * vec2(1.75, 1.0))));
  tun = tun * uFeed / (1.0 + tun * 0.42);
  float left = 3.0 - lv;
  float scale = pow(${LEVEL.toFixed(3)}, left);
  vec2 pp = turn(c, ${ROLL.toFixed(4)} * left) / max(scale, 0.001);
  float inside = 1.0 - smoothstep(-0.006, 0.0, box(pp, vec2(0.5 * ASPECT, 0.5), 0.05));
  inside *= step(0.002, lv);
  if (uFull > 0.5) inside = 1.0;
  vec3 pho = texture2D(uPhoto, clamp(pp / vec2(ASPECT, 1.0) + 0.5, 0.0, 1.0)).rgb;
  vec3 img = mix(tun, pho, inside);
  float pill = 1.0 - smoothstep(0.0, 0.004, box(c - vec2(0.0, 0.463), vec2(0.052, 0.0135), 0.0135));
  // Glass: a sheen at a low angle, and the light going across it.
  vec3 n = normalize(vN), v = normalize(vV);
  float low = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  float glint = pow(max(dot(reflect(-v, n), uLight), 0.0), 48.0);
  gl_FragColor = vec4(img * (1.0 - pill * uPill) + uSheen * uGlass * (0.02 + low * 0.5 + glint * 0.5), 1.0);
  #include <colorspace_fragment>
}
`;

const TABLE_VERTEX = `
varying vec3 vW;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

// Layers painted over each other, premultiplied, and the stage shows through
// what is left. Mixed in linear light, then encoded straight for the page.
const TABLE_FRAGMENT = `
varying vec3 vW;
uniform vec2 uQ[4], uSpot;
uniform float uSoft, uShade, uGlow, uPool, uFade;
uniform vec3 uAmber, uLine, uInk;
uniform vec4 uLook; // pool, wide, grid, lit
float quad(vec2 p) {
  float d = dot(p - uQ[0], p - uQ[0]), s = 1.0;
  for (int i = 0, j = 3; i < 4; j = i, i++) {
    vec2 e = uQ[j] - uQ[i], w = p - uQ[i];
    vec2 b = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= uQ[i].y, p.y < uQ[j].y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s = -s;
  }
  return s * sqrt(d);
}
vec4 over(vec4 under, vec3 color, float a) {
  return vec4(color * a, a) + under * (1.0 - a);
}
void main() {
  vec2 p = vW.xz, q = p - uSpot;
  float r2 = dot(q, q);
  float pool = exp(-r2 / 1.15), wide = exp(-r2 / 9.0);
  vec4 c = over(vec4(0.0), uAmber, min(1.0, uLook.x * pool * uPool + uLook.y * wide * (0.4 + 0.6 * uPool)));
  // The hero's grid: a hairline wherever a pixel sits on one, lit amber in the pool.
  vec2 g = p / ${CELL.toFixed(3)}, w = fwidth(g);
  vec2 l = abs(fract(g - 0.5) - 0.5) / w;
  float line = (1.0 - min(min(l.x, l.y), 1.0)) * (1.0 - smoothstep(0.12, 0.42, max(w.x, w.y)));
  c = over(c, mix(uLine, uAmber, pool), line * mix(uLook.z * exp(-r2 / 30.0), uLook.w, pool * uPool));
  // The shadow: the slab's outline thrown along the light, sharp at contact, wide when high.
  float d = quad(p) - 0.1;
  float shade = (1.0 - smoothstep(-uSoft, uSoft, d - 0.012)) * uShade;
  float ao = exp(-max(d, 0.0) * 7.0) * uShade * 0.46;
  c = over(c, uInk, min(1.0, 1.0 - (1.0 - shade) * (1.0 - ao)));
  // What the screen throws on the table.
  c = over(c, uAmber, min(1.0, uGlow * exp(-max(d, 0.0) * 3.6)));
  c *= uFade;
  gl_FragColor = vec4(c.rgb / max(c.a, 0.0001), 1.0);
  #include <colorspace_fragment>
  gl_FragColor = vec4(gl_FragColor.rgb * c.a, c.a);
}
`;

/**
 * Builds the scene and resolves with the controls once its first frame is
 * drawn. `photos` are the crops for the phone's screen, in the order they turn
 * over. The first is fetched now, each next one as the last turns over, and the
 * hall as the last does.
 */
export async function startPhoneScene(
  stage: Stage,
  photos: string[],
  hall: string,
  on: Callbacks,
): Promise<PhoneScene> {
  const scene = new Scene();
  const camera = new PerspectiveCamera(VIEW.fov, 1, 0.1, 90);
  const drone = new PerspectiveCamera(30, SW / SH, 0.1, 40);
  let width = 1;
  let height = 1;
  let ratio = Math.min(window.devicePixelRatio || 1, 2);
  let built = false;
  let running = true;
  let afterRest = 0; // frames still to draw, once everything has come to rest

  const view = createRenderer(stage, {
    powerPreference: "high-performance",
    stencil: false,
    antialias: ratio < 2,
    resize(w, h) {
      width = w;
      height = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    draw(dt) {
      if (!built) return false;
      adapt(dt);
      frame(dt);
      return busy();
    },
  });
  const { renderer, wake } = view;

  const blank = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  blank.needsUpdate = true;
  const type =
    renderer.extensions.has("EXT_color_buffer_float") ||
    renderer.extensions.has("EXT_color_buffer_half_float")
      ? HalfFloatType
      : UnsignedByteType;
  const RT_W = 256;
  const RT_H = Math.round(RT_W * (SH / SW));
  const target = {
    type,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    generateMipmaps: false,
    depthBuffer: true,
    stencilBuffer: false,
  };
  let rtA = new WebGLRenderTarget(RT_W, RT_H, target);
  let rtB = new WebGLRenderTarget(RT_W, RT_H, target);

  const S = {
    uTun: { value: rtA.texture as Texture },
    uPhoto: { value: blank as Texture },
    uDive: { value: 0 },
    uFull: { value: 0 },
    uPill: { value: 1 },
    uGlass: { value: 1 },
    uFeed: { value: 1 },
    uSheen: { value: new Color() },
    uLight: { value: new Vector3() },
  };
  const screenMat = new ShaderMaterial({
    uniforms: S,
    vertexShader: SCREEN_VERTEX,
    fragmentShader: SCREEN_FRAGMENT,
  });
  const bodyMat = new MeshStandardMaterial({ vertexColors: true, metalness: 0.35, roughness: 0.4 });
  const mirrorMat = bodyMat.clone();
  mirrorMat.transparent = true;
  mirrorMat.depthWrite = false;

  const slab = slabGeometry();
  const phone = new Group();
  phone.add(new Mesh(slab(), bodyMat), new Mesh(screenGeometry(), screenMat));
  // The black stage is polished enough to show the phone, faintly. Paper is not.
  const mirror = new Mesh(slab(), mirrorMat);
  mirror.matrixAutoUpdate = false;
  mirror.renderOrder = 1;

  const Q = [new Vector2(), new Vector2(), new Vector2(), new Vector2()];
  const U = {
    uQ: { value: Q },
    uSpot: { value: new Vector2() },
    uSoft: { value: 0.03 },
    uShade: { value: 0.9 },
    uGlow: { value: 0 },
    uPool: { value: 1 },
    uFade: { value: 1 },
    uAmber: { value: new Color() },
    uLine: { value: new Color() },
    uInk: { value: new Color() },
    uLook: { value: new Vector4() },
  };
  const tableMat = new ShaderMaterial({
    uniforms: U,
    transparent: true,
    depthWrite: false,
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: OneMinusSrcAlphaFactor,
    vertexShader: TABLE_VERTEX,
    fragmentShader: TABLE_FRAGMENT,
  });
  const tableG = new CircleGeometry(32, 48);
  tableG.rotateX(-Math.PI / 2);
  const table = new Mesh(tableG, tableMat);
  table.frustumCulled = false;
  scene.add(table, mirror, phone);

  let brand = readBrand(stage);
  const relight = lightStage(scene, brand);
  const paint = (next: Brand) => {
    brand = next;
    const look = LOOK[next.theme];
    relight(next);
    // Brass on paper is a pale one: shaded any further it reads as brown wood.
    const rim = next.theme === "light" ? next.amber.clone().lerp(next.raised, 0.42) : next.brass;
    slab([rim, next.paperInk, next.paperInk, next.amber]);
    U.uAmber.value.copy(next.amber);
    U.uLine.value.copy(next.ink);
    U.uInk.value.copy(next.theme === "light" ? next.ink : next.bg);
    U.uLook.value.set(look.pool, look.wide, look.grid, look.lit);
    S.uFeed.value = look.feed;
    S.uSheen.value.copy(next.ink);
    mirror.visible = look.mirror > 0;
  };
  paint(brand);
  const stopWatch = watchBrand(stage, (next) => {
    paint(next);
    afterRest = 10;
    wake();
  });

  // ---- Simulation state ----
  const s = restState();
  let mode: "rest" | "held" | "air" | "done" = "rest";
  let flight: Plan | null = null;
  let misses = 0;
  let found = 0;
  let thrown = 0;
  let waiting = -1;
  let reveal = 0;
  let revealTo = 0;
  let innerPhoto = false;
  let early = false;
  let diveEase = 0;
  let acc = 0;
  let tunClock = 0;
  const shots: { texture: Texture | null }[] = [];
  const hold = { a: 0, b: 0, ta: 0, tb: 0, base: new Quaternion() };
  const cam = { x: 0, z: 0, y: 0, az: 0, azTo: 0, kick: 0 };
  const dive = {
    t: -2,
    wait: 0,
    from: new Vector3(),
    to: new Vector3(),
    qf: new Quaternion(),
    qt: new Quaternion(),
  };
  const pool = { v: 1, to: 1 };
  const flip = new Matrix4().makeScale(1, -1, 1);
  const v3 = [0, 0, 0];
  const turn = new Quaternion();
  const right = new Vector3();
  const fwd = new Vector3();

  const setHeadings = () => {
    right.set(Math.cos(cam.az), 0, -Math.sin(cam.az));
    fwd.set(-Math.sin(cam.az), 0, -Math.cos(cam.az));
  };

  const applyPhoto = (i: number) => {
    S.uPhoto.value = shots[i].texture!;
    revealTo = 1;
    wake();
  };

  const needPhoto = (i: number) => {
    if (i >= photos.length || shots[i]) return shots[i];
    const shot: (typeof shots)[number] = { texture: null };
    shots[i] = shot;
    const image = new Image();
    image.src = photos[i];
    image
      .decode()
      .then(() => {
        if (!running) return;
        const texture = new Texture(image);
        texture.colorSpace = SRGBColorSpace;
        texture.minFilter = LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        shot.texture = texture;
        renderer.initTexture(texture);
        if (waiting === i) {
          waiting = -1;
          applyPhoto(i);
        }
      })
      .catch(() => {});
    return shot;
  };
  needPhoto(0);

  const showPhoto = (i: number) => {
    pool.to = 0.34;
    if (shots[i]?.texture) applyPhoto(i);
    else {
      needPhoto(i);
      waiting = i;
    }
    needPhoto(i + 1);
    on.onReveal(i);
    if (i === photos.length - 1) {
      dive.t = -1.35;
      dive.wait = 0;
      new Image().src = hall;
    } else on.onRest();
    wake();
  };

  const syncPhone = () => {
    phone.position.set(s.px, s.py, s.pz);
    phone.quaternion.set(s.qx, s.qy, s.qz, s.qw);
    phone.updateMatrix();
    phone.updateMatrixWorld(true);
    mirror.matrix.copy(phone.matrix).premultiply(flip);
    mirror.matrixWorldNeedsUpdate = true;
  };

  // The slab's outline thrown along the light onto the table.
  const shadowUniforms = () => {
    const quarters = [
      [W / 2, H / 2],
      [-W / 2, H / 2],
      [-W / 2, -H / 2],
      [W / 2, -H / 2],
    ];
    quarters.forEach(([x, y], i) => {
      rot(s, x * 0.74, y * 0.875, 0, v3);
      const k = OVERHEAD.y / Math.max(OVERHEAD.y - (s.py + v3[1]), 0.2);
      Q[i].set(
        OVERHEAD.x + (s.px + v3[0] - OVERHEAD.x) * k,
        OVERHEAD.z + (s.pz + v3[2] - OVERHEAD.z) * k,
      );
    });
    const h = Math.max(0, s.py - CZ);
    const look = LOOK[brand.theme];
    U.uSoft.value = 0.016 + h * 0.13;
    U.uShade.value = look.shade * 0.94 * Math.max(0.42, 1 - h * 0.16);
    rot(s, 0, 0, 1, v3);
    const lit = reveal > 0.02 ? reveal * 0.1 * Math.max(0, v3[1]) * Math.exp(-h * 2) : 0;
    U.uGlow.value = Math.max(0, -v3[1]) * 0.085 * Math.exp(-h * 0.45) + lit;
    U.uPool.value = pool.v;
    mirrorMat.opacity = look.mirror * Math.exp(-h * 1.5) * U.uFade.value;
  };

  const impact = () => {
    const force = Math.min(s.impact, 16);
    cam.kick = force * 0.0035;
    if (force > 2.5) navigator.vibrate?.(14);
  };

  const nearestAz = (yaw: number, up: boolean) => {
    const wrap = (a: number) => a - 2 * Math.PI * Math.round((a - cam.az) / (2 * Math.PI));
    if (up) return wrap(yaw);
    const a = wrap(yaw);
    const b = wrap(yaw + Math.PI);
    return Math.abs(a - cam.az) < Math.abs(b - cam.az) ? a : b;
  };

  const landed = () => {
    if (mode !== "air") return;
    setHeadings();
    const up = s.upRest > 0;
    flight = null;
    mode = "rest";
    cam.azTo = nearestAz(s.yawRest, up);
    afterRest = 10;
    if (thrown && up) {
      thrown = 0;
      misses = 0;
      showPhoto(found++);
      return;
    }
    if (thrown) misses++;
    thrown = 0;
    on.onRest();
  };

  const stepSim = (dt: number) => {
    acc += dt;
    while (acc >= DT) {
      acc -= DT;
      const { hit, asleep } = s;
      step(s);
      if (s.hit && !hit) impact();
      if (s.asleep && !asleep) landed();
    }
  };

  const rig = (dt: number) => {
    const h = Math.max(0, s.py - CZ);
    const k = 1 - Math.exp(-dt * 9);
    const kz = 1 - Math.exp(-dt * 4.5);
    cam.y += (h - cam.y) * k;
    cam.x += (s.px - cam.x) * kz;
    cam.z += (s.pz - cam.z) * kz;
    // The forecast knows the phone's final heading: come round to it as it rattles.
    const landing = flight?.forecast;
    if (mode === "air" && landing && landing.up !== null && s.hit)
      cam.azTo = nearestAz(landing.yaw, landing.up);
    cam.az += (cam.azTo - cam.az) * (1 - Math.exp(-dt * 3.2));
    cam.kick *= Math.exp(-dt * 13);
    const pitch = (VIEW.pitch - Math.min(cam.y, 4.5) * 2.2) * DEG;
    const dist = fit(width, height).distance + cam.y * 0.74;
    const ty = CZ + cam.y * 0.8 - cam.kick;
    camera.position.set(
      cam.x + dist * Math.sin(cam.az) * Math.cos(pitch),
      ty + dist * Math.sin(pitch),
      cam.z + dist * Math.cos(cam.az) * Math.cos(pitch),
    );
    camera.up.set(0, 1, 0);
    camera.lookAt(cam.x, ty, cam.z);
    // The drone over the phone: the live view its screen shows.
    const D = H / (0.64 * 2 * Math.tan((drone.fov * DEG) / 2));
    const a = cam.az + ROLL;
    drone.position.set(s.px, s.py + D, s.pz);
    drone.up.set(-Math.sin(a), 0, -Math.cos(a));
    drone.lookAt(s.px, s.py, s.pz);
  };

  const tunnelPass = () => {
    // The inner phones show the plain tunnel, or the photo once it has fully arrived.
    const d = S.uDive.value;
    const f = S.uFull.value;
    S.uDive.value = innerPhoto ? 3 : 0;
    S.uFull.value = innerPhoto ? 1 : 0;
    S.uTun.value = rtA.texture;
    mirror.visible = false;
    renderer.setRenderTarget(rtB);
    renderer.setClearColor(brand.bg, 1);
    renderer.render(scene, drone);
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x000000, 0);
    mirror.visible = LOOK[brand.theme].mirror > 0;
    [rtA, rtB] = [rtB, rtA];
    S.uTun.value = rtA.texture;
    S.uDive.value = d;
    S.uFull.value = f;
  };

  const diveStep = (dt: number) => {
    const had = dive.t;
    dive.wait += dt;
    if (reveal < 1 && dive.wait < 6) return; // the photo has to be up before the dive
    dive.t += dt;
    if (dive.t < 0) return;
    if (had < 0) {
      on.onDive();
      // Straight down the phone, close enough that the little screen covers the real one.
      dive.from.copy(camera.position);
      dive.qf.copy(camera.quaternion);
      const seen = Math.min(SW / (width / height), SH) / 1.05;
      dive.to.set(s.px, CZ + T / 2 + seen / (2 * Math.tan((VIEW.fov * DEG) / 2)), s.pz);
      rot(s, 0, 1, 0, v3);
      const look = new Matrix4().lookAt(
        dive.to,
        new Vector3(s.px, 0, s.pz),
        new Vector3(v3[0], 0, v3[2]),
      );
      dive.qt.setFromRotationMatrix(look);
      pool.to = 0.1;
    }
    const u = Math.min(1, dive.t / 1.45);
    const ease = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    camera.position.lerpVectors(dive.from, dive.to, ease);
    camera.quaternion.slerpQuaternions(dive.qf, dive.qt, Math.min(1, ease * 1.15));
    diveEase = ease;
    S.uPill.value = 1 - ease;
    U.uFade.value = 1 - 0.8 * ease;
    if (u >= 1 && mode !== "done") {
      mode = "done";
      on.onDived();
    }
  };

  const frame = (dt: number) => {
    if (mode === "held") {
      const k = 1 - Math.exp(-dt * 26);
      hold.a += (hold.ta - hold.a) * k;
      hold.b += (hold.tb - hold.b) * k;
      setHeadings();
      const held = hold.base.clone().premultiply(turn.setFromAxisAngle(right, -hold.a));
      held.premultiply(turn.setFromAxisAngle(fwd, hold.b));
      s.qx = held.x;
      s.qy = held.y;
      s.qz = held.z;
      s.qw = held.w;
      s.py = CZ + Math.sin(Math.abs(hold.a)) * (H / 2) + Math.sin(Math.abs(hold.b)) * (W / 2);
    } else if (mode === "air") {
      stepSim(dt);
      // The tunnel gives way as the ring-down ends, not after it.
      if (flight?.forecast.up && !early && s.t > flight.forecast.t - 0.22) {
        early = true;
        if (needPhoto(found)?.texture) applyPhoto(found);
      }
    }
    // Reveal: fall through the tunnel and out into the photo. Leaving is quicker.
    const speed = revealTo > reveal ? 1.5 : 4.2;
    reveal =
      Math.abs(revealTo - reveal) < dt * speed
        ? revealTo
        : reveal + Math.sign(revealTo - reveal) * dt * speed;
    const e = reveal * reveal * (3 - 2 * reveal);
    S.uDive.value = e * 3;
    S.uFull.value = reveal >= 1 ? 1 : 0;
    S.uGlass.value = (1 - 0.8 * e) * (1 - diveEase);
    innerPhoto = reveal >= 1;
    pool.v += (pool.to - pool.v) * (1 - Math.exp(-dt * 4));
    // The pool is a follow-spot: it finds the phone once the phone is coming down.
    const kS = 1 - Math.exp(-dt * (mode === "air" ? 1.4 : 3));
    U.uSpot.value.x += (s.px - U.uSpot.value.x) * kS;
    U.uSpot.value.y += (s.pz - U.uSpot.value.y) * kS;
    if (dive.t > -2) diveStep(dt);
    syncPhone();
    if (dive.t < 0) rig(dt);
    shadowUniforms();
    camera.updateMatrixWorld();
    S.uLight.value.copy(KEY).transformDirection(camera.matrixWorldInverse);
    tunClock += dt;
    if (tunClock >= TICK || afterRest > 0) {
      tunClock %= TICK;
      if (dive.t < 0) tunnelPass();
    }
    renderer.render(scene, camera);
    if (afterRest > 0) afterRest--;
  };

  const busy = () =>
    mode === "held" ||
    mode === "air" ||
    reveal !== revealTo ||
    afterRest > 0 ||
    Math.abs(pool.v - pool.to) > 0.004 ||
    Math.abs(cam.az - cam.azTo) > 0.002 ||
    Math.abs(cam.x - s.px) + Math.abs(cam.z - s.pz) + cam.y > 0.004 ||
    Math.abs(U.uSpot.value.x - s.px) + Math.abs(U.uSpot.value.y - s.pz) > 0.01 ||
    (dive.t > -2 && mode !== "done");

  // Frames slipping: drop the resolution rather than the feel.
  let slowSum = 0;
  let slowN = 0;
  const adapt = (dt: number) => {
    if (dt >= 0.05) return;
    slowSum += dt;
    slowN++;
    if (slowN < 40) return;
    const mean = slowSum / slowN;
    slowSum = slowN = 0;
    if (mean > 0.0215 && ratio > 1.25) {
      ratio = Math.max(1.25, ratio - 0.25);
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
    }
  };

  const stop = () => {
    if (!running) return;
    running = false;
    stopWatch();
    rtA.dispose();
    rtB.dispose();
    blank.dispose();
    for (const shot of shots) shot?.texture?.dispose();
    disposeObject(scene);
    view.dispose();
  };

  const drop = () => {
    if (mode !== "held") return;
    mode = "air";
    thrown = 0;
    flight = null;
    s.asleep = false;
    s.calm = 0;
    s.t = 0;
    s.hit = 1e-9;
    s.ghost = 0;
    s.vx = s.vy = s.vz = s.wx = s.wy = s.wz = 0;
    wake();
  };

  // Build everything before the canvas is shown, so the crossfade cannot hitch.
  syncPhone();
  setHeadings();
  rig(0);
  shadowUniforms();
  await renderer.compileAsync(scene, camera);
  for (let i = 0; i < 9; i++) tunnelPass();
  renderer.render(scene, camera);
  // Warm the planner while nobody is waiting on it.
  plan(s, { power: 0.5, dx: 0 }, null, 70);
  built = true;
  afterRest = 1;
  wake();

  return {
    canHold: () => mode === "rest" && dive.t <= -2,
    hold(nx, ny) {
      if (mode === "rest") {
        mode = "held";
        s.asleep = true;
        thrown = 0;
        hold.base.set(s.qx, s.qy, s.qz, s.qw);
        hold.a = hold.b = 0;
        wake();
      }
      if (mode !== "held") return;
      hold.ta = Math.max(-0.1, Math.min(0.62, -ny * 3.4));
      hold.tb = Math.max(-0.3, Math.min(0.3, nx * 1.1));
    },
    drop,
    flick(power, dx, keyboard) {
      if ((mode !== "held" && mode !== "rest") || dive.t > -2) return;
      setHeadings();
      // The first flick always lands; so does the one after two misses, and any keyboard flip.
      const must = keyboard || thrown + found + misses === 0 || misses >= 2;
      const want = must || Math.random() < 0.62 ? true : null;
      const throwing = { power, dx, right: [right.x, right.z], fwd: [fwd.x, fwd.z] } as const;
      const planned = plan(s, throwing, want, 26) ?? plan(s, throwing, null, 26);
      if (!planned) {
        drop();
        return;
      }
      launch(s, planned.launch);
      flight = planned;
      thrown = 1;
      mode = "air";
      acc = 0;
      early = false;
      revealTo = 0;
      pool.to = 1;
      waiting = -1;
      on.onLift();
      wake();
    },
    stop,
  };
}

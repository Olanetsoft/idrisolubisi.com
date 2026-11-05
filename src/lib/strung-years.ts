/**
 * Strung Years: a wire toy with one looping brass wire for each year and one
 * bead for each talk in src/data/talks.ts. It opens upside down and tips over,
 * so the beads pour home; a flick spins it and they ride the loops. A bead's
 * shape is the kind of talk, the keynote is lit amber, and a talk still to come
 * is hollow glass until its date has passed, worked out on each open. Tap a bead
 * for its card. The physics is one number per bead, how far along its wire, and
 * it stops by itself. Reached only by the dynamic import in src/lib/three-shell.ts,
 * so the talks, this file and three.js all stay out of the first load.
 */

import "@/app/strung-years.css";
import { getImageProps } from "next/image";
import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  Curve,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Fog,
  Group,
  InstancedMesh,
  LatheGeometry,
  LinearToneMapping,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Scene,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  type Material,
  type WebGLRenderTarget,
} from "three";
import { KIND, eventName, isUpcoming, stagePhotos, talkCity, talks, type Talk } from "@/data/talks";
import type { StartStage } from "@/lib/three-shell";
import {
  brandFonts,
  canvasTexture,
  createRenderer,
  disposeObject,
  lightStage,
  readBrand,
  watchBrand,
} from "@/lib/three-stage";

const TAU = Math.PI * 2;

// The wires. Units are the toy's own; the base is 1.2 in radius.
const RISE = 0.25; // height gained per unit of wire, once it is looping
const LEAN = 0.2; // how fast the rod leans outwards
const ROD_IN = 0.68; // how far from the centre the rods stand
const SPACING = 0.03; // between stored points along a wire
const WIRE = 0.021; // radius
const BEAD_SCALE = 0.88;

// The two poses and the camera. Pitch and yaw are radians.
const PIVOT = 2.02; // height of the point the toy turns about
const PITCH_REST = 0.17;
const YAW_REST = -0.62;
const PITCH_START = 2.72;
const YAW_START = YAW_REST - 1.7;
const CAMERA = [0, 2.7, 13.5] as const;
const TARGET = [0, -0.28, 0] as const;
const LIFT_TO = [0, 1.9, 6] as const; // where a picked bead hangs, in front of the toy

// The physics.
const GRAVITY = 17;
const CENTRIFUGAL = 2.7; // how much a spin throws a bead outwards
const FRICTION = 0.032;
const FRICTION_STILL = 0.06;
const AIR = 0.22;
const STOP_BOUNCE = 0.3; // off the end of a wire
const BEAD_BOUNCE = 0.34; // off another bead
const SUBSTEP = 1 / 240; // s
const YAW_FADE = 2; // s
const PITCH_FADE = 1.3; // s
const MAX_SPIN = 17; // rad/s
const TIP_TIME = 1.2; // s
const DOCK_SPEED = 2.3; // rad/s, the most the toy turns by itself
const INERTIA = 34; // of the toy alone, before the beads add theirs
const FAST = 1.6; // rad/s: a tap on a toy spinning this fast only catches it

// The moments.
const HINT_AFTER = 3.4; // s without a touch
const LINES_SHOWN = 3;
const LINE_GAP = 0.12; // s between names at the foot
const NAME_AGAIN = 1.6; // s before a bead may name itself again
const LIFT_TIME = 0.34; // s
const SLOW_FRAME = 26; // ms: a phone slower than this gives up detail, one step at a time
const TOUCH_SLOP = 10; // px: a press that moves further is a turn
const TAP_TIME = 450; // ms
const GRAB_SLOP = 26; // px around a bead that still picks it
const TOP_BAR = 48; // px: the row of buttons, which no tap reaches through

const SHAPES = {
  talk: { h: 0.13 * BEAD_SCALE, r: 0.155 * BEAD_SCALE },
  workshop: { h: 0.205 * BEAD_SCALE, r: 0.13 * BEAD_SCALE },
  keynote: { h: 0.185 * BEAD_SCALE, r: 0.215 * BEAD_SCALE },
  other: { h: 0.08 * BEAD_SCALE, r: 0.165 * BEAD_SCALE },
};

type Shape = keyof typeof SHAPES;
type Finish = "solid" | "amber" | "glass";
/** The solid beads' colours: amber for workshops, ink for Lagos, paper for the rest. */
type Tone = "amber" | "ink" | "paper";
type Bead = {
  talk: Talk;
  shape: Shape;
  finish: Finish;
  tone: Tone;
  h: number;
  r: number;
  wire: number;
  id: number;
  /** Where it rests low on its wire, and high up it for the opening. */
  low: number;
  high: number;
  mesh: InstancedMesh;
  slot: number;
};
type Wire = {
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  n: number;
  len: number;
  year: string;
  beads: Bead[];
};

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (a: number, b: number, x: number) => {
  const k = clamp((x - a) / (b - a), 0, 1);
  return k * k * (3 - 2 * k);
};
/** `angle`, a whole number of turns away, as near to `to` as it can be. */
const near = (angle: number, to: number) => angle - TAU * Math.round((angle - to) / TAU);

function buzz(ms: number) {
  try {
    navigator.vibrate?.(ms);
  } catch {}
}

function make<K extends keyof HTMLElementTagNameMap>(tag: K, text = "", className = "") {
  const el = document.createElement(tag);
  el.textContent = text;
  el.className = className;
  return el;
}

/** A year's wire: a leaning rod long enough to hold its beads, then one loop above it. */
function layWire(i: number, count: number, need: number) {
  const rod = need + 0.5;
  const length = rod + 5 + need * 1.15;
  const step = 0.012;
  let angle = (i / count) * TAU + 0.35;
  let r = ROD_IN;
  let y = 0.03;
  const raw = [[Math.cos(angle) * r, -0.1, Math.sin(angle) * r]];
  const along = [0];
  let s = y + 0.1;
  while (s < length) {
    const k = smooth(rod - 0.3, rod + 1.5, s);
    const up = 0.955 + (RISE - 0.955) * k;
    const out = LEAN + (0.04 - LEAN) * k;
    const round = Math.sqrt(Math.max(0, 1 - up * up - out * out));
    raw.push([Math.cos(angle) * r, y, Math.sin(angle) * r]);
    along.push(s);
    r += out * step;
    y += up * step;
    angle -= (round / r) * step;
    s += step;
  }
  const n = Math.floor(s / SPACING);
  const xs = new Float32Array(n);
  const ys = new Float32Array(n);
  const zs = new Float32Array(n);
  for (let k = 0, j = 0; k < n; k++) {
    const d = k * SPACING;
    while (j < raw.length - 2 && along[j + 1] < d) j++;
    const f = (d - along[j]) / (along[j + 1] - along[j] || 1);
    const [ax, ay, az] = raw[j];
    const [bx, by, bz] = raw[j + 1];
    xs[k] = ax + (bx - ax) * f;
    ys[k] = ay + (by - ay) * f;
    zs[k] = az + (bz - az) * f;
  }
  return { x: xs, y: ys, z: zs, n, len: (n - 1) * SPACING };
}

const shapeOf = ({ kind }: Talk): Shape =>
  kind === "Keynote"
    ? "keynote"
    : kind === "Talk"
      ? "talk"
      : kind === "Workshop"
        ? "workshop"
        : "other";

/** "2025–26" hangs on 2026's wire. */
const wireYear = (year = "") => (year.length > 4 ? year.slice(0, 2) + year.slice(-2) : year);

/** One wire for each year in the talks, and one bead for each talk, oldest lowest. */
function stringBeads() {
  const years = [...new Set(talks.map((t) => wireYear(t.year)))].sort();
  const beads: Bead[] = [];
  const wires: Wire[] = years.map((year, i) => {
    const list = talks.filter((t) => wireYear(t.year) === year).reverse();
    const need = list.reduce((sum, t) => sum + 2 * SHAPES[shapeOf(t)].h, 0);
    const wire: Wire = { ...layWire(i, years.length, need), year, beads: [] };
    let up = 0;
    for (const talk of list) {
      const shape = shapeOf(talk);
      const { h, r } = SHAPES[shape];
      const bead = {
        talk,
        shape,
        finish: isUpcoming(talk) ? "glass" : talk.kind === "Keynote" ? "amber" : "solid",
        tone:
          talk.kind === "Workshop" ? "amber" : talk.location?.includes("Lagos") ? "ink" : "paper",
        h,
        r,
        wire: i,
        id: beads.length,
        low: up + h + 0.01,
      } as Bead;
      up += 2 * h;
      wire.beads.push(bead);
      beads.push(bead);
    }
    let down = 0;
    for (const bead of [...wire.beads].reverse()) {
      bead.high = wire.len - down - bead.h - 0.01;
      down += 2 * bead.h;
    }
    return wire;
  });
  return { wires, beads };
}

class WireCurve extends Curve<Vector3> {
  constructor(private wire: Wire) {
    super();
  }
  getPoint(t: number, out = new Vector3()) {
    const { x, y, z, n } = this.wire;
    const f = Math.min(t * (n - 1), n - 1.001);
    const i = Math.floor(f);
    const k = f - i;
    return out.set(
      x[i] + (x[i + 1] - x[i]) * k,
      y[i] + (y[i + 1] - y[i]) * k,
      z[i] + (z[i + 1] - z[i]) * k,
    );
  }
}

/** One geometry from many, so all the brass is one draw call. */
function merge(list: BufferGeometry[]) {
  let vertices = 0;
  let indices = 0;
  for (const g of list) {
    vertices += g.attributes.position.count;
    indices += g.index!.count;
  }
  const position = new Float32Array(vertices * 3);
  const normal = new Float32Array(vertices * 3);
  const index = new Uint32Array(indices);
  let v = 0;
  let n = 0;
  for (const g of list) {
    position.set(g.attributes.position.array, v * 3);
    normal.set(g.attributes.normal.array, v * 3);
    for (let i = 0; i < g.index!.count; i++) index[n++] = g.index!.array[i] + v;
    v += g.attributes.position.count;
    g.dispose();
  }
  const merged = new BufferGeometry();
  merged.setAttribute("position", new BufferAttribute(position, 3));
  merged.setAttribute("normal", new BufferAttribute(normal, 3));
  merged.setIndex(new BufferAttribute(index, 1));
  return merged;
}

/** A turned shape, from [radius, height] pairs. */
const lathe = (points: number[][], segments: number) =>
  new LatheGeometry(
    points.map(([r, y]) => new Vector2(r, y)),
    segments,
  );

/** A bead's outline: `power` under 1 squares its shoulders. */
function roundBead(r: number, h: number, power: number, rows: number) {
  const hole = 0.024;
  const points = [[hole, -h]];
  for (let i = 0; i < rows; i++) {
    const t = -Math.PI / 2 + (Math.PI * (i + 0.5)) / rows;
    points.push([Math.max(hole, r * Math.pow(Math.cos(t), power)), h * Math.sin(t)]);
  }
  points.push([hole, h]);
  return points;
}

function beadGeometry(shape: Shape) {
  const hole = 0.024;
  const outline = {
    talk: roundBead(0.155, 0.13, 0.72, 12),
    keynote: roundBead(0.215, 0.185, 0.62, 16),
    workshop: [
      [hole, -0.205],
      [0.075, -0.205],
      [0.1, -0.19],
      [0.122, -0.13],
      [0.13, -0.05],
      [0.13, 0.05],
      [0.122, 0.13],
      [0.1, 0.19],
      [0.075, 0.205],
      [hole, 0.205],
    ],
    other: [
      [hole, -0.08],
      [0.11, -0.08],
      [0.145, -0.07],
      [0.163, -0.04],
      [0.166, 0],
      [0.163, 0.04],
      [0.145, 0.07],
      [0.11, 0.08],
      [hole, 0.08],
    ],
  };
  const geometry = lathe(outline[shape], shape === "keynote" ? 30 : 18);
  return geometry.scale(BEAD_SCALE, BEAD_SCALE, BEAD_SCALE);
}

const BASE = [
  [0, -0.36],
  [0.98, -0.36],
  [1.03, -0.35],
  [1.05, -0.325],
  [1.03, -0.295],
  [1.06, -0.27],
  [1.15, -0.215],
  [1.2, -0.16],
  [1.21, -0.105],
  [1.19, -0.06],
  [1.13, -0.022],
  [1.08, -0.008],
  [1.05, 0],
  [0.6, 0.002],
  [0, 0.002],
];

/** All the brass: the wires with their tips and feet, and the two rings on the base. */
function brassGeometry(wires: Wire[]) {
  const parts: BufferGeometry[] = [];
  for (const wire of wires) {
    const { x, y, z, n, len } = wire;
    parts.push(new TubeGeometry(new WireCurve(wire), Math.round(len * 15), WIRE, 7));
    parts.push(new SphereGeometry(0.052, 12, 10).translate(x[n - 1], y[n - 1], z[n - 1]));
    parts.push(new CylinderGeometry(0.048, 0.062, 0.05, 12).translate(x[3], 0.03, z[3]));
  }
  parts.push(new TorusGeometry(1, 0.0135, 8, 72).rotateX(Math.PI / 2).translate(0, 0.006, 0));
  parts.push(new TorusGeometry(0.92, 0.02, 8, 72).rotateX(Math.PI / 2).translate(0, -0.36, 0));
  return merge(parts);
}

/** The stage photo for a talk's card, if it has one. */
function photoOf({ photo }: Talk) {
  return photo ? stagePhotos.find((p) => p.src === photo) : undefined;
}

export const start: StartStage = async (stage) => {
  const { dialog, canvas, foot, reduced } = stage;
  const { wires, beads } = stringBeads();
  const fonts = await brandFonts();
  let brand = readBrand(stage);

  const scene = new Scene();
  const fog = new Fog(brand.bg.clone(), 11.6, 16.4);
  scene.fog = fog;
  const camera = new PerspectiveCamera(30, 1, 4, 40);
  camera.position.set(...CAMERA);
  camera.lookAt(...TARGET);
  camera.updateMatrixWorld();
  const reach = camera.position.distanceTo(new Vector3(...TARGET));
  let focal = 1;
  let detail: number | undefined;
  let shown = false;

  const view = createRenderer(stage, {
    powerPreference: "high-performance",
    draw: (dt) => {
      if (!shown) return false;
      if (reduced) {
        yaw += pendingYaw;
        pitch += pendingPitch;
        pendingYaw = pendingPitch = 0;
        settle();
      } else {
        advance(Math.max(SUBSTEP, dt));
      }
      pose();
      stage.ready();
      if (reduced || active()) return true;
      velocity.fill(0);
      shake.set(0, 0, 0);
      return false;
    },
    resize: (width, height) => {
      const half = Math.max(3.5, (2.05 * height) / width);
      camera.fov = (2 * Math.atan(half / reach) * 180) / Math.PI;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      focal = (height * reach) / (2 * half);
      if (detail) view.renderer.setPixelRatio(detail);
    },
  });
  const { renderer } = view;
  renderer.toneMapping = LinearToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const relight = lightStage(scene, brand);
  // The one light that casts, from high up, so the toy stands in its own shadow.
  const sun = new DirectionalLight();
  sun.position.set(-1.5, 10, 2.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -3.5,
    right: 3.5,
    top: 3.5,
    bottom: -3.5,
    near: 3,
    far: 18,
  });
  sun.shadow.bias = -0.0007;
  sun.shadow.normalBias = 0.018;
  scene.add(sun);

  const brass = new MeshStandardMaterial({ metalness: 1, roughness: 0.3 });
  const solid = new MeshStandardMaterial({ roughness: 0.38 });
  const baseSkin = new MeshStandardMaterial({ roughness: 0.55 });

  // Resin: light goes in at the top and comes out low in the bead.
  const resinGlow = { value: new Color() };
  const resin = new MeshStandardMaterial({ roughness: 0.09, envMapIntensity: 1.5 });
  resin.onBeforeCompile = (shader) => {
    shader.uniforms.resinGlow = resinGlow;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 resinGlow;")
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        vec3 beadNormal = normalize(vNormal);
        float facing = abs(dot(beadNormal, normalize(vViewPosition)));
        float low = smoothstep(.35, -.95, beadNormal.y);
        totalEmissiveRadiance += resinGlow * (.08 + .8 * low * low + .34 * pow(1. - facing, 2.));`,
      );
  };

  // Glass: all rim and no middle, so it reads as hollow on either stage.
  const glassRim = { value: new Color() };
  const glass = new MeshStandardMaterial({
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    depthWrite: false,
    envMapIntensity: 2.2,
  });
  glass.onBeforeCompile = (shader) => {
    shader.uniforms.glassRim = glassRim;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 glassRim;")
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
        float rim = pow(1. - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.1);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, glassRim, rim * .7);
        gl_FragColor.a = mix(.1, .95, rim);`,
      );
  };

  const rig = new Group();
  const inner = new Group();
  inner.position.y = -PIVOT;
  rig.add(inner);
  scene.add(rig);

  const wiresMesh = new Mesh(brassGeometry(wires), brass);
  wiresMesh.castShadow = wiresMesh.receiveShadow = true;
  const base = new Mesh(lathe(BASE, 56), baseSkin);
  base.castShadow = base.receiveShadow = true;

  // The years, let into the base beside each wire's foot.
  const inlay = new MeshStandardMaterial({
    transparent: true,
    metalness: 0.2,
    roughness: 0.5,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    depthWrite: false,
  });
  const inlayMesh = new Mesh(new CircleGeometry(1, 40), inlay);
  inlayMesh.rotation.x = -Math.PI / 2;
  inlayMesh.position.y = 0.004;
  inlayMesh.receiveShadow = true;
  inner.add(wiresMesh, base, inlayMesh);

  const paintYears = () => {
    const size = 512;
    inlay.map?.dispose();
    inlay.map = canvasTexture(size, size, (context) => {
      context.translate(size / 2, size / 2);
      context.fillStyle = (brand.theme === "light" ? brand.brass : brand.amber).getStyle();
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `400 29px ${fonts.mono}`;
      for (const { x, z, year } of wires) {
        context.save();
        context.rotate(Math.atan2(z[3], x[3]) + 0.5);
        context.translate((size / 2) * 0.875, 0);
        context.rotate(-Math.PI / 2);
        context.fillText(year, 0, 0);
        context.restore();
      }
    });
    inlay.map.anisotropy = 4;
    inlay.needsUpdate = true;
  };

  // The floor is a pool of light that takes the shadow, gone by its edge.
  const pool = canvasTexture(128, 128, (context) => {
    const glow = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const [at, level] of [
      [0, 208],
      [0.3, 128],
      [0.55, 44],
      [0.8, 9],
      [1, 0],
    ])
      glow.addColorStop(at, `rgb(${level} ${level} ${level})`);
    context.fillStyle = glow;
    context.fillRect(0, 0, 128, 128);
  });
  pool.colorSpace = NoColorSpace;
  const floorSkin = new MeshLambertMaterial({
    alphaMap: pool,
    transparent: true,
    depthWrite: false,
    fog: false,
  });
  const floor = new Mesh(new CircleGeometry(7.5, 48), floorSkin);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.9;
  floor.receiveShadow = true;
  scene.add(floor);

  // Beads: one instanced mesh for each shape in each finish.
  const skins: Record<Finish, Material> = { solid, amber: resin, glass };
  const groups = new Map<string, Bead[]>();
  for (const bead of beads) {
    const key = `${bead.shape}:${bead.finish}`;
    groups.set(key, [...(groups.get(key) ?? []), bead]);
  }
  const meshes: InstancedMesh[] = [];
  for (const list of groups.values()) {
    const { shape, finish } = list[0];
    const mesh = new InstancedMesh(beadGeometry(shape), skins[finish], list.length);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.frustumCulled = false;
    mesh.castShadow = mesh.receiveShadow = finish !== "glass";
    if (finish === "glass") mesh.renderOrder = 2;
    list.forEach((bead, slot) => {
      bead.mesh = mesh;
      bead.slot = slot;
    });
    inner.add(mesh);
    meshes.push(mesh);
  }

  // A small studio of the brand's own colours, baked once for each theme, for
  // the brass and the glass to reflect.
  let studioMap: WebGLRenderTarget | undefined;
  const bakeStudio = () => {
    const paper = brand.theme === "light";
    const studio = new Scene();
    studio.background = paper ? brand.bg.clone() : brand.raised.clone().multiplyScalar(0.2);
    const panel = (
      color: Color,
      power: number,
      width: number,
      height: number,
      place: [number, number, number],
    ) => {
      const mesh = new Mesh(
        new PlaneGeometry(width, height),
        new MeshBasicMaterial({
          color: color.clone().multiplyScalar(power),
          side: DoubleSide,
        }),
      );
      mesh.position.set(...place);
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
    };
    const warm = brand.paper.clone().lerp(brand.amber, 0.25);
    panel(brand.paper, 14, 7, 3, [-3, 8, 3]);
    panel(warm, 9, 1.2, 9, [7, 1, 3]);
    panel(brand.paper, 5, 1, 7, [-7, 0, 1.5]);
    panel(brand.amber, paper ? 9 : 5, 8, 1.6, [2, -6, -6]);
    panel(brand.paper, 3, 6, 0.8, [0, 2, 9]);
    const generator = new PMREMGenerator(renderer);
    const baked = generator.fromScene(studio, 0.03, 0.1, 30);
    generator.dispose();
    disposeObject(studio);
    scene.environment = baked.texture;
    studioMap?.dispose();
    studioMap = baked;
  };

  /** Everything that comes from a token, on open and on each change of theme. */
  const dress = () => {
    const paper = brand.theme === "light";
    relight(brand);
    // The paper stage is lit broadly, so it is held down to keep paper from going
    // white, and its fog stays further back so ink stays ink.
    renderer.toneMappingExposure = paper ? 0.72 : 1;
    fog.color.copy(brand.bg);
    fog.near = paper ? 13.4 : 11.6;
    fog.far = paper ? 20 : 16.4;
    sun.color.copy(paper ? brand.surface : brand.paper);
    sun.intensity = paper ? 0.8 : 1.3;
    scene.environmentIntensity = paper ? 0.4 : 0.5;
    brass.envMapIntensity = paper ? 2.2 : 1.4;
    brass.color.copy(brand.brass).multiplyScalar(paper ? 1.3 : 1);
    baseSkin.color.copy(paper ? brand.ink : brand.raised.clone().multiplyScalar(2.2));
    floorSkin.color.copy(paper ? brand.bg.clone().multiplyScalar(0.8) : brand.raised);
    resin.color.copy(brand.brass).multiplyScalar(0.3);
    resinGlow.value.copy(brand.brass).multiplyScalar(paper ? 1.9 : 1.6);
    glass.color.copy(brand.paper);
    glassRim.value.copy(paper ? brand.amber : brand.paper);
    const tones: Record<Tone, Color> = {
      amber: paper ? brand.brass : brand.amber,
      ink: paper ? brand.ink : brand.lineStrong,
      paper: brand.paper,
    };
    for (const bead of beads) {
      if (bead.finish === "solid") bead.mesh.setColorAt(bead.slot, tones[bead.tone]);
    }
    for (const mesh of meshes) if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    paintYears();
    bakeStudio();
  };
  dress();

  // State: one number per bead, how far along its wire.
  const count = beads.length;
  const along = new Float32Array(count);
  const before = new Float32Array(count);
  const velocity = new Float32Array(count);
  const pulse = new Float32Array(count);
  const named = new Float32Array(count).fill(-9);
  beads.forEach((bead, i) => {
    along[i] = reduced ? bead.low : bead.high;
  });
  let pitch = reduced ? PITCH_REST : PITCH_START;
  let yaw = reduced ? YAW_REST : YAW_START;
  let spinY = 0;
  let spinP = 0;
  let momentum = 0;
  let held = false;
  let pendingYaw = 0;
  let pendingPitch = 0;
  let quiet = 0;
  let docking = false;
  let tip: { t: number; from: number } | null = null;
  let tipped = reduced;
  let clock = 0;
  let frames = 0;
  let frameMs = 16;
  let slowFrames = 0;
  let halfShadows = false;
  let prevX = 0;
  let prevY = 0;
  let prevZ = 0;
  let gravityX = 0;
  let gravityY = -1;
  let tiltX = 0;
  let tiltY = -1;
  let lifted = -1;
  let lift = 0;
  let liftGoal = 0;
  let cursor = -1;
  let wasFast = false;
  let flip = 1;
  let hintDone = false;
  let hintShown = false;
  let audio: AudioContext | null = null;
  let tickAt = 0;
  let buzzAt = -1;
  let lineAt = 0;
  const queue: [string, boolean][] = [];

  const shake = new Vector3();
  const spot = new Vector3();
  const hang = new Vector3();
  const tangent = new Vector3();
  const size = new Vector3();
  const goal = new Vector3(...LIFT_TO);
  const up = new Vector3(0, 1, 0);
  const turn = new Quaternion();
  const matrix = new Matrix4();
  const at = new Float64Array(6);

  /** Fills `at` with the point `s` along a wire, and its direction. */
  const sample = (wire: Wire, s: number) => {
    const { x, y, z, n } = wire;
    const f = clamp(s / SPACING, 0, n - 2);
    const i = Math.floor(f);
    const k = f - i;
    at[0] = x[i] + (x[i + 1] - x[i]) * k;
    at[1] = y[i] + (y[i + 1] - y[i]) * k;
    at[2] = z[i] + (z[i + 1] - z[i]) * k;
    const j = Math.min(i + 2, n - 1);
    const h = Math.max(i - 1, 0);
    const tx = x[j] - x[h];
    const ty = y[j] - y[h];
    const tz = z[j] - z[h];
    const l = Math.hypot(tx, ty, tz) || 1;
    at[3] = tx / l;
    at[4] = ty / l;
    at[5] = tz / l;
  };

  // The foot: a hint, and the names of the beads as they knock. In a phone on its
  // side the shell moves this beside the toy because it has content.
  const hint = make("p", "Turn it. Flick it hard. Tap a bead.", "three-strung-hint");
  const lines = make("div", "", "three-strung-lines");
  lines.setAttribute("aria-hidden", "true");
  foot.append(hint, lines);

  const say = ({ talk, finish }: Bead) => {
    const text = [eventName(talk), talkCity(talk), talk.year, isUpcoming(talk) && "upcoming"]
      .filter(Boolean)
      .join(" · ");
    if (queue.length > 7) queue.shift();
    queue.push([text, finish === "amber"]);
  };
  const showLine = () => {
    if (!queue.length || clock - lineAt < LINE_GAP) return;
    lineAt = clock;
    const [text, amber] = queue.shift()!;
    const line = make("p", text, "three-strung-line");
    if (amber) line.dataset.amber = "";
    lines.append(line);
    while (lines.childNodes.length > LINES_SHOWN) lines.firstChild!.remove();
  };

  // Sound is off until asked for: a short tick, higher for a smaller bead.
  const knock = (speed: number, shape: Shape) => {
    if (!audio || clock - tickAt < 0.035) return;
    tickAt = clock;
    const t = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const pitchHz = shape === "workshop" ? 1450 : shape === "other" ? 2500 : 1950;
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(pitchHz * (1 + Math.random() * 0.08), t);
    gain.gain.setValueAtTime(Math.min(0.2, 0.03 + speed * 0.018), t);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.04);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(t);
    oscillator.stop(t + 0.05);
  };

  const clack = (i: number, speed: number, stop: boolean) => {
    if (speed < 1) return;
    const bead = beads[i];
    pulse[i] = Math.min(1, speed * 0.14);
    sample(wires[bead.wire], along[i]);
    const kick = Math.min(speed * 0.0016, 0.014);
    shake.x += at[3] * kick;
    shake.y += at[4] * kick;
    shake.z += at[5] * kick;
    knock(speed, bead.shape);
    if (speed > 2 && clock - buzzAt > 0.07) {
      buzzAt = clock;
      buzz(speed > 5 ? 11 : 6);
    }
    if (speed > (stop ? 1.3 : 2.2) && clock - named[i] > NAME_AGAIN) {
      named[i] = clock;
      say(bead);
    }
  };

  /** Keeps a wire's beads in order and on it, so a hard throw can never bury one. */
  const seat = () => {
    for (const wire of wires) {
      const list = wire.beads;
      let cap = wire.len - 0.04;
      for (let k = list.length - 1; k >= 0; k--) {
        const { id, h } = list[k];
        if (id === lifted) continue;
        if (along[id] > cap - h) {
          along[id] = cap - h;
          if (velocity[id] > 0) velocity[id] = 0;
        }
        cap = along[id] - h;
      }
      let rest = 0.01;
      for (const { id, h } of list) {
        if (id === lifted) continue;
        if (along[id] < rest + h) {
          along[id] = rest + h;
          if (velocity[id] < 0) velocity[id] = 0;
        }
        rest = along[id] + h;
      }
    }
  };

  /** One step: every bead slides on its wire under the toy's motion, then they collide. */
  function step(
    dt: number,
    ax: number,
    ay: number,
    az: number,
    ox: number,
    oy: number,
    oz: number,
    gx: number,
    gy: number,
    gz: number,
  ) {
    for (let i = 0; i < count; i++) {
      if (i === lifted) continue;
      sample(wires[beads[i].wire], along[i]);
      const px = at[0];
      const py = at[1] - PIVOT;
      const pz = at[2];
      const tx = at[3];
      const ty = at[4];
      const tz = at[5];
      const dot = ox * px + oy * py + oz * pz;
      const oo = ox * ox + oy * oy + oz * oz;
      let fx = gx + CENTRIFUGAL * (oo * px - ox * dot) - (ay * pz - az * py);
      let fy = gy + CENTRIFUGAL * (oo * py - oy * dot) - (az * px - ax * pz);
      let fz = gz + CENTRIFUGAL * (oo * pz - oz * dot) - (ax * py - ay * px);
      const push = fx * tx + fy * ty + fz * tz;
      fx -= push * tx;
      fy -= push * ty;
      fz -= push * tz;
      const pressed = Math.hypot(fx, fy, fz);
      let v = velocity[i];
      if (Math.abs(v) < 0.03 && Math.abs(push) < FRICTION_STILL * pressed) {
        velocity[i] = 0;
        continue;
      }
      v += push * dt;
      const drag = FRICTION * pressed * dt;
      v = Math.abs(v) <= drag ? 0 : v - Math.sign(v) * drag;
      v *= 1 - AIR * dt;
      velocity[i] = v;
      along[i] += v * dt;
    }
    for (let pass = 0; pass < 2; pass++) {
      for (const wire of wires) {
        const list = wire.beads;
        const last = list.length - 1;
        for (let k = 0; k < list.length; k++) {
          const bead = list[k];
          const i = bead.id;
          if (i === lifted) continue;
          let next = k + 1;
          if (next < list.length && list[next].id === lifted) next++;
          if (next < list.length) {
            const other = list[next];
            const j = other.id;
            const gap = along[j] - along[i] - bead.h - other.h;
            if (gap < 0) {
              const total = bead.h + other.h;
              const closing = velocity[i] - velocity[j];
              along[i] += (gap * other.h) / total;
              along[j] -= (gap * bead.h) / total;
              if (closing > 0) {
                const impulse = ((1 + BEAD_BOUNCE) * closing) / total;
                velocity[i] -= impulse * other.h;
                velocity[j] += impulse * bead.h;
                if (pass === 0) {
                  const faster = Math.abs(velocity[j]) > Math.abs(velocity[i]) ? j : i;
                  clack(faster, closing, false);
                }
              }
            }
          }
          const bottom = k === 0 || (k === 1 && list[0].id === lifted);
          const low = bead.h + 0.01;
          if (bottom && along[i] < low) {
            along[i] = low;
            if (velocity[i] < 0) {
              if (pass === 0) clack(i, -velocity[i], true);
              velocity[i] *= -STOP_BOUNCE;
            }
          }
          const top = k === last || (k === last - 1 && list[last].id === lifted);
          const high = wire.len - bead.h - 0.04;
          if (top && along[i] > high) {
            along[i] = high;
            if (velocity[i] > 0) {
              if (pass === 0) clack(i, velocity[i], true);
              velocity[i] *= -STOP_BOUNCE;
            }
          }
        }
      }
    }
    seat();
  }

  /** The toy spins slower with its beads out on the loops. */
  const inertia = () => {
    let total = INERTIA;
    for (let i = 0; i < count; i++) {
      if (i === lifted) continue;
      const { x, z, n } = wires[beads[i].wire];
      const f = Math.floor(clamp(along[i] / SPACING, 0, n - 1));
      total += beads[i].h * 7 * (x[f] * x[f] + z[f] * z[f]);
    }
    return total;
  };

  /** World gravity in the toy's own frame, as [x, y, z] of `gx, gy`. */
  const gravityIn = (gx: number, gy: number) => {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const y1 = gy * GRAVITY * cp;
    const z1 = -gy * GRAVITY * sp;
    const x0 = gx * GRAVITY;
    return [x0 * cy - z1 * sy, y1, x0 * sy + z1 * cy] as const;
  };

  const physics = (dt: number) => {
    const ox = spinP * Math.cos(yaw);
    const oy = spinY;
    const oz = spinP * Math.sin(yaw);
    const ax = (ox - prevX) / dt;
    const ay = (oy - prevY) / dt;
    const az = (oz - prevZ) / dt;
    prevX = ox;
    prevY = oy;
    prevZ = oz;
    gravityX += (tiltX - gravityX) * Math.min(1, dt * 7);
    gravityY += (tiltY - gravityY) * Math.min(1, dt * 7);
    const [gx, gy, gz] = gravityIn(gravityX, gravityY);
    const steps = clamp(Math.round(dt / SUBSTEP), 1, 24);
    for (let k = 0; k < steps; k++) step(dt / steps, ax, ay, az, ox, oy, oz, gx, gy, gz);
  };

  /** Reduced motion: no spin and no travel, every bead goes straight to where it rests. */
  const settle = () => {
    const [gx, gy, gz] = gravityIn(tiltX, tiltY);
    for (let round = 0; round < 420; round++) {
      for (let i = 0; i < count; i++) {
        if (i === lifted) continue;
        sample(wires[beads[i].wire], along[i]);
        const push = gx * at[3] + gy * at[4] + gz * at[5];
        if (Math.abs(push) > GRAVITY * 0.05) along[i] += clamp(push * 0.004, -0.05, 0.05);
      }
      velocity.fill(0);
      step(1e-6, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    velocity.fill(0);
    gravityX = tiltX;
    gravityY = tiltY;
  };

  const pose = () => {
    rig.rotation.set(pitch, yaw, 0, "XYZ");
    inner.position.set(shake.x, shake.y - PIVOT, shake.z);
    rig.updateMatrixWorld(true);
    const rise = lift * lift * (3 - 2 * lift);
    if (lifted >= 0) inner.worldToLocal(hang.copy(goal));
    for (let i = 0; i < count; i++) {
      const bead = beads[i];
      sample(wires[bead.wire], along[i]);
      spot.set(at[0], at[1], at[2]);
      turn.setFromUnitVectors(up, tangent.set(at[3], at[4], at[5]));
      let scale = 1 + pulse[i] * 0.07;
      if (i === lifted) {
        spot.lerp(hang, rise);
        scale *= 1 + rise * 0.55;
      }
      size.setScalar(scale);
      bead.mesh.setMatrixAt(bead.slot, matrix.compose(spot, turn, size));
    }
    for (const mesh of meshes) mesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
    frames++;
  };

  const active = () => {
    if (tip || lift !== liftGoal) return true;
    if (!held && (Math.abs(spinY) > 0.02 || Math.abs(spinP) > 0.02)) return true;
    if (shake.lengthSq() > 1e-7 || queue.length) return true;
    if (pendingYaw || pendingPitch) return true;
    if (quiet < 10) return true;
    return Math.abs(gravityX - tiltX) + Math.abs(gravityY - tiltY) > 0.004;
  };

  /** A slow phone gives up sharpness first, and then every other shadow. */
  const keepUp = (dt: number) => {
    frameMs += (dt * 1000 - frameMs) * 0.08;
    if (++slowFrames > 30 && frameMs > SLOW_FRAME) {
      slowFrames = 0;
      if (renderer.getPixelRatio() > 1.5) {
        detail = 1.5;
        renderer.setPixelRatio(detail);
      } else if (!halfShadows) {
        halfShadows = true;
        renderer.shadowMap.autoUpdate = false;
      }
    }
    if (halfShadows) renderer.shadowMap.needsUpdate = frames % 2 === 0;
  };

  const advance = (dt: number) => {
    clock += dt;
    keepUp(dt);
    if (!hintShown && !hintDone && clock > HINT_AFTER) {
      hintShown = true;
      hint.dataset.on = "";
    }
    if (tip) {
      tip.t += dt;
      const k = clamp(tip.t / TIP_TIME, 0, 1);
      // A hair past, then home.
      const eased =
        k * k * (3 - 2 * k) + 0.055 * Math.sin(Math.PI * Math.max(0, (k - 0.55) / 0.45));
      const was = pitch;
      pitch = tip.from + (PITCH_REST - tip.from) * eased;
      spinP = (pitch - was) / dt;
      if (k >= 1) {
        tip = null;
        spinP = 0;
        tipped = true;
      }
    }
    if (held) {
      const movedY = pendingYaw / dt;
      const movedP = pendingPitch / dt;
      yaw += pendingYaw;
      pitch += pendingPitch;
      pendingYaw = pendingPitch = 0;
      spinY += (movedY - spinY) * 0.5;
      spinP += (movedP - spinP) * 0.5;
      momentum = spinY * inertia();
    } else {
      const moment = inertia();
      momentum *= Math.exp(-dt / YAW_FADE);
      momentum -= Math.sign(momentum) * Math.min(Math.abs(momentum), 0.22 * moment * dt);
      spinY = momentum / moment;
      // The opening turn ends with the crowded years facing you, until a thumb says otherwise.
      if (docking) {
        const off = YAW_REST - yaw;
        spinY = clamp(off * 1.9, -DOCK_SPEED, DOCK_SPEED);
        momentum = spinY * moment;
        if (Math.abs(off) < 0.004) {
          docking = false;
          spinY = momentum = 0;
        }
      }
      yaw += spinY * dt;
      if (!tip) {
        spinP *= Math.exp(-dt / PITCH_FADE);
        spinP -= Math.sign(spinP) * Math.min(Math.abs(spinP), 0.3 * dt);
        pitch += spinP * dt;
      }
    }
    before.set(along);
    physics(dt);
    showLine();
    let moved = 0;
    for (let i = 0; i < count; i++) moved = Math.max(moved, Math.abs(along[i] - before[i]));
    quiet = moved < 0.0016 ? quiet + 1 : 0;
    shake.multiplyScalar(Math.exp(-dt * 26)).clampLength(0, 0.05);
    for (let i = 0; i < count; i++) pulse[i] *= Math.exp(-dt * 16);
    if (lift !== liftGoal) {
      const change = dt / LIFT_TIME;
      lift =
        liftGoal > lift ? Math.min(liftGoal, lift + change) : Math.max(liftGoal, lift - change);
      if (lift === 0 && lifted >= 0) putBack();
    }
  };

  const wake = () => {
    quiet = 0;
    view.wake();
  };

  /** The lifted bead goes back to its place between its neighbours. */
  const putBack = () => {
    const bead = beads[lifted];
    const list = wires[bead.wire].beads;
    const k = list.indexOf(bead);
    const below = list[k - 1];
    const above = list[k + 1];
    const least = below ? along[below.id] + below.h + bead.h : bead.h;
    const most = above ? along[above.id] - above.h - bead.h : Infinity;
    along[lifted] = Math.max(least, Math.min(most, along[lifted]));
    velocity[lifted] = 0;
    lifted = -1;
  };

  // The card: the same type as the highlights, and the same Close as a dialog.
  const card = make("article", "", "three-strung-card");
  card.hidden = true;
  card.setAttribute("aria-live", "polite");
  const cardHead = make("div", "", "three-strung-card-head");
  const cardKind = make("p", "", "three-strung-card-kind");
  const cardSoon = make("span", " · upcoming");
  const cardClose = make("button", "Close", "video-dialog-close");
  cardClose.type = "button";
  cardClose.setAttribute("aria-label", "Close, and put the bead back");
  cardHead.append(cardKind, cardClose);
  const cardPhoto = make("img", "", "three-strung-card-photo");
  cardPhoto.hidden = true;
  const cardText = make("div", "", "three-strung-card-text");
  const cardEvent = make("h3", "", "three-strung-card-event");
  const cardTitle = make("p", "", "three-strung-card-title");
  const cardMeta = make("p", "", "three-strung-card-meta");
  cardText.append(cardEvent, cardTitle, cardMeta);
  const cardLink = make("a", "Open link", "three-strung-card-link");
  cardLink.target = "_blank";
  cardLink.rel = "noopener";
  card.append(cardHead, cardPhoto, cardText, cardLink);
  dialog.append(card);

  const fillCard = ({ talk }: Bead) => {
    cardKind.textContent = KIND[talk.kind];
    if (isUpcoming(talk)) cardKind.append(cardSoon);
    cardEvent.textContent = eventName(talk);
    cardTitle.textContent = talk.title ?? "";
    cardTitle.hidden = !talk.title;
    cardMeta.textContent = [talk.location, talk.year].filter(Boolean).join(" · ");
    cardLink.hidden = !talk.href;
    if (talk.href) cardLink.href = talk.href;
    const photo = photoOf(talk);
    cardPhoto.hidden = !photo;
    if (photo) {
      const { src, alt, width, height, position } = photo;
      const { props } = getImageProps({ src, alt, width, height, sizes: "410px" });
      cardPhoto.alt = alt;
      cardPhoto.sizes = props.sizes ?? "";
      cardPhoto.srcset = props.srcSet ?? "";
      cardPhoto.src = props.src;
      cardPhoto.style.objectPosition = position ?? "";
    }
    card.hidden = false;
    dialog.dataset.card = "";
    // Runs its way in again for each bead.
    card.getAnimations().forEach((animation) => animation.play());
  };

  const pick = (bead: Bead) => {
    if (lifted === bead.id && liftGoal) return;
    if (lifted >= 0) putBack();
    lifted = bead.id;
    velocity[lifted] = 0;
    lift = reduced ? 1 : 0;
    liftGoal = 1;
    cursor = bead.id;
    buzz(8);
    fillCard(bead);
    wake();
  };

  const closeCard = () => {
    // With the focus in a hidden card, the toy's keys would reach nothing.
    if (card.contains(document.activeElement)) canvas.focus({ preventScroll: true });
    card.hidden = true;
    delete dialog.dataset.card;
    if (lifted < 0) return;
    liftGoal = 0;
    if (reduced) {
      lift = 0;
      putBack();
    }
    wake();
  };

  /** The bead under a point on the canvas, preferring the front of the toy. */
  const nearest = (x: number, y: number) => {
    const { clientWidth: width, clientHeight: height } = canvas;
    let best: Bead | undefined;
    let bestScore = Infinity;
    for (let i = 0; i < count; i++) {
      const bead = beads[i];
      sample(wires[bead.wire], along[i]);
      spot.set(at[0], at[1], at[2]);
      inner.localToWorld(spot).applyMatrix4(camera.matrixWorldInverse);
      const depth = -spot.z;
      const dx = width / 2 + (spot.x / depth) * focal - x;
      const dy = height / 2 - (spot.y / depth) * focal - y;
      const distance = Math.hypot(dx, dy);
      const radius = (bead.r * focal) / depth;
      const score = Math.max(0, distance - radius) + (depth - reach) * 3.5;
      if (distance < radius + GRAB_SLOP && score < bestScore) {
        bestScore = score;
        best = bead;
      }
    }
    return best;
  };

  const tap = (x: number, y: number) => {
    if (y < TOP_BAR) return;
    const bead = nearest(x, y);
    if (bead) pick(bead);
    else if (!card.hidden) closeCard();
  };

  /** Radians of turn for a pixel of drag. */
  const perPixel = () => reach / focal / 1.05;

  const clearHint = () => {
    hintDone = true;
    delete hint.dataset.on;
  };

  const grab = () => {
    held = true;
    if (!reduced) clearHint();
    tip = null;
    docking = false;
    wasFast = Math.abs(spinY) > FAST || Math.abs(spinP) > FAST;
    flip = Math.cos(pitch) >= 0 ? 1 : -1;
    wake();
  };

  const dragBy = (dx: number, dy: number) => {
    pendingYaw += dx * perPixel() * flip;
    pendingPitch += dy * perPixel();
    wake();
  };

  const release = (vx: number, vy: number, isTap: boolean, x: number, y: number) => {
    held = false;
    if (reduced) {
      if (isTap) tap(x, y);
      return;
    }
    if (isTap && !wasFast) tap(x, y);
    if (!isTap) {
      spinY = clamp(vx * perPixel() * flip, -MAX_SPIN, MAX_SPIN);
      spinP = clamp(vy * perPixel(), -MAX_SPIN, MAX_SPIN);
      momentum = spinY * inertia();
    }
    if (!tipped) {
      if (Math.hypot(vx, vy) < 300) {
        tip = { t: 0, from: pitch };
        spinP = 0;
      } else {
        tipped = true;
      }
    }
    wake();
  };

  /** The way back: the toy turns home by the shorter way and the beads fall where they rest. */
  const goHome = () => {
    closeCard();
    clearHint();
    held = false;
    pendingYaw = pendingPitch = 0;
    pitch = near(pitch, PITCH_REST);
    yaw = near(yaw, YAW_REST);
    if (reduced) {
      pitch = PITCH_REST;
      yaw = YAW_REST;
    } else {
      tip = { t: 0, from: pitch };
      docking = true;
      momentum = spinY = spinP = 0;
    }
    wake();
  };

  const cleanups: (() => void)[] = [];
  const listen = (
    target: EventTarget,
    type: string,
    fn: (event: never) => void,
    options?: AddEventListenerOptions,
  ) => {
    target.addEventListener(type, fn as EventListener, options);
    cleanups.push(() => target.removeEventListener(type, fn as EventListener, options));
  };

  // The press on the toy. A press that barely moved is a tap, and a finger that
  // stopped before it lifted throws nothing.
  let press: {
    id: number;
    x: number;
    y: number;
    x0: number;
    y0: number;
    t0: number;
    far: number;
    trail: [number, number, number][];
  } | null = null;

  listen(canvas, "pointerdown", (event: PointerEvent) => {
    if (press || event.button) return;
    canvas.setPointerCapture(event.pointerId);
    const { pointerId: id, clientX: x, clientY: y, timeStamp: t0 } = event;
    press = { id, x, y, x0: x, y0: y, t0, far: 0, trail: [] };
    grab();
  });
  listen(canvas, "pointermove", (event: PointerEvent) => {
    if (!press || event.pointerId !== press.id) return;
    const { clientX: x, clientY: y, timeStamp: t } = event;
    dragBy(x - press.x, y - press.y);
    press.x = x;
    press.y = y;
    press.far = Math.max(press.far, Math.hypot(x - press.x0, y - press.y0));
    press.trail.push([t, x, y]);
    if (press.trail.length > 8) press.trail.shift();
  });
  const onLift = (event: PointerEvent) => {
    if (!press || event.pointerId !== press.id) return;
    const end = press.trail[press.trail.length - 1];
    let vx = 0;
    let vy = 0;
    if (end && event.timeStamp - end[0] < 130) {
      const first = press.trail.filter((point) => end[0] - point[0] < 110)[0];
      const span = Math.max((end[0] - first[0]) / 1000, 0.012);
      vx = (end[1] - first[1]) / span;
      vy = (end[2] - first[2]) / span;
    }
    const isTap =
      event.type === "pointerup" && press.far < TOUCH_SLOP && event.timeStamp - press.t0 < TAP_TIME;
    const box = canvas.getBoundingClientRect();
    press = null;
    release(vx, vy, isTap, event.clientX - box.left, event.clientY - box.top);
  };
  listen(canvas, "pointerup", onLift);
  listen(canvas, "pointercancel", onLift);

  // Arrow keys turn it from wherever the focus is. Enter steps through the beads
  // from the toy itself, and is a button's own on a button or a link.
  listen(dialog, "keydown", (event: KeyboardEvent) => {
    const { key, repeat, target } = event;
    if (key.startsWith("Arrow")) {
      event.preventDefault();
      clearHint();
      const across = key === "ArrowLeft" ? -1 : key === "ArrowRight" ? 1 : 0;
      const down = key === "ArrowUp" ? -1 : key === "ArrowDown" ? 1 : 0;
      if (reduced) {
        pendingYaw += across * 0.3;
        pendingPitch += down * 0.3;
      } else {
        tip = null;
        docking = false;
        tipped = true;
        spinY += across * 2.4;
        momentum = spinY * inertia();
        spinP += down * 2.4;
      }
      wake();
    } else if (key === "Enter" && !repeat && !(target as Element).closest("button,a")) {
      event.preventDefault();
      cursor = (cursor + 1) % count;
      pick(beads[cursor]);
    }
  });

  // Escape puts a bead back first. It reaches this before the shell, which would leave.
  listen(
    dialog,
    "cancel",
    (event: Event) => {
      if (event.target !== dialog || card.hidden) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeCard();
    },
    { capture: true },
  );
  listen(cardClose, "click", closeCard);

  // The buttons beside Close. The phone's own tilt, if it has one, steers gravity
  // across the screen.
  const tools = make("div", "", "three-strung-tools");
  const tool = (text: string) => {
    const button = make("button", text, "video-dialog-close three-strung-tool");
    button.type = "button";
    tools.append(button);
    return button;
  };
  const tiltButton = tool("Tilt");
  const soundButton = tool("Sound");
  const homeButton = tool("Reset");
  tiltButton.setAttribute("aria-pressed", "false");
  soundButton.setAttribute("aria-pressed", "false");
  homeButton.setAttribute("aria-label", "Reset, back to the opening pose");
  tiltButton.hidden = !(
    "DeviceOrientationEvent" in window && window.matchMedia("(pointer: coarse)").matches
  );
  const close = dialog.querySelector(".three-stage-close")!;
  close.before(tools);

  let tilting = false;
  const onTilt = ({ beta, gamma }: DeviceOrientationEvent) => {
    if (beta === null) return;
    const b = (beta * Math.PI) / 180;
    const c = ((gamma ?? 0) * Math.PI) / 180;
    const x = Math.sin(c) * Math.cos(b);
    const y = -Math.sin(b);
    const l = Math.hypot(x, y);
    if (l < 0.25) return;
    const a = ((screen.orientation?.angle ?? 0) * Math.PI) / 180;
    tiltX = (x * Math.cos(a) + y * Math.sin(a)) / l;
    tiltY = (-x * Math.sin(a) + y * Math.cos(a)) / l;
    wake();
  };
  const setTilt = (on: boolean) => {
    tilting = on;
    tiltButton.setAttribute("aria-pressed", String(on));
    if (on) {
      window.addEventListener("deviceorientation", onTilt);
    } else {
      window.removeEventListener("deviceorientation", onTilt);
      tiltX = 0;
      tiltY = -1;
      wake();
    }
  };
  const onTiltButton = async () => {
    if (tilting) {
      setTilt(false);
      return;
    }
    try {
      const { requestPermission } = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (requestPermission && (await requestPermission.call(DeviceOrientationEvent)) !== "granted")
        return;
      setTilt(true);
    } catch {}
  };
  const onSoundButton = () => {
    if (audio) {
      audio.close();
      audio = null;
    } else {
      try {
        audio = new AudioContext();
      } catch {}
    }
    soundButton.setAttribute("aria-pressed", String(!!audio));
  };
  listen(tiltButton, "click", onTiltButton);
  listen(soundButton, "click", onSoundButton);
  listen(homeButton, "click", goHome);

  const stopWatch = watchBrand(stage, (next) => {
    brand = next;
    dress();
    view.wake();
  });

  if (reduced) {
    settle();
    hint.dataset.on = "";
  }
  // Shaders build off the main thread where the browser allows it, so the lift
  // keeps moving.
  try {
    await renderer.compileAsync(scene, camera);
  } catch {}

  canvas.tabIndex = 0;
  canvas.setAttribute("role", "application");
  canvas.setAttribute(
    "aria-label",
    "Strung Years: a wire for each year and a bead for each talk. Arrow keys turn it, and Enter steps through the beads.",
  );
  canvas.focus({ preventScroll: true });
  if (!reduced) {
    tip = { t: -0.14, from: pitch };
    docking = true;
  }
  shown = true;
  view.wake();

  return () => {
    stopWatch();
    if (tilting) window.removeEventListener("deviceorientation", onTilt);
    cleanups.forEach((clean) => clean());
    audio?.close();
    for (const mesh of meshes) mesh.dispose();
    studioMap?.dispose();
    sun.dispose();
    disposeObject(scene);
    view.dispose();
  };
};

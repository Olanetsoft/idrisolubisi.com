/**
 * Loose Leaf in three.js: the same layout as the drawing it takes over from,
 * with depth, light and weight. Brass arms from the accent, paper leaves from
 * the paper token with the site's type printed on them, one ribbon for all the
 * thread, and shadows on the stage behind, whose light is CSS. The loop runs
 * while anything moves, and stops a few seconds after the last touch, once the
 * air has stilled. Reached only from src/lib/loose-leaf.ts, by a dynamic import.
 */

import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Scene,
  ShadowMaterial,
  Vector3,
  type DirectionalLight,
} from "three";
import {
  buzz,
  clearMessage,
  fadeName,
  later,
  layout,
  leafBack,
  leafGone,
  nameLeaf,
  placeChips,
  showCard,
  showHint,
  wrapTitle,
  type Article,
  type Lesson,
  type Piece,
} from "@/lib/loose-leaf";
import {
  BOW,
  LEAF_H,
  LEAF_W,
  SLOPE,
  WALL_Z,
  clamp,
  lerp,
  makeSim,
  pathOf,
  project,
  unproject,
  type Leaf,
  type Vec3,
} from "@/lib/loose-leaf-sim";
import type { Stage } from "@/lib/three-shell";
import {
  brandFonts,
  canvasTexture,
  createRenderer,
  disposeObject,
  lightStage,
  readBrand,
  watchBrand,
  type Brand,
} from "@/lib/three-stage";

const STEP = 1 / 120; // s
const AIR_FOR = 3; // s of moving air after the last touch
const AIR_FADE = 2; // s for it to die away
const SETTLED = 0.2; // of the total motion below which nothing can be seen moving
const SHEET_W = 256; // px, one leaf in the atlas
const SHEET_H = 341;
const SEGMENTS = 7; // points along a thread
const THREADS = 23; // one for each arm, and two for each leaf
const THREAD_R = 0.0105; // half a thread's width
const SHADOW_DARK = 0.62;
const SHADOW_LIGHT = 0.16;
// With no environment to reflect, brass and paper carry a little of their own light,
// so neither shades down to brown or grey. Paper needs none on the paper stage.
const BRASS_GLOW = 0.42;
const PAPER_GLOW = { dark: 0.3, light: 0 };

type Rig = { pos: number[]; nor: number[]; idx: number[] };
type Segment = {
  from: () => Vec3;
  to: () => Vec3;
  get: () => number;
  set: (lit: number) => void;
  target: number;
};

/** A bowed, tapered bar, elliptical in section, from tip to tip through the hub. */
function addBar(g: Rig, r: number, T: number) {
  const N = 18;
  const R = 6;
  const base = g.pos.length / 3;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2 - 1;
    const th = T * (1 - 0.64 * Math.pow(Math.abs(t), 1.15));
    for (let j = 0; j < R; j++) {
      const a = (j / R) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      g.pos.push(r * t, -BOW * r * t * t + c * th * 1.3, s * th * 0.78);
      g.nor.push(0, c * 0.8, s * 1.25);
    }
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < R; j++) {
      const a = base + i * R + j;
      const b = base + i * R + ((j + 1) % R);
      g.idx.push(a, a + R, b, b, a + R, b + R);
    }
  }
}

function addTurned(g: Rig, profile: number[][], cx: number, cy: number, rounds = 8) {
  const base = g.pos.length / 3;
  const N = profile.length;
  for (let i = 0; i < N; i++) {
    const [r, y] = profile[i];
    const p = profile[Math.max(0, i - 1)];
    const q = profile[Math.min(N - 1, i + 1)];
    const ny = -(q[0] - p[0]);
    const nr = q[1] - p[1];
    for (let j = 0; j < rounds; j++) {
      const a = (j / rounds) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      g.pos.push(cx + c * r, cy + y, s * r);
      g.nor.push(c * nr, ny, s * nr);
    }
  }
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < rounds; j++) {
      const a = base + i * rounds + j;
      const b = base + i * rounds + ((j + 1) % rounds);
      g.idx.push(a, b, a + rounds, b, b + rounds, a + rounds);
    }
  }
}

function armGeometry(r: number, lv: number) {
  const g: Rig = { pos: [], nor: [], idx: [] };
  const th = [0.078, 0.064, 0.05][lv];
  const h = th * 1.05;
  addBar(g, r, th);
  addTurned(
    g,
    [
      [0, h * 2.5],
      [h * 0.5, h * 2.1],
      [h * 1.05, h * 0.9],
      [h * 1.25, 0],
      [h * 0.95, -h * 0.95],
      [0, -h * 1.5],
    ],
    0,
    0,
  );
  const b = th * 0.62;
  for (const side of [-1, 1]) {
    addTurned(
      g,
      [
        [0, b],
        [b * 0.8, b * 0.55],
        [b, 0],
        [b * 0.8, -b * 0.55],
        [0, -b],
      ],
      side * r,
      -BOW * r,
      6,
    );
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(g.pos, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(g.nor, 3));
  geometry.setIndex(g.idx);
  geometry.normalizeNormals();
  return geometry;
}

function leafGeometry(i: number) {
  const geometry = new PlaneGeometry(LEAF_W, LEAF_H, 6, 8);
  const { position, normal, uv } = geometry.attributes;
  const ox = (i % 4) / 4;
  const oy = 1 - ((i >> 2) + 1) / 2;
  const flat = new Float32Array(position.count * 2);
  for (let n = 0; n < uv.count; n++) {
    uv.setXY(n, ox + uv.getX(n) / 4, oy + uv.getY(n) / 2);
    flat[n * 2] = position.getX(n);
    flat[n * 2 + 1] = LEAF_H / 2 - position.getY(n);
  }
  geometry.userData.flat = flat;
  (position as BufferAttribute).setUsage(DynamicDrawUsage);
  (normal as BufferAttribute).setUsage(DynamicDrawUsage);
  return geometry;
}

/** A sheet bent about its width, from the eyelet down, kept the same length. */
function curlLeaf(geometry: BufferGeometry, curl: number, twist: number) {
  const { position, normal } = geometry.attributes;
  const flat = geometry.userData.flat as Float32Array;
  const k = Math.abs(curl) < 0.012 ? 0.012 : curl;
  for (let n = 0; n < position.count; n++) {
    const x = flat[n * 2];
    const s = flat[n * 2 + 1];
    const sn = Math.sin(k * s);
    const cs = Math.cos(k * s);
    position.setXYZ(n, x, -sn / k, (1 - cs) / k + twist * x * s);
    normal.setXYZ(n, -twist * s * 0.6, sn, cs);
  }
  position.needsUpdate = true;
  normal.needsUpdate = true;
}

/** All eight sheets on one texture: the paper token, and the site's type in the paper's ink. */
function printSheets(
  x: CanvasRenderingContext2D,
  articles: Article[],
  doorLeaf: number,
  brand: Brand,
  { sans, mono }: { sans: string; mono: string },
) {
  const paper = brand.paper.getStyle();
  const ink = brand.paperInk.getStyle();
  articles.forEach(({ title, outlet, date }, i) => {
    const ox = (i % 4) * SHEET_W;
    const oy = (i >> 2) * SHEET_H;
    const margin = 24;
    x.globalAlpha = 1;
    x.fillStyle = paper;
    x.fillRect(ox, oy, SHEET_W, SHEET_H);
    // Paper is never one colour: a soft fall of tone and a little fibre.
    const fall = x.createLinearGradient(ox, oy, ox + SHEET_W, oy + SHEET_H);
    fall.addColorStop(0, paper);
    fall.addColorStop(1, ink);
    x.globalAlpha = 0.08;
    x.fillStyle = fall;
    x.fillRect(ox, oy, SHEET_W, SHEET_H);
    x.globalAlpha = 0.05;
    x.fillStyle = ink;
    for (let n = 0; n < 240; n++) {
      x.fillRect(
        ox + ((n * 97 + i * 31) % SHEET_W),
        oy + ((n * 61 + i * 13) % SHEET_H),
        1 + (n % 7),
        1,
      );
    }
    x.globalAlpha = 0.66;
    x.font = `400 19px ${mono}`;
    x.fillText(outlet, ox + margin, oy + 66);
    x.fillText(date, ox + margin, oy + 90);
    x.globalAlpha = 1;
    x.font = `600 28px ${sans}`;
    wrapTitle(title, x, SHEET_W - margin * 2 + 4, 6).forEach((line, n) => {
      x.fillText(line, ox + margin, oy + 136 + n * 33);
    });
    // The post the door sits on carries the site's one amber dot.
    if (i === doorLeaf) {
      x.fillStyle = brand.amber.getStyle();
      x.beginPath();
      x.arc(ox + SHEET_W - margin - 6, oy + 60, 6, 0, 7);
      x.fill();
    }
    // The punched hole, cut clean through.
    x.save();
    x.globalCompositeOperation = "destination-out";
    x.beginPath();
    x.arc(ox + SHEET_W / 2, oy + 20, 7, 0, 7);
    x.fill();
    x.restore();
    x.strokeStyle = ink;
    x.globalAlpha = 0.5;
    x.lineWidth = 2;
    x.beginPath();
    x.arc(ox + SHEET_W / 2, oy + 20, 8.5, 0, 7);
    x.stroke();
  });
}

export async function mount(lesson: Lesson, stage: Stage) {
  const fonts = await brandFonts();
  const { articles, doorLeaf, press: p, torn, dialog } = lesson;
  const tree = lesson.tree!;
  let brand = readBrand(stage);
  let live = false;

  const events: ["snap" | "catch" | "land", Leaf][] = [];
  const sim = makeSim(
    (l) => events.push(["snap", l]),
    (l) => events.push(["catch", l]),
    (l) => events.push(["land", l]),
  );

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 1, 80);
  const rig = new Group();
  scene.add(rig);
  const relight = lightStage(rig, brand);

  // The rig's key light throws the shadows, aimed a little lower for the mobile's middle.
  const key = rig.children[1] as DirectionalLight;
  key.position.y -= 5;
  key.target.position.y = -5;
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: -12, far: 16 });
  key.shadow.radius = 5;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.02;
  scene.add(key.target);

  // Brass. Amber runs through each half from the tip to the hub, in the shader.
  const amber = { value: brand.amber.clone() };
  const brassMaterial = (r: number) => {
    const material = new MeshStandardMaterial({
      color: brand.brass,
      emissive: brand.brass,
      emissiveIntensity: BRASS_GLOW,
      metalness: 0.2,
      roughness: 0.32,
    });
    const lit = { value: new Vector3(0, 0, r) };
    material.userData.lit = lit;
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uLit = lit;
      shader.uniforms.uAmber = amber;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying float vLx;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLx = position.x;");
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying float vLx;\nuniform vec3 uLit;\nuniform vec3 uAmber;",
        )
        .replace(
          "#include <opaque_fragment>",
          `float side = vLx < 0. ? uLit.x : uLit.y;
          float run = side > .001 ? smoothstep(.95 - side, 1.01 - side, abs(vLx) / uLit.z + .02) : 0.;
          outgoingLight = mix(outgoingLight, uAmber, run);
          #include <opaque_fragment>`,
        );
    };
    return material;
  };
  const armMeshes = sim.arms.map((a) => {
    const mesh = new Mesh(armGeometry(a.r, a.lv), brassMaterial(a.r));
    mesh.castShadow = true;
    mesh.rotation.order = "YZX";
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  });

  // Paper, printed on one side. Lambert, since a sheet this matt has no highlight to lose.
  const sheets = canvasTexture(SHEET_W * 4, SHEET_H * 2, (x) =>
    printSheets(x, articles, doorLeaf, brand, fonts),
  );
  sheets.anisotropy = 4;
  const back = { value: brand.paper.clone() };
  const paper = new MeshLambertMaterial({
    map: sheets,
    emissive: 0xffffff,
    emissiveMap: sheets,
    side: DoubleSide,
    alphaTest: 0.5,
  });
  paper.shadowSide = DoubleSide;
  paper.onBeforeCompile = (shader) => {
    shader.uniforms.uBack = back;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uBack;")
      .replace(
        "#include <map_fragment>",
        "#include <map_fragment>\nif (!gl_FrontFacing) diffuseColor.rgb = uBack;",
      );
  };
  const leafMeshes = sim.leaves.map((l, i) => {
    const mesh = new Mesh(leafGeometry(i), paper);
    mesh.castShadow = true;
    mesh.frustumCulled = false;
    curlLeaf(mesh.geometry, l.curl, 0);
    scene.add(mesh);
    return mesh;
  });

  // One dynamic ribbon for all thread: always facing the camera, in ink or in amber.
  const ribPos = new Float32Array(THREADS * SEGMENTS * 2 * 3);
  const ribCol = new Float32Array(THREADS * SEGMENTS * 2 * 3);
  const ribIdx: number[] = [];
  for (let r = 0; r < THREADS; r++) {
    for (let j = 0; j < SEGMENTS - 1; j++) {
      const a = (r * SEGMENTS + j) * 2;
      ribIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const ribGeometry = new BufferGeometry();
  const ribPositions = new BufferAttribute(ribPos, 3).setUsage(DynamicDrawUsage);
  const ribColours = new BufferAttribute(ribCol, 3).setUsage(DynamicDrawUsage);
  ribGeometry.setAttribute("position", ribPositions);
  ribGeometry.setAttribute("color", ribColours);
  ribGeometry.setIndex(ribIdx);
  const ribbons = new Mesh(
    ribGeometry,
    new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }),
  );
  ribbons.frustumCulled = false;
  ribbons.castShadow = true;
  scene.add(ribbons);
  let threadInk = brand.ink3.toArray();
  let threadLit = brand.amber.toArray();

  // Wall and floor only catch shadow: their light is the stage's own CSS, so the fade
  // from the drawing has nothing to jump over.
  const shadow = new ShadowMaterial({ transparent: true, depthWrite: false });
  const wall = new Mesh(new PlaneGeometry(1, 1), shadow);
  const ground = new Mesh(new PlaneGeometry(1, 1), shadow);
  wall.receiveShadow = ground.receiveShadow = true;
  wall.renderOrder = ground.renderOrder = -1;
  scene.add(wall, ground);

  // The head of the pulse: one small amber dot, in either theme.
  const head = new Mesh(
    new CircleGeometry(0.075, 14),
    new MeshBasicMaterial({ color: brand.amber, depthTest: false, transparent: true }),
  );
  head.renderOrder = 2;
  head.visible = false;
  scene.add(head);

  const dress = (next: Brand) => {
    brand = next;
    relight(next);
    amber.value.copy(next.amber);
    back.value.copy(next.paper);
    for (const { material } of armMeshes) {
      material.color.copy(next.brass);
      material.emissive.copy(next.brass);
    }
    paper.emissiveIntensity = PAPER_GLOW[next.theme];
    head.material.color.copy(next.amber);
    threadInk = next.ink3.toArray();
    threadLit = next.amber.toArray();
    shadow.color.copy(next.theme === "light" ? next.paperInk : next.bg);
    shadow.opacity = next.theme === "light" ? SHADOW_LIGHT : SHADOW_DARK;
  };
  dress(brand);

  const q1 = new Quaternion();
  const q2 = new Quaternion();
  const v1 = new Vector3();
  const v2 = new Vector3();
  const UP = new Vector3(0, 1, 0);
  const Z = new Vector3(0, 0, 1);
  const X = new Vector3(1, 0, 0);
  const turns = sim.leaves.map(() => new Quaternion());
  const curls = sim.leaves.map((l) => l.curl);
  const twists = sim.leaves.map(() => 0);

  const restTurn = (l: Leaf, out: Quaternion) => {
    q1.setFromAxisAngle(X, -(Math.PI / 2 - Math.atan(SLOPE)));
    q2.setFromAxisAngle(Z, lesson.view.pads[l.i].jitter);
    return out.copy(q1).multiply(q2);
  };

  const fit = () => {
    lesson.view = layout(lesson);
    const V = lesson.view;
    camera.position.set(0, V.ye, V.D);
    camera.rotation.set(0, 0, 0);
    camera.updateMatrixWorld(true);
    const n = camera.near;
    const k = n / V.f;
    camera.projectionMatrix.makePerspective(
      -V.cx * k,
      (V.W - V.cx) * k,
      V.eye * k,
      (V.eye - V.H) * k,
      n,
      camera.far,
    );
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    sim.ceil = V.ceil;
    sim.pad = V.pads;
    wall.scale.set(80, 40, 1);
    wall.position.set(0, V.seamY + 20, WALL_Z);
    const a = Math.atan(SLOPE);
    const len = 30;
    ground.scale.set(80, len, 1);
    ground.rotation.x = -(Math.PI / 2 - a);
    ground.position.set(0, V.seamY - (Math.sin(a) * len) / 2, WALL_Z + (Math.cos(a) * len) / 2);
    for (const l of sim.leaves) {
      if (l.state !== "rest") continue;
      const pad = V.pads[l.i];
      l.x = pad.x;
      l.y = pad.y;
      l.z = pad.z;
    }
  };

  /* ---- the pulse: amber from the leaf to the root, one stretch at a time ---- */

  let clock = 0;
  let shake = 0;
  let idle = 0;
  let acc = 0;
  let slow = 0;
  let slowFrames = 0;
  const tweens: { t: number; length: number; run: (u: number) => void }[] = [];
  let pulse: { t: number; length: number; stretches: Segment[] } | null = null;

  const dirtySide = (a: number, side: number) =>
    a >= 3 ? torn[(a - 3) * 2 + side] : tree.dirty(a * 2 + 1 + side);

  const firePulse = (leaf: number, path: number[], seconds: number) => {
    const stretches: Segment[] = [];
    let side = leaf & 1;
    // From the hook, half an arm at a time, up each thread, to the hash at the top.
    for (const a of path) {
      const arm = sim.arms[a];
      const half = side;
      const hub = (): Vec3 => [arm.x, arm.y, arm.z];
      stretches.push({
        from: () => arm.tip[half],
        to: hub,
        get: () => arm.lit[half],
        set: (lit) => {
          arm.lit[half] = lit;
        },
        target: dirtySide(a, half) ? 1 : 0,
      });
      const up = arm.parent >= 0 ? sim.arms[arm.parent].tip[arm.side] : null;
      stretches.push({
        from: hub,
        to: () => up ?? [0, sim.ceil, 0],
        get: () => arm.litT,
        set: (lit) => {
          arm.litT = lit;
        },
        target: tree.dirty(a) ? 1 : 0,
      });
      side = arm.side;
    }
    pulse = { t: clock, length: seconds, stretches };
    const each = seconds / stretches.length;
    stretches.forEach((stretch, n) => {
      const from = stretch.get();
      tweens.push({
        t: clock + each * n,
        length: each * 1.15,
        run: (u) => stretch.set(lerp(from, stretch.target, u)),
      });
    });
  };

  const movePulse = () => {
    if (!pulse) return;
    const u = (clock - pulse.t) / pulse.length;
    if (u >= 1) {
      head.visible = false;
      pulse = null;
      return;
    }
    const f = u * pulse.stretches.length;
    const stretch = pulse.stretches[Math.floor(f)];
    const a = stretch.from();
    const b = stretch.to();
    const k = f - Math.floor(f);
    head.visible = true;
    head.position.set(lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k));
  };

  /* ---- the frame ---- */

  const rib = (
    r: number,
    ax: number,
    ay: number,
    az: number,
    bx: number,
    by: number,
    bz: number,
    lit: number,
    wave: number,
    phase: number,
    w = THREAD_R,
  ) => {
    // The bottom of the thread is a, so amber climbs it from a.
    const dx = bx - ax;
    const dy = by - ay;
    const d = Math.hypot(dx, dy) || 1;
    const sx = dy / d;
    const sy = -dx / d;
    let o = r * SEGMENTS * 2 * 3;
    for (let j = 0; j < SEGMENTS; j++) {
      const t = j / (SEGMENTS - 1);
      const shift = wave ? wave * Math.sin(t * Math.PI) * Math.sin(phase + t * 7) : 0;
      const x = lerp(ax, bx, t) + sx * shift;
      const y = lerp(ay, by, t) + sy * shift;
      const z = lerp(az, bz, t);
      ribPos[o] = x - sx * w;
      ribPos[o + 1] = y - sy * w;
      ribPos[o + 2] = z;
      ribPos[o + 3] = x + sx * w;
      ribPos[o + 4] = y + sy * w;
      ribPos[o + 5] = z;
      const colour = lit > 0 && t <= lit + 0.001 ? threadLit : threadInk;
      ribCol.set(colour, o);
      ribCol.set(colour, o + 3);
      o += 6;
    }
  };

  const hideRib = (r: number) => {
    const o = r * SEGMENTS * 2 * 3;
    ribPos.fill(0, o, o + SEGMENTS * 6);
  };

  const pose = (dt: number) => {
    const V = lesson.view;
    const t = sim.t;
    let r = 0;
    for (const a of sim.arms) {
      const mesh = armMeshes[a.i];
      mesh.position.set(a.x, a.y, a.z);
      mesh.rotation.set(0, a.Y, -a.phi);
      const lit = mesh.material.userData.lit.value as Vector3;
      lit.x = a.lit[0];
      lit.y = a.lit[1];
      const up = a.parent >= 0 ? sim.arms[a.parent].tip[a.side] : ([0, sim.ceil, 0] as Vec3);
      rib(r++, a.x, a.y, a.z, up[0], up[1], up[2], a.litT, 0, 0);
    }
    for (const l of sim.leaves) {
      const i = l.i;
      const mesh = leafMeshes[i];
      const hk = l.arm.tip[i & 1];
      const q = turns[i];
      let px;
      let py;
      let pz;
      let tension = 0;
      if (l.state === "hung") {
        const ux = hk[0] - l.x;
        const uy = hk[1] - l.y;
        const uz = hk[2] - l.z;
        const d = Math.hypot(ux, uy, uz) || 1;
        v1.set(ux / d, Math.max(0.15, uy / d), uz / d).normalize();
        q1.setFromUnitVectors(UP, v1);
        q2.setFromAxisAngle(UP, l.Y);
        q1.multiply(q2);
        q.slerp(q1, 1 - Math.exp(-dt * 46));
        px = l.x;
        py = l.y;
        pz = l.z;
        const slack = Math.max(0, l.L - d);
        tension = clamp(l.tension / 4.2, 0, 1);
        const lit = tension > 0.04 ? 1 : l.lit;
        const wave = l.wave * 0.16 + slack * 0.22;
        const w = THREAD_R * (1 - tension * 0.3);
        rib(r++, l.x, l.y, l.z, hk[0], hk[1], hk[2], lit, wave, t * 40, w);
        hideRib(r++);
      } else {
        // The stub left on the hook, and the end still tied to the page.
        const end = hk[1] - Math.max(0.05, l.stub);
        rib(r++, hk[0], end, hk[2], hk[0], hk[1], hk[2], torn[i] ? 1 : 0, l.wave * 0.12, t * 46);
        if (l.state === "fall") {
          const sb = Math.sin(l.tb);
          const cb = Math.cos(l.tb);
          v1.set(Math.sin(l.ta) * cb, Math.cos(l.ta) * cb, sb).normalize();
          q1.setFromUnitVectors(Z, v1);
          q2.setFromAxisAngle(Z, l.Y * 0.7);
          q1.multiply(q2);
          q.slerp(q1, 1 - Math.exp(-dt * 11));
        } else if (l.state === "rest") {
          restTurn(l, q1);
          q.slerp(q1, 1 - Math.exp(-dt * 13));
        } else {
          q1.setFromAxisAngle(UP, Math.sin(t * 9 + i) * 0.25);
          q.slerp(q1, 1 - Math.exp(-dt * (l.state === "fly" ? 7 : 14)));
        }
        v1.set(0, LEAF_H * 0.5, 0).applyQuaternion(q);
        px = l.x + v1.x;
        py = l.y + v1.y;
        pz = l.z + v1.z;
        v2.set(0, 0.36, 0).applyQuaternion(q);
        if (l.state === "rest") {
          hideRib(r++);
        } else {
          const tail = px + v2.x * 0.6 + Math.sin(t * 9 + i) * 0.05;
          rib(r++, px, py, pz, tail, py + v2.y, pz + v2.z, 0, 0, 0);
        }
      }
      mesh.position.set(px, py, pz);
      mesh.quaternion.copy(q);
      // Paper bends with how it is moving, and lies nearly flat at rest.
      const speed = Math.hypot(l.x - l.xp, l.y - l.yp) * 120;
      const flying = l.state === "fall" || l.state === "fly";
      const curlTo =
        l.state === "rest"
          ? 0.11
          : l.curl +
            (flying ? 0.2 * Math.sin(t * 5 + i) + 0.22 : Math.min(0.3, speed * 0.05)) +
            tension * 0.1;
      const twistTo = flying
        ? 0.1 * Math.sin(t * 4.1 + i * 2)
        : l.state === "hung"
          ? clamp(l.Yv * 0.05, -0.09, 0.09)
          : 0;
      const k = 1 - Math.exp(-dt * 10);
      const curl = lerp(curls[i], curlTo, k);
      const twist = lerp(twists[i], twistTo, k);
      if (Math.abs(curl - curls[i]) > 0.0015 || Math.abs(twist - twists[i]) > 0.0008) {
        curls[i] = curl;
        twists[i] = twist;
        curlLeaf(mesh.geometry, curl, twist);
      }
    }
    ribPositions.needsUpdate = true;
    ribColours.needsUpdate = true;
    movePulse();
    placeChips(lesson);
    camera.position.y = V.ye + (shake > 0.001 ? Math.sin(t * 90) * shake : 0);
    camera.updateMatrixWorld();
  };

  const moving = () => {
    let total = 0;
    for (const a of sim.arms) {
      total += Math.abs(a.Yv) + Math.abs(a.pv);
      total += Math.hypot(a.x - a.xp, a.y - a.yp, a.z - a.zp) * 120;
    }
    for (const l of sim.leaves) {
      if (l.state === "rest") {
        const pad = lesson.view.pads[l.i];
        total += Math.hypot(l.x - pad.x, l.y - pad.y) * 2;
      } else if (l.state !== "hung") {
        total += 5;
      } else {
        total += Math.hypot(l.x - l.xp, l.y - l.yp, l.z - l.zp) * 120 + Math.abs(l.Yv);
      }
    }
    return total;
  };

  const draw = (dt: number) => {
    if (!live) return false;
    clock += dt;
    idle += dt;
    if (shake > 0.001) shake *= Math.exp(-dt * 13);
    sim.draft = clamp(1 - (idle - AIR_FOR) / AIR_FADE, 0, 1);
    acc += dt;
    while (acc >= STEP) {
      sim.step(STEP);
      acc -= STEP;
    }
    while (events.length) {
      const [type, l] = events.shift()!;
      if (type === "snap") onSnap(l);
      else if (type === "catch") onCatch(l);
      else onLand(l);
    }
    for (let i = tweens.length - 1; i >= 0; i--) {
      const { t, length, run } = tweens[i];
      const u = (clock - t) / length;
      if (u < 0) continue;
      run(Math.min(1, u));
      if (u >= 1) tweens.splice(i, 1);
    }
    pose(dt);
    const { renderer } = view;
    renderer.render(scene, camera);
    stage.ready();
    // A slow phone gives up pixels before it gives up frames.
    if (dt > 0) {
      slow += dt;
      slowFrames++;
      if (slowFrames === 45) {
        const ratio = renderer.getPixelRatio();
        if (slow / 45 > 0.024 && ratio > 1.25) {
          renderer.setPixelRatio(Math.max(1.25, ratio - 0.375));
          renderer.setSize(lesson.view.W, lesson.view.H, false);
        }
        slow = 0;
        slowFrames = 0;
      }
    }
    return (
      p.id !== null || sim.draft > 0 || tweens.length > 0 || pulse !== null || moving() > SETTLED
    );
  };

  const view = createRenderer(stage, { draw, resize: fit });
  view.renderer.shadowMap.enabled = true;

  const stir = () => {
    idle = 0;
    view.wake();
  };

  const stopWatching = watchBrand(stage, (next) => {
    dress(next);
    const x = (sheets.image as HTMLCanvasElement).getContext("2d")!;
    printSheets(x, articles, doorLeaf, next, fonts);
    sheets.needsUpdate = true;
    view.wake();
  });

  /* ---- what the physics reports ---- */

  function onSnap(l: Leaf) {
    buzz(14);
    shake = 0.028;
    void leafGone(lesson, l.i);
    if (lesson.card === -1) clearMessage(lesson);
  }
  function onLand(l: Leaf) {
    if (torn[l.i]) showCard(lesson, l.i);
  }
  function onCatch(l: Leaf) {
    buzz(10);
    void leafBack(lesson, l.i);
  }

  /* ---- gestures ---- */

  const spinStart = () => {
    p.mode = "spin";
    p.Y0 = sim.arms[0].Y;
    sim.spinTo = p.Y0;
    p.spinBase = p.x;
  };

  const grab = (l: Leaf) => {
    l.grab = { x: l.x, y: l.y, z: l.z };
    l.xp = l.x;
    l.zp = l.z;
    l.yp = l.y;
  };

  const launch = (l: Leaf, up: number, across: number, helped: boolean) => {
    const need = sim.flick(l);
    // A real flick keeps some of its own direction; the rest is help.
    const help = helped ? 1 : 0.86;
    l.vy = lerp(Math.max(up, 0), need.vy, help);
    l.vx = lerp(across, need.vx, help);
    l.vz = need.vz;
    l.state = "fly";
    l.flyT = 0;
    l.stub = 0.42;
  };

  const piece: Piece = {
    sim,
    pulse: (leaf, path, seconds) => {
      firePulse(leaf, path, seconds);
      stir();
    },
    light: (leaf, on) => {
      const l = sim.leaves[leaf];
      l.lit = on ? 1 : 0;
      let side = leaf & 1;
      for (const a of pathOf(leaf)) {
        const arm = sim.arms[a];
        arm.lit[side] = on || dirtySide(a, side) ? 1 : 0;
        arm.litT = on || tree.dirty(a) ? 1 : 0;
        side = arm.side;
      }
      view.wake();
    },
    down: (event) => {
      stir();
      if (p.leaf >= 0) {
        const l = sim.leaves[p.leaf];
        if (l.state === "hung") {
          const at = project(lesson.view, l.x, l.y, l.z);
          p.ox = at.x - p.x;
          p.oy = at.y - p.y;
          grab(l);
          l.xp = l.x - l.svx / 120;
          l.zp = l.z - l.svz / 120;
          p.mode = "pull";
          piece.light(l.i, true);
          nameLeaf(lesson, l.i);
          buzz(5);
          return;
        }
        if (l.state === "rest") {
          const at = project(lesson.view, l.x, l.y, l.z);
          p.ox = at.x - p.x;
          p.oy = at.y - p.y;
          l.state = "held";
          l.vx = l.vy = l.vz = 0;
          l.grab = { x: l.x, y: l.y, z: l.z };
          p.mode = "held";
          p.trail = [[p.x, p.y, event.timeStamp]];
          showCard(lesson, l.i);
          return;
        }
      }
      spinStart();
    },
    move: (event) => {
      stir();
      const V = lesson.view;
      if (p.mode === "pull") {
        const l = sim.leaves[p.leaf];
        if (!l.grab) return;
        // Sideways from a leaf is a spin: a swipe should not need to find empty space.
        const dx = p.x - p.x0;
        const dy = p.y - p.y0;
        if (!p.committed && Math.hypot(dx, dy) > 10) {
          if (Math.abs(dx) > Math.abs(dy) * 1.5) {
            sim.release(l);
            piece.light(l.i, false);
            showHint(lesson);
            spinStart();
            p.spinBase = p.x0;
            piece.move(event);
            return;
          }
          p.committed = true;
        }
        const w = unproject(V, p.x + p.ox, p.y + p.oy, l.grab.z);
        l.grab.x = w.x;
        l.grab.y = w.y;
      } else if (p.mode === "spin") {
        sim.spinTo = p.Y0 + (p.x - p.spinBase) / (V.u * 2.6);
      } else if (p.mode === "held") {
        const l = sim.leaves[p.leaf];
        const w = unproject(V, p.x + p.ox, p.y + p.oy, l.grab!.z);
        l.grab!.x = w.x;
        l.grab!.y = w.y;
        p.trail.push([p.x, p.y, event.timeStamp]);
        if (p.trail.length > 6) p.trail.shift();
      }
    },
    up: (event) => {
      stir();
      if (p.mode === "pull") {
        const l = sim.leaves[p.leaf];
        piece.light(l.i, false);
        if (l.grab) {
          const side = p.x < project(lesson.view, l.x, l.y, l.z).x ? 1 : -1;
          const push = p.moved ? 0 : side * 1.1;
          sim.release(l);
          l.wave = Math.max(l.wave, Math.min(1, l.Ls));
          l.svx += push;
          l.Yv += push;
          fadeName(lesson);
        }
      } else if (p.mode === "spin") {
        sim.spinTo = null;
        const root = sim.arms[0];
        root.Yv = clamp(root.Yv, -13, 13);
        // A tap on empty air: a little push, so it is never dead.
        if (!p.moved) root.Yv += (p.x < lesson.view.cx ? -1 : 1) * 0.9;
      } else if (p.mode === "held") {
        const l = sim.leaves[p.leaf];
        const [a, b] = [p.trail[0], p.trail[p.trail.length - 1]];
        const seconds = Math.max(1, b[2] - a[2]) / 1000;
        const up = (a[1] - b[1]) / seconds; // px/s
        const across = (b[0] - a[0]) / seconds;
        l.grab = null;
        if (event.type !== "pointercancel" && up > 260 && up > Math.abs(across) * 0.7) {
          launch(l, up / lesson.view.u, across / lesson.view.u, false);
        } else if (p.y0 - p.y > 24) {
          l.state = "fall";
          l.ta = 0.2;
          l.tb = 0.9;
          l.tav = l.tbv = 0;
          l.vx = l.vy = l.vz = 0;
        } else {
          l.state = "rest";
        }
      }
      p.mode = null;
      p.committed = false;
    },
    autoTear: (i) => {
      const l = sim.leaves[i];
      if (l.state !== "hung" || l.grab) return;
      stir();
      grab(l);
      const { x, y } = l;
      const go = (n: number) => {
        if (!l.grab) return;
        l.grab.y = y - n * 0.14;
        l.grab.x = x + Math.sin(n * 0.4) * 0.02;
        stir();
        if (n < 120) later(lesson, 16, () => go(n + 1));
      };
      go(0);
    },
    autoRehang: (i) => {
      const l = sim.leaves[i];
      if (l.state !== "rest" && l.state !== "fall") return;
      launch(l, 0, 0, true);
      stir();
    },
    spinBy: (speed) => {
      sim.arms[0].Yv += speed;
      stir();
    },
  };

  // Anything already torn in the drawing starts on the floor.
  sim.pad = lesson.view.pads;
  sim.leaves.forEach((l, i) => {
    if (!torn[i]) return;
    const pad = lesson.view.pads[i];
    l.state = "rest";
    l.w = [0, 0, 0];
    l.stub = 0.42;
    l.x = pad.x;
    l.y = pad.y;
    l.z = pad.z;
    restTurn(l, turns[i]);
  });
  for (const a of sim.arms) sim.placeTips(a);

  // Compiled before it shows, so the first frame is not a stall.
  try {
    await view.renderer.compileAsync(scene, camera);
  } catch {}
  // A finger on the drawing lifts first, so a press does not change hands.
  for (let n = 0; p.id !== null && n < 90 && dialog.isConnected; n++) {
    await new Promise((resolve) => window.setTimeout(resolve, 16));
  }

  // What the drawing already lit stays lit.
  for (const a of sim.arms) {
    a.lit = [dirtySide(a.i, 0) ? 1 : 0, dirtySide(a.i, 1) ? 1 : 0];
    a.litT = tree.dirty(a.i) ? 1 : 0;
  }

  // It arrives a little high, drops on its thread and bounces, already turning.
  const lift = 0.24;
  sim.drop.x = -lift;
  sim.drop.v = 0;
  for (const a of sim.arms) {
    a.y += lift;
    a.yp += lift;
    sim.placeTips(a);
  }
  for (const l of sim.leaves) {
    if (l.state !== "hung") continue;
    l.y += lift;
    l.yp += lift;
  }
  sim.arms[0].Yv = 1.05;
  sim.arms[1].pv = 0.3;
  sim.arms[2].pv = -0.25;
  sim.t = 0;
  lesson.piece = piece;
  live = true;
  stir();

  // If nobody has touched it yet, the door's own leaf gives one small tug: it can be pulled.
  later(lesson, 1500, () => {
    const l = sim.leaves[doorLeaf];
    if (lesson.touched || lesson.piece !== piece || torn[doorLeaf] || l.grab) return;
    grab(l);
    const { x, y, z } = l;
    const started = performance.now();
    const go = () => {
      if (lesson.touched || !l.grab || lesson.piece !== piece) return;
      const u = (performance.now() - started) / 420;
      if (u >= 1) {
        sim.release(l);
        return;
      }
      l.grab.x = x;
      l.grab.y = y - Math.sin(u * Math.PI * 0.5) * 0.95;
      l.grab.z = z;
      stir();
      requestAnimationFrame(go);
    };
    go();
  });

  return () => {
    live = false;
    lesson.piece = null;
    stopWatching();
    key.shadow.dispose();
    disposeObject(scene);
    view.dispose();
  };
}

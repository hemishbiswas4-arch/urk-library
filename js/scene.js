import * as THREE from "three";
import { MODULES } from "../data/content.js?v=20260711f";
import { TOOL_STATIONS } from "../data/tools.js?v=20260711f";
import { MODULE_COLORS, SHELF_SHORT } from "../data/palette.js?v=20260711f";

// One hue per module (validated CVD-safe categorical palette) → each shelf
// reads as a single identifiable colour.
const MODULE_HUES = MODULE_COLORS.map((c) => parseInt(c.slice(1), 16));

// Reading depth is encoded by SIZE, not colour: the books you must read fully
// are physically the biggest; reference-only titles are slim. Colour stays the
// module hue so a shelf never turns into a rainbow.
const DEPTH_STYLE = {
  READ:  { height: 1.00, lighten: 0.00, label: "Read fully" },
  SKIM:  { height: 0.78, lighten: 0.16, label: "Skim" },
  WATCH: { height: 0.78, lighten: 0.10, label: "Watch" },
  REF:   { height: 0.58, lighten: 0.34, label: "Reference" },
};

const DONE_GOLD = 0xe0b34a;

const ZSLOTS = [-9, -3, 3, 9];
const ROOM = { hw: 20, hd: 13, h: 8 };

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Short, recognisable spine label from a full reading title.
function shortenTitle(title) {
  let t = title.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  t = t.replace(/[—–-]\s*(Executive Summary|full text|latest edition).*$/i, "").trim();
  if (t.length > 30) {
    const cut = t.slice(0, 30);
    const sp = cut.lastIndexOf(" ");
    t = (sp > 16 ? cut.slice(0, sp) : cut).trim() + "…";
  }
  return t;
}

function luminance(hex) {
  const r = ((hex >> 16) & 255) / 255, g = ((hex >> 8) & 255) / 255, b = (hex & 255) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// A book-spine texture: module colour with the title printed lengthwise, like a
// real hardback. Cached so identical (title,colour) pairs share one texture.
const _spineCache = new Map();
function makeSpineTexture(title, hex, depthKey) {
  const key = `${hex}|${depthKey}|${title}`;
  if (_spineCache.has(key)) return _spineCache.get(key);

  const W = 168, H = 660;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  const css = `#${hex.toString(16).padStart(6, "0")}`;
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, W, H);

  // head/tail bands + a couple of raised "cords" for a bound-book feel
  const dark = `rgba(0,0,0,0.18)`;
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, W, 26);
  ctx.fillRect(0, H - 26, W, 26);
  ctx.fillStyle = `rgba(0,0,0,0.10)`;
  ctx.fillRect(0, 150, W, 8);
  ctx.fillRect(0, H - 158, W, 8);

  const ink = luminance(hex) < 0.62 ? "#ffffff" : "#1c2028";
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-Math.PI / 2);            // read bottom-to-top
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const maxLen = H - 90;
  let size = 40;
  do {
    ctx.font = `600 ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    if (ctx.measureText(title).width <= maxLen) break;
    size -= 2;
  } while (size > 16);
  ctx.fillText(title, 0, 2);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  _spineCache.set(key, tex);
  return tex;
}

export function initLibrary({ canvas, badgeLayer, onSelectReading, onSelectModule, onEnterOverview, onEnterShelf, onSelectCabinet }) {
  if (!window.WebGLRenderingContext) throw new Error("no-webgl");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeef0f2);
  scene.fog = new THREE.Fog(0xeef0f2, 44, 82);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
  const overviewPos = new THREE.Vector3(0, 19, 29);
  const overviewTarget = new THREE.Vector3(0, 1.5, -1);
  camera.position.copy(overviewPos);
  const currentTarget = overviewTarget.clone();
  camera.lookAt(currentTarget);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch (e) {
    throw new Error("no-webgl");
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // updateStyle=false everywhere: CSS (width/height:100%) controls display size,
  // the drawing buffer follows clientWidth/Height. Avoids a stuck inline px size.
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = false;

  // ---------------------------------------------------------------------
  // Lighting
  // ---------------------------------------------------------------------
  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcccabf, 0.6));
  const key = new THREE.DirectionalLight(0xfff8ee, 1.0);
  key.position.set(12, 22, 14);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe6ecf5, 0.4);
  fill.position.set(-14, 14, -12);
  scene.add(fill);

  // ---------------------------------------------------------------------
  // Room shell
  // ---------------------------------------------------------------------
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xdedcd3, roughness: 0.95 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.hw * 2, ROOM.hd * 2), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Subtle central rug — just warms the floor now that the room is open.
  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM.hw * 0.95, ROOM.hd * 1.25),
    new THREE.MeshStandardMaterial({ color: 0xdbe6f2, roughness: 1 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.y = 0.01;
  scene.add(rug);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f3, roughness: 1 });
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.hw * 2, ROOM.h), wallMat);
  backWall.position.set(0, ROOM.h / 2, -ROOM.hd);
  scene.add(backWall);
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.hd * 2, ROOM.h), wallMat);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-ROOM.hw, ROOM.h / 2, 0);
  scene.add(leftWall);
  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.hd * 2, ROOM.h), wallMat.clone());
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(ROOM.hw, ROOM.h / 2, 0);
  scene.add(rightWall);

  // ---------------------------------------------------------------------
  // Books, shelves, plaques
  // ---------------------------------------------------------------------
  const interactive = []; // { mesh, type, id }
  const booksById = {};   // readingId -> { mesh, plainMat, spineMat }
  const shelvesById = {}; // moduleId -> { plaqueMesh, worldPos, closeup:{pos,target} }
  let cabinet = null;      // { worldPos, closeup:{pos,target} }
  const labelAnchors = []; // { type:'shelf'|'cabinet'|'sign', id, obj, text }

  function addInteractive(mesh, type, id) {
    mesh.userData.type = type;
    mesh.userData.id = id;
    interactive.push(mesh);
  }

  function buildShelf(mod, index, side, zPos) {
    const group = new THREE.Group();
    const x = side === "left" ? -ROOM.hw + 0.55 : ROOM.hw - 0.55;
    group.position.set(x, 0, zPos);
    group.rotation.y = side === "left" ? Math.PI / 2 : -Math.PI / 2;
    scene.add(group);

    const tint = new THREE.Color(MODULE_HUES[index]);
    const oak = 0xd8c3a0;     // light oak boards
    const oakPost = 0xc3a97f; // slightly darker frame posts

    // Back panel is washed with the module hue so each shelf is identifiable
    // by colour from across the room, even before you read the label.
    const panelColor = new THREE.Color(0xf0ece2).lerp(tint, 0.32);
    const frameMat = new THREE.MeshStandardMaterial({ color: panelColor, roughness: 0.9 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(5.6, 3.7, 0.18), frameMat);
    frame.position.set(0, 1.95, -0.5);
    group.add(frame);
    addInteractive(frame, "shelf", mod.id);

    const frameWoodMat = new THREE.MeshStandardMaterial({ color: oakPost, roughness: 0.8 });
    const boardMat = new THREE.MeshStandardMaterial({ color: oak, roughness: 0.8 });
    const boardYs = [0.55, 1.75, 2.95];
    const boardMeshes = [];
    boardYs.forEach((y) => {
      const board = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.08, 1.0), boardMat);
      board.position.set(0, y, -0.05);
      group.add(board);
      addInteractive(board, "shelf", mod.id);
      boardMeshes.push(y);
    });
    // side posts
    [-2.75, 2.75].forEach((px) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.7, 1.0), frameWoodMat);
      post.position.set(px, 1.95, -0.05);
      group.add(post);
      addInteractive(post, "shelf", mod.id);
    });

    // Readings are pre-sequenced foundational→advanced in content.js. Chunk them
    // consecutively (not round-robin) so the shelf reads like a page: the first
    // third sits left→right on the TOP board, the middle third on the middle
    // board, and the most advanced third along the BOTTOM board.
    const total = mod.readings.length;
    const base = Math.floor(total / 3);
    const rem = total % 3;
    const chunks = [];
    let cursor = 0;
    for (let c = 0; c < 3; c++) {
      const size = base + (c < rem ? 1 : 0);
      chunks.push(mod.readings.slice(cursor, cursor + size));
      cursor += size;
    }
    // chunks[0] (basic) → top board (boardYs[2]); chunks[2] (advanced) → bottom (boardYs[0]).
    const rowBoardY = [boardYs[2], boardYs[1], boardYs[0]];

    chunks.forEach((rowReadings, rowIdx) => {
      if (!rowReadings.length) return;
      const y = rowBoardY[rowIdx];
      // Comfortable, fairly uniform spine width, left-aligned so a part-full
      // shelf looks like a real one rather than a floating cluster.
      const gap = 0.06;
      const bookW = Math.max(0.34, Math.min(0.52, 5.15 / rowReadings.length - gap));
      let cx = -2.5 + bookW / 2;
      rowReadings.forEach((reading) => {
        const style = DEPTH_STYLE[reading.depth] || DEPTH_STYLE.REF;
        // Depth → book height (READ tallest, REF slimmest). Colour = module hue,
        // lightened a touch for lower-priority tiers so they visibly recede.
        const h = 0.5 + style.height * 0.72;
        const bookColorHex = tint.clone().lerp(new THREE.Color(0xffffff), style.lighten).getHex();
        const plainMat = new THREE.MeshStandardMaterial({ color: bookColorHex, roughness: 0.55, emissive: 0x000000 });
        const spineTex = makeSpineTexture(shortenTitle(reading.title), bookColorHex, reading.depth);
        const spineMat = new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.6, emissive: 0x000000 });
        // Box face order: [ +x, -x, +y, -y, +z, -z ]; +z is the spine facing the room.
        const mats = [plainMat, plainMat, plainMat, plainMat, spineMat, plainMat];
        const book = new THREE.Mesh(new THREE.BoxGeometry(bookW, h, 0.44), mats);
        const wobble = (((reading.id.length * 31) % 7) - 3) * 0.008;
        book.position.set(cx + wobble, y + 0.08 + h / 2, -0.02);
        book.rotation.z = wobble * 0.4;
        group.add(book);
        addInteractive(book, "reading", reading.id);
        booksById[reading.id] = { mesh: book, plainMat, spineMat };
        cx += bookW + gap;
      });
    });

    // plaque (module reminders)
    const plaqueMat = new THREE.MeshStandardMaterial({ color: tint.clone().lerp(new THREE.Color(0xffffff), 0.15), roughness: 0.6 });
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.08), plaqueMat);
    plaque.position.set(0, 0.25, 0.15);
    group.add(plaque);
    addInteractive(plaque, "shelfReminder", mod.id);

    // Head-on so the printed spine titles read straight (clicking a bare shelf
    // opens no panel, so the whole shelf is visible).
    const dir = side === "left" ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(-1, 0, 0);
    const worldPos = new THREE.Vector3(x, 0, zPos);
    const closeupPos = worldPos.clone().add(dir.clone().multiplyScalar(7.0));
    closeupPos.y = 2.35;
    const closeupTarget = worldPos.clone();
    closeupTarget.y = 1.85;

    shelvesById[mod.id] = { worldPos, plaqueMesh: plaque, closeup: { pos: closeupPos, target: closeupTarget } };
    labelAnchors.push({ type: "shelf", id: mod.id, obj: frame, text: SHELF_SHORT[mod.id] || mod.title });
  }

  const leftModules = MODULES.slice(0, 4);
  const rightModules = MODULES.slice(4, 8);
  leftModules.forEach((m, i) => buildShelf(m, i, "left", ZSLOTS[i]));
  rightModules.forEach((m, i) => buildShelf(m, i + 4, "right", ZSLOTS[i]));

  // ---------------------------------------------------------------------
  // The reference cabinet (all the work tools live here, on the back wall)
  // ---------------------------------------------------------------------
  const cabZ = -ROOM.hd + 0.75;
  const cab = new THREE.Group();
  cab.position.set(0, 0, cabZ);
  scene.add(cab);

  const cabWood = new THREE.MeshStandardMaterial({ color: 0xb98d5f, roughness: 0.75 });
  const cabWoodDark = new THREE.MeshStandardMaterial({ color: 0x8f6a45, roughness: 0.75 });
  const CAB_W = 8.4, CAB_H = 3.4, CAB_D = 1.15;

  const body = new THREE.Mesh(new THREE.BoxGeometry(CAB_W, CAB_H, CAB_D), cabWood);
  body.position.y = CAB_H / 2 + 0.02;
  cab.add(body);
  addInteractive(body, "cabinet", "cabinet");

  // top ledge + plinth
  const ledge = new THREE.Mesh(new THREE.BoxGeometry(CAB_W + 0.3, 0.18, CAB_D + 0.3), cabWoodDark);
  ledge.position.y = CAB_H + 0.1;
  cab.add(ledge);
  addInteractive(ledge, "cabinet", "cabinet");
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(CAB_W + 0.2, 0.22, CAB_D + 0.2), cabWoodDark);
  plinth.position.y = 0.11;
  cab.add(plinth);

  // Grid of little card-catalogue drawers on the front (+z) face. One column
  // per tool, gently spotlit; a brass knob on each.
  const cols = TOOL_STATIONS.length; // 8
  const rows = 3;
  const drawerFrontZ = CAB_D / 2 + 0.03;
  const marginX = 0.5, marginY = 0.55;
  const cellW = (CAB_W - marginX * 2) / cols;
  const cellH = (CAB_H - marginY * 2) / rows;
  const drawerMat = new THREE.MeshStandardMaterial({ color: 0xcaa173, roughness: 0.7 });
  const knobMat = new THREE.MeshStandardMaterial({ color: 0xd8b45a, roughness: 0.35, metalness: 0.5 });
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const dx = -CAB_W / 2 + marginX + cellW * (c + 0.5);
      const dy = CAB_H / 2 + 0.02 - (-marginY - cellH * (r + 0.5) + CAB_H / 2) - 0; // centre of cell
      const cy = marginY + cellH * (r + 0.5);
      const drawer = new THREE.Mesh(new THREE.BoxGeometry(cellW - 0.12, cellH - 0.12, 0.06), drawerMat);
      drawer.position.set(dx, cy, drawerFrontZ);
      cab.add(drawer);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), knobMat);
      knob.position.set(dx, cy, drawerFrontZ + 0.06);
      cab.add(knob);
    }
  }

  const cabGlow = new THREE.PointLight(0xfff0d6, 0.5, 12);
  cabGlow.position.set(0, CAB_H + 1.4, cabZ + 3);
  scene.add(cabGlow);

  const cabinetWorld = new THREE.Vector3(0, 0, cabZ);
  cabinet = {
    worldPos: cabinetWorld,
    closeup: { pos: new THREE.Vector3(0, 2.4, cabZ + 8.5), target: new THREE.Vector3(0, 1.7, cabZ) },
  };
  labelAnchors.push({ type: "cabinet", id: "cabinet", obj: ledge, text: "🗂 Reference cabinet" });

  // entrance sign, above the cabinet
  const signMat = new THREE.MeshStandardMaterial({ color: 0x46607f, roughness: 0.5, emissive: 0x24405f, emissiveIntensity: 0.3 });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 0.15), signMat);
  sign.position.set(0, 5.7, -ROOM.hd + 0.2);
  scene.add(sign);
  labelAnchors.push({ type: "sign", id: "sign", obj: sign, text: "AENC 2026 · The URK Library" });

  // ---------------------------------------------------------------------
  // Decor — none of this is interactive/raycast-registered on purpose, it's
  // set dressing only. Minimalist procedural mockups (no external images),
  // consistent with the rest of the room's low-poly style.
  // ---------------------------------------------------------------------

  // ---- Wall-mounted AC unit (back wall, up high) ----
  {
    const acGroup = new THREE.Group();
    acGroup.position.set(13.2, 6.35, -ROOM.hd + 0.16);
    scene.add(acGroup);
    const acBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.4, 0.28),
      new THREE.MeshStandardMaterial({ color: 0xf2f3f0, roughness: 0.4 })
    );
    acGroup.add(acBody);
    const acGrille = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.16, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xb7bcb8, roughness: 0.6 })
    );
    acGrille.position.set(0, -0.05, 0.15);
    acGroup.add(acGrille);
    const acLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x6fd6ff, emissive: 0x6fd6ff, emissiveIntensity: 0.9 })
    );
    acLight.position.set(0.7, 0.05, 0.15);
    acGroup.add(acLight);
  }

  // ---- Framed wall art (simple canvas-generated abstract prints) ----
  function makeArtTexture(hueHex) {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 320;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#f7f5ef";
    ctx.fillRect(0, 0, c.width, c.height);
    const base = new THREE.Color(hueHex);
    ctx.fillStyle = `#${base.getHexString()}`;
    ctx.beginPath();
    ctx.arc(c.width * 0.5, c.height * 0.42, 70, 0, Math.PI * 2);
    ctx.fill();
    const soft = base.clone().lerp(new THREE.Color(0xffffff), 0.55);
    ctx.strokeStyle = `#${soft.getHexString()}`;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(30, c.height - 60);
    ctx.lineTo(c.width - 30, c.height - 110);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(30, c.height - 40);
    ctx.lineTo(c.width - 30, c.height - 90);
    ctx.stroke();
    return new THREE.CanvasTexture(c);
  }
  function addWallArt(x, z, hue) {
    // Mounted flat on the back wall, facing +z (out into the room) — no rotation needed.
    const group = new THREE.Group();
    group.position.set(x, 4.3, z);
    scene.add(group);
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.9, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x5b4636, roughness: 0.7 })
    );
    group.add(frame);
    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(1.28, 1.68),
      new THREE.MeshStandardMaterial({ map: makeArtTexture(hue), roughness: 0.9 })
    );
    art.position.z = 0.045;
    group.add(art);
  }
  addWallArt(-9.2, -ROOM.hd + 0.09, MODULE_HUES[2]);
  addWallArt(9.2, -ROOM.hd + 0.09, MODULE_HUES[6]);

  // ---- Potted plants (procedural, flank the entrance) ----
  function addPlant(x, z, scale = 1) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.scale.setScalar(scale);
    scene.add(group);
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.19, 0.34, 12),
      new THREE.MeshStandardMaterial({ color: 0xb5673f, roughness: 0.8 })
    );
    pot.position.y = 0.17;
    group.add(pot);
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.045, 0.4, 6),
      new THREE.MeshStandardMaterial({ color: 0x5c4632, roughness: 0.8 })
    );
    trunk.position.y = 0.52;
    group.add(trunk);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x3f8a5a, roughness: 0.85 });
    [[0, 0.95, 0, 0.36], [0.16, 0.78, 0.1, 0.26], [-0.18, 0.82, -0.12, 0.24], [0.05, 1.18, -0.08, 0.24]]
      .forEach(([dx, dy, dz, r]) => {
        const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), foliageMat);
        leaf.position.set(dx, dy, dz);
        group.add(leaf);
      });
  }
  addPlant(-18.7, 11.5, 1.1);
  addPlant(18.7, 11.5, 1.1);

  // ---- Reading corner — a semi-screened nook, tucked in the back-left ----
  // corner where two people could sit and talk without being in the main
  // sightline. A folding screen angles across the open side; a warm rug,
  // low table with a clock, and a floor lamp finish the space.
  {
    const nx = -14.6, nz = -11.3;

    // distinct carpet under the nook, warmer than the main hall rug
    const nookRug = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 4.6),
      new THREE.MeshStandardMaterial({ color: 0xcf9d6b, roughness: 1 })
    );
    nookRug.rotation.x = -Math.PI / 2;
    nookRug.position.set(nx, 0.012, nz);
    scene.add(nookRug);
    const nookRugTrim = new THREE.Mesh(
      new THREE.RingGeometry(2.7, 2.85, 4, 1),
      new THREE.MeshStandardMaterial({ color: 0x8a5a34, roughness: 1 })
    );
    nookRugTrim.rotation.x = -Math.PI / 2;
    nookRugTrim.position.set(nx, 0.013, nz);
    scene.add(nookRugTrim);

    // two armchairs, facing each other
    const chairFabric = new THREE.MeshStandardMaterial({ color: 0x5a7a8a, roughness: 0.9 });
    const chairWood = new THREE.MeshStandardMaterial({ color: 0x6b4e35, roughness: 0.7 });
    function addArmchair(cx, cz, facingPositiveX) {
      const g = new THREE.Group();
      g.position.set(cx, 0, cz);
      g.rotation.y = facingPositiveX ? Math.PI / 2 : -Math.PI / 2;
      scene.add(g);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.15, 0.8), chairFabric);
      seat.position.y = 0.42;
      g.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 0.14), chairFabric);
      back.position.set(0, 0.78, -0.33);
      g.add(back);
      [-0.42, 0.42].forEach((ax) => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.4, 0.8), chairFabric);
        arm.position.set(ax, 0.55, 0);
        g.add(arm);
      });
      [[-0.35, -0.3], [0.35, -0.3], [-0.35, 0.3], [0.35, 0.3]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.34, 6), chairWood);
        leg.position.set(lx, 0.17, lz);
        g.add(leg);
      });
    }
    addArmchair(nx - 1.5, nz, true);
    addArmchair(nx + 1.5, nz, false);

    // small round table between them, with a clock on top
    const tableTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.06, 20),
      new THREE.MeshStandardMaterial({ color: 0x8a6a48, roughness: 0.6 })
    );
    tableTop.position.set(nx, 0.5, nz);
    scene.add(tableTop);
    const tableLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.09, 0.47, 10),
      chairWood
    );
    tableLeg.position.set(nx, 0.235, nz);
    scene.add(tableLeg);

    // a small table clock (canvas clock-face texture)
    const clockCanvas = document.createElement("canvas");
    clockCanvas.width = 128; clockCanvas.height = 128;
    const cctx = clockCanvas.getContext("2d");
    cctx.fillStyle = "#f7f4ec";
    cctx.beginPath(); cctx.arc(64, 64, 60, 0, Math.PI * 2); cctx.fill();
    cctx.strokeStyle = "#2a2a26"; cctx.lineWidth = 5;
    cctx.beginPath(); cctx.arc(64, 64, 58, 0, Math.PI * 2); cctx.stroke();
    cctx.fillStyle = "#2a2a26";
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      cctx.beginPath();
      cctx.arc(64 + Math.sin(a) * 50, 64 - Math.cos(a) * 50, 3, 0, Math.PI * 2);
      cctx.fill();
    }
    cctx.lineWidth = 4; cctx.lineCap = "round";
    cctx.beginPath(); cctx.moveTo(64, 64); cctx.lineTo(64 + 28, 64 - 14); cctx.stroke(); // hour hand ~2 o'clock
    cctx.lineWidth = 3;
    cctx.beginPath(); cctx.moveTo(64, 64); cctx.lineTo(64 - 6, 64 - 42); cctx.stroke(); // minute hand ~11
    const clockTex = new THREE.CanvasTexture(clockCanvas);
    const clockBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.035, 20),
      new THREE.MeshStandardMaterial({ color: 0xd8b45a, roughness: 0.35, metalness: 0.4 })
    );
    clockBody.position.set(nx + 0.18, 0.55, nz - 0.12);
    scene.add(clockBody);
    const clockFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.115, 20),
      new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.5 })
    );
    clockFace.rotation.x = -Math.PI / 2;
    clockFace.position.set(nx + 0.18, 0.569, nz - 0.12);
    scene.add(clockFace);

    // floor lamp for warmth beside one chair
    const lampPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.03, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x3a3a38, roughness: 0.6 })
    );
    lampPole.position.set(nx - 2.6, 0.75, nz + 0.9);
    scene.add(lampPole);
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.32, 0.4, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xf0dfb8, emissive: 0xf0dfb8, emissiveIntensity: 0.5, side: THREE.DoubleSide })
    );
    lampShade.position.set(nx - 2.6, 1.55, nz + 0.9);
    scene.add(lampShade);
    const lampGlow = new THREE.PointLight(0xffe6b0, 0.7, 6);
    lampGlow.position.set(nx - 2.6, 1.4, nz + 0.9);
    scene.add(lampGlow);

    // folding privacy screen — angled across the nook's open corner so two
    // people here are softened from the main sightline without being sealed in
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x7c93a0, roughness: 0.85 });
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x4a3826, roughness: 0.7 });
    const screenGroup = new THREE.Group();
    screenGroup.position.set(nx + 3.0, 0, nz + 1.7);
    screenGroup.rotation.y = -Math.PI / 5;
    scene.add(screenGroup);
    const panelW = 1.1, panelH = 1.85;
    for (let p = 0; p < 3; p++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(panelW, panelH, 0.05), screenMat);
      panel.position.set((p - 1) * (panelW + 0.03), panelH / 2, 0);
      panel.rotation.y = (p - 1) * 0.32;
      screenGroup.add(panel);
      const trim = new THREE.Mesh(new THREE.BoxGeometry(panelW + 0.05, 0.06, 0.07), screenFrameMat);
      trim.position.set((p - 1) * (panelW + 0.03), panelH + 0.02, 0);
      trim.rotation.y = (p - 1) * 0.32;
      screenGroup.add(trim);
    }
  }

  // ---------------------------------------------------------------------
  // Badge / label DOM layer
  // ---------------------------------------------------------------------
  const noteCounts = {}; // id -> count (readings + modules)
  const doneReadings = new Set();
  const badgeEls = new Map(); // key -> element

  function labelEl(key, className) {
    let el = badgeEls.get(key);
    if (!el) {
      el = document.createElement("div");
      el.className = className;
      badgeLayer.appendChild(el);
      badgeEls.set(key, el);
    }
    return el;
  }

  const raycaster = new THREE.Raycaster();
  const vec = new THREE.Vector3();

  function projectToScreen(worldPos) {
    vec.copy(worldPos).project(camera);
    const x = (vec.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (-vec.y * 0.5 + 0.5) * canvas.clientHeight;
    const behind = vec.z > 1;
    return { x, y, behind };
  }

  const _aw = new THREE.Vector3();
  function updateLabels() {
    // When focused on a shelf/desk, only show labels near what you're looking at,
    // so the rest of the room's labels don't clutter the close-up view.
    const focusPoint = currentView ? currentTarget : null;
    labelAnchors.forEach((a) => {
      const wp = new THREE.Vector3();
      a.obj.getWorldPosition(wp);
      _aw.copy(wp);
      wp.y += a.type === "shelf" ? 2.1 : a.type === "sign" ? 0.9 : 0.55;
      const { x, y, behind } = projectToScreen(wp);
      const key = `label-${a.type}-${a.id}`;
      const cls = a.type === "shelf" ? "scene-label scene-label-shelf"
        : a.type === "cabinet" ? "scene-label scene-label-tool" : "scene-label";
      const el = labelEl(key, cls);
      let hide = behind;
      if (!hide && focusPoint) {
        const dx = _aw.x - focusPoint.x, dz = _aw.z - focusPoint.z;
        if (a.type === "sign" || Math.hypot(dx, dz) > 9) hide = true;
      }
      if (hide) {
        el.style.display = "none";
      } else {
        // Keep labels inside the viewport so edge shelves never get clipped.
        const mx = 78, myTop = 64, myBot = 26;
        const cx = Math.max(mx, Math.min(canvas.clientWidth - mx, x));
        const cy = Math.max(myTop, Math.min(canvas.clientHeight - myBot, y));
        el.style.display = "block";
        el.style.left = `${cx}px`;
        el.style.top = `${cy}px`;
        el.textContent = a.text;
      }
    });

    Object.entries(booksById).forEach(([id, b]) => {
      const count = noteCounts[`reading:${id}`] || 0;
      const key = `badge-reading-${id}`;
      if (!count) {
        const existing = badgeEls.get(key);
        if (existing) existing.style.display = "none";
        return;
      }
      const wp = new THREE.Vector3();
      b.mesh.getWorldPosition(wp);
      wp.y += 0.55;
      const { x, y, behind } = projectToScreen(wp);
      const el = labelEl(key, "scene-badge");
      if (behind) { el.style.display = "none"; return; }
      el.style.display = "block";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.textContent = `💬${count}`;
    });

    Object.entries(shelvesById).forEach(([id, s]) => {
      const count = noteCounts[`module:${id}`] || 0;
      const key = `badge-module-${id}`;
      if (!count) {
        const existing = badgeEls.get(key);
        if (existing) existing.style.display = "none";
        return;
      }
      const wp = new THREE.Vector3();
      s.plaqueMesh.getWorldPosition(wp);
      wp.y += 0.6;
      const { x, y, behind } = projectToScreen(wp);
      const el = labelEl(key, "scene-badge");
      if (behind) { el.style.display = "none"; return; }
      el.style.display = "block";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.textContent = `📌${count}`;
    });
  }

  // ---------------------------------------------------------------------
  // Camera tween / navigation
  // ---------------------------------------------------------------------
  let camTween = null;
  let currentView = null; // { type: 'shelf'|'tool', id }

  function flyTo(pos, target, duration = 900) {
    camTween = {
      fromPos: camera.position.clone(),
      toPos: pos.clone(),
      fromTarget: currentTarget.clone(),
      toTarget: target.clone(),
      start: performance.now(),
      duration,
    };
  }

  function goToOverview() {
    currentView = null;
    flyTo(overviewPos, overviewTarget);
    onEnterOverview?.();
  }

  function goToShelf(moduleId) {
    const s = shelvesById[moduleId];
    if (!s) return;
    if (!(currentView?.type === "shelf" && currentView.id === moduleId)) {
      currentView = { type: "shelf", id: moduleId };
      flyTo(s.closeup.pos, s.closeup.target);
    }
    onEnterShelf?.(moduleId);
  }

  function goToCabinet() {
    if (!cabinet) return;
    if (currentView?.type !== "cabinet") {
      currentView = { type: "cabinet" };
      flyTo(cabinet.closeup.pos, cabinet.closeup.target);
    }
    onSelectCabinet?.();
  }

  canvas.addEventListener("click", (ev) => {
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(interactive, false);
    if (!hits.length) return;
    const { type, id } = hits[0].object.userData;
    if (type === "reading") onSelectReading?.(id);
    else if (type === "shelfReminder") { goToShelf(id); onSelectModule?.(id); }
    else if (type === "shelf") goToShelf(id);
    else if (type === "cabinet") goToCabinet();
  });

  let hoverRaf = null;
  canvas.addEventListener("mousemove", (ev) => {
    if (hoverRaf) return;
    hoverRaf = requestAnimationFrame(() => {
      hoverRaf = null;
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        -((ev.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactive, false);
      const tip = labelEl("hover-tip", "scene-label");
      if (hits.length && hits[0].object.userData.type === "reading") {
        const reading = Object.values(MODULES.flatMap((m) => m.readings)).find((r) => r.id === hits[0].object.userData.id);
        tip.style.display = "block";
        tip.style.left = `${ev.clientX - rect.left}px`;
        tip.style.top = `${ev.clientY - rect.top - 18}px`;
        tip.textContent = reading ? reading.title : "";
        tip.style.transform = "translate(-50%, -100%)";
      } else {
        tip.style.display = "none";
      }
    });
  });

  // Scroll / pinch to zoom (dolly camera toward or away from what it's looking at)
  function zoomBy(delta) {
    camTween = null; // stop any fly-to so zoom feels responsive
    const dir = new THREE.Vector3().subVectors(currentTarget, camera.position);
    const dist = dir.length();
    dir.normalize();
    let newDist = dist + delta;
    newDist = Math.max(3.5, Math.min(58, newDist));
    camera.position.copy(currentTarget).addScaledVector(dir, -newDist);
    camera.lookAt(currentTarget);
  }
  canvas.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    zoomBy(ev.deltaY * 0.02);
  }, { passive: false });

  // Pinch-to-zoom on touch
  let pinchDist = null;
  canvas.addEventListener("touchmove", (ev) => {
    if (ev.touches.length !== 2) return;
    ev.preventDefault();
    const dx = ev.touches[0].clientX - ev.touches[1].clientX;
    const dy = ev.touches[0].clientY - ev.touches[1].clientY;
    const d = Math.hypot(dx, dy);
    if (pinchDist !== null) zoomBy((pinchDist - d) * 0.05);
    pinchDist = d;
  }, { passive: false });
  canvas.addEventListener("touchend", () => { pinchDist = null; });

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener("resize", resize);
  resize();

  function animate(now) {
    if (camTween) {
      const t = Math.min(1, (now - camTween.start) / camTween.duration);
      const e = easeInOutCubic(t);
      camera.position.lerpVectors(camTween.fromPos, camTween.toPos, e);
      currentTarget.lerpVectors(camTween.fromTarget, camTween.toTarget, e);
      camera.lookAt(currentTarget);
      if (t >= 1) camTween = null;
    }
    updateLabels();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // ---------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------
  return {
    goToOverview,
    goToShelf,
    goToCabinet,
    setNoteCount(itemType, id, count) {
      noteCounts[`${itemType}:${id}`] = count;
    },
    setReadingDone(id, done) {
      const b = booksById[id];
      if (!b) return;
      [b.plainMat, b.spineMat].forEach((m) => {
        m.emissive.setHex(done ? DONE_GOLD : 0x000000);
        m.emissiveIntensity = done ? 0.45 : 0;
      });
    },
  };
}

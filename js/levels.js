// The rooms. Each builds geometry + colliders + gameplay into a World. Units: 1 = ~13 cm.
import { kit, PR, propSeed } from './lvlkit.js';
import { rbox } from './world.js';
import { rcyl, lathe, sph, cyl, torus, capsule, cone, tube, leaf, wedge, star, heart, gear, blobGeo } from './shapes.js';
import { LEVELS } from './data.js';
import { S } from './save.js';
const PI = Math.PI;
const INDOOR = { sunDir: [0.35, 0.8, 0.45], sunColor: 0xfff1d6, sunI: 2.3, hemiSky: 0xfff4e6, hemiGround: 0xc9a27a, hemiI: 0.75, skyTop: 0x5fb4ff, skyMid: 0xbfe6ff, skyBot: 0xfff1d6, fog: 0xf6ead8, fogD: 0.0035, envI: 0.85, exposure: 1.0, bloomT: 0.92, bloomS: 0.42, envLight: 0xfff3e0 };
export function buildLevel(id, w, seed) { kit(w); propSeed(7 + id.length * 13); const f = BUILD[id] || BUILD.kitchen; f(w); w.env = Object.assign({}, INDOOR, w.env || {}); w.music = w.music || id; return w; }
const BUILD = {};
// =====================================================================================  RATITA HQ
BUILD.hq = (w) => {
  w.room(40, 30, 13, { wall: 0xffe2c2, wallN: 0xffd3a8, ceil: 0xf5e1c8, floor: (a, b, c, d) => PR.floorPlanks(w, a, b, c, d, 0, [0xb7773f, 0xa86a35, 0xc4834a, 0x9e6230]) });
  w.start = [0, 0, 8]; w.startYaw = PI; w.camDist = 6.2; w.music = 'hq';
  // big rug + logo
  PR.rug(w, 0, 2, 0, 20, 12, 0xff4fa0, 0xfff0f8); w.add('g', wedge(), 0xffd23f, 0, 0.25, 2, -PI / 2, 0, 0, 2.2, 2.2, 0.6);
  // level doors along the back wall (mouse holes in a row) + the 7th on the left
  const doors = LEVELS.map((L, i) => ({ L, i, x: -15 + i * 5, z: -15 }));
  doors.forEach(({ L, i, x, z }) => { const unlocked = i === 0 || S.done[LEVELS[i - 1].id] || S.cheat; const col = parseInt(L.col.slice(1), 16);
    PR.mouseHole(w, 'x', z, x, 1, unlocked ? 1 : 0); w.add('g', rbox(3.6, 0.5, 0.6, 0.2), col, x, 3.4, z + 0.5); w.add('l', sph(14), unlocked ? col : 0x555555, x, 4.2, z + 0.6, 0, 0, 0, 0.5, 0.5, 0.2, unlocked ? 0.6 : 0);
    if (S.done[L.id]) w.add('x', wedge(), 0xffc400, x, 4.6, z + 0.9, 0, 0, 0, 0.55);
    if (!unlocked) { w.add('x', torus(0.25, 20, PI), 0x9ca3af, x, 1.6, z + 1.0, 0, 0, 0, 0.35); w.add('g', rbox(0.9, 0.8, 0.3, 0.12), 0xfacc15, x, 1.2, z + 1.0); }
    w.zone('door', x - 1.4, -1, z, x + 1.4, 3, z + 2.6, { level: L.id, label: unlocked ? `${L.icon} ${L.room}: ${L.n}` : `🔒 Beat ${LEVELS[i - 1].room} first`, locked: !unlocked });
    // little 3D "sign" props on top of each door hinting the room
    const T = w.tf(x, 5.0, z + 0.8, 0, 0.5); [() => PR.toaster(w, x, 5.0, z + 0.9, 0, col), () => { w.add('f', rbox(2.8, 1.0, 1.4, 0.45), col, x, 5.5, z + 0.9); w.add('f', rbox(2.8, 1.2, 0.5, 0.25), col, x, 6.2, z + 0.4); }, () => w.add('x', rbox(3, 1.4, 1, 0.3), 0xcbd5e1, x, 5.7, z + 0.8), () => PR.flower(w, x, 5.0, z + 0.9, 1.2, col, false), () => PR.wrench(w, x, 5.0, z + 0.9, PI / 2, 0.5), () => PR.toyBlock(w, x, 5.0, z + 0.9, 1.2, 0.3, col), () => PR.lantern(w, x, 5.0, z + 0.9)][i]();
  });
  w.solid(-20, 5, -15.3, 20, 9, -13.6); // shelf strip the signs sit on
  w.add('m', rbox(40, 0.4, 1.8, 0.1), 0x8b5a2b, 0, 4.8, -14.4);
  // kiosks: workbench (upgrades), wardrobe mirror (outfits), map table, nursery
  PR.workbench(w, -14, -3, PI / 2, 9, 4.2, 4); w.add('l', rbox(2.4, 1.6, 0.2, 0.1), 0x3ff0ff, -15.4, 6, -3, 0, PI / 2, 0, 1, 1, 1, 0.5); PR.wrench(w, -14, 4.2, -5, 0.4, 0.4); PR.hammer(w, -13.6, 4.2, -1.5, -0.3); w.add('g', gear(8), 0x3ff0ff, -14, 4.6, -3, PI / 2, 0, 0, 0.8, 0.8, 0.5, 0.3);
  (w.kiosks = w.kiosks || []).push({ id: 'upgrades', x: -11.5, y: 0, z: -3, r: 3, label: '🔧 Ratita Industries Upgrades' });
  // wardrobe
  w.slab('g', 0xf9a8d4, 15, 0, -3, 3.4, 8, 6, 0.4); w.add('e', rbox(0.2, 5.4, 4, 0.1), 0xdff6ff, 13.25, 1.2, -3); w.add('g', torus(0.12, 32), 0xffd23f, 13.25, 3.9, -3, 0, PI / 2, 0, 2.2, 2.9, 1); w.kiosks.push({ id: 'outfits', x: 11.5, y: 0, z: -3, r: 3, label: '🎩 Wardrobe (hats)' });
  // map table
  PR.coffeeTable(w, 0, -6, 0, 10, 6, 1.6); for (let i = 0; i < 7; i++) w.add('g', sph(12), parseInt(LEVELS[i].col.slice(1), 16), -4 + i * 1.33, 1.75, -6 + Math.sin(i) * 1.5, 0, 0, 0, 0.35, 0.2, 0.35); w.kiosks.push({ id: 'map', x: 0, y: 0, z: -6, r: 4, label: '🗺️ House Map' });
  // nursery: matchbox beds with rescued babies count shown as tiny rats
  const nb = Object.values(S.babies).reduce((a, l) => a + l.length, 0);
  w.slab('m', 0xef4444, -14, 0, 9, 7, 1, 4, 0.15); w.add('f', rbox(6.4, 0.5, 3.4, 0.2), 0xfef3c7, -14, 1.2, 9); w.kiosks.push({ id: 'nursery', x: -14, y: 0, z: 9, r: 3.5, label: `🐭 Nursery (${nb}/21 babies)` });
  w.nursery = { x: -14, y: 1.45, z: 9, n: nb };
  // cozy props
  PR.bookshelf(w, 17.5, 8, -PI / 2, 9, 9, 3, 0x9a6a3e, 3); PR.plant(w, 17, 0, -11, 1.4); PR.plant(w, -17, 0, -11, 1.3, 0x3b82f6); PR.lamp(w, -17, 13, 0, 8);
  for (let i = 0; i < 5; i++) PR.cardboard(w, 10 + (i % 3) * 2.2, (i > 2 ? 1.6 : 0), 11, 0.2 * i, 2, 1.6, 2, false);
  PR.ball(w, 6, 0, 10, 1.0, 0x3ff0ff, 0xffd23f); PR.toyBlock(w, -7, 0, 11, 1.4, 0.4); PR.toyBlock(w, -5.8, 0, 11.4, 1.2, 0.9); PR.mug(w, -12.5, 4.2, -1, 0, 0xff4fa0);
  w.frameArt('z', -20, 0, 6, 4, 3, 1, 0); w.frameArt('z', 20, -9, 6, 3, 3.6, -1, 1); PR.clock(w, 'x', 15, 0, 9, -1);
  // pipes + lights along ceiling for "secret base" feel
  for (let i = 0; i < 3; i++) w.add('x', cyl(14), [0x3ff0ff, 0xff4fa0, 0xffd23f][i], 0, 11.5 - i * 0.7, -14 + i * 0.7, 0, 0, PI / 2, 0.25, 38, 0.25, 0.15);
  [-12, 0, 12].forEach((x) => { w.add('l', sph(16), 0xffe6b0, x, 11.6, 4, 0, 0, 0, 0.7, 0.4, 0.7, 1); });
  w.martinaSpec = { x: 8, z: 3, yaw: -0.6, say: 'hi' };
  w.cp(0, 0, 9); w.hint(-20, 2, 20, 15, '🏠 Ratita HQ! Walk into a mouse-hole door to explore a room. Visit the workbench to buy upgrades.');
  w.env = { exposure: 1.0, fog: 0xf5dcc0, fogD: 0.004, hemiI: 0.9 };
};
// =====================================================================================  1. KITCHEN
BUILD.kitchen = (w) => {
  const H = 6.8; // counter height
  w.room(60, 50, 22, { wall: 0xfff6e0, wallN: 0xd8f0ff, floor: (a, b, c, d) => PR.floorTiles(w, a, b, c, d, 0, 0xfff7ec, 0xf28c8c, 3), holesN: [[-1, 7, 17, 10]] });
  w.start = [-25.5, 0, 8]; w.startYaw = PI / 2; PR.mouseHole(w, 'z', -30, 8, 1, 1);
  w.cp(-26, 0, 8, PI / 2);
  w.hint(-30, 2, -20, 14, '🐀 Welcome to the giant kitchen! Climb the stool, the chair, then the table.');
  // ---- floor route: stool -> chair -> table
  PR.stool(w, -24, 6, 0, 2.2, 0x60a5fa); w.crumbLine(-27, 0, 8, -24.5, 0, 6.5, 4); w.crumbArc(-24, 2.2, 6, -19, 3.7, 6, 1.5, 4);
  PR.chair(w, -19, 6, PI, 3.4, 0xd99a5e, 0xff7a90); PR.chair(w, -26.5, -4, PI / 2, 3.4, 0xd99a5e, 0x7dd3fc); PR.chair(w, -1.5, -4, -PI / 2, 3.4, 0xd99a5e, 0xa7f3d0);
  PR.table(w, -14, -4, 0, 16, 10, 5.7, 0xc58b52, 0xa86f3c);
  // table top clutter
  const TY = 5.7; PR.plate(w, -18, TY, -2, 3); PR.plate(w, -10, TY, -6, 1, 0xfde68a); PR.bowl(w, -14, TY, -4, 0x60a5fa, 1); PR.mug(w, -20, TY, -6.5, 0.5, 0xff5d73); PR.mug(w, -8, TY, -1.5, 2.2, 0x4f9dff);
  PR.cereal(w, -7.5, TY, -7.5, -0.3, 0xffc93c); PR.fruit(w, -11, TY, -1, 'apple'); PR.fruit(w, -12, TY, -0.8, 'orange'); PR.fruit(w, -16.5, TY, -7.5, 'banana'); PR.magazine(w, -20, TY, -1.5, 0.3, 1);
  w.crumbLine(-19, TY, 0, -9, TY, 0, 7); w.cheese(-12, TY, -7.5); w.crate(-21, TY, -3.5); w.enemy('windup', -14, TY, -1, { axis: 'x', range: 4 });
  w.cp(-17, TY, -1.5, PI);
  // ---- spoon bridge from table to counter
  PR.spoonBridge(w, -20, TY, -8.8, -20, H, -17.6, 0xc8925c); w.crumbLine(-20, TY + 0.2, -9.5, -20, H, -16.5, 5);
  w.hint(-23, -12, -17, -8.5, '🥄 Walk across the wooden spoon to the counter!', 4);
  // ---- counters along the back wall
  const CZ = -21.5, CD = 7;
  PR.cabinets(w, -29.5, -17, CZ, 0, H, CD, 0xf7f2e8, 0x5b6b8c); PR.cabinets(w, -9.5, -3, CZ, 0, H, CD, 0xf7f2e8, 0x5b6b8c); PR.cabinets(w, 7, 13, CZ, 0, H, CD, 0xf7f2e8, 0x5b6b8c);
  // sink section (custom so the basin is a real hole)
  w.slab('m', 0xf7f2e8, 2, 0, CZ, 10, H - 2.2, CD, 0.12); w.add('g', rbox(9.6, 3.4, 0.2, 0.12), 0xeef3f8, 2, 1.9, CZ + 3.55);
  [[-2.1, CZ, 1.8, CD + 0.5], [6.1, CZ, 1.8, CD + 0.5], [2, -24.35, 6.4, 1.3], [2, -18.4, 6.4, 2.2]].forEach(([x, z, sx, sz]) => w.slab('g', 0x5b6b8c, x, H - 2.2, z, sx, 2.2, sz, 0.12));
  PR.sink(w, 2, CZ, 0, H); w.water(-1.1, H - 2.4, -23.6, 5.1, H - 0.9, -19.4);
  const sp = PR.sponge(w, 4.6, H, -18.4, 0.1); sp.bounce = 13;
  PR.soap(w, -0.4, H, -24.4, 0xc084fc); PR.towelRoll(w, -2.2, H, -23.5); w.part(-0.4, H + 2.2, -24.4);
  w.hint(-3, -20, 7, -17, '🧽 Bounce on the sponge up to the window sill!', 5);
  // window sill goodies
  PR.window(w, 'x', -25.6, 3, 8, 10, 17, 1, 0xff8fb1); PR.plant(w, 0.2, 10.2, -24.2, 0.8, 0xe76f51); PR.plant(w, 5.6, 10.2, -24.2, 0.7, 0x60a5fa); w.baby(3, 10.2, -24); w.crumbLine(0.8, 10.2, -24, 5.2, 10.2, -24, 3);
  // stove (2 hot burners)
  const burners = PR.stove(w, -13.25, CZ, 0, H, [0, 3]);
  burners.forEach((b) => { if (b.on) { w.hot(b.p[0] - 1.25, H, b.p[2] - 1.25, b.p[0] + 1.25, H + 0.14, b.p[2] + 1.25); w.anims.push(() => { if (Math.random() < 0.35 && w.game) w.game.fx.emit(b.p[0] + (Math.random() - 0.5) * 1.6, H + 0.3, b.p[2] + (Math.random() - 0.5) * 1.6, 0, 2.2, 0, 0.08, Math.random() < 0.5 ? 0xff7a3d : 0xffd23f, 0.6, -1, 0.5); }); } });
  PR.pot(w, -15.05, H, -20.1 + 0, 0xef4444);
  w.hint(-17, -25, -9.5, -17, '🔥 Hot burners! Hop across on the cool dark ones.', 5);
  // left counter clutter
  PR.breadLoaf(w, -25.5, H, -22.5, 0.1); PR.jar(w, -28, H, -24, 0xf59e0b, 0xef4444); PR.jar(w, -26.4, H, -24.2, 0x84cc16, 0x3b82f6, 1.3); PR.cuttingBoard(w, -22, H, -20.5, 0.2); PR.can(w, -18.2, H, -24, 0x4f9dff);
  w.cheese(-22, H + 0.3, -20.5); w.crumbLine(-20, H, -18.5, -17.6, H, -18.5, 3); w.part(-28.3, H, -19.2); w.enemy('bot', -24, H, -19.6, { axis: 'x', range: 3 }); w.cp(-20, H, -20, PI / 2);
  PR.spiceRack(w, -25, 9.4, -24.4, 0);
  // middle counter
  PR.kettle(w, -7.8, H, -23.4, 0x14b8a6); PR.mug(w, -5.2, H, -23.8, 0, 0xffc93c); PR.mug(w, -4.2, H, -22.3, 1.2, 0x3ddc84); PR.toaster(w, -6, H, -19.5, 0.2, 0xff8a3d);
  w.part(-7.8, H + 1.65, -23.4); w.crate(-4.2, H, -19); w.crumbLine(-9, H, -18.3, -3.5, H, -18.3, 5); w.enemy('windup', -6.5, H, -21.5, { axis: 'z', range: 2 });
  // right counter: microwave + cereal stairs up to the fridge
  PR.microwave(w, 10, H, -22.6, 0); PR.jar(w, 8, H, -19, 0xfde047, 0xff4fa0); PR.cereal(w, 10, H + 3, -23.4, 0, 0xff5d73, 3.2); PR.cereal(w, 12.2, H + 3, -21.8, 0.4, 0x3ddc84, 2.2);
  w.cheese(11.2, H + 3, -20.8); w.heartP(12, H, -18.5); w.crumbLine(7.5, H, -18.3, 12.5, H, -18.3, 4);
  PR.fridge(w, 16.5, -21.6, 0, 13, 0xe8f1ff); w.baby(16.5, 13, -21.5); w.part(18.5, 13, -23); w.crumbRing(16.5, 13, -21.5, 1.8, 6);
  w.hint(7, -25, 13, -17, '🧊 Climb the microwave and cereal boxes to reach the fridge top!', 5);
  // upper cabinets (decor) + shelves
  PR.upperCabinets(w, -29.5, -2, -23.4, 0, 12.5, 7, 3.6); PR.upperCabinets(w, 7.5, 13, -23.4, 0, 12.5, 7, 3.6); PR.upperCabinets(w, 13.5, 19.5, -22.6, 0, 14.2, 5.5, 5);
  // ---- trolley to the island (moving platform)
  w.mover(10, H - 0.5, -14.6, [5, 0.5, 5], [0, 0, 8.0], 7, 0, 0xffd23f, (T, sub, sz) => { T.box('g', 0xffd23f, 0, 0, 0, sz[0], sz[1], sz[2], 0.2); T.box('g', 0xffd23f, 0, -3.2, 0, sz[0], 0.35, sz[2], 0.15);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { T.add('x', cyl(12), 0xd1d5db, a * 2.2, -H + 0.9, b * 2.2, 0, 0, 0, 0.14, H - 0.9, 0.14); T.add('m', sph(12), 0x1f2937, a * 2.2, -H + 0.45, b * 2.2, 0, 0, 0, 0.45); }); T.add('g', rcyl(0.6, 0.9, 0.15, 16), 0x4f9dff, -1.4, 0.5, -1.2); });
  w.hint(7, -18.5, 13, -14, '🛒 Hop on the rolling trolley to reach the kitchen island!', 5);
  // ---- island (boss arena) + floor stairs
  PR.cabinets(w, 6, 26, 3, 0, H, 14, 0xa7d8f0, 0xf5f5f4, { door: 0xc6e7f7 });
  PR.cardboard(w, 28.4, 0, 14.5, 0, 3, 2.4, 3); PR.cardboard(w, 28.4, 0, 9.5, 0, 3, 4.6, 3.4, true); w.crumbLine(28.4, 2.4, 14.5, 28.4, 4.6, 9.8, 3); w.heartP(28.4, 4.6, 9);
  w.cp(10, H, -2, PI / 2);
  w.bossSpec = { type: 'toast', x: 18, y: H, z: 4, yaw: -PI / 2, arena: [6.5, -3.5, 25.5, 9.5] }; w.goldPos = [16, H + 1.6, 3];
  PR.bowl(w, 8, H, 8.5, 0xfde68a, 1); PR.plant(w, 24.5, H, -2.4, 0.8);
  // ---- floor: Candy's corner, bowls, rug, trash, baby #2
  PR.rug(w, 2, -13, 0, 14, 5, 0x60a5fa, 0xdbeafe);
  w.add('f', torus(0.45, 36), 0xff6fb5, 20, 1.2, 19, PI / 2, 0, 0, 3.6, 3.6, 3.6); w.add('f', rcyl(3.4, 0.8, 0.3, 32), 0xffd1e8, 20, 0, 19); w.solid(16, 0, 15, 24, 0.6, 23, { cam: false });
  PR.dogBowl(w, 10, 20, 0xef4444); PR.dogBowl(w, 13.6, 20, 0x3b82f6, 0x7dd3fc); w.baby(4, 0, 18); w.crumbLine(-4, 0, 14, 3, 0, 18, 5); w.part(-14, 0, -4);
  w.candySpec = { x: 20, z: 19, yaw: -PI / 2, sleep: true, path: [[10, 12], [-10, 12], [-18, 14], [0, 18], [22, 12]], bounds: [-28, -15.5, 28, 23] };
  w.hint(-6, 10, 10, 24, '🐶 Shh! Candy the schnauzer is napping. Grab the baby and get off the floor!', -2, 2);
  w.add('g', rcyl(2.2, 6, 0.3, 28), 0x94a3b8, -27, 0, 21); w.solid(-29.2, 0, 18.8, -24.8, 6, 23.2); w.add('g', rcyl(2.35, 0.6, 0.2, 28), 0x64748b, -27, 6, 21);
  PR.bigPlant(w, 26.5, 22, 1); PR.clock(w, 'z', -30, -6, 15, 1); w.frameArt('z', 30, 14, 12, 5, 4, -1, 0); w.frameArt('z', 30, 4, 13, 3.5, 4.5, -1, 1);
  w.env = { sunDir: [0.25, 0.75, -0.6] };
};
export { BUILD };

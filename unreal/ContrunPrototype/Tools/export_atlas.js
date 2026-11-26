#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { performance } = require("node:perf_hooks");

const depot = path.resolve(__dirname, "../../..");
const destination = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "../Generated");
const sourceVille = path.join(depot, "jeu/ville.js");
const atlas = require(path.join(depot, "jeu/atlas.js"));
const mToCm = 100;
const pas = 1;

function chargerVille() {
  const neutre = () => {};
  // Ville calcule sa grille avant toute construction graphique. Ces stubs
  // permettent de réutiliser ses règles de marche sans lancer Three.js.
  const contexte = {
    Atlas: atlas, Monde: {}, performance, window: { Vie: {} },
    THREE: { MeshLambertMaterial: class {} }, BLANC: 0xffffff,
    S: { started: false }, INTER: [], console: { info: neutre },
    blocked: neutre, charTick: neutre, freeView: neutre, startPlay: neutre,
    zoneOf: neutre, targetNow: neutre, targetName: neutre, objText: neutre
  };
  vm.runInNewContext(fs.readFileSync(sourceVille, "utf8"), contexte, { filename: sourceVille, timeout: 15000 });
  return contexte.window.Ville;
}

const ville = chargerVille();
const pointPorte = id => ville.dehorsAtlas(id);
const maison = pointPorte("maison");
const drapiers = pointPorte("tail");
const presse = pointPorte("presse");
assert.ok(maison && drapiers && presse, "Les trois seuils du parcours doivent exister dans l’atlas.");
const origine = { atlasX: maison.X, atlasY: maison.Y, elevationM: ville.sol(maison.X, maison.Y) };

const cm = m => Number((m * mToCm).toFixed(2));
const position = (X, Y, Z = ville.sol(X, Y)) => ({
  x: cm(X - origine.atlasX), y: cm(Y - origine.atlasY), z: cm(Z - origine.elevationM)
});
const points = p => [p.X, p.Y];

function libre(a, b) {
  const longueur = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.ceil(longueur / 0.125);
  let z = ville.sol(...a);
  for (let i = 1; i <= n; i++) {
    const X = a[0] + (b[0] - a[0]) * i / n, Y = a[1] + (b[1] - a[1]) * i / n;
    const h = ville.sol(X, Y);
    if (!ville.praticable(X, Y) || Math.abs(h - z) > ville.PAS_MAX * longueur / n + 0.02) return false;
    z = h;
  }
  return true;
}

function joindre(a, b) {
  if (libre(a, b)) return [b];
  // Une diagonale de la grille web peut effleurer un bord entre deux
  // échantillons. Insérer alors un point praticable autour de son milieu.
  const X = Math.floor(a[0] + b[0]) / 2 + 0.25, Y = Math.floor(a[1] + b[1]) / 2 + 0.25;
  let meilleur;
  let distance = Infinity;
  for (let dy = -4; dy <= 4; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      const p = [X + dx * 0.5, Y + dy * 0.5];
      const L = Math.hypot(p[0] - a[0], p[1] - a[1]) + Math.hypot(p[0] - b[0], p[1] - b[1]);
      if (L < distance && libre(a, p) && libre(p, b)) {
        distance = L;
        meilleur = p;
      }
    }
  }
  assert.ok(meilleur, "Le tronçon contient un seuil ou un bord infranchissable.");
  return [meilleur, b];
}

function troncon(depart, arrivee) {
  assert.ok(ville.praticable(...points(depart)), "Départ du tronçon hors de la grille de marche.");
  assert.ok(ville.praticable(...points(arrivee)), "Arrivée du tronçon hors de la grille de marche.");
  const chemin = ville.chemin(depart, arrivee);
  assert.ok(chemin && chemin.length >= 2, "L’atlas doit relier les seuils à pied.");
  const pointsAtlas = [points(depart), ...chemin, points(arrivee)];
  return [pointsAtlas[0], ...pointsAtlas.slice(1).flatMap((p, i) => joindre(pointsAtlas[i], p))];
}

const versDrapiers = troncon(maison, drapiers);
const versPresse = troncon(drapiers, presse);
const parcours = [...versDrapiers, ...versPresse.slice(1)];
const distanceParcours = parcours.slice(1).reduce((m, p, i) => m + Math.hypot(p[0] - parcours[i][0], p[1] - parcours[i][1]), 0);

function distanceSegment([X, Y], [x0, y0], [x1, y1]) {
  const dx = x1 - x0, dy = y1 - y0;
  const t = Math.max(0, Math.min(1, ((X - x0) * dx + (Y - y0) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(X - x0 - t * dx, Y - y0 - t * dy);
}

const roles = {
  maison: "maison_pierre", presse: "imprimerie", maelle: "maison_pierre",
  tail: "maison1", coif: "maison2", fard: "maison_pierre",
  men: "maison1", tap: "maison2", rel: "maison_pierre", hor: "maison2",
  bro: "maison1", caisse: "maison_pierre", fontaine: "fontaine",
  poste: "corps_de_garde", chap: "chapelle"
};
const hauteurs = { roof: 8, church: 13, hall: 6.5, water: 1.2 };
const corps = new Set(Object.keys(hauteurs));
const reperes = new Set(["maison", "tail", "fard", "coif", "presse", "fontaine", "halles"]);
function emprise(site) {
  const x = site.polygone.map(p => p[0]), y = site.polygone.map(p => p[1]);
  return { x0: Math.min(...x), y0: Math.min(...y), x1: Math.max(...x), y1: Math.max(...y) };
}

function facade(site) {
  const b = emprise(site);
  const X = (b.x0 + b.x1) / 2, Y = (b.y0 + b.y1) / 2;
  const porte = ville.PORTES[site.id];
  const fond = Math.min(
    ville.sol(X, Y), ville.sol(b.x0, b.y0), ville.sol(b.x0, b.y1),
    ville.sol(b.x1, b.y0), ville.sol(b.x1, b.y1), site.cote
  ) - 0.15;
  const modele = roles[site.id];
  const asset = modele ? "modeles/ville/" + modele + ".glb" : null;
  if (asset) assert.ok(fs.existsSync(path.join(depot, asset)), "GLB absent : " + asset);
  return {
    id: site.id,
    label: site.nom,
    surface: site.surface,
    position: position(X, Y, fond),
    size: { x: cm(b.x1 - b.x0), y: cm(b.y1 - b.y0), z: cm(site.id === "fontaine" ? 4.65 : hauteurs[site.surface]) },
    yaw: porte ? Math.atan2(porte.ny, porte.nx) * 180 / Math.PI : 0,
    asset
  };
}

const sitesAtlas = Object.values(atlas.SITES).filter(site => {
  if (!corps.has(site.surface)) return false;
  if (reperes.has(site.id)) return true;
  const centre = points(site.centre);
  return parcours.slice(1).some((p, i) => distanceSegment(centre, parcours[i], p) <= 15);
});
const sites = sitesAtlas.map(facade);
const enveloppe = [...parcours, ...sitesAtlas.flatMap(site => site.polygone)];
const x0 = Math.floor(Math.min(...enveloppe.map(p => p[0]))) - 9;
const y0 = Math.floor(Math.min(...enveloppe.map(p => p[1]))) - 9;
const x1 = Math.ceil(Math.max(...enveloppe.map(p => p[0]))) + 9;
const y1 = Math.ceil(Math.max(...enveloppe.map(p => p[1]))) + 9;

const nx = (x1 - x0) / pas + 1, ny = (y1 - y0) / pas + 1;
const voies = [...Object.values(atlas.CHEMINS), ...Object.values(atlas.RUELLES)].flatMap(voie =>
  voie.slice(1).map((p, i) => [voie[i], p])
).filter(([a, b]) => Math.max(a[0], b[0]) >= x0 - 4 && Math.min(a[0], b[0]) <= x1 + 4
                    && Math.max(a[1], b[1]) >= y0 - 4 && Math.min(a[1], b[1]) <= y1 + 4);

function solVisuel(X, Y) {
  if (atlas.secteur(X, Y)?.n === 9) return "limon";
  return voies.some(([a, b]) => distanceSegment([X, Y], a, b) <= 2.9) ? "paves" : "terre";
}

function exportTerrain() {
  const vertices = [], uv = [];
  const faces = { terre: [], paves: [], limon: [] };
  let minZ = Infinity, maxZ = -Infinity;
  const lignes = ["# Terrain de Sarlande. X est, Y sud, Z haut. Coordonnées en cm.",
    "mtllib terrain.mtl", "o SarlandeTerrain"];
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const X = x0 + i * pas, Y = y0 + j * pas;
      const { x, y, z } = position(X, Y);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
      vertices.push(`v ${x} ${y} ${z}`);
      uv.push(`vt ${(x / 400).toFixed(4)} ${(y / 400).toFixed(4)}`);
      if (i === nx - 1 || j === ny - 1) continue;
      const a = j * nx + i + 1, b = a + 1, c = a + nx, d = c + 1;
      const mat = solVisuel(X + pas / 2, Y + pas / 2);
      faces[mat].push(`f ${a}/${a} ${b}/${b} ${c}/${c}`, `f ${b}/${b} ${d}/${d} ${c}/${c}`);
    }
  }
  lignes.push(...vertices, ...uv, "s 1");
  for (const [nom, triangles] of Object.entries(faces)) {
    if (triangles.length) lignes.push("usemtl " + nom, ...triangles);
  }
  assert.equal(Object.values(faces).reduce((n, f) => n + f.length, 0), (nx - 1) * (ny - 1) * 2);
  return { obj: lignes.join("\n") + "\n", minZ, maxZ };
}

function portail(id) {
  const p = ville.PORTES[id];
  return {
    position: position(p.dehors.X, p.dehors.Y),
    threshold: position(p.X, p.Y),
    yaw: Math.atan2(p.ny, p.nx) * 180 / Math.PI
  };
}

const portes = { house: portail("maison"), press: portail("presse") };
const { obj, minZ, maxZ } = exportTerrain();
const route = {
  version: 1,
  origin: origine,
  terrain: {
    file: "terrain.obj",
    position: { x: 0, y: 0, z: 0 },
    cellCm: cm(pas),
    boundsCm: {
      min: { x: cm(x0 - origine.atlasX), y: cm(y0 - origine.atlasY), z: minZ },
      max: { x: cm(x1 - origine.atlasX), y: cm(y1 - origine.atlasY), z: maxZ }
    },
    columns: nx,
    rows: ny
  },
  spawn: { position: portes.house.position, yaw: portes.house.yaw },
  waypoints: parcours.map(([X, Y], index) => ({
    position: position(X, Y),
    ...(index === 0 ? { id: "maison", label: "Clos des murailles" }
      : index === versDrapiers.length - 1 ? { id: "drapiers", label: "Rue des Drapiers" }
      : index === parcours.length - 1 ? { id: "presse", label: "Imprimerie d’Anselme" } : {})
  })),
  sites,
  portals: portes,
  pathLengthCm: cm(distanceParcours)
};
assert.deepEqual(route.waypoints[0].position, route.spawn.position);
assert.deepEqual(route.waypoints.at(-1).position, route.portals.press.position);

const mtl = [
  "# Couleurs de base pour l’import du terrain de Sarlande",
  "newmtl terre", "Kd 0.39 0.35 0.24", "illum 1",
  "newmtl paves", "Kd 0.55 0.52 0.47", "illum 1",
  "newmtl limon", "Kd 0.38 0.31 0.25", "illum 1", ""
].join("\n");
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, "terrain.mtl"), mtl);
fs.writeFileSync(path.join(destination, "terrain.obj"), obj);
fs.writeFileSync(path.join(destination, "route.json"), JSON.stringify(route, null, 2) + "\n");
console.log(`Atlas exporté dans ${destination}. ${sites.length} sites, ${parcours.length} points, ${Math.round(distanceParcours)} m de marche.`);

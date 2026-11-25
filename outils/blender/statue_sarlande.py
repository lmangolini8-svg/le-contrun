"""Statue de Sarlande, modelée par script d'après references/planches-3d/statue_tour.png.

Usage : python statue_sarlande.py <sortie.glb> <dossier_apercus>

Repère Blender : Z vers le haut, la statue regarde -Y (= +Z dans le jeu).
SA main droite est donc du côté -X : vue de face, le globe apparaît à gauche de l'image.
Modelée à taille humaine (environ 1,9 m couronne comprise) puis mise à 29,6 m,
la hauteur du colosse qu'elle remplace. Couleurs de sommets en sRGB brut,
comme le reste du jeu (matériaux convertis en Lambert à l'arrivée).
"""
import sys, math, random
import bpy, bmesh
from mathutils import Vector, Matrix, noise

args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
DST, OUT = args[0], args[1]
HAUTEUR = 29.6
TAU = math.tau
random.seed(7)

def hexrgb(h):
    return ((h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255)

# Palette : patine bleu sombre et liserés dorés (planche validée).
PATINE = hexrgb(0x41607f)   # robe
MANTEAU = hexrgb(0x36526f)  # cape, un ton plus sombre
CHAIR = hexrgb(0x56728f)    # visage et mains, bronze patiné plus clair
CHEVEUX = hexrgb(0x2f4560)
OR = hexrgb(0xcaa04a)
OR_SOMBRE = hexrgb(0xa07a34)

bpy.ops.wm.read_factory_settings(use_empty=True)
parts = []

def mesh_obj(name, verts, faces, color, wash=0.10):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    me.validate(); me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    ob["teinte"] = color; ob["lavis"] = wash
    parts.append(ob)
    return ob

def tag(ob, color, wash=0.10):
    ob["teinte"] = color; ob["lavis"] = wash
    parts.append(ob)
    return ob

# ---------------------------------------------------------------- surfaces de révolution
def lathe(name, profile, color, seg=64, a0=0.0, a1=TAU, depth=0.82, fold=None, closed=True, wash=0.10, cx=0.0, cy=0.0, zoff=None):
    """profile : [(rayon, z)] de bas en haut ; fold(theta, t) -> facteur radial."""
    n = len(profile)
    ring = seg if closed else seg + 1
    verts, faces = [], []
    for i, (r, z) in enumerate(profile):
        t = i / (n - 1)
        for j in range(ring):
            a = a0 + (a1 - a0) * j / seg
            k = fold(a, t, z) if fold else 1.0
            dz = zoff(a, t) if zoff else 0.0
            verts.append(Vector((cx + r * k * math.sin(a), cy - r * k * depth * math.cos(a), z + dz)))
    for i in range(n - 1):
        for j in range(seg):
            j2 = (j + 1) % ring if closed else j + 1
            faces.append((i * ring + j, i * ring + j2, (i + 1) * ring + j2, (i + 1) * ring + j))
    return mesh_obj(name, verts, faces, color, wash)

# ---------------------------------------------------------------- tubes le long d'une ligne
def sweep(name, pts, radii, color, seg=12, cap=True, wash=0.08, flat=1.0):
    pts = [Vector(p) for p in pts]
    if not isinstance(radii, (list, tuple)):
        radii = [radii] * len(pts)
    verts, faces = [], []
    up = Vector((0, 0, 1))
    for i, p in enumerate(pts):
        d = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        ref = up if abs(d.dot(up)) < 0.95 else Vector((1, 0, 0))
        u = d.cross(ref).normalized(); v = d.cross(u).normalized()
        for j in range(seg):
            a = TAU * j / seg
            verts.append(p + radii[i] * (math.cos(a) * u + flat * math.sin(a) * v))
    for i in range(len(pts) - 1):
        for j in range(seg):
            j2 = (j + 1) % seg
            faces.append((i * seg + j, i * seg + j2, (i + 1) * seg + j2, (i + 1) * seg + j))
    if cap:
        faces.append(tuple(range(seg))[::-1])
        faces.append(tuple((len(pts) - 1) * seg + j for j in range(seg)))
    return mesh_obj(name, verts, faces, color, wash)

def bezier(p0, p1, p2, n=10):
    p0, p1, p2 = Vector(p0), Vector(p1), Vector(p2)
    return [(1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t * t * p2 for t in (i / (n - 1) for i in range(n))]

def sphere(name, c, r, color, scale=(1, 1, 1), seg=20, rings=12, wash=0.08):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, radius=r, location=c)
    ob = bpy.context.active_object; ob.name = name; ob.scale = scale
    return tag(ob, color, wash)

def torus(name, c, R, r, color, rot=(0, 0, 0), maj=48, mino=10, wash=0.05):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=maj, minor_segments=mino, location=c, rotation=rot)
    ob = bpy.context.active_object; ob.name = name
    return tag(ob, color, wash)

def cone(name, c, r, depth, color, verts=4, rot=(0, 0, 0), r2=0.0, wash=0.04):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r2, depth=depth, location=c, rotation=rot)
    ob = bpy.context.active_object; ob.name = name
    return tag(ob, color, wash)

# ================================================================ ROBE
def plis(nb, amp_bas, amp_haut, phase=0.0):
    def f(a, t, z):
        amp = amp_bas + (amp_haut - amp_bas) * t
        return 1.0 + amp * (math.cos(nb * a + phase + 0.6 * math.sin(3 * a)) + 0.35 * math.cos(2.3 * nb * a + 1.7))
    return f

robe = lathe("robe", [(0.41, 0.0), (0.40, 0.03), (0.36, 0.22), (0.31, 0.50), (0.25, 0.80), (0.185, 1.00),
                      (0.152, 1.08), (0.150, 1.13), (0.170, 1.22), (0.178, 1.28), (0.170, 1.36), (0.135, 1.44),
                      (0.075, 1.50), (0.052, 1.53)], PATINE, seg=96, fold=plis(14, 0.055, 0.004))
# Pointes des pieds sous l'ourlet.
for sx in (-1, 1):
    sphere("pied", (sx * 0.08, -0.33, 0.035), 0.05, CHAIR, scale=(0.8, 1.5, 0.6))

# Surjupe à ourlet festonné, liseré d'or.
def surjupe_fold(a, t, z):
    return 1.0 + 0.05 * (1 - t) * math.cos(10 * a + 0.4)
hem = lambda a: 0.60 + 0.09 * (0.5 + 0.5 * math.cos(5 * a)) - 0.05 * math.cos(a)
prof = []
seg = 96
verts, faces = [], []
rows = 8
for i in range(rows):
    t = i / (rows - 1)
    for j in range(seg):
        a = TAU * j / seg
        zb = hem(a); z = zb + (1.10 - zb) * t
        r = 0.285 + (0.158 - 0.285) * t ** 0.8
        k = surjupe_fold(a, t, z)
        verts.append(Vector((r * k * math.sin(a), -r * k * 0.84 * math.cos(a), z)))
for i in range(rows - 1):
    for j in range(seg):
        j2 = (j + 1) % seg
        faces.append((i * seg + j, i * seg + j2, (i + 1) * seg + j2, (i + 1) * seg + j))
mesh_obj("surjupe", verts, faces, PATINE, 0.12)
# Le liseré ne court que sur l'avant : derrière, la surjupe est sous le manteau.
ourlet = [verts[j] * 1.012 for j in list(range(seg - 20, seg)) + list(range(0, 21))]
sweep("ourlet_or", ourlet, 0.012, OR, seg=8, cap=False)

# Ceinture d'or et boucle.
torus("ceinture", (0, 0, 1.10), 0.152, 0.016, OR, maj=64)
bpy.context.active_object.scale = (1, 0.84, 1)
cone("boucle", (0, -0.132, 1.10), 0.03, 0.012, OR, verts=4, rot=(math.radians(90), 0, 0), r2=0.03)
sweep("pendant_ceinture", [(0, -0.13, 1.09), (0, -0.15, 0.98)], 0.008, OR, seg=6)
# Collier et médaillon.
torus("collier", (0, -0.01, 1.455), 0.085, 0.009, OR, rot=(math.radians(-12), 0, 0), maj=40)
sphere("medaillon", (0, -0.105, 1.40), 0.022, OR, scale=(1, 0.5, 1))

# ================================================================ MANTEAU (cape ouverte devant)
def cape_fold(a, t, z):
    return 1.0 + (0.02 + 0.075 * (1 - t)) * math.cos(9 * a + 0.8) + 0.02 * math.cos(17 * a)
cape_prof = [(0.47, 0.0), (0.45, 0.08), (0.39, 0.42), (0.32, 0.82), (0.255, 1.12), (0.215, 1.30), (0.195, 1.40), (0.14, 1.47)]
# Ouverture devant, plus large en bas qu'en haut : les bords tombent en biais comme sur la planche.
seg = 72; ring = seg + 1; cverts, cfaces = [], []
for i, (r, z) in enumerate(cape_prof):
    t = i / (len(cape_prof) - 1)
    a0 = 0.95 - 0.55 * t
    for j in range(ring):
        a = a0 + (TAU - 2 * a0) * j / seg
        k = 1.0 + (0.03 + 0.09 * (1 - t)) * math.cos(9 * a + 0.8) + 0.025 * math.cos(17 * a)
        cverts.append(Vector((r * k * math.sin(a), -r * k * 0.80 * math.cos(a), z)))
for i in range(len(cape_prof) - 1):
    for j in range(seg):
        cfaces.append((i * ring + j, i * ring + j + 1, (i + 1) * ring + j + 1, (i + 1) * ring + j))
cape = mesh_obj("manteau", cverts, cfaces, MANTEAU, 0.14)
cv = cape.data.vertices
bord_g = [cv[i * ring].co * 1.01 for i in range(len(cape_prof))]
bord_d = [cv[i * ring + ring - 1].co * 1.01 for i in range(len(cape_prof))]
bas = [cv[j].co * 1.01 for j in range(ring)]
sweep("liseré_g", bord_g, 0.013, OR, seg=8)
sweep("liseré_d", bord_d, 0.013, OR, seg=8)
sweep("liseré_bas", bas, 0.013, OR, seg=8, cap=False)
# Pèlerine drapée autour des épaules.
pel = lathe("pelerine", [(0.235, 1.25), (0.23, 1.31), (0.20, 1.40), (0.14, 1.47), (0.075, 1.505)], MANTEAU,
            seg=72, depth=0.82, fold=lambda a, t, z: 1.0 + 0.07 * (1 - t) * math.cos(7 * a + 0.5) + 0.03 * (1 - t) * math.cos(13 * a), wash=0.14,
            zoff=lambda a, t: -(1 - t) * (0.10 * math.cos(a) ** 2 - 0.02))
pv = pel.data.vertices
sweep("liseré_pelerine", [pv[j].co * 1.012 for j in range(72)] + [pv[0].co * 1.012], 0.011, OR, seg=8, cap=False)

# ================================================================ TÊTE
sweep("cou", [(0, 0, 1.49), (0, -0.005, 1.60)], [0.050, 0.046], CHAIR, seg=16)
tete = sphere("tete", (0, -0.012, 1.685), 0.098, CHAIR, scale=(0.86, 0.98, 1.16), seg=28, rings=18)
cone("nez", (0, -0.093, 1.676), 0.011, 0.030, CHAIR, verts=6, rot=(math.radians(-80), 0, 0), wash=0.03)
sphere("menton", (0, -0.068, 1.612), 0.026, CHAIR, scale=(1.0, 0.7, 0.6))
for sx in (-1, 1):
    sphere("arcade", (sx * 0.034, -0.083, 1.712), 0.018, CHAIR, scale=(1.3, 0.6, 0.5))
# Chevelure bouclée relevée en chignon.
sphere("cheveux", (0, 0.012, 1.71), 0.103, CHEVEUX, scale=(0.92, 0.96, 1.08), seg=24, rings=14, wash=0.18)
for k in range(16):
    a = math.pi * 0.25 + (math.pi * 1.5) * k / 15
    sphere("boucle", (0.085 * math.sin(a), 0.01 - 0.075 * math.cos(a), 1.64 + 0.02 * math.sin(3 * k)), 0.03, CHEVEUX, wash=0.18)
sphere("chignon", (0, 0.085, 1.66), 0.055, CHEVEUX, scale=(1.2, 0.9, 0.9), wash=0.18)

# ================================================================ COURONNE
CZ = 1.775
lathe("couronne_bandeau", [(0.098, CZ - 0.022), (0.101, CZ + 0.022)], OR, seg=48, depth=0.94, cy=0.005, wash=0.04)
torus("couronne_bas", (0, 0.005, CZ - 0.022), 0.099, 0.007, OR, maj=48)
torus("couronne_haut", (0, 0.005, CZ + 0.022), 0.102, 0.006, OR, maj=48)
bpy.context.active_object.scale = (1, 0.94, 1)
for k in range(8):
    a = TAU * k / 8
    x, y = 0.101 * math.sin(a), 0.005 - 0.095 * math.cos(a)
    h = 0.075 if k == 0 else 0.055
    # Fleurons à facettes : pointe de diamant sur une petite base.
    cone("fleuron", (x, y, CZ + 0.022 + h * 0.55), 0.022, h * 0.9, OR, verts=4, rot=(0, 0, a + math.pi / 4))
    cone("fleuron_base", (x, y, CZ + 0.022 + h * 0.12), 0.0, h * 0.25, OR, verts=4, rot=(math.pi, 0, a + math.pi / 4), r2=0.0)
    bpy.context.active_object.scale = (0.022 / max(1e-6, 0.022), 1, 1)
    sphere("gemme", (x * 1.03, y * 1.03, CZ), 0.011, OR_SOMBRE if k % 2 else OR, wash=0.02)

# ================================================================ BRAS
def bras(cote, epaule, coude, poignet):
    # Manche ample, puis avant-bras nu (bronze).
    sweep("manche", bezier(epaule, ((epaule[0] + coude[0]) / 2 + cote * 0.02, (epaule[1] + coude[1]) / 2, (epaule[2] + coude[2]) / 2), coude, 8),
          [0.068, 0.066, 0.064, 0.062, 0.060, 0.058, 0.056, 0.054], MANTEAU, seg=14, wash=0.12)
    sweep("avant_bras", [coude, poignet], [0.050, 0.034], CHAIR, seg=14)
    torus("bracelet", poignet, 0.034, 0.007, OR, maj=24,
          rot=(Vector(poignet) - Vector(coude)).to_track_quat('Z', 'Y').to_euler())

# SA main droite (côté -X) tient le globe, paume ouverte, à hauteur d'épaule.
G = Vector((-0.47, -0.17, 1.50))      # centre du globe
bras(-1, (-0.165, 0.0, 1.42), (-0.32, -0.04, 1.20), (-0.43, -0.15, 1.33))
sphere("main_droite", (-0.455, -0.165, 1.355), 0.042, CHAIR, scale=(1.25, 1.3, 0.55))
for k in range(4):
    sweep("doigt", [(-0.43 + 0.0, -0.13 - 0.018 * k, 1.36), (-0.405, -0.125 - 0.02 * k, 1.40)], 0.010, CHAIR, seg=6)
# Globe armillaire ajouré : équateur, deux méridiens, écliptique, axe et bouton.
R = 0.12
torus("globe_equateur", G, R, 0.008, OR, rot=(0, 0, 0))
torus("globe_meridien1", G, R, 0.008, OR, rot=(math.radians(90), 0, 0))
torus("globe_meridien2", G, R, 0.008, OR, rot=(math.radians(90), 0, math.radians(90)))
torus("globe_ecliptique", G, R * 0.99, 0.007, OR_SOMBRE, rot=(math.radians(23), math.radians(20), 0))
torus("globe_tropique_n", G + Vector((0, 0, R * 0.55)), R * 0.83, 0.005, OR, rot=(0, 0, 0))
torus("globe_tropique_s", G - Vector((0, 0, R * 0.55)), R * 0.83, 0.005, OR, rot=(0, 0, 0))
sweep("globe_axe", [G - Vector((0, 0, R * 1.05)), G + Vector((0, 0, R * 1.25))], 0.006, OR, seg=6)
sphere("globe_bouton", G + Vector((0, 0, R * 1.3)), 0.018, OR)
sphere("globe_coeur", G, 0.022, OR_SOMBRE)

# SA main gauche (côté +X) tient l'épée, pointe vers le bas.
S = Vector((0.42, -0.21, 1.00))       # poing
bras(1, (0.165, 0.0, 1.42), (0.30, -0.04, 1.18), (0.40, -0.17, 1.03))
sphere("main_gauche", S, 0.045, CHAIR, scale=(1.0, 1.05, 1.25))
sweep("fusee", [S + Vector((0, 0, -0.06)), S + Vector((0, 0, 0.07))], 0.016, OR_SOMBRE, seg=8)
# Pommeau à facettes (octaèdre), sans fleur de lys.
cone("pommeau_haut", S + Vector((0, 0, 0.105)), 0.03, 0.04, OR, verts=6)
cone("pommeau_bas", S + Vector((0, 0, 0.075)), 0.03, 0.025, OR, verts=6, rot=(math.pi, 0, 0))
# Garde droite.
sweep("garde", [S + Vector((-0.10, 0, -0.075)), S + Vector((0.10, 0, -0.075))], 0.012, OR, seg=8)
for sx in (-1, 1):
    sphere("garde_bout", S + Vector((sx * 0.105, 0, -0.075)), 0.018, OR)
# Lame en losange, effilée jusqu'au sol.
top, tip = S + Vector((0, 0, -0.09)), Vector((S.x, S.y, 0.02))
bv, bf, n = [], [], 12
for i in range(n + 1):
    t = i / n; p = top.lerp(tip, t)
    w = 0.025 * (1 - t ** 3) + 0.002; e = 0.009 * (1 - t) + 0.001
    bv += [p + Vector((-w, 0, 0)), p + Vector((0, -e, 0)), p + Vector((w, 0, 0)), p + Vector((0, e, 0))]
for i in range(n):
    for j in range(4):
        j2 = (j + 1) % 4
        bf.append((i * 4 + j, i * 4 + j2, (i + 1) * 4 + j2, (i + 1) * 4 + j))
bf.append((0, 3, 2, 1)); bf.append((n * 4, n * 4 + 1, n * 4 + 2, n * 4 + 3))
mesh_obj("lame", bv, bf, OR, 0.05)

# ================================================================ COULEURS DE SOMMETS
# Teinte de chaque pièce, lavis irrégulier et creux assombris (patine plus sombre dans les plis).
for ob in parts:
    me = ob.data
    if not me.color_attributes:
        me.color_attributes.new("Color", 'FLOAT_COLOR', 'POINT')
    attr = me.color_attributes["Color"]
    base = ob["teinte"]; wash = ob["lavis"]
    mw = ob.matrix_world
    me.calc_loop_triangles() if hasattr(me, "calc_loop_triangles") else None
    for v in me.vertices:
        p = mw @ v.co
        nz = (mw.to_3x3() @ v.normal).normalized()
        w = noise.noise(p * 9.0) * 0.6 + noise.noise(p * 31.0) * 0.4
        creux = max(0.0, -nz.z) * 0.12 + max(0.0, nz.y) * 0.05
        k = 1.0 + wash * w - creux
        c = [min(1.0, max(0.0, base[i] * k)) for i in range(3)]
        if base in (PATINE, MANTEAU) and noise.noise(p * 40.0 + Vector((3, 1, 7))) > 0.62:
            c = [0.72 * c[i] + 0.28 * OR[i] for i in range(3)]  # petits motifs dorés semés
        attr.data[v.index].color = (c[0], c[1], c[2], 1.0)

# ================================================================ ASSEMBLAGE
bpy.ops.object.select_all(action='DESELECT')
for ob in parts:
    ob.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.join()
statue = bpy.context.view_layer.objects.active
statue.name = "statue_sarlande"
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
vs = [v.co for v in statue.data.vertices]
mn = Vector([min(v[i] for v in vs) for i in range(3)]); mx = Vector([max(v[i] for v in vs) for i in range(3)])
k = HAUTEUR / (mx.z - mn.z)
# Origine au centre du pied de la statue (la robe), pas au centre de la boîte : le globe déborde.
statue.data.transform(Matrix.Scale(k, 4) @ Matrix.Translation(Vector((0, 0, -mn.z))))
bpy.ops.object.shade_flat() if False else None
for p in statue.data.polygons:
    p.use_smooth = True
statue.data.color_attributes.active_color = statue.data.color_attributes["Color"]

mat = bpy.data.materials.new("statue_patine")
mat.use_nodes = True
nt = mat.node_tree; bsdf = nt.nodes["Principled BSDF"]
vc = nt.nodes.new("ShaderNodeVertexColor"); vc.layer_name = "Color"
nt.links.new(vc.outputs["Color"], bsdf.inputs["Base Color"])
bsdf.inputs["Roughness"].default_value = 0.85
statue.data.materials.clear(); statue.data.materials.append(mat)

vs = [v.co for v in statue.data.vertices]
mn = Vector([min(v[i] for v in vs) for i in range(3)]); mx = Vector([max(v[i] for v in vs) for i in range(3)])
d = mx - mn
print(f"TRIANGLES {sum(len(p.vertices) - 2 for p in statue.data.polygons)}")
print(f"BOITE x {mn.x:.2f}..{mx.x:.2f}  y {mn.y:.2f}..{mx.y:.2f}  z {mn.z:.2f}..{mx.z:.2f}")

bpy.ops.export_scene.gltf(filepath=DST, export_format='GLB', export_vertex_color='ACTIVE',
                          export_yup=True, export_apply=True)

# ================================================================ APERÇUS (fond ivoire, orthographique)
gm = nt.nodes.new("ShaderNodeGamma"); gm.inputs[1].default_value = 2.2
nt.links.new(vc.outputs["Color"], gm.inputs[0]); nt.links.new(gm.outputs[0], bsdf.inputs["Base Color"])
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = 24; sc.cycles.device = 'CPU'
sc.render.resolution_x, sc.render.resolution_y = 640, 900
sc.view_settings.view_transform = 'Standard'
sc.world = bpy.data.worlds.new("fond"); sc.world.use_nodes = True
bg = sc.world.node_tree.nodes["Background"]; bg.inputs[0].default_value = (0.93, 0.90, 0.83, 1); bg.inputs[1].default_value = 0.9
sun = bpy.data.objects.new("soleil", bpy.data.lights.new("soleil", 'SUN'))
sun.data.energy = 3.0; sun.rotation_euler = (math.radians(50), 0, math.radians(-35)); sc.collection.objects.link(sun)
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = 'ORTHO'
span = max(d.z * 640 / 900, 2 * max(abs(mn.x), abs(mx.x)), 2 * max(abs(mn.y), abs(mx.y))) * 1.08
cam.data.ortho_scale = span * 900 / 640
for name, ang in (("face", 0), ("profil", -90), ("dos", 180)):
    a = math.radians(ang)
    cam.location = (60 * math.sin(a), -60 * math.cos(a), d.z / 2)
    cam.rotation_euler = (math.radians(90), 0, a)
    sc.render.filepath = f"{OUT}/statue_{name}.png"
    bpy.ops.render.render(write_still=True)
print("OK", DST)

"""Prépare un GLB Meshy de la statue de Sarlande pour le jeu.
Usage : python statue_meshy.py <meshy.glb> <sortie.glb> <dossier_apercus> [rotation_z_degres] [triangles_max] [facteur_patine]
- fusionne les objets, applique les transformations ;
- ramène la statue à la hauteur du colosse actuel (29,6 m sans socle), origine au pied ;
- réduit à 60 000 triangles au plus, textures à 2048 px au plus, export JPEG ;
- rend face / profil / dos (caméra orthographique, fond ivoire) + une vue de face annotée.
La face du modèle doit regarder -Y dans Blender (+Z dans le jeu). Si Meshy l'a
tournée autrement, relancer avec la rotation voulue (90, 180, -90)."""
import sys, math, bpy
from mathutils import Vector, Matrix
args = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else sys.argv[1:]
src, dst, out = args[:3]
rot = float(args[3]) if len(args) > 3 else 0.0
HAUTEUR = 29.6
MAX_TRIS = int(args[4]) if len(args) > 4 else 60000
MAX_TEX = 2048

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
bpy.ops.object.select_all(action='DESELECT')
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active
ob.parent = None
ob.name = "statue_sarlande"
ob.rotation_euler = (0, 0, math.radians(rot))
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for o in list(bpy.context.scene.objects):
    if o is not ob: bpy.data.objects.remove(o, do_unlink=True)

def bornes():
    vs = [v.co for v in ob.data.vertices]
    return (Vector([min(v[i] for v in vs) for i in range(3)]), Vector([max(v[i] for v in vs) for i in range(3)]))
mn, mx = bornes()
k = HAUTEUR / (mx.z - mn.z)
# Origine au centre des pieds (bas de la robe), pas au centre de la boîte : le globe déborde d'un côté.
pied = [v.co for v in ob.data.vertices if v.co.z < mn.z + 0.04 * (mx.z - mn.z)]
cx = (min(v.x for v in pied) + max(v.x for v in pied)) / 2; cy = (min(v.y for v in pied) + max(v.y for v in pied)) / 2
ob.data.transform(Matrix.Scale(k, 4) @ Matrix.Translation(Vector((-cx, -cy, -mn.z))))
tris0 = sum(len(p.vertices) - 2 for p in ob.data.polygons)
if tris0 > MAX_TRIS:
    m = ob.modifiers.new("reduction", 'DECIMATE'); m.ratio = MAX_TRIS / tris0
    bpy.ops.object.modifier_apply(modifier=m.name)
tris = sum(len(p.vertices) - 2 for p in ob.data.polygons)
for img in bpy.data.images:
    if img.size[0] > MAX_TEX or img.size[1] > MAX_TEX:
        f = MAX_TEX / max(img.size); img.scale(int(img.size[0]*f), int(img.size[1]*f))
# Le jeu convertit en Lambert et n'utilise que la couleur : on retire relief fin et métal/rugosité
# (fichier plus léger pour l'iPad) et on fonce la patine bleue de 20 %, sans toucher aux dorures.
import numpy as np
FONCE = float(args[5]) if len(args) > 5 else 0.80
for mat in ob.data.materials:
    nt = mat.node_tree; bsdf = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    for entree in ("Normal", "Metallic", "Roughness"):
        for l in list(bsdf.inputs[entree].links): nt.links.remove(l)
    for n in list(nt.nodes):
        if n.type == 'NORMAL_MAP' or (n.type == 'TEX_IMAGE' and not any(l.to_node == bsdf and l.to_socket.name == "Base Color" for o in n.outputs for l in o.links)):
            nt.nodes.remove(n)
    bsdf.inputs["Metallic"].default_value = 0.0; bsdf.inputs["Roughness"].default_value = 0.8
    for n in nt.nodes:
        if n.type == 'TEX_IMAGE':
            img = n.image; px = np.array(img.pixels[:], dtype=np.float32).reshape(-1, 4)
            r, g, bl = px[:, 0], px[:, 1], px[:, 2]
            dore = np.clip((r - bl - 0.04) / 0.10, 0, 1)          # 1 sur l'or, 0 sur la patine bleue
            k = FONCE + (1 - FONCE) * dore
            px[:, :3] *= k[:, None]
            img.pixels[:] = px.ravel(); img.update()
for img in list(bpy.data.images):
    if img.users == 0: bpy.data.images.remove(img)
mn, mx = bornes(); d = mx - mn
print(f"TRIANGLES {tris0} -> {tris}")
print(f"DIMENSIONS (m) largeur {d.x:.2f} profondeur {d.y:.2f} hauteur {d.z:.2f}")
print("TEXTURES", [(i.name, tuple(i.size)) for i in bpy.data.images])
print("MATERIAUX", [m.name for m in ob.data.materials])

bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_image_format='JPEG',
    export_jpeg_quality=88, export_yup=True, export_apply=True)

sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = 32; sc.cycles.device = 'CPU'
sc.render.resolution_x, sc.render.resolution_y = 640, 900
sc.view_settings.view_transform = 'Standard'
sc.world = bpy.data.worlds.new("fond")
sc.world.color = (0.93, 0.90, 0.83)
try:
    sc.world.use_nodes = True
    bg = sc.world.node_tree.nodes["Background"]; bg.inputs[0].default_value = (0.93, 0.90, 0.83, 1); bg.inputs[1].default_value = 0.9
except Exception: pass
sun = bpy.data.objects.new("soleil", bpy.data.lights.new("soleil", 'SUN'))
sun.data.energy = 3.0; sun.rotation_euler = (math.radians(50), 0, math.radians(-35)); sc.collection.objects.link(sun)
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = 'ORTHO'; cam.data.ortho_scale = max(d.z * 640/900, max(d.x, d.y)) * 1.1 * 900/640
for name, ang in (("face", 0), ("profil", 90), ("dos", 180)):
    a = math.radians(ang)
    cam.location = (60*math.sin(a), -60*math.cos(a), d.z/2)
    cam.rotation_euler = (math.radians(90), 0, a)
    sc.render.filepath = f"{out}/statue_{name}.png"
    bpy.ops.render.render(write_still=True)
print("OK", dst)

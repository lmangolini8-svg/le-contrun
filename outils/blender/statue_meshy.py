"""Prépare un GLB Meshy de la statue de Sarlande pour le jeu.
Usage : python statue_meshy.py <meshy.glb> <sortie.glb> <dossier_apercus> [rotation_y_degres]
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
MAX_TRIS = 60000
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
ob.data.transform(Matrix.Scale(k, 4) @ Matrix.Translation(Vector((-(mn.x+mx.x)/2, -(mn.y+mx.y)/2, -mn.z))))
tris0 = sum(len(p.vertices) - 2 for p in ob.data.polygons)
if tris0 > MAX_TRIS:
    m = ob.modifiers.new("reduction", 'DECIMATE'); m.ratio = MAX_TRIS / tris0
    bpy.ops.object.modifier_apply(modifier=m.name)
tris = sum(len(p.vertices) - 2 for p in ob.data.polygons)
for img in bpy.data.images:
    if img.size[0] > MAX_TEX or img.size[1] > MAX_TEX:
        f = MAX_TEX / max(img.size); img.scale(int(img.size[0]*f), int(img.size[1]*f))
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

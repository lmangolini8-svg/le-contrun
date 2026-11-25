"""Prépare un GLB brut de Meshy (bâtiment, objet) pour le jeu.

Usage : python prepare_meshy.py <brut.glb> <sortie.glb> <dossier_apercus> <triangles_max> <hauteur_m | Llargeur_m>
            [texture_px=1024] [rotation_z_deg=0] [teinte=1,1,1]

- fusionne les objets, applique la rotation demandée (la façade doit regarder -Y dans Blender,
  donc +Z dans le jeu) ;
- met à l'échelle à la hauteur voulue, origine au centre du pied de la boîte ;
- réduit au nombre de triangles voulu ;
- ne garde que la texture de couleur (le jeu convertit tout en Lambert), redimensionnée,
  multipliée par la teinte (r,g,b) pour l'accorder à la pierre de Sarlande ;
- exporte en GLB (JPEG) et rend une vue de face et une vue de trois quarts.
"""
import sys, math, bpy
import numpy as np
from mathutils import Vector, Matrix

args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
src, dst, out = args[:3]
MAX_TRIS = int(args[3]); PAR_LARGEUR = args[4].startswith('L'); HAUTEUR = float(args[4].lstrip('L'))
TEX = int(args[5]) if len(args) > 5 else 1024
ROT = float(args[6]) if len(args) > 6 else 0.0
TEINTE = [float(x) for x in args[7].split(",")] if len(args) > 7 else [1.0, 1.0, 1.0]
nom = dst.rsplit("/", 1)[-1].rsplit(".", 1)[0]

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
bpy.ops.object.select_all(action='DESELECT')
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active
ob.parent = None; ob.name = nom
ob.rotation_euler = (0, 0, math.radians(ROT))
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for o in list(bpy.context.scene.objects):
    if o is not ob: bpy.data.objects.remove(o, do_unlink=True)

def bornes():
    n = len(ob.data.vertices); co = np.empty(n * 3, dtype=np.float32)
    ob.data.vertices.foreach_get("co", co); co = co.reshape(-1, 3)
    return Vector(co.min(0)), Vector(co.max(0))

mn, mx = bornes()
k = HAUTEUR / ((mx.x - mn.x) if PAR_LARGEUR else (mx.z - mn.z))
ob.data.transform(Matrix.Scale(k, 4) @ Matrix.Translation(Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z))))
tris0 = sum(len(p.vertices) - 2 for p in ob.data.polygons)
if tris0 > MAX_TRIS:
    m = ob.modifiers.new("reduction", 'DECIMATE'); m.ratio = MAX_TRIS / tris0
    bpy.ops.object.modifier_apply(modifier=m.name)
tris = sum(len(p.vertices) - 2 for p in ob.data.polygons)

for mat in ob.data.materials:
    nt = mat.node_tree; bsdf = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    for entree in ("Normal", "Metallic", "Roughness"):
        for l in list(bsdf.inputs[entree].links): nt.links.remove(l)
    for n in list(nt.nodes):
        if n.type == 'NORMAL_MAP' or (n.type == 'TEX_IMAGE' and not any(
                l.to_node == bsdf and l.to_socket.name == "Base Color" for o in n.outputs for l in o.links)):
            nt.nodes.remove(n)
    bsdf.inputs["Metallic"].default_value = 0.0; bsdf.inputs["Roughness"].default_value = 0.85
    for n in nt.nodes:
        if n.type == 'TEX_IMAGE':
            img = n.image
            if max(img.size) > TEX:
                f = TEX / max(img.size); img.scale(int(img.size[0] * f), int(img.size[1] * f))
            if TEINTE != [1.0, 1.0, 1.0]:
                px = np.array(img.pixels[:], dtype=np.float32).reshape(-1, 4)
                px[:, :3] *= np.array(TEINTE, dtype=np.float32)
                img.pixels[:] = px.ravel(); img.update()
for img in list(bpy.data.images):
    if img.users == 0: bpy.data.images.remove(img)

mn, mx = bornes(); d = mx - mn
print(f"PIECE {nom} TRIANGLES {tris0} -> {tris}  L {d.x:.1f} P {d.y:.1f} H {d.z:.1f} m  TEX {[tuple(i.size) for i in bpy.data.images]}")
bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_image_format='JPEG',
                          export_jpeg_quality=86, export_yup=True, export_apply=True)

sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = 16; sc.cycles.device = 'CPU'
sc.render.resolution_x, sc.render.resolution_y = 640, 480
sc.view_settings.view_transform = 'Standard'
sc.world = bpy.data.worlds.new("fond"); sc.world.use_nodes = True
bg = sc.world.node_tree.nodes["Background"]; bg.inputs[0].default_value = (0.93, 0.90, 0.83, 1); bg.inputs[1].default_value = 1.0
sun = bpy.data.objects.new("soleil", bpy.data.lights.new("soleil", 'SUN'))
sun.data.energy = 3.0; sun.rotation_euler = (math.radians(50), 0, math.radians(-35)); sc.collection.objects.link(sun)
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.clip_end = 2000; cam.data.type = "ORTHO"; cam.data.ortho_scale = max(d.x, d.y, d.z * 4 / 3) * 1.15
for vue, ang in (("face", 0), ("trois_quarts", 35)):
    a = math.radians(ang); R = 400
    cam.location = (R * math.sin(a), -R * math.cos(a), d.z / 2 + R * 0.25)
    cam.rotation_euler = (math.radians(90 - math.degrees(math.atan2(R * 0.25, R))), 0, a)
    sc.render.filepath = f"{out}/{nom}_{vue}.png"
    bpy.ops.render.render(write_still=True)
print("OK", dst)

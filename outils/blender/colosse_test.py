"""Test de la chaîne Blender -> GLB pour Le Contr'un (mission à 0 €).
Usage : python colosse_test.py <entree.glb> <sortie.glb> <dossier_apercus>
Importe le colosse extrait du jeu, le nettoie, le met à l'échelle réelle
(1 unité = 1 m, origine au pied de la statue, face vers -Y Blender = +Z jeu),
produit trois vues de contrôle (face, profil, dos) et exporte un GLB."""
import sys, math, bpy, bmesh
from mathutils import Vector, Matrix
src, dst, out = sys.argv[-3:]
GAME_SCALE = 3.86   # échelle appliquée par index.html au colosse procédural

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
for o in objs: o.select_set(True)
bpy.context.view_layer.objects.active = objs[0]
if len(objs) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active
ob.name = "colosse_test_blender"
v0 = len(ob.data.vertices)
# Fusion des sommets en double (le jeu exporte une géométrie non indexée).
bm = bmesh.new(); bm.from_mesh(ob.data)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
bm.to_mesh(ob.data); bm.free()
ob.scale = (GAME_SCALE,)*3
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
# Origine au centre de la base.
mn = Vector([min(v.co[i] for v in ob.data.vertices) for i in range(3)])
mx = Vector([max(v.co[i] for v in ob.data.vertices) for i in range(3)])
ob.data.transform(Matrix.Translation(Vector((-(mn.x+mx.x)/2, -(mn.y+mx.y)/2, -mn.z))))
dims = mx - mn
print(f"SOMMETS {v0} -> {len(ob.data.vertices)} ; triangles {len(ob.data.polygons)}")
print(f"DIMENSIONS (m) largeur {dims.x:.2f} profondeur {dims.y:.2f} hauteur {dims.z:.2f}")
print("ATTRIBUTS COULEUR", [a.name for a in ob.data.color_attributes])
ob["source"] = "index.html, colosse procédural, extrait pour test de chaîne"

# Matériau : couleurs de sommets, mat comme le Lambert du jeu.
mat = bpy.data.materials.new("colosse_patine"); mat.use_nodes = True
nt = mat.node_tree; bsdf = nt.nodes["Principled BSDF"]
ca = nt.nodes.new("ShaderNodeVertexColor")
if ob.data.color_attributes: ca.layer_name = ob.data.color_attributes[0].name
nt.links.new(ca.outputs["Color"], bsdf.inputs["Base Color"])
bsdf.inputs["Roughness"].default_value = 0.9
bsdf.inputs["Metallic"].default_value = 0.0
ob.data.materials.clear(); ob.data.materials.append(mat)

# Export GLB (avant d'ajouter caméra et lumières).
bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', use_selection=False,
    export_vertex_color='ACTIVE', export_yup=True, export_apply=True)

# Les couleurs de sommets du jeu sont des valeurs sRGB brutes (three r128 sans
# gestion des couleurs). Le GLB les garde telles quelles ; pour l'aperçu
# seulement, on les ramène en linéaire afin que Blender les affiche fidèlement.
gm = nt.nodes.new("ShaderNodeGamma"); gm.inputs[1].default_value = 2.2
nt.links.new(ca.outputs["Color"], gm.inputs[0]); nt.links.new(gm.outputs[0], bsdf.inputs["Base Color"])
# Aperçus : fond ivoire, éclairage doux, caméra orthographique.
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = 24; sc.cycles.device = 'CPU'
sc.render.resolution_x, sc.render.resolution_y = 640, 900
sc.world = bpy.data.worlds.new("fond"); sc.world.use_nodes = True
sc.world.node_tree.nodes["Background"].inputs[0].default_value = (0.93, 0.90, 0.83, 1)
sc.world.node_tree.nodes["Background"].inputs[1].default_value = 0.9
sc.view_settings.view_transform = 'Standard'
sun = bpy.data.objects.new("soleil", bpy.data.lights.new("soleil", 'SUN'))
sun.data.energy = 3.0; sun.rotation_euler = (math.radians(50), 0, math.radians(-35)); sc.collection.objects.link(sun)
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = 'ORTHO'; cam.data.ortho_scale = max(dims.z * 640/900, dims.x) * 1.08 * 900/640
h = dims.z / 2
for name, ang in (("face", 0), ("profil", 90), ("dos", 180)):
    a = math.radians(ang); d = 40
    cam.location = (d*math.sin(a), -d*math.cos(a), h)
    cam.rotation_euler = (math.radians(90), 0, a)
    sc.render.filepath = f"{out}/colosse_{name}.png"
    bpy.ops.render.render(write_still=True)
print("OK", dst)

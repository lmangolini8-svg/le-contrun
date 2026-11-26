"""Exporter Aliénor et ses deux boucles FBX depuis le GLB Meshy du jeu.

blender -b --python-exit-code 1 --python unreal/ContrunPrototype/Tools/export_alienor.py
--source et --output peuvent être passés après le séparateur -- de Blender.

Les unités FBX sont des centimètres. Le modèle et les animations conservent
le même squelette et les deux courbes sont jouées sur place.
"""

import argparse
import math
from pathlib import Path
import sys

import bpy
from mathutils import Matrix, Quaternion, Vector


OUTILS = Path(__file__).resolve().parent
SOURCE = OUTILS.parents[2] / "modeles/personnages/alienor_meshy.glb"
SORTIE = OUTILS.parent / "Generated/Alienor"
HAUTEUR_CM = 168.0
IMAGES_SECONDE = 30
DROITE = Vector((1, 0, 0))
AVANT = Vector((0, -1, 0))
HAUT = Vector((0, 0, 1))
ARTICULATIONS = {
    "Hanches", "Buste", "Tete",
    *(nom + cote for cote in ("G", "D")
      for nom in ("Bras", "AvantBras", "Cuisse", "Jambe", "Pied")),
}


def charger(source):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(source))
    squelettes = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
    if len(squelettes) != 1:
        raise ValueError("L’export d’Aliénor doit contenir un seul squelette.")
    squelette = squelettes[0]
    maillages = [
        obj for obj in bpy.context.scene.objects
        if obj.type == "MESH" and any(
            mod.type == "ARMATURE" and mod.object == squelette for mod in obj.modifiers
        )
    ]
    if len(maillages) != 1 or not ARTICULATIONS.issubset(squelette.data.bones.keys()):
        raise ValueError("Le maillage déformable ou les articulations d’Aliénor manquent.")
    mesh = maillages[0]
    expressions = mesh.data.shape_keys
    if not expressions or {"Sourire", "Inquietude"} - set(expressions.key_blocks.keys()):
        raise ValueError("Les déformations du visage d’Aliénor sont manquantes.")

    bpy.context.view_layer.update()
    coins = [mesh.matrix_world @ Vector(point) for point in mesh.bound_box]
    minimum = Vector(tuple(min(point[axe] for point in coins) for axe in range(3)))
    maximum = Vector(tuple(max(point[axe] for point in coins) for axe in range(3)))
    hauteur = maximum.z - minimum.z
    if hauteur <= 0:
        raise ValueError("La hauteur du maillage d’Aliénor doit être positive.")
    centre = (minimum + maximum) * .5
    centre.z = minimum.z
    normaliser = Matrix.Scale(HAUTEUR_CM / hauteur, 4) @ Matrix.Translation(-centre)
    monde_squelette, monde_mesh = squelette.matrix_world.copy(), mesh.matrix_world.copy()

    # Appliquer l’échelle dans le maillage et le repos des os évite une échelle
    # cachée sur la racine. Les morph targets passent par la même transformation.
    squelette.data.transform(normaliser @ monde_squelette)
    mesh.data.transform(normaliser @ monde_mesh, shape_keys=True)
    squelette.matrix_world = Matrix.Identity(4)
    mesh.parent = squelette
    mesh.matrix_parent_inverse = Matrix.Identity(4)
    mesh.matrix_world = Matrix.Identity(4)
    squelette.name = "Armature"
    mesh.name = "Alienor"
    mesh.data.name = "Alienor"
    if mesh.active_material:
        mesh.active_material.name = "M_Alienor"
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = .01
    scene.render.fps = IMAGES_SECONDE
    scene.render.fps_base = 1
    for os in squelette.pose.bones:
        os.rotation_mode = "QUATERNION"
    bpy.context.view_layer.update()
    return squelette, mesh


def sauvegarder_textures(mesh, sortie):
    # Les trois cartes sont déjà incorporées dans le GLB validé.
    shader, = (node for node in mesh.active_material.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    emission_base = shader.inputs["Base Color"].links[0].from_node
    separateur = shader.inputs["Roughness"].links[0].from_node
    normale = shader.inputs["Normal"].links[0].from_node
    textures = {
        "BaseColor": emission_base.image,
        "MetalRoughness": separateur.inputs["Color"].links[0].from_node.image,
        "Normal": normale.inputs["Color"].links[0].from_node.image,
    }
    for role, image in textures.items():
        if not image.packed_file:
            raise ValueError("Texture incorporée manquante · " + role)
        data = bytes(image.packed_file.data)
        extension = ".png" if data.startswith(b"\x89PNG\r\n\x1a\n") else ".jpg"
        chemin = sortie / ("T_Alienor_" + role + extension)
        chemin.write_bytes(data)
        image.filepath_raw = str(chemin)
        image.name = chemin.stem


def export_fbx(chemin, squelette, mesh=None):
    animer = mesh is None
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = squelette
    squelette.select_set(True)
    if mesh is not None:
        mesh.select_set(True)
    resultat = bpy.ops.export_scene.fbx(
        filepath=str(chemin), use_selection=True,
        object_types={"ARMATURE"} if animer else {"ARMATURE", "MESH"},
        axis_forward="-Y", axis_up="Z", apply_unit_scale=True,
        apply_scale_options="FBX_SCALE_UNITS",
        use_mesh_modifiers=False, mesh_smooth_type="FACE",
        use_armature_deform_only=True, add_leaf_bones=False, armature_nodetype="NULL",
        path_mode="COPY" if mesh is not None else "AUTO", embed_textures=mesh is not None,
        bake_anim=animer, bake_anim_use_all_bones=True,
        bake_anim_use_nla_strips=False, bake_anim_use_all_actions=False,
        bake_anim_force_startend_keying=True, bake_anim_simplify_factor=0,
    )
    if resultat != {"FINISHED"}:
        raise RuntimeError("Échec de l’export · " + str(chemin))


def incliner(os, axe, angle):
    local = os.bone.matrix_local.to_quaternion().inverted() @ axe
    os.rotation_quaternion = Quaternion(local, angle)


def orienter(os, rotation):
    repos = os.bone.matrix_local.to_quaternion()
    if os.parent:
        repos = os.parent.bone.matrix_local.to_quaternion().inverted() @ repos
        rotation = os.parent.matrix.to_quaternion().inverted() @ rotation
    os.rotation_quaternion = repos.inverted() @ rotation


def viser(os, direction):
    repos = os.bone.matrix_local.to_quaternion()
    axe = repos @ Vector((0, 1, 0))
    orienter(os, axe.rotation_difference(direction.normalized()) @ repos)


def poser_pied(os, cote, progression, levee, tangage):
    cuisse, jambe, pied = (os[nom + cote] for nom in ("Cuisse", "Jambe", "Pied"))
    cheville = pied.bone.head_local + AVANT * progression + HAUT * levee
    hanche = cuisse.head.copy()
    direction = cheville - hanche
    a, b = cuisse.bone.length, jambe.bone.length
    distance = min(a + b - .01, max(abs(a - b) + .01, direction.length))
    direction.normalize()
    appui = (a * a + distance * distance - b * b) / (2 * distance)
    courbure = math.sqrt(max(0, a * a - appui * appui))
    avant = (AVANT - direction * AVANT.dot(direction)).normalized()
    genou = hanche + direction * appui + avant * courbure
    cheville = hanche + direction * distance
    viser(cuisse, genou - hanche)
    bpy.context.view_layer.update()
    viser(jambe, cheville - genou)
    bpy.context.view_layer.update()
    orienter(pied, Quaternion(DROITE, tangage) @ pied.bone.matrix_local.to_quaternion())


def repos(os, progression):
    onde = math.sin(progression * math.tau)
    incliner(os["Buste"], DROITE, .014 * onde)
    incliner(os["Tete"], HAUT, -.021 * onde)
    for cote, signe in (("G", 1), ("D", -1)):
        incliner(os["Bras" + cote], DROITE, .018 * onde * signe)
        incliner(os["AvantBras" + cote], DROITE, -.030 + .012 * onde * signe)


def marche(os, progression):
    phase = progression * math.tau
    os["Hanches"].location.y = -3.4 + .7 * math.cos(phase * 2)
    incliner(os["Buste"], HAUT, .065 * math.cos(phase))
    incliner(os["Tete"], HAUT, -.038 * math.cos(phase))
    for cote, signe in (("G", 1), ("D", -1)):
        incliner(os["Bras" + cote], DROITE, .23 * signe * math.cos(phase))
        incliner(os["AvantBras" + cote], DROITE, -.105 - .14 * max(0, -signe * math.cos(phase)))
    bpy.context.view_layer.update()
    for cote, decalage in (("G", 0), ("D", .5)):
        pas = (progression + decalage) % 1
        if pas <= .58:
            t = pas / .58
            amplitude = 19.0 * (1 - 2 * t)
            hauteur = 0
            tangage = -.09 * max(0, 1 - t / .2) + .12 * max(0, (t - .76) / .24)
        else:
            t = (pas - .58) / .42
            amplitude = -19.0 * math.cos(math.pi * t)
            hauteur = 7.8 * math.sin(math.pi * t)
            tangage = .12 * (1 - t) - .09 * t
        poser_pied(os, cote, amplitude, hauteur, tangage)


def exporter_boucle(sortie, squelette, nom, intervalles, poser):
    scene = bpy.context.scene
    squelette.animation_data_create()
    squelette.animation_data.action = bpy.data.actions.new(nom)
    scene.frame_start, scene.frame_end = 1, intervalles + 1
    os = squelette.pose.bones
    for element in os:
        element.matrix_basis = Matrix.Identity(4)
        element.keyframe_insert(data_path="rotation_quaternion", frame=0)
    os["Hanches"].keyframe_insert(data_path="location", frame=0)
    for i in range(intervalles + 1):
        # La dernière image reprend exactement la première pour boucler proprement.
        scene.frame_set(i + 1)
        for element in os:
            element.matrix_basis = Matrix.Identity(4)
        poser(os, (i % intervalles) / intervalles)
        for element in os:
            element.keyframe_insert(data_path="rotation_quaternion", frame=i + 1)
        os["Hanches"].keyframe_insert(data_path="location", frame=i + 1)
    # Le FBX utilise la pose au moment de l’export pour ses nœuds de référence.
    # Laisser cette pose au repos, en dehors de la plage de cuisson du clip.
    scene.frame_set(0)
    export_fbx(sortie / (nom + ".fbx"), squelette)


def main(source, sortie):
    sortie.mkdir(parents=True, exist_ok=True)
    squelette, mesh = charger(source)
    sauvegarder_textures(mesh, sortie)
    export_fbx(sortie / "SK_Alienor.fbx", squelette, mesh)
    exporter_boucle(sortie, squelette, "A_Alienor_Idle", 72, repos)
    exporter_boucle(sortie, squelette, "A_Alienor_Walk", 32, marche)
    print("Aliénor exportée ·", len(squelette.data.bones), "os ·", sortie)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=SOURCE)
    parser.add_argument("--output", type=Path, default=SORTIE)
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
    main(args.source.resolve(), args.output.resolve())

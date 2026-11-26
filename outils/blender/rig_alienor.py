"""Préparer le GLB de jeu depuis l'export Meshy « Apron of Autumn Ink ».

Usage : blender -b --python-exit-code 1 --python outils/blender/rig_alienor.py \
  -- ALIENOR_SOURCE.glb modeles/personnages/alienor_meshy.glb
Les points du squelette sont propres à cet export.
"""

import argparse
import math
from pathlib import Path
import sys
import tempfile

import bpy


def exporter(chemin):
    bpy.ops.export_scene.gltf(
        filepath=str(chemin), export_format="GLB",
        export_image_format="JPEG", export_jpeg_quality=87,
    )


def optimiser(source, sortie):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(source))
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH" or len(obj.data.polygons) <= 24000:
            continue
        bpy.context.view_layer.objects.active = obj
        mod = obj.modifiers.new("Maillage pour le jeu", "DECIMATE")
        mod.ratio = 24000 / len(obj.data.polygons)
        bpy.ops.object.modifier_apply(modifier=mod.name)
    for image in bpy.data.images:
        if max(image.size) > 1024:
            ratio = 1024 / max(image.size)
            image.scale(*(max(1, round(side * ratio)) for side in image.size[:]))
            image.pack()
    exporter(sortie)


def transition(debut, fin, valeur):
    t = max(0, min(1, (valeur - debut) / (fin - debut)))
    return t * t * (3 - 2 * t)


def creer_squelette(maillage):
    armature = bpy.data.armatures.new("Squelette Aliénor")
    rig = bpy.data.objects.new("Squelette Aliénor", armature)
    bpy.context.collection.objects.link(rig)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode="EDIT")

    def os(nom, debut, fin, parent=None):
        element = armature.edit_bones.new(nom)
        element.head = debut
        element.tail = fin
        if parent:
            element.parent = armature.edit_bones[parent]

    os("Hanches", (0, 0, -.15), (0, 0, .15))
    os("Buste", (0, 0, .15), (0, 0, .63), "Hanches")
    os("Tete", (0, 0, .63), (0, 0, .88), "Buste")
    for cote, signe in (("G", -1), ("D", 1)):
        os("Bras" + cote, (signe * .169, 0, .56), (signe * .235, 0, .31), "Buste")
        os("AvantBras" + cote, (signe * .235, 0, .31), (signe * .315, 0, .035), "Bras" + cote)
        os("Cuisse" + cote, (signe * .09, 0, -.12), (signe * .083, 0, -.53), "Hanches")
        os("Jambe" + cote, (signe * .083, 0, -.53), (signe * .08, 0, -.84), "Cuisse" + cote)
        os("Pied" + cote, (signe * .08, 0, -.84), (signe * .08, -.105, -.92), "Jambe" + cote)

    bpy.ops.object.mode_set(mode="OBJECT")
    groupes = {os.name: maillage.vertex_groups.new(name=os.name) for os in armature.bones}
    maillage.parent = rig
    maillage.modifiers.new("Articulations", "ARMATURE").object = rig
    for sommet in maillage.data.vertices:
        x, _, z = sommet.co
        cote = "G" if x < 0 else "D"
        # La silhouette des bras s’écarte du corsage vers les poignets.
        # La jupe et le tablier gardent les poids du corps.
        joint = max(.145, min(.27, .19 + (.20 - z) * .5))
        bras = transition(joint - .007, joint + .007, abs(x))
        bras *= transition(-.157, -.137, z) * (1 - transition(.54, .64, z))
        avant_bras = 1 - transition(.27, .36, z)
        bas = 1 - transition(-.14, .06, z)
        tete = transition(.59, .70, z)
        poids = {
            "Bras" + cote: bras * (1 - avant_bras),
            "AvantBras" + cote: bras * avant_bras,
            "Tete": (1 - bras) * tete,
            "Buste": (1 - bras) * (1 - tete) * (1 - bas),
        }
        for cote, signe in (("G", -1), ("D", 1)):
            cote_jupe = transition(-.065, .065, x * signe)
            pied = 1 - transition(-.84, -.76, z)
            tibia = 1 - transition(-.60, -.48, z)
            jambe = (1 - bras) * (1 - tete) * bas * cote_jupe
            poids["Cuisse" + cote] = jambe * (1 - tibia)
            poids["Jambe" + cote] = jambe * tibia * (1 - pied)
            poids["Pied" + cote] = jambe * tibia * pied
        for nom, valeur in poids.items():
            if valeur > 1e-5:
                groupes[nom].add([sommet.index], valeur, "REPLACE")


def creer_expressions(maillage):
    maillage.shape_key_add(name="Basis")
    sourire = maillage.shape_key_add(name="Sourire")
    inquietude = maillage.shape_key_add(name="Inquietude")
    for sommet in maillage.data.vertices:
        x, y, z = sommet.co
        devant = 1 - transition(-.056, -.007, y)
        bouche = math.exp(-((z - .730) / .026) ** 2 - ((abs(x) - .025) / .021) ** 2) * devant
        joue = math.exp(-((z - .753) / .033) ** 2 - ((abs(x) - .046) / .023) ** 2) * devant
        sourcil = math.exp(-((z - .824) / .024) ** 2 - ((abs(x) - .023) / .022) ** 2) * devant
        sourire.data[sommet.index].co.z += .014 * bouche + .005 * joue
        sourire.data[sommet.index].co.x += math.copysign(.007 * bouche, x)
        inquietude.data[sommet.index].co.z += .012 * sourcil - .007 * bouche


def preparer(source, destination):
    with tempfile.TemporaryDirectory() as dossier:
        relu = Path(dossier) / "alienor.glb"
        optimiser(source, relu)
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.gltf(filepath=str(relu))
        maillage, = (obj for obj in bpy.context.scene.objects if obj.type == "MESH")
        bpy.context.view_layer.objects.active = maillage
        maillage.select_set(True)
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        creer_squelette(maillage)
        creer_expressions(maillage)
        exporter(destination)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:])
    preparer(args.source, args.destination)

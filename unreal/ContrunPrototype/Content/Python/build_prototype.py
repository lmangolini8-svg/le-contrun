"""Construit et sauvegarde la carte du prototype avec Unreal Editor 5.7."""

import json
import math
from pathlib import Path
import re

import unreal


PROJECT = Path(__file__).resolve().parents[2]
REPOSITORY = PROJECT.parents[1]
GENERATED = PROJECT / "Generated"
RECEIPT = GENERATED / "prototype.ready"
CONTENT = "/Game/Sarlande"
LEVEL = f"{CONTENT}/Cartes/ClosImprimerie"
CHARACTER_DIR = f"{CONTENT}/Personnages/Alienor"
AUDIO_DIR = f"{CONTENT}/Audio"
GENERATED_TAG = "ContrunPrototype"
AUDIO_FILES = ("Amb_Ruelle", "Amb_Atelier", "SFX_Porte", "SFX_Presse")


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def xyz(data):
    coordinates = tuple(float(data[axis]) for axis in "xyz")
    require(all(math.isfinite(v) for v in coordinates), f"Coordonnées invalides : {data}")
    return coordinates


def vector(point):
    return unreal.Vector(*point)


def yaw_rotation(yaw=0, pitch=0):
    return unreal.Rotator(yaw=float(yaw), pitch=float(pitch), roll=0.0)


def load_route():
    with (GENERATED / "route.json").open(encoding="utf-8") as source:
        route = json.load(source)
    require(route.get("version") == 1, "Version inconnue de Generated/route.json")
    return route


def read_terrain(path):
    vertices = []
    faces = []
    with path.open(encoding="utf-8") as source:
        for line in source:
            tokens = line.split()
            if not tokens:
                continue
            kind, *parts = tokens
            if kind == "v":
                vertices.append(tuple(map(float, parts[:3])))
            elif kind == "f":
                indices = [int(p.split("/")[0]) for p in parts]
                indices = [i - 1 if i > 0 else len(vertices) + i for i in indices]
                faces.extend((indices[0], indices[i], indices[i + 1]) for i in range(1, len(indices) - 1))
    require(vertices and faces, f"Maillage du relief vide : {path}")
    return vertices, faces


def distance_squared_to_road(x, y, segments):
    best = math.inf
    for ax, ay, dx, dy, denominator in segments:
        fraction = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / denominator))
        px, py = x - ax - dx * fraction, y - ay - dy * fraction
        best = min(best, px * px + py * py)
    return best


class Prototype:
    def __init__(self):
        self.assets = unreal.get_editor_subsystem(unreal.EditorAssetSubsystem)
        self.actors = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
        self.levels = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
        self.tools = unreal.AssetToolsHelpers.get_asset_tools()
        self.cube = unreal.load_asset("/Engine/BasicShapes/Cube.Cube")
        self.static_meshes = {}
        self.materials = {}
        self.imported = {}
        require(self.cube, "Cube de base Unreal indisponible.")

    def import_one(self, path, destination, kind, options=None, factory=None):
        path = path.resolve()
        name = re.sub(r"[^a-zA-Z0-9_]", "_", path.stem)
        package = f"{destination}/{name}"
        require(path.is_file(), f"Fichier source manquant : {path}")
        task = unreal.AssetImportTask()
        task.set_editor_properties({
            "filename": str(path),
            "destination_path": destination,
            "destination_name": name,
            "automated": True,
            "replace_existing": True,
            "save": False,
        })
        if options is not None:
            task.set_editor_property("options", options)
        if factory is not None:
            task.set_editor_property("factory", factory)
        self.tools.import_asset_tasks([task])
        imported = [obj for obj in task.get_objects() if isinstance(obj, kind)]
        require(len(imported) == 1, f"Import de {path.name} : attendu un {kind.__name__}, obtenu {len(imported)}.")
        asset = imported[0]
        if asset.get_path_name().split(".")[0] != package:
            require(self.assets.rename_loaded_asset(asset, package), f"Le nom de l’asset doit être {package}.")
        require(self.assets.save_loaded_asset(asset, only_if_is_dirty=False), f"Écriture impossible : {package}.")
        self.imported[name] = asset.get_path_name()
        return asset

    def import_character(self):
        sources = GENERATED / "Alienor"
        options = unreal.FbxImportUI()
        options.set_editor_properties({
            "automated_import_should_detect_type": False,
            "mesh_type_to_import": unreal.FBXImportType.FBXIT_SKELETAL_MESH,
            "original_import_type": unreal.FBXImportType.FBXIT_SKELETAL_MESH,
            "import_as_skeletal": True,
            "import_animations": False,
            "import_materials": True,
            "import_textures": True,
        })
        options.skeletal_mesh_import_data.set_editor_properties({
            "convert_scene": True,
            "convert_scene_unit": True,
            "force_front_x_axis": True,
            "import_morph_targets": True,
        })
        mesh = self.import_one(sources / "SK_Alienor.fbx", CHARACTER_DIR, unreal.SkeletalMesh, options, unreal.FbxFactory())
        skeleton = mesh.get_editor_property("skeleton")
        require(skeleton, "L’import d’Aliénor ne contient aucun squelette.")
        for name in ("A_Alienor_Idle", "A_Alienor_Walk"):
            options = unreal.FbxImportUI()
            options.set_editor_properties({
                "automated_import_should_detect_type": False,
                "mesh_type_to_import": unreal.FBXImportType.FBXIT_ANIMATION,
                "original_import_type": unreal.FBXImportType.FBXIT_ANIMATION,
                "skeleton": skeleton,
                "import_as_skeletal": True,
                "import_mesh": False,
                "import_animations": True,
                "import_materials": False,
                "import_textures": False,
            })
            options.anim_sequence_import_data.set_editor_properties({
                "convert_scene": True,
                "convert_scene_unit": True,
                "force_front_x_axis": True,
            })
            self.import_one(sources / f"{name}.fbx", CHARACTER_DIR, unreal.AnimSequence, options, unreal.FbxFactory())
        require(self.assets.save_loaded_asset(skeleton, only_if_is_dirty=False), "Sauvegarde du squelette d’Aliénor impossible.")

    def import_audio(self):
        for name in AUDIO_FILES:
            self.import_one(GENERATED / "Audio" / f"{name}.wav", AUDIO_DIR, unreal.SoundWave)

    def import_static_mesh(self, source):
        if source in self.static_meshes:
            return self.static_meshes[source]
        path = REPOSITORY / source
        require(path.is_file(), f"Décor Meshy absent : {path}.")
        name = re.sub(r"[^a-zA-Z0-9_]", "_", path.stem)
        directory = f"{CONTENT}/Decors/{name}"
        task = unreal.AssetImportTask()
        task.set_editor_properties({
            "filename": str(path),
            "destination_path": directory,
            "automated": True,
            "replace_existing": True,
            "save": False,
        })
        self.tools.import_asset_tasks([task])
        meshes = [asset for asset in task.get_objects() if isinstance(asset, unreal.StaticMesh)]
        require(len(meshes) == 1, f"Le GLB {source} doit fournir un maillage statique. Reçu : {len(meshes)}.")
        mesh = meshes[0]
        require(self.assets.save_loaded_asset(mesh, only_if_is_dirty=False), f"Écriture impossible pour {source}.")
        self.static_meshes[source] = mesh
        return mesh

    def material(self, name, color=None, roughness=0.84):
        if name in self.materials:
            return self.materials[name]
        directory = f"{CONTENT}/Materiaux"
        package = f"{directory}/{name}"
        material = self.assets.load_asset(package) if self.assets.does_asset_exist(package) else None
        if not material:
            material = self.tools.create_asset(name, directory, unreal.Material, unreal.MaterialFactoryNew())
            require(material, f"Création impossible : {package}.")
            library = unreal.MaterialEditingLibrary
            if color is None:
                diffuse = library.create_material_expression(material, unreal.MaterialExpressionVertexColor, -360, 0)
            else:
                diffuse = library.create_material_expression(material, unreal.MaterialExpressionConstant3Vector, -360, 0)
                diffuse.set_editor_property("constant", unreal.LinearColor(*color, 1.0))
            matte = library.create_material_expression(material, unreal.MaterialExpressionConstant, -300, 130)
            matte.set_editor_property("r", roughness)
            require(library.connect_material_property(diffuse, "", unreal.MaterialProperty.MP_BASE_COLOR),
                    f"Couleur de base non raccordée : {package}.")
            require(library.connect_material_property(matte, "", unreal.MaterialProperty.MP_ROUGHNESS),
                    f"Rugosité non raccordée : {package}.")
            if color is None:
                material.set_editor_property("two_sided", True)
            library.recompile_material(material)
            require(self.assets.save_loaded_asset(material, only_if_is_dirty=False), f"Écriture impossible : {package}.")
        self.materials[name] = material
        return material

    def terrain(self, data, waypoints):
        package = f"{CONTENT}/Decors/SM_Relief_Atlas"
        # Les coordonnées du fichier sont déjà en centimètres et dans le repère moteur.
        vertices, faces = read_terrain(GENERATED / data["file"])
        segments = []
        positions = [xyz(p["position"]) for p in waypoints]
        for (ax, ay, _), (bx, by, _) in zip(positions, positions[1:]):
            dx, dy = bx - ax, by - ay
            segments.append((ax, ay, dx, dy, max(1, dx * dx + dy * dy)))
        normals = [[0.0, 0.0, 0.0] for _ in vertices]
        for a, b, c in faces:
            ax, ay, az = vertices[a]
            bx, by, bz = vertices[b]
            cx, cy, cz = vertices[c]
            ux, uy, uz = bx - ax, by - ay, bz - az
            vx, vy, vz = cx - ax, cy - ay, cz - az
            normal = (uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx)
            direction = -1.0 if normal[2] < 0 else 1.0
            for i in (a, b, c):
                for axis, value in enumerate(normal):
                    normals[i][axis] += value * direction
        normalized = []
        colors = []
        for (x, y, _), normal in zip(vertices, normals):
            magnitude = math.sqrt(sum(c * c for c in normal))
            unit = (c / magnitude for c in normal) if magnitude > 1e-9 else (0, 0, 1)
            normalized.append(unreal.Vector(*unit))
            variation = math.sin(x * 0.018) * math.cos(y * 0.015) * 0.018
            if distance_squared_to_road(x, y, segments) < 275 ** 2:
                rgb = (0.37, 0.30, 0.22)
            else:
                rgb = (0.26, 0.29, 0.16)
            colors.append(unreal.LinearColor(*(v + variation for v in rgb), 1.0))
        buffers = unreal.GeometryScriptSimpleMeshBuffers()
        buffers.set_editor_properties({
            "vertices": [vector(v) for v in vertices],
            "triangles": [unreal.IntVector(*face) for face in faces],
            "normals": normalized,
            "uv0": [unreal.Vector2D(x / 200, y / 200) for x, y, _ in vertices],
            "vertex_colors": colors,
        })
        dynamic = unreal.DynamicMesh()
        unreal.GeometryScript_MeshEdits.append_buffers_to_mesh(dynamic, buffers)
        if self.assets.does_asset_exist(package):
            mesh = self.assets.load_asset(package)
            options = unreal.GeometryScriptCopyMeshToAssetOptions()
            options.set_editor_properties({"enable_recompute_normals": False, "enable_recompute_tangents": True})
            _, outcome = unreal.GeometryScript_AssetUtils.copy_mesh_to_static_mesh(
                dynamic, mesh, options, unreal.GeometryScriptMeshWriteLOD()
            )
        else:
            options = unreal.GeometryScriptCreateNewStaticMeshAssetOptions()
            options.set_editor_properties({
                "enable_collision": True,
                "collision_mode": unreal.CollisionTraceFlag.CTF_USE_COMPLEX_AS_SIMPLE,
                "enable_recompute_normals": False,
                "enable_recompute_tangents": True,
            })
            mesh, outcome = unreal.GeometryScript_NewAssetUtils.create_new_static_mesh_asset_from_mesh(dynamic, package, options)
        require(mesh and outcome == unreal.GeometryScriptOutcomePins.SUCCESS, "Création du relief de l’atlas impossible.")
        body = mesh.get_editor_property("body_setup")
        require(body, "Relief sans géométrie de collision.")
        body.set_editor_properties({
            "collision_trace_flag": unreal.CollisionTraceFlag.CTF_USE_COMPLEX_AS_SIMPLE,
            "double_sided_geometry": True,
        })
        mesh.set_material(0, self.material("M_Relief"))
        require(self.assets.save_loaded_asset(mesh, only_if_is_dirty=False), "Sauvegarde du relief impossible.")
        actor = self.mesh_actor("Relief de l’atlas", mesh, xyz(data["position"]))
        actor.static_mesh_component.set_material(0, self.material("M_Relief"))
        return actor

    def open_map(self):
        directory = LEVEL.rsplit("/", 1)[0]
        if not self.assets.does_directory_exist(directory):
            require(self.assets.make_directory(directory), f"Création impossible : {directory}.")
        if self.assets.does_asset_exist(LEVEL):
            require(self.levels.load_level(LEVEL), f"Chargement impossible : {LEVEL}.")
        else:
            require(self.levels.new_level(LEVEL), f"Création impossible : {LEVEL}.")
        for actor in self.actors.get_all_level_actors():
            if actor.actor_has_tag(GENERATED_TAG):
                require(self.actors.destroy_actor(actor), f"Impossible de régénérer {actor.get_actor_label()}.")

    def spawn(self, cls, title, position, heading=0, pitch=0, tag=None):
        actor = self.actors.spawn_actor_from_class(cls, vector(position), yaw_rotation(heading, pitch))
        require(actor, f"Impossible de placer {title}.")
        actor.set_actor_label(title)
        actor.set_editor_property("tags", [GENERATED_TAG, tag] if tag else [GENERATED_TAG])
        return actor

    def mesh_actor(self, title, mesh, position, heading=0, dimensions=None, material=None, collision=True):
        actor = self.spawn(unreal.StaticMeshActor, title, position, heading)
        component = actor.static_mesh_component
        component.set_static_mesh(mesh)
        if dimensions:
            actor.set_actor_scale3d(vector(dimensions))
        if material:
            component.set_material(0, material)
        component.set_collision_profile_name("BlockAll" if collision else "NoCollision")
        return actor

    def box(self, title, position, size, material, heading=0, collision=True):
        return self.mesh_actor(title, self.cube, position, heading, tuple(v / 100 for v in size), material, collision)

    def anchor(self, name, position, heading=0):
        return self.spawn(unreal.TargetPoint, name, position, heading, tag=name)

    def site(self, site, portal=None):
        position, size = xyz(site["position"]), xyz(site["size"])
        require(all(d > 0 for d in size), f"Emprise invalide : {site['id']}.")
        x, y, z = position
        title = site["label"]
        if site.get("surface") == "hall":
            timber = self.material("M_Chene", (0.20, 0.11, 0.055))
            for sx in (-1, 1):
                for sy in (-1, 1):
                    self.box(f"{title} · poteau", (x + sx * size[0] * .45, y + sy * size[1] * .43, z + size[2] / 2),
                             (42, 42, size[2]), timber)
            return self.box(f"{title} · couverture", (x, y, z + size[2]), (size[0], size[1], 26), timber)
        if not site["asset"]:
            return self.box(title, (x, y, z + size[2] / 2), size, self.material("M_Enduit", (0.50, 0.44, 0.32)))
        mesh = self.static_meshes[site["asset"]]
        bounds = mesh.get_bounding_box()
        yaw = float(site["yaw"])
        cosine, sine = math.cos(math.radians(yaw)), math.sin(math.radians(yaw))
        dx, dy, dz = (bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y, bounds.max.z - bounds.min.z)
        width = abs(cosine) * dx + abs(sine) * dy
        depth = abs(sine) * dx + abs(cosine) * dy
        require(min(width, depth, dz) > 0, f"Boîte du GLB invalide : {site['asset']}.")
        if abs(sine) < .001:
            scale = (size[0] / dx, size[1] / dy, size[2] / dz)
        elif abs(cosine) < .001:
            scale = (size[1] / dx, size[0] / dy, size[2] / dz)
        else:
            fitted = min(size[0] / width, size[1] / depth, size[2] / dz)
            scale = (fitted, fitted, fitted)
        bx = (bounds.min.x + bounds.max.x) * scale[0] / 2
        by = (bounds.min.y + bounds.max.y) * scale[1] / 2
        mesh_position = (x - cosine * bx + sine * by, y - sine * bx - cosine * by, z - bounds.min.z * scale[2])
        relief = max(0, xyz(portal["threshold"])[2] - z) if portal else 0
        if relief > 1:
            base = self.material("M_Pierre", (0.51, 0.43, 0.31))
            self.box(f"Assise · {title}", (x, y, z + relief / 2), (size[0], size[1], relief), base, collision=False)
        mesh_position = (mesh_position[0], mesh_position[1], mesh_position[2] + relief)
        self.mesh_actor(title, mesh, mesh_position, yaw, scale, collision=False)
        collision_height = size[2] + relief
        collider = self.box(f"Collision · {title}", (x, y, z + collision_height / 2),
                            (size[0], size[1], collision_height), None)
        collider.set_actor_hidden_in_game(True)
        return collider

    def workshop(self, outside):
        # Une pièce distincte de la ville conserve le seuil extérieur pour la sortie.
        ox, oy, _ = xyz(outside["position"])
        x, y, z = ox + 60000, oy, 5000
        timber = self.material("M_Chene", (0.20, 0.11, 0.055))
        stone = self.material("M_Pierre", (0.51, 0.43, 0.31))
        plaster = self.material("M_Enduit", (0.50, 0.44, 0.32))
        iron = self.material("M_Fer", (0.09, 0.095, 0.087), 0.60)
        paper = self.material("M_Papier", (0.77, 0.69, 0.50))

        def piece(name, delta, size, material, collision=True):
            return self.box(name, tuple(origin + offset for origin, offset in zip((x, y, z), delta)), size, material, collision=collision)

        piece("Atelier · sol en chêne", (0, 0, -12), (940, 680, 24), timber)
        piece("Atelier · plafond en chêne", (0, 0, 303), (940, 680, 26), timber)
        piece("Atelier · mur oriental", (450, 0, 146), (30, 680, 292), plaster)
        piece("Atelier · mur septentrional", (0, -326, 146), (940, 28, 292), plaster)
        piece("Atelier · mur méridional", (0, 326, 146), (940, 28, 292), plaster)
        piece("Atelier · mur occidental", (-450, 0, 146), (30, 680, 292), plaster)
        piece("Atelier · porte intérieure", (-430, 0, 106), (14, 117, 212), timber, collision=False)
        piece("Atelier · seuil", (-418, 0, 3), (50, 143, 6), stone)
        for side in (-1, 1):
            piece("Presse · montant", (132, 82 * side, 104), (19, 21, 208), timber)
            piece("Presse · patin", (124, 82 * side, 12), (100, 28, 24), timber)
        piece("Presse · traverse", (132, 0, 206), (57, 183, 19), timber)
        piece("Presse · vis", (132, 0, 158), (13, 13, 85), iron, False)
        piece("Presse · levier", (132, 51, 167), (12, 114, 11), timber, False)
        piece("Presse · platine", (132, 0, 118), (87, 128, 14), timber)
        piece("Presse · marbre", (108, 0, 82), (117, 135, 13), stone)
        piece("Presse · feuille", (90, 0, 91), (37, 48, 2), paper, False)
        piece("Atelier · table", (235, -211, 68), (168, 70, 136), timber)
        piece("Atelier · rames de papier", (243, -211, 142), (70, 51, 12), paper, False)

        self.anchor("AtelierInterieur", (x - 260, y, z), 0)
        self.anchor("AtelierSortie", (x - 377, y, z), 180)
        anselme = (x + 37, y + 134, z)
        self.anchor("Anselme", anselme, 210)
        self.silhouette_anselme(anselme)
        lamp = self.spawn(unreal.PointLight, "Atelier · lumière chaude", (x + 165, y - 115, z + 245))
        illumination = lamp.get_component_by_class(unreal.PointLightComponent)
        illumination.set_editor_properties({
            "intensity": 950.0,
            "attenuation_radius": 800.0,
            "light_color": unreal.Color(255, 220, 170, 255),
        })

    def silhouette_anselme(self, position):
        sphere = unreal.load_asset("/Engine/BasicShapes/Sphere.Sphere")
        require(sphere, "Sphère de base Unreal indisponible.")
        drap = self.material("M_Drap_Anselme", (0.13, 0.12, 0.085))
        peau = self.material("M_Peau_Anselme", (0.49, 0.31, 0.19))
        chaperon = self.material("M_Chaperon_Anselme", (0.24, 0.10, 0.062))
        x, y, z = position
        self.mesh_actor("Anselme · tête", sphere, (x, y, z + 148), dimensions=(.30, .32, .37), material=peau, collision=False)
        self.mesh_actor("Anselme · bonnet", sphere, (x - 4, y, z + 168), dimensions=(.37, .41, .18), material=chaperon, collision=False)
        self.mesh_actor("Anselme · pourpoint", sphere, (x, y, z + 102), dimensions=(.40, .52, .69), material=drap, collision=False)
        for side in (-1, 1):
            self.box("Anselme · chausses", (x, y + 13 * side, z + 37), (22, 18, 74), drap, collision=False)
            self.box("Anselme · bras", (x + 1, y + 23 * side, z + 104), (18, 15, 54), drap, collision=False)

    def mark_press_door(self, portal):
        x, y, z = xyz(portal["threshold"])
        heading = float(portal["yaw"])
        angle = math.radians(heading)
        timber = self.material("M_Chene", (0.20, 0.11, 0.055))
        self.box("Imprimerie · porte", (x + 8 * math.cos(angle), y + 8 * math.sin(angle), z + 106),
                 (11, 116, 212), timber, heading, collision=False)

    def lights(self):
        sun = self.spawn(unreal.DirectionalLight, "Soleil · matin", (0, 0, 2000), -38, -32)
        light = sun.get_component_by_class(unreal.DirectionalLightComponent)
        light.set_editor_properties({
            "intensity": 4.0,
            "light_color": unreal.Color(255, 231, 203, 255),
            "atmosphere_sun_light": True,
        })
        self.spawn(unreal.SkyAtmosphere, "Atmosphère de Sarlande", (0, 0, 0))
        sky = self.spawn(unreal.SkyLight, "Lumière du ciel", (0, 0, 1800))
        fill = sky.get_component_by_class(unreal.SkyLightComponent)
        fill.set_editor_property("mobility", unreal.ComponentMobility.MOVABLE)
        fill.set_real_time_capture(True)
        fill.set_intensity(0.65)


def main():
    if RECEIPT.exists():
        RECEIPT.unlink()
    route = load_route()
    prototype = Prototype()
    prototype.open_map()
    world = unreal.get_editor_subsystem(unreal.UnrealEditorSubsystem).get_editor_world()
    game_mode = unreal.load_class(None, "/Script/ContrunPrototype.ContrunGameMode", unreal.GameModeBase)
    require(game_mode, "Classe de jeu du prototype introuvable.")
    world.get_world_settings().set_editor_property("default_game_mode", game_mode)
    unreal.SystemLibrary.execute_console_command(world, "Interchange.FeatureFlags.Import.FBX 0")
    prototype.import_character()
    prototype.import_audio()
    for site in route["sites"]:
        if site["asset"]:
            prototype.import_static_mesh(site["asset"])
    prototype.terrain(route["terrain"], route["waypoints"])
    entrances = {"maison": route["portals"]["house"], "presse": route["portals"]["press"]}
    for site in route["sites"]:
        prototype.site(site, entrances.get(site["id"]))
    start = route["spawn"]
    begin = xyz(start["position"])
    prototype.anchor("AtlasStart", begin, start["yaw"])
    prototype.spawn(unreal.PlayerStart, "Départ joueur", (begin[0], begin[1], begin[2] + 100), start["yaw"])
    press = route["portals"]["press"]
    prototype.anchor("AtelierEntree", xyz(press["position"]), press["yaw"])
    prototype.mark_press_door(press)
    prototype.workshop(press)
    prototype.lights()
    require(prototype.levels.save_current_level(), f"Sauvegarde impossible : {LEVEL}.")
    require(unreal.EditorLoadingAndSavingUtils.save_dirty_packages(True, True), "Échec de sauvegarde des dépendances.")
    RECEIPT.write_text(json.dumps({"level": LEVEL, "imports": prototype.imported}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    unreal.log(f"Carte du prototype enregistrée : {LEVEL}")


if __name__ == "__main__":
    main()

/* La pose de jeu pilote le modèle Meshy, y compris dans les scènes dirigées. */
const AnimationAlienor = (() => {
  "use strict";

  const EXPRESSIONS = ["Sourire", "Inquietude"];
  const COTES = ["G", "D"];
  const up = new THREE.Vector3(0, 1, 0);

  function teinterRobe(mesh) {
    const indigo = { value: 0 };
    const material = mesh.material;
    const compile = material.onBeforeCompile;
    material.onBeforeCompile = function (shader, renderer) {
      compile.call(this, shader, renderer);
      shader.uniforms.alienorIndigo = indigo;
      shader.vertexShader = "varying vec3 vAlienorTissu;\n" + shader.vertexShader.replace(
        "#include <begin_vertex>", "#include <begin_vertex>\nvAlienorTissu = position;");
      shader.fragmentShader = "uniform float alienorIndigo;\nvarying vec3 vAlienorTissu;\n" +
        shader.fragmentShader.replace("#include <map_fragment>", `#include <map_fragment>
        float y = vAlienorTissu.y;
        float x = abs(vAlienorTissu.x);
        vec3 tissu = diffuseColor.rgb;
        float jupe = (1.0 - smoothstep(-0.22, -0.09, y)) * smoothstep(-0.84, -0.70, y);
        float corsage = smoothstep(0.25, 0.34, y) * (1.0 - smoothstep(0.58, 0.66, y));
        corsage *= max(smoothstep(0.08, 0.15, x), 1.0 - smoothstep(0.48, 0.54, y));
        float rouge = max(0.001, tissu.r - tissu.g);
        float ocre = smoothstep(0.35, 0.53, rouge / max(0.015, tissu.r))
          * (1.0 - smoothstep(0.57, 0.82, (tissu.g - tissu.b) / rouge))
          * smoothstep(0.015, 0.035, rouge);
        float lumiere = dot(tissu, vec3(0.299, 0.587, 0.114));
        vec3 bleu = vec3(0.18, 0.38, 0.88) * lumiere;
        diffuseColor.rgb = mix(tissu, bleu, alienorIndigo * max(jupe, corsage) * ocre);`);
    };
    material.customProgramCacheKey = () => "robe-alienor-meshy";
    material.needsUpdate = true;
    return indigo;
  }

  function creer(joueur, chargeur, actif = true) {
    const u = joueur.userData;
    const sources = {
      Buste: u.body, Tete: u.head,
      BrasG: u.arms[0].userData.splay, BrasD: u.arms[1].userData.splay,
      AvantBrasG: u.elbows[0], AvantBrasD: u.elbows[1]
    };
    const articulations = Object.entries(sources);
    const qJoueur = new THREE.Quaternion();
    const inverseJoueur = new THREE.Quaternion();
    const q = new THREE.Quaternion();
    const delta = new THREE.Quaternion();
    const inverseParent = new THREE.Quaternion();
    const v = new THREE.Vector3();
    const vecteur = new THREE.Vector3();
    const hanche = new THREE.Vector3();
    const genou = new THREE.Vector3();
    const cheville = new THREE.Vector3();
    const cible = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const pole = new THREE.Vector3();
    const model = new THREE.Group();
    model.name = "Aliénor Meshy";
    model.visible = false;
    const accessoires = new Map();
    let rig = null;
    let expression = "";

    joueur.getWorldQuaternion(inverseJoueur).invert();
    const poseInitiale = Object.fromEntries(articulations.map(([name, source]) => {
      const orientation = source.getWorldQuaternion(new THREE.Quaternion());
      return [name, orientation.premultiply(inverseJoueur).invert()];
    }));

    function orientation(binding, relative) {
      binding.os.parent.getWorldQuaternion(inverseParent).invert();
      binding.os.quaternion.copy(inverseParent).multiply(qJoueur).multiply(relative);
    }

    function transferer(binding, source, base) {
      source.getWorldQuaternion(q).premultiply(inverseJoueur).multiply(base).multiply(binding.repos);
      orientation(binding, q);
    }

    function viser(binding, axe) {
      delta.setFromUnitVectors(binding.axe, axe.normalize());
      orientation(binding, delta.multiply(binding.repos));
    }

    function position(os, target) {
      return joueur.worldToLocal(os.getWorldPosition(target));
    }

    function pied(jambe, i) {
      const { cuisse, tibia, botte, repos, a, b } = jambe;
      const piedAnime = u.feet[i];
      // Le mannequin du jeu calcule déjà l’alternance entre appui et phase aérienne.
      cible.set(repos.x, repos.y + piedAnime[1], repos.z + piedAnime[2] * 0.78);
      if (u.sit) cible.set(repos.x, repos.y, repos.z + 0.25);
      position(cuisse.os, hanche);
      direction.subVectors(cible, hanche);
      const portee = THREE.MathUtils.clamp(direction.length(), Math.abs(a - b) + .001, a + b - .0001);
      direction.normalize();
      const projection = (a * a + portee * portee - b * b) / (2 * portee);
      const hauteur = Math.sqrt(Math.max(0, a * a - projection * projection));
      pole.set(0, 0, 1).addScaledVector(direction, -direction.z).normalize();
      genou.copy(hanche).addScaledVector(direction, projection).addScaledVector(pole, hauteur);
      cheville.copy(hanche).addScaledVector(direction, portee);
      viser(cuisse, vecteur.subVectors(genou, hanche));
      viser(tibia, vecteur.subVectors(cheville, genou));
      q.copy(u.legs[i].quaternion).multiply(botte.repos);
      orientation(botte, q);
    }

    function suivreAccessoire(cle, source, fixation, hauteur = 0, profondeur = 0) {
      if (!source) return;
      let clone = accessoires.get(cle);
      if (!clone) {
        clone = source.clone(true);
        clone.name = "Aliénor · " + cle;
        model.add(clone);
        accessoires.set(cle, clone);
      }
      clone.visible = source.visible;
      if (!clone.visible) return;
      source.getWorldPosition(v);
      joueur.worldToLocal(v);
      clone.position.copy(v);
      clone.position.y += hauteur;
      clone.position.z += profondeur;
      clone.quaternion.copy(source.getWorldQuaternion(q).premultiply(inverseJoueur));
      clone.scale.copy(source.scale);
      if (fixation) fixation(source, clone);
    }

    function image(dt, { mode, heure, tenue, masque, sac, encre, derriereMur }) {
      if (!rig) return;
      const visible = mode !== "title" && mode !== "plate";
      model.visible = visible;
      u.body.visible = !visible;
      for (const leg of u.legs) leg.visible = !visible;
      if (!visible) return;

      joueur.getWorldQuaternion(qJoueur);
      inverseJoueur.copy(qJoueur).invert();
      rig.hanches.position.copy(rig.hanchesRepos);
      rig.hanches.position.x += u.body.position.x / rig.echelle;
      const respiration = Math.sin(heure * 2.2) * .004 * (1 - u.amp);
      rig.hanches.position.y += (u.body.position.y + respiration) / rig.echelle;
      for (const [name, source] of articulations) {
        transferer(rig.os[name], source, poseInitiale[name]);
      }
      for (let i = 0; i < COTES.length; i++) pied(rig.jambes[i], i);
      rig.indigo.value = tenue === "indigo" ? 1 : 0;
      for (const [name, index] of rig.expressions) {
        const cible = mode === "dialog" && expression === name ? 1 : 0;
        rig.skin.morphTargetInfluences[index] = THREE.MathUtils.damp(
          rig.skin.morphTargetInfluences[index], cible, 10, dt);
      }
      // La pose est lue après la scène dirigée et l’animation de dialogue.
      suivreAccessoire("sac", sac, (source, clone) => {
        clone.children[0].children[0].rotation.copy(u.sackPivot.rotation);
      });
      suivreAccessoire("masque", masque, null, -.08, .025);
      suivreAccessoire("encre", encre, null, 0, .026);
      rig.silhouette.visible = derriereMur;
      if (rig.silhouette.visible) rig.silhouette.morphTargetInfluences = rig.skin.morphTargetInfluences;
    }

    function installer({ scene: asset }) {
      const box = new THREE.Box3().setFromObject(asset);
      const height = box.max.y - box.min.y;
      if (!Number.isFinite(height) || height <= 0) throw new Error("Dimensions invalides");
      const echelle = 1.68 / height;
      const center = box.getCenter(new THREE.Vector3());
      asset.scale.multiplyScalar(echelle);
      asset.position.set(-center.x * echelle, -box.min.y * echelle, -center.z * echelle);
      let skin;
      asset.traverse(obj => {
        if (!obj.isMesh) return;
        obj.castShadow = true;
        obj.receiveShadow = false;
        if (obj.isSkinnedMesh) skin = obj;
      });
      const expressions = EXPRESSIONS.map(name => [name, skin?.morphTargetDictionary?.[name]]);
      if (!skin || expressions.some(([, index]) => index === undefined)) {
        throw new Error("Maillage ou expressions manquants");
      }
      skin.frustumCulled = false;

      asset.updateMatrixWorld(true);
      const noms = Object.keys(sources).concat(COTES.flatMap(c => ["Cuisse" + c, "Jambe" + c, "Pied" + c]));
      const os = Object.fromEntries(noms.map(name => {
        const os = asset.getObjectByName(name);
        if (!os?.isBone) throw new Error("Os manquant · " + name);
        const repos = os.getWorldQuaternion(new THREE.Quaternion());
        return [name, { os, repos, axe: up.clone().applyQuaternion(repos) }];
      }));
      const jambes = COTES.map(cote => {
        const cuisse = os["Cuisse" + cote], tibia = os["Jambe" + cote], botte = os["Pied" + cote];
        const haut = cuisse.os.getWorldPosition(new THREE.Vector3());
        const milieu = tibia.os.getWorldPosition(new THREE.Vector3());
        const repos = botte.os.getWorldPosition(new THREE.Vector3());
        return { cuisse, tibia, botte, repos, a: haut.distanceTo(milieu), b: milieu.distanceTo(repos) };
      });
      const hanches = asset.getObjectByName("Hanches");
      if (!hanches?.isBone) throw new Error("Hanches manquantes");

      const silhouette = skin.clone();
      silhouette.material = new THREE.MeshBasicMaterial({
        color: 0xf2b27a, skinning: true, morphTargets: true,
        depthFunc: THREE.GreaterDepth, depthWrite: false, fog: false
      });
      silhouette.bind(skin.skeleton, skin.bindMatrix);
      silhouette.castShadow = silhouette.receiveShadow = false;
      silhouette.visible = false;
      silhouette.renderOrder = 1;
      skin.renderOrder = 2;
      skin.parent.add(silhouette);
      rig = { skin, os, expressions, jambes, hanches, hanchesRepos: hanches.position.clone(),
        echelle, indigo: teinterRobe(skin), silhouette };
      model.add(asset);
      joueur.add(model);
      return rig;
    }

    if (actif) chargeur().then(loader => loader.loadAsync("modeles/personnages/alienor_meshy.glb"))
      .then(installer).catch(error => console.error("Chargement d’Aliénor Meshy", error));

    return { image, expression(nom) { expression = nom; } };
  }

  return { creer };
})();

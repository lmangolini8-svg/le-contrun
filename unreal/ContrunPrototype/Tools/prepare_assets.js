'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const project = path.resolve(__dirname, '..');
const repository = path.resolve(project, '..', '..');
const audioDirectory = path.join(project, 'Generated', 'Audio');
const [blender = 'blender', ffmpeg = 'ffmpeg'] = process.argv.slice(2);

function run(program, args) {
  const result = spawnSync(program, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${program} a échoué (${result.signal || result.status}).`);
  }
}

try {
  run(process.execPath, [path.join(__dirname, 'export_atlas.js')]);
  run(blender, ['-b', '--factory-startup', '--python-exit-code', '1', '--python',
    path.join(__dirname, 'export_alienor.py')]);

  fs.mkdirSync(audioDirectory, { recursive: true });
  const audio = [
    ['amb-ruelle', 'Amb_Ruelle'],
    ['amb-atelier', 'Amb_Atelier'],
    ['porte', 'SFX_Porte'],
    ['presse', 'SFX_Presse'],
  ];
  for (const [source, target] of audio) {
    run(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i',
      path.join(repository, 'son', `${source}.mp3`), '-vn', '-ar', '44100',
      '-c:a', 'pcm_s16le', path.join(audioDirectory, `${target}.wav`)]);
  }
  console.log(`Ressources préparées dans ${path.join(project, 'Generated')}`);
} catch (error) {
  console.error(`Préparation UE5 interrompue. ${error.message}`);
  process.exitCode = 1;
}

[CmdletBinding()]
param(
    [string]$EngineRoot,
    [string]$BlenderExe = 'blender',
    [string]$FfmpegExe = 'ffmpeg',
    [string]$OutputDir,
    [switch]$PrepareOnly,
    [switch]$GenerateOnly
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Invoke-Checked {
    param([string]$Program, [string[]]$Arguments)

    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Echec de $Program (code $LASTEXITCODE)."
    }
}

function Require-File {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Fichier attendu introuvable. $Path"
    }
}

$projectDir = Split-Path -Parent $PSScriptRoot
$project = Join-Path $projectDir 'ContrunPrototype.uproject'
$builder = Join-Path $projectDir 'Content/Python/build_prototype.py'
$prepare = Join-Path $PSScriptRoot 'prepare_assets.js'
$map = '/Game/Sarlande/Cartes/ClosImprimerie'

if (-not $PrepareOnly) {
    if (-not $EngineRoot) {
        $EngineRoot = Join-Path $env:ProgramFiles 'Epic Games/UE_5.7'
    }
    $EngineRoot = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($EngineRoot)
    $build = Join-Path $EngineRoot 'Engine/Build/BatchFiles/Build.bat'
    $editor = Join-Path $EngineRoot 'Engine/Binaries/Win64/UnrealEditor-Cmd.exe'
    Require-File $build
    Require-File $editor
    if (-not $GenerateOnly) {
        $uat = Join-Path $EngineRoot 'Engine/Build/BatchFiles/RunUAT.bat'
        Require-File $uat
    }
    Require-File $builder
}

$node = (Get-Command 'node' -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
$blender = (Get-Command $BlenderExe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
$ffmpeg = (Get-Command $FfmpegExe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
Invoke-Checked $node @($prepare, $blender, $ffmpeg)
if ($PrepareOnly) { return }

Invoke-Checked $build @('ContrunPrototypeEditor', 'Win64', 'Development', "-Project=$project", '-WaitMutex', '-NoHotReloadFromIDE')

$receipt = Join-Path $projectDir 'Generated/prototype.ready'
if (Test-Path -LiteralPath $receipt) { Remove-Item -LiteralPath $receipt -Force }
Invoke-Checked $editor @($project, "-ExecutePythonScript=$builder", '-Unattended', '-NoSplash', '-NoP4')
Require-File $receipt
$mapFile = Join-Path $projectDir 'Content/Sarlande/Cartes/ClosImprimerie.umap'
Require-File $mapFile
if ($GenerateOnly) {
    Write-Host "Carte Unreal generee : $mapFile"
    return
}

if (-not $OutputDir) { $OutputDir = Join-Path $projectDir 'Build/Windows' }
$OutputDir = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputDir)
$archive = Join-Path $OutputDir (Get-Date -Format 'yyyyMMdd-HHmmss-fff')

Invoke-Checked $uat @('BuildCookRun', "-project=$project", '-platform=Win64', '-clientconfig=Development',
    '-build', '-cook', "-map=$map", '-stage', '-pak', '-package', '-archive', "-archivedirectory=$archive",
    '-prereqs', '-unattended', '-NoP4', '-utf8output')

$packages = Get-ChildItem -LiteralPath $archive -Filter '*.pak' -File -Recurse
$game = Get-ChildItem -LiteralPath $archive -Filter 'ContrunPrototype.exe' -File -Recurse |
    Sort-Object { $_.FullName.Length } | Select-Object -First 1
if (-not $game -or -not $packages) {
    throw "Export incomplet dans $archive. Controlez le journal Unreal Automation Tool."
}
Write-Host "Jeu Windows : $($game.FullName)"

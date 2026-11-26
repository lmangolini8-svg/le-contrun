[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$EngineRoot,
    [string]$StageDir,
    [string]$OutputDir
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Require-File {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Fichier attendu introuvable : $Path"
    }
}

function Resolve-FullPath {
    param([string]$Path)
    return $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Path)
}

function Assert-EmptyDirectory {
    param([string]$Path)
    if (Test-Path -LiteralPath $Path) {
        if (-not (Test-Path -LiteralPath $Path -PathType Container) -or
            @(Get-ChildItem -LiteralPath $Path -Force).Count -ne 0) {
            throw "Choisissez un dossier neuf ou vide : $Path"
        }
    }
}

function Test-SameTree {
    param([string]$Parent, [string]$Child)
    $separator = [IO.Path]::DirectorySeparatorChar
    $separators = [char[]]@($separator, [IO.Path]::AltDirectorySeparatorChar)
    $parentBase = $Parent.TrimEnd($separators)
    $childBase = $Child.TrimEnd($separators)
    $comparison = [StringComparison]::OrdinalIgnoreCase
    return $childBase.Equals($parentBase, $comparison) -or
        $childBase.StartsWith("$parentBase$separator", $comparison)
}

$projectDir = Split-Path -Parent $PSScriptRoot
$moduleName = 'ContrunPrototype'
$moduleSource = Join-Path $projectDir "Source/$moduleName"
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'

if (-not $StageDir) { $StageDir = Join-Path $projectDir "Generated/PluginStage/$stamp/$moduleName" }
if (-not $OutputDir) { $OutputDir = Join-Path $projectDir "Build/Plugin/$stamp/$moduleName" }
$StageDir = Resolve-FullPath $StageDir
$OutputDir = Resolve-FullPath $OutputDir
$EngineRoot = Resolve-FullPath $EngineRoot

if ((Test-SameTree $StageDir $OutputDir) -or (Test-SameTree $OutputDir $StageDir)) {
    throw 'Le dossier de preparation et le paquet doivent etre distincts et non imbriques.'
}
if ((Test-SameTree $moduleSource $StageDir) -or (Test-SameTree $moduleSource $OutputDir) -or
    (Test-SameTree $EngineRoot $StageDir) -or (Test-SameTree $EngineRoot $OutputDir)) {
    throw 'Choisissez des dossiers de travail en dehors des sources du module et du moteur.'
}
Assert-EmptyDirectory $StageDir
Assert-EmptyDirectory $OutputDir

$engineBinaries = Join-Path $EngineRoot 'Engine/Binaries/Win64'
$uat = Join-Path $EngineRoot 'Engine/Build/BatchFiles/RunUAT.bat'
$versionFile = Join-Path $EngineRoot 'Engine/Build/Build.version'
Require-File $uat
Require-File $versionFile
Require-File (Join-Path $engineBinaries 'UnrealEditor.exe')
$version = Get-Content -LiteralPath $versionFile -Raw | ConvertFrom-Json
if ($version.MajorVersion -ne 5 -or $version.MinorVersion -ne 8) {
    throw "Ce transfert attend Unreal Engine 5.8. Moteur trouve : $($version.MajorVersion).$($version.MinorVersion)."
}

$entry = "Private/$moduleName.cpp"
$moduleEntry = Join-Path $moduleSource $entry
Require-File $moduleEntry
Require-File (Join-Path $moduleSource "$moduleName.Build.cs")
$primary = '(?m)^[ \t]*IMPLEMENT_PRIMARY_GAME_MODULE\(\s*FDefaultGameModuleImpl\s*,\s*ContrunPrototype\s*,\s*"ContrunPrototype"\s*\);[ \t]*\r?$'
$entryCode = Get-Content -LiteralPath $moduleEntry -Raw
if ([regex]::Matches($entryCode, $primary).Count -ne 1) {
    throw "Point d'entree du module source non reconnu : $moduleEntry"
}

$stageSource = Join-Path $StageDir 'Source'
[void][IO.Directory]::CreateDirectory($stageSource)
Copy-Item -LiteralPath $moduleSource -Destination $stageSource -Recurse
$pluginEntry = Join-Path $stageSource "$moduleName/$entry"
$pluginCode = [regex]::Replace($entryCode, $primary, 'IMPLEMENT_MODULE(FDefaultGameModuleImpl, ContrunPrototype);')
[IO.File]::WriteAllText($pluginEntry, $pluginCode)

# Preserver le nom du module : les classes des cartes gardent le chemin /Script/ContrunPrototype.
$descriptorPath = Join-Path $StageDir "$moduleName.uplugin"
$descriptor = [ordered]@{
    FileVersion = 3
    Version = 1
    VersionName = '1.0'
    FriendlyName = 'Contrun Prototype'
    Description = 'Module de jeu du prototype de Sarlande.'
    Category = 'Game'
    EnabledByDefault = $true
    CanContainContent = $false
    SupportedTargetPlatforms = @('Win64')
    Plugins = @([ordered]@{ Name = 'Interchange'; Enabled = $true })
    Modules = @(
        [ordered]@{
            Name = $moduleName
            Type = 'Runtime'
            LoadingPhase = 'Default'
            PlatformAllowList = @('Win64')
        }
    )
}
$json = $descriptor | ConvertTo-Json -Depth 6
[IO.File]::WriteAllText($descriptorPath, $json + [Environment]::NewLine)

$packageParent = Split-Path -Parent $OutputDir
[void][IO.Directory]::CreateDirectory($packageParent)
& $uat 'BuildPlugin' "-Plugin=$descriptorPath" "-Package=$OutputDir" '-TargetPlatforms=Win64' '-Unattended' '-NoP4' '-utf8output'
if ($LASTEXITCODE -ne 0) {
    throw "RunUAT BuildPlugin a echoue (code $LASTEXITCODE). Sources preparees : $StageDir"
}

$packageDescriptor = Join-Path $OutputDir "$moduleName.uplugin"
$packageBinaries = Join-Path $OutputDir 'Binaries/Win64'
$moduleManifest = Join-Path $packageBinaries 'UnrealEditor.modules'
$dllName = "UnrealEditor-$moduleName.dll"
$dll = Join-Path $packageBinaries $dllName
Require-File $packageDescriptor
Require-File $moduleManifest
Require-File $dll

$packaged = Get-Content -LiteralPath $packageDescriptor -Raw | ConvertFrom-Json
$runtimeModule = @($packaged.Modules | Where-Object { $_.Name -eq $moduleName -and $_.Type -eq 'Runtime' })
if ($runtimeModule.Count -ne 1) {
    throw "Le paquet n'annonce pas le module Runtime $moduleName."
}
$manifest = Get-Content -LiteralPath $moduleManifest -Raw | ConvertFrom-Json
$dllMapping = $manifest.Modules.PSObject.Properties[$moduleName]
if (-not $dllMapping -or $dllMapping.Value -ne $dllName -or
    (Get-Item -LiteralPath $dll).Length -eq 0) {
    throw "Le manifeste Win64 ne reference pas un binaire Editeur valide pour $moduleName."
}
$engineManifest = Join-Path $engineBinaries 'UnrealEditor.modules'
if (Test-Path -LiteralPath $engineManifest -PathType Leaf) {
    $installed = Get-Content -LiteralPath $engineManifest -Raw | ConvertFrom-Json
    if ($installed.BuildId -ne $manifest.BuildId) {
        throw "Le BuildId du module Editeur differe du moteur 5.8 selectionne : $moduleManifest"
    }
}

Write-Host "Plugin Win64 : $OutputDir"

[CmdletBinding()]
param(
    [Parameter(Mandatory)] [string]$ProjectFile,
    [string]$EngineRoot,
    [string]$BlenderExe = (Join-Path $env:ProgramFiles 'Blender Foundation/Blender 4.5/blender.exe'),
    [string]$FfmpegExe = 'ffmpeg'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Assert-ProjectClosed {
    $projectProcesses = Get-CimInstance -ClassName Win32_Process -Filter "Name = 'UnrealEditor.exe'"
    foreach ($process in $projectProcesses) {
        if ($process.CommandLine -and
            $process.CommandLine.IndexOf($projectName, [StringComparison]::OrdinalIgnoreCase) -ge 0) {
            throw "Enregistrez et fermez le projet $projectName dans Unreal Editor, puis relancez le transfert."
        }
    }
}

$project = Get-Item -LiteralPath $ProjectFile
if ($project.PSIsContainer -or $project.Extension -ne '.uproject') {
    throw "Selectionnez le fichier .uproject du projet de destination."
}
$projectName = $project.BaseName
$target = $project.DirectoryName
$prototype = Split-Path -Parent $PSScriptRoot
if ($target -eq $prototype) { throw 'Selectionnez le projet qui doit recevoir Sarlande.' }

$descriptor = Get-Content -LiteralPath $project.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
$descriptorHash = (Get-FileHash -LiteralPath $project.FullName).Hash
if (-not $EngineRoot) {
    $EngineRoot = Join-Path $env:ProgramFiles 'Epic Games/UE_5.8'
    $launcher = Join-Path $env:ProgramData 'Epic/UnrealEngineLauncher/LauncherInstalled.dat'
    if ((Test-Path -LiteralPath $launcher) -and -not (Test-Path -LiteralPath $EngineRoot)) {
        $installation = (Get-Content -LiteralPath $launcher -Raw -Encoding UTF8 | ConvertFrom-Json).InstallationList |
            Where-Object { $_.AppName -eq 'UE_5.8' } | Select-Object -First 1
        if ($installation) { $EngineRoot = $installation.InstallLocation }
    }
}
$engineVersionFile = Join-Path $EngineRoot 'Engine/Build/Build.version'
if (-not (Test-Path -LiteralPath $engineVersionFile -PathType Leaf)) {
    throw "Installation Unreal introuvable. Passez son dossier avec -EngineRoot. Dossier teste : $EngineRoot"
}
$version = Get-Content -LiteralPath $engineVersionFile -Raw | ConvertFrom-Json
$engineSeries = "$($version.MajorVersion).$($version.MinorVersion)"
$association = $descriptor.PSObject.Properties['EngineAssociation']
if ($association -and $association.Value -match '^\d+\.\d+$' -and $association.Value -ne $engineSeries) {
    throw "Le projet est associe a Unreal $($association.Value). Choisissez son installation avec -EngineRoot."
}
$enabledPlugins = $descriptor.PSObject.Properties['Plugins']
if (-not $enabledPlugins) {
    $descriptor | Add-Member -MemberType NoteProperty -Name Plugins -Value @()
}
$registration = @($descriptor.Plugins | Where-Object { $_.Name -eq 'ContrunPrototype' })
if ($registration.Count -gt 0 -and -not $registration[0].Enabled) {
    throw 'Le plugin ContrunPrototype est desactive explicitement dans le projet.'
}

$content = Join-Path $target 'Content'
$plugins = Join-Path $target 'Plugins'
$targetContent = Join-Path $content 'Sarlande'
$targetPlugin = Join-Path $plugins 'ContrunPrototype'
foreach ($path in @($targetContent, $targetPlugin)) {
    if (Test-Path -LiteralPath $path) { throw "Emplacement deja utilise. $path" }
}
if ((Test-Path -LiteralPath $plugins) -and
    (Get-ChildItem -LiteralPath $plugins -File -Recurse -Filter 'ContrunPrototype.uplugin' | Select-Object -First 1)) {
    throw 'Le projet contient deja un plugin ContrunPrototype.'
}
Assert-ProjectClosed

# Complete both builds before writing to the destination Content and Plugins directories.
& (Join-Path $PSScriptRoot 'Build-Windows.ps1') -EngineRoot $EngineRoot -BlenderExe $BlenderExe -FfmpegExe $FfmpegExe -GenerateOnly
$map = Join-Path $prototype 'Content/Sarlande/Cartes/ClosImprimerie.umap'
if (-not (Test-Path -LiteralPath $map -PathType Leaf)) { throw "Carte introuvable. $map" }

$id = [Guid]::NewGuid().ToString('N').Substring(0, 8)
$work = Join-Path ([IO.Path]::GetTempPath()) "LeContrun-$id"
$pluginOutput = Join-Path $work 'Package'
& (Join-Path $PSScriptRoot 'Build-ContrunPlugin.ps1') -EngineRoot $EngineRoot -StageDir (Join-Path $work 'Source') -OutputDir $pluginOutput

Assert-ProjectClosed
$staging = Join-Path $target ".TransfertSarlande-$id"
$stagedContent = Join-Path $staging 'Sarlande'
$stagedPlugin = Join-Path $staging 'ContrunPrototype'
New-Item -ItemType Directory -Path $staging | Out-Null
Copy-Item -LiteralPath (Join-Path $prototype 'Content/Sarlande') -Destination $stagedContent -Recurse
Copy-Item -LiteralPath $pluginOutput -Destination $stagedPlugin -Recurse

$copiedMap = Join-Path $stagedContent 'Cartes/ClosImprimerie.umap'
if (-not (Test-Path -LiteralPath $copiedMap -PathType Leaf) -or
    -not (Test-Path -LiteralPath (Join-Path $stagedPlugin 'ContrunPrototype.uplugin') -PathType Leaf)) {
    throw "Copie incomplete. Les fichiers temporaires se trouvent dans $staging."
}

if ((Get-FileHash -LiteralPath $project.FullName).Hash -ne $descriptorHash) {
    throw 'Le fichier de projet a change pendant la preparation. Relancez le transfert.'
}
$update = $registration.Count -eq 0
if ($update) {
    $stagedDescriptor = Join-Path $staging $project.Name
    $backup = Join-Path $target "$($project.Name).avant-sarlande-$id.bak"
    $descriptor.Plugins = @($descriptor.Plugins | Where-Object { $_ }) + @([ordered]@{
        Name = 'ContrunPrototype'
        Enabled = $true
    })
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($stagedDescriptor, ($descriptor | ConvertTo-Json -Depth 100), $utf8)
}

# Directory moves need to refuse overwriting even if another process imports during the build.
New-Item -ItemType Directory -Path $content, $plugins -Force | Out-Null
[IO.Directory]::Move($stagedPlugin, $targetPlugin)
$contentMoved = $false
try {
    [IO.Directory]::Move($stagedContent, $targetContent)
    $contentMoved = $true
    if ($update) { [IO.File]::Replace($stagedDescriptor, $project.FullName, $backup) }
} catch {
    if ($contentMoved) { [IO.Directory]::Move($targetContent, $stagedContent) }
    [IO.Directory]::Move($targetPlugin, $stagedPlugin)
    throw
}
[IO.Directory]::Delete($staging)
Remove-Item -LiteralPath $work -Recurse -Force

Write-Host "Projet : $($project.FullName)"
Write-Host 'Carte : /Game/Sarlande/Cartes/ClosImprimerie'
Write-Host "Plugin : $targetPlugin"
if ($update) { Write-Host "Sauvegarde : $backup" }

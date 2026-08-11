@echo off
setlocal
chcp 65001 >nul 2>&1

where powershell.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Windows PowerShell was not found.
  echo         This cleanup file requires Windows PowerShell 5.1 or later.
  pause
  exit /b 1
)

set "CODEX_CLEANUP_SELF=%~f0"
powershell.exe -NoLogo -NoProfile -Command ^
  "$text = [IO.File]::ReadAllText($env:CODEX_CLEANUP_SELF, [Text.UTF8Encoding]::new($false));" ^
  "$marker = '# POWERSHELL_PAYLOAD';" ^
  "$index = $text.LastIndexOf($marker, [StringComparison]::Ordinal);" ^
  "if ($index -lt 0) { throw 'PowerShell payload marker not found.' };" ^
  "$payload = $text.Substring($index + $marker.Length);" ^
  "& ([ScriptBlock]::Create($payload))"

set "CODEX_CLEANUP_EXIT=%ERRORLEVEL%"
echo.
if not "%CODEX_CLEANUP_EXIT%"=="0" echo Cleanup stopped with exit code %CODEX_CLEANUP_EXIT%.
pause
endlocal & exit /b %CODEX_CLEANUP_EXIT%

# POWERSHELL_PAYLOAD

$ErrorActionPreference = 'Stop'
[Console]::InputEncoding = [Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
$OutputEncoding = [Console]::OutputEncoding

# Exact names only. Add another training-folder name here if needed.
$PracticeFolderNames = @(
    'CodexPractice',
    'Codex-Practice',
    'Codex Training',
    'CodexTraining',
    'Codex-Training',
    'Codex Workshop',
    'CodexWorkshop',
    'Codex-Workshop',
    'Codex 실습',
    'Codex실습',
    '코덱스 실습',
    '코덱스실습'
)

$PreserveCodexNames = @('plugins', 'auth.json')

# Chromium stores visit/download history in these exact per-profile files.
# Cookies, passwords, autofill data, bookmarks, and extensions are not targeted.
$BrowserHistoryNames = @(
    'History',
    'History-journal',
    'Archived History',
    'Archived History-journal',
    'Visited Links'
)

function Write-Section {
    param([string]$Title)
    Write-Host ''
    Write-Host ('=' * 72) -ForegroundColor DarkCyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host ('=' * 72) -ForegroundColor DarkCyan
}

function Read-YesNo {
    param(
        [string]$Prompt,
        [bool]$Default = $false
    )

    $suffix = if ($Default) { '[Y/n]' } else { '[y/N]' }
    $answer = (Read-Host "$Prompt $suffix").Trim()
    if ([string]::IsNullOrWhiteSpace($answer)) { return $Default }
    return $answer -match '^(?i:y|yes|예|네)$'
}

function Get-DownloadsPath {
    $registryPath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders'
    $valueName = '{374DE290-123F-4565-9164-39C4925E467B}'

    try {
        $raw = (Get-ItemProperty -LiteralPath $registryPath -Name $valueName -ErrorAction Stop).$valueName
        if (-not [string]::IsNullOrWhiteSpace($raw)) {
            return [Environment]::ExpandEnvironmentVariables($raw)
        }
    }
    catch {
        # Fall through to the conventional location.
    }

    return (Join-Path $env:USERPROFILE 'Downloads')
}

function Get-FullPathSafe {
    param([string]$Path)

    if ([string]::IsNullOrWhiteSpace($Path)) { return $null }
    $expanded = [Environment]::ExpandEnvironmentVariables($Path.Trim().Trim('"'))
    return [IO.Path]::GetFullPath($expanded).TrimEnd('\')
}

function Assert-SafeCodexHome {
    param([string]$Path)

    $full = Get-FullPathSafe $Path
    if ([string]::IsNullOrWhiteSpace($full)) {
        throw 'CODEX_HOME resolved to an empty path.'
    }

    $root = [IO.Path]::GetPathRoot($full).TrimEnd('\')
    $profile = (Get-FullPathSafe $env:USERPROFILE)

    if ($full.Equals($root, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to use a drive root as CODEX_HOME: $full"
    }
    if ($full.Equals($profile, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to use the user-profile root as CODEX_HOME: $full"
    }

    return $full
}

function Test-IsChildOfAllowedRoot {
    param(
        [string]$Candidate,
        [string[]]$AllowedRoots
    )

    $fullCandidate = Get-FullPathSafe $Candidate
    if ([string]::IsNullOrWhiteSpace($fullCandidate)) { return $false }

    foreach ($rootPath in $AllowedRoots) {
        $fullRoot = Get-FullPathSafe $rootPath
        if ([string]::IsNullOrWhiteSpace($fullRoot)) { continue }

        $prefix = $fullRoot + '\'
        if ($fullCandidate.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) {
            return $true
        }
    }

    return $false
}

function Move-ToRecycleBin {
    param(
        [Parameter(Mandatory = $true)][string]$LiteralPath,
        [Parameter(Mandatory = $true)][bool]$Apply
    )

    if (-not (Test-Path -LiteralPath $LiteralPath)) {
        Write-Host "  [SKIP] Not found: $LiteralPath" -ForegroundColor DarkGray
        return
    }

    if (-not $Apply) {
        Write-Host "  [PREVIEW] $LiteralPath" -ForegroundColor Yellow
        return
    }

    $item = Get-Item -LiteralPath $LiteralPath -Force
    if ($item.PSIsContainer) {
        [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory(
            $item.FullName,
            [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs,
            [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin
        )
    }
    else {
        [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile(
            $item.FullName,
            [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs,
            [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin
        )
    }

    Write-Host "  [RECYCLE BIN] $LiteralPath" -ForegroundColor Green
}

function Get-UniqueExistingPaths {
    param([object[]]$Items)

    $seen = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
    foreach ($item in $Items) {
        if ($null -eq $item) { continue }
        $path = [string]$item
        if ([string]::IsNullOrWhiteSpace($path)) { continue }
        if (-not (Test-Path -LiteralPath $path)) { continue }

        $full = (Get-Item -LiteralPath $path -Force).FullName
        if ($seen.Add($full)) { $full }
    }
}

function Get-BrowserHistoryCandidates {
    param([string]$UserDataRoot)

    if ([string]::IsNullOrWhiteSpace($UserDataRoot)) { return }
    if (-not (Test-Path -LiteralPath $UserDataRoot -PathType Container)) { return }

    $candidates = New-Object System.Collections.Generic.List[string]
    $profiles = @(Get-ChildItem -LiteralPath $UserDataRoot -Directory -Force | Where-Object {
        $_.Name -match '^(?i:Default|Profile [0-9]+|Guest Profile)$'
    })

    foreach ($profile in $profiles) {
        foreach ($name in $BrowserHistoryNames) {
            $candidate = Join-Path $profile.FullName $name
            if (Test-Path -LiteralPath $candidate -PathType Leaf) {
                [void]$candidates.Add($candidate)
            }
        }
    }

    # Older Chromium versions may keep this file at the user-data root.
    $rootVisitedLinks = Join-Path $UserDataRoot 'Visited Links'
    if (Test-Path -LiteralPath $rootVisitedLinks -PathType Leaf) {
        [void]$candidates.Add($rootVisitedLinks)
    }

    Get-UniqueExistingPaths -Items @($candidates)
}

function Get-CodexProcesses {
    @(Get-Process -ErrorAction SilentlyContinue | Where-Object {
        $_.ProcessName -match '(?i)(codex|chatgpt)'
    })
}

function Write-ProcessList {
    param([object[]]$Processes)

    $Processes | Sort-Object ProcessName, Id | ForEach-Object {
        Write-Host ("  {0} (PID {1})" -f $_.ProcessName, $_.Id)
    }
}

Write-Host ''
Write-Host 'Windows Codex Cleanup' -ForegroundColor Cyan
Write-Host 'All automated removals go to the Windows Recycle Bin.' -ForegroundColor Gray
Write-Host 'The Recycle Bin is never emptied by this script.' -ForegroundColor Gray

Write-Host ''
Write-Host 'Choose a mode:' -ForegroundColor White
Write-Host '  1. Preview only (recommended first run)'
Write-Host '  2. Move selected items to the Recycle Bin'
Write-Host '  3. Cancel'
$mode = (Read-Host 'Selection [1]').Trim()
if ([string]::IsNullOrWhiteSpace($mode)) { $mode = '1' }
if ($mode -eq '3') { exit 0 }
if ($mode -notin @('1', '2')) {
    Write-Host '[ERROR] Invalid selection.' -ForegroundColor Red
    exit 2
}
$apply = $mode -eq '2'

Add-Type -AssemblyName Microsoft.VisualBasic

$configuredCodexHome = if (-not [string]::IsNullOrWhiteSpace($env:CODEX_HOME)) {
    $env:CODEX_HOME
}
else {
    Join-Path $env:USERPROFILE '.codex'
}
$codexHome = Assert-SafeCodexHome $configuredCodexHome

$desktop = [Environment]::GetFolderPath('Desktop')
$downloads = Get-DownloadsPath
$documents = [Environment]::GetFolderPath('MyDocuments')
$pictures = [Environment]::GetFolderPath('MyPictures')
$browserDataRoots = @(
    [PSCustomObject]@{
        Name = 'Chrome'
        Path = Join-Path $env:LOCALAPPDATA 'Google\Chrome\User Data'
    },
    [PSCustomObject]@{
        Name = 'Edge'
        Path = Join-Path $env:LOCALAPPDATA 'Microsoft\Edge\User Data'
    }
)
$allowedUserRoots = @($desktop, $downloads, $documents, $pictures) | Where-Object {
    -not [string]::IsNullOrWhiteSpace($_)
}

Write-Section '1/5  Preflight'
Write-Host "Codex home: $codexHome"
Write-Host "Mode:       $(if ($apply) { 'APPLY' } else { 'PREVIEW' })"
Write-Host 'Preserved:  plugins, auth.json'

$runningCodex = @(Get-CodexProcesses)

if ($runningCodex.Count -gt 0) {
    Write-Host ''
    Write-Host '[STOP] Codex/ChatGPT-related processes are still running:' -ForegroundColor Red
    Write-ProcessList -Processes $runningCodex

    if (-not $apply) {
        Write-Host 'Preview mode never stops processes.' -ForegroundColor Yellow
        Write-Host 'Apply mode can offer to force-stop only the processes listed above.' -ForegroundColor Yellow
    }
    else {
        Write-Host 'Force-stopping can discard unsaved work in those apps.' -ForegroundColor Yellow
        if (-not (Read-YesNo 'Force-stop only the Codex/ChatGPT processes listed above now?')) {
            Write-Host '[CANCELLED] Close the processes manually and run this file again.' -ForegroundColor Yellow
            exit 3
        }

        for ($attempt = 1; $attempt -le 3; $attempt++) {
            $targets = @(Get-CodexProcesses)
            if ($targets.Count -eq 0) { break }

            foreach ($process in $targets) {
                try {
                    Stop-Process -Id $process.Id -Force -ErrorAction Stop
                    Write-Host ("  [FORCE-STOPPED] {0} (PID {1})" -f $process.ProcessName, $process.Id) -ForegroundColor Green
                }
                catch {
                    Write-Host ("  [FAILED] {0} (PID {1}): {2}" -f $process.ProcessName, $process.Id, $_.Exception.Message) -ForegroundColor Red
                }
            }

            Start-Sleep -Milliseconds 1000
        }

        $remainingCodex = @(Get-CodexProcesses)
        if ($remainingCodex.Count -gt 0) {
            Write-Host '[STOP] Some Codex/ChatGPT processes remain after three attempts:' -ForegroundColor Red
            Write-ProcessList -Processes $remainingCodex
            Write-Host 'Use Task Manager as an administrator to end those PIDs, then run this batch normally.' -ForegroundColor Yellow
            exit 3
        }

        Write-Host 'All detected Codex/ChatGPT processes are stopped.' -ForegroundColor Green
    }
}

$runningBrowsers = @(Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.ProcessName -match '(?i)^(chrome|msedge)$'
})

if ($runningBrowsers.Count -gt 0) {
    Write-Host ''
    Write-Host '[STOP] Chrome or Edge is still running:' -ForegroundColor Red
    $runningBrowsers | Sort-Object ProcessName, Id | ForEach-Object {
        Write-Host ("  {0} (PID {1})" -f $_.ProcessName, $_.Id)
    }
    Write-Host 'Close every Chrome and Edge window, including background apps, then run this file again.' -ForegroundColor Yellow
    if ($apply) { exit 4 }
    Write-Host 'Preview will continue without changing anything.' -ForegroundColor Yellow
}

if ($apply) {
    Write-Host ''
    Write-Host 'Review the Codex-home path above before continuing.' -ForegroundColor Yellow
    $confirmation = (Read-Host 'Type CLEANUP to confirm Recycle Bin moves').Trim()
    if ($confirmation -cne 'CLEANUP') {
        Write-Host '[CANCELLED] Confirmation did not match.' -ForegroundColor Yellow
        exit 0
    }
}

Write-Section '2/5  Codex local-state cleanup'
$codexCandidates = @()
if (Test-Path -LiteralPath $codexHome -PathType Container) {
    $codexCandidates = @(Get-ChildItem -LiteralPath $codexHome -Force | Where-Object {
        $PreserveCodexNames -notcontains $_.Name
    })
}
else {
    Write-Host "  [SKIP] Codex home was not found: $codexHome" -ForegroundColor DarkGray
}

if ($codexCandidates.Count -eq 0) {
    Write-Host '  Nothing to clean.' -ForegroundColor DarkGray
}
else {
    foreach ($item in $codexCandidates) {
        Move-ToRecycleBin -LiteralPath $item.FullName -Apply $apply
    }
}

Write-Section '3/5  Training folders and screenshots'
$practiceCandidates = New-Object System.Collections.Generic.List[string]
foreach ($basePath in @($desktop, $downloads, $documents)) {
    if ([string]::IsNullOrWhiteSpace($basePath)) { continue }
    foreach ($name in $PracticeFolderNames) {
        $candidate = Join-Path $basePath $name
        if (Test-Path -LiteralPath $candidate) {
            [void]$practiceCandidates.Add($candidate)
        }
    }
}

$uniquePracticeCandidates = @(Get-UniqueExistingPaths $practiceCandidates)
if ($uniquePracticeCandidates.Count -eq 0) {
    Write-Host '  No exact-name training folders were found.' -ForegroundColor DarkGray
}
else {
    Write-Host '  Exact-name training folders:'
    foreach ($candidate in $uniquePracticeCandidates) {
        Move-ToRecycleBin -LiteralPath $candidate -Apply $apply
    }
}

$screenshotFolders = New-Object System.Collections.Generic.List[string]
if (-not [string]::IsNullOrWhiteSpace($pictures)) {
    [void]$screenshotFolders.Add((Join-Path $pictures 'Screenshots'))
}
if (-not [string]::IsNullOrWhiteSpace($env:OneDrive)) {
    [void]$screenshotFolders.Add((Join-Path $env:OneDrive 'Pictures\Screenshots'))
}
$screenshotFolders = @(Get-UniqueExistingPaths $screenshotFolders)

if ($screenshotFolders.Count -gt 0) {
    Write-Host ''
    foreach ($folder in $screenshotFolders) {
        $count = @(Get-ChildItem -LiteralPath $folder -Force).Count
        Write-Host "  Screenshot folder ($count items): $folder"
    }

    if (Read-YesNo 'Move every item inside these screenshot folders to the Recycle Bin?') {
        foreach ($folder in $screenshotFolders) {
            foreach ($item in @(Get-ChildItem -LiteralPath $folder -Force)) {
                Move-ToRecycleBin -LiteralPath $item.FullName -Apply $apply
            }
        }
    }
    else {
        Write-Host '  [SKIP] Screenshot files were not selected.' -ForegroundColor DarkGray
    }
}

Write-Host ''
Write-Host 'You may enter additional exact file/folder paths one at a time.'
Write-Host 'For safety, paths must be inside Desktop, Downloads, Documents, or Pictures.' -ForegroundColor Gray
while ($true) {
    $extraPath = (Read-Host 'Additional exact path (Enter to finish)').Trim()
    if ([string]::IsNullOrWhiteSpace($extraPath)) { break }

    $fullExtraPath = Get-FullPathSafe $extraPath
    if (-not (Test-Path -LiteralPath $fullExtraPath)) {
        Write-Host "  [SKIP] Not found: $fullExtraPath" -ForegroundColor Yellow
        continue
    }
    if (-not (Test-IsChildOfAllowedRoot -Candidate $fullExtraPath -AllowedRoots $allowedUserRoots)) {
        Write-Host '  [REJECTED] The path is outside the allowed user folders.' -ForegroundColor Red
        continue
    }

    Move-ToRecycleBin -LiteralPath $fullExtraPath -Apply $apply
}

Write-Section '4/5  Chrome and Edge browsing history'
$browserHistoryCandidates = New-Object System.Collections.Generic.List[string]
foreach ($browser in $browserDataRoots) {
    $candidates = @(Get-BrowserHistoryCandidates -UserDataRoot $browser.Path)
    if ($candidates.Count -eq 0) {
        Write-Host "  [SKIP] No history database found for $($browser.Name)." -ForegroundColor DarkGray
        continue
    }

    Write-Host "  $($browser.Name): $($candidates.Count) history file(s)"
    foreach ($candidate in $candidates) {
        [void]$browserHistoryCandidates.Add($candidate)
    }
}

if ($browserHistoryCandidates.Count -eq 0) {
    Write-Host '  Nothing to clean.' -ForegroundColor DarkGray
}
else {
    Write-Host '  Saved passwords, cookies, autofill data, bookmarks, and extensions are preserved.' -ForegroundColor Gray
    foreach ($candidate in @(Get-UniqueExistingPaths -Items @($browserHistoryCandidates))) {
        Move-ToRecycleBin -LiteralPath $candidate -Apply $apply
    }
}

Write-Section '5/5  Account and app verification'
Write-Host 'The following steps are intentionally not automated:' -ForegroundColor White
Write-Host '  [ ] Codex: Settings > Configuration > reset/reinstall the workspace'
Write-Host '  [ ] Confirm that the Presentation plugin is visible'
Write-Host '  [ ] ChatGPT: confirm Scheduled, projects, and chats are empty'
Write-Host '  [ ] Review the Recycle Bin'
Write-Host ''
Write-Host 'The Recycle Bin was NOT emptied because that would permanently delete files.' -ForegroundColor Yellow

if (Read-YesNo 'Open ChatGPT now to review Scheduled, projects, and chats?') {
    try {
        Start-Process -FilePath 'https://chatgpt.com/' -ErrorAction Stop
        Write-Host '  [OPENED] https://chatgpt.com/'
    }
    catch {
        Write-Host '  [SKIP] Could not open ChatGPT. Open https://chatgpt.com/ manually.' -ForegroundColor Yellow
    }
}

if ($apply) {
    Write-Host ''
    Write-Host 'Safe cleanup completed. Items remain recoverable in the Recycle Bin.' -ForegroundColor Green
}
else {
    Write-Host ''
    Write-Host 'Preview completed. No files were moved.' -ForegroundColor Green
}

exit 0

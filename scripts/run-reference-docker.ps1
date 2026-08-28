param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
& node (Join-Path $repoRoot "scripts/run-reference-docker.js") @Args
exit $LASTEXITCODE

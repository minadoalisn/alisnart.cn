# Alisnart server update helper.
# Usage: $env:ALISN_SSH_KEY_FILE='C:\secure\alisnart.pem'; powershell -ExecutionPolicy Bypass -File update-server.ps1

$serverIp = "8.138.214.74"
$username = "root"
$keyFile = $env:ALISN_SSH_KEY_FILE
$webRoot = "/usr/share/nginx/html"

Write-Host "Server: $serverIp" -ForegroundColor Yellow
Write-Host "User: $username" -ForegroundColor Yellow
Write-Host "Web root: $webRoot" -ForegroundColor Yellow

if (-not $keyFile -or -not (Test-Path -LiteralPath $keyFile)) {
    Write-Host "ALISN_SSH_KEY_FILE is missing or invalid. Stopping." -ForegroundColor Red
    Write-Host "Keep the private key outside the repository and pass its absolute path through the environment variable." -ForegroundColor Yellow
    exit 1
}

$plinkPath = "plink.exe"
$command = "cd $webRoot && git pull origin main"
$destination = "${username}@${serverIp}"

if (Get-Command $plinkPath -ErrorAction SilentlyContinue) {
    & $plinkPath -batch -i $keyFile $destination $command
} else {
    & ssh -i $keyFile $destination $command
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Server update succeeded." -ForegroundColor Green
    exit 0
}

Write-Host "Server update failed." -ForegroundColor Red
exit 1

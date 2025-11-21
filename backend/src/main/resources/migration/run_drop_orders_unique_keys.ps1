# PowerShell helper to drop legacy UNIQUE indexes on orders.payment_id/service_id

$mysqlPaths = @(
    "mysql",  # assume in PATH
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe"
)

$mysqlPath = $null
foreach ($p in $mysqlPaths) {
    if (Get-Command $p -ErrorAction SilentlyContinue) {
        $mysqlPath = (Get-Command $p).Source
        break
    }
}

if (-not $mysqlPath) {
    Write-Error "mysql client not found. Add it to PATH or update this script with the correct path."
    exit 1
}

$username = "root"
$password = "Tiendat@31"   # update if your MySQL password differs
$database = "bookmagasin"
$sqlScript = Join-Path $PSScriptRoot "drop_orders_unique_keys.sql"

if (-not (Test-Path $sqlScript)) {
    Write-Error "SQL script not found at $sqlScript"
    exit 1
}

Write-Host "Using mysql client at: $mysqlPath"
Write-Host "Running migration against database '$database'..."

$mysqlArgs = @(
    "-u$($username)",
    "-p$($password)",
    $database
)

(Get-Content -Path $sqlScript -Raw) | & $mysqlPath @mysqlArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration completed. UNIQUE constraints on orders.payment_id/service_id removed if present." -ForegroundColor Green
} else {
    Write-Error "Migration failed with exit code $LASTEXITCODE"
}

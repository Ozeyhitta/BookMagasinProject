# PowerShell script to run SQL migration
# This script connects to MySQL and drops position and join_date columns from users table

$mysqlPath = "mysql"  # Change this to your MySQL path if needed, e.g., "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$username = "root"
$password = "1234"
$database = "bookmagasin"

# Read SQL script
$sqlScript = Get-Content -Path "$PSScriptRoot\remove_position_join_date.sql" -Raw

# Execute SQL
& $mysqlPath -u$username -p$password $database -e $sqlScript

Write-Host "Migration completed!" -ForegroundColor Green

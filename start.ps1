# FlowPilot 后端启动脚本
# 在 PowerShell 中运行：Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process; .\start.ps1

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     FlowPilot Backend Starter          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 检查 Node.js 和 npm
Write-Host "📋 检查环境..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
$npmVersion = npm --version 2>$null

if (-not $nodeVersion) {
    Write-Host "❌ Node.js 未安装或不在 PATH 中" -ForegroundColor Red
    exit 1
}

Write-Host "   ✓ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "   ✓ npm: $npmVersion" -ForegroundColor Green

# 检查 .env 文件
if (-not (Test-Path ".env")) {
    Write-Host "`n⚠️  .env 文件不存在！" -ForegroundColor Red
    Write-Host "   请先创建 .env 文件并设置 OLLAMA_API_KEY" -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content .env -Raw
if ($envContent -notmatch "OLLAMA_API_KEY") {
    Write-Host "`n⚠️  .env 文件中没有 OLLAMA_API_KEY！" -ForegroundColor Red
    exit 1
}

Write-Host "   ✓ .env 文件已验证" -ForegroundColor Green

# 检查 node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "`n📦 正在安装依赖..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 依赖安装失败" -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✓ 依赖安装完成" -ForegroundColor Green
}

# 启动服务
Write-Host "`n🚀 启动 FlowPilot 后端..." -ForegroundColor Green
Write-Host "   访问地址: http://127.0.0.1:3000/flowpilot.html" -ForegroundColor Cyan
Write-Host "   按 Ctrl+C 停止服务`n" -ForegroundColor Yellow

npm start

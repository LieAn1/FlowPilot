# FlowPilot 后端启动指南

## 📋 前置条件

- **Node.js v18+**（已验证你的版本是 v24.19.0 ✓）
- **npm** （已验证你的版本是 12.0.2 ✓）
- **Ollama API Key** （已在 `.env` 中配置 ✓）

## 🚀 快速启动（Windows PowerShell）

### 方式一：手动启动

```powershell
# 1. 进入项目目录
cd "D:\web program\FlowPilot"

# 2. 安装依赖（首次运行）
npm install

# 3. 启动后端服务
npm start
```

启动成功后，你会看到：
```
[时间] [SUCCESS] 🚀 FlowPilot 后端服务启动
[时间] [INFO] 📡 本地地址: http://127.0.0.1:3000
[时间] [INFO] 🔗 打开浏览器访问: http://127.0.0.1:3000/flowpilot.html
```

### 方式二：使用启动脚本（推荐）

创建文件 `start.ps1`：

```powershell
# 检查依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 正在安装依赖..." -ForegroundColor Cyan
    npm install
}

# 启动服务
Write-Host "🚀 启动 FlowPilot 后端..." -ForegroundColor Green
npm start
```

然后在 PowerShell 中运行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\start.ps1
```

### 方式三：开发模式（支持自动重启）

```powershell
npm run dev
```

## 📡 API 端点说明

### 1. 健康检查
```bash
GET http://127.0.0.1:3000/api/health
```

**响应示例：**
```json
{
  "status": "ok",
  "message": "FlowPilot 后端正常运行",
  "config": {
    "backend": "ready",
    "ollamaCloud": "connected",
    "model": "mistral:7b",
    "apiBase": "https://ollama.com/api"
  }
}
```

### 2. 获取可用模型
```bash
GET http://127.0.0.1:3000/api/models
```

### 3. 执行研究任务（核心接口）
```bash
POST http://127.0.0.1:3000/api/research

Content-Type: application/json

{
  "task": "你的研究问题",
  "sourceUrls": [
    "https://example.com/article1",
    "https://example.com/article2"
  ],
  "mode": "local"
}
```

**响应结构：**
```json
{
  "status": "ok",
  "message": "研究任务执行完成",
  "report": {
    "task": "...",
    "timestamp": "...",
    "stages": {
      "planning": { "name": "...", "content": "..." },
      "research": { "name": "...", "content": "..." },
      "analysis": { "name": "...", "content": "..." },
      "verification": { "name": "...", "content": "..." }
    },
    "summary": "..."
  }
}
```

## ⚙️ 环境配置

`.env` 文件中的关键配置：

```env
# Ollama Cloud API Key（必须）
OLLAMA_API_KEY=your_key_here

# 后端服务端口（可选，默认 3000）
PORT=3000

# Ollama Cloud 模型（可选，默认 mistral:7b）
OLLAMA_MODEL=mistral:7b
```

**支持的模型示例：**
- `mistral:7b` - Mistral 7B（推荐用于通用任务）
- `llama3:8b` - Llama 3 8B
- `neural-chat:7b` - Neural Chat 7B

## 🔒 安全说明

- ✅ API Key 从 `.env` 读取，**不会暴露给前端**
- ✅ `.env` 已添加到 `.gitignore`，**不会提交到 Git**
- ✅ 所有敏感信息仅在后端处理
- ✅ 前端只能通过后端接口调用模型

## 🐛 常见问题

### Q1: 启动时报 "OLLAMA_API_KEY 未配置"
**A:** 检查 `.env` 文件是否存在并包含有效的 API Key：
```powershell
Get-Content .env
```

### Q2: 连接 Ollama Cloud 失败
**A:** 可能的原因：
- 网络连接问题
- API Key 已过期或无效
- Ollama Cloud 服务不可用

运行 `npm start` 查看详细错误日志。

### Q3: 模型列表为空
**A:** 
- 检查 API Key 权限
- 确认已在 Ollama 账户中激活模型
- 尝试在 Ollama 官网登录验证

### Q4: 研究任务超时
**A:** 大型模型可能需要较长时间处理。你可以：
- 在 `server.js` 中调整 `timeout: 60000`
- 切换到更小的模型（如 `mistral:7b`）

## 📝 后续步骤

1. ✅ **启动后端**
2. ⏳ **测试 `/api/health` 端点**
3. ⏳ **从前端调用 `/api/research`**
4. ⏳ **集成前端 UI 显示真实报告**

## 📞 需要帮助？

检查以下日志文件：
```powershell
# 查看最新日志
npm start 2>&1 | Tee-Object -FilePath "flowpilot.log"
```

---

**目前进度：** ✅ 后端已完成 → ⏳ 等待前端集成

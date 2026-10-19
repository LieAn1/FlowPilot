# FlowPilot 联网搜索 + AI 分析 启动指南

## ✅ 完成的功能

### 后端实现 (`server.js`)
- ✅ Ollama Cloud API 集成
- ✅ 联网搜索接口 (`/api/web_search`) 
- ✅ 网页内容获取接口 (`/api/web_fetch`)
- ✅ AI 分析引擎（3 阶段：搜索 → 分析 → 核验）
- ✅ 结构化报告生成
- ✅ 错误处理和重试机制

### 前端实现 (`index.html`)
- ✅ 真实 API 调用替换 MOCK_WORKFLOW
- ✅ 实时加载状态显示
- ✅ 结构化报告渲染
- ✅ 参考资料链接
- ✅ 错误提示

### 安全措施
- ✅ API Key 仅在后端读取
- ✅ `.env` 已添加 `.gitignore`
- ✅ 前端代码无敏感信息
- ✅ 所有外部 URL 已转义

---

## 🚀 启动步骤

### 方式一：PowerShell 快速启动（推荐）

```powershell
# 1. 打开 PowerShell，进入项目目录
cd "D:\web program\FlowPilot"

# 2. 首次运行需要安装依赖
npm install

# 3. 启动后端服务
npm start
```

输出示例：
```
[时间] [SUCCESS] 🚀 FlowPilot 后端服务启动
[时间] [INFO] 📡 本地地址: http://127.0.0.1:3000
[时间] [INFO] 🔗 打开浏览器访问: http://127.0.0.1:3000/index.html
```

### 方式二：开发模式（支持自动重启）

```powershell
npm run dev
```

---

## 🧪 测试联网搜索功能

### 1. 健康检查

在浏览器中打开：
```
http://127.0.0.1:3000/api/health
```

预期响应：
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

### 2. 从命令行测试搜索接口

```powershell
# 使用 PowerShell 测试搜索功能
$body = @{
    task = "什么是人工智能？"
    sourceUrls = @()
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/research" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

或使用 `curl`（如果已安装）：
```bash
curl -X POST http://127.0.0.1:3000/api/research \
  -H "Content-Type: application/json" \
  -d '{"task":"什么是人工智能？","sourceUrls":[]}'
```

### 3. 在网页上测试

1. 打开浏览器访问 `http://127.0.0.1:3000/index.html`
2. 在输入框中输入问题，例如：
   ```
   Python 3.12 有哪些新特性？
   ```
3. 点击 "Start Research" 或按 Ctrl+Enter
4. 等待搜索完成（通常需要 30-60 秒）
5. 查看生成的报告

---

## 📊 API 响应结构

成功的研究请求返回：

```json
{
  "status": "ok",
  "message": "研究任务执行完成",
  "report": {
    "task": "用户的问题",
    "timestamp": "2024-10-19T...",
    "searchResults": [
      {
        "title": "网页标题",
        "url": "https://example.com",
        "snippet": "摘要内容..."
      }
    ],
    "webContentsCount": 2,
    "stages": {
      "research": {
        "name": "📍 信息检索",
        "content": "搜索结果摘要..."
      },
      "analysis": {
        "name": "🔬 深度分析",
        "content": "AI 生成的分析结果..."
      },
      "verification": {
        "name": "✅ 质量核验",
        "content": "核验报告..."
      }
    },
    "summary": "完整的结构化报告",
    "sources": [
      {
        "title": "网页标题",
        "url": "https://example.com"
      }
    ]
  }
}
```

---

## ⚠️ 常见问题排查

### Q1: "OLLAMA_API_KEY 未配置"

```powershell
# 检查 .env 文件
Get-Content .env

# 应该包含：
# OLLAMA_API_KEY=your_api_key_here
```

### Q2: "Ollama Cloud 服务不可用"

可能原因：
- 网络连接问题
- API Key 已过期
- Ollama Cloud 服务故障

解决方案：
```powershell
# 测试网络连接
Test-NetConnection -ComputerName ollama.com -Port 443

# 检查 API Key 是否有效
# （需要在 Ollama 官网登录验证）
```

### Q3: 请求超时

模型处理时间较长时可能超时。可以：
1. 在 `server.js` 中调整 timeout（行 268、285）
2. 切换到更小的模型
3. 检查网络速度

### Q4: 搜索返回空结果

原因：
- 关键词过于专业/冷门
- Ollama Cloud 搜索服务暂时不可用
- 请求中的查询格式有问题

解决：使用更通用的搜索词进行测试

---

## 🔐 安全检查清单

启动前，请验证：

- [ ] `.env` 文件包含有效的 `OLLAMA_API_KEY`
- [ ] `.gitignore` 包含 `.env`
- [ ] 未在前端代码中发现 API Key
- [ ] 已运行 `npm install` 安装依赖
- [ ] Node.js 版本 ≥ 18

---

## 📁 修改的文件

| 文件 | 修改内容 |
|------|--------|
| `server.js` | 完全重写，实现真实搜索 + AI 分析 |
| `index.html` | 替换 `startWorkflow()` 函数，调用真实 API |
| `.gitignore` | 已包含 `.env` 安全保护 |
| `package.json` | 无修改（已配置正确的依赖） |

---

## 🎯 下一步优化

- [ ] 添加搜索结果缓存
- [ ] 支持自定义模型选择
- [ ] 添加搜索历史记录
- [ ] 支持 PDF/图片上传
- [ ] 实时流式回复

---

## 📞 需要帮助？

### 查看后端日志
```powershell
# 启动时的日志输出已经包含详细信息
npm start 2>&1 | Tee-Object flowpilot.log
```

### 检查前端网络请求
在浏览器开发者工具中：
1. 按 F12 打开开发者工具
2. 切换到 "Network" 标签
3. 提交研究任务
4. 查看 `/api/research` 请求的详细信息

---

**所有修改已完成。系统已就绪！** ✅

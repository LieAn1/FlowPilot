# FlowPilot

多智能体协作的 AI 研究分析工作台。输入问题，由 Planner、Researcher、Analyst、Verifier 四个 Agent 协作完成研究规划、信息检索、深度分析和质量核验，最终生成结构化报告。

## 技术栈

- 前端：原生 HTML / CSS / JavaScript（单文件）
- 后端：Node.js + Express
- AI 服务：Ollama Cloud API（gemma4:31b）

## 快速开始

### 1. 安装依赖

```bash
cd "D:\web program\FlowPilot"
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```
OLLAMA_API_KEY=your_api_key_here
OLLAMA_MODEL=gemma4:31b
PORT=3000
```

> API Key 从 [Ollama 官网](https://ollama.com) 获取。

### 3. 启动服务

```bash
npm start
```

### 4. 打开浏览器

访问 `http://127.0.0.1:3000`

## 使用方法

1. 在输入框中输入你的研究问题
2. 点击 **Start Research** 或按 `Ctrl + Enter`
3. 等待四个 Agent 依次执行（约 30-60 秒）
4. 查看生成的分析报告

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查，验证 Ollama 连接 |
| `/api/research` | POST | 执行研究分析，参数：`{ "task": "你的问题" }` |

## 注意事项

- 必须通过 `http://127.0.0.1:3000` 访问，不能直接双击打开 HTML 文件
- `.env` 文件包含 API Key，已被 `.gitignore` 排除，不会上传到 GitHub
- 首次使用前确保已运行 `npm install` 安装依赖

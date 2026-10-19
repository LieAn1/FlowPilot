import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Ollama Cloud 配置
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma4:31b';

// 中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// 日志工具
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleString('zh-CN');
  console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
}

// ==================== 健康检查接口 ====================
app.get('/api/health', async (req, res) => {
  try {
    if (!OLLAMA_API_KEY) {
      return res.status(500).json({
        status: 'error',
        message: '未配置 OLLAMA_API_KEY'
      });
    }

    // 测试 Ollama Cloud 连接
    const response = await axios.post(
      'https://ollama.com/api/chat',
      {
        model: OLLAMA_MODEL,
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ],
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${OLLAMA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    log('✓ Ollama Cloud 连接正常', 'success');

    res.json({
      status: 'ok',
      message: 'FlowPilot 后端正常运行',
      config: {
        backend: 'ready',
        ollamaCloud: 'connected',
        model: OLLAMA_MODEL
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    log(`✗ Ollama Cloud 连接失败: ${error.response?.status} ${error.message}`, 'error');
    res.status(503).json({
      status: 'error',
      message: 'Ollama Cloud 服务不可用',
      details: error.message
    });
  }
});

// ==================== 调用 Ollama Cloud API ====================
async function callOllamaCloud(content) {
  try {
    const response = await axios.post(
      'https://ollama.com/api/chat',
      {
        model: OLLAMA_MODEL,
        messages: [
          {
            role: 'user',
            content: content
          }
        ],
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${OLLAMA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    if (response.data && response.data.message && response.data.message.content) {
      return response.data.message.content.trim();
    } else {
      throw new Error('Ollama 返回空响应');
    }
  } catch (error) {
    log(`✗ Ollama API 调用失败: ${error.response?.status} ${error.message}`, 'error');
    throw error;
  }
}

// ==================== 研究执行接口（核心） ====================
app.post('/api/research', async (req, res) => {
  try {
    const { task } = req.body;

    if (!task || typeof task !== 'string' || task.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: '请提供有效的任务描述'
      });
    }

    if (!OLLAMA_API_KEY) {
      return res.status(500).json({
        status: 'error',
        message: '未配置 OLLAMA_API_KEY'
      });
    }

    log(`\n${'='.repeat(70)}`, 'info');
    log(`🚀 开始执行研究任务: ${task.substring(0, 60)}...`, 'success');
    log(`模型: ${OLLAMA_MODEL}`, 'info');
    log(`${'='.repeat(70)}\n`, 'info');

    // ===== 阶段1: Planner - 任务规划 =====
    log('📋 阶段1: 任务规划与分解...', 'info');
    const plannerPrompt = `你是一个专业的研究规划专家。用户提出了以下问题：

"${task}"

请你分析这个问题，并制定一个详细的研究计划。输出格式如下：

【研究目标】
- [目标1]
- [目标2]
- [目标3]

【研究步骤】
1. [第一步的详细描述]
2. [第二步的详细描述]
3. [第三步的详细描述]

【关键维度】
- [维度1]
- [维度2]
- [维度3]

请用中文简洁回答，总字数控制在 200-300 字。`;

    const planResponse = await callOllamaCloud(plannerPrompt);
    log('✓ Planner 阶段完成', 'success');

    // ===== 阶段2: Analyst - 深度分析 =====
    log('\n🔬 阶段2: 深度分析...', 'info');
    const analystPrompt = `你是一个资深的分析专家。基于以下信息进行深度分析：

【原始问题】
${task}

【研究计划】
${planResponse}

请进行深度分析并提供洞察。输出格式：

【核心发现】
1. [发现1及其含义]
2. [发现2及其含义]
3. [发现3及其含义]

【关键观点】
- [观点1]
- [观点2]

【分析结论】
基于上述分析，对"${task}"的答案是：
[你的分析结论，基于逻辑推理]

请用中文详细回答，总字数控制在 400-600 字。`;

    const analysisResponse = await callOllamaCloud(analystPrompt);
    log('✓ Analyst 阶段完成', 'success');

    // ===== 阶段3: Verifier - 质量核验 =====
    log('\n✅ 阶段3: 质量核验...', 'info');
    const verifierPrompt = `你是一个严格的质量检查专家。基于以下分析结果进行质量检查：

【原始问题】
${task}

【分析结果】
${analysisResponse}

请进行质量检查。输出格式：

【可靠性评估】
✓ 结论有充分支持
⚠️ 部分结论需要进一步验证
✗ 部分观点证据不足

【逻辑一致性】
[评估分析中的逻辑是否严密]

【主要限制】
- [分析的主要限制因素]
- [可能的盲点]

【最终建议】
[基于以上分析，给出的建议或总结]

请用中文简洁回答，总字数控制在 200-300 字。`;

    const verificationResponse = await callOllamaCloud(verifierPrompt);
    log('✓ Verifier 阶段完成', 'success');

    // ===== 生成最终报告 =====
    log('\n📊 生成最终报告...', 'info');

    const finalReport = {
      task,
      timestamp: new Date().toISOString(),
      model: OLLAMA_MODEL,

      stages: {
        planning: {
          name: '📋 Planner - 任务规划与分解',
          content: planResponse
        },
        analysis: {
          name: '🔬 Analyst - 深度分析与总结',
          content: analysisResponse
        },
        verification: {
          name: '✅ Verifier - 质量核验',
          content: verificationResponse
        }
      },

      summary: `【研究问题】
${task}

【执行流程】
1️⃣ Planner - 制定研究计划
2️⃣ Analyst - 进行深度分析
3️⃣ Verifier - 质量核验

【分析结论】
${analysisResponse}

【质量评估】
${verificationResponse}

【生成时间】
${new Date().toLocaleString('zh-CN')}

【使用模型】
${OLLAMA_MODEL}
API: https://ollama.com/api/chat`
    };

    log('✓ 研究报告已生成', 'success');
    log(`${'='.repeat(70)}\n`, 'info');

    res.json({
      status: 'ok',
      message: '研究任务执行完成',
      report: finalReport
    });

  } catch (error) {
    log(`\n✗ 研究任务执行失败: ${error.message}`, 'error');
    res.status(500).json({
      status: 'error',
      message: '研究任务执行失败',
      details: error.message
    });
  }
});

// ==================== 错误处理 ====================
app.use((err, req, res, next) => {
  log(`请求处理错误: ${err.message}`, 'error');
  res.status(500).json({
    status: 'error',
    message: '服务器内部错误',
    details: err.message
  });
});

// ==================== 启动服务 ====================
app.listen(PORT, () => {
  log(`\n${'='.repeat(70)}`, 'success');
  log(`🚀 FlowPilot 后端服务启动`, 'success');
  log(`${'='.repeat(70)}`, 'success');
  log(`📡 本地地址: http://127.0.0.1:${PORT}`, 'info');
  log(`🔗 打开浏览器: http://127.0.0.1:${PORT}/index.html`, 'info');
  log(`\n🔑 当前配置:`, 'info');
  log(`   - Ollama Cloud API: https://ollama.com/api/chat`, 'info');
  log(`   - 模型: ${OLLAMA_MODEL}`, 'info');
  log(`   - API Key: ${OLLAMA_API_KEY ? '已配置 ✓' : '未配置 ✗'}`, 'info');
  log(`\n📚 可用接口:`, 'info');
  log(`   - GET  /api/health   - 健康检查`, 'info');
  log(`   - POST /api/research - 执行研究分析`, 'info');
  log(`\n⚠️  确保 .env 文件已配置 OLLAMA_API_KEY\n`, 'warn');
  log(`${'='.repeat(70)}\n`, 'success');
});

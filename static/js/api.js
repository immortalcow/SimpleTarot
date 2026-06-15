// ====== LLM API 模块 ====== //

// --- 提示词模板 ---
const TAROT_PROMPTS = {
  // 牌阵整体综合解读
  OVERALL_READING: (question, spreadName, count, cardsInfo) => 
    `请对当前的塔罗牌阵进行深度综合解读。\n问题：「${question}」\n牌型：${spreadName}（${count}张）\n\n牌面详情：\n${cardsInfo}\n\n请分析各张牌之间的内在联系，揭示问题的核心本质，并从全局视角给出最终的启示与建议。控制在600字以内。`
};

const TarotAPI = {
  // 获取模型列表
  async fetchModels(baseUrl, apiKey) {
    const url = baseUrl.replace(/\/+$/, '') + '/models';
    const resp = await fetch(url, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`获取模型列表失败 (${resp.status}): ${err.substring(0,150)}`);
    }
    const data = await resp.json();
    // 返回模型ID列表，过滤掉非聊天模型
    const models = (data.data || [])
      .map(m => m.id)
      .filter(id => !id.includes('embed') && !id.includes('audio') && !id.includes('tts') && !id.includes('whisper') && !id.includes('dall-e') && !id.includes('moderation'))
      .sort();
    return models;
  },

  // 调用聊天补全 (流式)
  async streamChat(baseUrl, apiKey, model, systemPrompt, userPrompt, maxTokens, onChunk) {
    const url = baseUrl.replace(/\/+$/, '') + '/chat/completions';
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: parseInt(maxTokens) || 4096,
        temperature: 0.8,
        stream: true
      })
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => '');
      let detail = `状态码: ${resp.status}\n响应正文: ${err}`;
      try {
        const json = JSON.parse(err);
        detail = JSON.stringify(json, null, 2);
      } catch(e) {}
      throw new Error(detail);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // 保留最后一行（可能不完整）

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6));
            const delta = json.choices[0].delta;
            if (delta.content || delta.reasoning_content) {
              onChunk({
                content: delta.content || '',
                reasoning: delta.reasoning_content || ''
              });
            }
          } catch (e) {
            console.error('解析流数据出错', e, trimmed);
          }
        }
      }
    }
  }
};

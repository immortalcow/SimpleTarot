// ====== LLM API 模块 ====== //

// --- 提示词模板 ---
const TAROT_PROMPTS = {
  SYSTEM_ROLE: '你是一位经验丰富的塔罗牌占卜师。请用中文回答，语气温暖有洞察力，结合牌位含义分析。',
  
  // 单张牌详细解读
  SINGLE_CARD: (question, position, orient, name, en, interpret) => 
    `问题：「${question}」\n牌位：${position}\n方向：${orient}\n牌面：${name}（${en}）\n牌义：${interpret}\n请针对用户的问题，深入分析这张牌在特定牌位上的象征意义，并给出行动建议。控制在200字以内。`,
  
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
      const err = await resp.text().catch(() => '');
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

  // 调用聊天补全
  async chat(baseUrl, apiKey, model, systemPrompt, userPrompt, maxTokens) {
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
        temperature: 0.8
      })
    });
    if (!resp.ok) {
      const err = await resp.text().catch(() => '');
      throw new Error(`API 错误 (${resp.status}): ${err.substring(0,200)}`);
    }
    const data = await resp.json();
    return data.choices[0].message.content;
  }
};

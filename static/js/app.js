// ====== 塔罗占卜 - 核心逻辑 ====== //

// ---- State ----
const state = {
  question: '',
  spread: null,
  deck: [],        // [{id, reversed}]
  shuffled: false,
  cutPos: 0,
  selectedCards: [], // indices into deck
  revealed: [],      // [{cardObj, position, aiText}]
  aiEnabled: false,
  apiBaseUrl: '',
  apiKey: '',
  apiModel: '',
  apiMaxTokens: 4096,
  history: [],        // loaded from localStorage
};

// ---- Utils ----
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

function saveToHistory() {
  if (state.revealed.length === 0) return;
  const entry = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    question: state.question,
    spreadName: state.spread ? state.spread.name : '',
    revealed: state.revealed.map(r => ({
      id: r.id,
      reversed: r.reversed,
      position: r.position
    })),
    overallAI: state.overallAI || '',
    overallReasoning: state.overallReasoning || ''
  };
  
  // 避免同一占卜多次保存（例如重复点击AI解读后）
  const existingIndex = state.history.findIndex(h => 
    h.question === entry.question && 
    JSON.stringify(h.revealed) === JSON.stringify(entry.revealed)
  );
  
  if (existingIndex !== -1) {
    state.history[existingIndex] = entry;
  } else {
    state.history.unshift(entry);
  }
  
  localStorage.setItem('tarot_history', JSON.stringify(state.history));
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('historyList');
  if (state.history.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-dimmer);margin-top:20px;">暂无历史记录</p>';
    return;
  }
  
  container.innerHTML = state.history.map(h => `
    <div class="history-item" onclick="loadHistory(${h.id})">
      <span class="history-item-del" onclick="deleteHistory(event, ${h.id})">🗑️</span>
      <div class="history-date">${h.date}</div>
      <div class="history-question">${escHtml(h.question)}</div>
      <div class="history-spread">${escHtml(h.spreadName)}</div>
    </div>
  `).join('');
}

function loadHistory(id) {
  const h = state.history.find(item => item.id === id);
  if (!h) return;
  
  state.question = h.question;
  state.spread = SPREADS.find(s => s.name === h.spreadName) || SPREADS[0];
  state.revealed = h.revealed;
  state.overallAI = h.overallAI;
  state.overallReasoning = h.overallReasoning;
  
  document.getElementById('questionInput').value = state.question;
  renderReveal();
  showStep(4);
  
  if (state.overallAI) {
    const overall = document.getElementById('overallReading');
    overall.style.display = 'block';
    
    let reasoningHtml = '';
    if (state.overallReasoning) {
      reasoningHtml = `
        <div class="reasoning-block" id="reasoningBlock">
          <div class="reasoning-header" onclick="this.parentElement.classList.toggle('open')">
            <span>🤔 思考过程</span>
            <span>▼</span>
          </div>
          <div class="reasoning-content" id="reasoningContent">${escHtml(state.overallReasoning)}</div>
        </div>`;
    }
    
    overall.innerHTML = `
      <h3>🔮 综合解读</h3>
      ${reasoningHtml}
      <div class="content" id="readingContent">${MarkdownParser.parse(state.overallAI)}</div>
    `;
  } else {
    document.getElementById('overallReading').style.display = 'none';
  }
  
  toggleSidebar();
}

function deleteHistory(event, id) {
  event.stopPropagation();
  if (!confirm('确定要删除这条记录吗？')) return;
  state.history = state.history.filter(h => h.id !== id);
  localStorage.setItem('tarot_history', JSON.stringify(state.history));
  renderHistory();
}

function setCookie(name, value, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

let shuffleCount = 0;

// ---- Init ----
(function init() {
  try {
    // 优先从 Cookie 读取，降级从 localStorage 读取
    let cfgStr = getCookie('tarot_api_config');
    if (!cfgStr) {
      cfgStr = localStorage.getItem('tarot_api_config');
    }
    
    if (cfgStr) {
      // 自动迁移或刷新 Cookie 有效期（延长 30 天）
      setCookie('tarot_api_config', cfgStr, 30);
    }
    
    const cfg = JSON.parse(cfgStr || '{}');
    state.apiBaseUrl = cfg.baseUrl || '';
    state.apiKey = cfg.apiKey || '';
    state.apiModel = cfg.model || '';
    state.apiMaxTokens = cfg.maxTokens || 4096;
    state.aiEnabled = !!(state.apiKey && state.apiBaseUrl);

    state.history = JSON.parse(localStorage.getItem('tarot_history') || '[]');
  } catch(e) {}
  renderSettingsFields();
  updateApiUI();
  renderHistory();
  
  showStep(1);
})();

// ---- Settings ----
function renderSettingsFields() {
  document.getElementById('apiBaseUrl').value = state.apiBaseUrl;
  document.getElementById('apiKey').value = state.apiKey;
  document.getElementById('apiMaxTokens').value = state.apiMaxTokens;
  const sel = document.getElementById('apiModel');
  sel.innerHTML = state.apiModel 
    ? `<option value="${escHtml(state.apiModel)}">${escHtml(state.apiModel)}</option>`
    : '<option value="">-- 请先获取 --</option>';
}
function toggleSettings() {
  document.getElementById('settingsPanel').classList.toggle('show');
  document.getElementById('btnSettings').classList.toggle('active');
}
function saveApiConfig() {
  state.apiBaseUrl = document.getElementById('apiBaseUrl').value.trim();
  state.apiKey = document.getElementById('apiKey').value.trim();
  state.apiModel = document.getElementById('apiModel').value || '';
  state.apiMaxTokens = parseInt(document.getElementById('apiMaxTokens').value) || 4096;
  state.aiEnabled = !!(state.apiKey && state.apiBaseUrl);

  const config = {
    baseUrl: state.apiBaseUrl,
    apiKey: state.apiKey,
    model: state.apiModel,
    maxTokens: state.apiMaxTokens
  };

  // 保存到 Cookie (30天有效期)
  setCookie('tarot_api_config', JSON.stringify(config), 30);
  // 同时同步到 localStorage 作为备份
  localStorage.setItem('tarot_api_config', JSON.stringify(config));

  updateApiUI();
  showToast(state.aiEnabled ? '✅ AI 已启用' : '💾 已保存（AI 未启用）');
}
async function fetchModels() {
  const baseUrl = document.getElementById('apiBaseUrl').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  if (!baseUrl || !apiKey) { showToast('请先填写 BASE_URL 和 API_KEY'); return; }
  const btn = document.getElementById('btnFetchModels');
  btn.disabled = true;
  btn.textContent = '获取中...';
  try {
    const models = await TarotAPI.fetchModels(baseUrl, apiKey);
    const sel = document.getElementById('apiModel');
    sel.innerHTML = models.map(m => `<option value="${escHtml(m)}" ${m===state.apiModel?'selected':''}>${escHtml(m)}</option>`).join('');
    if (models.length > 0 && !state.apiModel) {
      state.apiModel = models[0];
    }
    showToast(`✅ 获取到 ${models.length} 个模型`);
  } catch(e) {
    showToast('❌ ' + e.message);
  }
  btn.disabled = false;
  btn.textContent = '📡 获取模型列表';
}
function updateApiUI() {
  document.getElementById('apiStatus').textContent = state.aiEnabled ? '✅ AI 已启用' : '⚪ AI 未启用';
  document.getElementById('apiStatus').style.color = state.aiEnabled ? '#8f8' : '#8878b0';
}

// ---- Navigation ----
function showStep(n) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById('step' + i);
    if (el) el.style.display = (i === n) ? '' : 'none';
  }
  if (n === 4) {
    saveToHistory();
  }
}
function goBackToStep1() {
  state.shuffled = false;
  state.selectedCards = [];
  shuffleCount = 0;
  showStep(1);
}

// ---- Step 1: Question + Spread ----
function renderSpreads() {
  const grid = document.getElementById('spreadGrid');
  grid.innerHTML = SPREADS.map((s, i) => `
    <div class="spread-option" id="spread${i}" onclick="selectSpread(${i})">
      <div class="spread-name">${s.name}</div>
      <div class="spread-cards">🃏 × ${s.positions.length} 张</div>
      <div class="spread-desc">${s.desc}</div>
    </div>
  `).join('');
  state.spread = null;
  document.getElementById('btnStartShuffle').disabled = true;
}
renderSpreads();

function selectSpread(i) {
  state.spread = SPREADS[i];
  document.querySelectorAll('.spread-option').forEach((el, j) => el.classList.toggle('selected', j === i));
  document.getElementById('btnStartShuffle').disabled = false;
}

function goToStep2() {
  const q = document.getElementById('questionInput').value.trim();
  if (!q) { showToast('请先输入你的问题~'); return; }
  if (!state.spread) { showToast('请选择牌型~'); return; }
  state.question = q;
  state.deck = Object.keys(CARD_MEANINGS).map(id => ({ id, reversed: false }));
  state.shuffled = false;
  state.selectedCards = [];
  state.revealed = [];
  shuffleCount = 0;
  document.getElementById('shuffleCount').textContent = '点击牌堆洗牌 — 建议至少7次';
  document.getElementById('shuffleDeck').classList.remove('shuffling');
  document.getElementById('shuffleArea').style.display = '';
  document.getElementById('cutArea').style.display = 'none';
  document.getElementById('cutSlider').value = Math.floor(state.deck.length / 2);
  document.getElementById('cutSlider').max = state.deck.length - 1;
  document.getElementById('cutInfo').textContent = `切牌位置: 第 ${Math.floor(state.deck.length/2)} 张`;
  showStep(2);
}

// ---- Step 2: Shuffle & Cut ----
function doShuffle() {
  const deck = state.deck;
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  // Randomize upright/reversed for each card
  deck.forEach(c => { c.reversed = Math.random() < 0.5; });
  shuffleCount++;
  state.shuffled = true;
  document.getElementById('shuffleCount').textContent = `已洗牌 ${shuffleCount} 次`;
  const sd = document.getElementById('shuffleDeck');
  sd.classList.add('shuffling');
  setTimeout(() => sd.classList.remove('shuffling'), 300);
  if (shuffleCount >= 7) {
    document.getElementById('shuffleArea').style.display = 'none';
    document.getElementById('cutArea').style.display = '';
  }
}
function updateCutPreview() {
  const pos = parseInt(document.getElementById('cutSlider').value);
  document.getElementById('cutInfo').textContent = `切牌位置: 第 ${pos} 张（共${state.deck.length}张）`;
}
function confirmCut() {
  const pos = parseInt(document.getElementById('cutSlider').value);
  state.cutPos = pos;
  state.deck.push(...state.deck.splice(0, pos));
  showToast('✅ 切牌完成');
  goToStep3();
}

// ---- Step 3: Select Cards ----
function goToStep3() {
  showStep(3);
  document.getElementById('selectCount').textContent = `0/${state.spread.positions.length}`;
  state.selectedCards = [];
  renderCardSelection();
}
function renderCardSelection() {
  const grid = document.getElementById('cardSelectGrid');
  const rows = 6;
  const cardsPerRow = 13;
  let html = '';
  for (let r = 0; r < rows; r++) {
    html += '<div class="card-row">';
    for (let c = 0; c < cardsPerRow; c++) {
      const i = r * cardsPerRow + c;
      const chosen = state.selectedCards.includes(i);
      html += `<div class="card-slot${chosen ? ' chosen' : ''}" id="slot${i}" onclick="pickCard(${i})">
        <img src="static/cards/card-back.svg" alt="牌${i+1}">
      </div>`;
    }
    html += '</div>';
  }
  grid.innerHTML = html;
  document.getElementById('selectCount').textContent = `${state.selectedCards.length}/${state.spread.positions.length}`;
}
function pickCard(i) {
  if (state.selectedCards.includes(i)) return;
  if (state.selectedCards.length >= state.spread.positions.length) return;
  state.selectedCards.push(i);
  renderCardSelection();
  if (state.selectedCards.length >= state.spread.positions.length) {
    setTimeout(() => goToStep4(), 500);
  }
}

// ---- Step 4: Reveal ----
function goToStep4() {
  showStep(4);
  const picks = state.selectedCards.map(idx => state.deck[idx]);
  state.revealed = picks.map((card, i) => ({
    id: card.id,
    reversed: card.reversed,
    position: state.spread.positions[i] || `位置${i + 1}`
  }));
  renderReveal();
}
function renderReveal() {
  const area = document.getElementById('revealArea');
  area.innerHTML = state.revealed.map((r, i) => {
    const meaning = CARD_MEANINGS[r.id];
    if (!meaning) return '';
    const name = meaning.cn || r.id;
    const en = meaning.en || '';
    const text = r.reversed ? meaning.reversed : meaning.upright;
    const orientClass = r.reversed ? 'reversed' : 'upright';
    const orientLabel = r.reversed ? '逆位' : '正位';
    return `
    <div class="reveal-card" id="reveal${i}">
      <img src="static/cards/${r.id}.jpg" alt="${name}"
           class="${r.reversed ? 'reversed-img' : ''}"
           onerror="this.onerror=null;this.src='static/cards/card-back.svg';">
      <div class="card-info">
        <div class="card-name">${name} <span style="font-size:0.8em;color:var(--text-dim)">${en}</span>
          <span class="card-orientation ${orientClass}">${orientLabel}</span>
        </div>
        <div class="card-position">📍 ${r.position}</div>
        <div class="card-meaning">${text}</div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('btnOverallReading').style.display = state.aiEnabled ? 'inline-block' : 'none';
  document.getElementById('overallReading').style.display = 'none';
}

// ---- AI Integration ----
function toggleReasoning(el) {
  el.closest('.reasoning-block').classList.toggle('open');
}

async function doOverallReading() {
  if (!state.aiEnabled) { showToast('请先在设置中配置 AI'); return; }
  const area = document.getElementById('overallReading');
  area.style.display = 'block';
  area.innerHTML = `<h3>🔮 AI 解读</h3>
    <div class="reasoning-block" id="reasoningBlock" style="display:none;">
      <div class="reasoning-header" onclick="toggleReasoning(this)">
        <span>🤔 思考过程</span>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="reasoning-content" id="reasoningContent"></div>
    </div>
    <div class="content" id="readingContent"><span class="loading"></span> 连结中...</div>`;
  
  const readingContent = document.getElementById('readingContent');
  const reasoningBlock = document.getElementById('reasoningBlock');
  const reasoningContent = document.getElementById('reasoningContent');
  
  let fullContent = '';
  let fullReasoning = '';

  try {
    let cardsInfo = state.revealed.map((r, i) => {
      const m = CARD_MEANINGS[r.id];
      const orient = r.reversed ? '逆位' : '正位';
      return `[${r.position}] ${m.cn}（${m.en}）- ${orient}`;
    }).join('\n');
    
    const prompt = TAROT_PROMPTS.OVERALL_READING(state.question, state.spread.name, state.spread.positions.length, cardsInfo);
    
    await TarotAPI.streamChat(
      state.apiBaseUrl, state.apiKey, state.apiModel,
      TAROT_PROMPTS.SYSTEM_ROLE,
      prompt, state.apiMaxTokens,
      (chunk) => {
        if (chunk.reasoning) {
          if (fullReasoning === '') reasoningBlock.style.display = 'block';
          fullReasoning += chunk.reasoning;
          reasoningContent.textContent = fullReasoning;
        }
        if (chunk.content) {
          if (fullContent === '') readingContent.innerHTML = '';
          fullContent += chunk.content;
          readingContent.innerHTML = MarkdownParser.parse(fullContent);
        }
      }
    );
    state.overallAI = fullContent;
    state.overallReasoning = fullReasoning;
    saveToHistory(); // AI 解读完成后再自动保存一次以包含解读内容
  } catch(e) {
    readingContent.innerHTML = `<div class="error-panel">
      <div class="error-header">❌ 调用 API 出错</div>
      <div style="margin: 8px 0; max-height: 200px; overflow-y: auto;">${escHtml(e.message)}</div>
      <button class="btn-copy-error" onclick="copyToClipboard(this.previousElementSibling.textContent)">复制完整错误信息</button>
    </div>`;
  }
}

// ---- Reset ----
function resetAll() {
  if (confirm('确定要重新开始吗？当前记录将丢失。')) {
    location.reload();
  }
}

// ---- Utils ----
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

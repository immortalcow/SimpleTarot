// ====== 塔罗占卜 - 核心逻辑 ====== //

// ---- State ----
const state = {
  question: '',
  spread: null,
  deck: [],        // [{id, reversed}]
  shuffled: false,
  cutPos: 0,
  shuffleCount: 0,
  selectedCards: [], // indices into deck
  revealed: [],      // [{cardObj, position, flipped}]
  flippedCount: 0,   // Number of cards flipped in current session
  currentHistoryId: null, // ID of the currently loaded history item
  aiEnabled: false,
  apiBaseUrl: '',
  apiKey: '',
  apiModel: '',
  apiMaxTokens: 4096,
  divinerStyles: ['normal'], // 数组，支持多选
  personas: {},              // 从 localStorage 加载或初始化
  includeMinorArcana: true,
  history: [],        // loaded from localStorage
};

// ---- Utils ----
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

function saveToHistory() {
  if (state.revealed.length === 0) return;

  // 这里的比对逻辑排除 flipped 状态，只看问题和抽中的牌组（ID、位置、正逆位）是否一致
  const identity = r => ({ id: r.id, pos: r.position, rev: r.reversed });
  const entryRevealedIdentity = JSON.stringify(state.revealed.map(identity));

  const existingIndex = state.history.findIndex(h =>
    h.question === state.question &&
    JSON.stringify(h.revealed.map(identity)) === entryRevealedIdentity
  );

  const entry = {
    id: existingIndex !== -1 ? state.history[existingIndex].id : Date.now(),
    date: existingIndex !== -1 ? state.history[existingIndex].date : new Date().toLocaleString(),
    question: state.question,
    spreadName: state.spread ? state.spread.name : '',
    revealed: state.revealed.map(r => ({
      id: r.id,
      reversed: r.reversed,
      position: r.position,
      flipped: r.flipped || false
    })),
    flippedCount: state.flippedCount,
    readings: state.readings || [] // 存储多个人设的解读结果
  };

  state.currentHistoryId = entry.id;

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
    container.innerHTML = '<p style="text-align:center;color:var(--text-dimmer);margin-top:20px;font-size:0.9em;">暂无历史记录</p>';
    return;
  }

  container.innerHTML = state.history.map(h => `
    <div class="history-item" onclick="loadHistory(${h.id})">
      <div class="history-date">${h.date}</div>
      <div class="history-question">${escHtml(h.question)}</div>
      <div class="history-spread">${escHtml(h.spreadName)}</div>
      <span class="history-item-del" onclick="deleteHistory(event, ${h.id})" title="删除记录">🗑️</span>
    </div>
  `).join('');
}

function loadHistory(id) {
  const h = state.history.find(item => item.id === id);
  if (!h) return;

  state.currentHistoryId = id;
  state.question = h.question;

  // 查找牌阵，若不存在则提示错误而非暴力回退
  const foundSpread = SPREADS.find(s => s.name === h.spreadName);
  if (!foundSpread) {
    showToast(`❌ 牌阵 "${h.spreadName}" 已弃用或不存在，无法加载`);
    return;
  }
  state.spread = foundSpread;

  state.revealed = h.revealed;
  state.flippedCount = h.flippedCount || 0;
  state.readings = h.readings || [];

  document.getElementById('questionInput').value = state.question;
  document.getElementById('questionInput').disabled = true;
  document.getElementById('btnRestartArea').style.display = 'flex';

  renderReveal();
  showStep(4);

  const overall = document.getElementById('overallReading');
  if (state.readings && state.readings.length > 0) {
    overall.style.display = 'block';
    overall.innerHTML = `<h3>🔮 综合解读</h3>` + state.readings.map((r, idx) => {
      let reasoningHtml = '';
      if (r.reasoning) {
        reasoningHtml = `
          <div class="reasoning-block">
            <div class="reasoning-header" onclick="toggleReasoning(this)">
              <span>🤔 思考过程</span>
              <span class="toggle-icon">▼</span>
            </div>
            <div class="reasoning-content">${escHtml(r.reasoning)}</div>
          </div>`;
      }
      return `
        <div class="reading-item">
          <h4>
            <span>${escHtml(r.personaName)} 的解读</span>
            <span class="persona-tag">${escHtml(r.personaId)}</span>
          </h4>
          ${reasoningHtml}
          <div class="content">${MarkdownParser.parse(r.content)}</div>
        </div>
      `;
    }).join('');
  } else {
    overall.style.display = 'none';
  }

  toggleSidebar();
}

function deleteHistory(event, id) {
  event.stopPropagation();
  if (!confirm('确定要删除这条记录吗？')) return;

  const isDeletingCurrent = (id === state.currentHistoryId);

  state.history = state.history.filter(h => h.id !== id);
  localStorage.setItem('tarot_history', JSON.stringify(state.history));
  renderHistory();

  if (isDeletingCurrent) {
    resetAll();
  }
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
    state.divinerStyles = Array.isArray(cfg.divinerStyles) ? cfg.divinerStyles : ['normal'];
    state.aiEnabled = !!(state.apiKey && state.apiBaseUrl);

    // 加载人设
    const savedPersonas = localStorage.getItem('tarot_personas');
    if (savedPersonas) {
      state.personas = JSON.parse(savedPersonas);
    } else {
      state.personas = JSON.parse(JSON.stringify(DIVINER_PERSONAS));
      localStorage.setItem('tarot_personas', JSON.stringify(state.personas));
    }

    // 加载包含小阿尔卡纳的设定
    const minorCookie = getCookie('tarot_minor_arcana');
    state.includeMinorArcana = (minorCookie !== 'false'); // 默认 true
    const checkEl = document.getElementById('includeMinorArcana');
    if (checkEl) checkEl.checked = state.includeMinorArcana;

    state.history = JSON.parse(localStorage.getItem('tarot_history') || '[]');
  } catch (e) {
    console.error('Initialization failed:', e);
    showToast('⚠️ 配置加载失败，已重置');
  }
  renderSettingsFields();
  updateSaveButtonState();
  renderHistory();

  showStep(1);
})();

// ---- Settings ----
function renderSettingsFields() {
  renderStyleDropdown();

  document.getElementById('apiBaseUrl').value = state.apiBaseUrl;
  document.getElementById('apiKey').value = state.apiKey;
  document.getElementById('apiMaxTokens').value = state.apiMaxTokens;

  const sel = document.getElementById('apiModel');
  sel.innerHTML = state.apiModel
    ? `<option value="${escHtml(state.apiModel)}">${escHtml(state.apiModel)}</option>`
    : '<option value="">-- 请先获取 --</option>';
}

function renderStyleDropdown() {
  const container = document.getElementById('styleDropdown');
  if (!container) return;

  container.innerHTML = Object.entries(state.personas).map(([id, p]) => `
    <div class="style-option" onclick="toggleStyleSelect(event, '${id}')">
      <input type="checkbox" id="check_${id}" ${state.divinerStyles.includes(id) ? 'checked' : ''} onclick="event.stopPropagation(); onStyleCheckChange()">
      <span class="style-name">${escHtml(p.name)}</span>
    </div>
  `).join('');

  updateSelectedStylesText();
}

function toggleMultiSelect() {
  document.getElementById('styleDropdown').classList.toggle('show');
}

function toggleStyleSelect(event, id) {
  const checkbox = document.getElementById(`check_${id}`);
  checkbox.checked = !checkbox.checked;
  onStyleCheckChange();
}

function onStyleCheckChange() {
  const selected = [];
  Object.keys(state.personas).forEach(id => {
    const cb = document.getElementById(`check_${id}`);
    if (cb && cb.checked) {
      selected.push(id);
    }
  });
  updateSelectedStylesText(selected);
  checkSettingsChanged();
}

function updateSelectedStylesText(selectedIds) {
  if (selectedIds === undefined) {
    selectedIds = state.divinerStyles.filter(id => state.personas[id]);
  }
  const names = selectedIds.map(id => state.personas[id] ? state.personas[id].name : id);
  const display = names.length > 0 ? names.join(', ') : '选择占卜师 (0)';
  document.getElementById('selectedStylesText').textContent = display;
}

// 点击外部关闭下拉
window.addEventListener('click', (e) => {
  if (!e.target.closest('.multi-select-container')) {
    const dropdown = document.getElementById('styleDropdown');
    if (dropdown) dropdown.classList.remove('show');
  }
});

// ---- Persona Manager ----
function showPersonaManager() {
  renderPersonaList();
  document.getElementById('personaModalOverlay').classList.add('show');
}

function closePersonaManager() {
  document.getElementById('personaModalOverlay').classList.remove('show');
}

function renderPersonaList() {
  const container = document.getElementById('personaList');
  container.innerHTML = Object.entries(state.personas).map(([id, p]) => `
    <div class="persona-item" data-id="${id}">
      <button class="btn-del-persona" onclick="deletePersona('${id}')">🗑️ 删除</button>
      <div class="settings-row">
        <label>名称</label>
        <input class="p-name" value="${escHtml(p.name)}" placeholder="人设名称">
      </div>
      <div class="settings-row">
        <label>Prompt</label>
        <textarea class="p-prompt" placeholder="占卜师人设提示词">${escHtml(p.prompt)}</textarea>
      </div>
    </div>
  `).join('');
}

function addEmptyPersona() {
  const id = 'p_' + Date.now();
  const newItem = document.createElement('div');
  newItem.className = 'persona-item';
  newItem.dataset.id = id;
  newItem.innerHTML = `
    <button class="btn-del-persona" onclick="deletePersona('${id}')">🗑️ 删除</button>
    <div class="settings-row">
      <label>名称</label>
      <input class="p-name" value="" placeholder="新的人设">
    </div>
    <div class="settings-row">
      <label>Prompt</label>
      <textarea class="p-prompt" placeholder="占卜师人设提示词"></textarea>
    </div>
  `;
  document.getElementById('personaList').appendChild(newItem);
  newItem.scrollIntoView({ behavior: 'smooth' });
}

function deletePersona(id) {
  const item = document.querySelector(`.persona-item[data-id="${id}"]`);
  if (item) item.remove();
}

function resetPersonas() {
  if (!confirm('确定要重置所有人设为默认设置吗？已选中的人设可能需要重新选择。')) return;
  state.personas = JSON.parse(JSON.stringify(DIVINER_PERSONAS));
  localStorage.setItem('tarot_personas', JSON.stringify(state.personas));
  
  // 重置后重新加载列表
  renderPersonaList();
  
  // 关键：同步更新下拉列表
  state.divinerStyles = state.divinerStyles.filter(id => state.personas[id]);
  if (state.divinerStyles.length === 0) {
    state.divinerStyles = ['normal'];
  }
  renderStyleDropdown();
  
  showToast('🔄 已重置为默认人设');
}

function savePersonas() {
  const newPersonas = {};
  const items = document.querySelectorAll('.persona-item');
  items.forEach(item => {
    const id = item.dataset.id;
    const name = item.querySelector('.p-name').value.trim();
    const prompt = item.querySelector('.p-prompt').value.trim();
    if (name) {
      newPersonas[id] = { name, prompt };
    }
  });

  if (Object.keys(newPersonas).length === 0) {
    showToast('❌ 至少需要保留一个人设');
    return;
  }

  state.personas = newPersonas;
  localStorage.setItem('tarot_personas', JSON.stringify(state.personas));
  
  // 过滤掉已经不存在的已选中人设
  state.divinerStyles = state.divinerStyles.filter(id => state.personas[id]);
  if (state.divinerStyles.length === 0) {
    state.divinerStyles = [Object.keys(state.personas)[0]];
  }

  renderStyleDropdown();
  closePersonaManager();
  checkSettingsChanged();
  showToast('✅ 人设已更新');
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
  
  // 获取多选的人设
  const selected = [];
  Object.keys(state.personas).forEach(id => {
    if (document.getElementById(`check_${id}`).checked) {
      selected.push(id);
    }
  });
  state.divinerStyles = selected.length > 0 ? selected : ['normal'];
  
  state.aiEnabled = !!(state.apiKey && state.apiBaseUrl);

  const config = {
    baseUrl: state.apiBaseUrl,
    apiKey: state.apiKey,
    model: state.apiModel,
    maxTokens: state.apiMaxTokens,
    divinerStyles: state.divinerStyles
  };

  // 保存到 Cookie (30天有效期)
  setCookie('tarot_api_config', JSON.stringify(config), 30);
  // 同时同步到 localStorage 作为备份
  localStorage.setItem('tarot_api_config', JSON.stringify(config));

  updateSaveButtonState();
  showToast(state.aiEnabled ? '✅ AI 已启用' : '💾 已保存（AI 未启用）');
}
function checkSettingsChanged() {
  const selected = [];
  const personaIds = Object.keys(state.personas);
  personaIds.forEach(id => {
    const el = document.getElementById(`check_${id}`);
    if (el && el.checked) selected.push(id);
  });

  const current = {
    baseUrl: document.getElementById('apiBaseUrl').value.trim(),
    apiKey: document.getElementById('apiKey').value.trim(),
    model: document.getElementById('apiModel').value || '',
    maxTokens: parseInt(document.getElementById('apiMaxTokens').value) || 4096,
    divinerStyles: selected
  };

  const hasChanged = 
    current.baseUrl !== state.apiBaseUrl ||
    current.apiKey !== state.apiKey ||
    current.model !== state.apiModel ||
    current.maxTokens !== state.apiMaxTokens ||
    JSON.stringify(current.divinerStyles) !== JSON.stringify(state.divinerStyles);

  updateSaveButtonState(hasChanged);
}

function updateSaveButtonState(hasChanged = false) {
  const btn = document.getElementById('saveConfigBtn');
  if (!btn) return;
  btn.disabled = !hasChanged;
  btn.classList.toggle('unsaved', hasChanged);
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
    sel.innerHTML = models.map(m => `<option value="${escHtml(m)}" ${m === state.apiModel ? 'selected' : ''}>${escHtml(m)}</option>`).join('');
    
    // 只有在当前没有选中模型且获取到列表时，才默认选中第一个，但不立即修改 state
    if (models.length > 0 && !document.getElementById('apiModel').value) {
      document.getElementById('apiModel').value = models[0];
    }
    checkSettingsChanged();
    showToast(`✅ 获取到 ${models.length} 个模型`);
  } catch (e) {
    showToast('❌ ' + e.message);
  }
  btn.disabled = false;
  btn.textContent = '📡 获取模型列表';
}
function onMinorArcanaChange() {
  state.includeMinorArcana = document.getElementById('includeMinorArcana').checked;
  setCookie('tarot_minor_arcana', state.includeMinorArcana.toString(), 30);
}

// ---- Step 1: Question + Spread ----
function showStep(n) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById('step' + i);
    if (el) el.style.display = (i === n) ? '' : 'none';
  }
}
function goBackToStep1() {
  state.shuffled = false;
  state.selectedCards = [];
  state.shuffleCount = 0;

  // 重新启用问题输入
  document.getElementById('questionInput').disabled = false;
  document.getElementById('btnRestartArea').style.display = 'none';

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

  // 禁用问题输入并显示重新开始按钮
  document.getElementById('questionInput').disabled = true;
  document.getElementById('btnRestartArea').style.display = 'flex';

  // 根据设定初始化牌堆
  let cardIds = Object.keys(CARD_MEANINGS);
  if (!state.includeMinorArcana) {
    cardIds = cardIds.filter(id => CARD_MEANINGS[id].type === 'major');
  }
  state.deck = cardIds.map(id => ({ id, reversed: false }));

  state.shuffled = false;
  state.selectedCards = [];
  state.revealed = [];
  state.shuffleCount = 0;
  document.getElementById('shuffleCount').textContent = '点击牌堆洗牌 — 建议至少7次';
  document.getElementById('shuffleDeck').classList.remove('shuffling');
  document.getElementById('shuffleArea').style.display = '';
  document.getElementById('cutArea').style.display = 'none';
  document.getElementById('cutSlider').value = Math.floor(state.deck.length / 2);
  document.getElementById('cutSlider').max = state.deck.length - 1;
  document.getElementById('cutInfo').textContent = `切牌位置: 第 ${Math.floor(state.deck.length / 2)} 张`;
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
  state.shuffleCount++;
  state.shuffled = true;
  document.getElementById('shuffleCount').textContent = `已洗牌 ${state.shuffleCount} 次`;
  const sd = document.getElementById('shuffleDeck');
  sd.classList.add('shuffling');
  setTimeout(() => sd.classList.remove('shuffling'), 300);
  if (state.shuffleCount >= 7) {
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
  let rows = 6;
  let cardsPerRow = 13;

  if (!state.includeMinorArcana) {
    rows = 2;
    cardsPerRow = 11;
  }

  let html = '';
  for (let r = 0; r < rows; r++) {
    html += '<div class="card-row">';
    for (let c = 0; c < cardsPerRow; c++) {
      const i = r * cardsPerRow + c;
      if (i >= state.deck.length) break; // 防止越界，虽然这里的行回控制好
      const chosen = state.selectedCards.includes(i);
      html += `<div class="card-slot${chosen ? ' chosen' : ''}" id="slot${i}" onclick="pickCard(${i})">
        <img src="static/cards/card-back.svg" alt="牌${i + 1}">
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
    position: state.spread.positions[i].name,
    flipped: false
  }));
  state.flippedCount = 0;
  renderReveal();
}

function renderReveal() {
  const layout = document.getElementById('spreadLayout');
  const spread = state.spread;

  // Configure Grid
  layout.style.gridTemplateRows = `repeat(${spread.grid.rows}, 180px)`;
  layout.style.gridTemplateColumns = `repeat(${spread.grid.cols}, 110px)`;

  layout.innerHTML = state.revealed.map((r, i) => {
    const posCfg = spread.positions[i];
    const row = posCfg.row || 1;
    const col = posCfg.col || 1;
    const offset = posCfg.offset || { x: 0, y: 0 };
    const rotation = posCfg.rotate || 0;

    // 决定是否是“下一个待翻牌”
    const isNext = (i === state.flippedCount);
    const isFlipped = r.flipped;

    return `
      <div class="spread-item ${isFlipped ? 'flipped' : ''} ${isNext ? 'next-to-flip' : ''}" 
           id="spreadItem${i}"
           style="grid-row: ${row}; grid-column: ${col}; transform: translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg);"
           onclick="handleCardClick(${i})">
        <div class="card-inner">
          <div class="card-back">
            <img src="static/cards/card-back.svg" alt="背面">
          </div>
          <div class="card-front ${r.reversed ? 'reversed' : ''}">
            <img src="static/cards/${r.id}.jpg" alt="${r.id}" 
                 onerror="this.onerror=null;this.src='static/cards/card-back.svg';">
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateRevealUI();
  saveToHistory();
}

function handleCardClick(i) {
  const card = state.revealed[i];

  // 如果是按顺序待翻开的牌
  if (i === state.flippedCount && !card.flipped) {
    card.flipped = true;
    state.flippedCount++;
    renderReveal(); // 重新渲染以更新状态和高亮
    showCardDetail(i);
  }
  // 如果是已经翻开的牌，点击查看详情
  else if (card.flipped) {
    showCardDetail(i);
  }
}

function showCardDetail(i) {
  const r = state.revealed[i];
  const meaning = CARD_MEANINGS[r.id];
  if (!meaning) return;

  const overlay = document.getElementById('cardDetailModalOverlay');
  const detailPos = document.getElementById('modalDetailPos');
  const detailName = document.getElementById('modalDetailName');
  const detailOrient = document.getElementById('modalDetailOrient');
  const detailMeaning = document.getElementById('modalDetailMeaning');
  const detailKeywords = document.getElementById('modalDetailKeywords');
  const detailCommon = document.getElementById('modalDetailCommon');

  detailPos.textContent = `📍 ${r.position}`;
  detailName.textContent = meaning.cn;
  detailOrient.textContent = r.reversed ? '逆位' : '正位';
  detailOrient.className = `detail-orient ${r.reversed ? 'reversed' : 'upright'}`;
  detailMeaning.textContent = r.reversed ? meaning.reversed : meaning.upright;
  detailKeywords.textContent = meaning.keywords || '无';
  detailCommon.textContent = meaning.common || '无';

  overlay.classList.add('show');

  // 高亮当前选中的牌
  document.querySelectorAll('.spread-item').forEach((el, idx) => {
    el.classList.toggle('active-detail', idx === i);
  });
}

function closeCardDetail() {
  document.getElementById('cardDetailModalOverlay').classList.remove('show');
}

function updateRevealUI() {
  const allFlipped = state.flippedCount >= state.revealed.length;
  const actionsArea = document.getElementById('aiReadingActions');
  if (actionsArea) {
    actionsArea.style.display = (allFlipped && state.aiEnabled) ? 'flex' : 'none';
  }

  if (allFlipped && (state.readings && state.readings.length > 0)) {
    document.getElementById('overallReading').style.display = 'block';
  }
}

// ---- AI Integration ----
function toggleReasoning(el) {
  el.closest('.reasoning-block').classList.toggle('open');
}

async function doOverallReading() {
  if (!state.aiEnabled) { showToast('请先在设置中配置 AI'); return; }
  if (!state.divinerStyles || state.divinerStyles.length === 0) {
    showToast('请至少选择一个人设');
    return;
  }

  const area = document.getElementById('overallReading');
  area.style.display = 'block';
  area.innerHTML = `<h3>🔮 AI 解读</h3><div id="readingsContainer"></div>`;
  const container = document.getElementById('readingsContainer');

  state.readings = [];
  
  let cardIds = state.revealed.map((r, i) => {
    const m = CARD_MEANINGS[r.id];
    const orient = r.reversed ? '逆位' : '正位';
    const detail = r.reversed ? m.reversed : m.upright;
    return `[${r.position}] ${m.cn}（${m.en}）- ${orient}
关键词：${m.keywords}
提示：${detail}
通用背景：${m.common}`;
  }).join('\n\n');

  const userPrompt = TAROT_PROMPTS.OVERALL_READING(state.question, state.spread.name, state.spread.positions.length, cardIds);

  const tasks = state.divinerStyles.map(async (styleId) => {
    const persona = state.personas[styleId] || state.personas['normal'] || { name: '未知', prompt: '' };
    
    // 创建 UI
    const itemEl = document.createElement('div');
    itemEl.className = 'reading-item';
    itemEl.innerHTML = `
      <h4>
        <span>${escHtml(persona.name)} 的解读</span>
        <span class="persona-tag">${escHtml(styleId)}</span>
      </h4>
      <div class="reasoning-block" style="display:none;">
        <div class="reasoning-header" onclick="toggleReasoning(this)">
          <span>🤔 思考过程</span>
          <span class="toggle-icon">▼</span>
        </div>
        <div class="reasoning-content"></div>
      </div>
      <div class="content"><span class="loading"></span> 连结中...</div>
    `;
    container.appendChild(itemEl);

    const readingContent = itemEl.querySelector('.content');
    const reasoningBlock = itemEl.querySelector('.reasoning-block');
    const reasoningContent = itemEl.querySelector('.reasoning-content');

    let fullContent = '';
    let fullReasoning = '';
    
    const resultObj = {
      personaId: styleId,
      personaName: persona.name,
      content: '',
      reasoning: ''
    };
    state.readings.push(resultObj);

    try {
      await TarotAPI.streamChat(
        state.apiBaseUrl, state.apiKey, state.apiModel,
        persona.prompt,
        userPrompt, state.apiMaxTokens,
        (chunk) => {
          if (chunk.reasoning) {
            if (fullReasoning === '') reasoningBlock.style.display = 'block';
            fullReasoning += chunk.reasoning;
            reasoningContent.textContent = fullReasoning;
            resultObj.reasoning = fullReasoning;
          }
          if (chunk.content) {
            if (fullContent === '') readingContent.innerHTML = '';
            fullContent += chunk.content;
            readingContent.innerHTML = MarkdownParser.parse(fullContent);
            resultObj.content = fullContent;
          }
        }
      );
    } catch (e) {
      readingContent.innerHTML = `<div class="error-panel">
        <div class="error-header">❌ 调用 API 出错 (${escHtml(persona.name)})</div>
        <div style="margin: 8px 0; max-height: 200px; overflow-y: auto;">${escHtml(e.message)}</div>
      </div>`;
      resultObj.content = `Error: ${e.message}`;
    }
  });

  await Promise.all(tasks);
  saveToHistory(); // 全部完成后保存
}

// ---- Reset ----
function resetAll() {
  location.reload();
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
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

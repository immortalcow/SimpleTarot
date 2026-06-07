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
};

let shuffleCount = 0;

// ---- Init ----
(function init() {
  try {
    const cfg = JSON.parse(localStorage.getItem('tarot_api_config') || '{}');
    state.apiBaseUrl = cfg.baseUrl || '';
    state.apiKey = cfg.apiKey || '';
    state.apiModel = cfg.model || '';
    state.apiMaxTokens = cfg.maxTokens || 4096;
    state.aiEnabled = !!(state.apiKey && state.apiBaseUrl);
  } catch(e) {}
  renderSettingsFields();
  updateApiUI();
  showStep(1);
})();

// ---- Settings ----
function renderSettingsFields() {
  document.getElementById('apiBaseUrl').value = state.apiBaseUrl;
  document.getElementById('apiKey').value = state.apiKey;
  document.getElementById('apiMaxTokens').value = state.apiMaxTokens;
  updateModelSelect();
}
function updateModelSelect() {
  const sel = document.getElementById('apiModel');
  sel.innerHTML = '';
  if (state.apiModel) {
    sel.innerHTML = `<option value="${escHtml(state.apiModel)}">${escHtml(state.apiModel)}</option>`;
  } else {
    sel.innerHTML = '<option value="">-- 请先获取 --</option>';
  }
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
  localStorage.setItem('tarot_api_config', JSON.stringify({
    baseUrl: state.apiBaseUrl,
    apiKey: state.apiKey,
    model: state.apiModel,
    maxTokens: state.apiMaxTokens
  }));
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
}
function goBackToStep1() {
  state.deck = [];
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
  const top = state.deck.splice(0, pos);
  state.deck.push(...top);
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
  const count = 78; // 总共 78 张塔罗牌
  let html = '';
  for (let i = 0; i < count; i++) {
    const chosen = state.selectedCards.includes(i);
    html += `<div class="card-slot${chosen ? ' chosen' : ''}" id="slot${i}" onclick="pickCard(${i})">
      <img src="static/cards/card-back.svg" alt="牌${i+1}">
    </div>`;
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
    card,
    position: state.spread.positions[i] || `位置${i + 1}`,
    aiText: ''
  }));
  renderReveal();
}
function renderReveal() {
  const area = document.getElementById('revealArea');
  area.innerHTML = state.revealed.map((r, i) => {
    const meaning = CARD_MEANINGS[r.card.id];
    if (!meaning) return '';
    const name = meaning.cn || r.card.id;
    const en = meaning.en || '';
    const text = r.card.reversed ? meaning.reversed : meaning.upright;
    const orientClass = r.card.reversed ? 'reversed' : 'upright';
    const orientLabel = r.card.reversed ? '逆位' : '正位';
    return `
    <div class="reveal-card" id="reveal${i}">
      <img src="static/cards/${r.card.id}.jpg" alt="${name}"
           class="${r.card.reversed ? 'reversed-img' : ''}"
           onerror="this.onerror=null;this.src='static/cards/card-back.svg';">
      <div class="card-info">
        <div class="card-name">${name} <span style="font-size:0.8em;color:var(--text-dim)">${en}</span>
          <span class="card-orientation ${orientClass}">${orientLabel}</span>
        </div>
        <div class="card-position">📍 ${r.position}</div>
        <div class="card-meaning">${text}</div>
        ${state.aiEnabled ? `<button class="btn-small mt-8" onclick="doCardAI(${i})">🤖 AI 解析</button>` : ''}
        <div class="ai-interp" id="aiInterp${i}" style="display:none;">
          <div id="aiText${i}"></div>
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('btnOverallReading').style.display = state.aiEnabled ? 'inline-block' : 'none';
  document.getElementById('overallReading').style.display = 'none';
}

// ---- AI Integration ----
async function doCardAI(i) {
  const el = document.getElementById('aiInterp' + i);
  const txt = document.getElementById('aiText' + i);
  el.style.display = 'block';
  txt.innerHTML = '<span class="loading"></span> 解析中...';
  try {
    const r = state.revealed[i];
    const meaning = CARD_MEANINGS[r.card.id];
    const orient = r.card.reversed ? '逆位' : '正位';
    const interpret = r.card.reversed ? meaning.reversed : meaning.upright;
    const prompt = TAROT_PROMPTS.SINGLE_CARD(state.question, r.position, orient, meaning.cn, meaning.en, interpret);
    const result = await TarotAPI.chat(
      state.apiBaseUrl, state.apiKey, state.apiModel,
      TAROT_PROMPTS.SYSTEM_ROLE,
      prompt, state.apiMaxTokens
    );
    txt.innerHTML = MarkdownParser.parse(result);
    state.revealed[i].aiText = result;
  } catch(e) {
    txt.textContent = '❌ ' + e.message;
  }
}

async function doOverallReading() {
  if (!state.aiEnabled) { showToast('请先在设置中配置 AI'); return; }
  const area = document.getElementById('overallReading');
  area.style.display = 'block';
  area.innerHTML = '<h3>🔮 整体解读</h3><div class="content"><span class="loading"></span> 综合解析中...</div>';
  try {
    let cardsInfo = state.revealed.map((r, i) => {
      const m = CARD_MEANINGS[r.card.id];
      const orient = r.card.reversed ? '逆位' : '正位';
      return `[${r.position}] ${m.cn}（${m.en}）- ${orient}`;
    }).join('\n');
    const prompt = TAROT_PROMPTS.OVERALL_READING(state.question, state.spread.name, state.spread.positions.length, cardsInfo);
    const result = await TarotAPI.chat(
      state.apiBaseUrl, state.apiKey, state.apiModel,
      TAROT_PROMPTS.SYSTEM_ROLE,
      prompt, state.apiMaxTokens
    );
    area.innerHTML = `<h3>🔮 整体解读</h3><div class="content">${MarkdownParser.parse(result)}</div>`;
  } catch(e) {
    area.innerHTML = `<h3>🔮 整体解读</h3><div class="content" style="color:#f88;">❌ ${e.message}</div>`;
  }
}

// ---- Reset ----
function resetAll() {
  state.question = '';
  state.spread = null;
  state.deck = [];
  state.shuffled = false;
  state.cutPos = 0;
  state.selectedCards = [];
  state.revealed = [];
  shuffleCount = 0;
  document.getElementById('questionInput').value = '';
  document.querySelectorAll('.spread-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('overallReading').style.display = 'none';
  showStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

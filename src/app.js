'use strict';

// ---------- 字段定义（双语标签 + 提示） ----------
const FIELDS = {
  role:        { zh: '角色', en: 'Role', hint: '希望 Agent 扮演的角色/身份，如「资深前端工程师」', lines: 2 },
  goal:        { zh: '目标', en: 'Goal', hint: '想要达成的结果，一句话说清', lines: 2 },
  context:     { zh: '背景', en: 'Context', hint: '背景与现状，Agent 需要知道的上下文', lines: 3 },
  must:        { zh: '必须', en: 'Must', hint: '必须满足的需求，每行一条', lines: 3 },
  should:      { zh: '应该', en: 'Should', hint: '最好满足的需求，每行一条', lines: 3 },
  could:       { zh: '可选', en: 'Could', hint: '锦上添花的需求，每行一条', lines: 3 },
  wont:        { zh: '不做', en: "Won't", hint: '明确排除/不做的，每行一条', lines: 2 },
  design:      { zh: '设计思路', en: 'Design Intent', hint: '你倾向的方案、思路、技术偏好', lines: 3 },
  style:       { zh: '风格', en: 'Style', hint: '文风/视觉风格，如「简洁现代」', lines: 2 },
  tone:        { zh: '语气', en: 'Tone', hint: '语气，如「专业」「友好」「正式」', lines: 2 },
  audience:    { zh: '受众', en: 'Audience', hint: '内容面向谁，如「我自己」「新手用户」', lines: 2 },
  constraints: { zh: '约束', en: 'Constraints', hint: '技术栈、环境、边界、不可做事项', lines: 3 },
  input:       { zh: '输入', en: 'Input', hint: '既定输入/素材，如有', lines: 2 },
  output:      { zh: '期望输出', en: 'Output', hint: '输出的格式与结构', lines: 3 },
  acceptance:  { zh: '验收标准', en: 'Acceptance Criteria', hint: '可检验的完成标准，每行一条', lines: 3, list: 'check' },
  examples:    { zh: '示例', en: 'Examples', hint: '参考示例，可选', lines: 3 },
};

// ---------- 模式定义 ----------
const MODES = {
  full: {
    label: '完整', zh: '完整（规格书）', en: 'Full (Spec)',
    desc: '最完整：需求分层 + 设计思路 + 验收标准，适合开发/设计任务，Agent 零猜测。',
    sections: [
      { key: 'role' }, { key: 'goal' }, { key: 'context' }, { group: 'requirements' },
      { key: 'design' }, { key: 'constraints' }, { key: 'input' }, { key: 'output' },
      { key: 'acceptance' }, { key: 'tone' }, { key: 'examples' },
    ],
  },
  costar: {
    label: 'CO-STAR', zh: 'CO-STAR', en: 'CO-STAR',
    desc: '简洁通用框架（Context/Objective/Style/Tone/Audience/Response），适合文案与内容生成。',
    sections: [
      { key: 'context' }, { key: 'goal' }, { key: 'style' }, { key: 'tone' }, { key: 'audience' }, { key: 'output' },
    ],
  },
  rtfc: {
    label: '精简', zh: '精简（RTFC）', en: 'Quick (RTFC)',
    desc: '最快上手：角色 + 任务 + 输出格式 + 约束，适合简单一次性任务。',
    sections: [
      { key: 'role' }, { key: 'goal' }, { key: 'output' }, { key: 'constraints' },
    ],
  },
};

const REQ_TIERS = [
  ['must', '必须', 'Must'],
  ['should', '应该', 'Should'],
  ['could', '可选', 'Could'],
  ['wont', '不做', "Won't"],
];

// ---------- 状态 ----------
const STORE_KEY = 'pg-state-v1';
const state = { mode: 'full', lang: 'bi', values: {} };
Object.keys(FIELDS).forEach(k => { state.values[k] = ''; });

// ---------- 工具函数 ----------
const $ = sel => document.querySelector(sel);

function listItems(str) {
  return (str || '').split('\n').map(s => s.trim()).filter(Boolean);
}

function title(zh, en, lang) {
  if (lang === 'zh') return `# ${zh}`;
  if (lang === 'en') return `# ${en}`;
  return `# ${zh} ${en}`;
}

function fieldTitle(key, lang) {
  const f = FIELDS[key];
  return title(f.zh, f.en, lang);
}

function renderValue(key, val) {
  const f = FIELDS[key];
  if (f.list === 'check') return listItems(val).map(x => `- [ ] ${x}`).join('\n');
  return val;
}

// ---------- 输出构建 ----------
function buildOutput(modeId, lang) {
  const mode = MODES[modeId];
  const blocks = [];
  for (const sec of mode.sections) {
    if (sec.group === 'requirements') {
      const tiers = [];
      for (const [key, zh, en] of REQ_TIERS) {
        const items = listItems(state.values[key]);
        if (!items.length) continue;
        const t = lang === 'zh' ? zh : lang === 'en' ? en : `${zh} ${en}`;
        tiers.push(`${t}\n${items.map(x => `- ${x}`).join('\n')}`);
      }
      if (tiers.length) blocks.push(`${title('需求', 'Requirements', lang)}\n${tiers.join('\n\n')}`);
    } else {
      const val = (state.values[sec.key] || '').trim();
      if (!val) continue;
      blocks.push(`${fieldTitle(sec.key, lang)}\n${renderValue(sec.key, val)}`);
    }
  }
  return blocks.join('\n\n');
}

// ---------- 渲染 ----------
const fieldsEl = $('#fields');
const previewEl = $('#preview');
const modeDescEl = $('#modeDesc');

function buildField(key, labelText, hint, lines, tier) {
  const wrap = document.createElement('div');
  wrap.className = 'field' + (tier ? ' tier' : '');
  const label = document.createElement('label');
  label.htmlFor = 'f-' + key;
  label.textContent = labelText;
  const ta = document.createElement('textarea');
  ta.id = 'f-' + key;
  ta.rows = lines;
  ta.placeholder = hint;
  ta.value = state.values[key] || '';
  ta.addEventListener('input', () => {
    state.values[key] = ta.value;
    renderPreview();
    scheduleSave();
  });
  wrap.appendChild(label);
  wrap.appendChild(ta);
  return wrap;
}

function renderFields() {
  const mode = MODES[state.mode];
  modeDescEl.textContent = mode.desc;
  fieldsEl.innerHTML = '';
  for (const sec of mode.sections) {
    if (sec.group === 'requirements') {
      const group = document.createElement('div');
      group.className = 'field-group';
      const head = document.createElement('div');
      head.className = 'field-group-title';
      head.textContent = '需求 Requirements';
      group.appendChild(head);
      for (const [key, zh, en] of REQ_TIERS) {
        group.appendChild(buildField(key, `${zh} ${en}`, FIELDS[key].hint, FIELDS[key].lines, true));
      }
      fieldsEl.appendChild(group);
    } else {
      const f = FIELDS[sec.key];
      fieldsEl.appendChild(buildField(sec.key, `${f.zh} ${f.en}`, f.hint, f.lines, false));
    }
  }
}

function renderPreview() {
  const out = buildOutput(state.mode, state.lang);
  if (out.trim()) {
    previewEl.textContent = out;
    previewEl.classList.remove('empty');
  } else {
    previewEl.textContent = '在左侧填写字段，这里会实时生成结构化提示词。\n\nFill in the fields on the left — the structured prompt appears here live.';
    previewEl.classList.add('empty');
  }
}

function syncControls() {
  document.querySelectorAll('#modeSeg button').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
  document.querySelectorAll('#langSeg button').forEach(b => b.classList.toggle('active', b.dataset.lang === state.lang));
}

// ---------- 持久化 ----------
let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 300);
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 忽略 */ }
}
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d && typeof d === 'object') {
      if (MODES[d.mode]) state.mode = d.mode;
      if (['zh', 'en', 'bi'].includes(d.lang)) state.lang = d.lang;
      if (d.values) Object.keys(FIELDS).forEach(k => { if (typeof d.values[k] === 'string') state.values[k] = d.values[k]; });
    }
  } catch (e) { /* 忽略 */ }
}

// ---------- 动作 ----------
async function copyOutput() {
  const out = buildOutput(state.mode, state.lang);
  if (!out.trim()) { toast('还没有可复制的内容'); return; }
  try {
    await navigator.clipboard.writeText(out);
    toast('已复制到剪贴板 ✓');
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = out;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast('已复制到剪贴板 ✓'); }
    catch (e2) { toast('复制失败，请手动选择复制'); }
    document.body.removeChild(ta);
  }
}

function downloadOutput() {
  const out = buildOutput(state.mode, state.lang);
  if (!out.trim()) { toast('还没有可下载的内容'); return; }
  const blob = new Blob(['﻿' + out], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'prompt.md';
  a.click();
  URL.revokeObjectURL(url);
  toast('已下载 prompt.md');
}

const EXAMPLE = {
  role: '资深前端工程师',
  goal: '一个本地可用的待办事项网页',
  context: '个人使用，替代纸质便利贴，数据只保存在本机',
  must: '增/删/改/勾选完成\n本地持久化（localStorage）\n单文件可打开',
  should: '按优先级排序\n深色模式',
  could: '标签分类',
  wont: '后端服务\n账号系统\n联网同步',
  design: '零后端、零依赖，纯 HTML/CSS/JS 单文件，方便拷走',
  constraints: '无框架、无构建步骤\n数据不联网\n界面简洁',
  input: '',
  output: '一个 index.html + 简短使用说明',
  acceptance: '双击即用\n刷新后数据仍在\n增删改勾选全部正常',
  tone: '简洁',
  examples: '',
};

function fillExample() {
  Object.keys(FIELDS).forEach(k => { state.values[k] = EXAMPLE[k] || ''; });
  state.mode = 'full';
  syncControls();
  renderFields();
  renderPreview();
  save();
  toast('已填入示例（待办事项）');
}

function clearAll() {
  if (!confirm('清空所有已填内容？此操作不可撤销。')) return;
  Object.keys(FIELDS).forEach(k => { state.values[k] = ''; });
  renderFields();
  renderPreview();
  save();
  toast('已清空');
}

// ---------- 提示 ----------
let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

// ---------- 初始化 ----------
function init() {
  load();
  syncControls();
  renderFields();
  renderPreview();

  document.querySelectorAll('#modeSeg button').forEach(b => b.addEventListener('click', () => {
    state.mode = b.dataset.mode;
    syncControls();
    renderFields();
    renderPreview();
    save();
  }));
  document.querySelectorAll('#langSeg button').forEach(b => b.addEventListener('click', () => {
    state.lang = b.dataset.lang;
    syncControls();
    renderPreview();
    save();
  }));

  $('#btnCopy').addEventListener('click', copyOutput);
  $('#btnDownload').addEventListener('click', downloadOutput);
  $('#btnExample').addEventListener('click', fillExample);
  $('#btnClear').addEventListener('click', clearAll);
}

document.addEventListener('DOMContentLoaded', init);

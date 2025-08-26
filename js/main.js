import { Engine } from './engine.js';

const canvas = document.getElementById('canvas');
const engine = new Engine(canvas);
engine.start();

let isOpen = false;

/* ========== 花火生成: canvas の click でのみ拾う ========== */
function spawnFromEvent(e) {
  engine.spawnAtClient(e.clientX, e.clientY);
}
if (canvas) {
  // UIと競合しないように canvas のみで発火
  canvas.addEventListener('click', spawnFromEvent);
}

/* ========== 設定ボタンの表示切り替え ========== */
const settingBtn = document.querySelector('.settingBtn');
const panel = document.getElementById('settingsPanel');

// ボタンが <button> の場合は type=button を保証（フォーム内でも安全）
if (settingBtn instanceof HTMLButtonElement && !settingBtn.type) {
  settingBtn.type = 'button';
}

function renderToggleUI() {
  if (!settingBtn) return;
  // 表示中は「＜」、非表示は「＞」
  settingBtn.textContent = isOpen ? '⚙️ 色設定 ＜' : '⚙️ 色設定 ＞';
  settingBtn.setAttribute('aria-expanded', String(isOpen));
}
function openPanel()
{
  isOpen = true;
  if (panel) {
    panel.setAttribute('aria-hidden', 'false');
  }
  renderToggleUI();
}
function closePanel()
{
  isOpen = false;
  if (panel) {
    panel.setAttribute('aria-hidden', 'true');
  }
  renderToggleUI();
}

if (settingBtn) {
  if (settingBtn instanceof HTMLButtonElement && !settingBtn.type) {
    settingBtn.type = 'button';
  }
  settingBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen ? closePanel() : openPanel();
  });
}
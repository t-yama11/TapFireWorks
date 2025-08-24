import { Engine } from './engine.js';

const canvas = document.getElementById('canvas');
const engine = new Engine(canvas);
engine.start();

// 入力: どこでもタップ/クリックで花火生成
window.addEventListener('pointerdown', (e) => {
  engine.spawnAtClient(e.clientX, e.clientY);
}, { passive: true });

import { Firework } from './firework.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const { clientWidth: w, clientHeight: h } = canvas;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
const ro = new ResizeObserver(resize);
ro.observe(canvas);

const fireworks = [];

let last = performance.now();
function loop(now) {
  const dt = Math.min(50, now - last);
  last = now;

  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  for (const fw of fireworks) fw.step(dt);
  for (const fw of fireworks) fw.draw(ctx);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    if (!fireworks[i].alive) fireworks.splice(i, 1);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function spawnAtClient(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  fireworks.push(new Firework(x, y));
}

window.addEventListener('pointerdown', (e) => {
  spawnAtClient(e.clientX, e.clientY);
}, { passive: true });

resize();
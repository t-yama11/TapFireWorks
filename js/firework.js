import { Particle } from './particle.js';
import { toRgbString } from '../utils/color.js';

// 🎨 カラーパレット
const COLORS = [
  { r: 255, g: 40,  b: 40  },  // 赤
  { r: 40,  g: 160, b: 255 },  // 青
  { r: 40,  g: 255, b: 100 },  // 緑
  { r: 255, g: 200, b: 40  },  // 黄
  { r: 255, g: 120, b: 255 },  // 紫
  { r: 255, g: 255, b: 255 },  // 白
];

function pickRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export class Firework {
    constructor(x, y, opts = {}) {
    const baseColor = pickRandomColor();  // 🌟 ランダム色を選択
    const cfg = Object.assign({
      lifetime: 1200,
      particleCount: 80,
      particleSpeed: 180,
      color: baseColor,
    }, opts);

    this.cfg = cfg;
    this.startTime = performance.now();
    this.life = cfg.lifetime;
    this.particles = [];

    for (let i = 0; i < cfg.particleCount; i++) {
      const angle = (i / cfg.particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
      const speed = cfg.particleSpeed * (0.6 + Math.random() * 0.8);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const life = cfg.lifetime * (0.6 + Math.random() * 0.6);
      this.particles.push(new Particle(x, y, vx, vy, life, cfg.color));
    }
    // 中心の閃光 → ベース色を少し明るめに調整
    this.core = new Particle(
      x, y, 0, 0, cfg.lifetime * 0.4,
      { r: Math.min(255, cfg.color.r + 60),
        g: Math.min(255, cfg.color.g + 60),
        b: Math.min(255, cfg.color.b + 60) }
    );
  }
  step(dt) {
    this.life -= dt;
    for (const p of this.particles) p.step(dt);
    this.core.step(dt);
  }
  get alive() {
    return this.life > 0 && (this.particles.some(p => p.alive) || this.core.alive);
  }
  draw(ctx) {
    const elapsed = performance.now() - this.startTime;
    const t = Math.min(1, Math.max(0, 1 - elapsed / 1200));
    const alpha = Math.pow(t, 1.6);
    for (const p of this.particles) if (p.alive) p.draw(ctx, alpha);
    if (this.core.alive) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha;
      const r = 3 + 8 * (1 - alpha);
      ctx.fillStyle = toRgbString(this.core.color);
      ctx.beginPath();
      ctx.arc(this.core.x, this.core.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
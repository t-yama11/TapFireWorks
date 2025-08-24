import { Particle } from './particle.js';

export class Firework {
  constructor(x, y) {
    this.startTime = performance.now();
    this.life = 1200;
    this.particles = [];
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
      const speed = 180 * (0.6 + Math.random() * 0.8);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const life = 1200 * (0.6 + Math.random() * 0.6);
      this.particles.push(new Particle(x, y, vx, vy, life));
    }
    this.core = new Particle(x, y, 0, 0, 1200 * 0.4);
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
      ctx.fillStyle = 'rgb(255, 80, 80)';
      ctx.beginPath();
      ctx.arc(this.core.x, this.core.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
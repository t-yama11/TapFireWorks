import { toRgbString } from "../utils/color.js";
export class Particle {
  constructor(x, y, vx, vy, life, color = { r: 255, g: 40, b: 40 }) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.life = life;
    this.color = color;
    this.alive = true;
  }

  //更新処理
  step(dt) {
    if (!this.alive) return;
    this.vy += 220 * (dt / 1000); // GRAVITY
    this.vx *= 0.98; this.vy *= 0.98; // DRAG
    this.x += this.vx * (dt / 1000);
    this.y += this.vy * (dt / 1000);
    this.life -= dt;
    this.alive = this.life > 0;
  }
  draw(ctx, alpha) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = toRgbString(this.color);
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}
export class Particle {
  constructor(x, y, vx, vy, life) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.life = life;
    this.alive = true;
  }
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
    ctx.fillStyle = 'rgb(255, 40, 40)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}
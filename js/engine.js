import { Firework } from './firework.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fireworks = [];

    this.physics = {
      gravity: 220, // px/s^2
      drag: 0.98,
    };

    this._last = performance.now();
    this._running = false;

    // Retina対応 & リサイズ追従
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this.canvas);
    this._resize();
  }

  _resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const { clientWidth: w, clientHeight: h } = this.canvas;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // CSS px で描画
  }

  start() {
    if (this._running) return;
    this._running = true;
    const loop = (now) => {
      if (!this._running) return;
      const dt = Math.min(50, now - this._last); // 急なラグのクランプ
      this._last = now;

      // 背景の残像
      const ctx = this.ctx;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

      // 更新 & 描画
      for (const fw of this.fireworks) fw.step(dt, this.physics);
      for (const fw of this.fireworks) fw.draw(ctx);

      // ガベージ
      for (let i = this.fireworks.length - 1; i >= 0; i--) {
        if (!this.fireworks[i].alive) this.fireworks.splice(i, 1);
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  spawnAtClient(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    this.fireworks.push(new Firework(x, y));
  }
}

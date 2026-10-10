/**
 * Geek Mantra AI - Flow Particle & Neural Network Canvas
 * Renders an interactive neural constellation with magic sparkles and cursor physics.
 */

class FlowCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.sparkles = [];
    this.mouse = { x: -1000, y: -1000, radius: 180, isHovering: false };
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.animationId = null;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.createSparkles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  createParticles() {
    this.particles = [];
    // Density calculation based on screen area
    const count = Math.min(Math.floor((this.width * this.height) / 14000), 100);

    const colors = [
      'rgba(0, 240, 255, 0.85)',   // Electric Cyan
      'rgba(168, 85, 247, 0.85)',  // Magic Violet
      'rgba(56, 189, 248, 0.85)',  // Sky Blue
      'rgba(192, 132, 252, 0.85)', // Light Purple
      'rgba(236, 72, 153, 0.75)'   // Accent Pink
    ];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  createSparkles() {
    this.sparkles = [];
    const sparkleCount = Math.min(Math.floor(this.width / 90), 22);

    for (let i = 0; i < sparkleCount; i++) {
      this.sparkles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 8 + 6,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        vy: -(Math.random() * 0.3 + 0.1),
        vx: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.5 ? '#00f0ff' : '#c084fc'
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
      this.createSparkles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isHovering = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.isHovering = false;
    });

    // Touch support for mobile flow
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.mouse.isHovering = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.isHovering = false;
    });
  }

  drawSparkle(s) {
    this.ctx.save();
    this.ctx.translate(s.x, s.y);
    this.ctx.rotate(s.rotation);
    this.ctx.fillStyle = s.color;
    this.ctx.shadowColor = s.color;
    this.ctx.shadowBlur = 12;
    this.ctx.globalAlpha = s.alpha * 0.8;

    // 4-pointed magical star
    this.ctx.beginPath();
    const r = s.size;
    const inner = r * 0.22;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      this.ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      const halfAngle = angle + Math.PI / 4;
      this.ctx.lineTo(Math.cos(halfAngle) * inner, Math.sin(halfAngle) * inner);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const now = performance.now() * 0.001;

    // 1. Update and draw sparkles
    for (let s of this.sparkles) {
      s.y += s.vy;
      s.x += s.vx;
      s.rotation += s.rotSpeed;
      s.alpha = 0.4 + 0.4 * Math.sin(now * 2 + s.size);

      // Loop back if out of bounds
      if (s.y < -20) {
        s.y = this.height + 20;
        s.x = Math.random() * this.width;
      }
      if (s.x < -20) s.x = this.width + 20;
      if (s.x > this.width + 20) s.x = -20;

      this.drawSparkle(s);
    }

    // 2. Update and draw particles
    const connectionDist = 135;
    const mouseConnectionDist = 180;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Natural movement
      p.x += p.vx;
      p.y += p.vy;

      // Wall bounce
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse interaction (gentle attraction / deflection)
      if (this.mouse.isHovering) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Gently push particles outward
          p.x -= Math.cos(angle) * force * 1.5;
          p.y -= Math.sin(angle) * force * 1.5;

          // Draw neon beam to mouse
          if (dist < mouseConnectionDist) {
            const beamAlpha = (1 - dist / mouseConnectionDist) * 0.75;
            this.ctx.save();
            const grad = this.ctx.createLinearGradient(p.x, p.y, this.mouse.x, this.mouse.y);
            grad.addColorStop(0, p.color);
            grad.addColorStop(1, '#00f0ff');
            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = 1.2;
            this.ctx.globalAlpha = beamAlpha;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
            this.ctx.restore();
          }
        }
      }

      // Draw particle dot with glow
      const pulsingAlpha = p.baseAlpha + 0.2 * Math.sin(now * p.pulseSpeed * 10 + p.pulseOffset);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.globalAlpha = Math.max(0.2, Math.min(1, pulsingAlpha));
      this.ctx.fill();
      this.ctx.restore();

      // Connect to neighboring particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p2.x - p.x, p2.y - p.y);

        if (dist < connectionDist) {
          const alpha = (1 - dist / connectionDist) * 0.35;
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = '#38bdf8';
          this.ctx.lineWidth = 0.7;
          this.ctx.globalAlpha = alpha;
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.flowCanvas = new FlowCanvas('flow-canvas');
});


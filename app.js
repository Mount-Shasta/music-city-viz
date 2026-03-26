// ── Background particle canvas ──────────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ── Ambient particles ───────────────────────────────────────────────────
const PARTICLE_COUNT = 80;
const particles = [];

class Particle {
  constructor() { this.reset(true); }
  reset(initial) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : H + 10;
    this.r = Math.random() * 2.5 + 0.5;
    this.speed = Math.random() * 0.4 + 0.1;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.drift = (Math.random() - 0.5) * 0.3;
  }
  update() {
    this.y -= this.speed;
    this.x += this.drift;
    if (this.y < -10) this.reset(false);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 57, 70, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// ── Mouse-reactive trail particles ─────────────────────────────────────
const trail = [];
const MAX_TRAIL = 30;
let mouseX = W / 2, mouseY = H / 2;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  trail.push({ x: mouseX, y: mouseY, life: 1, r: Math.random() * 4 + 2 });
  if (trail.length > MAX_TRAIL) trail.shift();
});

// ── Music note tilt ────────────────────────────────────────────────────
const note = document.getElementById('note-container');

function updateNoteTilt() {
  const cx = W / 2, cy = H / 2;
  const dx = (mouseX - cx) / cx;
  const dy = (mouseY - cy) / cy;
  const rotateY = dx * 15;
  const rotateX = -dy * 10;
  const scale = 1 + Math.sqrt(dx * dx + dy * dy) * 0.05;
  note.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
}

// ── Animation loop ─────────────────────────────────────────────────────
function animate() {
  ctx.clearRect(0, 0, W, H);

  // Ambient particles
  for (const p of particles) { p.update(); p.draw(); }

  // Trail particles
  for (let i = trail.length - 1; i >= 0; i--) {
    const t = trail[i];
    t.life -= 0.025;
    if (t.life <= 0) { trail.splice(i, 1); continue; }
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r * t.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 57, 70, ${t.life * 0.6})`;
    ctx.fill();
  }

  // Note tilt
  updateNoteTilt();

  requestAnimationFrame(animate);
}

animate();

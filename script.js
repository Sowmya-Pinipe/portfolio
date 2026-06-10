/* ── PRELOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('done'), 1200);
});

/* ── FOOTER YEAR ── */
const yr = new Date().getFullYear();
document.getElementById('footer-year').textContent = yr;
document.getElementById('footer-year2').textContent = yr;

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

/* ══════════════════════════════════════════
   HERO CANVAS — code-rain reel animation
   State: starts PAUSED (black screen).
   Click Play Reel → starts animating.
   Click Pause    → stops animating.
═══════════════════════════════════════════ */
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');
let W, H, drops = [], particles = [];

function resizeCanvas() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initDrops(); }, { passive: true });

const WORDS   = ['React','Node','Django','Mongo','Python','Flask','CSS','HTML','JS','API','REST','Git','Sowmya','const','let','=> {}','import','export','function','class','</>'];
const FS      = 13;
let cols      = 0;

function initDrops() {
  cols  = Math.floor(W / (FS * 2.4));
  drops = Array.from({ length: cols }, () => -(Math.random() * 40));
}
initDrops();

function initParticles() {
  particles = Array.from({ length: 24 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + 0.8,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    a: Math.random() * 0.4 + 0.08
  }));
}
initParticles();

let rafId   = null;
let running = false;   // starts PAUSED

function tick() {
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(0, 0, W, H);

  ctx.font = FS + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const x    = i * FS * 2.4;
    const y    = drops[i] * FS;

    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillText(word[0] || '', x, y);

    ctx.fillStyle = 'rgba(253, 248, 105, 0.69)';
    if (word.length > 1) ctx.fillText(word.slice(1), x + FS * 0.72, y);

    if (y > H && Math.random() > 0.975) drops[i] = 0;
    drops[i] += 0.38;
  }

  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,42,42,${p.a})`;
    ctx.fill();
  }

  rafId = requestAnimationFrame(tick);
}

function startReel() {
  if (running) return;
  running = true;
  // Fill canvas black first so it doesn't flash white
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  tick();
}

function stopReel() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(rafId);
  rafId = null;
}

/* Play / Pause button */
const playBtn   = document.getElementById('playBtn');
const playIcon  = document.getElementById('playIcon');
const playLabel = document.getElementById('playLabel');

// Pause icon path
const PAUSE_PATH = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
const PLAY_PATH  = '<path d="M8 5v14l11-7z"/>';

playBtn.addEventListener('click', () => {
  if (!running) {
    // ── START ──
    startReel();
    playIcon.innerHTML  = PAUSE_PATH;
    playLabel.textContent = 'Pause';
    playBtn.classList.remove('paused');
  } else {
    // ── PAUSE ──
    stopReel();
    playIcon.innerHTML  = PLAY_PATH;
    playLabel.textContent = 'Play';
    playBtn.classList.add('paused');
  }
});

// Initialise canvas to solid black (no flicker)
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, W, H);

/* ── SCROLL REVEALS ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

/* ── SKILL BAR ANIMATION ── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.3 });
const skillBars = document.getElementById('skillBars');
if (skillBars) barObs.observe(skillBars);

/* ── SERVICES SCROLL PATH ── */
const activePath = document.getElementById('activePath');
const flowSection = document.getElementById('cardsFlow');
const cardEls = [0,1,2,3].map(i => document.getElementById('card' + i));

if (window.innerWidth > 768 && activePath && flowSection) {
  const totalLength = activePath.getTotalLength();
  activePath.style.strokeDasharray  = totalLength;
  activePath.style.strokeDashoffset = totalLength;

  function updatePath() {
    const rect    = flowSection.getBoundingClientRect();
    const sectH   = flowSection.offsetHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / (sectH - window.innerHeight * 0.5)));
    activePath.style.strokeDashoffset = totalLength * (1 - progress);
    const thresh = [0.08, 0.32, 0.56, 0.78];
    cardEls.forEach((c, i) => c && c.classList.toggle('active', progress >= thresh[i]));
  }
  window.addEventListener('scroll', updatePath, { passive: true });
  updatePath();
}

/* ── CONTACT PARALLAX ── */
const bgTextEl = document.getElementById('contactBgText');
const contactEl = document.getElementById('contact');
window.addEventListener('scroll', () => {
  if (!bgTextEl || !contactEl) return;
  const rect  = contactEl.getBoundingClientRect();
  const prog  = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
  bgTextEl.parentElement.style.transform = `translateY(${(prog - 0.3) * 36}%)`;
}, { passive: true });
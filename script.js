/**
 * TAHMID ALVEE — PORTFOLIO
 * Professional JavaScript Enhancement Suite
 * ─────────────────────────────────────────
 * Features:
 *  01. Custom Cursor (magnetic + trail)
 *  02. Particle Canvas (hero background)
 *  03. Scroll Progress Bar
 *  04. Navbar: scroll-spy + shrink + mobile menu
 *  05. Typewriter Effect (hero role)
 *  06. Staggered Reveal Animations (IntersectionObserver)
 *  07. Skill Bar Animated Fill
 *  08. Counter Odometer (stats)
 *  09. Tilt-3D Cards
 *  10. Magnetic Buttons
 *  11. Smooth Parallax (hero image)
 *  12. Noise / Grain overlay
 *  13. Active Nav Highlight (scroll-spy)
 *  14. Form UX (shake, loading state, success)
 *  15. Glitch Text Effect (section titles)
 *  16. Page Loader
 *  17. Easter egg: Konami Code
 */

/* ════════════════════════════════════════════
   0. UTILITIES
════════════════════════════════════════════ */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const map = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);
const isMobile = () => window.innerWidth <= 768;
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ════════════════════════════════════════════
   1. PAGE LOADER
════════════════════════════════════════════ */
function initLoader() {
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = `
    <div class="loader-inner">
      <div class="loader-logo">
        <span class="loader-bracket">&lt;</span>
        <span class="loader-name">Tahmid Alvee</span>
        <span class="loader-bracket">/&gt;</span>
      </div>
      <div class="loader-bar-track"><div class="loader-bar"></div></div>
      <div class="loader-pct">0%</div>
    </div>
  `;
  document.body.appendChild(loader);

  const style = document.createElement('style');
  style.textContent = `
    #page-loader {
      position:fixed; inset:0; z-index:99999;
      background:#05071a;
      display:flex; align-items:center; justify-content:center;
      transition: opacity .6s ease, visibility .6s ease;
    }
    #page-loader.hidden { opacity:0; visibility:hidden; pointer-events:none; }
    .loader-inner { text-align:center; }
    .loader-logo {
      font-family:'JetBrains Mono',monospace; font-size:1.6rem; font-weight:700; margin-bottom:2rem;
    }
    .loader-bracket { color:#00d9ff; }
    .loader-name {
      margin:0 .3rem;
      background:linear-gradient(135deg,#00d9ff,#7c3aed,#ec4899);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    }
    .loader-bar-track {
      width:260px; height:3px; background:rgba(0,217,255,.15); border-radius:50px; overflow:hidden; margin:0 auto;
    }
    .loader-bar {
      height:100%; width:0%; border-radius:50px;
      background:linear-gradient(90deg,#00d9ff,#7c3aed,#ec4899);
      transition:width .1s linear;
    }
    .loader-pct { font-family:'JetBrains Mono',monospace; font-size:.8rem; color:#a8b2d1; margin-top:.75rem; }
  `;
  document.head.appendChild(style);

  const bar = $('.loader-bar');
  const pct = $('.loader-pct');
  let p = 0;
  const iv = setInterval(() => {
    p = clamp(p + Math.random() * 18, 0, 95);
    bar.style.width = p + '%';
    pct.textContent = Math.round(p) + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(iv);
    bar.style.width = '100%';
    pct.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initAll(); // fire everything after load
    }, 500);
  });

  document.body.style.overflow = 'hidden';
}

/* ════════════════════════════════════════════
   2. CUSTOM CURSOR
════════════════════════════════════════════ */
function initCursor() {
  if (isMobile() || prefersReducedMotion()) return;

  const style = document.createElement('style');
  style.textContent = `
    *{cursor:none!important}
    #c-dot,#c-ring{position:fixed;top:0;left:0;pointer-events:none;z-index:99998;border-radius:50%;will-change:transform;}
    #c-dot{width:8px;height:8px;background:#00d9ff;box-shadow:0 0 12px #00d9ff;margin:-4px 0 0 -4px;transition:transform .1s,background .2s,box-shadow .2s;}
    #c-ring{width:38px;height:38px;border:1.5px solid rgba(0,217,255,.55);margin:-19px 0 0 -19px;transition:width .25s,height .25s,border-color .25s,transform .1s;}
    #c-dot.hover{transform:scale(2.5);background:#ec4899;box-shadow:0 0 18px #ec4899;}
    #c-ring.hover{width:58px;height:58px;border-color:rgba(236,72,153,.7);}
    #c-dot.click{transform:scale(.7);}
    #c-ring.click{width:28px;height:28px;}
  `;
  document.head.appendChild(style);

  const dot = document.createElement('div'); dot.id = 'c-dot';
  const ring = document.createElement('div'); ring.id = 'c-ring';
  document.body.append(dot, ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Magnetic pull for ring
  let rafId;
  const tick = () => {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    dot.style.transform = `translate(${mx}px,${my}px) scale(${dot.classList.contains('hover') ? 2.5 : dot.classList.contains('click') ? .7 : 1})`;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    rafId = requestAnimationFrame(tick);
  };
  tick();

  const hovers = 'a,button,.btn,.project-card,.skill-card,.cert-card,.nav-link,.social-link,.social-btn,.footer-social-icon';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hovers)) { dot.classList.add('hover'); ring.classList.add('hover'); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hovers)) { dot.classList.remove('hover'); ring.classList.remove('hover'); }
  });
  document.addEventListener('mousedown', () => { dot.classList.add('click'); ring.classList.add('click'); });
  document.addEventListener('mouseup', () => { dot.classList.remove('click'); ring.classList.remove('click'); });
}

/* ════════════════════════════════════════════
   3. PARTICLE CANVAS (Hero background)
════════════════════════════════════════════ */
function initParticles() {
  if (prefersReducedMotion()) return;
  const hero = $('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.55;';
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -9999, y: -9999 };

  const resize = () => {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  const N = isMobile() ? 50 : 110;
  const colors = ['#00d9ff', '#7c3aed', '#ec4899', '#10b981', '#a8b2d1'];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 2.2 + .5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * .7 + .15;
      this.speed = Math.random() * .5 + .2;
      this.drift = (Math.random() - .5) * .4;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * .02 + .008;
    }
    update() {
      this.pulse += this.pulseSpeed;
      this.y -= this.speed;
      this.x += this.drift + Math.sin(this.pulse * .7) * .3;
      if (this.y < -5) this.reset();
      // mouse repel
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        const force = (90 - dist) / 90;
        this.x += (dx / dist) * force * 2.2;
        this.y += (dy / dist) * force * 2.2;
      }
    }
    draw() {
      const a = this.alpha * (.7 + .3 * Math.sin(this.pulse));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < N; i++) particles.push(new Particle());

  // Draw connection lines
  const drawLines = () => {
    const thresh = isMobile() ? 80 : 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < thresh) {
          ctx.save();
          ctx.globalAlpha = (1 - d / thresh) * .18;
          ctx.strokeStyle = '#00d9ff';
          ctx.lineWidth = .6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };
  animate();
}

/* ════════════════════════════════════════════
   4. SCROLL PROGRESS BAR
════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:3px; width:0%;
    background:linear-gradient(90deg,#00d9ff,#7c3aed,#ec4899);
    z-index:10001; transition:width .1s linear;
    box-shadow:0 0 10px rgba(0,217,255,.7);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ════════════════════════════════════════════
   5. NAVBAR ENHANCEMENTS
════════════════════════════════════════════ */
function initNavbar() {
  const nav = $('.navbar');
  if (!nav) return;

  // Scroll-based shrink
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile hamburger
  const menu = $('.nav-menu');
  if (!menu) return;
  const ham = document.createElement('button');
  ham.id = 'nav-ham';
  ham.setAttribute('aria-label', 'Menu');
  ham.innerHTML = `<span></span><span></span><span></span>`;
  const hamStyle = document.createElement('style');
  hamStyle.textContent = `
    #nav-ham{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:none;padding:6px;z-index:200;}
    #nav-ham span{display:block;width:24px;height:2px;background:#00d9ff;border-radius:2px;transition:all .3s ease;}
    #nav-ham.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
    #nav-ham.open span:nth-child(2){opacity:0;transform:scaleX(0);}
    #nav-ham.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
    @media(max-width:1024px){
      #nav-ham{display:flex;}
      .nav-menu{
        position:fixed;top:0;right:0;height:100vh;width:260px;
        background:rgba(10,14,39,.98);backdrop-filter:blur(20px);
        flex-direction:column;justify-content:center;align-items:center;gap:2rem;
        transform:translateX(100%);transition:transform .4s cubic-bezier(.77,0,.175,1);
        border-left:1px solid rgba(0,217,255,.15);display:flex!important;
      }
      .nav-menu.open{transform:translateX(0);}
      .nav-link{font-size:1.2rem;}
    }
  `;
  document.head.appendChild(hamStyle);
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    menu.classList.toggle('open');
  });
  // close on link click
  $$('.nav-link').forEach(l => l.addEventListener('click', () => {
    ham.classList.remove('open'); menu.classList.remove('open');
  }));
  $('.nav-container').appendChild(ham);
}

/* ════════════════════════════════════════════
   6. TYPEWRITER EFFECT
════════════════════════════════════════════ */
function initTypewriter() {
  const el = $('.hero-role');
  if (!el) return;
  const roles = [
    'MERN Stack Developer',
    'Competitive Programmer',
    'Aspiring Data Scientist',
    'Full-Stack Developer',
    'Game Developer',
    'Problem Solver',
  ];
  let ri = 0, ci = 0, deleting = false;
  const bracket = (t) => `<span class="hero-role__bracket">&lt;</span>${t}<span class="hero-role__bracket">/&gt;</span>`;
  const cursor = `<span id="tw-cursor" style="display:inline-block;width:2px;height:1.1em;background:#00d9ff;margin-left:3px;vertical-align:middle;animation:twBlink .75s step-end infinite;"></span>`;
  const twStyle = document.createElement('style');
  twStyle.textContent = `@keyframes twBlink{0%,100%{opacity:1}50%{opacity:0}}`;
  document.head.appendChild(twStyle);

  const type = () => {
    const full = roles[ri];
    if (deleting) {
      ci--;
      el.innerHTML = bracket(full.slice(0, ci)) + cursor;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 500); return; }
      setTimeout(type, 55);
    } else {
      ci++;
      el.innerHTML = bracket(full.slice(0, ci)) + cursor;
      if (ci === full.length) { deleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 90);
    }
  };
  el.innerHTML = bracket('') + cursor;
  setTimeout(type, 800);
}

/* ════════════════════════════════════════════
   7. SCROLL REVEAL (Intersection Observer)
════════════════════════════════════════════ */
function initScrollReveal() {
  if (prefersReducedMotion()) return;

  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .reveal{opacity:0;transform:translateY(40px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);}
    .reveal.visible{opacity:1;transform:none;}
    .reveal-left{opacity:0;transform:translateX(-50px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);}
    .reveal-left.visible{opacity:1;transform:none;}
    .reveal-right{opacity:0;transform:translateX(50px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);}
    .reveal-right.visible{opacity:1;transform:none;}
    .reveal-scale{opacity:0;transform:scale(.88);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1);}
    .reveal-scale.visible{opacity:1;transform:scale(1);}
  `;
  document.head.appendChild(revealStyle);

  // Tag elements
  $$('.about-text p, .about-intro, .about-highlights, .about-education').forEach((el, i) => {
    el.classList.add('reveal'); el.style.transitionDelay = (i * .08) + 's';
  });
  $$('.highlight-item').forEach((el, i) => {
    el.classList.add('reveal-left'); el.style.transitionDelay = (i * .1) + 's';
  });
  $$('.timeline-item').forEach((el, i) => {
    el.classList.add('reveal-right'); el.style.transitionDelay = (i * .12) + 's';
  });
  $$('.skill-card').forEach((el, i) => {
    el.classList.add('reveal-scale'); el.style.transitionDelay = (i * .05) + 's';
  });
  $$('.role-card').forEach((el, i) => {
    el.classList.add('reveal'); el.style.transitionDelay = (i * .1) + 's';
  });
  $$('.project-card').forEach((el, i) => {
    el.classList.add('reveal'); el.style.transitionDelay = (i * .1) + 's';
  });
  $$('.cert-card').forEach((el, i) => {
    el.classList.add('reveal'); el.style.transitionDelay = (i * .08) + 's';
  });
  $$('.experience-card').forEach((el, i) => {
    el.classList.add('reveal-left'); el.style.transitionDelay = (i * .12) + 's';
  });
  $$('.contact-item, .contact-form-wrapper, .contact-text').forEach((el, i) => {
    el.classList.add('reveal'); el.style.transitionDelay = (i * .1) + 's';
  });
  $$('.section-header').forEach(el => el.classList.add('reveal'));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });

  $$('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════
   8. SKILL BAR ANIMATION
════════════════════════════════════════════ */
function initSkillBars() {
  const fills = $$('.skill-fill');
  // Store targets, reset to 0
  const targets = fills.map(f => f.style.width);
  fills.forEach(f => { f.dataset.target = f.style.width; f.style.width = '0%'; });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.skill-fill');
        if (fill) {
          setTimeout(() => { fill.style.width = fill.dataset.target; }, 200);
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  $$('.skill-card').forEach(c => obs.observe(c));
}

/* ════════════════════════════════════════════
   9. COUNTER ANIMATION (Stats)
════════════════════════════════════════════ */
function initCounters() {
  const ease = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const animateCounter = (el) => {
    const text = el.textContent;
    const num = parseFloat(text);
    const suffix = text.replace(/[\d.]/g, '');
    if (isNaN(num)) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const v = Math.round(ease(t) * num);
      el.textContent = v + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = text;
    };
    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('.stat-number', e.target).forEach(animateCounter);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .5 });

  const statsEl = $('.hero-stats');
  if (statsEl) obs.observe(statsEl);
}

/* ════════════════════════════════════════════
   10. 3D TILT CARDS
════════════════════════════════════════════ */
function initTiltCards() {
  if (isMobile() || prefersReducedMotion()) return;

  const cards = $$('.project-card, .cert-card, .role-card, .skill-card');
  cards.forEach(card => {
    let raf;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(800px) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg) translateZ(8px)`;
        card.style.transition = 'transform .05s linear';
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1), border-color .3s, box-shadow .3s';
    });
  });
}

/* ════════════════════════════════════════════
   11. MAGNETIC BUTTONS
════════════════════════════════════════════ */
function initMagneticButtons() {
  if (isMobile() || prefersReducedMotion()) return;

  const btns = $$('.btn-one, .btn-two, .btn-three, .btn-primary, .project-btn-live');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * .28, dy = (e.clientY - cy) * .28;
      btn.style.transform = `translate(${dx}px,${dy}px) translateY(-2px)`;
      btn.style.transition = 'transform .1s linear';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1), box-shadow .3s, background .3s';
    });
  });
}

/* ════════════════════════════════════════════
   12. SCROLL SPY (active nav link)
════════════════════════════════════════════ */
function initScrollSpy() {
  const sections = $$('section[id]');
  const links = $$('.nav-link');
  const spyStyle = document.createElement('style');
  spyStyle.textContent = `.nav-link.active{color:#00d9ff!important;} .nav-link.active::after{width:100%!important;}`;
  document.head.appendChild(spyStyle);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const link = links.find(l => l.getAttribute('href') === '#' + e.target.id);
      if (link) link.classList.toggle('active', e.isIntersecting);
    });
  }, { threshold: 0.35 });
  sections.forEach(s => obs.observe(s));
}

/* ════════════════════════════════════════════
   13. PARALLAX (hero image)
════════════════════════════════════════════ */
function initParallax() {
  if (isMobile() || prefersReducedMotion()) return;
  const ring = $('.hero-image__ring');
  if (!ring) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    ring.style.transform = `translateY(${y * .12}px)`;
  }, { passive: true });
}

/* ════════════════════════════════════════════
   14. GLITCH TEXT EFFECT (section titles on hover)
════════════════════════════════════════════ */
function initGlitch() {
  if (prefersReducedMotion()) return;
  const glitchStyle = document.createElement('style');
  glitchStyle.textContent = `
    .section-title{position:relative;}
    .section-title::before,.section-title::after{
      content:attr(data-text);position:absolute;inset:0;
      background:inherit;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      opacity:0;transition:opacity .1s;
    }
    .section-title.glitch::before{
      opacity:.7;clip-path:polygon(0 30%,100% 30%,100% 50%,0 50%);
      transform:translate(-3px,0);color:#00d9ff;animation:glitch1 .2s steps(2) forwards;
    }
    .section-title.glitch::after{
      opacity:.7;clip-path:polygon(0 60%,100% 60%,100% 75%,0 75%);
      transform:translate(3px,0);color:#ec4899;animation:glitch2 .2s steps(2) forwards;
    }
    @keyframes glitch1{0%{transform:translate(-3px,0)}50%{transform:translate(3px,-2px)}100%{transform:translate(-1px,0)}}
    @keyframes glitch2{0%{transform:translate(3px,0)}50%{transform:translate(-3px,2px)}100%{transform:translate(1px,0)}}
  `;
  document.head.appendChild(glitchStyle);

  $$('.section-title').forEach(el => {
    el.dataset.text = el.textContent;
    el.addEventListener('mouseenter', () => {
      el.classList.add('glitch');
      setTimeout(() => el.classList.remove('glitch'), 220);
    });
  });
}

/* ════════════════════════════════════════════
   15. FORM ENHANCEMENTS
════════════════════════════════════════════ */
function initForm() {
  const form = $('.contact-form');
  if (!form) return;

  // Floating labels
  const floatStyle = document.createElement('style');
  floatStyle.textContent = `
    .form-group{position:relative;}
    .form-group label{
      position:absolute;left:0.875rem;top:0.875rem;font-size:1rem;color:#6b7694;
      pointer-events:none;transition:all .25s ease;background:transparent;padding:0 .25rem;
    }
    .form-group input,.form-group textarea{padding-top:1.4rem!important;padding-bottom:.4rem!important;}
    .form-group input:focus~label,
    .form-group input:not(:placeholder-shown)~label,
    .form-group textarea:focus~label,
    .form-group textarea:not(:placeholder-shown)~label{
      top:.3rem;font-size:.72rem;color:#00d9ff;
    }
    @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
    .form-shake{animation:shake .35s ease;}
    .form-group input.error,.form-group textarea.error{border-color:#ef4444!important;box-shadow:0 0 0 3px rgba(239,68,68,.12)!important;}
    .form-success{
      background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.4);border-radius:12px;
      padding:1.5rem;text-align:center;color:#10b981;display:none;
    }
    .form-success.show{display:block;}
    .btn-primary .btn-spinner{
      display:none;width:16px;height:16px;border:2px solid rgba(10,14,39,.4);
      border-top-color:#0a0e27;border-radius:50%;animation:spin .7s linear infinite;
    }
    .btn-primary.loading .btn-spinner{display:inline-block;}
    .btn-primary.loading .btn-text{display:none;}
    @keyframes spin{to{transform:rotate(360deg)}}
  `;
  document.head.appendChild(floatStyle);

  // Rearrange label to come after input (for CSS ~ sibling selector)
  $$('.form-group', form).forEach(g => {
    const label = $('label', g);
    const input = $('input,textarea', g);
    if (!label || !input) return;
    input.placeholder = ' ';
    g.appendChild(label); // move label after input
  });

  // Wrap button text
  const submitBtn = $('button[type="submit"]', form);
  if (submitBtn) {
    const txt = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="btn-text">${txt}</span><span class="btn-spinner"></span>`;
  }

  // Success message
  const success = document.createElement('div');
  success.className = 'form-success';
  success.innerHTML = `<div style="font-size:2rem;margin-bottom:.5rem">✅</div><strong>Message sent!</strong><p style="margin-top:.5rem;font-size:.9rem;opacity:.8">I'll get back to you soon.</p>`;
  form.parentNode.insertBefore(success, form.nextSibling);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    $$('input,textarea', form).forEach(input => {
      input.classList.remove('error');
      if (!input.value.trim()) { input.classList.add('error'); valid = false; }
    });
    if (!valid) { form.classList.add('form-shake'); setTimeout(() => form.classList.remove('form-shake'), 400); return; }

    if (submitBtn) submitBtn.classList.add('loading');

    // Simulate / real submit
    try {
      const data = new FormData(form);
      const action = form.action;
      if (!action.includes('YOUR_FORM_ID')) {
        await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      }
    } catch (_) {}

    setTimeout(() => {
      if (submitBtn) submitBtn.classList.remove('loading');
      form.style.display = 'none';
      success.classList.add('show');
    }, 1200);
  });

  // Real-time error clear
  $$('input,textarea', form).forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });
}

/* ════════════════════════════════════════════
   16. SMOOTH SCROLL for anchor links
════════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = $('.navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════
   17. GRAIN / NOISE OVERLAY
════════════════════════════════════════════ */
function initGrain() {
  if (isMobile()) return;
  const grain = document.createElement('div');
  grain.id = 'grain';
  grain.style.cssText = `
    position:fixed;inset:0;z-index:9997;pointer-events:none;
    opacity:.028;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat:repeat;background-size:200px 200px;
  `;
  document.body.appendChild(grain);
}

/* ════════════════════════════════════════════
   18. BACK TO TOP BUTTON
════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 4l-8 8h5v8h6v-8h5z"/></svg>`;
  const s = document.createElement('style');
  s.textContent = `
    #back-to-top{
      position:fixed;bottom:2rem;right:2rem;z-index:9000;
      width:46px;height:46px;border-radius:50%;
      background:linear-gradient(135deg,#00d9ff,#7c3aed);
      border:none;color:#0a0e27;display:flex;align-items:center;justify-content:center;
      cursor:none;opacity:0;visibility:hidden;
      transition:opacity .3s,visibility .3s,transform .3s;
      box-shadow:0 4px 16px rgba(0,217,255,.4);
    }
    #back-to-top.visible{opacity:1;visibility:visible;}
    #back-to-top:hover{transform:translateY(-4px) scale(1.1);}
  `;
  document.head.appendChild(s);
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ════════════════════════════════════════════
   19. HERO BADGE SPARKLE
════════════════════════════════════════════ */
function initBadgeSparkle() {
  if (prefersReducedMotion()) return;
  const badge = $('.hero-badge');
  if (!badge) return;
  badge.style.position = 'relative';
  badge.style.overflow = 'visible';

  const spawnSparkle = () => {
    const s = document.createElement('span');
    s.style.cssText = `
      position:absolute;pointer-events:none;
      left:${Math.random() * 120}%;top:${Math.random() * 140 - 20}%;
      width:4px;height:4px;border-radius:50%;
      background:#10b981;opacity:1;
      animation:sparkleAnim .8s ease forwards;
    `;
    badge.appendChild(s);
    setTimeout(() => s.remove(), 820);
  };

  const ss = document.createElement('style');
  ss.textContent = `@keyframes sparkleAnim{0%{transform:scale(0) translateY(0);opacity:1}100%{transform:scale(1.5) translateY(-20px);opacity:0}}`;
  document.head.appendChild(ss);
  setInterval(spawnSparkle, 600);
}

/* ════════════════════════════════════════════
   20. KONAMI CODE EASTER EGG
════════════════════════════════════════════ */
function initKonami() {
  const code = [38,38,40,40,37,39,37,39,66,65];
  let seq = [];
  document.addEventListener('keydown', e => {
    seq.push(e.keyCode);
    if (seq.length > code.length) seq.shift();
    if (seq.join(',') === code.join(',')) {
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div style="position:fixed;inset:0;z-index:99999;background:rgba(5,7,26,.96);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;
          font-family:'JetBrains Mono',monospace;color:#e8eaed;text-align:center;padding:2rem;">
          <div style="font-size:3rem">👾</div>
          <div style="font-size:1.5rem;font-weight:700;background:linear-gradient(135deg,#00d9ff,#7c3aed,#ec4899);
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
            KONAMI CODE UNLOCKED
          </div>
          <div style="color:#a8b2d1;font-size:.9rem">You found the secret! 🎉<br/>Tahmid Alvee appreciates curious minds.</div>
          <button onclick="this.closest('div[style]').remove()"
            style="margin-top:1rem;padding:.75rem 2rem;background:linear-gradient(135deg,#00d9ff,#7c3aed);
            color:#0a0e27;border:none;border-radius:12px;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;">
            Close
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      seq = [];
    }
  });
}

/* ════════════════════════════════════════════
   21. PROJECT CARD IMAGE SHINE EFFECT
════════════════════════════════════════════ */
function initCardShine() {
  if (isMobile() || prefersReducedMotion()) return;
  const shineStyle = document.createElement('style');
  shineStyle.textContent = `
    .project-image,.cert-image-wrapper{position:relative;overflow:hidden;}
    .project-image::after,.cert-image-wrapper::after{
      content:'';position:absolute;inset:0;
      background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.09) 50%,transparent 60%);
      transform:translateX(-100%);transition:transform .5s ease;pointer-events:none;
    }
    .project-card:hover .project-image::after,
    .cert-card:hover .cert-image-wrapper::after{transform:translateX(100%);}
  `;
  document.head.appendChild(shineStyle);
}

/* ════════════════════════════════════════════
   22. SOCIAL LINK RIPPLE
════════════════════════════════════════════ */
function initRipple() {
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    .ripple-host{position:relative;overflow:hidden;}
    .ripple-wave{
      position:absolute;border-radius:50%;background:rgba(255,255,255,.2);
      transform:scale(0);animation:rippleGrow .5s ease-out forwards;pointer-events:none;
    }
    @keyframes rippleGrow{to{transform:scale(4);opacity:0;}}
  `;
  document.head.appendChild(rippleStyle);

  $$('.btn, .social-btn, .footer-social-icon, .project-btn-live, .cert-download-btn').forEach(el => {
    el.classList.add('ripple-host');
    el.addEventListener('click', e => {
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const x = e.clientX - r.left - size / 2;
      const y = e.clientY - r.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });
}

/* ════════════════════════════════════════════
   23. HERO HEADING WORD-BY-WORD ANIMATION
════════════════════════════════════════════ */
function initHeroAnimation() {
  if (prefersReducedMotion()) return;
  const heading = $('.hero-heading');
  const badge = $('.hero-badge');
  const desc = $('.hero-desc');
  const cta = $('.hero-cta');
  const social = $('.hero-social');
  const img = $('.hero-image');
  const stats = $('.hero-stats');

  const animStyle = document.createElement('style');
  animStyle.textContent = `
    .hero-anim{opacity:0;transform:translateY(30px);animation:heroReveal .7s cubic-bezier(.22,1,.36,1) forwards;}
    @keyframes heroReveal{to{opacity:1;transform:none;}}
    .hero-image-anim{opacity:0;transform:translateX(40px) scale(.96);animation:heroImgReveal .9s cubic-bezier(.22,1,.36,1) .5s forwards;}
    @keyframes heroImgReveal{to{opacity:1;transform:none;}}
    .hero-stats-anim{opacity:0;transform:translateY(20px);animation:heroReveal .7s cubic-bezier(.22,1,.36,1) forwards;}
  `;
  document.head.appendChild(animStyle);

  const delays = [badge, heading, desc, cta, social];
  delays.forEach((el, i) => {
    if (!el) return;
    el.classList.add('hero-anim');
    el.style.animationDelay = (0.1 + i * 0.12) + 's';
  });
  if (img) { img.classList.add('hero-image-anim'); }
  if (stats) { stats.classList.add('hero-stats-anim'); stats.style.animationDelay = '0.75s'; }
}

/* ════════════════════════════════════════════
   24. SECTION DIVIDERS — animated wave
════════════════════════════════════════════ */
function initDividers() {
  const waveStyle = document.createElement('style');
  waveStyle.textContent = `
    .section-wave{
      position:absolute;bottom:-1px;left:0;width:100%;overflow:hidden;line-height:0;pointer-events:none;z-index:1;
    }
    .section-wave svg{display:block;width:100%;height:50px;}
    .section-wave-top{
      position:absolute;top:-1px;left:0;width:100%;overflow:hidden;line-height:0;pointer-events:none;z-index:1;transform:rotate(180deg);
    }
    .section-wave-top svg{display:block;width:100%;height:40px;}
  `;
  document.head.appendChild(waveStyle);
}

/* ════════════════════════════════════════════
   INIT ALL (called after loader)
════════════════════════════════════════════ */
function initAll() {
  initCursor();
  initParticles();
  initScrollProgress();
  initNavbar();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initTiltCards();
  initMagneticButtons();
  initScrollSpy();
  initParallax();
  initGlitch();
  initForm();
  initSmoothScroll();
  initGrain();
  initBackToTop();
  initBadgeSparkle();
  initKonami();
  initCardShine();
  initRipple();
  initHeroAnimation();
  initDividers();
}

/* ════════════════════════════════════════════
   BOOT
════════════════════════════════════════════ */
initLoader(); // immediately mount loader; initAll fires after window load

/**
 * TAHMID ALVEE — PORTFOLIO
 * main.js  |  v2.1
 *
 * Feature list:
 *  01  Page loader (DNA helix spinner)
 *  02  Custom cursor (magnetic + trail + morphing)
 *  03  Particle canvas (hero background + mouse warp)
 *  04  Scroll progress bar (glowing)
 *  05  Navbar (shrink on scroll + mobile menu)
 *  06  Typewriter effect (hero role)
 *  07  Staggered scroll-reveal animations
 *  08  Skill bar animated fill
 *  09  Learning bar animated fill
 *  10  Counter animation (stats)
 *  11  3D tilt cards with dynamic lighting
 *  12  Magnetic buttons
 *  13  Scroll spy (active nav link)
 *  14  Parallax (hero image + depth layers)
 *  15  Glitch text on section titles
 *  16  Form UX (floating labels, shake, success state)
 *  17  Smooth scroll
 *  18  Grain / noise overlay
 *  19  Back-to-top button
 *  20  Hero badge sparkle
 *  21  Konami code easter egg
 *  22  Holographic card shine
 *  23  Ripple effect on buttons
 *  24  Hero staggered entrance animation
 *  25  Local time clock (Dhaka)
 *  26  Name scramble effect
 *  27  Radar chart (Chart.js)
 *  28  GitHub contribution heatmap
 *  29  Testimonial carousel (auto-advance + swipe)
 *  30  Floating ambient orbs
 *  31  Hero stats pulse rings
 *  32  Section title split-char reveal
 *  33  Nav link hover warp
 *  34  Scroll-triggered background shift
 *  35  Project card scan-line effect
 *  36  Hero ring orbit dots
 *  37  Learning card stagger entrance
 */


/* --------------------------------------------------
   UTILITIES
-------------------------------------------------- */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const isMobile = () => window.innerWidth <= 768;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));


/* --------------------------------------------------
   01  PAGE LOADER — DNA HELIX SPINNER
-------------------------------------------------- */

function initLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-inner">
            <div class="loader-dna">
                <canvas id="dna-canvas" width="80" height="120"></canvas>
            </div>
            <div class="loader-logo">
                <span class="loader-bracket">&lt;</span>
                <span class="loader-name">Tahmid Alvee</span>
                <span class="loader-bracket">/&gt;</span>
            </div>
            <div class="loader-bar-track"><div class="loader-bar"></div></div>
            <div class="loader-pct">0%</div>
            <div class="loader-status">Initializing portfolio...</div>
        </div>
    `;
    document.body.appendChild(loader);

    const style = document.createElement('style');
    style.textContent = `
        #page-loader {
            position: fixed; inset: 0; z-index: 99999;
            background: #05071a;
            display: flex; align-items: center; justify-content: center;
            transition: opacity .8s cubic-bezier(.77,0,.175,1), visibility .8s;
        }
        #page-loader.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
        .loader-inner {
            text-align: center; display: flex; flex-direction: column;
            align-items: center; gap: 1.2rem;
        }
        .loader-dna { margin-bottom: 0.5rem; }
        .loader-logo { font-family: 'JetBrains Mono', monospace; font-size: 1.4rem; font-weight: 700; }
        .loader-bracket { color: #00d9ff; }
        .loader-name {
            margin: 0 .3rem;
            background: linear-gradient(135deg, #00d9ff, #7c3aed, #ec4899);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .loader-bar-track {
            width: 240px; height: 2px;
            background: rgba(0,217,255,.12); border-radius: 50px; overflow: hidden;
        }
        .loader-bar {
            height: 100%; width: 0%;
            background: linear-gradient(90deg, #00d9ff, #7c3aed, #ec4899);
            transition: width .1s linear;
            box-shadow: 0 0 8px rgba(0,217,255,.6);
        }
        .loader-pct { font-family: 'JetBrains Mono', monospace; font-size: .75rem; color: #00d9ff; font-weight: 700; }
        .loader-status { font-family: 'JetBrains Mono', monospace; font-size: .65rem; color: #3a4166; }
    `;
    document.head.appendChild(style);

    // draw the rotating double helix on the canvas
    const dnaCanvas = $('#dna-canvas');
    const dnaCtx = dnaCanvas.getContext('2d');
    let dnaAngle = 0;

    function drawDNA() {
        dnaCtx.clearRect(0, 0, 80, 120);
        const cx = 40;
        const dots = 12;

        for (let i = 0; i < dots; i++) {
            const t = (i / dots) * Math.PI * 2;
            const y = (i / dots) * 120;
            const x1 = cx + Math.cos(t + dnaAngle) * 28;
            const x2 = cx + Math.cos(t + dnaAngle + Math.PI) * 28;
            const sz1 = 2 + (Math.cos(t + dnaAngle) + 1) * 2;
            const sz2 = 2 + (Math.cos(t + dnaAngle + Math.PI) + 1) * 2;
            const alpha1 = 0.3 + (Math.cos(t + dnaAngle) + 1) * 0.35;
            const alpha2 = 0.3 + (Math.cos(t + dnaAngle + Math.PI) + 1) * 0.35;

            // connector between the two strands every 3 dots
            if (i % 3 === 0) {
                dnaCtx.beginPath();
                dnaCtx.moveTo(x1, y + 5);
                dnaCtx.lineTo(x2, y + 5);
                dnaCtx.strokeStyle = `rgba(124,58,237,${alpha1 * 0.5})`;
                dnaCtx.lineWidth = 1;
                dnaCtx.stroke();
            }

            // left strand dot (cyan)
            dnaCtx.beginPath();
            dnaCtx.arc(x1, y + 5, sz1, 0, Math.PI * 2);
            dnaCtx.fillStyle = `rgba(0,217,255,${alpha1})`;
            dnaCtx.shadowColor = '#00d9ff';
            dnaCtx.shadowBlur = 8;
            dnaCtx.fill();

            // right strand dot (pink)
            dnaCtx.beginPath();
            dnaCtx.arc(x2, y + 5, sz2, 0, Math.PI * 2);
            dnaCtx.fillStyle = `rgba(236,72,153,${alpha2})`;
            dnaCtx.shadowColor = '#ec4899';
            dnaCtx.shadowBlur = 8;
            dnaCtx.fill();
            dnaCtx.shadowBlur = 0;
        }

        dnaAngle += 0.05;
        requestAnimationFrame(drawDNA);
    }
    drawDNA();

    // cycle through loading status messages
    const statuses = [
        'Initializing portfolio...',
        'Loading assets...',
        'Rendering components...',
        'Injecting animations...',
        'Optimizing performance...',
        'Almost ready...'
    ];
    let statusIdx = 0;
    const statusEl = $('.loader-status');
    const statusTimer = setInterval(() => {
        statusIdx = (statusIdx + 1) % statuses.length;
        statusEl.textContent = statuses[statusIdx];
    }, 400);

    // fake progress bar that fills up to 95% then jumps to 100 on load
    const bar = $('.loader-bar');
    const pct = $('.loader-pct');
    let p = 0;
    const progressTimer = setInterval(() => {
        p = clamp(p + Math.random() * 16, 0, 95);
        bar.style.width = p + '%';
        pct.textContent = Math.round(p) + '%';
    }, 100);

    window.addEventListener('load', () => {
        clearInterval(progressTimer);
        clearInterval(statusTimer);
        bar.style.width = '100%';
        pct.textContent = '100%';
        statusEl.textContent = 'Ready.';
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            initAll();
        }, 600);
    });

    document.body.style.overflow = 'hidden';
}


/* --------------------------------------------------
   02  CUSTOM CURSOR — MORPHING + TRAIL
-------------------------------------------------- */

function initCursor() {
    if (isMobile() || prefersReducedMotion()) return;

    const style = document.createElement('style');
    style.textContent = `
        * { cursor: none !important; }
        #c-dot {
            position: fixed; top: 0; left: 0; pointer-events: none; z-index: 99998;
            width: 6px; height: 6px; border-radius: 50%;
            background: #00d9ff;
            box-shadow: 0 0 10px #00d9ff, 0 0 20px rgba(0,217,255,0.4);
            margin: -3px 0 0 -3px;
            transition: transform .08s, background .2s, box-shadow .2s;
            will-change: transform;
        }
        #c-ring {
            position: fixed; top: 0; left: 0; pointer-events: none; z-index: 99997;
            width: 36px; height: 36px; border-radius: 50%;
            border: 1.5px solid rgba(0,217,255,.5);
            margin: -18px 0 0 -18px;
            transition: width .3s cubic-bezier(.22,1,.36,1), height .3s cubic-bezier(.22,1,.36,1),
                        border-color .3s, border-radius .3s;
            will-change: transform;
        }
        #c-dot.hover  { transform: scale(0); background: #ec4899; }
        #c-ring.hover { width: 52px; height: 52px; border-color: rgba(236,72,153,.7); border-radius: 8px; }
        #c-dot.click  { transform: scale(3); opacity: 0; transition: transform .2s, opacity .2s; }
        #c-ring.click { width: 20px; height: 20px; }
        .cursor-trail {
            position: fixed; top: 0; left: 0; pointer-events: none; z-index: 99996;
            width: 4px; height: 4px; border-radius: 50%;
            background: rgba(0,217,255,.35);
            margin: -2px 0 0 -2px;
            transition: opacity .4s;
        }
    `;
    document.head.appendChild(style);

    const dot  = document.createElement('div'); dot.id  = 'c-dot';
    const ring = document.createElement('div'); ring.id = 'c-ring';
    document.body.append(dot, ring);

    // fade-out ghost trail behind the cursor
    const TRAIL_LEN = 8;
    const trail = [];
    for (let i = 0; i < TRAIL_LEN; i++) {
        const t = document.createElement('div');
        t.className = 'cursor-trail';
        t.style.opacity  = (1 - i / TRAIL_LEN) * 0.5 + '';
        t.style.width    = t.style.height = (4 - i * 0.4) + 'px';
        document.body.appendChild(t);
        trail.push({ el: t, x: 0, y: 0 });
    }

    let mx = 0, my = 0, rx = 0, ry = 0;
    const trailPositions = Array(TRAIL_LEN).fill({ x: 0, y: 0 });

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const tick = () => {
        rx = lerp(rx, mx, 0.14);
        ry = lerp(ry, my, 0.14);

        dot.style.transform  = `translate(${mx}px,${my}px)`;
        ring.style.transform = `translate(${rx}px,${ry}px)`;

        trailPositions.unshift({ x: mx, y: my });
        trailPositions.length = TRAIL_LEN;
        trail.forEach((t, i) => {
            const tp = trailPositions[Math.min(i + 1, trailPositions.length - 1)];
            t.x = lerp(t.x, tp.x, 0.35 - i * 0.03);
            t.y = lerp(t.y, tp.y, 0.35 - i * 0.03);
            t.el.style.transform = `translate(${t.x}px,${t.y}px)`;
        });

        requestAnimationFrame(tick);
    };
    tick();

    // elements that trigger the hover state on the cursor
    const hoverTargets = [
        'a', 'button', '.btn', '.project-card', '.skill-card', '.cert-card',
        '.nav-link', '.social-link', '.social-btn', '.footer-social-icon',
        '.t-nav-btn', '.t-dot', '.role-card', '.highlight-item'
    ].join(',');

    document.addEventListener('mouseover',  e => { if (e.target.closest(hoverTargets)) { dot.classList.add('hover');  ring.classList.add('hover');  } });
    document.addEventListener('mouseout',   e => { if (e.target.closest(hoverTargets)) { dot.classList.remove('hover'); ring.classList.remove('hover'); } });
    document.addEventListener('mousedown',  () => { dot.classList.add('click');    ring.classList.add('click');    });
    document.addEventListener('mouseup',    () => { dot.classList.remove('click'); ring.classList.remove('click'); });
}


/* --------------------------------------------------
   03  PARTICLE CANVAS — MOUSE WARP + CONNECTIONS
-------------------------------------------------- */

function initParticles() {
    if (prefersReducedMotion()) return;
    const hero = $('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'hero-canvas';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.6;';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H;
    let mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };

    const resize = () => {
        W = canvas.width  = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
    };
    resize();
    new ResizeObserver(resize).observe(hero);

    hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mouse.vx = e.clientX - r.left - mouse.x;
        mouse.vy = e.clientY - r.top  - mouse.y;
        mouse.x  = e.clientX - r.left;
        mouse.y  = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => {
        mouse.x = -9999; mouse.y = -9999; mouse.vx = 0; mouse.vy = 0;
    });

    const N = isMobile() ? 55 : 120;
    const colors = ['#00d9ff', '#7c3aed', '#ec4899', '#10b981'];
    const shapes = ['circle', 'circle', 'circle', 'diamond', 'plus'];

    class Particle {
        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x    = Math.random() * W;
            this.y    = initial ? Math.random() * H : H + 20;
            this.r    = rand(1.2, 3.2);
            this.color = colors[randInt(0, colors.length)];
            this.alpha = rand(0.15, 0.75);
            this.speed = rand(0.18, 0.55);
            this.drift = rand(-0.3, 0.3);
            this.pulse = rand(0, Math.PI * 2);
            this.pulseSpeed = rand(0.008, 0.025);
            this.shape    = shapes[randInt(0, shapes.length)];
            this.rotation = rand(0, Math.PI * 2);
            this.rotSpeed = rand(-0.02, 0.02);
            this.vx = 0; this.vy = 0;
        }

        update() {
            this.pulse    += this.pulseSpeed;
            this.rotation += this.rotSpeed;
            this.y -= this.speed;
            this.x += this.drift + Math.sin(this.pulse * 0.6) * 0.25;

            // push particles away from the mouse with a bit of velocity carry
            const dx   = this.x - mouse.x;
            const dy   = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                const force = (100 - dist) / 100;
                const angle = Math.atan2(dy, dx);
                this.vx += (Math.cos(angle) * force * 3) + mouse.vx * force * 0.08;
                this.vy += (Math.sin(angle) * force * 3) + mouse.vy * force * 0.08;
            }
            this.vx *= 0.9;
            this.vy *= 0.9;
            this.x  += this.vx;
            this.y  += this.vy;

            if (this.y < -10)    this.reset();
            if (this.x < -10)    this.x = W + 10;
            if (this.x > W + 10) this.x = -10;
        }

        draw() {
            const a = this.alpha * (0.65 + 0.35 * Math.sin(this.pulse));
            ctx.save();
            ctx.globalAlpha = a;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle   = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur  = 8;

            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.r, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.shape === 'diamond') {
                const d = this.r * 1.6;
                ctx.beginPath();
                ctx.moveTo(0, -d); ctx.lineTo(d, 0); ctx.lineTo(0, d); ctx.lineTo(-d, 0);
                ctx.closePath();
                ctx.fill();
            } else if (this.shape === 'plus') {
                const w = this.r * 0.5, l = this.r * 1.8;
                ctx.fillRect(-w, -l, w * 2, l * 2);
                ctx.fillRect(-l, -w, l * 2, w * 2);
            }
            ctx.restore();
        }
    }

    const particles = Array.from({ length: N }, () => new Particle());

    // draw faint gradient lines between nearby particles
    function drawConnections() {
        const thresh = isMobile() ? 75 : 110;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < thresh) {
                    ctx.save();
                    ctx.globalAlpha = (1 - d / thresh) * 0.15;
                    const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    grad.addColorStop(0, particles[i].color);
                    grad.addColorStop(1, particles[j].color);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth   = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    const animate = () => {
        ctx.clearRect(0, 0, W, H);
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    };
    animate();
}


/* --------------------------------------------------
   04  SCROLL PROGRESS BAR
-------------------------------------------------- */

function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.style.cssText = `
        position: fixed; top: 0; left: 0; height: 3px; width: 0%;
        background: linear-gradient(90deg, #00d9ff, #7c3aed, #ec4899);
        z-index: 10001;
        box-shadow: 0 0 12px rgba(0,217,255,.8), 0 0 24px rgba(0,217,255,.3);
    `;

    // bright dot that rides the end of the bar
    const glowDot = document.createElement('div');
    glowDot.style.cssText = `
        position: absolute; right: 0; top: 50%; transform: translateY(-50%);
        width: 8px; height: 8px; border-radius: 50%;
        background: #00d9ff;
        box-shadow: 0 0 12px #00d9ff, 0 0 24px rgba(0,217,255,.6);
    `;
    bar.appendChild(glowDot);
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
        bar.style.width = pct + '%';
    }, { passive: true });
}


/* --------------------------------------------------
   05  NAVBAR — SHRINK ON SCROLL + MOBILE MENU
-------------------------------------------------- */

function initNavbar() {
    const nav = $('.navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    const menu = $('.nav-menu');
    if (!menu) return;

    const ham = document.createElement('button');
    ham.id = 'nav-ham';
    ham.setAttribute('aria-label', 'Menu');
    ham.innerHTML = `<span></span><span></span><span></span>`;

    const hamStyle = document.createElement('style');
    hamStyle.textContent = `
        #nav-ham {
            display: none; flex-direction: column; gap: 5px;
            background: none; border: none; cursor: none;
            padding: 6px; z-index: 200;
        }
        #nav-ham span {
            display: block; width: 24px; height: 2px;
            background: #00d9ff; border-radius: 2px;
            transition: all .3s ease;
        }
        #nav-ham.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        #nav-ham.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        #nav-ham.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (max-width: 1024px) {
            #nav-ham { display: flex; }
            .nav-menu {
                position: fixed; top: 0; right: 0; height: 100vh; width: 260px;
                background: rgba(10,14,39,.98); backdrop-filter: blur(20px);
                flex-direction: column; justify-content: center;
                align-items: center; gap: 2rem;
                transform: translateX(100%);
                transition: transform .4s cubic-bezier(.77,0,.175,1);
                border-left: 1px solid rgba(0,217,255,.15);
                display: flex !important;
            }
            .nav-menu.open { transform: translateX(0); }
            .nav-link { font-size: 1.2rem; }
        }
    `;
    document.head.appendChild(hamStyle);

    ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        menu.classList.toggle('open');
    });

    // close menu when any nav link is clicked
    $$('.nav-link').forEach(l => l.addEventListener('click', () => {
        ham.classList.remove('open');
        menu.classList.remove('open');
    }));

    $('.nav-container').appendChild(ham);
}


/* --------------------------------------------------
   06  TYPEWRITER — HERO ROLE CYCLING
-------------------------------------------------- */

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

    const bracket = t =>
        `<span class="hero-role__bracket">&lt;</span>${t}<span class="hero-role__bracket">/&gt;</span>`;
    const cursor =
        `<span id="tw-cursor" style="display:inline-block;width:2px;height:1.1em;background:#00d9ff;` +
        `margin-left:3px;vertical-align:middle;animation:twBlink .75s step-end infinite;` +
        `box-shadow:0 0 8px #00d9ff;"></span>`;

    const twStyle = document.createElement('style');
    twStyle.textContent = `@keyframes twBlink { 0%,100% { opacity:1 } 50% { opacity:0 } }`;
    document.head.appendChild(twStyle);

    const type = () => {
        const full = roles[ri];
        if (deleting) {
            ci--;
            el.innerHTML = bracket(full.slice(0, ci)) + cursor;
            if (ci === 0) {
                deleting = false;
                ri = (ri + 1) % roles.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 45);
        } else {
            ci++;
            el.innerHTML = bracket(full.slice(0, ci)) + cursor;
            if (ci === full.length) {
                deleting = true;
                setTimeout(type, 2200);
                return;
            }
            setTimeout(type, 80);
        }
    };

    el.innerHTML = bracket('') + cursor;
    setTimeout(type, 1000);
}


/* --------------------------------------------------
   07  SCROLL REVEAL — BLUR + SLIDE
-------------------------------------------------- */

function initScrollReveal() {
    if (prefersReducedMotion()) return;

    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .reveal {
            opacity: 0; transform: translateY(48px); filter: blur(4px);
            transition: opacity .75s cubic-bezier(.22,1,.36,1),
                        transform .75s cubic-bezier(.22,1,.36,1), filter .75s ease;
        }
        .reveal.visible { opacity: 1; transform: none; filter: none; }

        .reveal-left {
            opacity: 0; transform: translateX(-56px); filter: blur(4px);
            transition: opacity .75s cubic-bezier(.22,1,.36,1),
                        transform .75s cubic-bezier(.22,1,.36,1), filter .75s ease;
        }
        .reveal-left.visible { opacity: 1; transform: none; filter: none; }

        .reveal-right {
            opacity: 0; transform: translateX(56px); filter: blur(4px);
            transition: opacity .75s cubic-bezier(.22,1,.36,1),
                        transform .75s cubic-bezier(.22,1,.36,1), filter .75s ease;
        }
        .reveal-right.visible { opacity: 1; transform: none; filter: none; }

        .reveal-scale {
            opacity: 0; transform: scale(.85); filter: blur(6px);
            transition: opacity .7s cubic-bezier(.22,1,.36,1),
                        transform .7s cubic-bezier(.22,1,.36,1), filter .7s ease;
        }
        .reveal-scale.visible { opacity: 1; transform: scale(1); filter: none; }

        .reveal-rotate {
            opacity: 0; transform: perspective(600px) rotateY(-25deg) translateX(-30px); filter: blur(5px);
            transition: opacity .8s cubic-bezier(.22,1,.36,1),
                        transform .8s cubic-bezier(.22,1,.36,1), filter .8s ease;
        }
        .reveal-rotate.visible { opacity: 1; transform: perspective(600px) rotateY(0) translateX(0); filter: none; }
    `;
    document.head.appendChild(revealStyle);

    // map selectors to their reveal class and stagger delay
    const groups = [
        { sel: '.about-text p, .about-intro, .about-highlights, .about-education', cls: 'reveal',        delay: 0.08 },
        { sel: '.highlight-item',                                                   cls: 'reveal-left',   delay: 0.1  },
        { sel: '.timeline-item',                                                    cls: 'reveal-right',  delay: 0.12 },
        { sel: '.skill-card',                                                       cls: 'reveal-scale',  delay: 0.04 },
        { sel: '.about-learning__card',                                             cls: 'reveal-scale',  delay: 0.08 },
        { sel: '.role-card',                                                        cls: 'reveal-rotate', delay: 0.1  },
        { sel: '.project-card',                                                     cls: 'reveal',        delay: 0.1  },
        { sel: '.cert-card',                                                        cls: 'reveal',        delay: 0.08 },
        { sel: '.experience-card',                                                  cls: 'reveal-left',   delay: 0.12 },
        { sel: '.testimonial-card',                                                 cls: 'reveal',        delay: 0.1  },
        { sel: '.contact-item, .contact-form-wrapper, .contact-text',              cls: 'reveal',        delay: 0.1  },
        { sel: '.section-header',                                                   cls: 'reveal',        delay: 0    },
        { sel: '.radar-section, .github-section',                                   cls: 'reveal',        delay: 0    },
        { sel: '.platform-card',                                                    cls: 'reveal',        delay: 0    },
        { sel: '.stat-item',                                                        cls: 'reveal-scale',  delay: 0.1  },
    ];

    groups.forEach(({ sel, cls, delay }) => {
        $$(sel).forEach((el, i) => {
            el.classList.add(cls);
            el.style.transitionDelay = (i * delay) + 's';
        });
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate').forEach(el => obs.observe(el));
}


/* --------------------------------------------------
   08  SKILL BAR ANIMATION
-------------------------------------------------- */

function initSkillBars() {
    // store the target width then reset to 0 so we can animate in
    const fills = $$('.skill-fill');
    fills.forEach(f => {
        f.dataset.target = f.style.width;
        f.style.width = '0%';
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const fill = e.target.querySelector('.skill-fill');
                if (fill) setTimeout(() => { fill.style.width = fill.dataset.target; }, 200);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.4 });

    $$('.skill-card').forEach(c => obs.observe(c));
}


/* --------------------------------------------------
   09  LEARNING BAR ANIMATION
-------------------------------------------------- */

function initLearningBars() {
    const fills = $$('.about-learning__fill');
    fills.forEach(f => {
        f.dataset.target = f.style.width;
        f.style.width = '0%';
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const fill = e.target.querySelector('.about-learning__fill');
                if (fill) setTimeout(() => { fill.style.width = fill.dataset.target; }, 300);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.4 });

    $$('.about-learning__card').forEach(c => obs.observe(c));
}


/* --------------------------------------------------
   10  COUNTER ANIMATION — STATS
-------------------------------------------------- */

function initCounters() {
    const ease = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    const animateCounter = el => {
        const text = el.textContent;
        const num  = parseFloat(text);
        const suffix = text.replace(/[\d.]/g, '');
        if (isNaN(num)) return;

        const duration = 2000;
        const start    = performance.now();
        const tick = now => {
            const t = clamp((now - start) / duration, 0, 1);
            el.textContent = Math.round(ease(t) * num) + suffix;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = text;
        };
        requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(entries => {
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


/* --------------------------------------------------
   11  3D TILT CARDS — DYNAMIC LIGHTING
-------------------------------------------------- */

function initTiltCards() {
    if (isMobile() || prefersReducedMotion()) return;

    const cards = $$(
        '.project-card, .cert-card, .role-card, .skill-card, ' +
        '.about-learning__card, .experience-card'
    );

    cards.forEach(card => {
        let raf;

        // highlight that follows the mouse position
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute; inset: 0; border-radius: inherit;
            pointer-events: none;
            background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 60%);
            opacity: 0; transition: opacity .3s; z-index: 2;
        `;
        if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
        card.appendChild(shine);

        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
            const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                card.style.transform   = `perspective(900px) rotateY(${dx * 9}deg) rotateX(${-dy * 9}deg) translateZ(12px) scale(1.02)`;
                card.style.transition  = 'transform .05s linear';
                card.style.boxShadow   = `${-dx * 12}px ${-dy * 12}px 32px rgba(0,217,255,0.15), 0 8px 40px rgba(0,0,0,0.4)`;
                const sx = ((e.clientX - r.left) / r.width)  * 100;
                const sy = ((e.clientY - r.top)  / r.height) * 100;
                shine.style.background = `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.10) 0%, transparent 60%)`;
                shine.style.opacity    = '1';
            });
        });

        card.addEventListener('mouseleave', () => {
            cancelAnimationFrame(raf);
            card.style.transform  = '';
            card.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1), border-color .3s, box-shadow .4s';
            card.style.boxShadow  = '';
            shine.style.opacity   = '0';
        });
    });
}


/* --------------------------------------------------
   12  MAGNETIC BUTTONS
-------------------------------------------------- */

function initMagneticButtons() {
    if (isMobile() || prefersReducedMotion()) return;

    const btns = $$(
        '.btn-one, .btn-two, .btn-three, .btn-primary, ' +
        '.project-btn-live, .cert-download-btn'
    );

    btns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width  / 2)) * 0.32;
            const dy = (e.clientY - (r.top  + r.height / 2)) * 0.32;
            btn.style.transform  = `translate(${dx}px,${dy}px) translateY(-2px)`;
            btn.style.transition = 'transform .1s linear';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform  = '';
            btn.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
        });
    });
}


/* --------------------------------------------------
   13  SCROLL SPY — ACTIVE NAV LINK
   Uses IntersectionObserver to track which section
   is in view and highlights the matching nav link.
   (The IIFE version below is also kept for safety,
   but this one takes priority via the CSS it injects.)
-------------------------------------------------- */

function initScrollSpy() {
    const sections = $$('section[id]');
    const links    = $$('.nav-link');

    const spyStyle = document.createElement('style');
    spyStyle.textContent = `
        .nav-link.active { color: #00d9ff !important; }
        .nav-link.active::after { width: 100% !important; }
    `;
    document.head.appendChild(spyStyle);

    const visible = new Set();

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) visible.add(e.target.id);
            else visible.delete(e.target.id);
        });
        // pick the first section in DOM order that is currently visible
        const activeId = [...sections].map(s => s.id).find(id => visible.has(id));
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
        });
    }, { threshold: 0.05, rootMargin: '-60px 0px -10% 0px' });
    sections.forEach(s => obs.observe(s));
}


/* --------------------------------------------------
   14  PARALLAX — MULTI-LAYER
-------------------------------------------------- */

function initParallax() {
    if (isMobile() || prefersReducedMotion()) return;

    const ring      = $('.hero-image__ring');
    const heroText  = $('.hero-text');
    const stats     = $('.hero-stats');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (ring)     ring.style.transform     = `translateY(${y * 0.14}px)`;
        if (heroText) heroText.style.transform = `translateY(${y * 0.06}px)`;
        if (stats)    stats.style.transform    = `translateY(${y * 0.04}px)`;
    }, { passive: true });
}


/* --------------------------------------------------
   15  GLITCH TEXT ON SECTION TITLES
-------------------------------------------------- */

function initGlitch() {
    if (prefersReducedMotion()) return;

    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        .section-title { position: relative; }
        .section-title::before,
        .section-title::after {
            content: attr(data-text); position: absolute; inset: 0;
            background: inherit;
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            opacity: 0;
        }
        .section-title.glitch::before {
            opacity: .8; clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
            transform: translate(-4px,-1px); animation: glitch1 .25s steps(2) forwards;
        }
        .section-title.glitch::after {
            opacity: .8; clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%);
            transform: translate(4px,1px); animation: glitch2 .25s steps(2) forwards;
        }
        @keyframes glitch1 {
            0%   { transform: translate(-4px,-1px) }
            33%  { transform: translate(4px,2px)   }
            66%  { transform: translate(-2px,-2px) }
            100% { transform: translate(-1px,0)    }
        }
        @keyframes glitch2 {
            0%   { transform: translate(4px,1px)   }
            33%  { transform: translate(-4px,-2px) }
            66%  { transform: translate(2px,2px)   }
            100% { transform: translate(1px,0)     }
        }
    `;
    document.head.appendChild(glitchStyle);

    const trigger = el => {
        el.classList.add('glitch');
        setTimeout(() => el.classList.remove('glitch'), 260);
    };

    $$('.section-title').forEach(el => {
        el.dataset.text = el.textContent;
        el.addEventListener('mouseenter', () => trigger(el));

        // also fire once when the title scrolls into view
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    setTimeout(() => trigger(el), 400);
                    obs.unobserve(el);
                }
            });
        });
        obs.observe(el);
    });
}


/* --------------------------------------------------
   16  FORM — FLOATING LABELS, VALIDATION, SUCCESS
-------------------------------------------------- */

function initForm() {
    const form = $('.contact-form');
    if (!form) return;

    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        .form-group { position: relative; }
        .form-group label {
            position: absolute; left: 0.875rem; top: 0.875rem;
            font-size: 1rem; color: #6b7694;
            pointer-events: none;
            transition: all .25s ease; padding: 0 .25rem;
        }
        .form-group input,
        .form-group textarea { padding-top: 1.4rem !important; padding-bottom: .4rem !important; }
        .form-group input:focus ~ label,
        .form-group input:not(:placeholder-shown) ~ label,
        .form-group textarea:focus ~ label,
        .form-group textarea:not(:placeholder-shown) ~ label {
            top: .3rem; font-size: .72rem; color: #00d9ff;
        }
        @keyframes shake {
            0%,100% { transform: translateX(0)  }
            20%,60%  { transform: translateX(-7px) }
            40%,80%  { transform: translateX(7px)  }
        }
        .form-shake { animation: shake .4s ease; }
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239,68,68,.12) !important;
        }
        .form-success {
            background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.4);
            border-radius: 12px; padding: 2rem; text-align: center;
            color: #10b981; display: none;
            animation: successPop .5s cubic-bezier(.22,1,.36,1);
        }
        .form-success.show { display: block; }
        @keyframes successPop { from { opacity:0; transform:scale(.9) } to { opacity:1; transform:scale(1) } }
        .btn-primary .btn-spinner {
            display: none; width: 16px; height: 16px;
            border: 2px solid rgba(10,14,39,.4); border-top-color: #0a0e27;
            border-radius: 50%; animation: spin .7s linear infinite;
        }
        .btn-primary.loading .btn-spinner { display: inline-block; }
        .btn-primary.loading .btn-text    { display: none; }
        @keyframes spin { to { transform: rotate(360deg) } }
    `;
    document.head.appendChild(floatStyle);

    // move label after input so the CSS sibling selector works
    $$('.form-group', form).forEach(g => {
        const label = $('label', g);
        const input = $('input,textarea', g);
        if (!label || !input) return;
        input.placeholder = ' ';
        g.appendChild(label);
    });

    // wrap submit button text so we can swap in a spinner
    const submitBtn = $('button[type="submit"]', form);
    if (submitBtn) {
        submitBtn.innerHTML = `<span class="btn-text">${submitBtn.innerHTML}</span><span class="btn-spinner"></span>`;
    }

    const success = document.createElement('div');
    success.className = 'form-success';
    success.innerHTML = `
        <div style="font-size:2.5rem;margin-bottom:.75rem">✅</div>
        <strong style="font-size:1.1rem">Message sent!</strong>
        <p style="margin-top:.5rem;font-size:.9rem;opacity:.8">I'll get back to you soon.</p>
    `;
    form.parentNode.insertBefore(success, form.nextSibling);

    form.addEventListener('submit', async e => {
        e.preventDefault();
        let valid = true;
        $$('input,textarea', form).forEach(input => {
            input.classList.remove('error');
            if (!input.value.trim()) { input.classList.add('error'); valid = false; }
        });
        if (!valid) {
            form.classList.add('form-shake');
            setTimeout(() => form.classList.remove('form-shake'), 420);
            return;
        }
        if (submitBtn) submitBtn.classList.add('loading');
        try {
            const action = form.action;
            if (!action.includes('YOUR_FORM_ID')) {
                await fetch(action, {
                    method: 'POST', body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });
            }
        } catch (_) {}
        setTimeout(() => {
            if (submitBtn) submitBtn.classList.remove('loading');
            form.style.display = 'none';
            success.classList.add('show');
        }, 1200);
    });

    $$('input,textarea', form).forEach(input => {
        input.addEventListener('input', () => input.classList.remove('error'));
    });
}


/* --------------------------------------------------
   17  SMOOTH SCROLL
-------------------------------------------------- */

function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const navH = $('.navbar')?.offsetHeight || 70;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
        });
    });
}


/* --------------------------------------------------
   18  GRAIN OVERLAY
-------------------------------------------------- */

function initGrain() {
    if (isMobile()) return;
    const grain = document.createElement('div');
    grain.id = 'grain';
    grain.style.cssText = `
        position: fixed; inset: 0; z-index: 9997; pointer-events: none; opacity: .025;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-repeat: repeat; background-size: 200px 200px;
    `;
    document.body.appendChild(grain);
}


/* --------------------------------------------------
   19  BACK-TO-TOP BUTTON
-------------------------------------------------- */

function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 4l-8 8h5v8h6v-8h5z"/></svg>`;

    const s = document.createElement('style');
    s.textContent = `
        #back-to-top {
            position: fixed; bottom: 2rem; right: 2rem; z-index: 9000;
            width: 48px; height: 48px; border-radius: 50%;
            background: linear-gradient(135deg, #00d9ff, #7c3aed);
            border: none; color: #0a0e27;
            display: flex; align-items: center; justify-content: center;
            cursor: none; opacity: 0; visibility: hidden;
            transition: opacity .3s, visibility .3s, transform .4s cubic-bezier(.22,1,.36,1);
            box-shadow: 0 4px 20px rgba(0,217,255,.45);
        }
        #back-to-top.visible { opacity: 1; visibility: visible; }
        #back-to-top:hover { transform: translateY(-5px) scale(1.12); box-shadow: 0 8px 28px rgba(0,217,255,.6); }
    `;
    document.head.appendChild(s);
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* --------------------------------------------------
   20  HERO BADGE — SPARKLE PARTICLES
-------------------------------------------------- */

function initBadgeSparkle() {
    if (prefersReducedMotion()) return;
    const badge = $('.hero-badge');
    if (!badge) return;

    badge.style.position = 'relative';
    badge.style.overflow = 'visible';

    const ss = document.createElement('style');
    ss.textContent = `
        @keyframes sparkleAnim {
            0%   { transform: scale(0)   translateY(0)    rotate(0deg);   opacity: 1; }
            100% { transform: scale(1.8) translateY(-28px) rotate(180deg); opacity: 0; }
        }
    `;
    document.head.appendChild(ss);

    const spawnSparkle = () => {
        const s = document.createElement('span');
        const hue = [0, 180, 270, 330][randInt(0, 4)];
        s.style.cssText = `
            position: absolute; pointer-events: none;
            left: ${Math.random() * 130}%; top: ${rand(-30, 110)}%;
            width: ${rand(3, 6)}px; height: ${rand(3, 6)}px; border-radius: 50%;
            background: hsl(${hue},90%,65%); opacity: 1;
            animation: sparkleAnim ${rand(0.6, 1)}s ease forwards;
        `;
        badge.appendChild(s);
        setTimeout(() => s.remove(), 1050);
    };

    setInterval(spawnSparkle, 500);
}


/* --------------------------------------------------
   21  KONAMI CODE EASTER EGG
-------------------------------------------------- */

function initKonami() {
    const code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let seq = [];

    document.addEventListener('keydown', e => {
        seq.push(e.keyCode);
        if (seq.length > code.length) seq.shift();
        if (seq.join(',') === code.join(',')) {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="position:fixed;inset:0;z-index:99999;background:rgba(5,7,26,.96);
                    display:flex;flex-direction:column;align-items:center;justify-content:center;
                    gap:1.5rem;font-family:'JetBrains Mono',monospace;color:#e8eaed;
                    text-align:center;padding:2rem;animation:fadeIn .4s ease;">
                    <div style="font-size:3rem">👾</div>
                    <div style="font-size:1.5rem;font-weight:700;
                        background:linear-gradient(135deg,#00d9ff,#7c3aed,#ec4899);
                        -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                        KONAMI CODE UNLOCKED
                    </div>
                    <div style="color:#a8b2d1;font-size:.9rem">
                        You found the secret! 🎉<br/>Tahmid Alvee appreciates curious minds.
                    </div>
                    <button onclick="this.closest('[style]').remove()"
                        style="margin-top:1rem;padding:.75rem 2rem;
                        background:linear-gradient(135deg,#00d9ff,#7c3aed);
                        color:#0a0e27;border:none;border-radius:12px;
                        font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;">
                        Close
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
            seq = [];
        }
    });
}


/* --------------------------------------------------
   22  HOLOGRAPHIC CARD SHINE
-------------------------------------------------- */

function initCardShine() {
    if (isMobile() || prefersReducedMotion()) return;

    const shineStyle = document.createElement('style');
    shineStyle.textContent = `
        .project-image, .cert-image-wrapper { position: relative; overflow: hidden; }
        .project-image::after,
        .cert-image-wrapper::after {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.1) 50%, transparent 65%);
            transform: translateX(-150%);
            transition: transform .7s cubic-bezier(.22,1,.36,1); pointer-events: none;
        }
        .project-card:hover .project-image::after,
        .cert-card:hover .cert-image-wrapper::after { transform: translateX(150%); }
    `;
    document.head.appendChild(shineStyle);
}


/* --------------------------------------------------
   23  RIPPLE EFFECT ON BUTTONS
-------------------------------------------------- */

function initRipple() {
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple-host { position: relative; overflow: hidden; }
        .ripple-wave {
            position: absolute; border-radius: 50%;
            background: rgba(255,255,255,.18);
            transform: scale(0);
            animation: rippleGrow .55s cubic-bezier(.22,1,.36,1) forwards;
            pointer-events: none;
        }
        @keyframes rippleGrow { to { transform: scale(4); opacity: 0; } }
    `;
    document.head.appendChild(rippleStyle);

    $$('.btn, .social-btn, .footer-social-icon, .project-btn-live, .cert-download-btn').forEach(el => {
        el.classList.add('ripple-host');
        el.addEventListener('click', e => {
            const r    = el.getBoundingClientRect();
            const size = Math.max(r.width, r.height);
            const ripple = document.createElement('span');
            ripple.className = 'ripple-wave';
            ripple.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${e.clientX - r.left - size / 2}px;
                top:  ${e.clientY - r.top  - size / 2}px;
            `;
            el.appendChild(ripple);
            setTimeout(() => ripple.remove(), 560);
        });
    });
}


/* --------------------------------------------------
   24  HERO ENTRANCE — STAGGERED ANIMATION
-------------------------------------------------- */

function initHeroAnimation() {
    if (prefersReducedMotion()) return;

    const animStyle = document.createElement('style');
    animStyle.textContent = `
        .hero-anim {
            opacity: 0; transform: translateY(32px); filter: blur(4px);
            animation: heroReveal .8s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes heroReveal { to { opacity:1; transform:none; filter:none; } }

        .hero-image-anim {
            opacity: 0; transform: translateX(48px) scale(.95); filter: blur(6px);
            animation: heroImgReveal 1s cubic-bezier(.22,1,.36,1) .45s forwards;
        }
        @keyframes heroImgReveal { to { opacity:1; transform:none; filter:none; } }

        .hero-stats-anim {
            opacity: 0; transform: translateY(24px); filter: blur(4px);
            animation: heroReveal .8s cubic-bezier(.22,1,.36,1) forwards;
        }
    `;
    document.head.appendChild(animStyle);

    // stagger each hero element in order
    [
        $('.hero-clock'),
        $('.hero-badge'),
        $('.hero-heading'),
        $('.hero-desc'),
        $('.hero-cta'),
        $('.hero-social')
    ].forEach((el, i) => {
        if (!el) return;
        el.classList.add('hero-anim');
        el.style.animationDelay = (0.08 + i * 0.1) + 's';
    });

    const img   = $('.hero-image');
    const stats = $('.hero-stats');
    if (img)   img.classList.add('hero-image-anim');
    if (stats) { stats.classList.add('hero-stats-anim'); stats.style.animationDelay = '0.7s'; }
}


/* --------------------------------------------------
   25  LOCAL TIME CLOCK — DHAKA
-------------------------------------------------- */

function initLocalClock() {
    const el = $('#local-time');
    if (!el) return;

    const update = () => {
        const now  = new Date();
        const time = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit',
            second: '2-digit', hour12: true
        }).format(now);
        const day  = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', weekday: 'short' }).format(now);
        const hour = parseInt(new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Dhaka', hour: 'numeric', hour12: false
        }).format(now));
        const clocks = ['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
        el.textContent = `${clocks[hour % 12]} ${day} ${time} — Chittagong, BD`;
    };

    update();
    setInterval(update, 1000);
}


/* --------------------------------------------------
   26  NAME SCRAMBLE EFFECT
-------------------------------------------------- */

function initNameScramble() {
    const el = $('#scramble-name');
    if (!el) return;

    const original = el.textContent.trim();
    const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&!?';

    const scramble = () => {
        let iterations = 0;
        const totalFrames = original.length * 4;
        const iv = setInterval(() => {
            el.textContent = original.split('').map((char, i) => {
                if (i < Math.floor(iterations / 4)) return char;
                if (char === ' ') return ' ';
                return chars[randInt(0, chars.length)];
            }).join('');
            iterations++;
            if (iterations > totalFrames) { clearInterval(iv); el.textContent = original; }
        }, 35);
    };

    setTimeout(scramble, 1300);
    const heading = el.closest('.hero-heading');
    if (heading) heading.addEventListener('mouseenter', scramble);
    else el.addEventListener('mouseenter', scramble);
}


/* --------------------------------------------------
   27  RADAR CHART (Chart.js)
-------------------------------------------------- */

function initRadarChart() {
    const canvas  = document.getElementById('radarChart');
    const statSide = document.getElementById('radarStatSide');
    if (!canvas || !statSide) return;
    if (typeof Chart === 'undefined') { setTimeout(initRadarChart, 200); return; }

    const skills = [
        { label: 'Problem Solving', pct: 90, color: '#378add' },
        { label: 'Web Dev',         pct: 80, color: '#1d9e75' },
        { label: 'Git & Tools',     pct: 80, color: '#7c3aed' },
        { label: 'Data Science',    pct: 70, color: '#7f77dd' },
        { label: 'App Dev',         pct: 65, color: '#d85a30' },
        { label: 'System Design',   pct: 65, color: '#ba7517' },
        { label: 'Game Dev',        pct: 60, color: '#d4537e' },
        { label: 'DevOps',          pct: 30, color: '#6b7694' },
    ];

    let activeIdx = null;
    let chart;

    // build sidebar stat rows
    skills.forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'radar-stat-row';
        row.dataset.i = i;
        row.innerHTML = `
            <span class="radar-stat-dot"  style="background:${s.color}"></span>
            <span class="radar-stat-name">${s.label}</span>
            <div class="radar-stat-bar-wrap">
                <div class="radar-stat-bar" data-pct="${s.pct}" style="background:${s.color}"></div>
            </div>
            <span class="radar-stat-pct">${s.pct}%</span>
        `;
        row.addEventListener('click', () => {
            if (activeIdx === i) {
                activeIdx = null;
                document.querySelectorAll('.radar-stat-row').forEach(r => r.classList.remove('highlighted'));
                resetChart();
            } else {
                activeIdx = i;
                document.querySelectorAll('.radar-stat-row').forEach(r =>
                    r.classList.toggle('highlighted', +r.dataset.i === i));
                focusChart(i);
            }
        });
        statSide.appendChild(row);
    });

    // animate the sidebar bars in after a short delay
    setTimeout(() => {
        document.querySelectorAll('.radar-stat-bar').forEach((b, i) => {
            setTimeout(() => { b.style.width = b.dataset.pct + '%'; }, i * 70);
        });
    }, 400);

    const gridColor  = 'rgba(0, 217, 255, 0.1)';
    const labelColor = '#a8b2d1';
    const tickColor  = 'rgba(168, 178, 209, 0.4)';

    chart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: skills.map(s => s.label),
            datasets: [{
                data: skills.map(s => s.pct),
                fill: true,
                backgroundColor:          'rgba(0, 217, 255, 0.08)',
                borderColor:              '#00d9ff',
                borderWidth:              2,
                pointBackgroundColor:     skills.map(s => s.color),
                pointBorderColor:         '#0a0e27',
                pointBorderWidth:         2,
                pointRadius:              5,
                pointHoverRadius:         9,
                pointHoverBackgroundColor: skills.map(s => s.color),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 1400, easing: 'easeInOutQuart' },
            scales: {
                r: {
                    min: 0, max: 100,
                    ticks: {
                        stepSize: 25, color: tickColor, backdropColor: 'transparent',
                        font: { family: "'JetBrains Mono', monospace", size: 9 },
                        callback: v => v + '%',
                    },
                    grid:        { color: gridColor, circular: false },
                    angleLines:  { color: gridColor },
                    pointLabels: {
                        color: labelColor,
                        font: { family: "'Archivo', sans-serif", size: 11.5, weight: '600' },
                        padding: 8
                    },
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 39, 0.95)',
                    borderColor: 'rgba(0, 217, 255, 0.3)',
                    borderWidth: 1,
                    titleColor: '#00d9ff', bodyColor: '#a8b2d1', padding: 12,
                    callbacks: { label: ctx => '  ' + ctx.raw + '%' },
                }
            },
            onHover: (evt, elements) => {
                if (activeIdx !== null) return;
                const rows = document.querySelectorAll('.radar-stat-row');
                if (elements.length) {
                    rows.forEach(r => r.classList.toggle('highlighted', +r.dataset.i === elements[0].index));
                } else {
                    rows.forEach(r => r.classList.remove('highlighted'));
                }
            }
        }
    });

    function resetChart() {
        chart.data.datasets[0].backgroundColor     = 'rgba(0, 217, 255, 0.08)';
        chart.data.datasets[0].borderColor          = '#00d9ff';
        chart.data.datasets[0].pointRadius          = skills.map(() => 5);
        chart.data.datasets[0].pointBackgroundColor = skills.map(s => s.color);
        chart.update('none');
    }

    function focusChart(idx) {
        chart.data.datasets[0].backgroundColor     = skills[idx].color + '20';
        chart.data.datasets[0].borderColor          = skills[idx].color;
        chart.data.datasets[0].pointRadius          = skills.map((_, i) => i === idx ? 10 : 3);
        chart.data.datasets[0].pointBackgroundColor = skills.map((s, i) =>
            i === idx ? s.color : 'rgba(168, 178, 209, 0.2)');
        chart.update('none');
    }
}


/* --------------------------------------------------
   28  GITHUB CONTRIBUTION HEATMAP
-------------------------------------------------- */

function initGitHubHeatmap() {
    const wrapper = $('#github-heatmap');
    if (!wrapper) return;

    const USERNAME  = 'tahmidalvee6';
    const API       = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
    const CELL      = 13;
    const GAP       = 3;
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const colors    = [
        'rgba(0,217,255,0.06)', 'rgba(0,217,255,0.25)',
        'rgba(0,217,255,0.50)', 'rgba(0,217,255,0.75)', '#00d9ff'
    ];

    wrapper.innerHTML = '<div class="heatmap-loading">Fetching GitHub activity...</div>';

    fetch(API).then(r => r.json()).then(data => {
        const contributions = data.contributions;
        if (!contributions?.length) {
            wrapper.innerHTML = '<div class="heatmap-loading">No contribution data found.</div>';
            return;
        }

        contributions.sort((a, b) => new Date(a.date) - new Date(b.date));

        // split flat list into weeks (arrays of up to 7 days)
        const weeks = [];
        let week = [];
        contributions.forEach((day, i) => {
            week.push(day);
            if (week.length === 7 || i === contributions.length - 1) {
                weeks.push(week);
                week = [];
            }
        });

        wrapper.innerHTML = '';
        const container = document.createElement('div');
        container.style.cssText = 'width:100%;overflow-x:auto;';
        const inner = document.createElement('div');
        inner.style.cssText = 'display:block;width:100%;';

        // month labels row
        const monthRow = document.createElement('div');
        monthRow.style.cssText = `
            position: relative; height: 18px; margin-left: 28px;
            font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #6b7694;
        `;
        let lastMonth = -1;
        weeks.forEach((w, wi) => {
            const m = new Date(w[0].date).getMonth();
            if (m !== lastMonth) {
                lastMonth = m;
                const span = document.createElement('span');
                span.textContent = monthNames[m];
                span.style.cssText = `position:absolute;left:${wi * (CELL + GAP)}px;`;
                monthRow.appendChild(span);
            }
        });
        inner.appendChild(monthRow);

        const gridArea = document.createElement('div');
        gridArea.style.cssText = 'display:flex;gap:0;align-items:flex-start;margin-top:4px;';

        // day-of-week labels on the left
        const dayLabels = document.createElement('div');
        dayLabels.style.cssText = `
            display: flex; flex-direction: column; gap: ${GAP}px; margin-right: 6px;
            font-family: 'JetBrains Mono', monospace; font-size: 9px;
            color: #6b7694; padding-top: 1px;
        `;
        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach((day, i) => {
            const lbl = document.createElement('span');
            lbl.textContent   = i % 2 === 1 ? day : '';
            lbl.style.cssText = `height:${CELL}px;line-height:${CELL}px;text-align:right;`;
            dayLabels.appendChild(lbl);
        });
        gridArea.appendChild(dayLabels);

        // the cell grid — auto-flow column so weeks go left to right
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${weeks.length}, ${CELL}px);
            grid-template-rows: repeat(7, ${CELL}px);
            grid-auto-flow: column;
            gap: ${GAP}px;
        `;

        weeks.forEach(w => {
            const padded = Array(7).fill(null);
            w.forEach(day => { padded[new Date(day.date).getDay()] = day; });
            padded.forEach(day => {
                const cell    = document.createElement('div');
                const level   = day ? day.level : 0;
                const count   = day ? day.count : 0;
                const dateStr = day
                    ? new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '';
                cell.style.cssText = `
                    width: ${CELL}px; height: ${CELL}px; border-radius: 3px;
                    background: ${colors[level]};
                    transition: transform .12s, filter .12s;
                `;
                if (day) cell.title = `${count} contribution${count !== 1 ? 's' : ''} on ${dateStr}`;
                cell.addEventListener('mouseenter', () => { cell.style.transform = 'scale(1.35)'; cell.style.filter = 'brightness(1.5)'; });
                cell.addEventListener('mouseleave', () => { cell.style.transform = ''; cell.style.filter = ''; });
                grid.appendChild(cell);
            });
        });

        gridArea.appendChild(grid);
        inner.appendChild(gridArea);

        // footer: total count + legend
        const total  = contributions.reduce((s, d) => s + d.count, 0);
        const footer = document.createElement('div');
        footer.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-top:10px;flex-wrap:wrap;gap:.5rem;';

        const summary = document.createElement('span');
        summary.style.cssText  = `font-family:'JetBrains Mono',monospace;font-size:11px;color:#6b7694;`;
        summary.textContent    = `${total.toLocaleString()} contributions in the last year`;

        const legend = document.createElement('div');
        legend.style.cssText = `display:flex;align-items:center;gap:4px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#6b7694;`;
        legend.innerHTML = '<span>Less</span>';
        colors.forEach(c => {
            const sq = document.createElement('div');
            sq.style.cssText = `width:${CELL}px;height:${CELL}px;border-radius:3px;background:${c};flex-shrink:0;`;
            legend.appendChild(sq);
        });
        legend.innerHTML += '<span>More</span>';

        footer.appendChild(summary);
        footer.appendChild(legend);
        inner.appendChild(footer);
        container.appendChild(inner);
        wrapper.appendChild(container);

    }).catch(() => {
        wrapper.innerHTML = `
            <div style="text-align:center;padding:1rem;">
                <p style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;color:#6b7694;margin-bottom:0.75rem;">
                    Could not load GitHub activity. View it directly:
                </p>
                <a href="https://github.com/tahmidalvee6" target="_blank"
                    style="color:#00d9ff;font-family:'JetBrains Mono',monospace;font-size:0.85rem;
                    text-decoration:none;border:1px solid rgba(0,217,255,0.3);
                    padding:0.5rem 1.25rem;border-radius:8px;">
                    github.com/tahmidalvee6
                </a>
            </div>
        `;
    });
}


/* --------------------------------------------------
   29  TESTIMONIAL CAROUSEL
   goToTestimonial() is also called from HTML buttons.
-------------------------------------------------- */

let currentTestimonial = 0;

function goToTestimonial(index) {
    const cards = $$('.testimonial-card');
    const dots  = $$('.t-dot');
    if (!cards.length) return;
    cards[currentTestimonial].classList.remove('active');
    dots[currentTestimonial]?.classList.remove('active');
    currentTestimonial = ((index % cards.length) + cards.length) % cards.length;
    cards[currentTestimonial].classList.add('active');
    dots[currentTestimonial]?.classList.add('active');
}

function initTestimonials() {
    const cards = $$('.testimonial-card');
    const dots  = $$('.t-dot');
    if (!cards.length) return;

    cards.forEach((c, i) => c.classList.toggle('active', i === 0));
    dots.forEach((d, i)  => d.classList.toggle('active', i === 0));

    let autoplay = setInterval(() => goToTestimonial(currentTestimonial + 1), 6000);

    const resetAutoplay = () => {
        clearInterval(autoplay);
        autoplay = setInterval(() => goToTestimonial(currentTestimonial + 1), 6000);
    };

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToTestimonial(i); resetAutoplay(); });
    });

    // swipe support on touch devices
    const wrapper = $('.testimonials-wrapper');
    if (wrapper) {
        let startX = 0;
        wrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        wrapper.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { goToTestimonial(currentTestimonial + (diff > 0 ? 1 : -1)); resetAutoplay(); }
        }, { passive: true });
    }
}


/* --------------------------------------------------
   30  FLOATING AMBIENT ORBS
-------------------------------------------------- */

function initFloatingOrbs() {
    if (isMobile() || prefersReducedMotion()) return;

    const orbStyle = document.createElement('style');
    orbStyle.textContent = `
        .ambient-orb {
            position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
            filter: blur(80px); opacity: 0.04; animation: orbDrift linear infinite;
        }
        @keyframes orbDrift {
            0%   { transform: translate(0,0)       scale(1);    }
            25%  { transform: translate(80px,-60px) scale(1.1); }
            50%  { transform: translate(-40px,80px) scale(0.9); }
            75%  { transform: translate(60px,40px)  scale(1.05); }
            100% { transform: translate(0,0)        scale(1);   }
        }
    `;
    document.head.appendChild(orbStyle);

    const orbs = [
        { color: '#00d9ff', size: 500, top: '10%',  left:  '5%', duration: '28s' },
        { color: '#7c3aed', size: 400, top: '50%',  right: '8%', duration: '34s' },
        { color: '#ec4899', size: 350, bottom: '15%', left: '20%', duration: '22s' },
    ];

    orbs.forEach(o => {
        const el = document.createElement('div');
        el.className = 'ambient-orb';
        el.style.cssText = `
            width: ${o.size}px; height: ${o.size}px; background: ${o.color};
            ${o.top    ? `top: ${o.top};`       : ''}
            ${o.bottom ? `bottom: ${o.bottom};` : ''}
            ${o.left   ? `left: ${o.left};`     : ''}
            ${o.right  ? `right: ${o.right};`   : ''}
            animation-duration: ${o.duration};
        `;
        document.body.appendChild(el);
    });
}


/* --------------------------------------------------
   31  HERO STATS — PULSE RINGS
-------------------------------------------------- */

function initStatsPulse() {
    if (prefersReducedMotion()) return;

    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        .stat-icon { position: relative; display: inline-block; }
        .stat-icon::after {
            content: ''; position: absolute; inset: -6px; border-radius: 50%;
            border: 1px solid rgba(0,217,255,0.3);
            animation: statPulse 2.5s ease-out infinite;
        }
        @keyframes statPulse {
            0%   { transform: scale(1);   opacity: 0.6; }
            100% { transform: scale(2.2); opacity: 0;   }
        }
    `;
    document.head.appendChild(pulseStyle);

    $$('.stat-icon').forEach((el, i) => {
        el.style.animationDelay = (i * 0.6) + 's';
    });
}


/* --------------------------------------------------
   32  SECTION TITLE — SPLIT-CHAR REVEAL
-------------------------------------------------- */

function initSplitTextReveal() {
    if (prefersReducedMotion()) return;

    const splitStyle = document.createElement('style');
    splitStyle.textContent = `
        .split-char {
            display: inline-block; opacity: 0;
            transform: translateY(20px) rotate(5deg);
            transition: opacity .4s ease, transform .4s cubic-bezier(.22,1,.36,1);
        }
        .split-char.in { opacity: 1; transform: none; }
    `;
    document.head.appendChild(splitStyle);

    $$('.section-title').forEach(el => {
        const text = el.textContent;
        el.innerHTML = text.split('').map((c, i) =>
            `<span class="split-char" style="transition-delay:${i * 0.03}s">${c === ' ' ? '&nbsp;' : c}</span>`
        ).join('');

        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    $$('.split-char', el).forEach(s => s.classList.add('in'));
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        obs.observe(el);
    });
}


/* --------------------------------------------------
   33  NAV LINK HOVER WARP
-------------------------------------------------- */

function initNavWarp() {
    if (isMobile()) return;

    $$('.nav-link').forEach(link => {
        const chars = link.textContent.split('');
        link.innerHTML = chars.map(c =>
            `<span style="display:inline-block;transition:transform .15s cubic-bezier(.22,1,.36,1)">${c}</span>`
        ).join('');

        link.addEventListener('mouseenter', () => {
            $$('span', link).forEach((s, i) => {
                setTimeout(() => { s.style.transform = 'translateY(-3px)'; }, i * 20);
                setTimeout(() => { s.style.transform = ''; },               i * 20 + 150);
            });
        });
    });
}


/* --------------------------------------------------
   34  SCROLL-TRIGGERED BACKGROUND SHIFT
-------------------------------------------------- */

function initScrollBgShift() {
    if (prefersReducedMotion()) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                document.body.style.transition = 'background .8s ease';
            }
        });
    }, { threshold: 0.3 });

    $$('section').forEach(s => obs.observe(s));
}


/* --------------------------------------------------
   35  PROJECT CARD — SCAN-LINE EFFECT
-------------------------------------------------- */

function initProjectScanline() {
    if (prefersReducedMotion()) return;

    const scanStyle = document.createElement('style');
    scanStyle.textContent = `
        .project-image { overflow: hidden; }
        .project-scan {
            position: absolute; top: -100%; left: 0; width: 100%; height: 30%;
            background: linear-gradient(180deg, transparent, rgba(0,217,255,0.06), transparent);
            pointer-events: none; z-index: 3; transition: none;
        }
        .project-card:hover .project-scan {
            animation: scanDown .9s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes scanDown { from { top: -30% } to { top: 120% } }
    `;
    document.head.appendChild(scanStyle);

    $$('.project-image').forEach(img => {
        const scan = document.createElement('div');
        scan.className = 'project-scan';
        img.style.position = 'relative';
        img.appendChild(scan);
    });
}


/* --------------------------------------------------
   36  HERO IMAGE RING — ORBITING DOTS
-------------------------------------------------- */

function initHeroOrbit() {
    if (prefersReducedMotion() || isMobile()) return;

    const ring = $('.hero-image__ring');
    if (!ring) return;

    const orbitStyle = document.createElement('style');
    orbitStyle.textContent = `
        .orbit-dot { position: absolute; border-radius: 50%; pointer-events: none; }
        @keyframes orbitA { from { transform: rotate(0deg)   translateX(195px) rotate(0deg)    } to { transform: rotate(360deg)  translateX(195px) rotate(-360deg)  } }
        @keyframes orbitB { from { transform: rotate(120deg) translateX(195px) rotate(-120deg) } to { transform: rotate(480deg)  translateX(195px) rotate(-480deg)  } }
        @keyframes orbitC { from { transform: rotate(240deg) translateX(195px) rotate(-240deg) } to { transform: rotate(600deg)  translateX(195px) rotate(-600deg)  } }
    `;
    document.head.appendChild(orbitStyle);

    const orbits = [
        { color: '#00d9ff', anim: 'orbitA', size: 8, duration: '6s' },
        { color: '#ec4899', anim: 'orbitB', size: 6, duration: '6s' },
        { color: '#10b981', anim: 'orbitC', size: 5, duration: '6s' },
    ];

    ring.style.position = 'relative';
    orbits.forEach(o => {
        const dot = document.createElement('div');
        dot.className = 'orbit-dot';
        dot.style.cssText = `
            width: ${o.size}px; height: ${o.size}px;
            background: ${o.color};
            box-shadow: 0 0 ${o.size * 2}px ${o.color};
            top: 50%; left: 50%;
            margin: -${o.size / 2}px 0 0 -${o.size / 2}px;
            animation: ${o.anim} ${o.duration} linear infinite;
        `;
        ring.appendChild(dot);
    });
}


/* --------------------------------------------------
   37  LEARNING CARDS — STAGGER ENTRANCE
-------------------------------------------------- */

function initLearningCardEntrance() {
    if (prefersReducedMotion()) return;

    const cards = $$('.about-learning__card');
    cards.forEach((card, i) => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(24px) scale(0.96)';
        card.style.transition = `opacity .5s ease ${i * 0.08}s, transform .5s cubic-bezier(.22,1,.36,1) ${i * 0.08}s`;
    });

    const grid = $('.about-learning__grid');
    if (!grid) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                cards.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });

    obs.observe(grid);
}


/* --------------------------------------------------
   INIT ALL
   Called after the page loader finishes.
-------------------------------------------------- */

function initAll() {
    initCursor();
    initParticles();
    initScrollProgress();
    initNavbar();
    initTypewriter();
    initLocalClock();
    initNameScramble();
    initScrollReveal();
    initSkillBars();
    initLearningBars();
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
    initRadarChart();
    initGitHubHeatmap();
    initTestimonials();
    initFloatingOrbs();
    initStatsPulse();
    initSplitTextReveal();
    initNavWarp();
    initScrollBgShift();
    initProjectScanline();
    initHeroOrbit();
    initLearningCardEntrance();
}


/* --------------------------------------------------
   BOOT — kick off the loader, everything else
   starts from initAll() once loading is done
-------------------------------------------------- */

initLoader();

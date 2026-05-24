/* =================================================================
   NOVA / 7  —  interaction layer
   custom cursor · magnetic buttons · tilt · reveal · counters
   ================================================================= */

(() => {

  const isCoarse = matchMedia('(pointer:coarse)').matches;
  const reduced  = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────── boot screen ──────────── */
  const boot   = document.getElementById('bootScreen');
  const status = document.getElementById('bootStatus');
  const phases = [
    'initializing holographic field',
    'compositing volumetric layer',
    'aligning observer · vector',
    'spinning up cinematic kernel',
    'ready · transmitting',
  ];
  let pi = 0;
  const pid = setInterval(() => {
    pi = (pi + 1) % phases.length;
    if (status) status.textContent = phases[pi];
  }, 520);

  function finishBoot() {
    clearInterval(pid);
    boot?.classList.add('is-done');
    document.body.classList.remove('boot');
    document.body.classList.add('is-ready');
    setTimeout(() => boot?.remove(), 1100);
  }
  // give the WebGL scene a moment to warm up
  window.addEventListener('load', () => setTimeout(finishBoot, reduced ? 600 : 2400));

  /* ──────────── custom cursor ──────────── */
  if (!isCoarse) {
    const cur = document.getElementById('cursor');
    let x = innerWidth / 2, y = innerHeight / 2;
    let cx = x, cy = y;

    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, { passive: true });

    (function loop(){
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    })();

    const hotSel = 'a, button, [data-magnet], input, .sys-card, .pillar, .holo-card, .stat, .transmit-aside';
    document.addEventListener('pointerover', e => {
      if (e.target.closest(hotSel)) cur.classList.add('is-hot');
    });
    document.addEventListener('pointerout', e => {
      if (e.target.closest(hotSel)) cur.classList.remove('is-hot');
    });
  }

  /* ──────────── magnetic buttons ──────────── */
  if (!isCoarse && !reduced) {
    document.querySelectorAll('[data-magnet]').forEach(el => {
      const strength = el.matches('.btn-primary, .btn-ghost') ? 0.32 : 0.18;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${mx * strength}px, ${my * strength}px, 0)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ──────────── 3D tilt for glass cards ──────────── */
  if (!isCoarse && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      const inner = el.querySelector(':scope > .holo-card-inner, :scope > .stage-frame') || el;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width  - 0.5;
        const my = (e.clientY - r.top)  / r.height - 0.5;
        const ry =  mx * 8;
        const rx = -my * 8;
        inner.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });
      el.addEventListener('pointerleave', () => {
        inner.style.transform = '';
      });
    });
  }

  /* ──────────── floating chips parallax on scroll ──────────── */
  const floats = document.querySelectorAll('[data-float]');
  let lastScroll = 0;
  function onScroll() {
    lastScroll = window.scrollY;
    floats.forEach((el, i) => {
      const s = (i % 2 === 0) ? 0.08 : -0.06;
      el.style.translate = `0 ${lastScroll * s}px`;
    });

    // rail fill
    const rail = document.getElementById('railFill');
    if (rail) {
      const p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      rail.style.height = `${Math.min(100, p * 100)}%`;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ──────────── reveal-on-scroll ──────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        if (e.target.dataset.count) animateCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('section, .pillar, .sys-card, .stat, .quote, .transmit-stage, [data-tilt]').forEach(el => io.observe(el));

  /* ──────────── counter animation ──────────── */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const num    = el.querySelector('.stat-num');
    if (!num) return;
    const dur = 1600;
    const t0 = performance.now();
    function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3); // easeOutCubic
      const v = Math.round(target * e);
      num.textContent = v.toLocaleString() + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ──────────── live telemetry ──────────── */
  const telFps  = document.getElementById('telFps');
  const telFlux = document.getElementById('telFlux');
  const telObs  = document.getElementById('telObs');
  const hcTime  = document.getElementById('hcTime');
  const hcBar   = document.getElementById('hcBar');
  const hcEnt   = document.getElementById('hcEntropy');
  const taLat   = document.getElementById('taLat');
  const engCoord = document.getElementById('engineCoord');
  const navCoord = document.getElementById('navCoord');
  const footCoord = document.getElementById('footCoord');

  let obsRevealed = false;
  function watchObserver() {
    if (obsRevealed) return;
    obsRevealed = true;
    if (telObs) telObs.textContent = 'aligned';
  }
  addEventListener('pointermove', watchObserver, { once: true });
  addEventListener('scroll', watchObserver, { once: true });

  function tickTel() {
    const n = window.__nova || { fps: 0, flux: 0 };
    if (telFps)  telFps.textContent  = n.fps ? `${n.fps}` : '—';
    if (telFlux) telFlux.textContent = (n.flux || 0).toFixed(3);

    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const ss = String(now.getUTCSeconds()).padStart(2, '0');
    if (hcTime) hcTime.textContent = `${hh}:${mm}:${ss} UTC`;

    if (hcEnt) hcEnt.textContent = (0.3 + Math.abs(Math.sin(now.getTime() / 4000)) * 0.5).toFixed(3);

    if (engCoord && n.pointer) {
      const dx = (n.pointer.x * 1.2).toFixed(3);
      const dy = (n.pointer.y * 0.8).toFixed(3);
      engCoord.textContent = `δ ${dx} / θ ${dy}`;
    }

    if (taLat) taLat.textContent = `${(10 + Math.round(Math.abs(Math.sin(now.getTime() / 1500)) * 12))} ms`;

    if (navCoord && Math.random() < 0.03) {
      const lat = (41.5 + Math.random() * 1).toFixed(3);
      const lon = (7.0 + Math.random() * 0.6).toFixed(3);
      navCoord.textContent = `${lat}°N · ${lon}°W`;
      if (footCoord) footCoord.textContent = `${lat}°N · ${lon}°W · alt ${(150 + Math.random()*60)|0}m`;
    }

    requestAnimationFrame(tickTel);
  }
  requestAnimationFrame(tickTel);

})();

/* Sitefold — shared behaviour */
(() => {
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---- splitting text for reveals ------------------------------------ */
  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok.trim()) return frag.appendChild(document.createTextNode(tok));
            const w = document.createElement('span');
            w.className = 'wd';
            const inner = document.createElement('span');
            inner.textContent = tok;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('wd')) walk(n);
      });
    };
    walk(el);
    $$('.wd > span', el).forEach((s, i) => s.style.setProperty('--d', i * 34 + 'ms'));
  }

  function splitLines(el) {
    if (rm.matches) return;
    const raw = el.dataset.lines || el.innerHTML;
    el.dataset.lines = raw;
    el.innerHTML = raw
      .split(/<br\s*\/?>/i)
      .map((l, i) => `<span class="ln"><span style="--d:${i * 90}ms">${l.trim()}</span></span>`)
      .join('');
    el.classList.add('rv-lines');
  }

  $$('[data-lines-split]').forEach(splitLines);
  $$('.rv-words').forEach(splitWords);

  /* ---- reveal on scroll ---------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('seen');
      io.unobserve(e.target);
      if (e.target.dataset.count !== undefined) runCount(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  const watch = (el) => io.observe(el);
  $$('[data-rv], .rv-lines, .rv-words, .wordmark, [data-count]').forEach(watch);
  window.sfWatch = watch;

  // stagger groups
  $$('[data-stagger]').forEach((g) => {
    const step = +g.dataset.stagger || 80;
    [...g.children].forEach((c, i) => c.style.setProperty('--rv-d', i * step + 'ms'));
  });

  /* ---- counters ------------------------------------------------------- */
  function runCount(el) {
    const to = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split('.')[1] || '').length;
    const pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (rm.matches) { el.textContent = pre + to.toFixed(dec) + suf; return; }
    const dur = +el.dataset.dur || 1500;
    const t0 = performance.now();
    const tick = (t) => {
      const p = clamp((t - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + (to * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---- header --------------------------------------------------------- */
  const nav = $('.nav');
  const prog = $('.prog');
  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('solid', y > 40);
      const menuOpen = nav.classList.contains('menu-open');
      nav.classList.toggle('hide', !menuOpen && y > 420 && y > lastY && y - lastY > 4);
    }
    if (prog) {
      const h = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---------------------------------------------------- */
  const burger = $('.burger'), menu = $('.menu');
  if (burger && menu) {
    let open = false;
    const setMenu = (v) => {
      open = v;
      burger.setAttribute('aria-expanded', String(v));
      menu.classList.toggle('open', v);
      nav.classList.toggle('menu-open', v);
      document.body.classList.toggle('is-locked', v);
      menu.setAttribute('aria-hidden', String(!v));
      $$('.menu-list a', menu).forEach((a, i) => (a.style.transitionDelay = v ? 90 + i * 55 + 'ms' : '0ms'));
      if (v) setTimeout(() => $('.menu-list a', menu)?.focus(), 320);
    };
    burger.addEventListener('click', () => setMenu(!open));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) { setMenu(false); burger.focus(); }
      if (e.key === 'Tab' && open) {
        const f = $$('a,button', menu).filter((n) => n.offsetParent);
        const first = burger, last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- page transitions ------------------------------------------------ */
  const curtain = $('.curtain');
  if (curtain && !rm.matches) {
    curtain.classList.add('out');
    curtain.addEventListener('animationend', () => curtain.classList.remove('out', 'in'), { once: false });

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (url.pathname === location.pathname && url.hash) return;
      if (url.href === location.href) { e.preventDefault(); return; }
      e.preventDefault();
      curtain.classList.remove('out');
      curtain.classList.add('in');
      setTimeout(() => (location.href = url.href), 560);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) { curtain.classList.remove('in'); curtain.classList.add('out'); } });
  }

  /* ---- cursor ---------------------------------------------------------- */
  if (fine.matches && !rm.matches) {
    const cur = document.createElement('div');
    cur.className = 'cursor';
    cur.innerHTML = '<span class="cur-lb"></span>';
    document.body.appendChild(cur);
    const lb = cur.firstElementChild;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;

    addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); }, { passive: true });
    addEventListener('mouseleave', () => cur.classList.remove('on'));

    (function loop() {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      cur.style.transform = `translate3d(${x}px,${y}px,0)`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) { cur.classList.add('big'); lb.textContent = t.dataset.cursor; }
      else { cur.classList.remove('big'); lb.textContent = ''; }
    });

    /* magnetic */
    $$('[data-magnet]').forEach((el) => {
      const s = +el.dataset.magnet || 0.32;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * s}px,${(e.clientY - r.top - r.height / 2) * s}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.19,1,.22,1)';
        el.style.transform = '';
        setTimeout(() => (el.style.transition = ''), 620);
      });
    });
  }

  /* ---- accordions ------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.acc-btn');
    if (!btn) return;
    const item = btn.closest('.acc-item');
    const group = btn.closest('[data-acc-single]');
    const panel = item.querySelector('.acc-panel');
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';
    if (group && willOpen) {
      $$('.acc-btn[aria-expanded="true"]', group).forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
        b.closest('.acc-item').querySelector('.acc-panel').dataset.open = 'false';
      });
    }
    btn.setAttribute('aria-expanded', String(willOpen));
    panel.dataset.open = String(willOpen);
  });

  /* ---- segmented controls ---------------------------------------------- */
  function movePill(seg) {
    const pill = seg.querySelector('.seg-pill');
    const on = seg.querySelector('[aria-selected="true"]');
    if (!pill || !on) return;
    pill.style.left = on.offsetLeft + 'px';
    pill.style.width = on.offsetWidth + 'px';
  }
  $$('.seg').forEach((seg) => {
    requestAnimationFrame(() => movePill(seg));
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('button', seg).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      movePill(seg);
      seg.dispatchEvent(new CustomEvent('seg', { detail: b.dataset.val ?? b.textContent.trim(), bubbles: true }));
    });
    seg.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const b = $$('button', seg), i = b.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      b[(i + (e.key === 'ArrowRight' ? 1 : b.length - 1)) % b.length].focus();
      b[(i + (e.key === 'ArrowRight' ? 1 : b.length - 1)) % b.length].click();
    });
  });
  addEventListener('resize', () => $$('.seg').forEach(movePill));

  /* ---- before / after sliders ------------------------------------------ */
  function initBA(root) {
    const knob = root.querySelector('.ba-knob');
    let drag = false;
    const set = (pct) => {
      pct = clamp(pct, 2, 98);
      root.style.setProperty('--x', pct + '%');
      knob?.setAttribute('aria-valuenow', Math.round(pct));
    };
    const fromEvent = (e) => {
      const r = root.getBoundingClientRect();
      set((((e.touches ? e.touches[0].clientX : e.clientX) - r.left) / r.width) * 100);
    };
    root.addEventListener('pointerdown', (e) => { drag = true; root.setPointerCapture(e.pointerId); fromEvent(e); });
    root.addEventListener('pointermove', (e) => { if (drag) fromEvent(e); });
    addEventListener('pointerup', () => (drag = false));
    root.addEventListener('pointerleave', () => (drag = false));
    knob?.addEventListener('keydown', (e) => {
      const cur = parseFloat(getComputedStyle(root).getPropertyValue('--x')) || 50;
      if (e.key === 'ArrowLeft') { e.preventDefault(); set(cur - 4); }
      if (e.key === 'ArrowRight') { e.preventDefault(); set(cur + 4); }
      if (e.key === 'Home') { e.preventDefault(); set(2); }
      if (e.key === 'End') { e.preventDefault(); set(98); }
    });
    set(parseFloat(root.dataset.start || 50));
  }
  $$('.ba').forEach(initBA);
  window.sfInitBA = initBA;

  /* ---- marquee: duplicate content so it loops seamlessly ---------------- */
  $$('.marq').forEach((m) => {
    const run = m.querySelector('.marq-run');
    if (!run) return;
    m.appendChild(run.cloneNode(true));
    m.querySelectorAll('.marq-run').forEach((r) => r.setAttribute('aria-hidden', 'true'));
    run.removeAttribute('aria-hidden');
  });

  /* ---- parallax -------------------------------------------------------- */
  const par = $$('[data-par]');
  if (par.length && !rm.matches) {
    let ticking = false;
    const upd = () => {
      const vh = innerHeight;
      par.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty('--py', (p * (+el.dataset.par || 40) * -1).toFixed(2) + 'px');
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---- drag-scroll rails ------------------------------------------------ */
  $$('[data-drag]').forEach((rail) => {
    let down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', (e) => {
      if (e.target.closest('input,button,a[data-nodrag]')) return;
      down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft;
      rail.classList.add('dragging');
    });
    rail.addEventListener('pointermove', (e) => {
      if (!down) return;
      const d = e.clientX - sx;
      moved = Math.max(moved, Math.abs(d));
      if (moved > 5) { rail.scrollLeft = sl - d; e.preventDefault(); }
    });
    const end = () => { down = false; rail.classList.remove('dragging'); };
    rail.addEventListener('pointerup', end);
    rail.addEventListener('pointercancel', end);
    rail.addEventListener('pointerleave', end);
    rail.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  /* ---- footer year ------------------------------------------------------ */
  $$('[data-year]').forEach((n) => (n.textContent = new Date().getFullYear()));
})();

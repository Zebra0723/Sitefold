/* Sitefold — homepage behaviour */
(() => {
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- hero: cursor drift + scroll drift --------------------------- */
  const stage = $('.hero-stage');
  if (stage && !rm.matches) {
    const items = $$('.hs-item', stage);
    const hero = $('.hero');
    let mx = 0, my = 0, tx = 0, ty = 0, sy = 0;

    if (fine.matches) {
      addEventListener('mousemove', (e) => {
        tx = (e.clientX / innerWidth - .5) * 2;
        ty = (e.clientY / innerHeight - .5) * 2;
      }, { passive: true });
    }
    addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });

    (function loop() {
      mx += (tx - mx) * .06;
      my += (ty - my) * .06;
      const p = Math.min(sy / (hero.offsetHeight || 1), 1);
      items.forEach((el) => {
        const d = +el.dataset.depth || 4;
        el.style.setProperty('--mx', (mx * d * -2.6).toFixed(2) + 'px');
        el.style.setProperty('--my', (my * d * -2.2).toFixed(2) + 'px');
        el.style.setProperty('--sy', (p * d * 13).toFixed(2) + 'px');
        el.style.setProperty('--sc', (1 - p * .05).toFixed(3));
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---- the example: screen size and page ---------------------------- */
  const exSeg = $('#ex-seg');
  if (exSeg) {
    const stageEl = $('.ex-stage');
    const live = $('#ex-live');
    const widths = { d: [1440, 900, '1440 × 900', 'Inline links'], t: [834, 1112, '834 × 1112', 'Inline links, condensed'], m: [390, 844, '390 × 844', 'Menu button'] };
    let device = 'd';

    const apply = () => {
      const [w, h, label, navLabel] = widths[device];
      stageEl.dataset.dev = device;
      live.dataset.w = w;
      live.dataset.h = h;
      $('#ex-w').textContent = label;
      $('#ex-n').textContent = navLabel;
      /* wait for the frame to finish resizing before rescaling the page inside it */
      setTimeout(() => window.sfLive?.build(live), 60);
      setTimeout(() => window.sfLive?.build(live), 900);
    };

    exSeg.addEventListener('seg', (e) => { device = e.detail; apply(); });

    $('.ex-pages')?.addEventListener('click', (e) => {
      const b = e.target.closest('.ex-pb');
      if (!b) return;
      $$('.ex-pb').forEach((x) => x.classList.toggle('on', x === b));
      live.dataset.src = b.dataset.page;
      live.querySelector('iframe')?.remove();
      $('#ex-p').textContent = b.dataset.name;
      $('#ex-url').textContent = 'sitefoldwebsites.vercel.app' + b.dataset.page.replace(/\/$/, '');
      window.sfLive?.build(live);
    });
  }

  /* ---- process ------------------------------------------------------- */
  const steps = $$('.prc-step');
  if (steps.length) {
    const big = $('#prc-big'), title = $('#prc-title'), fill = $('#prc-fill');
    const names = ['Discover', 'Concept', 'Design', 'Build', 'Launch'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        en.target.classList.toggle('on', en.isIntersecting);
        if (en.isIntersecting) {
          const n = +en.target.dataset.n;
          big.textContent = String(n).padStart(2, '0');
          title.textContent = names[n - 1];
          fill.style.width = (n / steps.length) * 100 + '%';
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => io.observe(s));
  }
})();

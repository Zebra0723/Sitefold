/* Sitefold — the about page demonstrations */
(() => {
  const $ = (s) => document.querySelector(s);

  /* 01 clarity */
  const clarity = $('.ab-clarity');
  clarity?.querySelector('.ab-toggle')?.addEventListener('click', (e) => {
    const on = clarity.classList.toggle('vague');
    e.target.setAttribute('aria-pressed', String(on));
    e.target.textContent = on ? 'Show the clear version' : 'Show the vague version';
  });

  /* 02 the client's choices */
  const charOut = $('#ab-charout');
  if (charOut) {
    const pals = [
      ['#14120f', '#c1440e', '#f2efe8'],
      ['#101828', '#3b5bdb', '#f7f8fa'],
      ['#1b1b19', '#2f6f4f', '#f0efe9'],
    ];
    const set = (i) => {
      charOut.dataset.dir = i;
      charOut.style.color = pals[i][0];
      [...charOut.querySelectorAll('.ab-charpal i')].forEach((el, n) => (el.style.background = pals[i][n]));
    };
    $('.ab-charctl').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      document.querySelectorAll('.ab-charctl button').forEach((x) => x.classList.toggle('on', x === b));
      set(+b.dataset.dir);
    });
    set(0);
  }

  /* 03 speed — real numbers from this page load */
  const t = $('#ab-t');
  if (t) {
    const show = () => {
      const nav = performance.getEntriesByType('navigation')[0];
      const ms = nav ? nav.domContentLoadedEventEnd : performance.now();
      t.textContent = (ms / 1000).toFixed(2) + 's';
      const bytes = performance.getEntriesByType('resource')
        .reduce((a, r) => a + (r.transferSize || 0), 0) + (nav?.transferSize || 0);
      $('#ab-k').textContent = bytes ? Math.round(bytes / 1024) + ' KB' : 'Under 200 KB';
    };
    addEventListener('load', () => setTimeout(show, 400));
  }

  /* 05 responsiveness — drag the real page narrower */
  const grip = $('.ab-resp .dm-grip');
  if (grip) {
    const vp = $('.ab-vp'), live = $('#ab-live'), out = $('.ab-vpw b');
    const set = (px) => {
      const max = vp.parentElement.clientWidth;
      const w = Math.max(220, Math.min(max, px));
      vp.style.width = w + 'px';
      const virt = Math.round(w / max * 1440);
      out.textContent = virt;
      live.dataset.w = virt;
      window.sfLive?.build(live);
    };
    let drag = false;
    grip.addEventListener('pointerdown', (e) => { drag = true; grip.setPointerCapture(e.pointerId); e.preventDefault(); });
    grip.addEventListener('pointermove', (e) => { if (drag) set(e.clientX - vp.getBoundingClientRect().left); });
    addEventListener('pointerup', () => (drag = false));
    grip.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); set(vp.offsetWidth - 50); }
      if (e.key === 'ArrowRight') { e.preventDefault(); set(vp.offsetWidth + 50); }
    });
    addEventListener('load', () => set(vp.parentElement.clientWidth));
  }

  /* 06 detail */
  const detail = $('.ab-detail');
  detail?.querySelector('.ab-toggle')?.addEventListener('click', (e) => {
    const off = detail.classList.toggle('off');
    e.target.setAttribute('aria-pressed', String(off));
    e.target.textContent = off ? 'Turn the detail back on' : 'Turn the detail off';
  });
})();

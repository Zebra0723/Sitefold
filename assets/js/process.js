/* Sitefold — process page */
(() => {
  const list = document.getElementById('pj-list');
  if (!list) return;
  const steps = [...list.querySelectorAll('.pj-step')];
  const fill = document.getElementById('pj-fill');
  const count = document.getElementById('pj-count');
  const words = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven'];

  document.getElementById('pj-seg')?.addEventListener('seg', (e) => {
    const v = e.detail;
    let n = 0;
    steps.forEach((s) => {
      const keep = v === 'all' || s.dataset.who === v || s.dataset.who === 'both';
      s.hidden = !keep;
      if (keep) n++;
    });
    count.textContent = `${words[n]} step${n === 1 ? '' : 's'}`;
  });

  /* the rail fills as you read down the list */
  const upd = () => {
    const r = list.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / r.height));
    fill.style.height = (p * 100) + '%';
  };
  addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
  addEventListener('resize', upd);
  upd();
})();

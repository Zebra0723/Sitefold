/* Sitefold — the 404 peel */
(() => {
  const paper = document.getElementById('nf-paper');
  if (!paper) return;
  const front = paper.querySelector('.nf-front');
  const corner = document.getElementById('nf-corner');
  const max = () => Math.min(paper.clientWidth, paper.clientHeight) * 1.9;
  let peel = 0, drag = false;

  const set = (v) => {
    peel = Math.max(0, Math.min(max(), v));
    front.style.setProperty('--peel', peel + 'px');
    corner.style.transform = `translate(${-peel * 0.42}px,${peel * 0.42}px)`;
  };

  corner.addEventListener('pointerdown', (e) => {
    drag = true; corner.setPointerCapture(e.pointerId); e.preventDefault();
  });
  corner.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const r = paper.getBoundingClientRect();
    set(((r.right - e.clientX) + (e.clientY - r.top)) * 0.75);
  });
  const rest = () => {
    drag = false;
    const target = peel > max() * 0.42 ? max() : 0;
    const from = peel, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 520, 1);
      set(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  addEventListener('pointerup', () => { if (drag) rest(); });
  corner.addEventListener('pointercancel', rest);
  corner.addEventListener('click', () => { if (peel < 4) { peel = max(); set(peel); } });
  corner.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(peel > 4 ? 0 : max()); }
  });
  addEventListener('resize', () => set(peel));
})();

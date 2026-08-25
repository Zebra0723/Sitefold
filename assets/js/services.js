/* Sitefold — services page */
(() => {
  const $ = (s) => document.querySelector(s);

  /* section nav */
  const nav = document.querySelector('.sv-navin');
  if (nav) {
    const links = [...nav.querySelectorAll('a')];
    const line = nav.querySelector('.sv-navline');
    const move = (a) => { line.style.left = a.offsetLeft + 'px'; line.style.width = a.offsetWidth + 'px'; };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const a = links.find((l) => l.dataset.sv === e.target.id);
        if (!a) return;
        links.forEach((l) => l.classList.toggle('on', l === a));
        move(a);
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.sv-sec').forEach((s) => io.observe(s));
    requestAnimationFrame(() => move(links[0]));
    addEventListener('resize', () => move(nav.querySelector('a.on') || links[0]));
  }

  /* drag the viewport width, and watch a real page reflow inside it */
  const grip = $('#sv-grip');
  if (grip) {
    const vp = $('.sv-vp'), live = $('#sv-live');
    const out = $('#sv-w'), mode = $('#sv-mode');
    const set = (px) => {
      const max = vp.parentElement.clientWidth;
      const w = Math.max(300, Math.min(max, px));
      vp.style.width = w + 'px';
      const virt = Math.round(w / max * 1440);
      out.textContent = virt;
      mode.textContent = virt < 760 ? 'phone layout' : virt < 1080 ? 'tablet layout' : 'desktop layout';
      live.dataset.w = virt;
      live.dataset.h = virt < 760 ? 840 : 900;
      window.sfLive?.build(live);
    };
    let drag = false;
    grip.addEventListener('pointerdown', (e) => { drag = true; grip.setPointerCapture(e.pointerId); e.preventDefault(); });
    grip.addEventListener('pointermove', (e) => { if (drag) set(e.clientX - vp.getBoundingClientRect().left); });
    addEventListener('pointerup', () => (drag = false));
    grip.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); set(vp.offsetWidth - 60); }
      if (e.key === 'ArrowRight') { e.preventDefault(); set(vp.offsetWidth + 60); }
    });
    addEventListener('load', () => set(vp.parentElement.clientWidth));
  }

  /* free address or your own domain */
  const adSeg = $('#ad-seg');
  if (adSeg) {
    const data = {
      free: ['roseblossom.vercel.app', 'Live, secure and free. The address simply says vercel.app at the end.', 'Nothing', 'Not included', 'roseblossom.vercel.app'],
      own: ['roseblossomphotography.com', 'Your own name, and email addresses to match it.', 'Varies by name', 'Up to three included', 'enquiries@roseblossomphotography.com'],
    };
    adSeg.addEventListener('seg', (e) => {
      const [url, note, cost, mail, eg] = data[e.detail];
      $('#ad-url').textContent = url;
      $('#ad-note').textContent = note;
      $('#ad-cost').textContent = cost;
      $('#ad-mail').textContent = mail;
      $('#ad-eg').textContent = eg;
    });
  }
})();

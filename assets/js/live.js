/* Sitefold — frames that hold a real page from this website.
   Each .live element renders one of our own pages at a chosen virtual width
   and scales it to fit, so what you see in the frame is the actual site. */
(() => {
  const frames = [...document.querySelectorAll('.live')];
  if (!frames.length) return;

  const build = (box) => {
    const src = box.dataset.src || '/';
    const w = +box.dataset.w || 1440;
    const h = +box.dataset.h || 900;
    let f = box.querySelector('iframe');
    if (!f) {
      f = document.createElement('iframe');
      f.loading = 'lazy';
      f.title = box.dataset.title || 'A page from this website';
      f.setAttribute('scrolling', box.classList.contains('static') ? 'no' : 'auto');
      f.src = src + (src.includes('?') ? '&' : '?') + 'embed=1';
      box.prepend(f);
    }
    f.style.width = w + 'px';
    f.style.height = h + 'px';
    const s = box.clientWidth / w;
    f.style.transform = `scale(${s})`;
    box.style.setProperty('--live-h', (h * s) + 'px');
    if (box.dataset.fit === 'height') box.style.height = (h * s) + 'px';
  };

  const size = () => frames.forEach(build);

  /* only build a frame once it is near the viewport */
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { build(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '300px' });
  frames.forEach((f) => io.observe(f));

  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(size, 120); });
  window.sfLive = { size, build };
})();

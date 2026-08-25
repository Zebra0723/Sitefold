/* Sitefold — reviews.
   ---------------------------------------------------------------------
   ADD REAL REVIEWS HERE. Each entry is:
     { name, business, place, stars (1-5), date, text }
   Nothing is invented: while this list is empty the page shows an honest
   "no reviews yet" state instead of made-up quotes. Add one entry and the
   summary, the star breakdown and the filters all start working.

   Example of the shape (delete the // to use it, once it is a real review):
   // { name: 'Jane Doe', business: 'Rose Blossom Photography', place: 'Leeds',
   //   stars: 5, date: 'March 2026', text: 'What they actually said.' },
   --------------------------------------------------------------------- */
window.SF = window.SF || {};

SF.reviews = [
  // real reviews go here
];

(() => {
  const list = SF.reviews;
  const star = (n) => '<span class="rv-stars" aria-label="' + n + ' out of 5">' +
    '★'.repeat(n) + '<i>' + '★'.repeat(5 - n) + '</i></span>';

  const card = (r) => `
    <article class="rv-card">
      ${star(r.stars)}
      <blockquote>${r.text}</blockquote>
      <footer>
        <b>${r.name}</b>
        <span>${[r.business, r.place].filter(Boolean).join(' · ')}</span>
        <time>${r.date || ''}</time>
      </footer>
    </article>`;

  const empty = (where) => `
    <div class="rv-empty">
      <p class="rv-emptybig">Sitefold is new, and we would rather show you nothing than show you something invented.</p>
      <p>There are no reviews on this page yet. When a customer writes one, it goes here in their words, with their name on it, unedited.</p>
      <p class="rv-emptynote num">In the meantime, the honest version of a portfolio is this website. ${where === 'home' ? '<a class="ul" href="#example">Look at the example above.</a>' : '<a class="ul" href="/">Look around it.</a>'}</p>
    </div>`;

  const summary = () => {
    const n = list.length;
    const avg = n ? list.reduce((a, r) => a + r.stars, 0) / n : 0;
    const counts = [5, 4, 3, 2, 1].map((s) => [s, list.filter((r) => r.stars === s).length]);
    return `
      <div class="rv-sum">
        <b class="rv-avg">${avg.toFixed(1)}</b>
        ${star(Math.round(avg))}
        <span class="num">${n} review${n === 1 ? '' : 's'}</span>
        <div class="rv-bars">
          ${counts.map(([s, c]) => `
            <button type="button" class="rv-bar" data-stars="${s}">
              <span>${s}</span><i><b style="width:${n ? (c / n) * 100 : 0}%"></b></i><span>${c}</span>
            </button>`).join('')}
        </div>
      </div>`;
  };

  /* homepage teaser */
  const home = document.getElementById('rv-home');
  if (home) {
    home.innerHTML = list.length
      ? `<div class="rv-grid">${list.slice(0, 3).map(card).join('')}</div>`
      : empty('home');
  }

  /* reviews page */
  const all = document.getElementById('rv-all');
  if (all) {
    let filter = 0;
    const draw = () => {
      const rows = list.filter((r) => !filter || r.stars === filter);
      all.innerHTML = list.length
        ? summary() +
          (filter ? `<p class="rv-filternote"><button type="button" class="dm-chip on rv-clear">${filter} star only — clear</button></p>` : '') +
          `<div class="rv-grid">${rows.map(card).join('')}</div>`
        : empty('page');
      all.querySelectorAll('.rv-bar').forEach((b) => b.classList.toggle('on', +b.dataset.stars === filter));
    };
    all.addEventListener('click', (e) => {
      if (e.target.closest('.rv-clear')) { filter = 0; return draw(); }
      const b = e.target.closest('.rv-bar');
      if (b) { filter = filter === +b.dataset.stars ? 0 : +b.dataset.stars; draw(); }
    });
    draw();
  }

  /* leave a review form */
  const form = document.getElementById('rv-form');
  if (form) {
    const done = document.getElementById('rv-done');
    let stars = 0;
    const picker = form.querySelector('.rv-pick');
    picker.innerHTML = [1, 2, 3, 4, 5]
      .map((n) => `<button type="button" data-s="${n}" aria-label="${n} star${n > 1 ? 's' : ''}">★</button>`).join('');
    picker.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      stars = +b.dataset.s;
      picker.querySelectorAll('button').forEach((x, i) => x.classList.toggle('on', i < stars));
      form.querySelector('.rv-pickerr').textContent = '';
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('[required]').forEach((i) => {
        const bad = !i.checkValidity();
        i.closest('.field').classList.toggle('invalid', bad);
        if (bad && ok) { i.focus(); ok = false; }
      });
      if (!stars) { form.querySelector('.rv-pickerr').textContent = 'Choose a rating first'; ok = false; }
      if (!ok) return;
      done.querySelector('.rv-doneb').textContent = form.rvname.value.split(' ')[0] || 'you';
      form.hidden = true;
      done.hidden = false;
      done.focus();
    });
    form.addEventListener('input', (e) => e.target.closest('.field')?.classList.remove('invalid'));
  }
})();

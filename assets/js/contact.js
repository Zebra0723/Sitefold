/* Sitefold — the seven-step enquiry.
   Enquiries are sent to the address below. Change it here and the whole
   form follows. */
const ENQUIRY_EMAIL = 'general@dailyos.uk';

(() => {
  const form = document.getElementById('ct-form');
  if (!form) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const steps = $$('.ct-fs', form);
  const titles = ['About you', 'Your website now', 'The business', 'What you want on it', 'Address and email', 'Anything else', 'Review'];
  const back = $('#ct-back'), next = $('#ct-next');
  const fill = $('#ct-fill'), label = $('#ct-step');
  const done = $('#ct-done');
  let s = 1;

  const show = (n, focus = true) => {
    s = Math.max(1, Math.min(steps.length, n));
    steps.forEach((f) => (f.hidden = +f.dataset.s !== s));
    fill.style.width = (s / steps.length) * 100 + '%';
    label.textContent = `Step ${s} of ${steps.length}  ·  ${titles[s - 1]}`;
    back.disabled = s === 1;
    next.innerHTML = s === steps.length
      ? 'Finish<svg class="arw" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M1 9 9 1M3.4 1H9v5.6"/></svg>'
      : 'Continue<svg class="arw" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M1 9 9 1M3.4 1H9v5.6"/></svg>';
    if (s === steps.length) review();
    if (focus) {
      const first = $('input:not([type=hidden]),textarea', steps[s - 1]);
      setTimeout(() => (first && !first.closest('[hidden]') ? first : next).focus({ preventScroll: true }), 60);
    }
  };

  const valid = () => {
    const fs = steps[s - 1];
    let ok = true;
    $$('[required]', fs).forEach((i) => {
      if (i.closest('[hidden]')) return;
      if (i.type === 'radio') {
        const group = form.elements[i.name];
        const chosen = [...group].some((r) => r.checked);
        fs.classList.toggle('invalid', !chosen);
        if (!chosen) ok = false;
        return;
      }
      const bad = !i.checkValidity();
      i.closest('.field').classList.toggle('invalid', bad);
      if (bad) { if (ok) i.focus(); ok = false; }
    });
    return ok;
  };

  const answers = () => {
    const d = new FormData(form);
    const want = d.getAll('want');
    return [
      ['Business', d.get('business'), 1],
      ['Contact', d.get('person'), 1],
      ['Email', d.get('email'), 1],
      ['Existing website', d.get('has') === 'Yes' ? (d.get('url') || 'Yes') : d.get('has'), 2],
      ['About the business', d.get('about'), 3],
      ['Wants on the site', want.length ? want.join(', ') : '', 4],
      ['Address and email', d.get('domain'), 5],
      ['Anything else', d.get('extra'), 6],
    ];
  };

  const review = () => {
    $('#ct-review').innerHTML = answers().map(([k, v, step]) => `
      <button type="button" data-goto="${step}">
        <dt>${k}</dt>
        <dd class="${v ? '' : 'empty'}">${v ? String(v).replace(/</g, '&lt;').replace(/\n/g, '<br>') : 'Not answered'}</dd>
      </button>`).join('');
  };

  $('#ct-review').addEventListener('click', (e) => {
    const b = e.target.closest('[data-goto]');
    if (b) show(+b.dataset.goto);
  });

  back.addEventListener('click', () => show(s - 1));
  next.addEventListener('click', () => {
    if (!valid()) return;
    if (s < steps.length) return show(s + 1);
    finish();
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); next.click(); });
  form.addEventListener('input', (e) => {
    e.target.closest('.field')?.classList.remove('invalid');
    e.target.closest('.ct-fs')?.classList.remove('invalid');
  });
  form.addEventListener('change', (e) => {
    if (e.target.name === 'has') $('.ct-url').hidden = e.target.value !== 'Yes';
  });

  const brief = () => {
    const d = new FormData(form);
    return [
      `New enquiry from ${d.get('business') || 'a business'}`,
      '',
      ...answers().map(([k, v]) => `${k}: ${v || '—'}`),
      '',
      'Sent from sitefoldwebsites.vercel.app',
    ].join('\n');
  };

  function finish() {
    const d = new FormData(form);
    const text = brief();
    $('#ct-name').textContent = (d.get('person') || '').split(' ')[0] || 'there';
    $('#ct-pre').textContent = text;
    $('#ct-send').href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent('Website enquiry — ' + (d.get('business') || ''))}&body=${encodeURIComponent(text)}`;
    form.hidden = true;
    done.hidden = false;
    done.focus();
  }

  $('#ct-edit').addEventListener('click', () => { done.hidden = true; form.hidden = false; show(1); });
  $('#ct-copy').addEventListener('click', async (e) => {
    try {
      await navigator.clipboard.writeText(brief());
      e.target.textContent = 'Copied — paste it to ' + ENQUIRY_EMAIL;
    } catch (err) {
      const r = document.createRange();
      r.selectNode($('#ct-pre'));
      getSelection().removeAllRanges();
      getSelection().addRange(r);
      e.target.textContent = 'Selected — press copy';
    }
    setTimeout(() => (e.target.textContent = 'Copy the brief'), 3200);
  });

  show(1, false);
})();

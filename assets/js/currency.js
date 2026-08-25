/* Sitefold — currency switching.
   Prices are held once, in pounds, on data-gbp attributes. Everything else
   is converted from that. Rates are indicative and easy to edit: change the
   numbers below and every price on the site follows. */
window.SF = window.SF || {};

SF.currency = (() => {
  const RATES = {
    GBP: { rate: 1,     symbol: '£', locale: 'en-GB', label: 'Pounds' },
    USD: { rate: 1.27,  symbol: '$', locale: 'en-US', label: 'US dollars' },
    EUR: { rate: 1.17,  symbol: '€', locale: 'en-IE', label: 'Euros' },
    CAD: { rate: 1.73,  symbol: '$', locale: 'en-CA', label: 'Canadian dollars' },
    AUD: { rate: 1.92,  symbol: '$', locale: 'en-AU', label: 'Australian dollars' },
    INR: { rate: 106,   symbol: '₹', locale: 'en-IN', label: 'Indian rupees' },
  };
  const KEY = 'sitefold:currency';
  let code = 'GBP';

  try { const s = localStorage.getItem(KEY); if (s && RATES[s]) code = s; } catch (e) { /* private mode */ }

  /* round to something a human would quote rather than a bank rate */
  const tidy = (n) => {
    if (n < 20) return Math.round(n);
    if (n < 200) return Math.round(n / 5) * 5;
    if (n < 2000) return Math.round(n / 10) * 10;
    return Math.round(n / 100) * 100;
  };

  const format = (gbp, cur = code) => {
    const c = RATES[cur];
    const v = tidy(gbp * c.rate);
    return new Intl.NumberFormat(c.locale, {
      style: 'currency', currency: cur, maximumFractionDigits: 0,
    }).format(v);
  };

  const paint = () => {
    document.querySelectorAll('[data-gbp]').forEach((el) => {
      const gbp = parseFloat(el.dataset.gbp);
      const pre = el.dataset.pre || '';
      const suf = el.dataset.suf || '';
      el.textContent = pre + format(gbp) + suf;
    });
    document.querySelectorAll('[data-cur-code]').forEach((el) => (el.textContent = code));
    document.querySelectorAll('.cur-seg button').forEach((b) => {
      const on = b.dataset.cur === code;
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('on', on);
    });
    document.querySelectorAll('[data-cur-note]').forEach((el) => {
      el.hidden = code === 'GBP';
    });
  };

  const set = (c) => {
    if (!RATES[c]) return;
    code = c;
    try { localStorage.setItem(KEY, c); } catch (e) { /* ignore */ }
    paint();
    document.querySelectorAll('[data-cur-live]').forEach((el) => {
      el.textContent = `Prices now shown in ${RATES[c].label.toLowerCase()}.`;
    });
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cur]');
    if (b) { e.preventDefault(); set(b.dataset.cur); }
  });

  /* build any switcher marked up on the page */
  document.querySelectorAll('.cur-seg').forEach((seg) => {
    if (seg.children.length) return;
    seg.innerHTML = Object.keys(RATES)
      .map((c) => `<button type="button" data-cur="${c}" aria-pressed="${c === code}">${c}</button>`)
      .join('');
  });

  paint();
  return { set, format, get code() { return code; }, rates: RATES };
})();

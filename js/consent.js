/* Analytics, only with consent (every page; ids from ANALYTICS in scripts/site_config.py).

   · Nothing is loaded and no cookie is set until the visitor presses Accept.
     The choice is kept in localStorage ("pk-consent": "granted" | "denied");
     until there is one, a small bar asks.
   · "Cookie Settings" in the footer ([data-consent-open], shown only here) asks again. Declining
     after accepting removes the analytics cookies and reloads the page, so the
     scripts are gone too.
   · The scripts run only on the live domain: a preview shows the bar and keeps
     the choice, but sends nothing.
   · Yandex Metrica runs without Session Replay (webvisor: false). */

const meta = document.querySelector('meta[name="pk-analytics"]');
const GA4 = meta?.dataset.ga4 || '';
const YM = Number(meta?.dataset.ym) || 0;
const LIVE = location.hostname === 'helloprokhorov.com';
const KEY = 'pk-consent';

const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const save = (v) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked: ask again next time */ } };

let loaded = false;
function load() {
  if (loaded || !LIVE) return;
  loaded = true;
  if (GA4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4);
    add(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4)}`);
  }
  if (YM) {
    window.ym = window.ym || function ym() { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    window.ym(YM, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
    add(`https://mc.yandex.ru/metrika/tag.js?id=${YM}`);
  }
}
function add(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.append(s);
}

// the cookies GA4 (_ga, _ga_<id>) and Metrica (_ym_*) leave on this domain
function clearCookies() {
  const host = location.hostname;
  const domains = ['', host, `.${host}`, `.${host.replace(/^www\./, '')}`];
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim();
    if (!/^(_ga|_gid|_gat|_ym)/.test(name)) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`;
  }
}

let bar = null;
function ask() {
  if (bar) { bar.querySelector('button').focus(); return; }
  bar = document.createElement('section');
  bar.className = 'consent-bar';
  bar.setAttribute('aria-label', 'Cookie consent');
  bar.innerHTML = `
    <p class="consent-bar__text">May I use analytics cookies (Google Analytics and Yandex Metrica) to see how the site is used? Nothing is loaded unless you agree. <a href="/privacy/#analytics">Privacy Policy</a></p>
    <p class="consent-bar__actions">
      <button class="consent-bar__btn consent-bar__btn--yes" type="button" data-choice="granted">Accept</button>
      <button class="consent-bar__btn" type="button" data-choice="denied">Decline</button>
    </p>`;
  bar.addEventListener('click', (e) => {
    const choice = e.target.closest('[data-choice]')?.dataset.choice;
    if (!choice) return;
    const before = read();
    save(choice);
    bar.remove();
    bar = null;
    if (choice === 'granted') load();
    else if (before === 'granted') { clearCookies(); location.reload(); }
  });
  document.body.append(bar);
}

if (GA4 || YM) {
  const choice = read();
  if (choice === 'granted') load();
  else if (choice !== 'denied') {
    // after the opening animation, not over it
    const html = document.documentElement;
    const ready = () => html.classList.contains('is-loaded') || !document.querySelector('[data-loader]');
    if (ready()) ask();
    else {
      const mo = new MutationObserver(() => { if (ready()) { mo.disconnect(); setTimeout(ask, 600); } });
      mo.observe(html, { attributes: true, attributeFilter: ['class'] });
      setTimeout(() => { mo.disconnect(); if (!bar && read() === null) ask(); }, 8000);
    }
  }
  for (const el of document.querySelectorAll('[data-consent-open]')) {
    el.hidden = false;
    el.querySelector('button')?.addEventListener('click', ask);
  }
}

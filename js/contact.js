/* Get in touch (/contact/): the project intake. Everything the site does
   (menu, clock, label rolls …) comes from main.js; this adds the form.

   · Questions 01–05 ask for one answer each (02: at least one), plus a name,
     an email and the privacy box. Nothing is checked while the visitor is
     still answering; on send, the first thing missing is brought into view
     with a short note, and the note clears as soon as it is answered.
   · Sending: data-mode="post" posts the answers to the form's action (Web3Forms,
     FORM_ENDPOINT + FORM_ACCESS_KEY in scripts/site_config.py) and shows
     "Thank you." only when the service answers { success: true }. data-mode="none" (no service yet) sends nothing and
     says so, with the answers ready to copy — it never claims a sent message,
     and it never hands off to a mail app.
   · Without JavaScript the form still submits natively to the same action. */

import './main.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

const form = $('[data-intake]');
const done = $('[data-intake-done]');
const mailDone = $('[data-intake-mail]');
const msg = $('[data-intake-msg]');
const send = $('[data-send]');
const sendLabel = $('[data-send-label]');

/* ---------- The way back ----------
   Came here from the site: "Back to site" is the browser's back, so the page
   returns exactly where it was. Opened directly: a plain link home. */
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-back-to-site]');
  if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  let from = null;
  try { from = document.referrer ? new URL(document.referrer) : null; } catch { /* no referrer */ }
  if (from && from.origin === location.origin && from.pathname !== location.pathname && history.length > 1) {
    e.preventDefault();
    (window.pkLeave || ((go) => go()))(() => history.back());   // through the colour sheets
  }
});

if (form) {
  form.noValidate = true;            // the checks below replace the browser's bubbles
  $$('.q__opts', form).forEach((list) => [...list.children].forEach((el, k) => el.style.setProperty('--k', k)));

  /* ---------- Checks ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const groups = $$('[data-q]', form);   // the choice questions

  function setError(holder, text, controls) {
    const out = $('[data-error]', holder);
    if (out) {
      if (!out.id) out.id = `err-${Math.random().toString(36).slice(2, 8)}`;
      out.textContent = text;
    }
    holder.classList.toggle('is-invalid', Boolean(text));
    controls.forEach((c) => {
      if (text) { c.setAttribute('aria-invalid', 'true'); if (out) c.setAttribute('aria-describedby', out.id); }
      else { c.removeAttribute('aria-invalid'); c.removeAttribute('aria-describedby'); }
    });
  }

  // each check returns the control to bring into view, or null when fine
  const checks = [
    ...groups.map((q) => () => {
      const inputs = $$('input', q);
      const ok = inputs.some((i) => i.checked);
      setError(q, ok ? '' : q.dataset.q === 'some' ? 'Choose at least one.' : 'Choose one.', inputs);
      return ok ? null : inputs[0];
    }),
    () => {
      const el = form.elements.name;
      const ok = el.value.trim().length > 0;
      setError(el.closest('.field'), ok ? '' : 'Your name, please.', [el]);
      return ok ? null : el;
    },
    () => {
      const el = form.elements.email;
      const v = el.value.trim();
      const ok = EMAIL.test(v);
      setError(el.closest('.field'), ok ? '' : v ? 'That email doesn’t look right.' : 'An email to reply to.', [el]);
      return ok ? null : el;
    },
    () => {
      const el = form.elements.privacy;
      setError(el.closest('.consent'), el.checked ? '' : 'Please agree to continue.', [el]);
      return el.checked ? null : el;
    },
  ];

  // a note goes away as soon as its question is answered
  form.addEventListener('change', (e) => {
    const q = e.target.closest('[data-q]');
    if (q?.classList.contains('is-invalid')) checks[groups.indexOf(q)]();
    if (q) q.classList.toggle('is-answered', $$('input', q).some((i) => i.checked));
    if (e.target.name === 'privacy' && e.target.checked) checks.at(-1)();
  });
  form.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (field?.classList.contains('is-invalid') && e.target.value.trim()) setError(field, '', [e.target]);
  });

  /* ---------- The project text grows with what is written ---------- */
  $$('[data-grow]', form).forEach((ta) => {
    if (CSS.supports('field-sizing', 'content')) return;
    const fit = () => { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight + 2}px`; };
    ta.addEventListener('input', fit);
    fit();
  });

  /* ---------- Sending ---------- */
  const answers = () => {
    const d = new FormData(form);
    const one = (k) => (d.get(k) || '').toString().trim();
    return {
      website: one('website'), needs: d.getAll('needs').join(', '), type: one('type'),
      start: one('start'), budget: one('budget'), message: one('message'),
      name: one('name'), email: one('email'), company: one('company'),
    };
  };

  function busy(on) {
    send.disabled = on;
    send.classList.toggle('is-busy', on);
    sendLabel.textContent = on ? 'Sending' : 'Send Project';
  }

  // the form leaves, the answer arrives in its place
  function swapTo(panel) {
    const top = form.closest('.doc__main') || form.parentElement;
    const show = () => {
      form.hidden = true;
      panel.hidden = false;
      const y = top.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
      if (scrollY > y) scrollTo({ top: Math.max(0, y), behavior: 'instant' });
      panel.focus({ preventScroll: true });
      if (!reduceMotion) $$(':scope > *', panel).forEach((el, i) => el.animate(
        [{ opacity: 0, translate: '0 24px' }, { opacity: 1, translate: '0 0' }],
        { duration: 900, delay: i * 90, easing: EASE_OUT, fill: 'backwards' },
      ));
    };
    if (reduceMotion) { show(); return; }
    form.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: 'ease-in' }).onfinish = show;
  }

  function brief(a) {
    const lines = [
      `Website: ${a.website}`, `Needs: ${a.needs}`, `Type: ${a.type}`,
      `Start: ${a.start}`, `Budget: ${a.budget}`, '',
      a.message || '(no project notes)', '',
      `${a.name} · ${a.email}${a.company ? ` · ${a.company}` : ''}`,
    ];
    return lines.join('\n');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const missing = checks.map((c) => c()).find(Boolean);
    if (missing) {
      const holder = missing.closest('.q, .consent') || missing;
      holder.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      missing.focus({ preventScroll: true });
      return;
    }
    if (form.elements.botcheck?.value) return;     // a bot filled the hidden field

    const a = answers();
    if (form.dataset.mode !== 'post') { swapTo(mailDone); return; }

    busy(true);
    const data = new FormData(form);
    data.set('needs', a.needs);                    // one readable line instead of repeated fields
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || String(res.status));
      swapTo(done);
    } catch {
      busy(false);
      msg.textContent = `That didn’t go through. Your answers are still here — try again, or write to ${$('[data-email]', mailDone).textContent}.`;
    }
  });

  // no service yet: the answers, ready to paste into an email
  const copyBtn = $('[data-copy-answers]');
  const copyLabel = $('[data-copy-answers-label]');
  let copyTimer;
  copyBtn?.addEventListener('click', async () => {
    clearTimeout(copyTimer);
    try {
      await navigator.clipboard.writeText(brief(answers()));
      copyLabel.textContent = 'Copied';
    } catch {
      copyLabel.textContent = 'Not Copied';
    }
    copyTimer = setTimeout(() => { copyLabel.textContent = 'Copy Answers'; }, 2200);
  });

  // back to the answers, as they were
  $('[data-intake-again]')?.addEventListener('click', () => {
    mailDone.hidden = true;
    form.hidden = false;
    send.focus({ preventScroll: true });
    send.scrollIntoView({ block: 'center' });
  });
}

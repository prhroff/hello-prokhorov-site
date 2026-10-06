/* Page transitions — one black sheet, bottom to top. Loaded as a plain
   script in the <head> of every page, so it runs before the first frame.

   Leaving (an internal link): after a short beat the sheet rises from the
   bottom of the screen until it covers it; then the browser goes to the next
   page.
   Arriving: the page starts under the sheet (put up before the first frame)
   and the black holds for a moment while it loads; then the sheet carries on
   upward and out through the top, revealing it. Both moves use one smooth,
   weighted curve at the same calm pace. The page's own entrance waits for
   the reveal (window.pkRevealed).
   Back / Forward: the browser leaves at once (that can't be delayed), so
   only the arrival plays — on a fresh load and on a page restored from the
   history cache alike.

   The sheet is the site's ink (--fg, #121212); the logotype
   (assets/img/Prokhorov_Logotype_SVG.svg) sits still in white in the middle
   of the screen — the sheet carries it, moved exactly against the sheet. The
   logo is drawn inline (LOGO_SVG, the two paths of that file), not loaded: a
   picture would have to arrive and decode on every new page while the sheet
   is already up, and the logo would blink out and back in.
   prefers-reduced-motion: plain navigation, no sheet. */
(function () {
  var html = document.documentElement;
  var COLORS = ['#121212'];                         // the site's ink
  var LOGO = ['#ffffff'];                           // the logo on it
  var LOGO_SVG = '<svg viewBox="0 0 235 48" aria-hidden="true" focusable="false">'
    + '<path d="M30.121 22.9744L38.1124 10.3932L25.7867 18.188L24.2968 6.97436L23.2133 17.9145L1 0L18.879 23.2479L14.8156 24.2051L18.7435 25.0256L10.8876 37.6068L23.3487 29.812L24.8386 41.1624L25.9222 30.2222L48 48L30.121 24.8889L34.3199 23.9316L30.121 22.9744Z"/>'
    + '<path d="M97.71 13C99.7692 13 101.532 13.4445 102.997 14.334C104.482 15.2235 105.611 16.4988 106.383 18.1592C107.175 19.7997 107.57 21.7564 107.57 24.0293C107.57 26.3024 107.175 28.2598 106.383 29.9004C105.611 31.5409 104.482 32.8058 102.997 33.6953C101.532 34.565 99.7692 35 97.71 35C95.6706 35 93.9183 34.565 92.4531 33.6953C90.988 32.8058 89.8593 31.5409 89.0674 29.9004C88.2754 28.2598 87.8799 26.3024 87.8799 24.0293C87.8799 21.7564 88.2755 19.7997 89.0674 18.1592C89.8594 16.4988 90.9879 15.2235 92.4531 14.334C93.9183 13.4445 95.6707 13 97.71 13ZM154.375 13C156.434 13 158.197 13.4445 159.662 14.334C161.147 15.2235 162.276 16.4989 163.048 18.1592C163.84 19.7997 164.235 21.7564 164.235 24.0293C164.235 26.3024 163.84 28.2598 163.048 29.9004C162.276 31.5409 161.147 32.8058 159.662 33.6953C158.197 34.565 156.434 35 154.375 35C152.336 35 150.583 34.565 149.118 33.6953C147.653 32.8058 146.524 31.541 145.732 29.9004C144.94 28.2598 144.544 26.3025 144.544 24.0293C144.544 21.7564 144.94 19.7997 145.732 18.1592C146.524 16.4988 147.653 15.2235 149.118 14.334C150.583 13.4445 152.336 13 154.375 13ZM192.432 13C194.491 13 196.254 13.4445 197.719 14.334C199.204 15.2235 200.332 16.4988 201.104 18.1592C201.896 19.7997 202.292 21.7564 202.292 24.0293C202.292 26.3024 201.896 28.2598 201.104 29.9004C200.332 31.5409 199.204 32.8058 197.719 33.6953C196.254 34.565 194.491 35 192.432 35C190.392 35 188.64 34.565 187.175 33.6953C185.71 32.8058 184.581 31.5409 183.789 29.9004C182.997 28.2598 182.602 26.3024 182.602 24.0293C182.602 21.7564 182.997 19.7997 183.789 18.1592C184.581 16.4988 185.71 15.2235 187.175 14.334C188.64 13.4445 190.392 13 192.432 13ZM61.8701 13.4746C64.2857 13.4746 66.1673 14.0574 67.5137 15.2236C68.8601 16.3701 69.5332 17.9716 69.5332 20.0273C69.5332 21.3911 69.2261 22.5769 68.6123 23.585C67.9985 24.5733 67.1171 25.3345 65.9688 25.8682C64.8402 26.382 63.4737 26.6387 61.8701 26.6387H57.208V34.5254H54V13.4746H61.8701ZM79.5625 13.4746C81.0672 13.4746 82.3642 13.7313 83.4531 14.2451C84.5421 14.759 85.3835 15.4907 85.9775 16.4395C86.5715 17.3882 86.8691 18.5148 86.8691 19.8193C86.8691 20.768 86.6513 21.6181 86.2158 22.3691C85.8 23.1202 85.2352 23.7231 84.5225 24.1777C84.1249 24.4272 83.7104 24.6124 83.2803 24.7383C84.075 24.8684 84.7268 25.146 85.2354 25.5713C85.968 26.1643 86.3939 27.1038 86.5127 28.3887L87.0771 34.5254H83.8398L83.335 28.8037C83.2756 27.9539 82.9882 27.3309 82.4736 26.9355C81.9588 26.5204 81.1164 26.3125 79.9482 26.3125H74.3652V34.5254H71.1572V13.4746H79.5625ZM112.538 23.5254L121.418 13.4746H125.309L117.23 22.666L125.844 34.5254H122.071L115.092 24.9189L112.538 27.7656V34.5254H109.33V13.4746H112.538V23.5254ZM129.957 22.4883H139.698V13.4746H142.906V34.5254H139.698V25.3936H129.957V34.5254H126.749V13.4746H129.957V22.4883ZM174.284 13.4746C175.789 13.4746 177.086 13.7312 178.175 14.2451C179.264 14.759 180.105 15.4907 180.699 16.4395C181.293 17.3882 181.59 18.5148 181.59 19.8193C181.59 20.7681 181.372 21.618 180.937 22.3691C180.521 23.1201 179.957 23.7231 179.244 24.1777C178.847 24.4271 178.432 24.6124 178.002 24.7383C178.797 24.8684 179.449 25.146 179.957 25.5713C180.69 26.1643 181.115 27.1039 181.233 28.3887L181.798 34.5254H178.561L178.056 28.8037C177.996 27.9537 177.709 27.3309 177.194 26.9355C176.68 26.5205 175.838 26.3125 174.67 26.3125H169.086V34.5254H165.879V13.4746H174.284ZM210.931 30.9678L217.139 13.4746H220.554L212.921 34.5254H208.911L201.309 13.4746H204.724L210.931 30.9678ZM97.71 15.9355C96.3637 15.9356 95.2055 16.2618 94.2354 16.9141C93.2653 17.5465 92.5131 18.4654 91.9785 19.6709C91.4638 20.8766 91.2061 22.3296 91.2061 24.0293C91.2061 25.7292 91.4637 27.1829 91.9785 28.3887C92.5131 29.5744 93.2653 30.4838 94.2354 31.1162C95.2055 31.7487 96.3637 32.0644 97.71 32.0645C99.0761 32.0645 100.245 31.7487 101.215 31.1162C102.205 30.4838 102.957 29.5744 103.472 28.3887C103.986 27.1829 104.244 25.7292 104.244 24.0293C104.244 22.3296 103.986 20.8766 103.472 19.6709C102.957 18.4654 102.205 17.5465 101.215 16.9141C100.245 16.2618 99.0762 15.9355 97.71 15.9355ZM154.375 15.9355C153.029 15.9356 151.871 16.2618 150.9 16.9141C149.93 17.5466 149.177 18.4652 148.643 19.6709C148.128 20.8766 147.871 22.3296 147.871 24.0293C147.871 25.7292 148.128 27.1829 148.643 28.3887C149.177 29.5746 149.93 30.4837 150.9 31.1162C151.871 31.7486 153.029 32.0644 154.375 32.0645C155.741 32.0645 156.91 31.7487 157.88 31.1162C158.87 30.4838 159.622 29.5744 160.137 28.3887C160.652 27.1829 160.909 25.7292 160.909 24.0293C160.909 22.3296 160.651 20.8766 160.137 19.6709C159.622 18.4654 158.87 17.5465 157.88 16.9141C156.91 16.2618 155.741 15.9355 154.375 15.9355ZM192.432 15.9355C191.085 15.9356 189.927 16.2618 188.957 16.9141C187.987 17.5465 187.235 18.4654 186.7 19.6709C186.185 20.8766 185.928 22.3296 185.928 24.0293C185.928 25.7292 186.185 27.1829 186.7 28.3887C187.235 29.5744 187.987 30.4838 188.957 31.1162C189.927 31.7487 191.085 32.0644 192.432 32.0645C193.798 32.0645 194.966 31.7487 195.937 31.1162C196.926 30.4838 197.679 29.5744 198.193 28.3887C198.708 27.1829 198.966 25.7292 198.966 24.0293C198.966 22.3296 198.708 20.8766 198.193 19.6709C197.679 18.4654 196.926 17.5465 195.937 16.9141C194.966 16.2618 193.798 15.9355 192.432 15.9355ZM229.665 13.3428C230.393 13.3428 231.076 13.479 231.713 13.752C232.35 14.0249 232.909 14.4085 233.39 14.9023C233.884 15.3833 234.267 15.9431 234.54 16.5801C234.813 17.2169 234.95 17.9057 234.95 18.6465C234.95 19.3745 234.813 20.0639 234.54 20.7139C234.267 21.3508 233.884 21.9162 233.39 22.4102C232.909 22.8911 232.35 23.268 231.713 23.541C231.076 23.814 230.393 23.9512 229.665 23.9512C228.924 23.9511 228.229 23.8139 227.579 23.541C226.942 23.268 226.382 22.8912 225.901 22.4102C225.421 21.9162 225.043 21.3507 224.771 20.7139C224.498 20.0639 224.361 19.3745 224.361 18.6465C224.361 17.9057 224.498 17.2169 224.771 16.5801C225.044 15.9431 225.42 15.3833 225.901 14.9023C226.382 14.4083 226.942 14.025 227.579 13.752C228.229 13.4791 228.924 13.3428 229.665 13.3428ZM57.208 23.7334H61.7812C63.2265 23.7334 64.3257 23.4271 65.0781 22.8145C65.8305 22.182 66.207 21.2527 66.207 20.0273C66.207 18.8216 65.8305 17.9221 65.0781 17.3291C64.3257 16.7163 63.2267 16.4102 61.7812 16.4102H57.208V23.7334ZM74.3652 23.3779H79.6221C80.8298 23.3779 81.7806 23.0813 82.4736 22.4883C83.1864 21.8755 83.542 21.0151 83.542 19.9082C83.5419 18.7818 83.1861 17.9221 82.4736 17.3291C81.7608 16.7163 80.7207 16.4102 79.3545 16.4102H74.3652V23.3779ZM169.086 23.3779H174.344C175.551 23.3779 176.501 23.0811 177.194 22.4883C177.907 21.8755 178.264 21.0151 178.264 19.9082C178.264 18.7816 177.907 17.9221 177.194 17.3291C176.482 16.7164 175.442 16.4102 174.076 16.4102H169.086V23.3779ZM229.665 14.2598C228.82 14.2598 228.066 14.4613 227.403 14.8643C226.74 15.2542 226.214 15.7805 225.824 16.4434C225.447 17.1063 225.259 17.8406 225.259 18.6465C225.259 19.4395 225.447 20.1746 225.824 20.8506C226.214 21.5264 226.74 22.0658 227.403 22.4688C228.066 22.8587 228.82 23.0537 229.665 23.0537C230.51 23.0537 231.258 22.8587 231.908 22.4688C232.571 22.0658 233.091 21.5264 233.468 20.8506C233.845 20.1746 234.033 19.4395 234.033 18.6465C234.033 17.8406 233.845 17.1063 233.468 16.4434C233.091 15.7805 232.571 15.2542 231.908 14.8643C231.258 14.4613 230.51 14.2598 229.665 14.2598ZM229.51 15.7217C230.238 15.7217 230.81 15.8775 231.226 16.1895C231.642 16.5014 231.85 16.9372 231.85 17.4961C231.85 17.899 231.738 18.2433 231.518 18.5293C231.297 18.8023 230.978 18.9917 230.562 19.0957L232.024 21.6104H231.011L229.665 19.2314H228.476V21.6104H227.579V15.7217H229.51ZM228.476 18.4717H229.665C230.081 18.4717 230.4 18.3802 230.621 18.1982C230.855 18.0163 230.972 17.7689 230.972 17.457C230.972 17.1582 230.855 16.9238 230.621 16.7549C230.4 16.5729 230.081 16.4824 229.665 16.4824H228.476V18.4717Z"/></svg>';
  var EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';      // smooth in and out, a little weight, no overshoot
  var BEAT = 80;                                    // the current page, a moment longer
  var RISE = 650;                                   // bottom to covering
  var HOLD = 250;                                   // the black, held, while the next page loads
  var EXIT = 650;                                   // covering to gone
  var STEP = 150;                                   // (a further sheet would start this much later)
  var KEY = 'pk-pt';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // the case studies used to open on the home page (/#case-pm): those addresses go to their pages
  var CASES = { pm: 'powermatic', vh: 'visual-hunters', co: 'contour-office', mo: 'monolith-one', la: 'lattice', lu: 'luma' };
  var old = location.pathname === '/' && /^#case-(\w+)$/.exec(location.hash);
  if (old && CASES[old[1]]) { location.replace('/work/' + CASES[old[1]] + '/'); return; }

  var revealed;
  window.pkRevealed = new Promise(function (r) { revealed = r; });

  // a case that grew out of a project picture (js/main.js): it arrives already open, without the sheet
  try {
    if (sessionStorage.getItem('pk-grow') === '1') {
      sessionStorage.removeItem('pk-grow');
      html.classList.add('pt-grow');
    }
  } catch (e) { /* storage blocked */ }

  // came here from another page of the site: no preloader (the transition was the way in)
  try {
    if (document.referrer && new URL(document.referrer).origin === location.origin) {
      html.classList.add('is-seen');
      sessionStorage.setItem('pk-seen', '1');
    }
  } catch (e) { /* no referrer, or storage blocked */ }

  if (reduce) { revealed(); window.pkLeave = function (go) { go(); }; return; }

  /* ---------- arriving ---------- */
  var arriving = false;
  try {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    arriving = sessionStorage.getItem(KEY) === '1' || (nav && nav.type === 'back_forward');
    sessionStorage.removeItem(KEY);
  } catch (e) { /* storage blocked: no cover */ }

  // one sheet: a solid colour with the logo in the middle of the screen
  function makeSheet(i) {
    var s = document.createElement('div');
    s.className = 'pt-sheet';
    s.style.background = COLORS[i];
    s.innerHTML = '<div class="pt-sheet__logo" style="color:' + LOGO[i] + '">' + LOGO_SVG + '</div>';
    return s;
  }
  // move a sheet; its logo moves the other way by exactly as much, so it stays put
  function slide(s, from, to, timing) {
    var back = function (v) { return v === '0' ? '0' : v.charAt(0) === '-' ? v.slice(1) : '-' + v; };
    s.firstChild.animate([{ transform: 'translateY(' + back(from) + ')' }, { transform: 'translateY(' + back(to) + ')' }], timing);
    return s.animate([{ transform: 'translateY(' + from + ')' }, { transform: 'translateY(' + to + ')' }], timing);
  }

  var cover = null;     // the ink an arriving page starts under
  function reveal() {
    var done = function () {
      if (!cover) return;
      cover.remove();
      cover = null;
      html.classList.remove('pt-cover');
      revealed();
    };
    slide(cover.firstChild, '0', '-100%', { duration: EXIT, easing: EASE, fill: 'forwards' }).onfinish = done;
    setTimeout(done, EXIT + 400);
  }

  if (arriving) {
    // the ink, with its logo, is there from the first frame (the body is not parsed yet: it goes on <html>)
    html.classList.add('pt-cover');
    cover = document.createElement('div');
    cover.className = 'pt-sheets';
    cover.setAttribute('aria-hidden', 'true');
    var ink = makeSheet(COLORS.length - 1);
    ink.style.transform = 'none';
    cover.append(ink);
    html.append(cover);
    // the black holds at least HOLD from the first frame, and until the page is parsed
    var held = new Promise(function (r) { setTimeout(r, HOLD); });
    var parsed = new Promise(function (r) { document.addEventListener('DOMContentLoaded', r); });
    Promise.all([held, parsed]).then(function () { requestAnimationFrame(reveal); });
  } else {
    revealed();
  }

  /* ---------- leaving ---------- */
  var sheets = null;
  var leaving = false;

  function leave(then) {
    if (leaving) return;
    leaving = true;
    sheets = document.createElement('div');
    sheets.className = 'pt-sheets';
    sheets.setAttribute('aria-hidden', 'true');
    COLORS.forEach(function (c, i) {
      var s = makeSheet(i);
      sheets.append(s);
      slide(s, '100%', '0', { duration: RISE, delay: BEAT + i * STEP, easing: EASE, fill: 'both' });
    });
    document.body.append(sheets);
    setTimeout(function () {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* the next page simply shows */ }
      then();
      // the navigation never happened (cancelled, a download …): give the page back
      setTimeout(function () { if (document.visibilityState === 'visible' && sheets) uncover(); }, 4000);
    }, BEAT + RISE + (COLORS.length - 1) * STEP);
  }

  function uncover() {
    leaving = false;
    try { sessionStorage.removeItem(KEY); } catch (e) { /* nothing to clear */ }
    if (!sheets) return;
    var last = sheets.lastChild;
    var gone = sheets;
    sheets = null;
    slide(last, '0', '-100%', { duration: EXIT, delay: HOLD, easing: EASE, fill: 'both' }).onfinish = function () { gone.remove(); };
    [].slice.call(gone.children, 0, -1).forEach(function (s) { s.style.visibility = 'hidden'; });
  }

  // for scripts that leave the page themselves (e.g. "Back to site" → history.back())
  window.pkLeave = function (go) { leave(go); };

  // after the page's own handlers (window, bubbling): a link they took over is left alone
  addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;                                        // other sites: as usual
    if (url.pathname === location.pathname && url.search === location.search) return;  // same page: an anchor
    e.preventDefault();
    leave(function () { location.href = url.href; });
  });

  // back to a page that had left under the sheets (history cache): the ink lifts off it
  addEventListener('pageshow', function (e) { if (e.persisted && sheets) uncover(); });
})();

/* ============================================================
   Mirela Beches – site behaviours
   - DE/EN language switch (inline data-de / data-en attributes)
   - mobile drawer, nav active state, scroll reveal
   ============================================================ */
(function () {
  'use strict';

  var LANG_KEY = 'mb_lang';

  function getLang() {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved === 'de' || saved === 'en') return saved;
    return 'de';
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    // text content
    document.querySelectorAll('[data-de]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (val != null) el.innerHTML = val;
    });
    // placeholders
    document.querySelectorAll('[data-de-ph]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang + '-ph');
      if (val != null) el.setAttribute('placeholder', val);
    });
    // aria-labels
    document.querySelectorAll('[data-de-aria]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang + '-aria');
      if (val != null) el.setAttribute('aria-label', val);
    });
    // toggle buttons
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.lang === lang);
    });
    localStorage.setItem(LANG_KEY, lang);
  }

  function initLang() {
    applyLang(getLang());
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.dataset.lang); });
    });
  }

  /* ---- mobile drawer ---- */
  function initDrawer() {
    var drawer = document.querySelector('.drawer');
    var burger = document.querySelector('.nav__burger');
    if (!drawer || !burger) return;
    var close = drawer.querySelector('.drawer__close');
    var scrim = drawer.querySelector('.drawer__scrim');
    function open() { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function shut() { drawer.classList.remove('open'); document.body.style.overflow = ''; }
    burger.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    if (scrim) scrim.addEventListener('click', shut);
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', shut); });
  }

  /* ---- active nav link ---- */
  function initActive() {
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === here) a.classList.add('is-active');
    });
  }

  /* ---- scroll reveal ---- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---- count-up for stat numbers ---- */
  function initCountUp() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.dataset.count), dur = 1100, t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('de-DE');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  function boot() {
    initLang();
    initDrawer();
    initActive();
    initReveal();
    initCountUp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

/* ============================================================
   Divine Birth Midwifery Centre — Main JS
   Real form submissions via Web3Forms API
   ============================================================ */

(function () {
  'use strict';

  /* CONFIG — replace with real key from https://web3forms.com */
  var CFG = window.DIVINE_CONFIG || {};
  var W3F_KEY = CFG.WEB3FORMS_KEY || '';

  /* Nav scroll */
  function initNav() {
    var nav = document.getElementById('mainNav');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Hamburger */
  function initHamburger() {
    var btn  = document.getElementById('navHamburger');
    var menu = document.getElementById('navMobile');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Scroll reveal */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add('visible'); }, i * 55);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* Web3Forms submit */
  function submitW3F(payload, btn, okText) {
    if (!CFG.IS_CONFIGURED) {
      var tel = CFG.CLINIC_PHONE || '+254794444141';
      btn.textContent = 'Unavailable \u2014 please call ' + tel;
      btn.disabled = false;
      return;
    }
    payload.access_key = W3F_KEY;
    payload.from_name  = 'Divine Birth Website';
    payload.botcheck   = '';
    btn.textContent = 'Sending\u2026';
    btn.disabled = true;
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d.success) {
        btn.textContent = '\u2713 ' + okText;
        btn.style.background = '#235f55';
      } else {
        btn.textContent = 'Submission failed — please try again';
        btn.disabled = false;
      }
    })
    .catch(function () {
      btn.textContent = 'Network error — call +254 794 444141';
      btn.disabled = false;
    });
  }

  /* Inline field error */
  function fieldErr(id, msg) {
    var f = document.getElementById(id);
    if (!f) return;
    var e = f.parentNode.querySelector('.ferr');
    if (!e) {
      e = document.createElement('span');
      e.className = 'ferr';
      e.style.cssText = 'display:block;font-size:11px;color:#c0392b;margin-top:3px;';
      f.parentNode.appendChild(e);
    }
    e.textContent = msg;
    f.style.borderColor = msg ? '#c0392b' : '';
    if (msg) f.focus();
  }

  /* Inquiry form */
  function initInquiry() {
    var btn = document.getElementById('inquirySubmit');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var fn = (document.getElementById('fname')    || {value:''}).value.trim();
      var ph = (document.getElementById('iphone')   || {value:''}).value.trim();
      var sv = (document.getElementById('iservice') || {value:''}).value;
      var ln = (document.getElementById('lname')    || {value:''}).value.trim();
      var ms = (document.getElementById('imessage') || {value:''}).value.trim();
      var ok = true;
      if (!fn) { fieldErr('fname',  'Please enter your name.');         ok = false; }
      else     { fieldErr('fname',  ''); }
      if (!ph) { fieldErr('iphone', 'Please enter your phone number.'); ok = false; }
      else     { fieldErr('iphone', ''); }
      if (!ok) return;
      submitW3F({
        subject: 'New Inquiry — ' + fn + ' ' + ln,
        name: fn + ' ' + ln,
        phone: ph, service: sv, message: ms
      }, btn, 'Inquiry sent — we will be in touch shortly');
    });
  }

  /* Boot */
  function init() { initNav(); initHamburger(); initReveal(); initInquiry(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

/* ── Extended: also hit backend for inquiry if BACKEND_URL is set ── */
(function () {
  var CFG         = window.DIVINE_CONFIG || {};
  var BACKEND_URL = CFG.BACKEND_URL || '';
  var W3F_KEY     = CFG.WEB3FORMS_KEY || '';

  /* Override the simple inquirySubmit handler above with the full backend/W3F version */
  var btn = document.getElementById('inquirySubmit');
  if (!btn) return;

  /* Remove old listener by cloning the button */
  var newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  newBtn.addEventListener('click', function () {
    var fn = (document.getElementById('ifname')   || {value:''}).value.trim();
    var ln = (document.getElementById('ilname')   || {value:''}).value.trim();
    var ph = (document.getElementById('iphone')   || {value:''}).value.trim();
    var sv = (document.getElementById('iservice') || {value:''}).value;
    var ms = (document.getElementById('imessage') || {value:''}).value.trim();

    if (!fn) { highlight('ifname', 'Please enter your name.');         return; }
    if (!ph) { highlight('iphone', 'Please enter your phone number.'); return; }

    if (!CFG.IS_CONFIGURED) {
      var tel = CFG.CLINIC_PHONE || '+254794444141';
      newBtn.textContent = 'Unavailable \u2014 please call ' + tel;
      newBtn.disabled    = false;
      return;
    }

    newBtn.textContent = 'Sending\u2026';
    newBtn.disabled    = true;

    var payload = { firstname: fn, lastname: ln, phone: ph, service: sv, message: ms };

    if (BACKEND_URL) {
      fetch(BACKEND_URL + '/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        newBtn.textContent     = d.success ? '\u2713 Inquiry sent \u2014 we will be in touch shortly' : 'Failed \u2014 please try again';
        newBtn.style.background = d.success ? '#235f55' : '';
        if (!d.success) newBtn.disabled = false;
      })
      .catch(function () {
        newBtn.textContent = 'Network error \u2014 call +254 794 444141';
        newBtn.disabled    = false;
      });
    } else {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: W3F_KEY, from_name: 'Divine Birth Website',
          subject: 'Inquiry from ' + fn + ' ' + ln,
          name: fn + ' ' + ln, phone: ph, service: sv, message: ms
        })
      })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        newBtn.textContent      = d.success ? '\u2713 Inquiry sent \u2014 we will be in touch shortly' : 'Failed \u2014 please try again';
        newBtn.style.background = d.success ? '#235f55' : '';
        if (!d.success) newBtn.disabled = false;
      })
      .catch(function () {
        newBtn.textContent = 'Network error \u2014 call +254 794 444141';
        newBtn.disabled    = false;
      });
    }
  });

  function highlight(id, msg) {
    var f = document.getElementById(id);
    if (!f) return;
    var e = f.parentNode.querySelector('.ferr');
    if (!e) { e = document.createElement('span'); e.className = 'ferr'; e.style.cssText = 'display:block;font-size:11px;color:#c0392b;margin-top:3px;'; f.parentNode.appendChild(e); }
    e.textContent = msg;
    f.style.borderColor = '#c0392b';
    f.focus();
  }
})();

/* ============================================================
   Divine Birth — Booking Calendar
   Submits to /api/appointment (Node backend)
   OR falls back to Web3Forms if backend URL not configured.
   ============================================================ */

(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  /* Set to your deployed backend URL, e.g. https://api.yourdomain.com
     Leave empty to use Web3Forms fallback instead.           */
  var CFG          = window.DIVINE_CONFIG || {};
  var BACKEND_URL  = CFG.BACKEND_URL || '';
  var W3F_KEY      = CFG.WEB3FORMS_KEY || '';

  /* ── State ── */
  var today        = new Date();
  var viewYear     = today.getFullYear();
  var viewMonth    = today.getMonth();
  var selectedDate = null;
  var selectedSlot = null;

  var ALL_SLOTS = ['08:00','09:00','10:00','11:00','12:00',
                   '14:00','15:00','16:00','17:00'];

  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  var DOWS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  /* ── Helpers ── */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function dateKey(y, m, d) { return y + '-' + pad(m+1) + '-' + pad(d); }
  function isToday(y, m, d) {
    return y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
  }
  function isPast(y, m, d) {
    return new Date(y, m, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
  function isSunday(y, m, d) { return new Date(y, m, d).getDay() === 0; }

  /* ── Calendar render ── */
  function renderCalendar() {
    var grid = document.getElementById('calGrid');
    if (!grid) return;
    var first = new Date(viewYear, viewMonth, 1).getDay();
    var days  = new Date(viewYear, viewMonth + 1, 0).getDate();
    var prev  = new Date(viewYear, viewMonth, 0).getDate();

    document.getElementById('calMonth').textContent = MONTHS[viewMonth] + ' ' + viewYear;

    var html = DOWS.map(function (d) {
      return '<div class="cal-dow">' + d + '</div>';
    }).join('');

    for (var i = 0; i < first; i++) {
      html += '<div class="cal-day other">' + (prev - first + 1 + i) + '</div>';
    }
    for (var d = 1; d <= days; d++) {
      var key = dateKey(viewYear, viewMonth, d);
      var cls = 'cal-day';
      if (isToday(viewYear, viewMonth, d))  cls += ' today';
      if (isPast(viewYear, viewMonth, d))   cls += ' past';
      else if (isSunday(viewYear, viewMonth, d)) cls += ' unavailable';
      else cls += ' available';
      if (selectedDate === key) cls += ' selected';
      html += '<div class="' + cls + '" data-date="' + key + '">' + d + '</div>';
    }
    var trailing = (first + days) % 7;
    if (trailing) {
      for (var j = 1; j <= 7 - trailing; j++) {
        html += '<div class="cal-day other">' + j + '</div>';
      }
    }
    grid.innerHTML = html;

    grid.querySelectorAll('.cal-day.available').forEach(function (el) {
      el.addEventListener('click', function () {
        selectedDate = this.dataset.date;
        selectedSlot = null;
        renderCalendar();
        renderSlots();
        updateSummary();
      });
    });
  }

  /* ── Slots render ── */
  function renderSlots() {
    var wrap = document.getElementById('timeSlotsWrap');
    if (!wrap) return;
    if (!selectedDate) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'block';
    var html = ALL_SLOTS.map(function (t) {
      return '<button class="slot' + (selectedSlot === t ? ' selected' : '') +
             '" data-time="' + t + '">' + t + '</button>';
    }).join('');
    document.getElementById('slotsGrid').innerHTML = html;
    document.querySelectorAll('.slot').forEach(function (el) {
      el.addEventListener('click', function () {
        selectedSlot = this.dataset.time;
        document.querySelectorAll('.slot').forEach(function (s) { s.classList.remove('selected'); });
        this.classList.add('selected');
        updateSummary();
      });
    });
  }

  /* ── Summary banner ── */
  function updateSummary() {
    var el = document.getElementById('bookingSummary');
    if (!el) return;
    if (selectedDate && selectedSlot) {
      var d = new Date(selectedDate + 'T12:00:00');
      var label = d.toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      el.classList.add('active');
      el.innerHTML = '<strong>Your appointment</strong>' + label + ' at ' + selectedSlot;
    } else if (selectedDate) {
      var d2 = new Date(selectedDate + 'T12:00:00');
      var label2 = d2.toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      el.classList.add('active');
      el.innerHTML = '<strong>' + label2 + '</strong>Please select a time above.';
    } else {
      el.classList.remove('active');
    }
  }

  /* ── Nav ── */
  function attachNav() {
    var prev = document.getElementById('calPrev');
    var next = document.getElementById('calNext');
    if (prev) prev.addEventListener('click', function () {
      if (--viewMonth < 0) { viewMonth = 11; viewYear--; }
      selectedDate = null; selectedSlot = null;
      renderCalendar(); renderSlots(); updateSummary();
    });
    if (next) next.addEventListener('click', function () {
      if (++viewMonth > 11) { viewMonth = 0; viewYear++; }
      selectedDate = null; selectedSlot = null;
      renderCalendar(); renderSlots(); updateSummary();
    });
  }

  /* ── Submit via backend or Web3Forms ── */
  function submitAppointment(data, btn) {
    if (!CFG.IS_CONFIGURED) { onNotConfigured(btn); return; }
    btn.textContent = 'Confirming\u2026';
    btn.disabled = true;

    if (BACKEND_URL) {
      /* Hit our own Express API */
      fetch(BACKEND_URL + '/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function (r) { return r.json(); })
      .then(function (d) { onResult(d.success, btn); })
      .catch(function ()  { onNetworkErr(btn); });
    } else {
      /* Web3Forms fallback */
      var d = new Date(data.date + 'T12:00:00');
      var label = d.toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: W3F_KEY,
          from_name:  'Divine Birth Website',
          subject:    'Appointment: ' + data.firstname + ' ' + data.lastname + ' — ' + data.service,
          name:       data.firstname + ' ' + data.lastname,
          phone:      data.phone, service: data.service,
          date:       label, time: data.time, notes: data.notes || ''
        })
      })
      .then(function (r) { return r.json(); })
      .then(function (d) { onResult(d.success, btn); })
      .catch(function ()  { onNetworkErr(btn); });
    }
  }

  function onResult(ok, btn) {
    if (ok) {
      btn.textContent = '\u2713 Appointment request sent \u2014 we will confirm by SMS';
      btn.style.background = '#235f55';
      var s = document.getElementById('bookingSummary');
      if (s) { s.classList.add('active'); s.innerHTML = '<strong>Request received!</strong>We will SMS you a confirmation shortly.'; }
      selectedDate = null; selectedSlot = null;
      renderCalendar(); renderSlots();
    } else {
      btn.textContent = 'Submission failed — please try again';
      btn.disabled = false;
    }
  }

  function onNotConfigured(btn) {
    var tel = CFG.CLINIC_PHONE || '+254794444141';
    btn.textContent = 'Online booking unavailable \u2014 please call ' + tel;
    btn.disabled = false;
    var s = document.getElementById('bookingSummary');
    if (s) {
      s.classList.add('active');
      s.innerHTML = '<strong>Please call us to book.</strong>'
        + 'Online booking is not yet switched on. Call <a href="tel:' + tel + '">' + tel + '</a> '
        + '\u2014 we are open 24 hours.';
    }
  }

  function onNetworkErr(btn) {
    btn.textContent = 'Network error — call +254 794 444141';
    btn.disabled = false;
  }

  /* ── Booking form submit ── */
  function attachForm() {
    var form = document.getElementById('bookingForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!selectedDate || !selectedSlot) {
        alert('Please choose a date and time slot first.');
        return;
      }
      var fn = form.querySelector('#bfname').value.trim();
      var ln = form.querySelector('#blname').value.trim();
      var ph = form.querySelector('#bphone').value.trim();
      var sv = form.querySelector('#bservice').value;
      var nt = form.querySelector('#bnotes').value.trim();
      if (!fn || !ph || !sv) {
        alert('Please fill in your name, phone number and service.');
        return;
      }
      var d = new Date(selectedDate + 'T12:00:00');
      var label = d.toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      submitAppointment({
        firstname: fn, lastname: ln, phone: ph,
        service: sv, date: label, time: selectedSlot, notes: nt
      }, form.querySelector('.form-btn'));
    });
  }

  /* ── Init ── */
  function init() {
    renderCalendar();
    renderSlots();
    attachNav();
    attachForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(function () {
  'use strict';

  var DATA_VERSION = 'glbajaj_sec_f_v2';
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var TYPE_LABELS = {
    lecture: 'Lecture',
    lab: 'Lab',
    practical: 'Tutorial / Prac',
    self: 'Library / Self',
    free: 'Break / Free'
  };

  var DEFAULT_SLOTS = [
    { start: '09:10', end: '10:00', label: 'Period 1' },
    { start: '10:00', end: '10:50', label: 'Period 2' },
    { start: '10:50', end: '11:00', label: 'Morning Break' },
    { start: '11:00', end: '11:50', label: 'Period 3' },
    { start: '11:50', end: '12:40', label: 'Period 4' },
    { start: '12:40', end: '13:30', label: 'Lunch Break' },
    { start: '13:30', end: '14:20', label: 'Period 5' },
    { start: '14:20', end: '15:10', label: 'Period 6' },
    { start: '15:10', end: '16:00', label: 'Period 7' },
    { start: '16:00', end: '16:50', label: 'Period 8' }
  ];

  var DEFAULT_CLASSES = [
    // MONDAY
    { id: 101, subject: 'PC', day: 'Mon', start: '09:10', end: '10:00', type: 'lecture', room: '211', teacher: 'Ms. Khushbu Singh', batch: 'both', reminder: '5', notes: 'Professional Communication' },
    { id: 102, subject: 'DESIGN LAB', day: 'Mon', start: '10:00', end: '10:50', type: 'lab', room: 'Design Lab', teacher: 'Dr. Bablu Kumar Jha', batch: 'F1', reminder: '5', notes: 'Batch F1' },
    { id: 103, subject: 'PL-T', day: 'Mon', start: '10:00', end: '10:50', type: 'practical', room: '211', teacher: 'Er. Mohit Singh', batch: 'F2', reminder: '5', notes: 'Programming Lang Tutorial' },
    { id: 104, subject: 'Morning Break', day: 'Mon', start: '10:50', end: '11:00', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Morning Break' },
    { id: 105, subject: 'DESIGN LAB', day: 'Mon', start: '11:00', end: '12:40', type: 'lab', room: 'Design Lab', teacher: 'Dr. Bablu Kumar Jha', batch: 'F1', reminder: '5', notes: 'Batch F1 (2 periods)' },
    { id: 106, subject: 'PC LAB', day: 'Mon', start: '11:00', end: '12:40', type: 'lab', room: 'Language Lab', teacher: 'Miss. Raavi Bhargav', batch: 'F2', reminder: '5', notes: 'Language Lab (2 periods)' },
    { id: 107, subject: 'Lunch Break', day: 'Mon', start: '12:40', end: '13:30', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Lunch' },
    { id: 108, subject: 'PHYSICS', day: 'Mon', start: '13:30', end: '14:20', type: 'lecture', room: '211', teacher: 'Ms. Anjali', batch: 'both', reminder: '5', notes: 'Quantum Physics' },
    { id: 109, subject: 'EE', day: 'Mon', start: '14:20', end: '15:10', type: 'lecture', room: '211', teacher: 'Er. Ankul Tiwari', batch: 'both', reminder: '5', notes: 'Electrical Engineering' },
    { id: 110, subject: 'PL', day: 'Mon', start: '15:10', end: '16:00', type: 'lecture', room: '211', teacher: 'Er. Mohit Singh', batch: 'both', reminder: '5', notes: 'Programming Language' },
    { id: 111, subject: 'MATH-I', day: 'Mon', start: '16:00', end: '16:50', type: 'lecture', room: '211', teacher: 'Dr. Sweety Gupta', batch: 'both', reminder: '5', notes: 'Calculus & Linear Algebra' },

    // TUESDAY
    { id: 201, subject: 'AI', day: 'Tue', start: '09:10', end: '10:00', type: 'lecture', room: '211', teacher: 'Er. Aayush Kumar Jha', batch: 'both', reminder: '5', notes: 'Intro to AI & Prompt Eng' },
    { id: 202, subject: 'PL', day: 'Tue', start: '10:00', end: '10:50', type: 'lecture', room: '211', teacher: 'Er. Mohit Singh', batch: 'both', reminder: '5', notes: 'Programming Language' },
    { id: 203, subject: 'Morning Break', day: 'Tue', start: '10:50', end: '11:00', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Break' },
    { id: 204, subject: 'MATH-I', day: 'Tue', start: '11:00', end: '11:50', type: 'lecture', room: '211', teacher: 'Dr. Sweety Gupta', batch: 'both', reminder: '5', notes: 'Calculus & Linear Algebra' },
    { id: 205, subject: 'PHYSICS', day: 'Tue', start: '11:50', end: '12:40', type: 'lecture', room: '211', teacher: 'Ms. Anjali', batch: 'both', reminder: '5', notes: 'Quantum Physics' },
    { id: 206, subject: 'Lunch Break', day: 'Tue', start: '12:40', end: '13:30', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Lunch' },
    { id: 207, subject: 'ELECTRICAL LAB', day: 'Tue', start: '13:30', end: '15:10', type: 'lab', room: 'EE Lab', teacher: 'Er. Ankul Tiwari', batch: 'F1', reminder: '5', notes: 'EE Lab (Batch F1)' },
    { id: 208, subject: 'MATH-I-T', day: 'Tue', start: '13:30', end: '14:20', type: 'practical', room: '211', teacher: 'Dr. Sweety Gupta', batch: 'F2', reminder: '5', notes: 'Math Tutorial (Batch F2)' },
    { id: 209, subject: 'PHY-T', day: 'Tue', start: '14:20', end: '15:10', type: 'practical', room: '211', teacher: 'Ms. Anjali', batch: 'F2', reminder: '5', notes: 'Physics Tutorial (Batch F2)' },
    { id: 210, subject: 'EE', day: 'Tue', start: '15:10', end: '16:00', type: 'lecture', room: '211', teacher: 'Er. Ankul Tiwari', batch: 'both', reminder: '5', notes: 'Electrical Engineering' },
    { id: 211, subject: 'PC', day: 'Tue', start: '16:00', end: '16:50', type: 'lecture', room: '211', teacher: 'Ms. Khushbu Singh', batch: 'both', reminder: '5', notes: 'Professional Communication' },

    // WEDNESDAY
    { id: 301, subject: 'PC', day: 'Wed', start: '09:10', end: '10:00', type: 'lecture', room: '211', teacher: 'Ms. Khushbu Singh', batch: 'both', reminder: '5', notes: 'Professional Communication' },
    { id: 302, subject: 'PHY-T', day: 'Wed', start: '10:00', end: '10:50', type: 'practical', room: '211', teacher: 'Ms. Anjali', batch: 'F1', reminder: '5', notes: 'Physics Tutorial (Batch F1)' },
    { id: 303, subject: 'DESIGN LAB', day: 'Wed', start: '10:00', end: '10:50', type: 'lab', room: 'Design Lab', teacher: 'Dr. Bablu Kumar Jha', batch: 'F2', reminder: '5', notes: 'Design Lab (Batch F2)' },
    { id: 304, subject: 'Morning Break', day: 'Wed', start: '10:50', end: '11:00', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Break' },
    { id: 305, subject: 'PC LAB', day: 'Wed', start: '11:00', end: '12:40', type: 'lab', room: 'Language Lab', teacher: 'Miss. Raavi Bhargav', batch: 'F1', reminder: '5', notes: 'Language Lab (Batch F1)' },
    { id: 306, subject: 'DESIGN LAB', day: 'Wed', start: '11:00', end: '12:40', type: 'lab', room: 'Design Lab', teacher: 'Dr. Bablu Kumar Jha', batch: 'F2', reminder: '5', notes: 'Design Lab (Batch F2)' },
    { id: 307, subject: 'Lunch Break', day: 'Wed', start: '12:40', end: '13:30', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Lunch' },
    { id: 308, subject: 'EE', day: 'Wed', start: '13:30', end: '14:20', type: 'lecture', room: '211', teacher: 'Er. Ankul Tiwari', batch: 'both', reminder: '5', notes: 'Electrical Engineering' },
    { id: 309, subject: 'MATH-I', day: 'Wed', start: '14:20', end: '15:10', type: 'lecture', room: '211', teacher: 'Dr. Sweety Gupta', batch: 'both', reminder: '5', notes: 'Calculus & Linear Algebra' },
    { id: 310, subject: 'PL', day: 'Wed', start: '15:10', end: '16:00', type: 'lecture', room: '211', teacher: 'Er. Mohit Singh', batch: 'both', reminder: '5', notes: 'Programming Language' },
    { id: 311, subject: 'AI', day: 'Wed', start: '16:00', end: '16:50', type: 'lecture', room: '211', teacher: 'Er. Aayush Kumar Jha', batch: 'both', reminder: '5', notes: 'Intro to AI & Prompt Eng' },

    // THURSDAY
    { id: 401, subject: 'MATH-I', day: 'Thu', start: '09:10', end: '10:00', type: 'lecture', room: '211', teacher: 'Dr. Sweety Gupta', batch: 'both', reminder: '5', notes: 'Calculus & Linear Algebra' },
    { id: 402, subject: 'PC', day: 'Thu', start: '10:00', end: '10:50', type: 'lecture', room: '211', teacher: 'Ms. Khushbu Singh', batch: 'both', reminder: '5', notes: 'Professional Communication' },
    { id: 403, subject: 'Morning Break', day: 'Thu', start: '10:50', end: '11:00', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Break' },
    { id: 404, subject: 'PL-T', day: 'Thu', start: '11:00', end: '11:50', type: 'practical', room: '211', teacher: 'Er. Mohit Singh', batch: 'F1', reminder: '5', notes: 'PL Tutorial (Batch F1)' },
    { id: 405, subject: 'LIB', day: 'Thu', start: '11:50', end: '12:40', type: 'self', room: 'Library', teacher: '', batch: 'F1', reminder: '5', notes: 'Library (Batch F1)' },
    { id: 406, subject: 'ELECTRICAL LAB', day: 'Thu', start: '11:00', end: '12:40', type: 'lab', room: 'EE Lab', teacher: 'Er. Ankul Tiwari', batch: 'F2', reminder: '5', notes: 'EE Lab (Batch F2)' },
    { id: 407, subject: 'Lunch Break', day: 'Thu', start: '12:40', end: '13:30', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Lunch' },
    { id: 408, subject: 'PHYSICS LAB', day: 'Thu', start: '13:30', end: '15:10', type: 'lab', room: 'Physics Lab', teacher: 'Ms. Anjali', batch: 'F1', reminder: '5', notes: 'Physics Lab (Batch F1)' },
    { id: 409, subject: 'EE-T', day: 'Thu', start: '13:30', end: '14:20', type: 'practical', room: '211', teacher: 'Er. Ankul Tiwari', batch: 'F2', reminder: '5', notes: 'EE Tutorial (Batch F2)' },
    { id: 410, subject: 'LIB', day: 'Thu', start: '14:20', end: '15:10', type: 'self', room: 'Library', teacher: '', batch: 'F2', reminder: '5', notes: 'Library (Batch F2)' },
    { id: 411, subject: 'PHYSICS', day: 'Thu', start: '15:10', end: '16:00', type: 'lecture', room: '211', teacher: 'Ms. Anjali', batch: 'both', reminder: '5', notes: 'Quantum Physics' },
    { id: 412, subject: 'AI', day: 'Thu', start: '16:00', end: '16:50', type: 'lecture', room: '211', teacher: 'Er. Aayush Kumar Jha', batch: 'both', reminder: '5', notes: 'Intro to AI & Prompt Eng' },

    // FRIDAY
    { id: 501, subject: 'PL', day: 'Fri', start: '09:10', end: '10:00', type: 'lecture', room: '211', teacher: 'Er. Mohit Singh', batch: 'both', reminder: '5', notes: 'Programming Language' },
    { id: 502, subject: 'EE', day: 'Fri', start: '10:00', end: '10:50', type: 'lecture', room: '211', teacher: 'Er. Ankul Tiwari', batch: 'both', reminder: '5', notes: 'Electrical Engineering' },
    { id: 503, subject: 'Morning Break', day: 'Fri', start: '10:50', end: '11:00', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Break' },
    { id: 504, subject: 'MATH-I', day: 'Fri', start: '11:00', end: '11:50', type: 'lecture', room: '211', teacher: 'Dr. Sweety Gupta', batch: 'both', reminder: '5', notes: 'Calculus & Linear Algebra' },
    { id: 505, subject: 'AI', day: 'Fri', start: '11:50', end: '12:40', type: 'lecture', room: '211', teacher: 'Er. Aayush Kumar Jha', batch: 'both', reminder: '5', notes: 'Intro to AI & Prompt Eng' },
    { id: 506, subject: 'Lunch Break', day: 'Fri', start: '12:40', end: '13:30', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Lunch' },
    { id: 507, subject: 'EE-T', day: 'Fri', start: '13:30', end: '14:20', type: 'practical', room: '211', teacher: 'Er. Ankul Tiwari', batch: 'F1', reminder: '5', notes: 'EE Tutorial (Batch F1)' },
    { id: 508, subject: 'MATH-I-T', day: 'Fri', start: '14:20', end: '15:10', type: 'practical', room: '211', teacher: 'Dr. Sweety Gupta', batch: 'F1', reminder: '5', notes: 'Math Tutorial (Batch F1)' },
    { id: 509, subject: 'PHYSICS LAB', day: 'Fri', start: '13:30', end: '15:10', type: 'lab', room: 'Physics Lab', teacher: 'Ms. Anjali', batch: 'F2', reminder: '5', notes: 'Physics Lab (Batch F2)' },
    { id: 510, subject: 'PHYSICS', day: 'Fri', start: '15:10', end: '16:00', type: 'lecture', room: '211', teacher: 'Ms. Anjali', batch: 'both', reminder: '5', notes: 'Quantum Physics' },
    { id: 511, subject: 'MATH-I', day: 'Fri', start: '16:00', end: '16:50', type: 'lecture', room: '211', teacher: 'Dr. Sweety Gupta', batch: 'both', reminder: '5', notes: 'Calculus & Linear Algebra' },

    // SATURDAY
    { id: 601, subject: 'MATH-I', day: 'Sat', start: '09:10', end: '10:00', type: 'lecture', room: '211', teacher: 'Dr. Sweety Gupta', batch: 'both', reminder: '5', notes: 'Calculus & Linear Algebra' },
    { id: 602, subject: 'PC', day: 'Sat', start: '10:00', end: '10:50', type: 'lecture', room: '211', teacher: 'Ms. Khushbu Singh', batch: 'both', reminder: '5', notes: 'Professional Communication' },
    { id: 603, subject: 'Morning Break', day: 'Sat', start: '10:50', end: '11:00', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Break' },
    { id: 604, subject: 'PL', day: 'Sat', start: '11:00', end: '11:50', type: 'lecture', room: '211', teacher: 'Er. Mohit Singh', batch: 'both', reminder: '5', notes: 'Programming Language' },
    { id: 605, subject: 'EE', day: 'Sat', start: '11:50', end: '12:40', type: 'lecture', room: '211', teacher: 'Er. Ankul Tiwari', batch: 'both', reminder: '5', notes: 'Electrical Engineering' },
    { id: 606, subject: 'Lunch Break', day: 'Sat', start: '12:40', end: '13:30', type: 'free', room: '', teacher: '', batch: 'both', reminder: 'none', notes: 'Lunch' },
    { id: 607, subject: 'PHYSICS', day: 'Sat', start: '13:30', end: '14:20', type: 'lecture', room: '211', teacher: 'Ms. Anjali', batch: 'both', reminder: '5', notes: 'Quantum Physics' },
    { id: 608, subject: 'AI', day: 'Sat', start: '14:20', end: '15:10', type: 'lecture', room: '211', teacher: 'Er. Aayush Kumar Jha', batch: 'both', reminder: '5', notes: 'Intro to AI & Prompt Eng' }
  ];

  var classes, slots, notifyOn, filterDay, filterBatch, editId, firedReminders;

  function init() {
    classes = [];
    slots = [];
    notifyOn = false;
    filterDay = 'all';
    filterBatch = 'all';
    editId = null;
    firedReminders = {};

    load();
    render();
    wireEvents();
    setInterval(tickReminders, 15000);
  }

  // --- Storage ---
  function load() {
    try {
      var v = localStorage.getItem('cs_version');
      if (v !== DATA_VERSION) {
        // First load or updated to G L Bajaj official timetable!
        classes = JSON.parse(JSON.stringify(DEFAULT_CLASSES));
        slots = JSON.parse(JSON.stringify(DEFAULT_SLOTS));
        localStorage.setItem('cs_version', DATA_VERSION);
        save();
        return;
      }
      var c = localStorage.getItem('cs_classes');
      classes = c ? JSON.parse(c) : JSON.parse(JSON.stringify(DEFAULT_CLASSES));
      var s = localStorage.getItem('cs_slots');
      slots = s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT_SLOTS));
      notifyOn = localStorage.getItem('cs_notify') === '1';
    } catch (e) {
      classes = JSON.parse(JSON.stringify(DEFAULT_CLASSES));
      slots = JSON.parse(JSON.stringify(DEFAULT_SLOTS));
    }
  }

  function save() {
    try {
      localStorage.setItem('cs_classes', JSON.stringify(classes));
      localStorage.setItem('cs_slots', JSON.stringify(slots));
      localStorage.setItem('cs_notify', notifyOn ? '1' : '0');
    } catch (e) {}
  }

  // --- Helpers ---
  function $(id) { return document.getElementById(id); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
  function toast(msg) {
    var t = $('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 2500);
  }

  function parseTime(t) {
    if (!t) return 0;
    var p = t.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function getTodayDateKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function loadCompleted() {
    try {
      var key = 'cs_done_' + getTodayDateKey();
      var val = localStorage.getItem(key);
      return val ? JSON.parse(val) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCompleted(data) {
    try {
      var key = 'cs_done_' + getTodayDateKey();
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  }

  function isClassCompleted(id) {
    var data = loadCompleted();
    return !!data[id];
  }

  function toggleComplete(id) {
    var data = loadCompleted();
    if (data[id]) {
      delete data[id];
      toast('Marked incomplete');
    } else {
      data[id] = true;
      toast('✓ Marked complete!');
    }
    saveCompleted(data);
    render();
  }

  function setClassCompleted(id, status) {
    var data = loadCompleted();
    if (status) {
      data[id] = true;
    } else {
      delete data[id];
    }
    saveCompleted(data);
  }

  // --- Render ---
  function render() {
    renderTable();
    renderBanner();

    var el = $('classCount');
    if (el) {
      var now = new Date();
      var di = (now.getDay() + 6) % 7;
      var today = di < DAYS.length ? DAYS[di] : null;

      var todayClasses = today ? classes.filter(function (c) {
        if (c.day !== today || c.type === 'free') return false;
        if (filterBatch !== 'all' && c.batch && c.batch !== 'both' && c.batch !== filterBatch) return false;
        return true;
      }) : [];

      var doneTodayCount = todayClasses.filter(function (c) { return isClassCompleted(c.id); }).length;

      if (todayClasses.length > 0) {
        el.innerHTML = '<strong>' + doneTodayCount + '/' + todayClasses.length + ' Done Today</strong>';
      } else {
        var activeCount = classes.filter(function (c) {
          if (c.type === 'free') return false;
          if (filterBatch !== 'all' && c.batch && c.batch !== 'both' && c.batch !== filterBatch) return false;
          return true;
        }).length;
        el.textContent = activeCount + ' lectures scheduled';
      }
    }

    var ns = $('notifyStatus');
    if (ns) {
      ns.textContent = notifyOn ? 'On' : 'Off';
      ns.style.color = notifyOn ? '#10b981' : '';
    }
  }

  function findClassesForSlot(day, slot) {
    var result = [];
    var slotStart = slot.start;
    var slotEnd = slot.end;

    for (var i = 0; i < classes.length; i++) {
      var c = classes[i];
      if (c.day !== day) continue;

      // Filter by Batch if chosen
      if (filterBatch !== 'all' && c.batch && c.batch !== 'both' && c.batch !== filterBatch) {
        continue;
      }

      // Overlap condition: start < slotEnd && end > slotStart
      if (c.start < slotEnd && c.end > slotStart) {
        result.push(c);
      }
    }
    return result;
  }

  function renderTable() {
    var tbody = $('timetableBody');
    var hdr = $('timetableHeader');
    if (!tbody || !hdr) return;

    var cols = filterDay === 'all' ? DAYS : [filterDay];

    hdr.innerHTML = '<th class="time-col">Time</th>' + cols.map(function (d) { return '<th>' + d + '</th>'; }).join('');

    slots.sort(function (a, b) { return a.start < b.start ? -1 : 1; });

    var html = '';
    for (var i = 0; i < slots.length; i++) {
      var sl = slots[i];
      var isBreakSlot = sl.label && (sl.label.toLowerCase().indexOf('break') >= 0 || sl.label.toLowerCase().indexOf('lunch') >= 0);

      html += '<tr><td class="time-cell"><strong>' + sl.start + ' – ' + sl.end + '</strong>';
      if (sl.label) {
        html += '<div style="font-size:0.7rem;color:#64748b;font-weight:normal;margin-top:2px;">' + esc(sl.label) + '</div>';
      }
      html += '</td>';

      for (var j = 0; j < cols.length; j++) {
        var day = cols[j];
        var matchingClasses = findClassesForSlot(day, sl);

        if (matchingClasses.length > 0) {
          // If only 1 class and it's a break
          if (matchingClasses.length === 1 && matchingClasses[0].type === 'free') {
            var brk = matchingClasses[0];
            html += '<td><div class="break-cell" data-id="' + brk.id + '">'
              + (brk.subject.indexOf('Lunch') >= 0 ? '🍱 ' : '☕ ') + esc(brk.subject) + '</div></td>';
          } else {
            html += '<td><div class="cell-stack">';
            for (var m = 0; m < matchingClasses.length; m++) {
              var cls = matchingClasses[m];
              var batchBadge = cls.batch && cls.batch !== 'both' ? '<span class="batch-tag">' + cls.batch + '</span>' : '';
              var isDone = isClassCompleted(cls.id);
              var doneClass = isDone ? ' is-completed' : '';

              html += '<div class="slot-card type-' + cls.type + doneClass + '" data-id="' + cls.id + '">'
                + '<div class="card-header-row">'
                + '  <div>'
                + '    <div class="card-title">' + esc(cls.subject) + batchBadge + '</div>'
                + '    <div class="card-time">⏰ ' + cls.start + ' - ' + cls.end + '</div>'
                + '  </div>'
                + '  <button type="button" class="btn-check" data-id="' + cls.id + '" title="' + (isDone ? 'Mark as incomplete' : 'Mark as completed') + '">' + (isDone ? '✓' : '○') + '</button>'
                + '</div>'
                + '<div class="card-footer">'
                + '  <span class="card-badge' + (isDone ? ' badge-done' : '') + '">' + (isDone ? '✓ Completed' : (TYPE_LABELS[cls.type] || cls.type)) + '</span>'
                + '  <span>' + (cls.room ? '📍 ' + esc(cls.room) : (cls.teacher ? '👤 ' + esc(cls.teacher.split(' ')[0]) : '')) + '</span>'
                + '</div>'
                + '</div>';
            }
            html += '</div></td>';
          }
        } else {
          // Empty slot bracket
          if (isBreakSlot) {
            html += '<td><div class="break-cell">' + esc(sl.label) + '</div></td>';
          } else {
            html += '<td><div class="slot-empty" data-day="' + day + '" data-start="' + sl.start + '" data-end="' + sl.end + '"><span>+ Fill slot</span></div></td>';
          }
        }
      }
      html += '</tr>';
    }
    tbody.innerHTML = html;

    // Attach click handlers for check buttons
    var checkBtns = tbody.querySelectorAll('.btn-check');
    for (var cIdx = 0; cIdx < checkBtns.length; cIdx++) {
      checkBtns[cIdx].addEventListener('click', function (e) {
        e.stopPropagation();
        var id = parseInt(this.getAttribute('data-id'), 10);
        toggleComplete(id);
      });
    }

    var cards = tbody.querySelectorAll('.slot-card, .break-cell[data-id]');
    for (var k = 0; k < cards.length; k++) {
      cards[k].addEventListener('click', onCardClick);
    }
    var empties = tbody.querySelectorAll('.slot-empty');
    for (var k = 0; k < empties.length; k++) {
      empties[k].addEventListener('click', onEmptyClick);
    }
  }

  function onCardClick() {
    var idAttr = this.getAttribute('data-id');
    if (!idAttr) return;
    var id = parseInt(idAttr, 10);
    openEdit(id);
  }

  function onEmptyClick() {
    var day = this.getAttribute('data-day');
    var start = this.getAttribute('data-start');
    var end = this.getAttribute('data-end');
    openAdd(day, start, end);
  }

  // --- Banner ---
  function renderBanner() {
    var banner = $('reminderBanner');
    var text = $('reminderBannerText');
    if (!banner || !text) return;

    var now = new Date();
    var di = (now.getDay() + 6) % 7; // Mon=0, Sun=6
    if (di >= DAYS.length) {
      banner.classList.add('hidden');
      return;
    }
    var today = DAYS[di];
    var mins = now.getHours() * 60 + now.getMinutes();

    var next = null;
    for (var i = 0; i < classes.length; i++) {
      var c = classes[i];
      if (c.day !== today || c.type === 'free') continue;
      if (filterBatch !== 'all' && c.batch && c.batch !== 'both' && c.batch !== filterBatch) continue;
      if (isClassCompleted(c.id)) continue; // Skip already completed classes

      var p = parseTime(c.start);
      if (p >= mins && (!next || p < parseTime(next.start))) next = c;
    }

    if (next) {
      var diff = parseTime(next.start) - mins;
      var when = diff === 0 ? 'Starting now!' : 'in ' + diff + ' min (' + next.start + ')';
      text.innerHTML = '<strong>Next Lecture:</strong> ' + esc(next.subject)
        + (next.batch && next.batch !== 'both' ? ' [' + next.batch + ']' : '')
        + ' ' + when + (next.room ? ' · Room ' + esc(next.room) : '')
        + (next.teacher ? ' · ' + esc(next.teacher) : '');
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  // --- Modal: Add ---
  function openAdd(day, start, end) {
    editId = null;
    $('modalTitle').textContent = 'Add Class / Lab';
    $('classForm').reset();
    $('fDay').value = day || 'Mon';
    $('fStart').value = start || '09:10';
    $('fEnd').value = end || '10:00';
    $('fType').value = 'lecture';
    $('fBatch').value = filterBatch !== 'all' ? filterBatch : 'both';
    $('fReminder').value = '5';
    $('fRoom').value = '211';
    $('fCompleted').checked = false;
    $('deleteBtn').classList.add('hidden');
    $('modal').classList.remove('hidden');
    $('fSubject').focus();
  }

  // --- Modal: Edit ---
  function openEdit(id) {
    var cls = null;
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].id === id) { cls = classes[i]; break; }
    }
    if (!cls) return;

    editId = id;
    $('modalTitle').textContent = 'Edit Timing & Class Details';
    $('fSubject').value = cls.subject || '';
    $('fDay').value = cls.day || 'Mon';
    $('fBatch').value = cls.batch || 'both';
    $('fStart').value = cls.start || '';
    $('fEnd').value = cls.end || '';
    $('fType').value = cls.type || 'lecture';
    $('fRoom').value = cls.room || '';
    $('fTeacher').value = cls.teacher || '';
    $('fNotes').value = cls.notes || '';
    $('fReminder').value = cls.reminder || 'none';
    $('fCompleted').checked = isClassCompleted(cls.id);
    $('deleteBtn').classList.remove('hidden');
    $('modal').classList.remove('hidden');
  }

  function closeModal() {
    $('modal').classList.add('hidden');
    editId = null;
  }

  // --- Form Submit ---
  function onSubmit(e) {
    e.preventDefault();
    var subject = $('fSubject').value.trim();
    var day = $('fDay').value;
    var batch = $('fBatch').value;
    var start = $('fStart').value;
    var end = $('fEnd').value;
    var type = $('fType').value;
    var room = $('fRoom').value.trim();
    var teacher = $('fTeacher').value.trim();
    var notes = $('fNotes').value.trim();
    var reminder = $('fReminder').value;
    var isDone = $('fCompleted').checked;

    if (!subject) { toast('Please enter a subject name'); return; }
    if (!start || !end) { toast('Please set start and end times'); return; }
    if (start >= end) { toast('Start time must be before end time'); return; }

    if (editId !== null) {
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].id === editId) {
          classes[i] = {
            id: editId,
            subject: subject,
            day: day,
            batch: batch,
            start: start,
            end: end,
            type: type,
            room: room,
            teacher: teacher,
            notes: notes,
            reminder: reminder
          };
          break;
        }
      }
      setClassCompleted(editId, isDone);
      toast('Class updated');
    } else {
      var newId = Date.now();
      classes.push({
        id: newId,
        subject: subject,
        day: day,
        batch: batch,
        start: start,
        end: end,
        type: type,
        room: room,
        teacher: teacher,
        notes: notes,
        reminder: reminder
      });
      setClassCompleted(newId, isDone);
      toast('Class added');
    }
    closeModal();
    save();
    render();
  }

  function onDelete() {
    if (editId === null) return;
    if (!confirm('Are you sure you want to delete this class?')) return;
    classes = classes.filter(function (c) { return c.id !== editId; });
    closeModal();
    save();
    render();
    toast('Class deleted');
  }

  // --- Slots Modal ---
  function openSlots() {
    renderSlotsList();
    $('slotsModal').classList.remove('hidden');
  }

  function closeSlots() {
    $('slotsModal').classList.add('hidden');
  }

  function renderSlotsList() {
    var list = $('slotsList'); if (!list) return;
    var html = '';
    for (var i = 0; i < slots.length; i++) {
      var labelStr = slots[i].label ? ' (' + esc(slots[i].label) + ')' : '';
      html += '<div class="slot-item"><span>⏰ <strong>' + slots[i].start + ' – ' + slots[i].end + '</strong>' + labelStr + '</span>'
        + '<button type="button" class="slot-delete-btn" data-idx="' + i + '">&times;</button></div>';
    }
    list.innerHTML = html;

    var btns = list.querySelectorAll('.slot-delete-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        if (slots.length <= 1) { toast('Keep at least one slot'); return; }
        slots.splice(idx, 1);
        save(); render(); renderSlotsList();
      });
    }
  }

  function onNewSlot(e) {
    e.preventDefault();
    var s = $('newSlotStart').value, en = $('newSlotEnd').value;
    if (!s || !en) return;
    if (s >= en) { toast('Start must be before end'); return; }
    slots.push({ start: s, end: en, label: 'Custom' });
    save(); render(); renderSlotsList();
    e.target.reset();
    toast('Slot added');
  }

  function resetCollegeSchedule() {
    if (!confirm('Reset schedule to original G L Bajaj Section F timetable?')) return;
    classes = JSON.parse(JSON.stringify(DEFAULT_CLASSES));
    slots = JSON.parse(JSON.stringify(DEFAULT_SLOTS));
    save();
    render();
    toast('Official college timetable reloaded!');
  }

  function resetSlots() {
    if (!confirm('Reset time slots to official college timings?')) return;
    slots = JSON.parse(JSON.stringify(DEFAULT_SLOTS));
    save(); render(); renderSlotsList();
    toast('Slots reset to college timings');
  }

  // --- Reminders & Audio ---
  function playBeep() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var ctx = new AudioCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  }

  function tickReminders() {
    renderBanner();
    if (!notifyOn) return;
    var now = new Date();
    var di = (now.getDay() + 6) % 7;
    if (di >= DAYS.length) return;
    var today = DAYS[di];
    var mins = now.getHours() * 60 + now.getMinutes();
    var dateKey = now.toDateString();

    for (var i = 0; i < classes.length; i++) {
      var c = classes[i];
      if (c.day !== today || !c.reminder || c.reminder === 'none' || c.type === 'free') continue;
      if (filterBatch !== 'all' && c.batch && c.batch !== 'both' && c.batch !== filterBatch) continue;

      var cStart = parseTime(c.start);
      var offset = parseInt(c.reminder, 10);
      var alertAt = cStart - offset;
      var key = dateKey + '_' + c.id + '_' + offset;

      if (mins === alertAt && !firedReminders[key]) {
        firedReminders[key] = true;
        fireReminder(c, offset);
      }
    }
  }

  function fireReminder(c, minsBefore) {
    playBeep();
    var when = minsBefore === 0 ? 'starts now!' : 'starts in ' + minsBefore + ' min!';
    var msg = '📚 ' + c.subject + (c.batch && c.batch !== 'both' ? ' [' + c.batch + ']' : '') + ' ' + when + (c.room ? ' (Room ' + c.room + ')' : '');
    toast(msg);
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('College Lecture Reminder', {
          body: msg,
          icon: 'favicon.ico'
        });
      } catch (e) {}
    }
  }

  function toggleNotify() {
    if (!('Notification' in window)) { toast('Notifications not supported'); return; }
    if (!notifyOn) {
      Notification.requestPermission().then(function (p) {
        if (p === 'granted') {
          notifyOn = true;
          save();
          render();
          toast('🔔 Reminders & notifications enabled!');
          playBeep();
        } else {
          toast('Notification permission was denied');
        }
      });
    } else {
      notifyOn = false;
      save();
      render();
      toast('Reminders muted');
    }
  }

  // --- Wire Events ---
  function wireEvents() {
    $('addBtn').addEventListener('click', function () { openAdd('Mon', '09:10', '10:00'); });
    $('cancelBtn').addEventListener('click', closeModal);
    $('closeModalBtn').addEventListener('click', closeModal);
    $('classForm').addEventListener('submit', onSubmit);
    $('deleteBtn').addEventListener('click', onDelete);

    $('slotsBtn').addEventListener('click', openSlots);
    $('closeSlotsModalBtn').addEventListener('click', closeSlots);
    $('doneSlotsBtn').addEventListener('click', closeSlots);
    $('newSlotForm').addEventListener('submit', onNewSlot);
    $('resetSlotsBtn').addEventListener('click', resetSlots);
    $('resetScheduleBtn').addEventListener('click', resetCollegeSchedule);

    $('notifyBtn').addEventListener('click', toggleNotify);

    // Day tabs
    var dayTabs = document.querySelectorAll('.day-tab');
    for (var i = 0; i < dayTabs.length; i++) {
      dayTabs[i].addEventListener('click', function () {
        for (var j = 0; j < dayTabs.length; j++) dayTabs[j].classList.remove('active');
        this.classList.add('active');
        filterDay = this.getAttribute('data-day');
        render();
      });
    }

    // Batch tabs
    var batchTabs = document.querySelectorAll('.batch-tab');
    for (var i = 0; i < batchTabs.length; i++) {
      batchTabs[i].addEventListener('click', function () {
        for (var j = 0; j < batchTabs.length; j++) batchTabs[j].classList.remove('active');
        this.classList.add('active');
        filterBatch = this.getAttribute('data-batch');
        render();
      });
    }

    $('modal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });
    $('slotsModal').addEventListener('click', function (e) { if (e.target === this) closeSlots(); });
  }

  // --- Boot ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

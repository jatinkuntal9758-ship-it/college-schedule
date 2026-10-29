// College Schedule & Lecture Reminders
(function () {
  'use strict';

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const typeLabels = {
    lecture: 'Lecture',
    lab: 'Lab',
    practical: 'Practical',
    self: 'Self Study',
    free: 'Free'
  };

  const defaultSlots = [
    { start: '08:00', end: '09:30' },
    { start: '09:30', end: '11:00' },
    { start: '11:00', end: '12:30' },
    { start: '12:30', end: '14:00' },
    { start: '14:00', end: '15:30' },
    { start: '15:30', end: '17:00' },
  ];

  const defaultClasses = [
    { id: 1, subject: 'Data Structures', day: 'Mon', start: '09:30', end: '11:00', type: 'lecture', room: '304', teacher: 'Dr. Sharma', notes: 'Trees & Graphs', reminder: '10' },
    { id: 2, subject: 'Database Lab', day: 'Wed', start: '12:30', end: '14:00', type: 'lab', room: 'Lab 2', teacher: 'Prof. Verma', notes: 'SQL Triggers', reminder: '10' },
    { id: 3, subject: 'Math Practical', day: 'Fri', start: '14:00', end: '15:30', type: 'practical', room: '310', teacher: 'Dr. Rao', notes: 'Calculus assignment', reminder: '5' },
  ];

  // State
  let classes = [];
  let slots = [];
  let notificationsEnabled = false;
  let activeFilterDay = 'all';
  let editClassId = null;
  const firedReminders = new Set();

  // Load from LocalStorage
  function loadData() {
    try {
      const storedClasses = localStorage.getItem('college_classes');
      classes = storedClasses ? JSON.parse(storedClasses) : defaultClasses;

      const storedSlots = localStorage.getItem('college_slots');
      slots = storedSlots ? JSON.parse(storedSlots) : defaultSlots;

      const storedNotify = localStorage.getItem('college_notifications');
      notificationsEnabled = storedNotify === 'true';
    } catch (e) {
      console.error('Error reading localStorage', e);
      classes = defaultClasses;
      slots = defaultSlots;
    }
  }

  function saveData() {
    try {
      localStorage.setItem('college_classes', JSON.stringify(classes));
      localStorage.setItem('college_slots', JSON.stringify(slots));
      localStorage.setItem('college_notifications', notificationsEnabled.toString());
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
    updateSubjectDatalist();
    renderTimetable();
    updateNextClassBanner();
  }

  // Toast
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Chime sound via Web Audio API
  function playAlertSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (err) {
      console.warn('Audio chime blocked or unsupported', err);
    }
  }

  // Populate Subject Autocomplete
  function updateSubjectDatalist() {
    const datalist = document.getElementById('subjectDatalist');
    if (!datalist) return;
    const subjects = Array.from(new Set(classes.map(c => c.subject).filter(Boolean)));
    datalist.innerHTML = subjects.map(s => `<option value="${escapeHtml(s)}"></option>`).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Render Timetable
  function renderTimetable() {
    const tbody = document.getElementById('timetableBody');
    const headerRow = document.getElementById('timetableHeader');
    if (!tbody || !headerRow) return;

    // Filter day columns if selected
    const colsToShow = activeFilterDay === 'all' ? daysOfWeek : [activeFilterDay];

    // Update Header
    let headerHtml = '<th class="time-col">Time Bracket</th>';
    colsToShow.forEach(day => {
      headerHtml += `<th>${day}</th>`;
    });
    headerRow.innerHTML = headerHtml;

    // Sort slots chronologically
    slots.sort((a, b) => a.start.localeCompare(b.start));

    tbody.innerHTML = '';
    slots.forEach((slot, slotIndex) => {
      const tr = document.createElement('tr');

      // Time Column
      const tdTime = document.createElement('td');
      tdTime.className = 'time-cell';
      tdTime.innerHTML = `<strong>${slot.start} – ${slot.end}</strong>`;
      tr.appendChild(tdTime);

      // Day Columns
      colsToShow.forEach(day => {
        const td = document.createElement('td');

        // Find class that falls within or starts at this slot
        const found = classes.find(c => {
          if (c.day !== day) return false;
          // Exact match or overlapping start
          return c.start === slot.start || (c.start >= slot.start && c.start < slot.end);
        });

        if (found) {
          td.innerHTML = `
            <div class="slot-card type-${found.type}" data-id="${found.id}">
              <div>
                <div class="card-title">${escapeHtml(found.subject)}</div>
                <div class="card-time">⏰ ${found.start} - ${found.end}</div>
              </div>
              <div class="card-footer">
                <span class="card-badge">${typeLabels[found.type] || found.type}</span>
                <span>${found.room ? '📍 ' + escapeHtml(found.room) : ''}</span>
              </div>
            </div>
          `;
          td.querySelector('.slot-card').addEventListener('click', () => openEditModal(found.id));
        } else {
          // Empty slot bracket — click to quickly fill in!
          td.innerHTML = `
            <div class="slot-empty" title="Click to fill in this slot">
              <span>+ Fill slot</span>
            </div>
          `;
          td.querySelector('.slot-empty').addEventListener('click', () => {
            openAddModal(day, slot.start, slot.end);
          });
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    // Update class counter
    const countEl = document.getElementById('classCount');
    if (countEl) {
      countEl.textContent = `${classes.length} class${classes.length === 1 ? '' : 'es'} scheduled`;
    }
  }

  // Open Modal: Add Class
  function openAddModal(day = 'Mon', start = '09:00', end = '10:30') {
    editClassId = null;
    document.getElementById('modalTitle').textContent = 'Add Lecture / Class';
    document.getElementById('fId').value = '';
    document.getElementById('classForm').reset();

    document.getElementById('fDay').value = day;
    document.getElementById('fStart').value = start;
    document.getElementById('fEnd').value = end;
    document.getElementById('fReminder').value = '10';

    document.getElementById('deleteBtn').classList.add('hidden');
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('fSubject').focus();
  }

  // Open Modal: Edit Class
  function openEditModal(id) {
    const cls = classes.find(c => c.id == id);
    if (!cls) return;

    editClassId = cls.id;
    document.getElementById('modalTitle').textContent = 'Edit Lecture Timing & Details';
    document.getElementById('fId').value = cls.id;
    document.getElementById('fSubject').value = cls.subject || '';
    document.getElementById('fDay').value = cls.day || 'Mon';
    document.getElementById('fStart').value = cls.start || '';
    document.getElementById('fEnd').value = cls.end || '';
    document.getElementById('fType').value = cls.type || 'lecture';
    document.getElementById('fRoom').value = cls.room || '';
    document.getElementById('fTeacher').value = cls.teacher || '';
    document.getElementById('fNotes').value = cls.notes || '';
    document.getElementById('fReminder').value = cls.reminder !== undefined ? cls.reminder : '10';

    document.getElementById('deleteBtn').classList.remove('hidden');
    document.getElementById('modal').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    editClassId = null;
  }

  // Handle Form Submit
  function handleClassFormSubmit(e) {
    e.preventDefault();

    const subject = document.getElementById('fSubject').value.trim();
    const day = document.getElementById('fDay').value;
    const start = document.getElementById('fStart').value;
    const end = document.getElementById('fEnd').value;
    const type = document.getElementById('fType').value;
    const room = document.getElementById('fRoom').value.trim();
    const teacher = document.getElementById('fTeacher').value.trim();
    const notes = document.getElementById('fNotes').value.trim();
    const reminder = document.getElementById('fReminder').value;

    if (!subject || !start || !end) {
      showToast('Please fill in Subject and Start/End times');
      return;
    }

    if (start >= end) {
      showToast('Start time must be before end time');
      return;
    }

    if (editClassId) {
      const idx = classes.findIndex(c => c.id == editClassId);
      if (idx >= 0) {
        classes[idx] = { id: editClassId, subject, day, start, end, type, room, teacher, notes, reminder };
        showToast('Lecture updated successfully');
      }
    } else {
      const newClass = {
        id: Date.now(),
        subject,
        day,
        start,
        end,
        type,
        room,
        teacher,
        notes,
        reminder
      };
      classes.push(newClass);
      showToast('New lecture added');
    }

    closeModal();
    saveData();
  }

  // Delete Class
  function handleDeleteClass() {
    if (!editClassId) return;
    if (confirm('Are you sure you want to delete this lecture?')) {
      classes = classes.filter(c => c.id != editClassId);
      closeModal();
      saveData();
      showToast('Lecture deleted');
    }
  }

  // Time Slots / Brackets Management
  function openSlotsModal() {
    renderSlotsList();
    document.getElementById('slotsModal').classList.remove('hidden');
  }

  function closeSlotsModal() {
    document.getElementById('slotsModal').classList.add('hidden');
  }

  function renderSlotsList() {
    const list = document.getElementById('slotsList');
    if (!list) return;

    list.innerHTML = slots.map((s, idx) => `
      <div class="slot-item">
        <span>⏰ <strong>${s.start} – ${s.end}</strong></span>
        <button type="button" class="slot-delete-btn" data-index="${idx}" title="Delete slot">&times;</button>
      </div>
    `).join('');

    list.querySelectorAll('.slot-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        if (slots.length <= 1) {
          showToast('Keep at least one time bracket');
          return;
        }
        slots.splice(index, 1);
        saveData();
        renderSlotsList();
      });
    });
  }

  function handleNewSlotSubmit(e) {
    e.preventDefault();
    const start = document.getElementById('newSlotStart').value;
    const end = document.getElementById('newSlotEnd').value;

    if (!start || !end) return;
    if (start >= end) {
      showToast('Slot start must be before end');
      return;
    }

    slots.push({ start, end });
    saveData();
    renderSlotsList();
    e.target.reset();
    showToast('New bracket added');
  }

  function resetSlots() {
    if (confirm('Reset time brackets to default schedule?')) {
      slots = [...defaultSlots];
      saveData();
      renderSlotsList();
      showToast('Time brackets reset');
    }
  }

  // Up Next & Reminders Check
  function updateNextClassBanner() {
    const banner = document.getElementById('reminderBanner');
    const bannerText = document.getElementById('reminderBannerText');
    if (!banner || !bannerText) return;

    const now = new Date();
    const currentDayIndex = (now.getDay() + 6) % 7; // Mon = 0, Sun = 6
    const currentDay = daysOfWeek[currentDayIndex];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Classes for today
    const todaysClasses = classes
      .filter(c => c.day === currentDay)
      .map(c => {
        const [h, m] = c.start.split(':').map(Number);
        return { ...c, startMinutes: h * 60 + m };
      })
      .sort((a, b) => a.startMinutes - b.startMinutes);

    const upcoming = todaysClasses.find(c => c.startMinutes >= currentMinutes);

    if (upcoming) {
      const diff = upcoming.startMinutes - currentMinutes;
      const timeStr = diff === 0 ? 'Starting now!' : `in ${diff} min${diff === 1 ? '' : 's'} (${upcoming.start})`;
      bannerText.innerHTML = `<strong>Next Class:</strong> ${escapeHtml(upcoming.subject)} ${timeStr} ${upcoming.room ? '· ' + escapeHtml(upcoming.room) : ''}`;
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  // Periodic Reminder Engine
  function checkReminders() {
    updateNextClassBanner();

    const now = new Date();
    const currentDayIndex = (now.getDay() + 6) % 7;
    const currentDay = daysOfWeek[currentDayIndex];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    classes.forEach(c => {
      if (c.day !== currentDay || !c.reminder || c.reminder === 'none') return;

      const [h, m] = c.start.split(':').map(Number);
      const classStartMin = h * 60 + m;
      const alertOffset = parseInt(c.reminder, 10);
      const alertTimeMin = classStartMin - alertOffset;

      // Unique key for today's reminder
      const reminderKey = `${now.toDateString()}_${c.id}_${alertOffset}`;

      if (currentMinutes === alertTimeMin && !firedReminders.has(reminderKey)) {
        firedReminders.add(reminderKey);
        triggerReminderAlert(c, alertOffset);
      }
    });
  }

  function triggerReminderAlert(cls, minsBefore) {
    playAlertSound();

    const whenStr = minsBefore === 0 ? 'starts now!' : `starts in ${minsBefore} minutes!`;
    const msg = `📚 ${cls.subject} (${typeLabels[cls.type] || cls.type}) ${whenStr} ${cls.room ? 'at ' + cls.room : ''}`;

    showToast(msg);

    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('College Lecture Reminder', {
          body: msg,
          icon: 'favicon.ico'
        });
      } catch (err) {
        console.warn('Notification trigger error', err);
      }
    }
  }

  // Toggle Browser Notifications
  async function toggleNotifications() {
    const statusEl = document.getElementById('notifyStatus');
    if (!('Notification' in window)) {
      showToast('Notifications are not supported by this browser.');
      return;
    }

    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        notificationsEnabled = true;
        statusEl.textContent = 'On';
        statusEl.style.color = '#10b981';
        saveData();
        showToast('🔔 Reminders & notifications enabled!');
        playAlertSound();
      } else {
        showToast('Notification permission was denied.');
      }
    } else {
      notificationsEnabled = false;
      statusEl.textContent = 'Off';
      statusEl.style.color = 'inherit';
      saveData();
      showToast('Reminders muted.');
    }
  }

  // Setup Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateSubjectDatalist();
    renderTimetable();
    updateNextClassBanner();

    // Notification button status init
    const statusEl = document.getElementById('notifyStatus');
    if (statusEl) {
      if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
        statusEl.textContent = 'On';
        statusEl.style.color = '#10b981';
      } else {
        statusEl.textContent = 'Off';
      }
    }

    // Modal buttons
    document.getElementById('addBtn').addEventListener('click', () => openAddModal());
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('classForm').addEventListener('submit', handleClassFormSubmit);
    document.getElementById('deleteBtn').addEventListener('click', handleDeleteClass);

    // Time Slots Modal
    document.getElementById('slotsBtn').addEventListener('click', openSlotsModal);
    document.getElementById('closeSlotsModalBtn').addEventListener('click', closeSlotsModal);
    document.getElementById('doneSlotsBtn').addEventListener('click', closeSlotsModal);
    document.getElementById('newSlotForm').addEventListener('submit', handleNewSlotSubmit);
    document.getElementById('resetSlotsBtn').addEventListener('click', resetSlots);

    // Notifications toggle
    document.getElementById('notifyBtn').addEventListener('click', toggleNotifications);

    // Day tabs filtering
    document.querySelectorAll('.day-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        activeFilterDay = e.target.dataset.day;
        renderTimetable();
      });
    });

    // Close modals on backdrop click
    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') closeModal();
    });
    document.getElementById('slotsModal').addEventListener('click', (e) => {
      if (e.target.id === 'slotsModal') closeSlotsModal();
    });

    // Check reminders every 20 seconds
    setInterval(checkReminders, 20000);
  });
})();

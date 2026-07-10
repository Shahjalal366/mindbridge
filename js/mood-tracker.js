/* =========================================================
   Mood Tracker Page JavaScript
   Mood entries are saved per logged-in user.
   If no user is logged in, the history appears empty.
   ========================================================= */

const MOODS = {
  Amazing: { emoji: '😄', color: '#22c55e' },
  Good: { emoji: '🙂', color: '#3b82f6' },
  Okay: { emoji: '😐', color: '#f59e0b' },
  Low: { emoji: '😔', color: '#f97316' },
  Rough: { emoji: '😞', color: '#ef4444' }
};

let selectedMood = null;
let chartInstance = null;
const DAYS_TO_SHOW = 7;

const today = new Date().toISOString().split('T')[0];
document.getElementById('logDate').value = today;

const session = JSON.parse(localStorage.getItem("mb_session") || "null");

let key = null;

if (session) {
  key = "mb_moods_" + session.username;
}

document.getElementById("logCard").style.display = "block";
document.getElementById("chartCard").style.display = "block";
document.getElementById("historyCard").style.display = "block";

if (document.getElementById("guestBanner")) {
  document.getElementById("guestBanner").style.display = "none";
}

if (document.getElementById("loginPrompt")) {
  document.getElementById("loginPrompt").style.display = "none";
}

if (document.getElementById("userPill")) {
  document.getElementById("userPill").style.display = "none";
}

renderHistory();
renderChart();

function selectMood(btn) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  selectedMood = {
    mood: btn.dataset.mood,
    score: parseInt(btn.dataset.score)
  };
}

function saveEntry() {
  if (!session) {
    alert("Please log in first to save your mood history.");
    location.href = "login.html";
    return;
  }

  if (!selectedMood) {
    alert('Please select a mood first.');
    return;
  }

  const note = document.getElementById('noteInput').value.trim();
  const date = document.getElementById('logDate').value || today;
  const entries = JSON.parse(localStorage.getItem(key) || '[]');

  entries.unshift({
    id: Date.now(),
    date,
    mood: selectedMood.mood,
    score: selectedMood.score,
    note
  });

  localStorage.setItem(key, JSON.stringify(entries));

  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('noteInput').value = '';
  document.getElementById('logDate').value = today;
  selectedMood = null;

  const toast = document.getElementById('logToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);

  renderHistory();
  renderChart();
}

function deleteEntry(id) {
  if (!session) return;

  let entries = JSON.parse(localStorage.getItem(key) || '[]');

  entries = entries.filter(e => e.id !== id);

  localStorage.setItem(key, JSON.stringify(entries));

  renderHistory();
  renderChart();
}

function renderHistory() {
  const container = document.getElementById('logEntries');

  if (!session) {
    container.innerHTML = '<div class="empty-msg">No mood history yet. Please log in to save and view your mood entries.</div>';
    return;
  }

  const entries = JSON.parse(localStorage.getItem(key) || '[]');

  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-msg">No entries yet. Log your first mood above!</div>';
    return;
  }

  container.innerHTML = entries.map(e => {
    const d = new Date(e.date + 'T12:00:00');

    const dateStr = d.toLocaleDateString('en-MY', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    const m = MOODS[e.mood] || { emoji: '😐', color: '#6b7280' };

    return '<div class="log-entry"><div class="entry-emoji">' + m.emoji + '</div><div class="entry-body"><div class="entry-top"><span class="entry-mood">' + e.mood + '</span><span class="entry-date">' + dateStr + '</span></div>' + (e.note ? '<div class="entry-note">' + e.note + '</div>' : '') + '</div><button class="entry-delete" onclick="deleteEntry(' + e.id + ')" aria-label="Delete entry"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg></button></div>';
  }).join('');
}

function renderChart() {
  const days = [];

  for (let i = DAYS_TO_SHOW; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const labels = days.map(d => {
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short'
    });
  });

  let entries = [];

  if (session) {
    entries = JSON.parse(localStorage.getItem(key) || '[]');
  }

  const data = days.map(d => {
    const dayEntries = entries.filter(e => e.date === d);

    if (dayEntries.length === 0) return null;

    return Math.round(
      dayEntries.reduce((a, e) => a + e.score, 0) / dayEntries.length * 10
    ) / 10;
  });

  const ctx = document.getElementById('moodChart').getContext('2d');

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Mood Score',
        data,
        borderColor: '#0F4C81',
        backgroundColor: 'rgba(15,76,129,0.08)',
        pointBackgroundColor: data.map(v =>
          v === null ? 'transparent' :
          v >= 4 ? '#22c55e' :
          v >= 3 ? '#3b82f6' :
          v >= 2 ? '#f59e0b' :
          '#ef4444'
        ),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        spanGaps: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              const v = ctx.raw;

              if (v === null) return 'No entry';

              const names = {
                5: 'Amazing',
                4: 'Good',
                3: 'Okay',
                2: 'Low',
                1: 'Rough'
              };

              return 'Score: ' + v + ' (' + (names[Math.round(v)] || '') + ')';
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 5.5,
          ticks: {
            stepSize: 1,
            callback: v => ({
              1: '😞',
              2: '😔',
              3: '😐',
              4: '🙂',
              5: '😄'
            }[v] || '')
          },
          grid: { color: '#f3f4f6' }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
  const todayMoodText = document.getElementById('todayMoodText');
  const entryCountText = document.getElementById('entryCountText');

  if (entryCountText) {
    entryCountText.textContent = entries.length;
  }

  if (todayMoodText) {
    const todayEntry = entries.find(e => e.date === today);

    if (todayEntry) {
      const moodData = MOODS[todayEntry.mood];
      todayMoodText.textContent = moodData.emoji + ' ' + todayEntry.mood;
    } else {
      todayMoodText.textContent = 'Not logged yet';
    }
  }
}
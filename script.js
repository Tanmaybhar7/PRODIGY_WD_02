let startTime = 0;
let elapsedTime = 0;
let timerInterval;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const toggleDark = document.getElementById('toggleDark');
const exportLaps = document.getElementById('exportLaps');
const laps = document.getElementById('laps');
const body = document.getElementById('body');
const themeIcon = document.getElementById('themeIcon');

// Format time to hh:mm:ss.mmm
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const milliseconds = String(ms % 1000).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// Start the stopwatch
function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    display.textContent = formatTime(elapsedTime);
  }, 10);

  startBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');
}

// Pause the stopwatch
function pauseTimer() {
  clearInterval(timerInterval);
  startBtn.classList.remove('hidden');
  pauseBtn.classList.add('hidden');
}

// Reset everything
function resetTimer() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  display.textContent = '00:00:00.000';
  laps.innerHTML = '';
  startBtn.classList.remove('hidden');
  pauseBtn.classList.add('hidden');
  localStorage.removeItem('lapTimes');
}

// Record current lap
function recordLap() {
  if (elapsedTime === 0) return;

  const lapTime = formatTime(elapsedTime);
  const lapItem = document.createElement('li');
  lapItem.textContent = `Lap ${laps.children.length + 1}: ${lapTime}`;
  lapItem.className = 'bg-gray-100 px-3 py-1 rounded shadow-sm text-gray-700 dark:bg-gray-700 dark:text-white';
  laps.prepend(lapItem);

  saveLapToLocalStorage(lapItem.textContent);
}

// Export laps to .txt
function exportLapTimes() {
  let data = "";
  laps.querySelectorAll('li').forEach(li => {
    data += li.textContent + "\n";
  });

  const blob = new Blob([data], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'lap_times.txt';
  a.click();
}

// Save lap to localStorage
function saveLapToLocalStorage(lapText) {
  const saved = JSON.parse(localStorage.getItem('lapTimes')) || [];
  saved.unshift(lapText);
  localStorage.setItem('lapTimes', JSON.stringify(saved));
}

// Load laps from storage
function loadLapFromStorage() {
  const saved = JSON.parse(localStorage.getItem('lapTimes')) || [];
  saved.forEach(lap => {
    const li = document.createElement('li');
    li.textContent = lap;
    li.className = 'bg-gray-100 px-3 py-1 rounded shadow-sm text-gray-700 dark:bg-gray-700 dark:text-white';
    laps.appendChild(li);
  });
}

// Set dark/light theme
function setTheme(isDark) {
  if (isDark) {
    body.classList.add('dark');
    themeIcon.className = 'fas fa-sun';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark');
    themeIcon.className = 'fas fa-moon';
    localStorage.setItem('theme', 'light');
  }
}

// Toggle theme manually
function toggleDarkMode() {
  const isDark = body.classList.contains('dark');
  setTheme(!isDark);
}

// Load theme and laps on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme === 'dark');
  loadLapFromStorage();
});

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);
exportLaps.addEventListener('click', exportLapTimes);
toggleDark.addEventListener('click', toggleDarkMode);

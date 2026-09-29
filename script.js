const milestone = new Date("2026-11-18T10:16:07Z");

function updateCountdown() {
  let diff = milestone - new Date();

  if (diff <= 0) {
    const countdown = document.getElementById("countdown");
    countdown.innerHTML = `
      <div class="time-block" style="grid-column:1/-1">
        <strong style="font-size:clamp(44px,7vw,92px)">MILESTONE REACHED</strong>
        <span>ONE LIGHT-DAY FROM EARTH</span>
      </div>`;
    return;
  }

  const d = 86400000;
  const h = 3600000;
  const m = 60000;

  const days = Math.floor(diff / d);
  diff %= d;
  const hours = Math.floor(diff / h);
  diff %= h;
  const minutes = Math.floor(diff / m);
  diff %= m;
  const seconds = Math.floor(diff / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

function updateChrome() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.getElementById("scrollProgress").style.width = pct + "%";
  document.getElementById("nav").classList.toggle("scrolled", scrollTop > 20);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

updateCountdown();
updateChrome();
setInterval(updateCountdown, 1000);
window.addEventListener("scroll", updateChrome, { passive: true });



// V6 — live Voyager distance estimate
const ONE_LIGHT_DAY_KM = 25902068356;
const APPROX_SPEED_KM_S = 17.0;
const LIGHT_SPEED_KM_S = 299792.458;

function formatLargeNumber(value) {
  return Math.round(value).toLocaleString("en-US");
}

function formatSignalHours(hours) {
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainder = hours - days * 24;
    return `${days}d ${remainder.toFixed(2)}h`;
  }
  return `${hours.toFixed(2)} hours`;
}

function updateVoyagerTracker() {
  const kmEl = document.getElementById("distanceKm");
  if (!kmEl) return;

  const now = new Date();
  const secondsToMilestone = (milestone - now) / 1000;
  const estimatedKm = ONE_LIGHT_DAY_KM - (secondsToMilestone * APPROX_SPEED_KM_S);
  const miles = estimatedKm * 0.621371;
  const signalHours = estimatedKm / LIGHT_SPEED_KM_S / 3600;
  const progress = (estimatedKm / ONE_LIGHT_DAY_KM) * 100;

  kmEl.textContent = formatLargeNumber(estimatedKm);
  document.getElementById("distanceMiles").textContent = formatLargeNumber(miles);
  document.getElementById("signalTime").textContent = formatSignalHours(signalHours);
  document.getElementById("distanceProgress").textContent = `${progress.toFixed(4)}%`;

  const fillPct = Math.max(0, Math.min(progress, 100));
  const fill = document.getElementById("trackerPathFill");
  const probe = document.getElementById("trackerProbe");
  if (fill) fill.style.width = `${fillPct}%`;
  if (probe) probe.style.left = `${fillPct}%`;
}

updateVoyagerTracker();
setInterval(updateVoyagerTracker, 1000);

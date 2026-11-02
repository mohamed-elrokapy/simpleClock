(function () {
  const digits = document.getElementById("digits");
  const period = document.getElementById("period");
  const timeEl = document.getElementById("time");
  const dateEl = document.getElementById("date");
  const zoneEl = document.getElementById("zone");
  const formatBtn = document.getElementById("format");
  const handHour = document.getElementById("hand-hour");
  const handMinute = document.getElementById("hand-minute");
  const handSecond = document.getElementById("hand-second");
  const ticks = document.getElementById("ticks");

  const pad = (n) => String(n).padStart(2, "0");
  const SVG_NS = "http://www.w3.org/2000/svg";

  let use24h = false;
  try {
    use24h = localStorage.getItem("clock-24h") === "1";
  } catch (e) {
    /* storage can be blocked; the clock still works */
  }

  // 60 ticks, longer and thicker at each hour.
  for (let i = 0; i < 60; i++) {
    const major = i % 5 === 0;
    const tick = document.createElementNS(SVG_NS, "line");
    tick.setAttribute("x1", "100");
    tick.setAttribute("x2", "100");
    tick.setAttribute("y1", major ? "8" : "10");
    tick.setAttribute("y2", major ? "20" : "14");
    tick.setAttribute("class", major ? "tick tick-major" : "tick");
    tick.setAttribute("transform", `rotate(${i * 6} 100 100)`);
    ticks.appendChild(tick);
  }

  const dateFormat = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  try {
    zoneEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ");
  } catch (e) {
    zoneEl.hidden = true;
  }

  let lastMinute = -1;

  function render() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    let shownHour = h;
    let label = "";
    if (!use24h) {
      label = h >= 12 ? "PM" : "AM";
      shownHour = h % 12 === 0 ? 12 : h % 12;
    }
    digits.textContent = `${pad(shownHour)}:${pad(m)}:${pad(s)}`;
    period.textContent = label;
    period.hidden = use24h;

    handSecond.setAttribute("transform", `rotate(${s * 6} 100 100)`);
    handMinute.setAttribute("transform", `rotate(${m * 6 + s * 0.1} 100 100)`);
    handHour.setAttribute("transform", `rotate(${(h % 12) * 30 + m * 0.5} 100 100)`);

    if (m !== lastMinute) {
      lastMinute = m;
      timeEl.setAttribute("datetime", `${pad(h)}:${pad(m)}`);
      dateEl.textContent = dateFormat.format(now);
      document.title = `${pad(shownHour)}:${pad(m)}${label ? " " + label : ""} · Clock`;
    }
  }

  function updateButton() {
    formatBtn.setAttribute("aria-pressed", String(use24h));
  }

  formatBtn.addEventListener("click", () => {
    use24h = !use24h;
    try {
      localStorage.setItem("clock-24h", use24h ? "1" : "0");
    } catch (e) {
      /* ignore */
    }
    lastMinute = -1;
    updateButton();
    render();
  });

  // Re-arm on the next whole second so the display never skips or repeats a second.
  function loop() {
    render();
    setTimeout(loop, 1000 - (Date.now() % 1000) + 5);
  }

  updateButton();
  loop();
})();

/* ─────────────────────────────────────────────
   main.js — Boot, render loop, scrubber,
   auto-rotation of DNA helix
───────────────────────────────────────────── */

const PHASE_RATE = 0.0008;   // helix auto-rotation per frame (radians)

(async function init() {
  const canvas   = document.getElementById('timeline-canvas');
  const lsBar    = document.getElementById('ls-bar');
  const lsScreen = document.getElementById('loading-screen');
  const tapHint  = document.getElementById('tap-hint');

  function sizeCanvas() {
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  /* ── 1. Load data ── */
  let events, categories;
  try {
    ({ events, categories } = await loadEvents(p => { lsBar.style.width = p + '%'; }));
  } catch (err) {
    document.querySelector('.ls-sub').textContent = 'Error loading data.';
    console.error(err);
    return;
  }

  /* ── 2. Navigation & Renderer & UI ── */
  const nav      = new Navigation();
  const renderer = new Renderer(canvas, nav);
  const ui       = new UI(nav, categories);

  renderer.onEventTap = ev => ui.showEvent(ev);

  /* ── 3. Input ── */
  nav.setupInput(canvas);

  /* ── 4. Next/Prev Logic ── */
  let currentEventIndex = -1;

  function findClosestEventIndex() {
    const cy = nav.centerYear(renderer.h);
    let bestIdx = 0, minD = Infinity;
    for (let i = 0; i < events.length; i++) {
      const d = Math.abs(events[i].year - cy);
      if (d < minD) { minD = d; bestIdx = i; }
    }
    return bestIdx;
  }

  ui.onNext = () => {
    if (currentEventIndex === -1 || Math.abs(events[currentEventIndex].year - nav.centerYear(renderer.h)) > Math.abs(nav.getViewYearRange().maxYear - nav.getViewYearRange().minYear)*0.6) {
      currentEventIndex = findClosestEventIndex();
    }
    if (currentEventIndex < events.length - 1) {
      currentEventIndex++;
      const ev = events[currentEventIndex];
      const targetBot = ev.logPos - nav.range / 2;
      nav.animateToLogPos(targetBot);
      ui.showEvent(ev);
    }
  };

  ui.onPrev = () => {
    if (currentEventIndex === -1 || Math.abs(events[currentEventIndex].year - nav.centerYear(renderer.h)) > Math.abs(nav.getViewYearRange().maxYear - nav.getViewYearRange().minYear)*0.6) {
      currentEventIndex = findClosestEventIndex();
    }
    if (currentEventIndex > 0) {
      currentEventIndex--;
      const ev = events[currentEventIndex];
      const targetBot = ev.logPos - nav.range / 2;
      nav.animateToLogPos(targetBot);
      ui.showEvent(ev);
    }
  };

  const handleEventSelection = ev => {
    currentEventIndex = events.indexOf(ev);
    if (nav.range > 0.05) nav.zoomAround(0.1, ev.logPos);
    const targetBot = ev.logPos - nav.range / 2;
    nav.animateToLogPos(targetBot);
    ui.showEvent(ev);
  };

  renderer.onEventTap = handleEventSelection;
  ui.onEventSelect = handleEventSelection;

  /* ── 5. Hide tap hint after 5s ── */
  setTimeout(() => tapHint && tapHint.remove(), 5000);

  /* ── 6. Render loop ── */
  let frameCount   = 0;
  let isScrolling  = false;
  let scrollTimer  = null;

  renderer.startLoop(delta => {
    if (!isScrolling) {
      renderer.phase += PHASE_RATE * delta;
      nav.markDirty();
    }

    const changed = nav.update(delta);

    if (changed) {
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { isScrolling = false; }, 400);
    }

    if (changed || frameCount < 6) {
      const { minYear, maxYear } = nav.getViewYearRange();
      const visible = getEventsInRange(events, minYear, maxYear, categories);
      const contexts = renderer.draw(visible);
      ui.updateContextLabels(contexts);
    }

    frameCount++;
  });

  /* ── 7. Fade out loading screen ── */
  lsBar.style.width = '100%';
  await new Promise(r => setTimeout(r, 500));
  lsScreen.classList.add('fade-out');
  await new Promise(r => setTimeout(r, 800));
  lsScreen.style.display = 'none';

  /* ── 9. Cinematic intro: full universe → last 3000 years ── */
  nav.viewTop = 1.0;
  nav.viewBot = 0.0;

  const tTop = yearToLogPos(-3000);
  const tBot = yearToLogPos(PRESENT_YEAR + 5);

  let prog = 0;
  const intro = setInterval(() => {
    prog += 0.014;
    if (prog >= 1) { prog = 1; clearInterval(intro); }
    const t   = easeInOutCubic(prog);
    nav.viewTop = 1.0 + t * (tTop - 1.0);
    nav.viewBot = 0.0 + t * (tBot - 0.0);
    nav.markDirty();
  }, 16);

})();

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

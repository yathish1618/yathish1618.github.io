/* ─────────────────────────────────────────────
   data.js — Load, parse, classify events
───────────────────────────────────────────── */

const PRESENT_YEAR  = 2026;
const LOG_MAX_DIST  = Math.log10(50_000_000_001); // ~50B year span

const CATEGORY_COLORS_HEX = {
  'natural history':  0x4fc3f7,
  'evolution':        0x81c784,
  'human prehistory': 0xffb74d,
  'inventions':       0xf48fb1,
  'wars':             0xef5350,
  'empires':          0xce93d8,
  'religion':         0xffe082,
  'art':              0x4dd0e1,
  'music':            0xffa726,
  'discoveries':      0xa5d6a7,
  'politics':         0x90caf9,
  'literature':       0xf0a0d0,
  'disasters':        0xff7043,
  'assassinations':   0xff6e88,
  'nationality':      0x80cbc4,
  'construction':     0xffd54f,
};
const DEFAULT_COLOR = 0x9e9e9e;

const CATEGORY_CSS = {
  'natural history':  '#4fc3f7',
  'evolution':        '#81c784',
  'human prehistory': '#ffb74d',
  'inventions':       '#f48fb1',
  'wars':             '#ef5350',
  'empires':          '#ce93d8',
  'religion':         '#ffe082',
  'art':              '#4dd0e1',
  'music':            '#ffa726',
  'discoveries':      '#a5d6a7',
  'politics':         '#90caf9',
  'literature':       '#f0a0d0',
  'disasters':        '#ff7043',
  'assassinations':   '#ff6e88',
  'nationality':      '#80cbc4',
  'construction':     '#ffd54f',
};
const DEFAULT_CSS = '#9e9e9e';

/* ── Era Definitions ── */
const ERA_DIMENSIONS = [
  {
    name: 'GEOLOGICAL',
    eras: [
      { name: 'Pre-Universe',   start: -Infinity,       end: -13800000000, color: 0x1a1030 },
      { name: 'Hadean',         start: -13800000000,    end: -4000000000,  color: 0x3b1a0d },
      { name: 'Archean',        start: -4000000000,     end: -2500000000,  color: 0x1a2b0d },
      { name: 'Proterozoic',    start: -2500000000,     end: -541000000,   color: 0x0d2b2b },
      { name: 'Paleozoic',      start: -541000000,      end: -252000000,   color: 0x0d1f3b },
      { name: 'Mesozoic',       start: -252000000,      end: -66000000,    color: 0x1a2b0d },
      { name: 'Cenozoic',       start: -66000000,       end: PRESENT_YEAR, color: 0x0d2030 },
    ]
  },
  {
    name: 'EVOLUTIONARY',
    eras: [
      { name: 'Cosmic Dawn',    start: -Infinity,       end: -4600000000,  color: 0x1a1030 },
      { name: 'Primordial Earth',start: -4600000000,    end: -3500000000,  color: 0x2b1a0d },
      { name: 'Dawn of Life',   start: -3500000000,     end: -550000000,   color: 0x0d2b0d },
      { name: 'Cambrian Explosion', start: -550000000,  end: -485000000,   color: 0x102b1a },
      { name: 'Age of Fish',    start: -485000000,      end: -360000000,   color: 0x0d1a2b },
      { name: 'Age of Reptiles',start: -360000000,      end: -66000000,    color: 0x1a2b0d },
      { name: 'Age of Mammals', start: -66000000,       end: -7000000,     color: 0x2b1a0d },
      { name: 'Age of Primates',start: -7000000,        end: -300000,      color: 0x1a0d2b },
      { name: 'Human Dawn',     start: -300000,         end: PRESENT_YEAR, color: 0x0d1a2b },
    ]
  },
  {
    name: 'HISTORICAL',
    eras: [
      { name: 'Deep Cosmic Time',    start: -Infinity,   end: -4600000000, color: 0x1a1030 },
      { name: 'Formation of Earth',  start: -4600000000, end: -542000000,  color: 0x2b1a0d },
      { name: 'Prehistoric',         start: -542000000,  end: -3200,       color: 0x0d2b1a },
      { name: 'Ancient Civilizations',start: -3200,      end: -500,        color: 0x2b2000 },
      { name: 'Classical Era',       start: -500,        end: 500,         color: 0x1a2b00 },
      { name: 'Medieval',            start: 500,         end: 1400,        color: 0x2b0d0d },
      { name: 'Renaissance',         start: 1400,        end: 1800,        color: 0x0d2b2b },
      { name: 'Industrial Age',      start: 1800,        end: 1950,        color: 0x1a0d2b },
      { name: 'Contemporary',        start: 1950,        end: PRESENT_YEAR,color: 0x0d1a2b },
    ]
  }
];

/* ── Log position math ── */
function yearToLogPos(year) {
  const dist = PRESENT_YEAR - year;
  if (dist <= 0) return 0;
  return Math.log10(dist + 1) / LOG_MAX_DIST;
}

function logPosToYear(logPos) {
  return PRESENT_YEAR - (Math.pow(10, logPos * LOG_MAX_DIST) - 1);
}

/* ── Format year for display ── */
function formatYear(year) {
  const yr = Math.round(year);
  if (yr === PRESENT_YEAR) return 'Present';
  if (yr > 0) return `${yr} CE`;
  const abs = Math.abs(yr);
  if (abs >= 1_000_000_000) return `${(abs / 1e9).toFixed(2)}B BCE`;
  if (abs >= 1_000_000)     return `${(abs / 1e6).toFixed(1)}M BCE`;
  if (abs >= 1_000)         return `${(abs / 1e3).toFixed(1)}K BCE`;
  return `${abs} BCE`;
}

/* ── Format time-ago string ── */
function formatTimeAgo(year) {
  const diff = PRESENT_YEAR - Math.round(year);
  if (diff <= 0) return 'Present';
  if (diff >= 1_000_000_000) return `${(diff / 1e9).toFixed(1)} billion years ago`;
  if (diff >= 1_000_000)     return `${Math.round(diff / 1e6).toLocaleString()} million years ago`;
  if (diff >= 10_000)        return `${Math.round(diff / 1000).toLocaleString()}K years ago`;
  if (diff >= 1_000)         return `${Math.round(diff).toLocaleString()} years ago`;
  return `${Math.round(diff)} years ago`;
}

/* ── Load & process events ── */
async function loadEvents(onProgress) {
  const res = await fetch('data/histography.json');
  const raw = await res.json();

  onProgress && onProgress(50);

  // Normalize and enrich
  const events = raw
    .filter(e => e.year != null && e.title)
    .map(e => {
      const year = parseFloat(e.year);
      const cat  = (e.category || 'default').toLowerCase().trim();
      const rating = parseInt(e.rating) || 1;
      return {
        id:       e.i,
        year,
        title:    e.title.trim(),
        category: cat,
        catNorm:  cat,
        rating,
        link:     e.link  || '',
        video:    e.video || '',
        image:    e.image || '',
        logPos:   yearToLogPos(year),
        color:    CATEGORY_COLORS_HEX[cat] || DEFAULT_COLOR,
        cssColor: CATEGORY_CSS[cat]         || DEFAULT_CSS,
        size:     Math.min(Math.max(Math.log10(rating + 1) * 1.6 + 2, 2), 9),
      };
    })
    .sort((a, b) => a.year - b.year); // ascending (oldest first)

  onProgress && onProgress(90);

  // Collect unique categories
  const categories = {};
  for (const e of events) {
    if (!categories[e.catNorm]) {
      categories[e.catNorm] = {
        name:   e.catNorm,
        color:  e.cssColor,
        hex:    e.color,
        count:  0,
        enabled: true,
      };
    }
    categories[e.catNorm].count++;
  }

  onProgress && onProgress(100);
  return { events, categories };
}

/* ── Era lookup ── */
function getEraForYear(year, dimensionIndex) {
  const dim = ERA_DIMENSIONS[dimensionIndex];
  for (let i = dim.eras.length - 1; i >= 0; i--) {
    if (year >= dim.eras[i].start) return dim.eras[i];
  }
  return dim.eras[0];
}

/* ── Binary search helpers ── */
function lowerBound(arr, target) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid].year < target) lo = mid + 1; else hi = mid;
  }
  return lo;
}
function upperBound(arr, target) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid].year <= target) lo = mid + 1; else hi = mid;
  }
  return lo;
}

function getEventsInRange(events, minYear, maxYear, categories) {
  const lo = lowerBound(events, minYear);
  const hi = upperBound(events, maxYear);
  const result = [];
  for (let i = lo; i < hi; i++) {
    if (categories[events[i].catNorm]?.enabled !== false) {
      result.push(events[i]);
    }
  }
  return result;
}

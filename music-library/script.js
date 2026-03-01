const IA = 'https://archive.org/download/mk9x2wr5qt/';
const WASM = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm';

let db, cv = 'tracks', sq = '', stopped = false, Q = [], qi = -1;
let trkSort = 'date', trkDir = 'desc';
let allRows = [];
let plRows = [], plName = '';
let sfT = true, sfAr = true, sfAl = true, sfLy = false;
let shuffle = false;
const au = document.getElementById('au');

// ── INIT ──────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const SQL = await initSqlJs({ locateFile: file => file });
    const buf = await fetch('./MM5.DB').then(r => r.arrayBuffer());
    db = new SQL.Database(new Uint8Array(buf));
    document.getElementById('loading').style.display = 'none';
    const tbls = safeQ('tbl', `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`);
    console.log('[Chaos] tables:', tbls.__error ? tbls.message : tbls.map(r => r.name).join(', '));
    const n = (safeQ('n', `SELECT COUNT(*) AS n FROM Songs`)[0] || {}).n || 0;
    document.getElementById('libct').textContent = (+n).toLocaleString() + ' tracks';
    loadPL();
    rv('tracks');
  } catch (e) {
    document.getElementById('loading').innerHTML =
      `<h2 style="color:#e07070">Failed to load</h2><p style="color:#a06060;margin-top:10px">${e.message}</p>`;
  }
})();

// ── DB HELPERS ────────────────────────────────────────────────────────────────
function safeQ(label, sql, params = []) {
  try {
    const s = db.prepare(sql);
    if (params.length) s.bind(params);
    const r = []; while (s.step()) r.push(s.getAsObject()); s.free(); return r;
  } catch (e) {
    console.error(`[Chaos] ${label}:`, e.message);
    return { __error: true, label, message: e.message };
  }
}
function errHTML(r) { return (!r || !r.__error) ? '' : `<div class="qerr"><strong>⚠ ${r.label}</strong>${r.message}</div>` }

// ── ART ───────────────────────────────────────────────────────────────────────
function th(id) { return id ? `Thumbs/${id}.jpg` : null }
function imgEl(id, cls) {
  const p = th(id);
  return p
    ? `<img src="${p}" loading="lazy" onerror="this.outerHTML='<div class=${cls}-ph>♪</div>'">`
    : `<div class="${cls}-ph">♪</div>`;
}

// ── FORMATTERS ────────────────────────────────────────────────────────────────
function fl(ms) { if (!ms) return ''; const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }
function fr(r) { return (!r || r <= 0) ? '' : `★`.repeat(Math.min(5, Math.round(r / 20))) }
function es(s = '') { return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/</g, '&lt;') }

// ── SEARCH FILTER DROPDOWN ────────────────────────────────────────────────────
function openDrop() { document.getElementById('srch-drop').classList.add('open') }
function closeDrop() { document.getElementById('srch-drop').classList.remove('open') }
document.addEventListener('pointerdown', e => {
  if (!document.getElementById('srch-wrap').contains(e.target)) closeDrop();
});
function toggleSF(f) {
  if (f === 't') { sfT = !sfT; document.getElementById('sf-t').classList.toggle('on', sfT) }
  if (f === 'ar') { sfAr = !sfAr; document.getElementById('sf-ar').classList.toggle('on', sfAr) }
  if (f === 'al') { sfAl = !sfAl; document.getElementById('sf-al').classList.toggle('on', sfAl) }
  if (f === 'ly') { sfLy = !sfLy; document.getElementById('sf-ly').classList.toggle('on', sfLy) }
  if (sq) document.getElementById('content').innerHTML = renderTrkTable();
}
function matches(r) {
  if (!sq) return true;
  return (sfT && (r.Title || '').toLowerCase().includes(sq)) ||
    (sfAr && (r.Artist || '').toLowerCase().includes(sq)) ||
    (sfAl && (r.Album || '').toLowerCase().includes(sq)) ||
    (sfLy && (r.Lyrics || '').toLowerCase().includes(sq));
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function gv(v) {
  cv = v; sq = '';
  document.getElementById('srch-in').value = '';
  document.querySelectorAll('.ni').forEach(e => e.classList.toggle('on', e.dataset.v === v));
  document.querySelectorAll('.pli').forEach(e => e.classList.remove('on'));
  document.getElementById('vtitle').textContent = { tracks: 'Tracks', albums: 'Albums', artists: 'Artists', genres: 'Genres' }[v] || v;
  document.getElementById('content').scrollTop = 0;
  closeMobSrch();
  rv(v); csb();
}
function onSrch(v) { sq = v.toLowerCase(); rv(cv) }
function rv(v) {
  const el = document.getElementById('content');
  if (v === 'tracks') { el.innerHTML = trkHTML(); return }
  if (v === 'albums') { el.innerHTML = albHTML(); return }
  if (v === 'artists') { el.innerHTML = artHTML(); return }
  if (v === 'genres') { el.innerHTML = genHTML(); return }
}

// ── PANEL / SIDEBAR MOBILE ────────────────────────────────────────────────────
function osb() { document.getElementById('sb').classList.add('open'); document.getElementById('mob-overlay').classList.add('show') }
function csb() { document.getElementById('sb').classList.remove('open'); document.getElementById('mob-overlay').classList.remove('show') }
function orp() {
  const rp = document.getElementById('rp');
  if (rp.classList.contains('open')) {
    crp();
  } else {
    rp.classList.add('open');
    document.getElementById('rp-mob-overlay').classList.add('show');
  }
}
function crp() { document.getElementById('rp').classList.remove('open'); document.getElementById('rp-mob-overlay').classList.remove('show') }
function showTab(t) {
  document.getElementById('tab-q').classList.toggle('on', t === 'q');
  document.getElementById('tab-np').classList.toggle('on', t === 'np');
  document.getElementById('rp-queue').classList.toggle('show', t === 'q');
  document.getElementById('rp-now').classList.toggle('show', t === 'np');
}
function onPlayerClick(e) { showTab('np'); if (window.innerWidth <= 960) orp(); }

// ── PLAYLISTS ─────────────────────────────────────────────────────────────────
function loadPL() {
  const res = safeQ('PL', `SELECT (PlaylistName||'') AS PlaylistName FROM Playlists ORDER BY (PlaylistName||'')`);
  if (res.__error) return;
  document.getElementById('pll').innerHTML = res.map(r =>
    `<div class="pli" onclick="vpl('${es(r.PlaylistName)}')">${r.PlaylistName}</div>`
  ).join('');
}

// ── ALL TRACKS ────────────────────────────────────────────────────────────────
// Load once, sort client-side (instant, no re-query)
function trkHTML() {
  if (!allRows.length) {
    const res = safeQ('AllTracks', `
      SELECT s.ID, s.IDAlbum, s.TrackNumber AS Num,
        (s.SongTitle||'') AS Title, (s.Artist||'') AS Artist,
        (s.Album||'') AS Album, (s.Genre||'') AS Genre,
        s.Rating, s.SongLength AS Len, s.PlayCounter AS Plays,
        s."Year"/10000 AS Year,
        DATE('1900-01-01','+'||(s.DateAdded-2)||' days') AS DateAdded,
        (s.Lyrics||'') AS Lyrics
      FROM Songs s
      ORDER BY s.DateAdded DESC, s.IDAlbum, s.TrackNumber+0 ASC
    `);
    if (res.__error) return errHTML(res);
    allRows = res;
  }
  return renderTrkTable();
}

function trkSortBy(col) {
  if (trkSort === col) trkDir = trkDir === 'desc' ? 'asc' : 'desc';
  else { trkSort = col; trkDir = 'asc' }
  clientSort();
  document.getElementById('content').innerHTML = renderTrkTable();
}

function clientSort() {
  const d = trkDir === 'asc' ? 1 : -1;
  allRows.sort((a, b) => {
    let av, bv;
    switch (trkSort) {
      case 'title': av = (a.Title || '').toLowerCase(); bv = (b.Title || '').toLowerCase(); break;
      case 'artist': av = (a.Artist || '').toLowerCase(); bv = (b.Artist || '').toLowerCase(); break;
      case 'album': av = (a.Album || '').toLowerCase(); bv = (b.Album || '').toLowerCase(); break;
      case 'genre': av = (a.Genre || '').toLowerCase(); bv = (b.Genre || '').toLowerCase(); break;
      case 'rating': av = +(a.Rating) || 0; bv = +(b.Rating) || 0; break;
      case 'plays': av = +(a.Plays) || 0; bv = +(b.Plays) || 0; break;
      case 'length': av = +(a.Len) || 0; bv = +(b.Len) || 0; break;
      case 'num': av = +(a.Num) || 0; bv = +(b.Num) || 0; break;
      case 'year': av = +(a.Year) || 0; bv = +(b.Year) || 0; break;
      default: av = a.DateAdded || ''; bv = b.DateAdded || ''; break;
    }
    return av < bv ? -d : av > bv ? d : 0;
  });
}

function renderTrkTable() {
  const rows = allRows.filter(r => matches(r));
  window._QRows = rows;// stash for piQ

  const col = (c, lbl) => {
    const on = trkSort === c ? 'son' : '';
    const asc = (trkSort === c && trkDir === 'asc') ? ' sasc' : '';
    return `<span class="${on}${asc}" onclick="trkSortBy('${c}')">${lbl}</span>`;
  };
  const head = `
    <div class="sh">${rows.length.toLocaleString()} tracks</div>
    <div class="tk-wrap"><div class="tk-head">
      <span></span>
      <span>Album</span>
      <span>#</span>
      <span>Title</span>
      <span>Artist</span>
      <span>Year</span>
      <span>Length</span>
      <span>Genre</span>
      <span>Rating</span>
      <span>Plays</span>
      <span>Added</span>
    </div>`;

  const body = rows.map((t, i) => {
    // tk-sum-title hidden on desktop, shown on mobile (via CSS)
    const ratStr = fr(t.Rating);
    const sum = `<div class="tk-sum">
      <div class="tk-sum-art">${imgEl(t.IDAlbum, 'tk-sum-art')}</div>
      <div class="tk-sum-info">
        <div class="tk-sum-title">${t.Title || ''}</div>
        <div class="tk-sum-album tk-link" onclick="valb(${t.IDAlbum},'${es(t.Album)}','${es(t.Artist || '')}');event.stopPropagation()">${t.Album || '—'}</div>
        <div class="tk-sum-artist tk-link" onclick="vart(0,'${es(t.Artist || '')}');event.stopPropagation()">${t.Artist || '—'}</div>
        ${ratStr ? `<div class="tk-mob-rat">${ratStr}</div>` : ''}
      </div>
    </div>`;
    const isP = (qi === i && Q === window._QRows);
    const pl = isP ? ' pl' : '';
    const pbInner = isP ? '<span class="eq"><b></b><b></b><b></b></span>' : '▶';
    return `<div class="tk-row${pl}" id="tr-${t.ID}" onclick="piQ(${i})">
      <button class="tk-pb" onclick="piQ(${i});event.stopPropagation()">${pbInner}</button>
      ${sum}
      <span class="tk-sm">${t.Num || ''}</span>
      <span class="tk-cell tk-title">${t.Title || ''}</span>
      <span class="tk-sm">${t.Artist || ''}</span>
      <span class="tk-sm">${t.Year || ''}</span>
      <span class="tk-sm tk-dur">${fl(t.Len)}</span>
      <span class="tk-sm">${t.Genre || ''}</span>
      <span class="tk-cell tk-rat">${fr(t.Rating)}</span>
      <span class="tk-sm">${t.Plays || 0}</span>
      <span class="tk-sm">${t.DateAdded || ''}</span>
      <button class="tk-dot" onclick="showTrkDot(event,${i})" title="More">⋮</button>
    </div>`;
  }).join('');

  return head + body + `</div>`;
}

// Fix #1: after clearQ, piQ re-populates Q before playing so it always works
function piQ(i) {
  const rows = window._QRows || allRows.filter(r => matches(r));
  window._QRows = rows;
  setQ(rows);
  pi(i);
}

// ── ALBUMS ────────────────────────────────────────────────────────────────────
function albHTML() {
  const res = safeQ('Albums', `
    SELECT s.IDAlbum, MAX(s.Album||'') AS Album, MAX(s.Artist||'') AS Artist,
      DATE('1900-01-01','+'||(MAX(s.DateAdded)-2)||' days') AS DateAdded
    FROM Songs s WHERE s.Album IS NOT NULL
    GROUP BY s.IDAlbum ORDER BY DateAdded DESC
  `);
  if (res.__error) return errHTML(res);
  let rows = res;
  if (sq) rows = rows.filter(r => (r.Album || '').toLowerCase().includes(sq) || (r.Artist || '').toLowerCase().includes(sq));
  if (!rows.length) return `<div class="empty">No albums found</div>`;
  return `<div class="sh">${rows.length} albums</div>
  <div class="ag">${rows.map(r => `
    <div class="ac" onclick="valb(${r.IDAlbum},'${es(r.Album)}','${es(r.Artist || '')}')">
      <div class="aa">${imgEl(r.IDAlbum, 'aa')}<div class="ao">▶</div></div>
      <div class="an" title="${es(r.Album)}">${r.Album}</div>
      <div class="as2">${r.Artist || '—'}</div>
      <div class="ad">${r.DateAdded || ''}</div>
    </div>`).join('')}</div>`;
}

function valb(idAlbum, album, artist) {
  document.getElementById('vtitle').textContent = album || 'Album';
  const res = safeQ(`Alb${idAlbum}`, `
    SELECT s.ID, s.IDAlbum, s.TrackNumber AS Num, (s.SongTitle||'') AS Title,
      (s.Artist||'') AS Artist, (s.Album||'') AS Album, s.Rating, s.SongLength AS Len,
      (s.Lyrics||'') AS Lyrics
    FROM Songs s WHERE s.IDAlbum=? ORDER BY s.TrackNumber+0 ASC
  `, [idAlbum]);
  const trks = res.__error ? [] : res;
  const ms = trks.reduce((a, t) => a + (+(t.Len) || 0), 0);
  setQ(trks);
  const c = document.getElementById('content'); c.scrollTop = 0;
  c.innerHTML = `
    <button class="back" onclick="gv('albums')">← Albums</button>
    ${errHTML(res)}
    <div class="dh">
      <div class="da">${imgEl(idAlbum, 'aa')}</div>
      <div class="di">
        <div class="dl">Album</div><h2>${album || '—'}</h2>
        <div class="dar">${artist || '—'}</div>
        <div class="dm">${trks.length} tracks · ${fl(ms)}</div>
        <button class="pa" onclick="pi(0)">▶ Play All</button>
      </div>
    </div>
    <div class="tl-head"><span></span><span>#</span><span>Title</span><span>Artist</span><span>★</span><span>Time</span></div>
    ${trks.map((t, i) => {
    const isP = (qi >= 0 && Q[qi] && t.ID === Q[qi].ID);
    return `
      <div class="tl-row${isP ? ' pl' : ''}" id="tr-${t.ID}" onclick="pi(${i})">
        <button class="tpb">${isP ? '<span class="eq"><b></b><b></b><b></b></span>' : '▶'}</button>
        <span class="tl-num">${t.Num || ''}</span>
        <span class="tl-title">${t.Title || ''}</span>
        <span class="tl-sub">${t.Artist || ''}</span>
        <span class="tl-rat">${fr(t.Rating)}</span>
        <span class="tl-dur">${fl(t.Len)}</span>
        <div class="tl-mob"><div class="tl-mob-art">${imgEl(t.IDAlbum, 'tl-mob-art')}</div><div class="tl-mob-info"><div class="tl-mob-title">${t.Title || ''}</div><div class="tl-mob-sub">${t.Artist || ''}</div>${fr(t.Rating) ? `<div class="tl-mob-rat">${fr(t.Rating)}</div>` : ''}</div></div>
        <button class="tl-dot" onclick="showTrkDot(event,${i})" title="More">⋮</button>
      </div>`}).join('')}`;
}

function artHTML() {
  let res = safeQ('Artists', `
    SELECT a.ID, (a.Artist||'') AS ArtistName, a.Tracks, MIN(s.IDAlbum) AS IDAlbum
    FROM Artists a
    LEFT JOIN ArtistsSongs ars ON ars.IDArtist=a.ID
    LEFT JOIN Songs s ON s.ID=ars.IDSong
    WHERE a.Tracks>0
    GROUP BY a.ID ORDER BY (a.Artist||'')
  `);
  if (res.__error) {
    const r2 = safeQ('ArtFB', `
      SELECT (s.Artist||'') AS ArtistName, COUNT(*) AS Tracks, MIN(s.IDAlbum) AS IDAlbum
      FROM Songs s WHERE s.Artist IS NOT NULL AND (s.Artist||'')!=''
      GROUP BY (s.Artist||'') ORDER BY (s.Artist||'')
    `);
    if (r2.__error) return errHTML(r2);
    res = r2.map(r => ({ ...r, ID: 0 }));
  }
  let rows = res;
  if (sq) rows = rows.filter(r => (r.ArtistName || '').toLowerCase().includes(sq));
  if (!rows.length) return `<div class="empty">No artists found</div>`;
  return `<div class="sh">${rows.length} artists</div>
  <div class="artg">${rows.map(r => {
    const init = (r.ArtistName || '?')[0].toUpperCase();
    // Fetch up to 4 album IDs for mosaic (same pattern as genres)
    let ids = [];
    if (r.ID) {
      const cr = safeQ(`AC${r.ID}`, `SELECT DISTINCT s.IDAlbum FROM ArtistsSongs ars JOIN Songs s ON s.ID=ars.IDSong WHERE ars.IDArtist=? AND s.IDAlbum IS NOT NULL LIMIT 4`, [r.ID]);
      if (!cr.__error) ids = cr.map(x => x.IDAlbum).filter(Boolean);
    }
    if (!ids.length) ids = r.IDAlbum ? [r.IDAlbum] : [];
    let artInner;
    if (ids.length >= 4) {
      const cells = ids.slice(0, 4).map(id => {
        const p = th(id);
        return p ? `<img src="${p}" loading="lazy" onerror="this.style.display='none'">` : `<div style="background:var(--bdr)"></div>`;
      }).join('');
      artInner = `<div class="art-mosaic">${cells}</div>`;
    } else {
      const p = ids[0] ? th(ids[0]) : null;
      artInner = p
        ? `<img src="${p}" loading="lazy" onerror="this.outerHTML='<div class=art-aa-ph>${init}</div>'">`
        : `<div class="art-aa-ph">${init}</div>`;
    }
    return `<div class="artc" onclick="vart(${r.ID || 0},'${es(r.ArtistName)}')">
      <div class="art-aa">${artInner}<div class="art-ao"><span>${r.Tracks || ''} tracks</span></div></div>
      <div class="art-name">${r.ArtistName}</div>
      <div class="art-count">${r.Tracks || ''} tracks</div>
    </div>`;
  }).join('')}</div>`;
}

function vart(id, name) {
  document.getElementById('vtitle').textContent = name;
  let res = id ? safeQ(`Vart${id}`, `
    SELECT s.IDAlbum,MAX(s.Album||'') AS Album,MAX(s.Artist||'') AS Artist,
      DATE('1900-01-01','+'||(MAX(s.DateAdded)-2)||' days') AS DateAdded
    FROM ArtistsSongs ars JOIN Songs s ON s.ID=ars.IDSong
    WHERE ars.IDArtist=? GROUP BY s.IDAlbum ORDER BY DateAdded DESC
  `, [id]) : { __error: true };
  if (res.__error) res = safeQ(`VartFB`, `
    SELECT s.IDAlbum,MAX(s.Album||'') AS Album,MAX(s.Artist||'') AS Artist,
      DATE('1900-01-01','+'||(MAX(s.DateAdded)-2)||' days') AS DateAdded
    FROM Songs s WHERE (s.Artist||'')=? GROUP BY s.IDAlbum ORDER BY DateAdded DESC
  `, [name]);
  const rows = res.__error ? [] : res;
  document.getElementById('content').innerHTML = `
    <button class="back" onclick="gv('artists')">← Artists</button>
    ${errHTML(res)}
    <div class="sh">${name} — ${rows.length} albums</div>
    <div class="ag">${rows.map(r => `
      <div class="ac" onclick="valb(${r.IDAlbum},'${es(r.Album)}','${es(r.Artist || '')}')">
        <div class="aa">${imgEl(r.IDAlbum, 'aa')}<div class="ao">▶</div></div>
        <div class="an">${r.Album}</div><div class="ad">${r.DateAdded || ''}</div>
      </div>`).join('')}</div>`;
}

// ── GENRES ────────────────────────────────────────────────────────────────────
function genHTML() {
  let res = safeQ('Genres', `
    SELECT g.IDGenre AS ID,(g.GenreName||'') AS GenreName,g.UsageCount AS Tracks
    FROM Genres g ORDER BY g.UsageCount DESC
  `);
  if (res.__error) {
    const r2 = safeQ('GenFB', `
      SELECT (s.Genre||'') AS GenreName,COUNT(*) AS Tracks
      FROM Songs s WHERE s.Genre IS NOT NULL AND (s.Genre||'')!=''
      GROUP BY (s.Genre||'') ORDER BY Tracks DESC
    `);
    if (r2.__error) return errHTML(r2);
    res = r2.map(r => ({ ...r, ID: 0 }));
  }
  let rows = res;
  if (sq) rows = rows.filter(r => (r.GenreName || '').toLowerCase().includes(sq));
  if (!rows.length) return `<div class="empty">No genres found</div>`;
  return `<div class="sh">${rows.length} genres</div>
  <div class="geng">${rows.map(r => {
    let ids = [];
    if (r.ID) {
      const cr = safeQ(`GC${r.ID}`, `SELECT DISTINCT s.IDAlbum FROM GenresSongs gs JOIN Songs s ON s.ID=gs.IDSong WHERE gs.IDGenre=? AND s.IDAlbum IS NOT NULL LIMIT 4`, [r.ID]);
      if (!cr.__error) ids = cr.map(x => x.IDAlbum).filter(Boolean);
    }
    if (!ids.length) {
      const cr = safeQ('GCFB', `SELECT DISTINCT s.IDAlbum FROM Songs s WHERE (s.Genre||'')=? AND s.IDAlbum IS NOT NULL LIMIT 4`, [r.GenreName]);
      if (!cr.__error) ids = cr.map(x => x.IDAlbum).filter(Boolean);
    }
    // Fix #5: mosaic only if 4 covers; otherwise single image
    let inner;
    if (ids.length >= 4) {
      const cells = ids.slice(0, 4).map(id => {
        const p = th(id);
        return p ? `<img src="${p}" loading="lazy" onerror="this.style.display='none'">` : `<div style="background:var(--bdr)"></div>`;
      }).join('');
      inner = `<div class="gen-mosaic">${cells}</div>`;
    } else {
      const p = th(ids[0]);
      inner = `<div class="gen-single">${p ? `<img src="${p}" loading="lazy" onerror="this.outerHTML='<div class=aa-ph>♪</div>'">` : `<div class="aa-ph">♪</div>`}</div>`;
    }
    return `<div class="genc" onclick="vgen(${r.ID || 0},'${es(r.GenreName)}')">
      <div class="gen-aa">
        ${inner}
        <div class="gen-ov"><div><div class="gen-label">${r.GenreName}</div><div class="gen-ct">${r.Tracks || ''} tracks</div></div></div>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function vgen(id, genre) {
  document.getElementById('vtitle').textContent = genre;
  let res = id ? safeQ(`Vg${id}`, `
    SELECT s.ID,s.IDAlbum,s.TrackNumber AS Num,(s.SongTitle||'') AS Title,
      (s.Artist||'') AS Artist,(s.Album||'') AS Album,s.Rating,s.SongLength AS Len,
      (s.Lyrics||'') AS Lyrics
    FROM GenresSongs gs JOIN Songs s ON s.ID=gs.IDSong
    WHERE gs.IDGenre=? ORDER BY (s.Artist||''),(s.Album||''),s.TrackNumber+0 ASC
  `, [id]) : { __error: true };
  if (res.__error) res = safeQ('VgFB', `
    SELECT s.ID,s.IDAlbum,s.TrackNumber AS Num,(s.SongTitle||'') AS Title,
      (s.Artist||'') AS Artist,(s.Album||'') AS Album,s.Rating,s.SongLength AS Len,
      (s.Lyrics||'') AS Lyrics
    FROM Songs s WHERE (s.Genre||'')=?
    ORDER BY (s.Artist||''),(s.Album||''),s.TrackNumber+0 ASC
  `, [genre]);
  const trks = res.__error ? [] : res;
  setQ(trks);
  document.getElementById('content').innerHTML = `
    <button class="back" onclick="gv('genres')">← Genres</button>
    ${errHTML(res)}
    <div class="sh">${genre} — ${trks.length} tracks</div>
    <div class="tl-head"><span></span><span>#</span><span>Title</span><span>Artist / Album</span><span>★</span><span>Time</span></div>
    ${trks.map((t, i) => `
      <div class="tl-row" id="tr-${t.ID}" onclick="pi(${i})">
        <button class="tpb">▶</button>
        <span class="tl-num">${t.Num || ''}</span>
        <span class="tl-title">${t.Title || ''}</span>
        <span class="tl-sub">${t.Artist || ''} — ${t.Album || ''}</span>
        <span class="tl-rat">${fr(t.Rating)}</span>
        <span class="tl-dur">${fl(t.Len)}</span>
        <div class="tl-mob"><div class="tl-mob-art">${imgEl(t.IDAlbum, 'tl-mob-art')}</div><div class="tl-mob-info"><div class="tl-mob-title">${t.Title || ''}</div><div class="tl-mob-sub">${t.Artist || ''}</div>${fr(t.Rating) ? `<div class="tl-mob-rat">${fr(t.Rating)}</div>` : ''}</div></div>
        <button class="tl-dot" onclick="showTrkDot(event,${i})" title="More">⋮</button>
      </div>`).join('')}`;
}

// ── PLAYLISTS ─────────────────────────────────────────────────────────────────
function vpl(name) {
  document.querySelectorAll('.ni').forEach(e => e.classList.remove('on'));
  document.querySelectorAll('.pli').forEach(e => e.classList.toggle('on', e.textContent === name));
  document.getElementById('vtitle').textContent = name;
  cv = 'playlist'; plName = name; csb();
  const res = safeQ(`PL${name}`, `
    SELECT s.ID,s.IDAlbum,ps.SongOrder+1 AS Num,(s.SongTitle||'') AS Title,
      (s.Artist||'') AS Artist,(s.Album||'') AS Album,s.Rating,s.SongLength AS Len,
      s.PlayCounter AS Plays,
      DATE('1900-01-01','+'||(s.DateAdded-2)||' days') AS DateAdded,
      (s.Lyrics||'') AS Lyrics
    FROM PlaylistSongs ps
    LEFT JOIN Playlists p ON p.IDPlaylist=ps.IDPlaylist
    LEFT JOIN Songs s ON s.ID=ps.IDSong
    WHERE (p.PlaylistName||'')=? ORDER BY ps.SongOrder ASC
  `, [name]);
  plRows = res.__error ? [] : res;
  const sorted = getSortedPl();
  setQ(sorted);
  document.getElementById('content').scrollTop = 0;
  document.getElementById('content').innerHTML = `
    ${errHTML(res)}
    <div class="sh">${name} — ${plRows.length} tracks</div>
    <div class="tl-head"><span></span><span>#</span><span>Title</span><span>Artist / Album</span><span>★</span><span>Time</span></div>
    <div id="pl-rows">${_plRowsHTML(sorted)}</div>`;
}

function getSortedPl() {
  const d = trkDir === 'asc' ? 1 : -1;
  return [...plRows].sort((a, b) => {
    let av, bv;
    switch (trkSort) {
      case 'rating': av = +(a.Rating) || 0; bv = +(b.Rating) || 0; break;
      case 'plays': av = +(a.Plays) || 0; bv = +(b.Plays) || 0; break;
      case 'length': av = +(a.Len) || 0; bv = +(b.Len) || 0; break;
      default: av = a.DateAdded || ''; bv = b.DateAdded || ''; break;
    }
    return av < bv ? -d : av > bv ? d : 0;
  });
}

function _plRowsHTML(rows) {
  return rows.map((t, i) => {
    const isP = (qi >= 0 && Q[qi] && t.ID === Q[qi].ID);
    return `
      <div class="tl-row${isP ? ' pl' : ''}" id="tr-${t.ID}" onclick="pi(${i})">
        <button class="tpb">${isP ? '<span class="eq"><b></b><b></b><b></b></span>' : '▶'}</button>
        <span class="tl-num">${t.Num || ''}</span>
        <span class="tl-title">${t.Title || ''}</span>
        <span class="tl-sub">${t.Artist || ''} — ${t.Album || ''}</span>
        <span class="tl-rat">${fr(t.Rating)}</span>
        <span class="tl-dur">${fl(t.Len)}</span>
        <div class="tl-mob"><div class="tl-mob-art">${imgEl(t.IDAlbum, 'tl-mob-art')}</div><div class="tl-mob-info"><div class="tl-mob-title">${t.Title || ''}</div><div class="tl-mob-sub">${t.Artist || ''}</div>${fr(t.Rating) ? `<div class="tl-mob-rat">${fr(t.Rating)}</div>` : ''}</div></div>
        <button class="tl-dot" onclick="showTrkDot(event,${i})" title="More">⋮</button>
      </div>`;
  }).join('');
}

function _renderPlRows() {
  const sorted = getSortedPl();
  setQ(sorted);
  const el = document.getElementById('pl-rows');
  if (el) el.innerHTML = _plRowsHTML(sorted);
}

// ── PLAYBACK ──────────────────────────────────────────────────────────────────
function setQ(trks) { Q = trks; stopped = false; renderQueue() }

function pi(i) {
  if (i < 0 || i >= Q.length) return;
  qi = i; const t = Q[i];
  // Reset all playing states
  document.querySelectorAll('.tk-row,.tl-row').forEach(r => {
    r.classList.remove('pl');
    const btn = r.querySelector('.tpb,.tk-pb');
    if (btn && btn.querySelector('.eq')) btn.innerHTML = '▶';
  });
  const row = document.getElementById('tr-' + t.ID);
  if (row) {
    row.classList.add('pl');
    const btn = row.querySelector('.tpb,.tk-pb');
    if (btn) btn.innerHTML = '<span class="eq"><b></b><b></b><b></b></span>';
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  document.getElementById('ntitle').textContent = t.Title || '—';
  document.getElementById('nartist').textContent = t.Artist || '—';
  // Check if cbpp-icon exists; on first load or direct dom it might not be initialized, but it is in index.html now
  const pIcon = document.getElementById('cbpp-icon');
  if (pIcon) pIcon.textContent = '⏸';
  document.getElementById('errel').textContent = '';
  const p = th(t.IDAlbum);
  document.getElementById('nart').innerHTML = p
    ? `<img src="${p}" onerror="this.outerHTML='<div id=nph>♪</div>'">`
    : `<div id="nph">♪</div>`;
  updateNowPanel(t, t.Lyrics || '');
  renderQueue();

  // Show loader
  document.getElementById('cbpp-icon').style.display = 'none';
  document.getElementById('cbpp-loader').style.display = 'inline-block';

  au.src = IA + t.ID + '.mp3';
  au.play().then(() => {
    // Hide loader, show pause icon
    document.getElementById('cbpp-loader').style.display = 'none';
    document.getElementById('cbpp-icon').style.display = 'inline-block';
    document.getElementById('cbpp-icon').textContent = '⏸';
  }).catch((err) => {
    document.getElementById('cbpp-loader').style.display = 'none';
    document.getElementById('cbpp-icon').style.display = 'inline-block';
    document.getElementById('cbpp-icon').textContent = '▶';
    if (err.name === 'AbortError') return;
    if (stopped) return;
    // Grey out unavailable row
    const urow = document.getElementById('tr-' + t.ID);
    if (urow) urow.classList.add('unavail');
    showSnackbar(`“${t.Title || 'Track'}” is not available`);
    setTimeout(() => { if (!stopped) ask(1); }, 1800);
  });
}

function seekNP(e) {
  if (!au.duration) return;
  const r = e.currentTarget.getBoundingClientRect();
  au.currentTime = ((e.clientX - r.left) / r.width) * au.duration;
}

function updateNowPanel(t, lyrics) {
  const p = th(t.IDAlbum);
  const artEl = p
    ? `<img src="${p}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div class=np-art-ph>♪</div>'">`
    : `<div class="np-art-ph">♪</div>`;
  const lyrHTML = lyrics
    ? `<div class="np-lyr-label">Lyrics</div><div class="np-lyr-text">${lyrics.replace(/</g, '&lt;')}</div>`
    : `<div class="np-lyr-empty">No lyrics stored</div>`;
  document.getElementById('rp-now').innerHTML = `
    <div class="np-art">${artEl}</div>
    <div class="np-info">
      <div class="np-title">${t.Title || '—'}</div>
      <div class="np-artist">${t.Artist || '—'}</div>
      <div class="np-album">${t.Album || ''}</div>
      <div class="np-rating">${fr(t.Rating)}</div>
    </div>
    <div class="np-seek">
      <div id="np-prog" onclick="seekNP(event)">
        <div id="np-pf"></div>
      </div>
      <div class="np-times">
        <span id="np-tel">0:00</span>
        <span id="np-dur">${fl(t.Len) || '—'}</span>
      </div>
    </div>
    <div class="np-lyrics">${lyrHTML}</div>`;
}

function renderQueue() {
  const el = document.getElementById('rp-queue');
  if (!Q.length) { el.innerHTML = `<div class="q-header" style="color:var(--dim);padding:20px 14px">Queue is empty</div>`; return }
  // Windowed render for performance on 7000-track queues
  const W = 200, start = Math.max(0, qi - W), end = Math.min(Q.length - 1, qi + W);
  let html = `<div class="q-header">Playing ${qi >= 0 ? qi + 1 : 0} / ${Q.length}</div>`;
  if (start > 0) html += `<div style="padding:5px 14px;font-size:12px;color:var(--dim)">… ${start} earlier</div>`;
  for (let i = start; i <= end; i++) {
    const t = Q[i]; const p = th(t.IDAlbum || t.Hash);
    const art = p ? `<img src="${p}" loading="lazy" onerror="this.outerHTML='<div class=q-art-ph>♪</div>'">` : `<div class="q-art-ph">♪</div>`;
    html += `<div class="q-item${qi === i ? ' on' : ''}" onclick="pi(${i})">
      <span class="q-num">${i + 1}</span>
      <div class="q-art">${art}</div>
      <div class="q-info"><div class="q-title">${t.Title || '—'}</div><div class="q-sub">${t.Artist || '—'}</div></div>
      <span class="q-dur">${fl(t.Len)}</span>
      <button class="q-dot" onclick="showQDot(event,${i})" title="More">⋮</button>
    </div>`;
  }
  if (Q.length - 1 - end > 0) html += `<div style="padding:5px 14px;font-size:12px;color:var(--dim)">… ${Q.length - 1 - end} more</div>`;
  el.innerHTML = html;
  setTimeout(() => { const cur = el.querySelector('.q-item.on'); if (cur) cur.scrollIntoView({ block: 'nearest' }) }, 40);
}

function ask(d) {
  if (stopped) return;
  if (shuffle && d > 0 && Q.length > 1) {
    let n = qi;
    while (n === qi) n = Math.floor(Math.random() * Q.length);
    pi(n);
    return;
  }
  const n = qi + d;
  if (n < 0 || n >= Q.length) { document.getElementById('errel').textContent = d > 0 ? 'End of queue.' : 'Start of queue.'; return }
  pi(n);
}
function sk(d) { stopped = false; ask(d) }
function tpp() {
  if (!au.src || au.src === location.href) return;
  if (au.paused) {
    document.getElementById('cbpp-icon').style.display = 'none';
    document.getElementById('cbpp-loader').style.display = 'inline-block';
    au.play().then(() => {
      document.getElementById('cbpp-loader').style.display = 'none';
      document.getElementById('cbpp-icon').style.display = 'inline-block';
      document.getElementById('cbpp-icon').textContent = '⏸';
    }).catch(e => {
      document.getElementById('cbpp-loader').style.display = 'none';
      document.getElementById('cbpp-icon').style.display = 'inline-block';
      if (e.name !== 'AbortError') document.getElementById('cbpp-icon').textContent = '▶';
    });
  } else {
    au.pause();
    document.getElementById('cbpp-icon').textContent = '▶';
  }
}

function stopPlayback() {
  if (!au.src || au.src === location.href) return;
  stopped = true;
  au.pause();
  au.src = ''; Q = []; qi = -1;
  document.querySelectorAll('.tk-row,.tl-row').forEach(r => r.classList.remove('pl'));
  document.getElementById('cbpp-loader').style.display = 'none';
  document.getElementById('cbpp-icon').style.display = 'inline-block';
  document.getElementById('cbpp-icon').textContent = '▶';
  document.getElementById('pf').style.width = '0%';
  document.getElementById('tel').textContent = '—';
  document.getElementById('errel').textContent = '';
  document.getElementById('ntitle').textContent = 'Nothing playing';
  document.getElementById('nartist').textContent = '—';
  document.getElementById('ntime').textContent = '—';
  document.getElementById('nart').innerHTML = '<div id="nph">♪</div>';
  const npPf = document.getElementById('np-pf'); if (npPf) npPf.style.width = '0%';
  const npTel = document.getElementById('np-tel'); if (npTel) npTel.textContent = '—';
  const npDur = document.getElementById('np-dur'); if (npDur) npDur.textContent = '—';
  renderQueue();
}

function toggleShuffle() {
  shuffle = !shuffle;
  const btn = document.getElementById('cb-shuffle');
  if (btn) {
    btn.style.color = shuffle ? 'var(--bg)' : 'var(--mid)';
    btn.style.background = shuffle ? 'var(--amb)' : 'none';
  }
}

function seek(e) {
  if (!au.duration) return;
  const r = e.currentTarget.getBoundingClientRect();
  au.currentTime = ((e.clientX - r.left) / r.width) * au.duration;
}

au.addEventListener('ended', () => { if (!stopped) ask(1); else document.getElementById('cbpp-icon').textContent = '▶' });
au.addEventListener('pause', () => { if (!au.ended) document.getElementById('cbpp-icon').textContent = '▶' });
au.addEventListener('play', () => {
  document.getElementById('cbpp-loader').style.display = 'none';
  document.getElementById('cbpp-icon').style.display = 'inline-block';
  document.getElementById('cbpp-icon').textContent = '⏸';
});
au.addEventListener('timeupdate', () => {
  if (!au.duration) return;
  const pct = (au.currentTime / au.duration * 100) + '%';
  document.getElementById('pf').style.width = pct;
  const cur = fl(au.currentTime * 1000);
  const tot = fl(au.duration * 1000);
  document.getElementById('tel').textContent = cur + ' / ' + tot;
  const npPf = document.getElementById('np-pf'); if (npPf) npPf.style.width = pct;
  const npTel = document.getElementById('np-tel'); if (npTel) npTel.textContent = cur;
  const npDur = document.getElementById('np-dur'); if (npDur) npDur.textContent = tot;
});

// ── SNACKBAR ─────────────────────────────────────────────────────────────────────────
let _snackT;
function showSnackbar(msg) {
  const el = document.getElementById('snackbar');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_snackT);
  _snackT = setTimeout(() => el.classList.remove('show'), 2800);
}

// ── DOT MENU ──────────────────────────────────────────────────────────────────────────
let _dotCtx = null; // { type: 'queue'|'track', idx: number }
const _dotMenu = document.getElementById('dot-menu');
const _dotRemBtn = document.getElementById('dot-remove-btn');

function _positionDotMenu(e) {
  e.stopPropagation();
  const btn = e.currentTarget;
  const br = btn.getBoundingClientRect();
  const mw = 170, mh = 120;
  let left = br.left - mw + br.width;
  let top = br.bottom + 4;
  if (left < 8) left = 8;
  if (top + mh > window.innerHeight - 8) top = br.top - mh - 4;
  _dotMenu.style.left = left + 'px';
  _dotMenu.style.top = top + 'px';
  _dotMenu.classList.add('open');
}

function showQDot(e, idx) {
  _dotCtx = { type: 'queue', idx };
  document.getElementById('dot-next-btn').style.display = 'none';
  document.getElementById('dot-end-btn').style.display = 'none';
  _dotRemBtn.style.display = 'block';
  _positionDotMenu(e);
}

function showTrkDot(e, idx) {
  _dotCtx = { type: 'track', idx };
  document.getElementById('dot-next-btn').style.display = 'block';
  document.getElementById('dot-end-btn').style.display = 'block';
  _dotRemBtn.style.display = 'none'; // not in queue context
  _positionDotMenu(e);
}

function dotMenuAction(action) {
  _dotMenu.classList.remove('open');
  if (!_dotCtx) return;
  const { type, idx } = _dotCtx;
  if (type === 'queue') {
    if (action === 'next') {
      // Move Q[idx] to just after current qi
      const insertAt = Math.min(qi + 1, Q.length);
      if (idx === insertAt || idx === insertAt - 1) { renderQueue(); return; }
      const [item] = Q.splice(idx, 1);
      const pos = idx < insertAt ? insertAt - 1 : insertAt;
      Q.splice(pos, 0, item);
      if (qi > idx && qi < insertAt) qi--;
    } else if (action === 'end') {
      const [item] = Q.splice(idx, 1);
      Q.push(item);
      if (qi > idx) qi--;
    } else if (action === 'remove') {
      Q.splice(idx, 1);
      if (qi > idx) qi--;
      else if (qi >= Q.length) qi = Q.length - 1;
    }
    renderQueue();
  } else {
    // tracklist track — same actions (track is already in Q)
    if (action === 'next') {
      const insertAt = Math.min(qi + 1, Q.length);
      if (idx === insertAt || idx === insertAt - 1) { renderQueue(); return; }
      const [item] = Q.splice(idx, 1);
      const pos = idx < insertAt ? insertAt - 1 : insertAt;
      Q.splice(pos, 0, item);
      if (qi > idx && qi < insertAt) qi--;
    } else if (action === 'end') {
      const [item] = Q.splice(idx, 1);
      Q.push(item);
      if (qi > idx) qi--;
    }
  }
  renderQueue();
}

// Close dot menu on outside click
document.addEventListener('pointerdown', e => {
  if (!_dotMenu.contains(e.target)) _dotMenu.classList.remove('open');
});

// ── MOBILE SEARCH ────────────────────────────────────────────────────────────────────
let msfT = true, msfAr = true, msfAl = true, msfLy = false;

function openMobSrch() {
  const bar = document.getElementById('mob-srch-bar');
  const chips = document.getElementById('mob-srch-chips');
  bar.classList.add('open');
  chips.classList.add('open');
  setTimeout(() => document.getElementById('mob-srch-in').focus(), 50);
}

function closeMobSrch() {
  document.getElementById('mob-srch-bar').classList.remove('open');
  document.getElementById('mob-srch-chips').classList.remove('open');
  document.getElementById('mob-srch-in').value = '';
  sq = ''; rv(cv);
}

function onMobSrch(v) {
  // Mirror mobile filter flags into the main search flags
  sfT = msfT; sfAr = msfAr; sfAl = msfAl; sfLy = msfLy;
  sq = v.toLowerCase(); rv(cv);
}

function toggleMSF(f) {
  if (f === 't') { msfT = !msfT; document.getElementById('msf-t').classList.toggle('on', msfT); }
  if (f === 'ar') { msfAr = !msfAr; document.getElementById('msf-ar').classList.toggle('on', msfAr); }
  if (f === 'al') { msfAl = !msfAl; document.getElementById('msf-al').classList.toggle('on', msfAl); }
  if (f === 'ly') { msfLy = !msfLy; document.getElementById('msf-ly').classList.toggle('on', msfLy); }
  const v = document.getElementById('mob-srch-in').value;
  if (v) onMobSrch(v);
}

// ── SORTING MENU ────────────────────────────────────────────────────────────────
let _sortMenuOpen = false;

function toggleSortMenu() {
  _sortMenuOpen = !_sortMenuOpen;
  document.getElementById('sort-menu').classList.toggle('open', _sortMenuOpen);
  document.getElementById('sort-btn').classList.toggle('on', _sortMenuOpen);
  _updateSortOptUI();
}

function closeSortMenu() {
  _sortMenuOpen = false;
  document.getElementById('sort-menu').classList.remove('open');
  document.getElementById('sort-btn').classList.remove('on');
}

function _updateSortOptUI() {
  document.querySelectorAll('.sort-opt').forEach(btn => {
    btn.classList.toggle('on', btn.dataset.col === trkSort && btn.dataset.dir === trkDir);
  });
}

function applySort(col, dir) {
  trkSort = col;
  trkDir = dir;
  closeSortMenu();
  if (cv === 'tracks') {
    clientSort();
    document.getElementById('content').innerHTML = renderTrkTable();
  } else if (cv === 'playlist') {
    _renderPlRows();
  }
}

document.addEventListener('pointerdown', e => {
  if (_sortMenuOpen && !document.getElementById('sort-menu').contains(e.target) && !document.getElementById('sort-btn').contains(e.target)) {
    closeSortMenu();
  }
});

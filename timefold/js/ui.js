/* ─────────────────────────────────────────────
   ui.js — Era HUD, year indicator, category
   filter pills, event detail panel, Wikipedia
   & YouTube integration
───────────────────────────────────────────── */

class UI {
  constructor(nav, categories) {
    this.nav        = nav;
    this.categories = categories;
    this._panelOpen = false;
    this._panelDragStartY = null;
    this._wikiCache = {};

    this._els = {
      btnPrev:   document.getElementById('btn-prev'),
      btnNext:   document.getElementById('btn-next'),
      panel:     document.getElementById('event-panel'),
      panelCat:  document.getElementById('panel-cat-badge'),
      panelYear: document.getElementById('panel-year-label'),
      panelTitle:document.getElementById('panel-title'),
      panelMedia:document.getElementById('panel-media'),
      panelExt:  document.getElementById('panel-extract'),
      panelWiki: document.getElementById('panel-wiki'),
      panelClose:document.getElementById('panel-close'),
      panelDrag: document.getElementById('panel-drag-handle'),
      panelPrev: document.getElementById('panel-prev'),
      panelNext: document.getElementById('panel-next'),
      ctxContainer: document.getElementById('context-labels'),
    };
    
    this._panelReq = 0; // tracking requests for aborting
    this.onNext = null;
    this.onPrev = null;
    this.onEventSelect = null; // clicked a context label
    
    this._buildContextLabels();
    this._bindControls();
  }

  /* ── Context Labels ── */
  _buildContextLabels() {
    this._ctxEls = [];
    for (let i = 0; i < 12; i++) {
       const el = document.createElement('div');
       el.className = 'context-label';
       this._els.ctxContainer.appendChild(el);
       this._ctxEls.push(el);
       
       el.addEventListener('click', () => {
         if (el._ev && this.onEventSelect) this.onEventSelect(el._ev);
       });
    }
  }

  updateContextLabels(labelsData) {
    for (let i = 0; i < this._ctxEls.length; i++) {
       const el = this._ctxEls[i];
       const data = labelsData[i];
      if (data) {
         el.textContent = data.text;
         el.style.left = data.x + 'px';
         el.style.top = data.y + 'px';
         el.style.transform = data.align === 'right' ? 'translate(-100%, -50%)' : 'translateY(-50%)';
         el.classList.add('visible');
         el._ev = data.ev;
         el.style.borderColor = data.color;
       } else {
         el.classList.remove('visible');
       }
    }
  }

  /* ── Controls ── */
  _bindControls() {
    this._els.btnPrev.addEventListener('click', () => this.onPrev && this.onPrev());
    this._els.btnNext.addEventListener('click', () => this.onNext && this.onNext());
    
    this._els.panelPrev.addEventListener('click', () => this.onPrev && this.onPrev());
    this._els.panelNext.addEventListener('click', () => this.onNext && this.onNext());

    // Panel close
    this._els.panelClose.addEventListener('click', () => this.closePanel());

    // Panel swipe-to-dismiss
    this._els.panelDrag.addEventListener('touchstart', e => {
      this._panelDragStartY = e.touches[0].clientY;
    }, { passive: true });
    this._els.panelDrag.addEventListener('touchmove', e => {
      const dy = e.touches[0].clientY - this._panelDragStartY;
      if (dy > 0) this._els.panel.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    this._els.panelDrag.addEventListener('touchend', e => {
      const dy = e.changedTouches[0].clientY - this._panelDragStartY;
      this._els.panel.style.transform = '';
      if (dy > 100) this.closePanel();
    }, { passive: true });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closePanel();
    });
  }

  /* ── Event detail panel ── */
  async showEvent(ev) {
    const reqId = ++this._panelReq;
    const els = this._els;

    // Fill basic info immediately
    els.panelCat.textContent     = ev.category;
    els.panelCat.style.background = ev.cssColor;
    els.panelCat.style.color      = '#000';
    els.panelYear.textContent    = `${formatYear(ev.year)}  ·  ${formatTimeAgo(ev.year)}`;
    els.panelTitle.textContent   = ev.title;
    els.panelExt.textContent     = '';
    els.panelMedia.innerHTML     = '';

    // Wikipedia link
    if (ev.link) {
      const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(ev.link)}`;
      els.panelWiki.href            = wikiUrl;
      els.panelWiki.classList.remove('hidden');
    } else {
      els.panelWiki.classList.add('hidden');
    }

    // Open panel
    els.panel.classList.remove('panel-hidden');
    els.panel.classList.add('panel-visible');
    this._panelOpen = true;

    // YouTube video takes priority if available
    if (ev.video) {
      const iframe = document.createElement('iframe');
      iframe.src     = `https://www.youtube.com/embed/${ev.video}?rel=0&modestbranding=1`;
      iframe.allow   = 'autoplay; encrypted-media';
      iframe.allowFullscreen = true;
      iframe.title   = ev.title;
      els.panelMedia.appendChild(iframe);
    }

    // Wikipedia summary + image (async, fill in when ready)
    if (ev.link) {
      try {
        const data = await this._fetchWiki(ev.link);
        if (!this._panelOpen || this._panelReq !== reqId) return; // panel was closed or requested another event
        if (data.extract) {
          els.panelExt.textContent = data.extract.slice(0, 360) +
            (data.extract.length > 360 ? '…' : '');
        }
        // Show image only if no video
        if (!ev.video && data.thumbnail) {
          const img = document.createElement('img');
          img.src = data.thumbnail;
          img.alt = ev.title;
          img.loading = 'lazy';
          els.panelMedia.prepend(img);
        }
      } catch (_) { /* silent */ }
    }
  }

  closePanel() {
    this._els.panel.classList.remove('panel-visible');
    this._els.panel.classList.add('panel-hidden');
    this._els.panel.style.transform = '';
    this._panelOpen = false;
    // Stop any playing video
    this._els.panelMedia.innerHTML = '';
  }

  async _fetchWiki(pageName) {
    if (this._wikiCache[pageName]) return this._wikiCache[pageName];
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageName)}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('wiki fetch failed');
    const json = await res.json();
    const data = {
      extract:   json.extract   || '',
      thumbnail: json.thumbnail?.source || null,
    };
    this._wikiCache[pageName] = data;
    return data;
  }
}

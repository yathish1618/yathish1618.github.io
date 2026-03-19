/* ─────────────────────────────────────────────
   renderer.js — DNA Double-Helix Timeline
   Two spiralling strands with turquoise sci-fi bg.
   Helix rotation is tied strictly to logPos so it
   moves physically with the events during scroll.
───────────────────────────────────────────── */

const HELIX_CYCLES  = 4.5;     // full rotations visible at once
const HELIX_AMP_F   = 0.28;    // strand amplitude as fraction of screen width
const HELIX_AMP_MAX = 130;     // px cap
const BASE_DOT_R    = 1.5;     // px radius for a rating-1 event
const MAX_DOT_R     = 3.8;     // px radius cap

function helixAmp(w)  { return Math.min(w * HELIX_AMP_F, HELIX_AMP_MAX); }
function depthOf(angleCos) { return (angleCos + 1) * 0.5; }

class Renderer {
  constructor(canvas, nav) {
    this.canvas  = canvas;
    this.nav     = nav;
    this.w       = canvas.clientWidth;
    this.h       = canvas.clientHeight;
    this.phase   = 0;          // helix auto-rotation phase
    this._evPos  = [];         
    this._eraTapZones = [];

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.app = new PIXI.Application({
      view:            canvas,
      width:           this.w,
      height:          this.h,
      backgroundColor: 0x021115, // deep turquoise sci-fi background
      resolution:      dpr,
      autoDensity:     true,
      antialias:       true,
    });

    /* ── Layers (back → front) ── */
    this.gEra    = new PIXI.Graphics();  // Left sidebar era blocks
    this.gHelix  = new PIXI.Graphics();  // DNA backbone + rungs (glows!)
    this.gRuler  = new PIXI.Graphics();  // Right vertical timeline ruler
    this.gDots   = new PIXI.Graphics();  // tiny event beads
    this.cText   = new PIXI.Container(); // label pool

    this.app.stage.addChild(this.gEra, this.gHelix, this.gRuler, this.gDots, this.cText);

    this._labels       = [];
    this._vertLabels   = [];
    this._rulerLabels  = [];
    this._labelUsed    = 0;

    /* Tooltip overlay */
    this._tip = Object.assign(document.createElement('div'), { id: 'event-tooltip' });
    document.body.appendChild(this._tip);

    this.onEventTap = null;
    this._bindInput();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    this.app.renderer.resize(this.w, this.h);
    this.nav.markDirty();
  }

  /* ── Input: tap, hover ── */
  _bindInput() {
    this.canvas.addEventListener('tl:tap', e => {
      const px = e.detail.x;
      const py = e.detail.y;

      /* Left bar tap? */
      if (px < 32) {
        for (const z of this._eraTapZones) {
          if (py >= z.yMin && py <= z.yMax) {
            const lp1 = this.nav.yearToLogPos(z.era.end);   // newer (bottom)
            const lp2 = this.nav.yearToLogPos(z.era.start); // older (top)
            const pad = (lp2 - lp1) * 0.05;
            this.nav.animateToView(lp1 - pad, lp2 + pad);
            return;
          }
        }
      }

      /* Event dot tap? */
      const hit = this._hitTest(px, py);
      if (hit && this.onEventTap) this.onEventTap(hit);
    });
    this.canvas.addEventListener('mousemove', e => {
      const px = e.clientX;
      const py = e.clientY;
      const hit = this._hitTest(px, py);
      if (hit) {
        this._tip.textContent = hit.title;
        this._tip.style.left  = (px + 12) + 'px';
        this._tip.style.top   = (py - 26) + 'px';
        this._tip.classList.add('visible');
        this.canvas.style.cursor = 'pointer';
      } else if (px < 24) {
        this._tip.classList.remove('visible');
        this.canvas.style.cursor = 'pointer';
      } else {
        this._tip.classList.remove('visible');
        this.canvas.style.cursor = 'grab';
      }
    });
    this.canvas.addEventListener('mouseleave', () => this._tip.classList.remove('visible'));
  }

  _hitTest(px, py) {
    let best = null, bd = 26;
    for (const { ev, x, y } of this._evPos) {
      const d = Math.hypot(px - x, py - y);
      if (d < bd) { best = ev; bd = d; }
    }
    return best;
  }

  /* ── Helix math tied to logPos timeline so it scrolls perfectly ── */
  _angleAt(y, strandOffset = 0) {
    const logPos = this.nav.screenYToLogPos(y, this.h);
    return 2 * Math.PI * HELIX_CYCLES * (logPos / this.nav.range) + this.phase + strandOffset;
  }

  /* ══════════════════════════════════════════
     MAIN DRAW
  ══════════════════════════════════════════ */
  draw(visibleEvents) {
    this._evPos       = [];
    this._eraTapZones = [];
    this._labelUsed   = 0;

    // We can assume user wants Geological since we removed the top selector
    this._drawEra(0); 
    this._drawBackbone();
    this._drawRuler();
    this._drawBeads(visibleEvents);

    for (let i = this._labelUsed; i < this._labels.length; i++) {
      this._labels[i].visible = false;
    }

    return this._getContextLabels();
  }

  /* ── Collect 10 visible labels for HTML context ── */
  _getContextLabels() {
    const nb = 10;
    const buckets = Array(nb).fill(null);
    for (const {ev, x, y} of this._evPos) {
      if (y < 40 || y > this.h - 120) continue;
      const b = Math.min(nb - 1, Math.floor(((y - 40) / (this.h - 160)) * nb));
      if (!buckets[b] || ev.rating > buckets[b].ev.rating) {
        buckets[b] = {ev, x, y};
      }
    }
    return buckets.filter(Boolean).map(b => {
      const outside = b.x > this.w / 2;
      return {
        ev: b.ev,
        text: b.ev.title.length > 25 ? b.ev.title.slice(0, 23) + '…' : b.ev.title,
        x: outside ? b.x + 16 : b.x - 16,
        y: b.y,
        align: outside ? 'left' : 'right',
        color: b.ev.cssColor
      };
    });
  }

  /* ── Left Sidebar Era bands ── */
  _drawEra(dimension) {
    const g = this.gEra;
    g.clear();
    const { w, h } = this;
    const barW  = 16;
    let labelIdx = 0;

    const dim = ERA_DIMENSIONS[dimension];
    for (const era of dim.eras) {
      const y1 = this.nav.yearToScreenY(isFinite(era.start) ? era.start : -5e10, h);
      const y2 = this.nav.yearToScreenY(isFinite(era.end)   ? era.end   : PRESENT_YEAR, h);
      const t  = Math.max(Math.min(y1, y2), 0);
      const b  = Math.min(Math.max(y1, y2), h);
      
      this._eraTapZones.push({ era, yMin: Math.min(y1,y2), yMax: Math.max(y1,y2) });

      if (b <= 0 || t >= h) continue;
      
      // Draw sidebar block
      g.beginFill(era.color, 1.0);
      g.drawRect(0, t, barW, b - t);
      g.endFill();
      // Block border
      if (b - t > 1) {
        g.lineStyle(1, 0x000000, 0.6);
        g.moveTo(0, b); g.lineTo(barW, b);
      }

      // Vertically stacked label
      if (b - t > 50) {
        this._labelVert(era.name, barW / 2 + 1, (t + b) / 2, labelIdx++);
      }
    }
    
    for (let i = labelIdx; i < this._vertLabels.length; i++) {
      this._vertLabels[i].visible = false;
    }
  }

  _labelVert(text, x, y, idx) {
    let lbl;
    if (idx < this._vertLabels.length) {
      lbl = this._vertLabels[idx];
    } else {
      lbl = new PIXI.Text('', new PIXI.TextStyle({
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize:   9, fontWeight: '700',
        fill:       0xffffff, letterSpacing: 2,
      }));
      lbl.anchor.set(0.5, 0.5);
      lbl.rotation = -Math.PI / 2; // sideways text
      this.cText.addChild(lbl);
      this._vertLabels.push(lbl);
    }
    lbl.alpha   = 0.55;
    lbl.text    = text.toUpperCase();
    lbl.visible = true;
    lbl.x       = x;
    lbl.y       = y;
  }

  /* ── Right side dynamic ruler ── */
  _drawRuler() {
    const g = this.gRuler;
    g.clear();
    const { w, h } = this;
    const numTicks = 8;
    let labelIdx = 0;

    for (let i = 0; i <= numTicks; i++) {
      const frac = i / numTicks;
      const rawY = h * (0.05 + frac * 0.9);
      
      const baseYear = this.nav.screenYToYear(rawY, h);
      const nextYear = this.nav.screenYToYear(rawY + (h / numTicks), h);
      const delta = Math.abs(baseYear - nextYear);
      if (delta === 0) continue;
      
      const pwr = Math.floor(Math.log10(delta));
      let mag = Math.pow(10, pwr);
      if (delta / mag < 2) mag /= 2;
      
      const niceYear = Math.round(baseYear / mag) * mag;
      const finalY = this.nav.yearToScreenY(niceYear, h);
      
      if (finalY >= -20 && finalY <= h + 20) {
        g.lineStyle(1.5, 0x00e5ff, 0.4);
        g.moveTo(w, finalY);
        g.lineTo(w - 6, finalY);
        
        let displayStr = formatYear(niceYear);
        if (displayStr === "Present") displayStr = PRESENT_YEAR + " CE";
        this._rulerLabel(displayStr, w - 10, finalY, labelIdx++);
      }
    }
    
    for (let i = labelIdx; i < this._rulerLabels.length; i++) {
      this._rulerLabels[i].visible = false;
    }
  }

  _rulerLabel(text, x, y, idx) {
    let lbl;
    if (idx < this._rulerLabels.length) {
      lbl = this._rulerLabels[idx];
    } else {
      lbl = new PIXI.Text('', new PIXI.TextStyle({
        fontFamily: 'Space Grotesk, monospace',
        fontSize:   10, fontWeight: '500', fill: 0x00e5ff, alpha: 0.8
      }));
      lbl.anchor.set(1, 0.5); // right aligned
      this.cText.addChild(lbl);
      this._rulerLabels.push(lbl);
    }
    lbl.text = text;
    lbl.visible = true;
    lbl.x = x;
    lbl.y = y;
  }

  /* ── DNA backbone with glowing strands and cross-links ── */
  _drawBackbone() {
    const g   = this.gHelix;
    g.clear();
    const { w, h } = this;
    const cx  = w * 0.5;
    const amp = helixAmp(w);
    const step = 3;

    const drawStrand = (offset, color) => {
      // Glow pass
      let first = true;
      for (let y = -20; y <= h + 20; y += step) {
        const a = this._angleAt(y, offset);
        const depth = Math.cos(a);
        const x = cx + amp * Math.sin(a);
        const alpha = 0.08 + depthOf(depth) * 0.16;
        if (first) { g.lineStyle(11, color, alpha); g.moveTo(x, y); first = false; }
        else { g.lineStyle(11, color, alpha); g.lineTo(x, y); }
      }
      
      // Core pass
      first = true;
      for (let y = -20; y <= h + 20; y += step) {
        const a = this._angleAt(y, offset);
        const depth = Math.cos(a);
        const x = cx + amp * Math.sin(a);
        const alpha = 0.25 + depthOf(depth) * 0.65;
        if (first) { g.lineStyle(1.8, color, alpha); g.moveTo(x, y); first = false; }
        else { g.lineStyle(1.8, color, alpha); g.lineTo(x, y); }
      }
    };

    drawStrand(0,       0x00e5ff);  // Cyan strand
    drawStrand(Math.PI, 0x1de9b6);  // Teal strand

    /* cross-links (hydrogen bonds) fixed to the helix angles */
    const numRungsPerCycle = 8;
    const rungStep = (2 * Math.PI) / numRungsPerCycle;
    
    // Invert angle map to find visible rungs
    const aBot = this._angleAt(h, 0);
    const aTop = this._angleAt(0, 0);
    const aMin = Math.min(aBot, aTop);
    const aMax = Math.max(aBot, aTop);
    
    const startRung = Math.floor(aMin / rungStep) * rungStep;
    
    for (let currentA = startRung; currentA <= aMax + rungStep; currentA += rungStep) {
      // logPos = (currentA - phase) * range / (2*PI*C)
      const lp = (currentA - this.phase) * this.nav.range / (2 * Math.PI * HELIX_CYCLES);
      const y = this.nav.yearToScreenY(this.nav.logPosToYear(lp), h);
      
      if (y < -20 || y > h + 20) continue;

      const aA = currentA;
      const xA = cx + amp * Math.sin(aA);
      const xB = cx + amp * Math.sin(aA + Math.PI);
      const depth = Math.cos(aA);
      
      const alpha = 0.15 + depthOf(depth) * 0.35;
      g.lineStyle(1.2, 0x00b0c7, alpha);
      g.moveTo(xA, y);
      g.lineTo(xB, y);
    }
  }

  /* ── Event beads (no glow, tiny size) ── */
  _drawBeads(events) {
    const g   = this.gDots;
    g.clear();
    const { w, h } = this;
    const amp = helixAmp(w);
    const cx  = w * 0.5;
    const showLabels = this.nav.range < 0.007;

    if (events.length > 450) {
      this._drawClusters(events, cx, amp);
      return;
    }

    let toggle = 0;
    for (const ev of events) {
      const sy = this.nav.yearToScreenY(ev.year, h);
      if (sy < -16 || sy > h + 16) continue;

      const strandOff = (toggle % 2 === 0) ? 0 : Math.PI;
      toggle++;

      const a      = this._angleAt(sy, strandOff);
      const x      = cx + amp * Math.sin(a);
      const depth  = Math.cos(a);
      const dn     = depthOf(depth);           // 0 to 1

      const baseR = BASE_DOT_R + (ev.size - BASE_DOT_R) * 0.25;
      const r     = Math.min(baseR * (0.6 + dn * 0.6), MAX_DOT_R);
      const alpha = 0.45 + dn * 0.55;

      // Small solid core dot
      g.beginFill(ev.color, alpha);
      g.drawCircle(x, sy, r);
      g.endFill();

      // Specular highlight to make them look like solid beads
      if (dn > 0.4) {
        g.beginFill(0xffffff, (dn - 0.4) * 0.8);
        g.drawCircle(x - r * 0.3, sy - r * 0.28, r * 0.35);
        g.endFill();
      }

      this._evPos.push({ ev, x, y: sy });

      if (showLabels) {
        const outside = Math.sin(a) >= 0;
        const lx = outside ? x + r + 5 : x - r - 5;
        this._label(ev.title, lx, sy - 5, outside ? 'left' : 'right');
      }
    }
  }

  /* ── Cluster mode (zoomed out) ── */
  _drawClusters(events, cx, amp) {
    const g  = this.gDots;
    const h  = this.h;
    const nb = Math.max(24, Math.floor(h / 14));

    const buckets = Array.from({ length: nb }, () => ({
      best: null, br: -1, count: 0, sumY: 0,
    }));

    for (const ev of events) {
      const sy = this.nav.yearToScreenY(ev.year, h);
      if (sy < 0 || sy > h) continue;
      const bi = Math.min(Math.floor((sy / h) * nb), nb - 1);
      const b  = buckets[bi];
      b.count++; b.sumY += sy;
      if (ev.rating > b.br) { b.best = ev; b.br = ev.rating; }
    }

    let toggle = 0;
    for (const b of buckets) {
      if (!b.best) continue;
      const sy  = b.sumY / b.count;
      const off = (toggle++ % 2 === 0) ? 0 : Math.PI;
      const a   = this._angleAt(sy, off);
      const x   = cx + amp * Math.sin(a);
      const dn  = depthOf(Math.cos(a));
      // Even clustered dots are kept relatively small
      const r   = Math.min(Math.max(Math.log10(b.count + 1) * 1.5 + 1.5, 2.0), 5.5);
      const al  = 0.45 + dn * 0.55;

      g.beginFill(b.best.color, al);
      g.drawCircle(x, sy, r);
      g.endFill();
      
      this._evPos.push({ ev: b.best, x, y: sy });
    }
  }

  /* ── Text label pool ── */
  _label(text, x, y, align) {
    let lbl;
    if (this._labelUsed < this._labels.length) {
      lbl = this._labels[this._labelUsed];
    } else {
      lbl = new PIXI.Text('', new PIXI.TextStyle({
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize:   10.5,
        fill:       0x8ae6e2, // turquoise tinted text
        padding:    1,
      }));
      this.cText.addChild(lbl);
      this._labels.push(lbl);
    }
    const t = text.length > 34 ? text.slice(0, 32) + '…' : text;
    lbl.text    = t;
    lbl.visible = true;
    lbl.y       = y - 4;
    lbl.x       = align === 'right' ? x - lbl.width : x;
    this._labelUsed++;
  }

  startLoop(fn) { this.app.ticker.add(fn); }
  destroy()      { this.app.destroy(false); }
}


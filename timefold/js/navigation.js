/* ─────────────────────────────────────────────
   navigation.js — View state, log-scale math,
   single-finger pan + zoom controls
───────────────────────────────────────────── */

class Navigation {
  constructor() {
    /* View window in log-space [0..1]
       0 = present,  1 = oldest possible event
       viewTop is at the TOP of screen (older),
       viewBot is at the BOTTOM of screen (newer). */
    this.viewTop = 1.0;   // default: Big Bang at top
    this.viewBot = 0.0;   // default: present at bottom

    this.velY = 0;        // momentum velocity (log-space units/frame)
    this._dirty = true;

    this.MIN_RANGE = 0.0008;  // max zoom (~decades visible)
    this.MAX_RANGE = 1.0;     // min zoom (whole timeline)
  }

  /* ── Core math ── */
  get range() { return this.viewTop - this.viewBot; }

  yearToLogPos(year) { return yearToLogPos(year); }   // from data.js
  logPosToYear(lp)   { return logPosToYear(lp);   }

  yearToScreenY(year, height) {
    const lp = this.yearToLogPos(year);
    // viewTop → y=0, viewBot → y=height
    const frac = (lp - this.viewBot) / (this.viewTop - this.viewBot);
    return (1 - frac) * height;
  }

  screenYToYear(y, height) {
    const frac = 1 - y / height;
    const lp   = this.viewBot + frac * this.range;
    return this.logPosToYear(lp);
  }

  screenYToLogPos(y, height) {
    const frac = 1 - y / height;
    return this.viewBot + frac * this.range;
  }

  centerYear(height) {
    return this.screenYToYear(height / 2, height);
  }

  getViewYearRange() {
    return {
      minYear: this.logPosToYear(this.viewTop), // oldest (top)
      maxYear: this.logPosToYear(this.viewBot),  // newest (bottom)
    };
  }

  /* ── Pan: positive deltaLog → move toward the past ── */
  pan(deltaLog) {
    const r = this.range;
    let newBot = this.viewBot + deltaLog;
    let newTop = this.viewTop + deltaLog;
    // Clamp
    if (newBot < 0)          { newBot = 0;   newTop = r; }
    if (newTop > this.MAX_RANGE) { newTop = this.MAX_RANGE; newBot = newTop - r; }
    this.viewBot = newBot;
    this.viewTop = newTop;
    this._dirty = true;
  }

  /* ── Zoom around a pivot logPos ── */
  zoomAround(factor, pivotLogPos) {
    const r     = this.range;
    const newR  = Math.min(this.MAX_RANGE, Math.max(this.MIN_RANGE, r * factor));
    const t     = (pivotLogPos - this.viewBot) / r; // relative position in [0,1]
    this.viewBot = pivotLogPos - t * newR;
    this.viewTop = this.viewBot + newR;
    // Clamp
    if (this.viewBot < 0)               { this.viewBot = 0; this.viewTop = newR; }
    if (this.viewTop > this.MAX_RANGE)  { this.viewTop = this.MAX_RANGE; this.viewBot = this.MAX_RANGE - newR; }
    this._dirty = true;
  }

  /* ── Zoom to a specific year range (for era buttons) ── */
  zoomToYears(minY, maxY) {
    const lp1 = this.yearToLogPos(maxY);  // newer = lower logPos = viewBot
    const lp2 = this.yearToLogPos(minY);  // older = higher logPos = viewTop
    const pad  = (lp2 - lp1) * 0.05;
    this.viewBot = Math.max(0, lp1 - pad);
    this.viewTop = Math.min(1, lp2 + pad);
    this.dirty = true;
    this.updateZoomNorm();
  }

  animateToLogPos(targetBot) {
    this._targetBot = Math.max(0, Math.min(1 - this.range, targetBot));
    this._isAnimating = true;
    this.markDirty();
  }

  animateToView(targetBot, targetTop) {
    this._targetBot = Math.max(0, Math.min(this.MAX_RANGE, targetBot));
    this._targetTop = Math.max(0, Math.min(this.MAX_RANGE, targetTop));
    this._targetRange = this._targetTop - this._targetBot;
    this._isAnimatingView = true;
    this._isAnimating = false; // cancel regular pan animation
    this.markDirty();
  }

  updateZoomNorm() {
    this.zoomNorm = (this.range - this.MIN_RANGE) / (this.MAX_RANGE - this.MIN_RANGE);
  }

  markDirty() { this.dirty = true; }

  update(delta) {
    let changed = false;

    // View bounds animation (pan + zoom)
    if (this._isAnimatingView) {
      const diffBot = this._targetBot - this.viewBot;
      const diffRange = this._targetRange - this.range;
      
      if (Math.abs(diffBot) < 0.0001 && Math.abs(diffRange) < 0.0001) {
        this.viewBot = this._targetBot;
        this.viewTop = this._targetTop;
        this._isAnimatingView = false;
      } else {
        this.viewBot += diffBot * 0.1 * delta;
        const newRange = this.range + diffRange * 0.1 * delta;
        this.viewTop = this.viewBot + newRange;
      }
      changed = true;
    }
    // Smooth panning animation
    else if (this._isAnimating) {
      const diff = this._targetBot - this.viewBot;
      if (Math.abs(diff) < 0.0001) {
        this.viewBot = this._targetBot;
        this._isAnimating = false;
      } else {
        this.viewBot += diff * 0.12 * delta;
      }
      this.viewTop = this.viewBot + this.range;
      changed = true;
    }

    // Apply Momentum
    if (Math.abs(this.velY) > 0.01) {
      this.viewBot += this.velY * delta;
      this.velY *= this.friction ** delta;
      changed = true;
    } else {
      this.velY = 0;
    }

    if (this.dirty) { changed = true; this.dirty = false; }
    if (changed) this.constrain();
    return changed;
  }

  constrain() {
    // Clamp viewBot and viewTop to [0, MAX_RANGE]
    if (this.viewBot < 0) {
      this.viewBot = 0;
      this.viewTop = this.range;
    }
    if (this.viewTop > this.MAX_RANGE) {
      this.viewTop = this.MAX_RANGE;
      this.viewBot = this.MAX_RANGE - this.range;
    }
    // Ensure range is within MIN_RANGE and MAX_RANGE
    if (this.range < this.MIN_RANGE) {
      const center = (this.viewBot + this.viewTop) / 2;
      this.viewBot = center - this.MIN_RANGE / 2;
      this.viewTop = center + this.MIN_RANGE / 2;
    }
    if (this.range > this.MAX_RANGE) {
      const center = (this.viewBot + this.viewTop) / 2;
      this.viewBot = center - this.MAX_RANGE / 2;
      this.viewTop = center + this.MAX_RANGE / 2;
    }
    this.updateZoomNorm();
    this.dirty = true;
  }

  /* ── Setup all input handlers ── */
  setupInput(canvas) {
    /* ── Touch: single-finger pan ── */
    let t0y = null, prevY = null, lastVelY = 0, t0time = 0, t0screenY = 0;
    let pinchDist0 = null, pinchMidLP = null;

    const getTouchDist = (t) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      this.velY = 0;

      if (e.touches.length === 1) {
        t0y = e.touches[0].clientY;
        t0screenY = t0y;
        prevY = t0y;
        t0time = Date.now();
        lastVelY = 0;
        pinchDist0 = null;
      } else if (e.touches.length === 2) {
        pinchDist0 = getTouchDist(e.touches);
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        pinchMidLP = this.screenYToLogPos(midY, canvas.clientHeight);
        t0y = null;
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      const h = canvas.clientHeight;

      if (e.touches.length === 1 && t0y !== null) {
        const curY = e.touches[0].clientY;
        const dy   = curY - prevY;          // pixels moved
        // pixels → log-space: dy pixels moves (dy/h)*range in logPos
        // dragging DOWN means moving toward present (decrease logPos) → deltaLog negative
        const dLog = -(dy / h) * this.range;
        this.pan(dLog);
        lastVelY = dLog / (1000 / 60); // log/frame estimate
        prevY    = curY;

      } else if (e.touches.length === 2 && pinchDist0 !== null) {
        const dist = getTouchDist(e.touches);
        const factor = pinchDist0 / dist;
        this.zoomAround(factor, pinchMidLP);
        pinchDist0 = dist;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        pinchMidLP = this.screenYToLogPos(midY, h);
      }
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      const dt = Date.now() - t0time;
      const dy = (prevY !== null && t0screenY !== null)
        ? Math.abs(prevY - t0screenY) : 999;

      // Tap detection
      if (dt < 300 && dy < 12 && e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        canvas.dispatchEvent(new CustomEvent('tl:tap', {
          detail: { x: touch.clientX, y: touch.clientY }
        }));
        // Double-tap: zoom in
        const now = Date.now();
        if (this._lastTap && now - this._lastTap < 350) {
          const lp = this.screenYToLogPos(touch.clientY, canvas.clientHeight);
          this.zoomAround(0.35, lp);
          this._lastTap = 0;
        } else {
          this._lastTap = now;
        }
      } else {
        // Apply momentum
        this.velY = lastVelY * 1.2;
      }

      t0y = null; prevY = null; pinchDist0 = null;
    }, { passive: false });

    /* ── Mouse: drag to pan ── */
    let mouseDown = false, mouseDownY = 0, mousePrevY = 0, mouseVelY = 0, totalDragDist = 0;

    canvas.addEventListener('mousedown', e => {
      mouseDown = true;
      mouseDownY = mousePrevY = e.clientY;
      mouseVelY = 0;
      totalDragDist = 0;
      this.velY = 0;
    });
    window.addEventListener('mousemove', e => {
      if (!mouseDown) return;
      const dy   = e.clientY - mousePrevY;
      totalDragDist += Math.abs(dy);
      const dLog = -(dy / canvas.clientHeight) * this.range;
      this.pan(dLog);
      mouseVelY = dLog;
      mousePrevY = e.clientY;
    });
    window.addEventListener('mouseup', () => {
      if (!mouseDown) return;
      mouseDown = false;
      if (totalDragDist > 6) this.velY = mouseVelY * 1.1;
    });

    /* ── Mouse click (tap) ── */
    canvas.addEventListener('click', e => {
      if (totalDragDist < 6) {
        canvas.dispatchEvent(new CustomEvent('tl:tap', {
          detail: { x: e.clientX, y: e.clientY }
        }));
      }
    });

    /* ── Scroll wheel: zoom ── */
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const h   = canvas.clientHeight;
      const lp  = this.screenYToLogPos(e.clientY, h);
      const fac = e.deltaY > 0 ? 1.12 : 0.88;
      this.zoomAround(fac, lp);
    }, { passive: false });

    /* ── Zoom buttons ── */
    document.getElementById('zoom-in').addEventListener('click', () => {
      this.zoomAround(0.5, this.viewBot + this.range * 0.5);
    });
    document.getElementById('zoom-out').addEventListener('click', () => {
      this.zoomAround(2.0, this.viewBot + this.range * 0.5);
    });
  }
}

import { html, css } from 'lit';
import { CfBase } from '../base.js';

/**
 * <cf-yoke> — 2D touch pad + gyro for aileron/elevator
 *
 * Props: cmd-ail, cmd-elv, sensitivity, deadzone, modes (JSON: ["touch","gyro"])
 */
export class CfYoke extends CfBase {
  static properties = {
    ...CfBase.properties,
    'cmd-ail': { type: String },
    'cmd-elv': { type: String },
    sensitivity: { type: Number },
    deadzone: { type: Number },
    modes: { type: String },
  };

  static styles = [CfBase.styles, css`
    :host { gap: 4px; }
    .bar { display: flex; gap: 5px; align-items: center; }
    .yk-btn {
      padding: 3px 10px; background: var(--cf-bg); border: 1px solid var(--cf-border);
      border-radius: 3px; font-family: 'Orbitron', sans-serif; font-size: 7px; font-weight: 500;
      color: var(--cf-dim); letter-spacing: 1px; cursor: pointer; transition: all .12s;
    }
    .yk-btn.on { border-color: var(--cf-accent); color: var(--cf-accent); }
    .yk-btn.lk { border-color: var(--cf-red); color: var(--cf-red); }
    .pad {
      width: min(42vw, calc(100dvh - 110px)); height: min(42vw, calc(100dvh - 110px));
      max-width: 260px; max-height: 260px; border-radius: 50%;
      background: radial-gradient(circle, #181a1f, #101216 60%, #0c0e12);
      border: 1.5px solid var(--cf-border);
      box-shadow: inset 0 0 40px rgba(0,0,0,.4); position: relative; touch-action: none;
    }
    .pad::before {
      content: ''; position: absolute; inset: 0; border-radius: 50%; pointer-events: none;
      background:
        linear-gradient(90deg, transparent 49.6%, rgba(255,255,255,.03) 49.6%, rgba(255,255,255,.03) 50.4%, transparent 50.4%),
        linear-gradient(0deg, transparent 49.6%, rgba(255,255,255,.03) 49.6%, rgba(255,255,255,.03) 50.4%, transparent 50.4%);
    }
    .dot {
      position: absolute; width: 18px; height: 18px; border-radius: 50%;
      background: radial-gradient(circle at 38% 32%, #6abfff, #2a8aee);
      box-shadow: 0 0 10px rgba(74,170,255,.3);
      transform: translate(-50%, -50%); top: 50%; left: 50%;
      pointer-events: none; z-index: 2;
    }
    .dot.smooth { transition: top .08s, left .08s; }
    .rd { display: flex; gap: 14px; }
    .rv { font-family: 'Share Tech Mono', monospace; font-size: 11px; font-weight: 700; color: var(--cf-accent); }
    .rv small { color: var(--cf-dim); font-size: 7px; margin-right: 3px; }
  `];

  _touching = false;
  _ail = 0;
  _elv = 0;
  _mode = 'touch';
  _locked = false;
  _gyroOk = false;
  _gbc = 0;
  _ggc = 0;
  _sendTimer = null;

  constructor() {
    super();
    this['cmd-ail'] = 'AILERON';
    this['cmd-elv'] = 'ELEVATOR';
    this.sensitivity = 1;
    this.deadzone = 0.05;
    this.modes = '["touch","gyro"]';
  }

  render() {
    let modeList = [];
    try { modeList = JSON.parse(this.modes); } catch {}

    return html`
      <div class="bar">
        ${modeList.map((m, i) => html`<button class="yk-btn ${this._mode === m ? 'on' : ''}" @click=${() => this._setMode(m)}>${m.toUpperCase().slice(0, 3)}</button>`)}
        <button class="yk-btn" @click=${this._center}>CTR</button>
        <button class="yk-btn ${this._locked ? 'lk' : ''}" @click=${this._toggleLock}>${this._locked ? 'UNLK' : 'LOCK'}</button>
      </div>
      <div class="pad" @pointerdown=${this._down} @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
        <div class="dot ${this._mode === 'gyro' ? 'smooth' : ''}" style="left:${50 + this._ail * 44}%;top:${50 + this._elv * 44}%"></div>
      </div>
      <div class="rd">
        <span class="rv"><small>AIL</small>${(this._ail >= 0 ? '+' : '') + this._ail.toFixed(2)}</span>
        <span class="rv"><small>ELV</small>${(this._elv >= 0 ? '+' : '') + this._elv.toFixed(2)}</span>
      </div>
    `;
  }

  _dz(v) {
    const d = this.deadzone;
    if (Math.abs(v) < d) return 0;
    return (v > 0 ? 1 : -1) * (Math.abs(v) - d) / (1 - d);
  }

  _set(a, e) {
    if (this._locked) return;
    const s = this.sensitivity;
    this._ail = Math.max(-1, Math.min(1, this._dz(a * s)));
    this._elv = Math.max(-1, Math.min(1, this._dz(e * s)));
    this.requestUpdate();
    if (!this._sendTimer) {
      this._sendTimer = setTimeout(() => {
        this._sendTimer = null;
        this.dispatchEvent(new CustomEvent('cf-input', { detail: { cmd: this['cmd-ail'], value: this._ail }, bubbles: true, composed: true }));
        this.dispatchEvent(new CustomEvent('cf-input', { detail: { cmd: this['cmd-elv'], value: this._elv }, bubbles: true, composed: true }));
      }, 33);
    }
  }

  _reset() { this._set(0, 0); }

  // Touch
  _down(e) { if (this._mode !== 'touch' || this._locked) return; e.preventDefault(); this._touching = true; e.target.closest('.pad')?.setPointerCapture(e.pointerId); this._calc(e); }
  _move(e) { if (this._touching) this._calc(e); }
  _up() { if (!this._touching) return; this._touching = false; this._reset(); }
  _calc(e) {
    const pad = this.renderRoot.querySelector('.pad');
    const r = pad.getBoundingClientRect();
    let x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    let y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    const d = Math.sqrt(x * x + y * y);
    if (d > 1) { x /= d; y /= d; }
    this._set(x, y);
  }

  // Gyro
  _setMode(m) {
    this._mode = m;
    this._reset();
    if (m === 'gyro' && !this._gyroOk) this._startGyro();
    this.requestUpdate();
  }

  _startGyro() {
    window.addEventListener('deviceorientation', e => {
      if (this._mode !== 'gyro' || this._locked || (e.beta === null && e.gamma === null)) return;
      const rb = e.beta || 0, rg = e.gamma || 0;
      const a = screen.orientation?.angle ?? window.orientation ?? 0;
      let b, g;
      if (a === 90) { b = -rg; g = rb; } else if (a === -90 || a === 270) { b = rg; g = -rb; } else if (a === 180) { b = -rb; g = -rg; } else { b = rb; g = rg; }
      if (!this._gyroOk) { this._gbc = b; this._ggc = g; this._gyroOk = true; }
      this._set((g - this._ggc) / 45, (b - this._gbc) / 35);
    });
  }

  _center() { this._reset(); if (this._mode === 'gyro') this._gyroOk = false; }
  _toggleLock() { this._locked = !this._locked; this.requestUpdate(); }
}
customElements.define('cf-yoke', CfYoke);

import { html, css } from 'lit';
import { CfBase } from '../base.js';

/**
 * <cf-knob> — Rotary knob with +/- buttons (heading bug, course, baro, etc.)
 *
 * Props: cmd, label, step, value, min, max, format (int/heading/decimal)
 */
export class CfKnob extends CfBase {
  static properties = { ...CfBase.properties, step: { type: Number }, format: { type: String } };

  static styles = [CfBase.styles, css`
    :host { gap: 3px; }
    .knob-row { display: flex; align-items: center; gap: 4px; }
    .knob-btn {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--cf-surface); border: 1px solid var(--cf-border);
      color: var(--cf-dim); font-size: 14px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .12s;
    }
    .knob-btn:active { border-color: var(--cf-accent); color: var(--cf-accent); }
    .knob-val {
      font-family: 'Share Tech Mono', monospace; font-size: 15px;
      font-weight: 700; color: var(--cf-accent); min-width: 40px; text-align: center;
    }
  `];

  _timer = null;

  constructor() { super(); this.step = 1; this.format = 'int'; }

  render() {
    return html`
      ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      <div class="knob-row">
        <button class="knob-btn" @pointerdown=${() => this._start(-1)} @pointerup=${this._stop} @pointerleave=${this._stop}>&#8722;</button>
        <span class="knob-val">${this._fmt(this.value)}</span>
        <button class="knob-btn" @pointerdown=${() => this._start(1)} @pointerup=${this._stop} @pointerleave=${this._stop}>+</button>
      </div>
    `;
  }

  _fmt(v) {
    if (this.format === 'heading') return String(Math.round(((v % 360) + 360) % 360)).padStart(3, '0');
    if (this.format === 'decimal') return v.toFixed(1);
    return Math.round(v);
  }

  _nudge(dir) {
    let v = this.value + dir * this.step;
    if (v < this.min) v = this.min;
    if (v > this.max) v = this.max;
    this._send(v);
  }

  _start(dir) { this._nudge(dir); this._timer = setInterval(() => this._nudge(dir), 120); }
  _stop = () => { clearInterval(this._timer); };
}
customElements.define('cf-knob', CfKnob);

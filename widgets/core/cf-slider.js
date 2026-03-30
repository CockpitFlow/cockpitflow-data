import { html, css } from 'lit';
import { CfBase } from '../base.js';

/**
 * <cf-slider> — Vertical slider (throttle, mixture, etc.)
 *
 * Props: cmd, label, color (accent/red/amber), value (0-1), min, max
 */
export class CfSlider extends CfBase {
  static styles = [CfBase.styles, css`
    :host { gap: 2px; cursor: grab; touch-action: none; }
    .track {
      flex: 1; width: 100%; position: relative;
    }
    .rail {
      position: absolute; left: 50%; transform: translateX(-50%);
      width: 10px; height: 100%;
      background: linear-gradient(180deg, #0a0b0d, #161820, #0a0b0d);
      border: 1px solid #1e2028; border-radius: 5px;
    }
    .fill {
      position: absolute; left: 50%; transform: translateX(-50%);
      width: 6px; bottom: 0; border-radius: 3px; opacity: .5;
    }
    .thumb {
      position: absolute; left: 50%; transform: translate(-50%, 50%);
      width: 30px; height: 14px; border-radius: 3px;
      border: 1px solid; z-index: 2; pointer-events: none;
      box-shadow: 0 2px 6px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08);
    }
    .ticks {
      position: absolute; left: 50%; transform: translateX(-50%);
      width: 20px; height: 100%; display: flex; flex-direction: column;
      justify-content: space-between; padding: 4px 0; pointer-events: none;
    }
    .tick { width: 100%; height: 1px; background: rgba(255,255,255,.06); }
  `];

  _dragging = false;

  render() {
    const pct = ((this.value - this.min) / (this.max - this.min)) * 100;
    const c = this._c(this.color);
    return html`
      ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      <div class="track" @pointerdown=${this._down} @pointermove=${this._move}
           @pointerup=${this._up} @pointercancel=${this._up}>
        <div class="rail"></div>
        <div class="fill" style="height:${pct}%;background:${c}"></div>
        <div class="ticks">${[0,1,2,3,4].map(() => html`<div class="tick"></div>`)}</div>
        <div class="thumb" style="bottom:${pct}%;background:linear-gradient(180deg,${this.color === 'red' ? '#cc3030,#771818' : this.color === 'amber' ? '#ccaa22,#776610' : '#3a3d44,#22242a'});border-color:${c}"></div>
      </div>
      <span class="value">${Math.round(pct)}%</span>
    `;
  }

  _down(e) { e.preventDefault(); this._dragging = true; e.target.closest('.track')?.setPointerCapture(e.pointerId); this._calc(e); }
  _move(e) { if (this._dragging) this._calc(e); }
  _up() { this._dragging = false; }

  _calc(e) {
    const track = this.renderRoot.querySelector('.track');
    const rect = track.getBoundingClientRect();
    const raw = 1 - (e.clientY - rect.top) / rect.height;
    const val = this.min + Math.max(0, Math.min(1, raw)) * (this.max - this.min);
    this._send(val);
  }
}
customElements.define('cf-slider', CfSlider);

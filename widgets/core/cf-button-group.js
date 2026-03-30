import { html, css } from 'lit';
import { CfBase } from '../base.js';

/**
 * <cf-button-group> — Row of selectable buttons (magneto, flaps, autobrake, etc.)
 *
 * Props: cmd, label, options (JSON: [{"value":0,"label":"OFF"},{"value":1,"label":"ON"}])
 *        spring (value to spring back to on release, e.g. magneto START→BOTH)
 */
export class CfButtonGroup extends CfBase {
  static properties = {
    ...CfBase.properties,
    options: { type: String },  // JSON array
    spring: { type: String },   // JSON: {"from":4,"to":3}
  };

  static styles = [CfBase.styles, css`
    :host { gap: 3px; }
    .group { display: flex; gap: 2px; flex-wrap: wrap; justify-content: center; }
    .opt {
      padding: 4px 8px; background: var(--cf-surface);
      border: 1px solid var(--cf-border); border-radius: 3px;
      color: var(--cf-dim); font-family: 'Share Tech Mono', monospace;
      font-size: 9px; font-weight: 700; cursor: pointer; transition: all .12s;
    }
    .opt.on {
      border-color: var(--cf-accent); color: var(--cf-accent);
      background: rgba(74,158,255,.06);
    }
    .opt.spring { border-color: #422; color: #966; }
    .opt.spring:active { border-color: var(--cf-red); color: var(--cf-red); }
  `];

  constructor() { super(); this.options = '[]'; this.spring = ''; }

  render() {
    let opts = [];
    try { opts = JSON.parse(this.options); } catch {}
    const springCfg = this.spring ? JSON.parse(this.spring) : null;

    return html`
      ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      <div class="group">
        ${opts.map(o => {
          const isSpring = springCfg && o.value === springCfg.from;
          const isOn = this.value === o.value;
          return html`<button class="opt ${isOn ? 'on' : ''} ${isSpring ? 'spring' : ''}"
            @pointerdown=${() => this._select(o.value)}
            @pointerup=${() => isSpring && this._springBack(springCfg)}
            @pointerleave=${() => isSpring && this.value === o.value && this._springBack(springCfg)}
          >${o.label}</button>`;
        })}
      </div>
    `;
  }

  _select(val) { this._send(val); }
  _springBack(cfg) { this._send(cfg.to); }
}
customElements.define('cf-button-group', CfButtonGroup);

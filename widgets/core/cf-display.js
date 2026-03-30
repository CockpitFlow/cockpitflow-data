import { html, css } from 'lit';
import { CfBase } from '../base.js';

/**
 * <cf-display> — Numeric/text readout from sim
 *
 * Props: dataref, label, unit, format (int/signed/heading/decimal), thresholds (JSON)
 */
export class CfDisplay extends CfBase {
  static properties = {
    ...CfBase.properties,
    format: { type: String },
    thresholds: { type: String }, // JSON: [{"below":45,"color":"red"},{"below":60,"color":"amber"}]
  };

  static styles = [CfBase.styles, css`
    :host { flex-direction: row; gap: 4px; padding: 2px 8px; }
    .lbl { font-family: 'Orbitron', sans-serif; font-size: 7px; font-weight: 500; color: var(--cf-dim); letter-spacing: 1px; width: 26px; }
    .val {
      font-family: 'Share Tech Mono', monospace; font-size: 19px; font-weight: 700;
      color: var(--cf-green); text-align: right; flex: 1;
      text-shadow: 0 0 8px rgba(68,221,102,.1);
    }
    .val.warn { color: var(--cf-amber); }
    .val.danger { color: var(--cf-red); }
    .unit { font-size: 7px; color: var(--cf-dim); width: 22px; margin-left: 3px; }
  `];

  constructor() {
    super();
    this.format = 'int';
    this.thresholds = '[]';
  }

  render() {
    const formatted = this._format(this.value);
    const cls = this._threshold(this.value);
    return html`
      ${this.label ? html`<span class="lbl">${this.label}</span>` : ''}
      <span class="val ${cls}">${formatted}</span>
      ${this.unit ? html`<span class="unit">${this.unit}</span>` : ''}
    `;
  }

  _format(v) {
    if (v === undefined || v === null) return '---';
    switch (this.format) {
      case 'heading': return String(Math.round(v)).padStart(3, '0');
      case 'signed': { const n = Math.round(v); return (n >= 0 ? '+' : '') + n; }
      case 'decimal': return v.toFixed(1);
      default: return Math.round(v);
    }
  }

  _threshold(v) {
    try {
      const t = JSON.parse(this.thresholds);
      for (const rule of t) {
        if (v < rule.below) return rule.color === 'red' ? 'danger' : 'warn';
      }
    } catch {}
    return '';
  }
}
customElements.define('cf-display', CfDisplay);

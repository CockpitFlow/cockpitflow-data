import { html, css } from 'lit';
import { CfBase } from '../base.js';

/**
 * <cf-indicator> — Status light (gear, AP, warnings)
 *
 * Props: dataref, label, color, threshold (value above which = ON)
 */
export class CfIndicator extends CfBase {
  static properties = { ...CfBase.properties, threshold: { type: Number } };

  static styles = [CfBase.styles, css`
    :host { gap: 2px; }
    .dot {
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--cf-dim); border: 1px solid var(--cf-border);
      transition: all .2s;
    }
    :host([on]) .dot {
      background: var(--color);
      box-shadow: 0 0 8px var(--color);
      border-color: var(--color);
    }
  `];

  static properties = { ...CfBase.properties, threshold: { type: Number }, on: { type: Boolean, reflect: true } };

  constructor() { super(); this.threshold = 0.5; this.on = false; }

  render() {
    return html`
      <div class="dot" style="--color:${this._c(this.color)}"></div>
      ${this.label ? html`<span class="label">${this.label}</span>` : ''}
    `;
  }

  setValue(v) { this.value = v; this.on = v > this.threshold; }
}
customElements.define('cf-indicator', CfIndicator);

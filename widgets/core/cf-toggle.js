import { html, css } from 'lit';
import { CfBase } from '../base.js';

/**
 * <cf-toggle> — Pill switch (on/off)
 *
 * Props: cmd, label, color (accent/red), value (0 or 1)
 */
export class CfToggle extends CfBase {
  static styles = [CfBase.styles, css`
    :host { gap: 3px; cursor: pointer; }
    .pill {
      width: 26px; height: 13px; border-radius: 7px;
      background: var(--cf-surface); border: 1px solid var(--cf-border);
      position: relative; transition: all .12s;
    }
    .pill::after {
      content: ''; position: absolute; width: 9px; height: 9px; border-radius: 50%;
      top: 1px; left: 1px; background: var(--cf-dim); transition: all .12s;
    }
    :host([on]) .pill { border-color: var(--color); background: color-mix(in srgb, var(--color) 8%, transparent); }
    :host([on]) .pill::after { left: 14px; background: var(--color); box-shadow: 0 0 4px var(--color); }
  `];

  static properties = { ...CfBase.properties, on: { type: Boolean, reflect: true } };

  constructor() { super(); this.on = false; }

  render() {
    return html`
      ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      <div class="pill" style="--color:${this._c(this.color)}" @click=${this._tap}></div>
    `;
  }

  _tap() {
    this.on = !this.on;
    this._send(this.on ? 1 : 0);
  }

  setValue(v) { this.on = v > 0.5; this.value = v; }
}
customElements.define('cf-toggle', CfToggle);

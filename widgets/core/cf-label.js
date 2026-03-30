import { html, css } from 'lit';
import { CfBase } from '../base.js';

/**
 * <cf-label> — Static text/separator
 *
 * Props: label, size (sm/md/lg)
 */
export class CfLabel extends CfBase {
  static properties = { ...CfBase.properties, size: { type: String } };

  static styles = [CfBase.styles, css`
    :host { justify-content: center; }
    .text { font-family: 'Orbitron', sans-serif; letter-spacing: 2px; color: var(--cf-dim); }
    .text.sm { font-size: 7px; }
    .text.md { font-size: 10px; }
    .text.lg { font-size: 14px; }
  `];

  constructor() { super(); this.size = 'sm'; }

  render() {
    return html`<span class="text ${this.size}">${this.label}</span>`;
  }
}
customElements.define('cf-label', CfLabel);

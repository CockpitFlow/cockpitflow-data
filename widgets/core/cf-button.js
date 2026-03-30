import { html, css } from 'lit';
import { CfBase } from '../base.js';

/**
 * <cf-button> — Simple press button, sends command on tap
 *
 * Props: cmd, label, color, momentary (hold to activate, release to deactivate)
 */
export class CfButton extends CfBase {
  static properties = { ...CfBase.properties, momentary: { type: Boolean } };

  static styles = [CfBase.styles, css`
    :host { cursor: pointer; }
    .btn {
      padding: 8px 12px; background: var(--cf-surface);
      border: 1px solid var(--cf-border); border-radius: 4px;
      color: var(--cf-dim); font-family: 'Share Tech Mono', monospace;
      font-size: 11px; font-weight: 700; letter-spacing: .5px;
      text-align: center; transition: all .12s; width: 100%;
    }
    .btn:active, :host([pressed]) .btn {
      border-color: var(--color); color: var(--color);
      background: color-mix(in srgb, var(--color) 6%, transparent);
    }
  `];

  static properties = { ...CfBase.properties, momentary: { type: Boolean }, pressed: { type: Boolean, reflect: true } };

  constructor() { super(); this.momentary = false; this.pressed = false; }

  render() {
    return html`
      <div class="btn" style="--color:${this._c(this.color)}"
        @pointerdown=${this._down} @pointerup=${this._up} @pointerleave=${this._up}>
        ${this.label || this.cmd}
      </div>
    `;
  }

  _down(e) {
    e.preventDefault();
    this.pressed = true;
    this._send(1);
  }

  _up() {
    if (this.momentary && this.pressed) {
      this.pressed = false;
      this._send(0);
    } else if (!this.momentary) {
      this.pressed = false;
    }
  }
}
customElements.define('cf-button', CfButton);

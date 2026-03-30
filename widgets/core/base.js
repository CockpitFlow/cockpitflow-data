import { LitElement, css } from 'lit';

/**
 * Base class for all CockpitFlow widgets.
 * Handles: sim communication, value binding, common styling.
 *
 * Subclasses implement: render(), _onInput(value)
 */
export class CfBase extends LitElement {
  static properties = {
    // Binding
    cmd: { type: String },           // command to send to sim
    dataref: { type: String },       // dataref to read from sim state
    value: { type: Number },         // current value (0-1 or raw)
    min: { type: Number },
    max: { type: Number },

    // Display
    label: { type: String },
    unit: { type: String },
    color: { type: String },         // accent, red, amber, green
    disabled: { type: Boolean },
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: #c8ccd4;
      overflow: hidden;
      --cf-accent: #4a9eff;
      --cf-green: #44dd66;
      --cf-amber: #ddaa44;
      --cf-red: #ee4444;
      --cf-dim: #5a5e66;
      --cf-bg: #111317;
      --cf-surface: #1c1e22;
      --cf-border: #2a2d33;
    }
    :host([disabled]) { opacity: .3; pointer-events: none; }
    .label {
      font-family: 'Orbitron', sans-serif;
      font-size: 7px; font-weight: 700;
      color: var(--cf-dim); letter-spacing: 1px;
    }
    .value {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px; font-weight: 700;
      color: var(--cf-accent);
    }
  `;

  constructor() {
    super();
    this.cmd = '';
    this.dataref = '';
    this.value = 0;
    this.min = 0;
    this.max = 1;
    this.label = '';
    this.unit = '';
    this.color = 'accent';
    this.disabled = false;
  }

  /** Color CSS var from color name */
  _c(name) {
    const map = { accent: '--cf-accent', red: '--cf-red', amber: '--cf-amber', green: '--cf-green' };
    return `var(${map[name] || map.accent})`;
  }

  /** Send value to sim via CockpitFlow API */
  _send(val) {
    this.value = val;
    this.dispatchEvent(new CustomEvent('cf-input', {
      detail: { cmd: this.cmd, value: val },
      bubbles: true, composed: true,
    }));
  }

  /** Update from sim state (called externally) */
  setValue(val) {
    this.value = val;
  }
}

// CockpitFlow Widget Library
// Web Components for flight simulator cockpit UIs
//
// Usage: <script type="module" src="cf-widgets.js"></script>
// Then use: <cf-slider cmd="THROTTLE" label="THR"></cf-slider>

export { CfBase } from './base.js';
export { CfSlider } from './widgets/cf-slider.js';
export { CfToggle } from './widgets/cf-toggle.js';
export { CfDisplay } from './widgets/cf-display.js';
export { CfButton } from './widgets/cf-button.js';
export { CfButtonGroup } from './widgets/cf-button-group.js';
export { CfKnob } from './widgets/cf-knob.js';
export { CfYoke } from './widgets/cf-yoke.js';
export { CfIndicator } from './widgets/cf-indicator.js';
export { CfLabel } from './widgets/cf-label.js';

// Registry of all widget tags for dynamic creation
export const WIDGETS = {
  'cf-slider': { name: 'Slider', desc: 'Vertical lever (throttle, mixture)' },
  'cf-toggle': { name: 'Toggle', desc: 'On/off switch' },
  'cf-display': { name: 'Display', desc: 'Numeric readout from sim' },
  'cf-button': { name: 'Button', desc: 'Press to send command' },
  'cf-button-group': { name: 'Button Group', desc: 'Select from options (magneto, flaps)' },
  'cf-knob': { name: 'Knob', desc: 'Rotary +/- (heading, course, baro)' },
  'cf-yoke': { name: 'Yoke', desc: '2D pad + gyro (aileron/elevator)' },
  'cf-indicator': { name: 'Indicator', desc: 'Status light (gear, AP)' },
  'cf-label': { name: 'Label', desc: 'Static text or separator' },
};

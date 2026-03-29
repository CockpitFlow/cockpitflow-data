# CockpitFlow Community Data

Community-created presets, checklists, and profiles for [CockpitFlow](https://github.com/user/cockpitflow).

## Structure

```
checklists/     Aircraft checklists (pre-flight to shutdown)
cockpit/        Touch cockpit layouts for mobile companion
hardware/       Arduino/ESP32 pin mapping profiles
scenarios/      Failure training scenarios
index.json      Master index of all available items
config.json     Default module configuration
```

## How to contribute

1. Fork this repo
2. Add your JSON file to the appropriate folder
3. Add an entry to `index.json`
4. Submit a Pull Request

### Creating a checklist

Use the [Checklist Editor](https://user.github.io/cockpitflow-site/editor.html) to create checklists visually, then export the JSON.

### Creating a cockpit layout

Use the Cockpit Builder in the CockpitFlow desktop app (Modules → Cockpit → Edit).

### JSON format

See existing files for reference. Each category has its own schema:

- **Checklists**: `{ id, name, author, version, category, simulator, phases: [{ id, name, items: [{ id, label, expected, auto_detect }] }] }`
- **Cockpit**: `{ name, grid: { cols, rows }, theme, components: [{ id, type, col, row, w, h, ... }] }`
- **Hardware**: `{ device_profile, aircraft_profile, mappings: [{ pin, action, target }] }`

## Simulator support

Each preset specifies which simulators it supports:
- `"simulator": "both"` — Works with X-Plane and MSFS
- `"simulator": "xplane"` — X-Plane only
- `"simulator": "msfs"` — MSFS only

For auto-detect items, both `xplane_dataref` and `msfs_simvar` fields can be provided.

## License

All community contributions are shared under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

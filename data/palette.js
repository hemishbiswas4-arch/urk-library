// Shared visual language for the library, used by both the 3D scene (js/scene.js)
// and the 2D directory/legend overlay (js/app.js) so colours never drift apart.
//
// The eight module colours are the validated data-viz categorical palette
// (light mode), in its fixed CVD-safe order — one hue per module.

export const MODULE_COLORS = [
  "#2a78d6", // Know the competition — blue
  "#1baf7a", // Negotiation craft — aqua
  "#eda100", // Module A · Data centres — yellow
  "#1f9e2e", // Module B · Climate law — green
  "#6a5ae0", // Module C · Project finance — violet
  "#e34948", // Module D · Local content — red
  "#e87ba4", // Module E · Cloud & capacity — magenta
  "#eb6834", // Module F · Regulatory — orange
];

// Short shelf labels keyed by module id (the full titles are too long to float
// cleanly in the scene). Order of MODULES in content.js maps to MODULE_COLORS.
export const SHELF_SHORT = {
  orientation: "Know the competition",
  negotiation: "Negotiation craft",
  moduleA: "A · Data centres",
  moduleB: "B · Climate law",
  moduleC: "C · Project finance",
  moduleD: "D · Local content & labour",
  moduleE: "E · Cloud & capacity",
  moduleF: "F · Regulatory & social",
};

// Reading-depth legend: size in the scene, explained once in the overlay.
export const DEPTH_LEGEND = [
  { k: "READ", label: "Read fully", hint: "biggest books" },
  { k: "SKIM", label: "Skim", hint: "medium" },
  { k: "WATCH", label: "Watch", hint: "medium" },
  { k: "REF", label: "Reference", hint: "slim books" },
];

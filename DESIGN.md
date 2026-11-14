# NL Dental Treasury — Design System Specification (`DESIGN.md`)

A restrained, editorial **Clinical EdTech** design system engineered for focus, rapid scanning, and high-trust dental licensure preparation across Desktop, Tablet, and Mobile.

## 1. Visual Philosophy & Anti-Slop Rules
- **No AI Slop Defaults:** No neon violet-to-cyan gradients, no aurora background blobs, no rainbow emojis inside navigation tabs/titles, and no gratuitous glow shadows.
- **Surface Over Shadow:** Depth is communicated through disciplined background steps (`canvas -> card -> elevated`) and crisp `1px` hairline borders rather than blurry drop shadows.
- **Icon Discipline:** Monochrome `lucide-react` stroke icons (`1.75px` stroke) replace decorative emojis across headers, tabs, buttons, and KPIs.
- **Restrained Single Accent:** One functional primary accent (**Clinical Teal**) paired with neutral Zinc/Slate ink and semantic status colors reserved strictly for true clinical/exam state.

## 2. Color Tokens

### Obsidian Dark Mode (Default)
| Token | Value | Role |
|---|---|---|
| `--bg` | `#09090b` | Matte obsidian canvas |
| `--bg-panel` / `--glass-bg` | `#111114` | Primary card surface |
| `--bg-panel-hover` | `#18181d` | Interactive surface hover |
| `--surface-subtle` | `rgba(255, 255, 255, 0.035)` | Recessed metadata wells |
| `--primary` | `#0d9488` | Clinical Teal action fill |
| `--primary-light` | `#2dd4bf` | High-contrast teal ink on dark |
| `--accent` | `#38bdf8` | Analytical readouts & charts |
| `--border` | `rgba(255, 255, 255, 0.09)` | Hairline structural divider |
| `--text` / `--text-sub` / `--text-muted` | `#f4f4f5` / `#a1a1aa` / `#71717a` | High-legibility neutral hierarchy |

### Editorial Light Mode
| Token | Value | Role |
|---|---|---|
| `--bg` | `#fafafa` | Warm editorial paper canvas |
| `--bg-panel` / `--glass-bg` | `#ffffff` | Crisp card surface |
| `--bg-panel-hover` | `#f4f4f5` | Interactive hover tint |
| `--surface-subtle` | `#f4f4f5` | Recessed metadata wells |
| `--primary` | `#0f766e` | Deep Clinical Teal |
| `--primary-light` | `#0f766e` | Teal ink on light |
| `--border` | `rgba(9, 9, 11, 0.09)` | Clean neutral hairline |
| `--text` / `--text-sub` / `--text-muted` | `#09090b` / `#3f3f46` / `#71717a` | Editorial ink contrast (`>= 4.5:1`) |

## 3. Typography
- **UI & Editorial Sans:** `'Plus Jakarta Sans'`, `'IBM Plex Sans Thai'`, system fallbacks.
- **Data, Timers & Metrics:** `'JetBrains Mono'`, monospace with `font-variant-numeric: tabular-nums`.
- **Headings:** Tight tracking (`-0.02em`), solid neutral ink (no rainbow gradient text fills).

## 4. Concentric Geometry & Ergonomics
- Formula: $R_{\text{outer}} = R_{\text{inner}} + \text{padding}$
  - Outer panel radius: `12px` (`--radius`) / `14px` (`--radius-outer`)
  - Inner tab / control radius: `8px` (`--radius-inner`) inside `4px` rail padding
- **Minimum Touch Target:** `44px` height on interactive mobile controls; `min(16px)` on inputs to prevent iOS Safari zoom.

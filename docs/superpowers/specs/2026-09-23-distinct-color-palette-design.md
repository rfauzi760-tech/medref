# Distinct color palette design

## Goal

Give the clinical workspace a visual identity that is clearly separate from its current green palette in both light and dark themes.

## Theme direction

- Light mode uses the supplied periwinkle and pale cyan palette: `#5465FF`, `#788BFF`, `#9BB1FF`, `#BFD7FF`, and `#E2FDFF`.
- Dark mode uses the supplied navy, plum, and warm neutral palette: `#F1DAC4`, `#A69CAC`, `#474973`, `#161B33`, and `#0D0C1D`.
- Dark mode typography uses white for high contrast; the warm neutral and plum colors remain available for surfaces, borders, and accents.
- Keep the logo mark and its white tile visually identical in light and dark modes.
- Semantic state colors such as success, warning, and danger remain separate from the brand accent.
- The small-text accent is darkened slightly in light mode to meet readable contrast on pale surfaces.

## Application

Use CSS custom properties as the theme source of truth. Apply the tokens to shared surfaces, links, focus indicators, the existing logo mark and its tiles, browser theme metadata, and the installed-app theme color. Public clinical citations use the catalog's explicit references; do not substitute a generic source when an entry lacks a reference. Exclude any displayed citation whose organization, title, or URL contains a blocked brand/domain. Keep internal provenance metadata unchanged.

## Acceptance

- Both modes use the supplied palettes as their dominant visual colors.
- Dark-mode text is white, and the logo tile stays white in both modes.
- Small text using the primary accent has at least 4.5:1 contrast against its background.
- Explicit clinical source attribution remains accurate, and no public citation contains the blocked brand/domain names.
- Existing unrelated working-tree changes remain untouched.

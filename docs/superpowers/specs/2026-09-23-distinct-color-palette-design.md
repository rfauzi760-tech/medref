# Distinct color palette design

## Goal

Give the clinical workspace a visual identity that is clearly separate from its current green palette in both light and dark themes.

## Theme direction

- Light mode uses the supplied periwinkle and pale cyan palette: `#5465FF`, `#788BFF`, `#9BB1FF`, `#BFD7FF`, and `#E2FDFF`.
- Dark mode uses the supplied navy, plum, and warm neutral palette: `#F1DAC4`, `#A69CAC`, `#474973`, `#161B33`, and `#0D0C1D`.
- Semantic state colors such as success, warning, and danger remain separate from the brand accent.
- The small-text accent is darkened slightly in light mode to meet readable contrast on pale surfaces.

## Application

Use CSS custom properties as the theme source of truth. Apply the tokens to shared surfaces, links, focus indicators, the home and navigation logo tiles, browser theme metadata, and the installed-app theme color. Keep the existing logo artwork and clinical references unchanged.

## Acceptance

- Both modes use the supplied palettes as their dominant visual colors.
- Small text using the primary accent has at least 4.5:1 contrast against its background.
- Existing clinical source attribution remains accurate.
- Existing unrelated working-tree changes remain untouched.

# MedRef Frontend Redesign

## Goal

Redesign the entire MedRef application as a refined clinical workspace inspired by Flyweel's CACulator. Preserve all current features, routes, clinical calculations, light and dark themes, and Bahasa Indonesia-first content. The result should feel deliberately designed rather than template-generated.

## Content audit

The application is functionally coherent: all 92 tests pass, including calculation, data-validation, and priority-content checks. It is not content-complete against its own reference inventory.

- Clinical scores and guidelines meet or exceed the stated baseline.
- Calculators exceed the stated baseline.
- Drug monographs, drug interactions, ICD-10 entries, and foods remain partial.
- The README and coverage test use different reference totals for scores and drugs. The UI must not claim universal completeness until these baselines are reconciled.

The redesign will not invent or bulk-fill clinical content. It will present actual dataset counts and add a concise coverage disclosure where appropriate.

## Visual system

- Use Funnel Display for headings and Funnel Sans for body text and controls, matching the reference's typographic character.
- Use near-black and warm ivory surfaces with a restrained mint clinical accent.
- Support both light and dark themes with equivalent contrast and hierarchy.
- Prefer crisp one-pixel borders, modest corner radii, flat surfaces, and shadows only for overlays.
- Avoid decorative gradients, excessive pills, uniform card grids, oversized spacing, and ornamental copy.
- Keep body text comfortable for clinical use and meet WCAG 2.1 AA contrast and keyboard requirements.

## Application shell

Retain the desktop sidebar because the application has many clinical modules, but redesign it as a compact workspace rail with clearer grouping, quieter counts, and a stronger active state. Keep global search prominent in a slim top bar. On mobile, use a compact branded header and accessible navigation drawer.

The shell will use shared semantic surface, border, text, and accent tokens so every route inherits the same system without page-specific color duplication.

## Homepage

Replace the generic module-card grid with an editorial workspace entry point:

- concise product statement and high-priority global search;
- actual library counts as compact evidence, not promotional badges;
- recent and favorite tools when available;
- module navigation with varied emphasis based on clinical utility rather than identical cards;
- specialty browsing as a secondary, compact section;
- transparent clinical disclaimer and coverage note.

## Listing and detail pages

Standardize headers, search/filter controls, result lists, metadata, sources, and empty states. Dense datasets such as drugs, ICD-10, scores, and guidelines should scan like professional reference indexes rather than card galleries.

Detail pages will use a consistent reading column, clear section bands, restrained callouts, source metadata, and visible clinical caveats. Existing copy, favorite, print, and local-history behavior remains unchanged.

## Interactive clinical tools

Calculator, score, anthropometry, immunization, nutrition, interaction, development, and meal-planner interfaces will adopt the reference's structured form language:

- labeled section headers with small functional icons;
- clear input grouping and help text;
- strong focus and selected states;
- desktop input/result split with a stable results panel;
- single-column mobile flow;
- explicit incomplete, warning, empty, and result states;
- no changes to calculation formulas or clinical data flow.

## Implementation boundaries

The redesign will focus on shared CSS tokens and reusable shell, header, card/list, form, and result patterns. Page changes should reuse these patterns and avoid unrelated data-model refactors. Existing uncommitted work will be preserved.

## Verification

- Run the full Vitest suite, lint, and production build.
- Verify representative routes from each page family.
- Test at 320, 768, 1024, and 1440 pixel widths.
- Check both themes, keyboard navigation, focus visibility, menu behavior, search, empty states, and representative calculations.
- Confirm no clinical dataset or calculation output changes unintentionally.

## Success criteria

The entire application reads as one intentional clinical product, retains all existing behavior, accurately communicates content coverage, and visibly reflects the reference's typography, contrast, compactness, and structured form design without copying its brand or promotional language.

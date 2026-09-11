# RFSmed Content and Brand Design

## Goal

Make Klinea the canonical clinical-content source for RFSmed while preserving the current Next.js workspace, calculations, light and dark themes, search, and Vercel Analytics.

## Canonical content

- Store a versioned local snapshot of Klinea's publicly delivered `data.js`, `data2.js`, `data3.js`, and `data4.js` bundles.
- Record source URLs, retrieval date, file sizes, and checksums so every import is auditable.
- Use a deterministic importer to extract and normalize the Klinea catalogs into RFSmed's typed data model.
- Klinea records replace overlapping RFSmed records. Catalogs present only in RFSmed remain available only when Klinea has no corresponding catalog.
- The application reads local generated data at runtime. Production does not depend on the Klinea website being available.
- A validation test compares generated catalog counts and identifiers with the canonical snapshot.

## Language and punctuation

- Navigation, actions, form labels, helper text, result labels, warnings, and empty states use Indonesian.
- International clinical names and abbreviations remain unchanged when translating them would reduce medical clarity.
- User-visible prose contains no em dash character. Imported strings normalize em dashes to context-safe punctuation during generation.
- Developer comments and documentation are outside this punctuation requirement.

## Typography

- All visible `h1`, `h2`, and `h3` headings use bold weight.
- Supporting labels, descriptions, metadata, and body copy remain lighter so hierarchy is immediately visible.
- Existing Funnel Display and Funnel Sans typography remains in use.

## Brand and logo

- The product name is `RFSmed` in navigation, metadata, manifest, and visible brand references.
- Remove the brand tagline beneath the logo and from title composition. Retain clinical page descriptions because they explain functionality rather than branding.
- Add the supplied transparent PNG as the primary logo asset, with an optimized web-sized copy.
- Use the full logo in the desktop rail and a compact mark treatment where space is limited.

## Verification and delivery

- Add contract tests for the RFSmed name, logo asset, bold headings, Indonesian interface copy, no visible em dashes, and canonical Klinea snapshot metadata.
- Run the complete test suite, lint, production build, and visual checks in both themes.
- Merge into `main` and push to trigger the connected Vercel production deployment.

# MedRef Search and Analytics Design

## Scope

Add Vercel Web Analytics globally and refine the existing global search overlay without changing search data or ranking logic.

## Search experience

- Keep the existing `⌘/Ctrl + K`, Escape, arrow-key, and Enter behavior.
- Present search as a compact centered command palette with a restrained maximum width.
- Use one focus treatment around the search header instead of outlining the input independently.
- Keep the search icon, field, and close action aligned in a single 52px control row.
- Show concise guidance before typing, grouped results after two characters, and a compact keyboard-help footer.
- Use semantic surface, border, text, and accent tokens so light and dark themes remain consistent.
- Preserve accessible dialog, combobox, result-list, and button labels.

## Analytics

- Install `@vercel/analytics` as a production dependency.
- Render `Analytics` once in the root layout, outside the visual shell but inside the document body.
- Do not add custom tracking events or collect additional user input.

## Verification and delivery

- Extend the frontend contract test for the refined search structure and global Analytics mount.
- Run tests, lint, and a production build.
- Commit and push `main` so the connected Vercel project deploys automatically.

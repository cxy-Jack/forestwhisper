---
name: forwhis-maotaui-ui
description: Use when changing the forwhis-new frontend navigation, feed, forms, icons, fonts, theme, or responsive layout.
---

# forwhis-new MaoTaUI UI

## Dependency chain

- UI controls use MaoTaUI custom elements and `.mt-*` APIs.
- Icons use `<mao-icon>` or a MaoTaUI component that renders icons internally.
- Never import Lucide or another icon package directly in this project.
- Never hand-author SVG paths or draw functional icons with CSS or Unicode glyphs.
- Web fonts come from `maotaui/styles.css`; do not add a second font source.

## Components

- Use `<mao-card><div class="mt-card-body">...</div></mao-card>`.
- Use `.mt-card-header` and `.mt-card-footer` for card structure.
- Prefer `mao-button`, `mao-segmented`, `mao-text-field`, `mao-text-area`, `mao-reaction`, and `mao-dialog`.
- Boolean custom-element attributes are present/absent; bind `undefined` rather than `false`.
- Check the installed MaoTaUI registry/types when changing attributes or events.

## Product conventions

- Default theme is dark through `lyxy:theme`.
- Typography is Noto Sans SC supplied by MaoTaUI.
- Sidebar preference is `lyxy:sidebar:open`.
- Desktop sidebar is 240px expanded or 72px compact; mobile starts hidden.
- The optional right rail is hidden at `1280px` and below.
- Post actions use 17px icons, 28px control height, and consistent hover backgrounds.
- Posts use the flat X-style layout without whole-post hover highlighting.

## Verification

```bash
pnpm exec vue-tsc --noEmit
pnpm exec vite build
```

- Scan `src` for direct icon imports, `<svg>`, Unicode icon controls, and CSS-drawn controls.
- Check desktop and mobile layouts in a browser.
- Confirm the installed `maotaui` version matches `package.json`.

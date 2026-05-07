# PolarZero — retro technical Astro site

A hand-built Astro implementation of the old-school, high-signal PolarZero redesign.

## Stack

- Bun for package management and scripts
- Astro 6 static output
- Oxlint for linting
- Oxfmt for formatting
- Inter + JetBrains Mono via Google Fonts

## Commands

```sh
bun install
bun run dev
bun run build
bun run preview
bun run lint
bun run format
```

## Notes

The content in `src/data` is adapted from the public `0xpolarzero/polarzero-v6` data tree and converted from React/TSX descriptions into Astro-friendly typed data.

The visual system keeps the page mostly static HTML/CSS: warm paper background, monospaced structure, underlined links, compact status panels, and a few restrained modern details such as responsive layout, sticky navigation, and data-driven activity marks.

Oxfmt is configured for the supported source files and ignores `.astro` templates for now, because Oxfmt's Astro template formatting support is not fully available yet. The Astro files are manually formatted to the same 100-column convention.

# Imam & Sarvatunnisa — interactive wedding invitation

Mobile first React + Vite + TypeScript application. GSAP opens the sleeve flap, reveals the booklet in the pocket, pulls it out, and opens the cover about its spine. The printed reverse side is English; the right page is Telugu. When opened, both pages become readable full-width sheets on phones and a spread on desktop.

The first face uses a native SVG viewBox, so the artwork and printed text scale together without a JavaScript sizing dependency. Its ornaments are a reference-derived, text-free stationery background from photo 1. All invitation copy is separate editable text. The invitee name is fitted inside a bounded HTML text field within that drawing surface, including mixed Arabic/Telugu/Latin names.

## Run

Requires Node.js 22.12 or newer and pnpm 10.26 or newer.

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Vite. Example personalization:

```text
http://localhost:5173/?name=Syed+Abdullah+Family
```

`URLSearchParams` decodes the name once, including `+` spaces and Unicode. The first letter of each word is capitalized, preserving the remaining letters. React renders it as escaped text only in the outer-card invitee area. A missing/blank name leaves the printed address line blank. Longer names wrap within the name area; exceptionally long names can scroll within that area.

## Build and deploy

```sh
pnpm build
pnpm preview
```

Upload the generated **dist/** directory to any static host such as Cloudflare Pages, Netlify, Vercel, or GitHub Pages. There is one route and no server dependency. Relative asset paths support a subdirectory deployment. Use an HTTPS URL for guests. Keep the name query on the URL you send.

This deliverable contains source and a built `dist/` directory. It has not been published to a public host.

## Configure

Edit **src/config.ts**:

```ts
inviteeFont: 'Great Vibes'
```

Only the dynamic invitee name uses this font. The configured Google Fonts family is loaded automatically. The other fonts use Pinyon Script for the printed script headings, Monotype Corsiva with Charm fallback for English copy, Amiri for Arabic, and Noto Serif Telugu for Telugu. Google Fonts requires an internet connection; system fallbacks remain usable while fonts load.

The bride name is centrally set to **Sarvatunnisa**. The Telugu name remains in Telugu script as printed. The only outbound action is the supplied venue location URL. Opening, pulling, and closing are controls for the physical invitation itself.

## Interaction and accessibility

The reducer enforces:

```text
CLOSED → OUTER_OPENING → FLAP_OPENING → CARD_REVEALING → INNER_REVEALED → BOOK_OPENING → BOOK_OPEN
```

Repeated/out-of-order input is ignored during transitions. The first tap flips the invitation, opens the envelope flap, and slides the closed booklet out into view. The second tap opens that card and reveals the marriage details. Keyboard users can use Tab and Enter/Space. Opening moves focus to the readable pages. Closing returns focus to the outer-card control. Reduced-motion mode compresses the movements into immediate reveals. There is no audio, calendar integration, login, tracking, or form.

The animated copies are hidden from assistive technology. The opened English/Telugu text is semantic, selectable text, with language attributes. Mobile pages scroll vertically and preserve both sets of invitation copy.

## Checks

```sh
pnpm test
```

For browser checks, start `pnpm dev` in one terminal and run in another:

```sh
node scripts/check-ui.mjs
```

The browser check uses installed Edge by default. Set `BROWSER_CHANNEL=chrome` for installed Chrome, or configure Playwright for your preferred browser. `INVITATION_URL` changes the target URL; `QA_OUTPUT` changes the screenshot folder. The default screenshot folder is a scratch directory outside this project.

Checks cover the state sequence, repeated taps, name decoding, escaped query text, 320/390/768/1440px widths, printed text overflow, both language pages, venue-only outbound linking, no audio, keyboard operation, reduced motion, reset/focus restoration, and long multilingual/blank names.

## Fidelity notes

The ten supplied photographs were inspected as references. The interface uses rebuilt layers and editable text, rather than photographs of the complete printed card. The printed English and Telugu content was transcribed from photos 1, 8 and 9; the requested Sarvatunnisa spelling replaces the older spelling on the photographed outer/cover faces.

The ornaments and mosque motifs are recreations. Fonts closely approximate the photographed printing; they are not the printer's original font files. The original calligraphy is represented with a reference-derived emblem and real Arabic accessible text. The floral frame is a reference-derived standalone image. Exact printer outlines and typesetting would require the original print artwork/font files. Review the Telugu transcription against the physical card before guest distribution.

Artwork generation details are in **ARTWORK.md**.

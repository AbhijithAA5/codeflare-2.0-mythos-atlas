# THE LONG NIGHT

**A field atlas of the world's mythologies after dark.**

Your scroll plays a 15-second film that follows a single ember of dawn-light
through one continuous night: the roots of Yggdrasil, Ra's barque on the Duat,
a lantern-lit yokai shore, a Slavic crossroads, and out into a Surya dawn.
Five watches, five traditions, one journey.

Built for the **Codeflare 2.0** website-making competition (theme: Mythology
and Folklore).

## Live site

Hosted on GitHub Pages:
**https://abhijithaa5.github.io/codeflare-2.0-mythos-atlas/**

## What is inside

| Section | What it does |
|---|---|
| The Journey | A scroll-scrubbed film in five chapters (Norse, Egyptian, Japanese, Slavic, Vedic). Scrub forward and backward; every frame is a still when you pause. |
| The Atlas | An interactive star chart of six myth realms. Choose a star, its dossier opens: figures, creatures, coordinates. |
| Field Notes | A bestiary of six creatures (Draugr, Apophis, Lantern Bearer, Likho, Vetala, Cihuateteo) with region filters, search and flip-to-notes cards. |
| Choose Your Guide | A five-question quiz scored across six guides (Hel, Anubis, Tsukuyomi, Veles, Ratri, Xolotl); your guide pre-fills the offering wall. |
| The Night Ferryman | A branching folk tale: three crossings, three endings, told in the second person. |
| Offerings | A live wall: leave a one-line offering for the night. In this static build the ledger is kept in the visitor's own browser. |

## Tech

- React 19 + Vite + TypeScript, plain hand-written CSS (no UI framework)
- Scroll-scrub journey: the film ships as 900 individual frames painted to a
  canvas; the scroll position directly selects the frame, with lazy
  neighbourhood loading and an LRU cache, so playback answers to the scroll
  frame-for-frame in both directions (no video seeking anywhere)
- Reduced-motion fallbacks, keyboard-operable interactions, focus-visible
  states, and AA contrast throughout
- Every painting, emblem, plate, sound and the journey film were generated
  for this build; no stock imagery anywhere
- Typography: Cormorant Garamond, Inter Tight, IBM Plex Mono (Google Fonts)
- Accessibility: keyboard-operable interactions, focus-visible states,
  reduced-motion fallbacks for every animation, `:active` feedback, AA contrast

## Run it

```bash
npm install     # or: bun install
npm run dev     # local dev server
npm run build   # production build into dist/
npm run preview # serve the production build
```

Deploy the contents of `dist/` to any static host. This repository publishes
the `gh-pages` branch (built output) to GitHub Pages.

## Project structure

```
index.html              # shell: fonts, meta, og card
src/
  main.tsx              # entry
  App.tsx               # page composition
  components/
    scroll-scrub/       # the journey engine (sticky stage, blob-backed seeking)
    longnight/          # atlas, bestiary, quiz, tale, offerings, chrome
  data/mythos.ts        # all mythology content: realms, creatures, guides, quiz, tale
  lib/                  # sound manager, static offering ledger
  styles/longnight.css  # brand tokens + all component styles
public/assets/          # generated film clips, posters, plates, emblems, SFX, brand kit
docs/                   # storyboard
demo/                   # journey film + live-site walkthrough
screenshots/            # captures of the live site
```

## Sources behind the content

Prose Edda (Norse); the Egyptian Book of Gates; the Kojiki (Japanese); Slavic
folk tale collections; the Rigveda; the Aztec road to Mictlan. Summaries are
the site's own field-note voice; sources are credited in the colophon.

## License

Competition entry by the repository owner. Artwork and audio were generated
for this build and ship with it.

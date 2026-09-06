/**
 * Scene data for the scroll-scrub journey - THE LONG NIGHT.
 * Single-shot film, frame-accurately split into five contiguous sub-clips
 * (no seams: the cuts are frame-adjacent frames of ONE continuous render).
 * Keep this array a module constant.
 */
import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";
import { playSfx } from "@/lib/sound";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#e3a44b",
  background: "#0e1630",
  ink: "#ede7d9",
  muted: "#9aa6c4",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    id: "first-watch",
    label: "The First Watch",
    kicker: "Watch I of V",
    title: "The Long Night",
    body:
      "Six mythologies. One journey through the dark. Scroll, and the night does the walking.",
    tags: ["Norse", "Yggdrasil", "Draugr"],
    actions: (
      <a
        className="ln-cta-ember"
        href="#river-of-hours"
        onClick={() => playSfx("ember")}
      >
        Begin the night
      </a>
    ),
    align: "right",
    scroll: 1.7,
    clip: "assets/world/night-01.mp4",
    mobileClip: "assets/world/night-01-mobile.mp4",
    poster: "assets/world/night-01-poster.webp",
    mobilePoster: "assets/world/night-01-mobile-poster.webp",
  },
  {
    id: "river-of-hours",
    label: "The River",
    kicker: "Watch II of V",
    title: "The river of hours",
    body:
      "Each night Ra's barque crosses the Duat while the serpent Apophis waits beneath the water.",
    tags: ["Duat", "Ra", "Ammit"],
    align: "right",
    scroll: 1.7,
    clip: "assets/world/night-02.mp4",
    mobileClip: "assets/world/night-02-mobile.mp4",
    poster: "assets/world/night-02-poster.webp",
    mobilePoster: "assets/world/night-02-mobile-poster.webp",
  },
  {
    id: "lanterned-shore",
    label: "The Shore",
    kicker: "Watch III of V",
    title: "A lanterned shore",
    body:
      "On Japan's night roads the yokai parade walks when the lanterns pass. Keep your eyes on the water.",
    tags: ["Yokai", "Tsukuyomi", "Yuki-onna"],
    align: "right",
    scroll: 1.7,
    clip: "assets/world/night-03.mp4",
    mobileClip: "assets/world/night-03-mobile.mp4",
    poster: "assets/world/night-03-poster.webp",
    mobilePoster: "assets/world/night-03-mobile-poster.webp",
  },
  {
    id: "the-crossroads",
    label: "The Crossroads",
    kicker: "Watch IV of V",
    title: "The crossroads",
    body:
      "At Slavic crossroads travelers paid Veles to point the road home. Some roads keep the payment.",
    tags: ["Veles", "Likho", "Koschei"],
    align: "right",
    scroll: 1.7,
    clip: "assets/world/night-04.mp4",
    mobileClip: "assets/world/night-04-mobile.mp4",
    poster: "assets/world/night-04-poster.webp",
    mobilePoster: "assets/world/night-04-mobile-poster.webp",
  },
  {
    id: "dawn",
    label: "Dawn",
    kicker: "Watch V of V",
    title: "The ember remembers",
    body:
      "Vedic hymns wake Ushas, the dawn, and the ember becomes Surya's sun again. The atlas opens below.",
    tags: ["Surya", "Ushas", "Ratri"],
    actions: (
      <a className="ln-cta-underline" href="#atlas">
        ✦ Open the atlas
      </a>
    ),
    align: "right",
    scroll: 1.7,
    clip: "assets/world/night-05.mp4",
    mobileClip: "assets/world/night-05-mobile.mp4",
    poster: "assets/world/night-05-poster.webp",
    mobilePoster: "assets/world/night-05-mobile-poster.webp",
  },
];

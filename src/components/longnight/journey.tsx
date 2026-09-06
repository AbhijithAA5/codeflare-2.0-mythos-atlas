import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { playSfx } from "@/lib/sound";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

/**
 * Client wrapper for the journey: the engine reports chapter changes and the
 * night answers with a single low swell (throttled inside the sound manager).
 */
export function Journey() {
  return (
    <ScrollScrub
      scenes={scrollScrubScenes}
      theme={scrollScrubTheme}
      onActiveSectionChange={() => playSfx("swell")}
    />
  );
}

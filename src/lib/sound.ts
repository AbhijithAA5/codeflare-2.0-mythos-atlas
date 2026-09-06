/**
 * Client sound manager. Everything is user-triggered (the toggle) - the site
 * never plays audio on its own. One ambience loop + a few one-shots.
 */

const SFX: Record<string, { src: string; volume: number }> = {
  ember: { src: "assets/sfx/ember.mp3", volume: 0.7 },
  flip: { src: "assets/sfx/flip.mp3", volume: 0.8 },
  chime: { src: "assets/sfx/chime.mp3", volume: 0.55 },
  lap: { src: "assets/sfx/lap.mp3", volume: 0.8 },
  coin: { src: "assets/sfx/coin.mp3", volume: 0.7 },
  swell: { src: "assets/sfx/swell.mp3", volume: 0.4 },
};

let ambience: HTMLAudioElement | null = null;
let soundOn = false;
let lastSwellAt = 0;

export function isSoundOn(): boolean {
  return soundOn;
}

export function toggleSound(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (!ambience) {
    ambience = new Audio("assets/sfx/ambience.mp3");
    ambience.loop = true;
    ambience.volume = 0.32;
  }
  soundOn = !soundOn;
  if (soundOn) {
    void ambience.play().catch(() => {
      soundOn = false;
    });
  } else {
    ambience.pause();
  }
  return soundOn;
}

export function playSfx(name: keyof typeof SFX | string): void {
  if (!soundOn || typeof window === "undefined") {
    return;
  }
  const sfx = SFX[name];
  if (!sfx) {
    return;
  }
  if (name === "swell") {
    const now = Date.now();
    if (now - lastSwellAt < 4000) {
      return;
    }
    lastSwellAt = now;
  }
  const audio = new Audio(sfx.src);
  audio.volume = sfx.volume;
  audio.addEventListener("ended", () => {
    audio.remove();
  });
  void audio.play().catch(() => {
    // Autoplay-style refusal; the toggle owns the gesture, ignore.
  });
}

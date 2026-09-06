/**
 * Client sound manager. Sound is ON by default: the site attempts to start
 * the ambience immediately, and if the browser blocks autoplay (its usual
 * policy) the moment the visitor makes any first click or keypress the
 * night begins. The toggle mutes and unmutes. One ambience loop + a few
 * one-shots.
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
let soundOn = true;
let lastSwellAt = 0;
let armed = false;

export function isSoundOn(): boolean {
  return soundOn;
}

function startAmbience(): void {
  if (!ambience) {
    ambience = new Audio("assets/sfx/ambience.mp3");
    ambience.loop = true;
    ambience.volume = 0.32;
  }
  void ambience.play().catch(() => {
    // Autoplay refused; the first-gesture arming below will retry.
  });
}

/** Try immediately (works where autoplay is permitted). */
export function startSoundIfPossible(): void {
  if (soundOn) {
    startAmbience();
  }
}

/**
 * Arm the first real user gesture: the moment the visitor clicks or presses
 * a key anywhere, the ambience starts (browsers allow audio after any
 * genuine interaction). Runs once.
 */
export function armFirstGestureAudio(): void {
  if (armed || typeof window === "undefined") {
    return;
  }
  armed = true;
  const onGesture = () => {
    if (soundOn) {
      startAmbience();
    }
  };
  window.addEventListener("pointerdown", onGesture, { once: true });
  window.addEventListener("keydown", onGesture, { once: true });
}

export function toggleSound(): boolean {
  if (typeof window === "undefined") {
    return soundOn;
  }
  soundOn = !soundOn;
  if (!ambience) {
    ambience = new Audio("assets/sfx/ambience.mp3");
    ambience.loop = true;
    ambience.volume = 0.32;
  }
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
    // Autoplay-style refusal; the gesture arming owns the retry.
  });
}

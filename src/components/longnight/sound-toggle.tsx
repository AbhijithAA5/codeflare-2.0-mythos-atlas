import { useEffect, useState } from "react";

import {
  armFirstGestureAudio,
  isSoundOn,
  startSoundIfPossible,
  toggleSound,
} from "@/lib/sound";

export function SoundToggle() {
  const [on, setOn] = useState(() => isSoundOn());

  useEffect(() => {
    startSoundIfPossible();
    armFirstGestureAudio();
  }, []);

  return (
    <button
      type="button"
      className="ln-sound-toggle"
      aria-pressed={on}
      onClick={() => setOn(toggleSound())}
    >
      <span aria-hidden="true">♪</span>
      <span>Sound: {on ? "on" : "off"}</span>
    </button>
  );
}

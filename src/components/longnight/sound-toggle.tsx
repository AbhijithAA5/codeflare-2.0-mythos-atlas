import { useState } from "react";

import { isSoundOn, toggleSound } from "@/lib/sound";

export function SoundToggle() {
  const [on, setOn] = useState(() => isSoundOn());

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

import { useState } from "react";

import { tale } from "@/data/mythos";
import { playSfx } from "@/lib/sound";

export function TaleEngine() {
  const [nodeId, setNodeId] = useState("start");
  const [hoursWalked, setHoursWalked] = useState(1);
  const node = tale.find((entry) => entry.id === nodeId) ?? tale[0];

  const goTo = (to: string) => {
    setNodeId(to);
    setHoursWalked((count) => count + 1);
  };

  return (
    <section className="ln-section" id="tale" aria-labelledby="tale-title">
      <h2 className="ln-h2" id="tale-title">
        The Night Ferryman
      </h2>
      <p className="ln-lede">
        A folk tale in the second person, forked three ways. Choose badly; the
        river is patient.
      </p>

      <div className="ln-tale-grid">
        <div className="ln-tale-panel ln-reveal" key={node.id}>
          <p className="ln-tale-hour">
            The Night Ferryman · {node.hour} · hour {hoursWalked} of your crossing
          </p>
          <p className="ln-tale-text">{node.text}</p>
          {node.choices ? (
            <div className="ln-tale-choices">
              {node.choices.map((choice, index) => (
                <button
                  type="button"
                  className="ln-cta-branch"
                  key={choice.to}
                  onClick={() => {
                    playSfx("lap");
                    goTo(choice.to);
                  }}
                >
                  <span>{choice.label}</span>
                  <span className="ln-branch-arrow" aria-hidden="true">
                    {index === 0 ? "→" : index === 1 ? "↬" : "↯"}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
          {node.ending ? (
            <div className="ln-tale-ending" aria-live="polite">
              <h3 className="ln-tale-ending-title">{node.ending.title}</h3>
              <p className="ln-tale-ending-note">{node.ending.note}</p>
              <button
                type="button"
                className="ln-cta-underline"
                onClick={() => {
                  setNodeId("start");
                  setHoursWalked(1);
                }}
              >
                Tell it again, differently
              </button>
            </div>
          ) : null}
        </div>

        <aside className="ln-tale-aside">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="assets/plates/realm-duat.webp"
            alt="A golden barque gliding on a black river, a serpent silhouette beneath the water."
            width={1200}
            height={800}
            loading="lazy"
          />
          <p>
            The ferryman is one of the oldest figures in folklore: Charon poles the
            Styx, Manunggal crosses in the epics, and on cold Slavic nights the
            ferryman is often you. This version keeps the rule all three share:
            the river is crossed, never beaten.
          </p>
        </aside>
      </div>
    </section>
  );
}

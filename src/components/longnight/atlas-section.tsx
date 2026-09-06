import { useState } from "react";

import { creatures, guides, realms } from "@/data/mythos";

/** Deterministic star field for the chart (x, y, size). */
const STARS: [number, number, number][] = [
  [52, 8, 1.6], [120, 40, 1.1], [214, 18, 1.4], [305, 60, 1], [398, 26, 1.7],
  [470, 70, 1], [560, 40, 1.3], [648, 16, 1.1], [730, 54, 1.6], [776, 120, 1],
  [36, 140, 1.2], [98, 205, 1.6], [180, 160, 1], [262, 250, 1.3], [340, 190, 1],
  [436, 150, 1.5], [522, 210, 1], [610, 170, 1.3], [700, 230, 1.1], [768, 300, 1.4],
  [48, 320, 1.1], [140, 380, 1.4], [230, 330, 1], [320, 420, 1.2], [410, 360, 1.5],
  [500, 410, 1], [590, 350, 1.2], [680, 400, 1], [752, 450, 1.3], [60, 460, 1.2],
  [372, 470, 1], [660, 470, 1.1], [470, 120, 0.9], [540, 260, 0.9], [300, 300, 0.9],
  [200, 90, 0.9], [620, 90, 0.9], [720, 340, 0.9], [110, 300, 0.9], [400, 240, 0.9],
];

const CHAIN = [0, 1, 2, 4, 5];
const CHORD = [1, 3];

export function AtlasSection() {
  const [activeIndex, setActiveIndex] = useState(1);
  const realm = realms[activeIndex];
  const creature = creatures.find((entry) => entry.id === realm.creatureId);
  const guide = guides.find((entry) => entry.id === realm.guideId);

  return (
    <section className="ln-section" id="atlas" aria-labelledby="atlas-title">
      <p className="ln-eyebrow">The Atlas</p>
      <h2 className="ln-h2" id="atlas-title">
        Six realms, one night
      </h2>
      <p className="ln-lede">
        The chart below marks where each tradition keeps its dark. Choose a star;
        its dossier opens to the right.
      </p>

      <div className="ln-atlas-grid">
        <div className="ln-map" role="group" aria-label="Star chart of mythological realms">
          <svg viewBox="0 0 800 500" aria-hidden="true" focusable="false">
            {CHAIN.slice(0, -1).map((point, index) => {
              const from = realms[point].pin;
              const to = realms[CHAIN[index + 1]].pin;
              return (
                <line
                  key={`chain-${point}`}
                  x1={from.x * 8}
                  y1={from.y * 5}
                  x2={to.x * 8}
                  y2={to.y * 5}
                  stroke="var(--ln-line)"
                  strokeWidth="1"
                />
              );
            })}
            {CHORD.length === 2 ? (
              <line
                x1={realms[CHORD[0]].pin.x * 8}
                y1={realms[CHORD[0]].pin.y * 5}
                x2={realms[CHORD[1]].pin.x * 8}
                y2={realms[CHORD[1]].pin.y * 5}
                stroke="var(--ln-line)"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
            ) : null}
            {STARS.map(([x, y, r]) => (
              <circle key={`${x}-${y}`} cx={x * 8} cy={y * 5} r={r} fill="var(--ln-mist)" opacity="0.5" />
            ))}
          </svg>
          {realms.map((entry, index) => (
            <button
              type="button"
              className="ln-pin"
              style={{ left: `${entry.pin.x}%`, top: `${entry.pin.y}%` }}
              aria-pressed={index === activeIndex}
              aria-label={`Open dossier: ${entry.name}, ${entry.culture}`}
              key={entry.id}
              onClick={() => setActiveIndex(index)}
            >
              <span className="ln-pin-star" aria-hidden="true">✦</span>
              <span>{entry.coord}</span>
            </button>
          ))}
        </div>

        <article className="ln-dossier ln-reveal" key={realm.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={realm.plate} alt={realm.plateAlt} width={1200} height={800} />
          <div className="ln-dossier-body">
            <p className="ln-dossier-eyebrow">
              Realm {realm.numeral} · {realm.culture} · {realm.coord} · {realm.watch}
            </p>
            <h3 className="ln-dossier-title">{realm.name}</h3>
            <p className="ln-dossier-text">{realm.blurb}</p>
            <ul className="ln-dossier-figures">
              {realm.figures.map((figure) => (
                <li key={figure.name}>
                  <span className="ln-fig-star" aria-hidden="true">✦</span>
                  <span>{figure.name}</span>
                  <span className="ln-fig-role">{figure.role}</span>
                </li>
              ))}
            </ul>
            {creature || guide ? (
              <p className="ln-dossier-text">
                {creature ? (
                  <>
                    Field notes keep a <strong>{creature.name}</strong> here.{" "}
                  </>
                ) : null}
                {guide ? (
                  <>
                    Its guide is <strong>{guide.name}</strong>, found at the{" "}
                    <a className="ln-cta-underline" href="#guides">
                      choosing of guides
                    </a>
                    .
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}

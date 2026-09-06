import { useMemo, useState } from "react";

import { creatures } from "@/data/mythos";
import { playSfx } from "@/lib/sound";

const REGIONS = [
  { id: "all", label: "All realms" },
  { id: "north", label: "North" },
  { id: "duat", label: "Duat" },
  { id: "shore", label: "Japan" },
  { id: "crossroads", label: "Crossroads" },
  { id: "vedic", label: "Vedic" },
  { id: "mictlan", label: "Mictlan" },
];

export function BestiarySection() {
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState("");
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return creatures.filter((entry) => {
      const inRegion = region === "all" || entry.regionId === region;
      const inQuery =
        needle.length === 0 ||
        `${entry.name} ${entry.culture} ${entry.notes} ${entry.traits.join(" ")}`
          .toLowerCase()
          .includes(needle);
      return inRegion && inQuery;
    });
  }, [query, region]);

  return (
    <section className="ln-section ln-section--well" id="bestiary" aria-labelledby="bestiary-title">
      <p className="ln-eyebrow">Field Notes</p>
      <h2 className="ln-h2" id="bestiary-title">
        Creatures of the Long Night
      </h2>
      <p className="ln-lede">
        Six wards of the dark, as the old sources describe them. Tap a plate to read
        the field notes on its reverse.
      </p>

      <div className="ln-bestiary-controls">
        <ul className="ln-chips">
          {REGIONS.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                className="ln-chip"
                aria-pressed={region === entry.id}
                onClick={() => setRegion(entry.id)}
              >
                {entry.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="ln-search">
          <label htmlFor="bestiary-search">Search the notes</label>
          <input
            id="bestiary-search"
            type="search"
            placeholder="lantern, serpent, grave..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="ln-cards">
          {visible.map((entry) => {
            const flipped = flippedId === entry.id;
            return (
              <article className={`ln-card${flipped ? " ln-card-flipped" : ""}`} key={entry.id}>
                <button
                  type="button"
                  className="ln-card-toggle"
                  aria-expanded={flipped}
                  aria-controls={`notes-${entry.id}`}
                  onClick={() => {
                    playSfx("flip");
                    setFlippedId(flipped ? null : entry.id);
                  }}
                >
                  <span className="ln-card-face">
                    <span className="ln-card-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.plate} alt={entry.plateAlt} width={800} height={1000} loading="lazy" />
                    </span>
                    <span className="ln-card-meta">
                      <span className="ln-card-culture">{entry.culture}</span>
                      <span className="ln-card-name">{entry.name}</span>
                    </span>
                    <span className="ln-card-flip-hint" aria-hidden="true">
                      {flipped ? "back to plate" : "field notes"}
                    </span>
                  </span>
                </button>
                <div className="ln-card-notes" id={`notes-${entry.id}`} hidden={!flipped}>
                  <p>{entry.notes}</p>
                  <ul className="ln-card-traits">
                    {entry.traits.map((trait) => (
                      <li key={trait}>{trait}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="ln-bestiary-empty" role="status">
          Nothing in the archive answers to that. The night keeps what it keeps.
        </div>
      )}
    </section>
  );
}

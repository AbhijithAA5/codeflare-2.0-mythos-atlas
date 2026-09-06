import { useCallback, useEffect, useState, type FormEvent } from "react";

import { addOffering, getOfferings } from "@/lib/offerings.local";
import { playSfx } from "@/lib/sound";

interface OfferingRow {
  id: number;
  name: string;
  text: string;
  guide: string | null;
  created: string;
}

type Feed =
  | { state: "loading" }
  | { state: "offline" }
  | { state: "ready"; items: OfferingRow[]; total: number }
  | { state: "failed"; message: string };

const MAX_TEXT = 120;

function formatWhen(created: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(`${created}Z`));
  } catch {
    return "";
  }
}

export function OfferingsSection() {
  const [feed, setFeed] = useState<Feed>({ state: "loading" });
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [guideName, setGuideName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [thanks, setThanks] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await getOfferings();
      if (!result.ok) {
        setFeed({ state: "offline" });
        return;
      }
      setFeed({ state: "ready", items: result.items, total: result.total });
    } catch {
      setFeed({ state: "offline" });
    }
  }, []);

  useEffect(() => {
    void load();
    const onGuide = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string") {
        setGuideName(detail);
      }
    };
    window.addEventListener("ln:guide", onGuide);
    return () => window.removeEventListener("ln:guide", onGuide);
  }, [load]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setThanks(null);
    const cleanName = name.trim();
    const cleanText = text.trim();
    if (cleanName.length < 1) {
      setFormError("The offering wants a name to sit beside it.");
      return;
    }
    if (cleanText.length < 2) {
      setFormError("Even a small offering is more than one character.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await addOffering({
        name: cleanName,
        text: cleanText,
        guide: guideName ?? undefined,
      });
      if (result.ok) {
        setThanks("Your offering rests on the wall.");
        playSfx("coin");
        setText("");
        setFeed({ state: "ready", items: result.items, total: result.total });
      } else {
        setFormError(result.error);
      }
    } catch {
      setFormError("The wall did not answer. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const ready = feed.state === "ready";

  return (
    <section className="ln-section ln-section--well" id="offerings" aria-labelledby="offerings-title">
      <h2 className="ln-h2" id="offerings-title">
        Leave an offering
      </h2>
      <p className="ln-lede">
        Every traveler was expected to bring something for the dark: a coin, a
        flame, a line for the wall. Yours is kept in the site's own ledger.
      </p>

      <div className="ln-offer-grid">
        <div>
          <p className="ln-offer-count" aria-live="polite">
            {ready ? feed.total : feed.state === "loading" ? "…" : ""}
          </p>
          <p className="ln-offer-count-label">
            offerings rest on the wall tonight
          </p>

          <form className="ln-offer-form" onSubmit={submit} noValidate>
            <div className="ln-field">
              <label htmlFor="offer-name">Your name</label>
              <input
                id="offer-name"
                name="name"
                value={name}
                maxLength={40}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="ln-field">
              <label htmlFor="offer-text">An offering for the night</label>
              <textarea
                id="offer-text"
                name="text"
                rows={3}
                value={text}
                maxLength={MAX_TEXT}
                onChange={(event) => setText(event.target.value)}
                placeholder="a coin for the ferryman"
              />
              <span className="ln-field-hint">
                {MAX_TEXT - text.length} characters left
              </span>
            </div>
            {guideName ? (
              <p className="ln-offer-status">Walking with {guideName}.</p>
            ) : null}
            {formError ? (
              <p className="ln-field-error" role="alert">
                {formError}
              </p>
            ) : null}
            {thanks ? (
              <p className="ln-offer-status" role="status">
                {thanks}
              </p>
            ) : null}
            <button className="ln-cta-coin" type="submit" disabled={submitting}>
              {submitting ? "Placing…" : "Leave the offering"}
            </button>
          </form>
        </div>

        <div className="ln-offer-wall" aria-live="polite">
          {feed.state === "loading" ? (
            <>
              <div className="ln-note ln-note--skeleton" aria-hidden="true" />
              <div className="ln-note ln-note--skeleton" aria-hidden="true" />
              <div className="ln-note ln-note--skeleton" aria-hidden="true" />
            </>
          ) : null}
          {feed.state === "offline" ? (
            <div className="ln-offer-empty" role="status">
              The ledger is warming up and will open shortly. The night keeps its
              own hours.
            </div>
          ) : null}
          {feed.state === "failed" ? (
            <div className="ln-offer-empty" role="status">
              {feed.message}
            </div>
          ) : null}
          {ready && feed.items.length === 0 ? (
            <div className="ln-offer-empty">No offerings yet. Be the first to cross.</div>
          ) : null}
          {ready
            ? feed.items.map((entry) => (
                <article className="ln-note" key={entry.id}>
                  <span className="ln-note-glyph" aria-hidden="true">
                    ✦
                  </span>
                  <p className="ln-note-text">{entry.text}</p>
                  <p className="ln-note-meta">
                    <span>{entry.name}</span>
                    <span>{formatWhen(entry.created)}</span>
                  </p>
                </article>
              ))
            : null}
        </div>
      </div>
    </section>
  );
}

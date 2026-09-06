import { useMemo, useState } from "react";

import { guides, quiz } from "@/data/mythos";
import { playSfx } from "@/lib/sound";

const NUMERALS = ["I", "II", "III", "IV", "V"];

function chooseGuide(picks: string[]): string {
  const scores = new Map<string, number>();
  for (const id of picks) {
    scores.set(id, (scores.get(id) ?? 0) + 1);
  }
  let best = picks[0] ?? "hel";
  let bestScore = 0;
  for (const [id, score] of scores) {
    if (score > bestScore) {
      best = id;
      bestScore = score;
    }
  }
  return best;
}

export function GuideQuiz() {
  const [picks, setPicks] = useState<string[]>([]);
  const done = picks.length >= quiz.length;
  const guideId = useMemo(() => (done ? chooseGuide(picks) : null), [done, picks]);
  const guide = guides.find((entry) => entry.id === guideId) ?? guides[0];
  const question = quiz[picks.length] ?? quiz[0];

  const answer = (guideChoice: string) => {
    setPicks((current) => [...current, guideChoice]);
  };

  return (
    <section className="ln-section" id="guides" aria-labelledby="guides-title">
      <h2 className="ln-h2" id="guides-title">
        Choose your guide
      </h2>
      <p className="ln-lede">
        Every tradition sends someone to walk with you. Five questions, asked at
        watch height; the night answers for you.
      </p>

      <div className="ln-quiz-wrap">
        {done && guide ? (
          <>
            <p className="ln-quiz-progress">The night has chosen</p>
            <div className="ln-qcard ln-reveal" aria-live="polite">
              <div className="ln-qcard-result">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={guide.emblem} alt={guide.emblemAlt} width={400} height={400} />
                <p className="ln-result-culture">
                  {guide.culture} · {guide.title}
                </p>
                <h3 className="ln-result-name">{guide.name}</h3>
                <p className="ln-result-creed">{guide.creed}</p>
                <div className="ln-result-actions">
                  <a
                    className="ln-cta-arc"
                    href="#offerings"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("ln:guide", { detail: guide.name }),
                        );
                      }
                    }}
                  >
                    Leave an offering
                  </a>
                  <button
                    type="button"
                    className="ln-cta-underline"
                    onClick={() => setPicks([])}
                  >
                    Ask the night again
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="ln-quiz-progress">
              Watch {NUMERALS[picks.length]} of {NUMERALS[NUMERALS.length - 1]}
            </p>
            <div className="ln-qcard ln-reveal" key={picks.length} aria-live="polite">
              <h3 className="ln-qcard-question">{question.question}</h3>
              <ul className="ln-answers">
                {question.answers.map((entry) => (
                  <li key={entry.label}>
                    <button
                      type="button"
                      className="ln-answer"
                      onClick={() => {
                        playSfx("chime");
                        answer(entry.guideId);
                      }}
                    >
                      {entry.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/**
 * The offering ledger for the static build: entries live in the visitor's
 * browser (localStorage), seeded with the archivist's three crossings so the
 * wall is never bare. Same shapes the full-stack ledger returns.
 */

export interface OfferingRow {
  id: number;
  name: string;
  text: string;
  guide: string | null;
  created: string;
}

const KEY = "tln-offerings-v1";

const SEED: OfferingRow[] = [
  {
    id: 3,
    name: "The Archivist",
    text: "A candle stub for the ferryman. It is not much, but it is lit.",
    guide: null,
    created: "2026-09-06T07:30:00",
  },
  {
    id: 2,
    name: "The Archivist",
    text: "For the dog at the last river: warm bread and a long walk home.",
    guide: "Xolotl",
    created: "2026-09-06T07:29:00",
  },
  {
    id: 1,
    name: "The Archivist",
    text: "One name, unspoken, kept for the road that keeps payments.",
    guide: "Veles",
    created: "2026-09-06T07:28:00",
  },
];

const MAX_ROWS = 48;

function read(): OfferingRow[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const rows = JSON.parse(raw) as OfferingRow[];
      if (Array.isArray(rows) && rows.length > 0) {
        return rows;
      }
    }
  } catch {
    // Private-mode storage or corrupt state; fall through to the seed.
  }
  return SEED;
}

function write(rows: OfferingRow[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rows));
  } catch {
    // Nothing sensible to do without storage; the wall stays session-only.
  }
}

export async function getOfferings(): Promise<{
  ok: true;
  items: OfferingRow[];
  total: number;
}> {
  const items = read();
  return { ok: true, items, total: items.length };
}

export async function addOffering(input: {
  name: string;
  text: string;
  guide?: string;
}): Promise<
  | { ok: true; items: OfferingRow[]; total: number }
  | { ok: false; error: string }
> {
  try {
    const current = read();
    const row: OfferingRow = {
      id: Date.now(),
      name: input.name.slice(0, 40),
      text: input.text.slice(0, 120),
      guide: input.guide ?? null,
      created: new Date().toISOString().slice(0, 19),
    };
    const next = [row, ...current].slice(0, MAX_ROWS);
    write(next);
    return { ok: true, items: next, total: next.length };
  } catch {
    return { ok: false, error: "The wall did not answer. Try again in a moment." };
  }
}

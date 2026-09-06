export function ColophonSection() {
  return (
    <footer className="ln-section ln-colophon" id="colophon" aria-labelledby="colophon-title">
      <div>
        <h2 className="ln-h2" id="colophon-title">
          Colophon
        </h2>
        <p>
          THE LONG NIGHT was built for the Codeflare 2.0 website-making
          competition, theme: Mythology and Folklore. Six traditions walk one
          night: the Prose Edda, the Egyptian Book of Gates, the Kojiki, Slavic
          folk tale, the Rigveda, and the Aztec road to Mictlan.
        </p>
        <p>
          Every painting, emblem and plate here was generated for this build. The
          journey film plays under your scroll; the atlas, bestiary, guides, tale
          and offering wall are hand-built: React 19, TanStack Start, Cloudflare
          Workers, and a small D1 ledger for the offerings.
        </p>
        <p className="ln-mono" style={{ marginTop: "1.2rem", fontSize: "0.72rem" }}>
          Watch the skies. Pay the ferryman. Mind the third path.
        </p>
      </div>
      <a className="ln-cta-quiet" href="/">
        Return to the first watch ↑
      </a>
    </footer>
  );
}

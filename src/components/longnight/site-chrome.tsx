export function SiteChrome() {
  return (
    <>
      <a className="ln-skip" href="#atlas">
        Skip to the atlas
      </a>
      <a className="ln-brand" href="/" aria-label="The Long Night, back to the top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="assets/brand/mark.webp" alt="" width={32} height={32} />
        <span>The Long Night</span>
      </a>
    </>
  );
}

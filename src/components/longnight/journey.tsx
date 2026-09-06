import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { playSfx } from "@/lib/sound";
import { scrollScrubScenes } from "@/scroll-scrub-scenes";
import "../scroll-scrub/scroll-scrub.css";

/**
 * Frame-sequence journey: the film ships as 900 individual frames and the
 * visitor's scroll position selects the frame painted on a canvas. The
 * displayed frame eases toward the scroll target (time-based lerp), so wheel
 * steps become fluid motion; frames stream in lazily around the position and
 * live in a browser-managed image cache that is cheap enough to keep both
 * scroll directions instant.
 */

const FRAME_COUNT = 900;
const CACHE_LIMIT = 240;
const LOAD_WINDOW = 56;
/** Higher = snappier easing of the displayed frame toward the target. */
const EASE_PER_SECOND = 10;

const frameUrl = (i: number) =>
  `frames/night/f_${String(i + 1).padStart(4, "0")}.jpg`;

function loadFrame(i: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`frame ${i} failed`));
    image.src = frameUrl(i);
  });
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function Journey() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const jumpRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let rootTop = 0;
    let total = 1;
    let dirty = true;
    let frame = 0;
    let targetIndex = 0;
    let displayedIndex = 0;
    let drawnIndex = -1;
    let backgroundIndex = 0;
    let lastTick = performance.now();
    let destroyed = false;

    const bands = Array.from(
      root.querySelectorAll<HTMLElement>("[data-ln-band]"),
    ).map((band) => ({ band, start: 0, end: 0 }));

    const cache = new Map<number, HTMLImageElement>();
    const inflight = new Map<number, Promise<void>>();

    const evict = () => {
      if (cache.size <= CACHE_LIMIT) {
        return;
      }
      const entries = [...cache.entries()].sort((a, b) => {
        const da = Math.abs(a[0] - targetIndex);
        const db = Math.abs(b[0] - targetIndex);
        if (da !== db) {
          return db - da; // farthest from the target first
        }
        return a[0] - b[0];
      });
      while (cache.size > CACHE_LIMIT) {
        const [index] = entries.shift()!;
        cache.delete(index);
      }
    };

    const ensure = (index: number) => {
      if (
        index < 0 ||
        index >= FRAME_COUNT ||
        cache.has(index) ||
        inflight.has(index) ||
        inflight.size >= 10
      ) {
        return;
      }
      const promise = loadFrame(index)
        .then((image) => {
          if (destroyed) {
            return;
          }
          cache.set(index, image);
          evict();
          dirty = true;
        })
        .catch(() => {
          // A failed frame never paints; its neighbours cover it.
        })
        .finally(() => {
          inflight.delete(index);
        });
      inflight.set(index, promise);
    };

    const drawCover = (image: HTMLImageElement) => {
      const width = canvas.width;
      const height = canvas.height;
      const iw = image.naturalWidth || 1920;
      const ih = image.naturalHeight || 1080;
      const scale = Math.max(width / iw, height / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      context.drawImage(
        image,
        (width - dw) / 2,
        (height - dh) / 2,
        dw,
        dh,
      );
    };

    const paint = (index: number) => {
      for (let distance = 0; distance < FRAME_COUNT; distance += 1) {
        const up = index - distance;
        const down = index + distance;
        const candidate = cache.has(up)
          ? up
          : cache.has(down)
            ? down
            : -1;
        if (candidate === -1) {
          continue;
        }
        if (candidate !== drawnIndex) {
          drawCover(cache.get(candidate)!);
          drawnIndex = candidate;
        }
        return;
      }
      context.fillStyle = "#090d1f";
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const layout = () => {
      const pageY = window.scrollY || window.pageYOffset;
      rootTop = root.getBoundingClientRect().top + pageY;
      for (const band of bands) {
        const rect = band.band.getBoundingClientRect();
        band.start = rect.top + pageY - rootTop;
        band.end = band.start + rect.height;
      }
      total = Math.max(bands.at(-1)?.end ?? 1, 1);

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(window.innerWidth * dpr);
      const height = Math.round(window.innerHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      dirty = true;
    };

    const tick = (now: number) => {
      if (destroyed) {
        return;
      }
      const dt = Math.min(now - lastTick, 100);
      lastTick = now;

      if (dirty) {
        dirty = false;
        const pageY = window.scrollY || window.pageYOffset;
        const y = clamp(pageY - rootTop, 0, total);
        const progress = clamp(y / total);
        targetIndex = Math.round(progress * (FRAME_COUNT - 1));
        root.style.setProperty("--ss-progress", progress.toFixed(4));

        let chapter = 0;
        for (const [index, band] of bands.entries()) {
          if (y >= band.start) {
            chapter = index;
          }
        }
        if (chapter !== activeRef.current) {
          activeRef.current = chapter;
          setActive(chapter);
          playSfx("swell");
        }

        // Prime the loading window around the target, nearest first.
        for (let distance = 0; distance <= LOAD_WINDOW; distance += 1) {
          ensure(targetIndex + distance);
          if (distance > 0) {
            ensure(targetIndex - distance);
          }
        }
      }

      // Ease the displayed frame toward the scroll target: chunky wheel
      // steps become continuous motion at the display's own frame rate.
      if (displayedIndex !== targetIndex) {
        const factor = reduceMotion ? 1 : 1 - Math.exp(-dt * 0.001 * EASE_PER_SECOND);
        displayedIndex += (targetIndex - displayedIndex) * factor;
        if (Math.abs(targetIndex - displayedIndex) < 0.05) {
          displayedIndex = targetIndex;
        }
      }
      paint(Math.round(clamp(displayedIndex, 0, FRAME_COUNT - 1)));

      // Background-buffer the whole film at low priority: the live scrub
      // always takes the fetch slots first; this fills everything else so
      // every later pass through the night plays straight from cache.
      if (inflight.size < 4 && backgroundIndex < FRAME_COUNT) {
        while (
          backgroundIndex < FRAME_COUNT &&
          (cache.has(backgroundIndex) || inflight.has(backgroundIndex))
        ) {
          backgroundIndex += 1;
        }
        if (backgroundIndex < FRAME_COUNT) {
          ensure(backgroundIndex);
          backgroundIndex += 1;
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      dirty = true;
    };
    const onResize = () => {
      layout();
    };

    jumpRef.current = (index: number) => {
      const band = bands[index];
      if (!band) {
        return;
      }
      window.scrollTo({
        behavior: reduceMotion ? "auto" : "smooth",
        top: rootTop + band.start + 0.15 * (band.end - band.start),
      });
    };

    layout();
    ensure(0);
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", layout);

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", layout);
      root.style.removeProperty("--ss-progress");
      cache.clear();
    };
  }, []);

  const themeStyle: CSSProperties & Record<`--ss-${string}`, string> = {
    "--ss-accent": "#e3a44b",
    "--ss-bg": "#0e1630",
    "--ss-ink": "#ede7d9",
    "--ss-muted": "#9aa6c4",
  };

  return (
    <section className="scroll-scrub" ref={rootRef} style={themeStyle}>
      <div className="scroll-scrub__stage">
        <div aria-hidden="true" className="scroll-scrub__media">
          <figure className="scroll-scrub__layer">
            <canvas
              aria-hidden="true"
              className="ln-frame-canvas"
              ref={canvasRef}
            />
          </figure>
        </div>

        <div aria-hidden="true" className="scroll-scrub__progress">
          <span />
        </div>

        <nav aria-label="Scroll chapters" className="scroll-scrub__route">
          {scrollScrubScenes.map((scene, index) => (
            <button
              aria-current={active === index ? "step" : undefined}
              className="scroll-scrub__route-button"
              key={scene.id}
              onClick={() => jumpRef.current(index)}
              type="button"
            >
              <span>{scene.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="scroll-scrub__story">
        {scrollScrubScenes.map((scene, index) => {
          const Heading = index === 0 ? "h1" : "h2";
          return (
            <article
              className="scroll-scrub__chapter"
              data-align={scene.align ?? "left"}
              data-ln-band=""
              id={scene.id}
              key={scene.id}
              style={{
                minHeight: `${Math.max(scene.scroll ?? 1.4, 0.2) * 100}dvh`,
              }}
            >
              <div className="scroll-scrub__chapter-pin">
                <div className="scroll-scrub__copy">
                  {scene.kicker ? (
                    <p className="scroll-scrub__kicker">{scene.kicker}</p>
                  ) : null}
                  <Heading className="scroll-scrub__title">
                    {scene.title}
                  </Heading>
                  <p className="scroll-scrub__body">{scene.body}</p>
                  {scene.tags?.length ? (
                    <ul className="scroll-scrub__tags">
                      {scene.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  ) : null}
                  {scene.actions ? (
                    <div className="scroll-scrub__actions">
                      {scene.actions as ReactNode}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

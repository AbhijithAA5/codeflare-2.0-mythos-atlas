import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { playSfx } from "@/lib/sound";
import { scrollScrubScenes } from "@/scroll-scrub-scenes";
import "../scroll-scrub/scroll-scrub.css";

/**
 * Frame-sequence journey: the film ships as 900 individual frames and the
 * visitor's scroll position directly picks the frame to paint on a canvas.
 * No video seeking anywhere, so nothing can skip: the drawn frame always
 * answers exactly to the scroll. Frames load lazily around the current
 * position with an LRU cache; the nearest loaded frame paints while the
 * exact one streams in.
 */

const FRAME_COUNT = 900;
const CACHE_LIMIT = 96;
const LOAD_WINDOW = 56;

const frameUrl = (i: number) =>
  `assets/frames/night/f_${String(i + 1).padStart(4, "0")}.jpg`;

type Decoded = ImageBitmap | HTMLImageElement;

function loadFrame(i: number): Promise<Decoded> {
  if (typeof createImageBitmap === "function") {
    return fetch(frameUrl(i))
      .then((response) => response.blob())
      .then((blob) => createImageBitmap(blob));
  }
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
    let drawnIndex = -1;
    let destroyed = false;

    const bands = Array.from(
      root.querySelectorAll<HTMLElement>("[data-ln-band]"),
    ).map((band) => ({ band, start: 0, end: 0 }));

    type Entry = { decoded: Decoded; used: number };
    const cache = new Map<number, Entry>();
    const inflight = new Map<number, Promise<void>>();
    let clock = 0;

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
        return a[1].used - b[1].used;
      });
      while (cache.size > CACHE_LIMIT) {
        const [index, entry] = entries.shift()!;
        cache.delete(index);
        if ("close" in entry.decoded && typeof entry.decoded.close === "function") {
          entry.decoded.close();
        }
      }
    };

    const ensure = (index: number) => {
      if (cache.has(index) || inflight.has(index)) {
        return;
      }
      const promise = loadFrame(index)
        .then((decoded) => {
          if (destroyed) {
            if ("close" in decoded && typeof decoded.close === "function") {
              decoded.close();
            }
            return;
          }
          cache.set(index, { decoded, used: ++clock });
          evict();
          dirty = true;
        })
        .catch(() => {
          // A failed frame just never paints; its neighbours cover it.
        })
        .finally(() => {
          inflight.delete(index);
        });
      inflight.set(index, promise);
    };

    const drawCover = (decoded: Decoded) => {
      const width = canvas.width;
      const height = canvas.height;
      const iw = "width" in decoded ? decoded.width : 0;
      const ih = "height" in decoded ? decoded.height : 0;
      if (!iw || !ih) {
        return;
      }
      const scale = Math.max(width / iw, height / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      context.drawImage(
        decoded as CanvasImageSource,
        (width - dw) / 2,
        (height - dh) / 2,
        dw,
        dh,
      );
    };

    const paint = (index: number) => {
      for (let distance = 0; distance < FRAME_COUNT; distance += 1) {
        const candidate =
          distance === 0
            ? index
            : index - distance >= 0
              ? index - distance
              : index + distance;
        const entry = cache.get(candidate);
        if (entry) {
          entry.used = ++clock;
          if (candidate !== drawnIndex || dirty) {
            drawCover(entry.decoded);
            drawnIndex = candidate;
          }
          return;
        }
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

    const tick = () => {
      if (destroyed) {
        return;
      }
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

      paint(targetIndex);
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
      for (const entry of cache.values()) {
        if ("close" in entry.decoded && typeof entry.decoded.close === "function") {
          entry.decoded.close();
        }
      }
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

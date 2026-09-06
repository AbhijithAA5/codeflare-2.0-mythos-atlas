import { useEffect, useRef } from "react";

/**
 * A soft ember of light that trails the cursor on fine-pointer devices.
 * Purely decorative: pointer-events none, disabled for touch and
 * reduced-motion users, transform-only updates on the hot path.
 */
export function EmberGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) {
      return;
    }
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) {
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.4;
    let x = targetX;
    let y = targetY;
    let seen = false;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!seen) {
        seen = true;
        x = targetX;
        y = targetY;
        glow.dataset.visible = "true";
      }
    };

    const tick = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={glowRef} aria-hidden="true" className="ln-ember-glow" />;
}

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Options {
  // "window" : coordonnées relatives à la fenêtre (ImageStack)
  // "element" : coordonnées relatives au container (ParallaxMedia)
  source?: "window" | "element";
  containerRef?: React.RefObject<HTMLElement | null>;
  strengthX?: number;
  strengthY?: number;
  // Quand disabledRef.current est true, les mouvements sont ignorés (ex: pendant une transition)
  disabledRef?: React.RefObject<boolean>;
}

// depth : 0 = premier plan (mouvement max), 1 = arrière-plan (mouvement min)
export function useParallaxMouse(
  itemsRef: React.RefObject<(HTMLElement | null)[]>,
  depths: number[],
  strength = 24,
  options: Options = {},
) {
  const quickTosRef = useRef<Array<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc; sx: number; sy: number } | null>>([]);

  const { source = "window", containerRef, strengthX = strength, strengthY = strength, disabledRef } = options;

  const rebuild = () => {
    quickTosRef.current = itemsRef.current.map((el, i) => {
      if (!el) return null;
      const d = depths[i] ?? 0;
      const factor = 1 - d * 0.6;
      return {
        x: gsap.quickTo(el, "x", { duration: 0.5 + d * 0.35, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.5 + d * 0.35, ease: "power3.out" }),
        sx: strengthX * factor,
        sy: strengthY * factor,
      };
    });
  };

  useEffect(() => {
    rebuild();

    const eventTarget: EventTarget = source === "element" && containerRef?.current
      ? containerRef.current
      : window;

    const onMove = (e: MouseEvent) => {
      if (disabledRef?.current) return;
      let nx: number, ny: number;
      if (source === "element" && containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      } else {
        nx = e.clientX / window.innerWidth - 0.5;
        ny = e.clientY / window.innerHeight - 0.5;
      }
      quickTosRef.current.forEach((qt) => {
        if (!qt) return;
        qt.x(nx * qt.sx);
        qt.y(ny * qt.sy);
      });
    };

    const onLeave = () => quickTosRef.current.forEach((qt) => { if (qt) { qt.x(0); qt.y(0); } });

    eventTarget.addEventListener("mousemove", onMove as EventListener);
    if (source === "element" && containerRef?.current) {
      containerRef.current.addEventListener("mouseleave", onLeave);
    }

    return () => {
      eventTarget.removeEventListener("mousemove", onMove as EventListener);
      if (source === "element" && containerRef?.current) {
        containerRef.current.removeEventListener("mouseleave", onLeave);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength, source]);

  return { rebuild };
}

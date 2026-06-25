"use client";

import { useRef, Children } from "react";
import { useParallaxMouse } from "@/hooks/useParallaxMouse";
import styles from "./ParallaxMedia.module.scss";

export interface ParallaxLayer {
  content: React.ReactNode;
  // 0 = premier plan (net, mouvement max) — 1 = arrière-plan (flou max, mouvement réduit)
  // Si omis, la profondeur est calculée automatiquement depuis l'index de la couche
  depth?: number;
}

interface ParallaxMediaProps {
  layers?: ParallaxLayer[];
  children?: React.ReactNode;
  strength?: number;
  maxBlur?: number;
  className?: string;
}

export default function ParallaxMedia({
  layers,
  children,
  strength = 24,
  maxBlur = 4,
  className,
}: ParallaxMediaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const resolvedLayers: ParallaxLayer[] = layers ?? Children.toArray(children).map((child) => ({ content: child }));
  const count = resolvedLayers.length;

  const depths = resolvedLayers.map((l, i) =>
    l.depth !== undefined ? l.depth : count > 1 ? i / (count - 1) : 0
  );

  useParallaxMouse(layerRefs, depths, strength, {
    source: "element",
    containerRef: wrapperRef,
  });

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${className ?? ""}`}
      style={{ "--_p-buffer": `${strength}px` } as React.CSSProperties}
    >
      {resolvedLayers.map((layer, i) => {
        const blur = depths[i] * maxBlur;
        return (
          <div
            key={i}
            ref={(el) => { layerRefs.current[i] = el; }}
            className={styles.layer}
            style={blur > 0 ? { filter: `blur(${blur.toFixed(2)}px)` } : undefined}
          >
            {layer.content}
          </div>
        );
      })}
    </div>
  );
}

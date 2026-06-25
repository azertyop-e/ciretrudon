"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import ImageReveal from "@/components/ImageReveal/ImageReveal";
import { useParallaxMouse } from "@/hooks/useParallaxMouse";
import { SLOTS, QUESTIONS, type Slot } from "@/lib/const";
import styles from "./ImageStack.module.scss";

const MAX_Z = SLOTS.length;
const DEPTHS = SLOTS.map((s) => 1 - s.zIndex / MAX_Z);
// Rang de chaque slot reveal (back → front)
const REVEAL_RANKS = SLOTS.map((s, i) =>
  s.reveal ? SLOTS.slice(0, i).filter((r) => r.reveal).length : -1
);
// Indices des slots reveal et leurs délais de base
const REVEAL_SLOT_INDICES = SLOTS.reduce<number[]>((acc, s, i) => {
  if (s.reveal) acc.push(i);
  return acc;
}, []);
const BASE_STAGGER = 0.07;
const REVEAL_DELAYS = REVEAL_SLOT_INDICES.map((_, rank) => rank * BASE_STAGGER);

function getCoverTarget(element: HTMLElement, slot: Slot) {
  const rect = element.getBoundingClientRect();
  const currentX = (gsap.getProperty(element, "x") as number) || 0;
  const currentY = (gsap.getProperty(element, "y") as number) || 0;
  return {
    x: currentX + (window.innerWidth * slot.cover.xPct - (rect.left + rect.width / 2)),
    y: currentY + (window.innerHeight * slot.cover.yPct - (rect.top + rect.height / 2)),
    rotation: slot.cover.rotation,
  };
}

export type ImageStackHandle = {
  run: (onMidpoint: () => void, onComplete: () => void) => void;
};

type ImageStackProps = {
  isTransitioning: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  questionIndex: number;
  hoveredAnswerIndex?: number | null;
  persistentAdditions: Partial<Record<number, string>>;
};

const ImageStack = forwardRef<ImageStackHandle, ImageStackProps>(
  function ImageStack({ isTransitioning, contentRef, questionIndex, hoveredAnswerIndex, persistentAdditions }, ref) {
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const isAnimatingRef = useRef(false);
    // Délais de stagger randomisés au hover : recalculés à chaque changement de réponse survolée
    const hoverDelayRef = useRef<{
      forAnswer: number | null;
      delays: Partial<Record<number, number>>;
    }>({ forAnswer: null, delays: {} });

    const { rebuild } = useParallaxMouse(imageRefs, DEPTHS, 100, {
      source: "window",
      strengthX: 100,
      strengthY: 70,
      disabledRef: isAnimatingRef,
    });

    // Mount fly-in
    useEffect(() => {
      const ctx = gsap.context(() => {
        imageRefs.current.forEach((element, index) => {
          if (!element) return;
          const { ambient } = SLOTS[index];
          gsap.set(element, {
            rotation: ambient.rotation,
            transformOrigin: "50% 50%",
            scale: 0.8,
            opacity: 0,
            x: 0,
            y: 0,
          });
          gsap.to(element, {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: 0.1 + index * 0.07,
            ease: "power3.out",
          });
        });
      });
      return () => ctx.revert();
    }, []);

    useImperativeHandle(ref, () => ({
      run(onMidpoint, onComplete) {
        const allRefs = imageRefs.current.filter(Boolean) as HTMLDivElement[];
        // N'animer que les slots qui ont du contenu au moment du déclenchement
        const active = allRefs
          .map((el, i) => ({ el, i }))
          .filter(({ el }) => el.classList.contains(styles.ambientImage));
        const images = active.map(({ el }) => el);
        const indices = active.map(({ i }) => i);

        const content = contentRef.current;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion || !content) {
          onMidpoint();
          onComplete();
          return;
        }

        // Pas d'images actives : simple fondu du contenu
        if (images.length === 0) {
          const tl = gsap.timeline({ onComplete });
          tl.to(content, { opacity: 0, scale: 0.97, duration: 0.28, ease: "power2.in" });
          tl.call(onMidpoint);
          tl.to(content, { opacity: 1, scale: 1, duration: 0.42, ease: "power2.out" });
          return;
        }

        isAnimatingRef.current = true;
        gsap.killTweensOf(images, "x,y,scale,rotation,filter");

        images.forEach((el, i) => {
          gsap.set(el, { zIndex: 10 + i });
        });

        // Chaque image vole vers sa position cover (répartie sur tout l'écran)
        const coverTargets = images.map((el, i) =>
          getCoverTarget(el, SLOTS[indices[i]])
        );

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            images.forEach((el, i) => {
              gsap.set(el, { zIndex: SLOTS[indices[i]].zIndex });
            });
            images.forEach((el, i) => {
              const blur = DEPTHS[indices[i]] * 1.5;
              gsap.to(el, { filter: blur > 0 ? `blur(${blur.toFixed(2)}px)` : "blur(0px)", duration: 0.3, ease: "power2.out" });
            });
            rebuild();
            isAnimatingRef.current = false;
            onComplete();
          },
        });

        // Contenu disparaît
        tl.to(content, { opacity: 0, scale: 0.97, duration: 0.28 });

        // Déploiement : images se dispersent sur l'écran vers leurs positions cover
        tl.to(
          images,
          {
            x: (i) => coverTargets[i].x,
            y: (i) => coverTargets[i].y,
            rotation: (i) => coverTargets[i].rotation,
            duration: 0.55,
            stagger: { each: 0.04, from: "start" },
          },
          "-=0.1",
        );

        // Midpoint : changement de question au pic du déploiement
        tl.call(onMidpoint, [], "+=0.08");

        // Repli : images reviennent à leurs positions ambiantes
        tl.to(
          images,
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: (i) => SLOTS[indices[i]].ambient.rotation,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.04, from: "end" },
          },
        );

        // Contenu réapparaît pendant la fin du repli
        tl.to(
          content,
          { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" },
          "-=0.42",
        );
      },
    }));

    // Randomise les délais de stagger à chaque changement de réponse survolée
    if (hoveredAnswerIndex !== hoverDelayRef.current.forAnswer) {
      if (hoveredAnswerIndex == null) {
        hoverDelayRef.current = { forAnswer: null, delays: {} };
      } else {
        const shuffled = [...REVEAL_DELAYS].sort(() => Math.random() - 0.5);
        const delays: Partial<Record<number, number>> = {};
        REVEAL_SLOT_INDICES.forEach((slotIdx, rank) => { delays[slotIdx] = shuffled[rank]; });
        hoverDelayRef.current = { forAnswer: hoveredAnswerIndex, delays };
      }
    }

    return (
      <div
        className={`${styles.wrapper} ${isTransitioning ? styles.transitioning : ""}`}
        aria-hidden="true"
      >
        {SLOTS.map((slot, index) => {
          const blur = DEPTHS[index] * 1.5;
          const baseSrc = QUESTIONS[questionIndex]?.ambientSlots[index] ?? persistentAdditions[index] ?? null;
          const hoverSrc = hoveredAnswerIndex != null
            ? QUESTIONS[questionIndex]?.answers[hoveredAnswerIndex]?.replacements?.[index]
            : undefined;
          const src = hoverSrc ?? baseSrc;
          const additionSrc = hoveredAnswerIndex != null
            ? (QUESTIONS[questionIndex]?.answers[hoveredAnswerIndex]?.additions?.[index] ?? null)
            : null;
          const hasContent = src != null || additionSrc != null;
          // Délai fixe pour les slots ambient, aléatoire pour les reveals au hover
          const revealDelay = hoveredAnswerIndex != null && slot.reveal
            ? (hoverDelayRef.current.delays[index] ?? 0)
            : REVEAL_RANKS[index] >= 0 ? REVEAL_RANKS[index] * BASE_STAGGER : 0;
          return (
            <div
              key={index}
              ref={(node) => { imageRefs.current[index] = node; }}
              className={hasContent ? styles.ambientImage : undefined}
              style={{
                position: "absolute",
                ...slot.ambient.style,
                zIndex: slot.zIndex,
                filter: hasContent && blur > 0 ? `blur(${blur.toFixed(2)}px)` : undefined,
              }}
            >
              <ImageReveal
                src={src}
                instant={isTransitioning}
                revealDelay={revealDelay}
              />
              <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <ImageReveal
                  src={additionSrc}
                  instant={isTransitioning}
                  revealDelay={revealDelay}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

export default ImageStack;

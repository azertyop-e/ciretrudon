"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import ImageReveal from "@/components/ImageReveal/ImageReveal";
import { useParallaxMouse } from "@/hooks/useParallaxMouse";
import { SLOTS, QUIZ, type Slot } from "@/lib/const";
import styles from "./ImageStack.module.scss";

type CoverPosition = Slot["cover"];

const MAX_Z = SLOTS.length;
const DEPTHS = SLOTS.map((s) => 1 - s.zIndex / MAX_Z);

function getCoverTarget(element: HTMLElement, cover: CoverPosition) {
  const rect = element.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = (vw * cover.widthPct) / rect.width;
  const targetCX = vw * cover.xPct;
  const targetCY = vh * cover.yPct;
  const currentX = (gsap.getProperty(element, "x") as number) || 0;
  const currentY = (gsap.getProperty(element, "y") as number) || 0;
  return {
    scale,
    x: currentX + (targetCX - (rect.left + rect.width / 2)),
    y: currentY + (targetCY - (rect.top + rect.height / 2)),
    rotation: cover.rotation,
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
};

const ImageStack = forwardRef<ImageStackHandle, ImageStackProps>(
  function ImageStack({ isTransitioning, contentRef, questionIndex, hoveredAnswerIndex }, ref) {
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const isAnimatingRef = useRef(false);

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
        const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
        const content = contentRef.current;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion || images.length === 0 || !content) {
          onMidpoint();
          onComplete();
          return;
        }

        isAnimatingRef.current = true;
        gsap.killTweensOf(images, "x,y,scale,rotation,filter");
        gsap.to(images, { filter: "blur(0px)", duration: 0.2, ease: "power2.in" });

        images.forEach((el, i) => {
          gsap.set(el, { zIndex: 10 + i });
        });

        const targets = images.map((el, i) =>
          getCoverTarget(el, SLOTS[i].cover)
        );

        const tl = gsap.timeline({
          onComplete: () => {
            images.forEach((el, i) => {
              gsap.set(el, { zIndex: SLOTS[i].zIndex });
            });
            images.forEach((el, i) => {
              const blur = DEPTHS[i] * 1.5;
              gsap.to(el, { filter: blur > 0 ? `blur(${blur.toFixed(2)}px)` : "blur(0px)", duration: 0.3, ease: "power2.out" });
            });
            rebuild();
            isAnimatingRef.current = false;
            onComplete();
          },
        });

        tl.to(content, { opacity: 0, scale: 0.97, duration: 0.28, ease: "power2.in" });

        tl.to(
          images,
          {
            scale: (i) => targets[i].scale,
            x: (i) => targets[i].x,
            y: (i) => targets[i].y,
            rotation: (i) => targets[i].rotation,
            duration: 0.55,
            ease: "power2.inOut",
            stagger: 0.07,
          },
          "-=0.12",
        );

        tl.call(onMidpoint);

        tl.to(
          images,
          {
            scale: 1,
            x: 0,
            y: 0,
            rotation: (i) => SLOTS[i].ambient.rotation,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.07, from: "end" },
          },
        );

        tl.to(
          content,
          { opacity: 1, scale: 1, duration: 0.42, ease: "power2.out" },
          "-=0.4",
        );
      },
    }));

    return (
      <div
        className={`${styles.wrapper} ${isTransitioning ? styles.transitioning : ""}`}
        aria-hidden="true"
      >
        {SLOTS.map((slot, index) => {
          const blur = DEPTHS[index] * 1.5;
          const baseSrc = QUIZ[questionIndex]?.ambientSlots[index] ?? null;
          const hoverSrc = hoveredAnswerIndex != null
            ? QUIZ[questionIndex]?.answers[hoveredAnswerIndex]?.replacements[index]
            : undefined;
          const src = hoverSrc ?? baseSrc;
          return (
            <div
              key={index}
              ref={(node) => { imageRefs.current[index] = node; }}
              className={styles.ambientImage}
              style={{
                ...slot.ambient.style,
                zIndex: slot.zIndex,
                filter: blur > 0 ? `blur(${blur.toFixed(2)}px)` : undefined,
              }}
            >
              <ImageReveal
                src={src}
                instant={isTransitioning}
              />
            </div>
          );
        })}
      </div>
    );
  },
);

export default ImageStack;

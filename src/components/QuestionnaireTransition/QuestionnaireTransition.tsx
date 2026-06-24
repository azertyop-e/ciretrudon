"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./QuestionnaireTransition.module.scss";

type CoverState = {
  xPct: number;
  yPct: number;
  widthPct: number;
  rotation: number;
};

type AmbientImage = {
  src: string;
  alt: string;
  rotation: number;
  zIndex: number;
  parallaxStrength: number;
  transformOrigin: string;
  cover: CoverState;
  style: React.CSSProperties;
};

// Taille et vitesse proportionnelles à la profondeur :
// zIndex faible = arrière-plan → petit, lent | zIndex élevé = premier plan → grand, rapide
const AMBIENT_IMAGES: AmbientImage[] = [
  // ── Arrière-plan (zIndex 1–2) — petits, très lents ───────────────────────
  {
    src: "/images/categories/bougies.jpg",
    alt: "",
    rotation: -18,
    zIndex: 1,
    parallaxStrength: 12,
    transformOrigin: "80% 100%",
    cover: { xPct: 0.26, yPct: 0.50, widthPct: 0.54, rotation: -3 },
    style: { top: "5%", left: "3%", width: "clamp(5rem, 7vw, 7rem)", height: "clamp(7rem, 9vw, 9rem)" },
  },
  {
    src: "/images/categories/savons.jpg",
    alt: "",
    rotation: 19,
    zIndex: 2,
    parallaxStrength: 16,
    transformOrigin: "30% 100%",
    cover: { xPct: 0.74, yPct: 0.50, widthPct: 0.54, rotation: 3 },
    style: { top: "3%", right: "8%", width: "clamp(6rem, 8vw, 8rem)", height: "clamp(8rem, 10vw, 10rem)" },
  },

  // ── Plans intermédiaires (zIndex 3–5) — taille et vitesse moyennes ────────
  {
    src: "/images/categories/diffuseurs.jpg",
    alt: "",
    rotation: -22,
    zIndex: 3,
    parallaxStrength: 22,
    transformOrigin: "60% 50%",
    cover: { xPct: 0.47, yPct: 0.78, widthPct: 0.35, rotation: 5 },
    style: { top: "48%", left: "2%", width: "clamp(7rem, 10vw, 10rem)", height: "clamp(9rem, 12vw, 12rem)" },
  },
  {
    src: "/images/categories/parfums.jpg",
    alt: "",
    rotation: 14,
    zIndex: 4,
    parallaxStrength: 28,
    transformOrigin: "50% 50%",
    cover: { xPct: 0.50, yPct: 0.22, widthPct: 0.37, rotation: -6 },
    style: { top: "20%", left: "16%", width: "clamp(8rem, 11vw, 11rem)", height: "clamp(10rem, 14vw, 14rem)" },
  },
  {
    src: "/images/categories/albatres.jpg",
    alt: "",
    rotation: -12,
    zIndex: 5,
    parallaxStrength: 36,
    transformOrigin: "50% 50%",
    cover: { xPct: 0.53, yPct: 0.52, widthPct: 0.34, rotation: -2 },
    style: { bottom: "10%", left: "10%", width: "clamp(9rem, 13vw, 13rem)", height: "clamp(11rem, 16vw, 16rem)" },
  },

  // ── Premier plan (zIndex 6–8) — grands, rapides ───────────────────────────
  {
    src: "/images/categories/accessoires.jpg",
    alt: "",
    rotation: -8,
    zIndex: 6,
    parallaxStrength: 44,
    transformOrigin: "40% 50%",
    cover: { xPct: 0.11, yPct: 0.19, widthPct: 0.24, rotation: 10 },
    style: { top: "38%", right: "3%", width: "clamp(10rem, 14vw, 14rem)", height: "clamp(12rem, 18vw, 18rem)" },
  },
  {
    src: "/images/categories/promeneuse.jpg",
    alt: "",
    rotation: 16,
    zIndex: 7,
    parallaxStrength: 54,
    transformOrigin: "50% 50%",
    cover: { xPct: 0.83, yPct: 0.17, widthPct: 0.26, rotation: 9 },
    style: { bottom: "5%", right: "5%", width: "clamp(11rem, 16vw, 16rem)", height: "clamp(13rem, 20vw, 20rem)" },
  },
  {
    src: "/images/categories/vaporisateurs.jpg",
    alt: "",
    rotation: 11,
    zIndex: 8,
    parallaxStrength: 64,
    transformOrigin: "50% 60%",
    cover: { xPct: 0.87, yPct: 0.82, widthPct: 0.23, rotation: -7 },
    style: { bottom: "25%", right: "16%", width: "clamp(12rem, 17vw, 17rem)", height: "clamp(14rem, 22vw, 22rem)" },
  },
];

function getCoverTarget(element: HTMLElement, cover: CoverState) {
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

export type QuestionnaireTransitionHandle = {
  run: (onMidpoint: () => void, onComplete: () => void) => void;
};

type QuestionnaireTransitionProps = {
  isTransitioning: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const QuestionnaireTransition = forwardRef<QuestionnaireTransitionHandle, QuestionnaireTransitionProps>(
  function QuestionnaireTransition({ isTransitioning, contentRef }, ref) {
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const isAnimatingRef = useRef(false);
    const quickTosRef = useRef<Array<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc; depth: number } | null>>([]);

    const buildQuickTos = () => {
      quickTosRef.current = imageRefs.current.map((el, i) => {
        if (!el) return null;
        return {
          x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power2.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power2.out" }),
          depth: AMBIENT_IMAGES[i].zIndex / 8,
        };
      });
    };

    // Mount fly-in
    useEffect(() => {
      const ctx = gsap.context(() => {
        imageRefs.current.forEach((element, index) => {
          if (!element) return;
          gsap.set(element, {
            rotation: AMBIENT_IMAGES[index].rotation,
            transformOrigin: AMBIENT_IMAGES[index].transformOrigin,
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

    // Mouse parallax — depth-based, gated while transition runs
    useEffect(() => {
      buildQuickTos();

      const onMouseMove = (e: MouseEvent) => {
        if (isAnimatingRef.current) return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        quickTosRef.current.forEach((qt) => {
          if (!qt) return;
          qt.x(nx * 100 * qt.depth);
          qt.y(ny * 70 * qt.depth);
        });
      };

      window.addEventListener("mousemove", onMouseMove);
      return () => window.removeEventListener("mousemove", onMouseMove);
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
        gsap.killTweensOf(images, "x,y,scale,rotation");

        images.forEach((el, i) => {
          gsap.set(el, { transformOrigin: "50% 50%", zIndex: 10 + i });
        });

        const targets = images.map((el, i) => getCoverTarget(el, AMBIENT_IMAGES[i].cover));

        const tl = gsap.timeline({
          onComplete: () => {
            images.forEach((el, i) => {
              gsap.set(el, {
                transformOrigin: AMBIENT_IMAGES[i].transformOrigin,
                zIndex: AMBIENT_IMAGES[i].zIndex,
              });
            });
            // killTweensOf détruit les tweens internes des quickTo — on les recrée
            buildQuickTos();
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
            rotation: (i) => AMBIENT_IMAGES[i].rotation,
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
        {AMBIENT_IMAGES.map((image, index) => (
          <div
            key={image.src}
            ref={(node) => {
              imageRefs.current[index] = node;
            }}
            className={styles.ambientImage}
            style={{ ...image.style, zIndex: image.zIndex }}
          >
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 50vw, 30vw" />
          </div>
        ))}
      </div>
    );
  },
);

export default QuestionnaireTransition;

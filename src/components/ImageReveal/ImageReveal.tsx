"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./ImageReveal.module.scss";

interface Props {
  src: string | null;
  className?: string;
  // Quand true, le changement de src se fait sans animation (pendant les transitions)
  instant?: boolean;
}

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

export default function ImageReveal({ src, className, instant }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSrcRef = useRef<string | null>(null);

  const setMedia = (newSrc: string) => {
    if (isVideo(newSrc)) {
      const video = videoRef.current;
      if (!video) return;
      video.src = newSrc;
      video.play().catch(() => {});
      if (imgRef.current) imgRef.current.src = "";
    } else {
      if (imgRef.current) imgRef.current.src = newSrc;
      const video = videoRef.current;
      if (video) { video.pause(); video.src = ""; }
    }
    currentSrcRef.current = newSrc;
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    gsap.killTweensOf(wrapper);

    if (!src) {
      if (!currentSrcRef.current) return;
      gsap.fromTo(
        wrapper,
        { clipPath: "inset(0% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => { currentSrcRef.current = null; },
        }
      );
      return;
    }

    if (!currentSrcRef.current) {
      setMedia(src);
      gsap.fromTo(
        wrapper,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power2.out" }
      );
      return;
    }

    if (src === currentSrcRef.current) return;

    if (instant) {
      setMedia(src);
      gsap.set(wrapper, { clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }

    gsap.to(wrapper, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        setMedia(src);
        gsap.fromTo(
          wrapper,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power2.out" }
        );
      },
    });
  }, [src, instant]);

  useEffect(() => {
    return () => {
      if (wrapperRef.current) gsap.killTweensOf(wrapperRef.current);
    };
  }, []);

  return (
    <div className={`${styles.panel} ${className ?? ""}`}>
      <div ref={wrapperRef} className={styles.wrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} alt="" className={styles.image} aria-hidden="true" />
        <video
          ref={videoRef}
          className={styles.image}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

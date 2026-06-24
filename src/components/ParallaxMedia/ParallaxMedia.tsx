"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./ParallaxMedia.module.scss";

interface ParallaxMediaProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export default function ParallaxMedia({
  children,
  strength = 24,
  className,
}: ParallaxMediaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const ctx = gsap.context(() => {
      const quickX = gsap.quickTo(inner, "x", { duration: 0.5, ease: "power3.out" });
      const quickY = gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (e: MouseEvent) => {
        const rect = wrapper.getBoundingClientRect();
        // -1 à 1 relatif au centre du container
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        quickX(nx * strength);
        quickY(ny * strength);
      };

      const onLeave = () => {
        quickX(0);
        quickY(0);
      };

      wrapper.addEventListener("mousemove", onMove);
      wrapper.addEventListener("mouseleave", onLeave);

      return () => {
        wrapper.removeEventListener("mousemove", onMove);
        wrapper.removeEventListener("mouseleave", onLeave);
      };
    }, wrapper);

    return () => ctx.revert();
  }, [strength]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${className ?? ""}`}
      style={{ "--_p-buffer": `${strength}px` } as React.CSSProperties}
    >
      <div ref={innerRef} className={styles.inner}>
        {children}
      </div>
    </div>
  );
}

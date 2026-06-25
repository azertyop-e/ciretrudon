"use client";

import { createContext, useCallback, useContext, useRef } from "react";
import gsap from "gsap";
import styles from "./PageTransitionProvider.module.scss";

type TransitionContextType = {
  triggerExit: (navigate: () => void) => void;
  signalEnter: () => void;
};

const TransitionContext = createContext<TransitionContextType>({
  triggerExit: (fn) => fn(),
  signalEnter: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const triggerExit = useCallback((navigate: () => void) => {
    const el = overlayRef.current;
    if (!el) { navigate(); return; }

    el.style.pointerEvents = "all";
    gsap.killTweensOf(el);

    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.inOut" },
    ).call(navigate, undefined, "+=1.0");
  }, []);

  const signalEnter = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });
    el.style.pointerEvents = "all";

    gsap.to(el, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.6,
      delay: 0.15,
      ease: "power2.inOut",
      onComplete: () => {
        el.style.pointerEvents = "none";
        gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
      },
    });
  }, []);

  return (
    <TransitionContext.Provider value={{ triggerExit, signalEnter }}>
      {children}
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
        <div className={styles.logo}>
          <span className={styles.logoName}>Trvdon</span>
          <span className={styles.logoYear}>.1643.</span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

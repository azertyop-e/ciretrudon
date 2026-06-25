"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/PageTransition/PageTransitionProvider";
import styles from "./Hero.module.scss";

export default function Hero() {
  const router = useRouter();
  const { triggerExit } = usePageTransition();

  return (
    <section className={styles.hero} aria-label="Nuit Rouge">
      <Image
        src="/images/hero-nuit-rouge.jpg"
        alt="Collection Nuit Rouge flacons de parfum en verre rubis sur fond damassé"
        fill
        priority
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.gradientTop} aria-hidden="true" />
      <div className={styles.gradientBottom} aria-hidden="true" />

      <div className={styles.content}>
        <h1 className={styles.title}>Nuit Rouge</h1>
        <p className={styles.subtitle}>Une ode à l&apos;opulence.</p>
        <button
          type="button"
          className={styles.cta}
          onClick={() => triggerExit(() => void router.push("/questionnaire"))}
        >
          Questionnaire
        </button>
      </div>
    </section>
  );
}

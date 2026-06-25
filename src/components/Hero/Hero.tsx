"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePageTransition } from "@/components/PageTransition/PageTransitionProvider";
import styles from "./Hero.module.scss";

export default function Hero() {
  const router = useRouter();
  const { triggerExit } = usePageTransition();

  return (
    <section className={styles.hero} aria-label="Découvrez votre essence">
      <Image
        src="/images/hero.png"
        alt="Bougies Cire Trudon sur cheminée en marbre, miroir doré et orchidées"
        fill
        priority
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.gradientTop} aria-hidden="true" />
      <div className={styles.gradientBottom} aria-hidden="true" />

      <div className={styles.content}>
        <h1 className={styles.title}>Découvrez votre essence</h1>
        <p className={styles.subtitle}>Avec notre parcours de découverte</p>
        <button
          type="button"
          className={styles.cta}
          onClick={() => triggerExit(() => void router.push("/questionnaire"))}
        >
          Découvrir
        </button>
      </div>
    </section>
  );
}

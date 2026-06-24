"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./CategoriesCarousel.module.scss";

const CATEGORIES = [
  {
    title: "Les Bougies Parfumées",
    image: "/images/categories/bougies.jpg",
    alt: "Les bougies parfumées Trudon",
    href: "#",
  },
  {
    title: "Les Diffuseurs",
    image: "/images/categories/diffuseurs.jpg",
    alt: "Les diffuseurs Trudon",
    href: "#",
  },
  {
    title: "Les Eaux de Parfum",
    image: "/images/categories/parfums.jpg",
    alt: "Les eaux de parfum Trudon",
    href: "#",
  },
  {
    title: "Les Savons Parfumés",
    image: "/images/categories/savons.jpg",
    alt: "Les savons parfumés Trudon",
    href: "#",
  },
  {
    title: "Les Albâtres",
    image: "/images/categories/albatres.jpg",
    alt: "Les albâtres Trudon",
    href: "#",
  },
  {
    title: "La Promeneuse",
    image: "/images/categories/promeneuse.jpg",
    alt: "La Promeneuse Trudon",
    href: "#",
  },
  {
    title: "Les Accessoires",
    image: "/images/categories/accessoires.jpg",
    alt: "Les accessoires Trudon",
    href: "#",
  },
  {
    title: "Les Vaporisateurs",
    image: "/images/categories/vaporisateurs.jpg",
    alt: "Les vaporisateurs Trudon",
    href: "#",
  },
];

const SLIDE_GAP = 20;

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function CategoriesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(maxScroll > 4 && track.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateArrows();

    const resizeObserver = new ResizeObserver(() => updateArrows());
    resizeObserver.observe(track);

    window.addEventListener("resize", updateArrows);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scroll = (dir: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const slide = track.querySelector<HTMLElement>(`.${styles.slide}`);
    const amount = (slide?.offsetWidth ?? 342) + SLIDE_GAP;

    track.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className={styles.homeCarousel} aria-label="Catégories produits">
      <div className={styles.glideTrack} ref={trackRef} onScroll={updateArrows}>
        <ul className={styles.slides}>
          {CATEGORIES.map((cat) => (
            <li key={cat.title} className={styles.slide}>
              <a className={styles.imageLink} href={cat.href}>
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 991px) 50vw, (max-width: 1199px) 33vw, 342px"
                  className={styles.image}
                />
              </a>

              <div className={styles.content}>
                <h3 className={styles.name}>{cat.title}</h3>
                <a className={styles.action} href={cat.href}>
                  Découvrir
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.arrows}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={() => scroll("prev")}
          disabled={!canPrev}
          aria-label="Catégorie précédente"
        >
          <IconChevronLeft />
        </button>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={() => scroll("next")}
          disabled={!canNext}
          aria-label="Catégorie suivante"
        >
          <IconChevronRight />
        </button>
      </div>
    </section>
  );
}

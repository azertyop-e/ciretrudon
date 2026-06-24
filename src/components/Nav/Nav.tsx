"use client";

import { useState, useEffect } from "react";
import styles from "./Nav.module.scss";

const MENU_LINKS = [
  "Bougies & Maison",
  "Parfum & Corps",
  "Décoration",
  "Cadeaux",
  "L'Univers Trudon",
];

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <circle cx="11" cy="11" r="7.5" />
      <path d="M20 20l-4.2-4.2" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <circle cx="12" cy="8" r="3.75" />
      <path d="M5.5 20.5c.9-3.2 3.4-5 6.5-5s5.6 1.8 6.5 5" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M7 8V6.5A5 5 0 0 1 17 6.5V8" />
      <path d="M5 8h14l-1.2 12.5H6.2L5 8z" />
    </svg>
  );
}

function IconMenu({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </>
      ) : (
        <>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </>
      )}
    </svg>
  );
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`${styles.nav} ${menuOpen ? styles.navOpen : ""} ${scrolled ? styles.navScrolled : ""}`}
        aria-label="Navigation principale"
      >
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
          >
            <IconMenu open={menuOpen} />
            <span>Menu</span>
          </button>

          <a href="/" className={styles.logo} aria-label="Trudon — Accueil">
            <span className={styles.logoName}>Trvdon</span>
            <span className={styles.logoYear}>.1643.</span>
          </a>

          <div className={styles.actions}>
            <button type="button" className={styles.iconBtn} aria-label="Rechercher">
              <IconSearch />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Nos boutiques">
              <IconPin />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Mon compte">
              <IconUser />
            </button>
            <button type="button" className={`${styles.iconBtn} ${styles.cartBtn}`} aria-label="Panier">
              <IconBag />
              <span className={styles.cartCount}>0</span>
            </button>
            <span className={styles.locale}>FR | €</span>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Menu">
          <ul className={styles.overlayList}>
            {MENU_LINKS.map((label) => (
              <li key={label}>
                <a href="#" className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

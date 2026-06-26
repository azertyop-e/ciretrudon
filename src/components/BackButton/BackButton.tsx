"use client";

import styles from "./BackButton.module.scss";

interface Props {
  onClick: () => void;
  visible: boolean;
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export default function BackButton({ onClick, visible }: Props) {
  if (!visible) return null;

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label="Retour"
    >
      <IconChevronLeft />
      <span>Retour</span>
    </button>
  );
}

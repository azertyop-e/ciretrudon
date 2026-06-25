"use client";

import styles from "./BackButton.module.scss";

interface Props {
  onClick: () => void;
  visible: boolean;
}

export default function BackButton({ onClick, visible }: Props) {
  if (!visible) return null;

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label="Question précédente"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    </button>
  );
}

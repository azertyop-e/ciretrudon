"use client";

import { useState } from "react";
import styles from "./SoundButton.module.scss";

interface Props {
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
  visible: boolean;
}

export default function SoundButton({ isMuted, volume, onToggleMute, onVolumeChange, visible }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const displayVolume = isMuted ? 0 : volume;

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onVolumeChange(val);
  };

  if (!visible) return null;

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {isOpen && (
        <div className={styles.panel}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={displayVolume}
            onChange={handleRangeChange}
            className={styles.range}
            aria-label="Volume"
          />
        </div>
      )}
      <button
        type="button"
        className={styles.button}
        onClick={onToggleMute}
        aria-label={isMuted ? "Activer le son" : "Couper le son"}
      >
        <SpeakerIcon volume={displayVolume} />
      </button>
    </div>
  );
}

function SpeakerIcon({ volume }: { volume: number }) {
  if (volume === 0) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  if (volume < 0.5) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

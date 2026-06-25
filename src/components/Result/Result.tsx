"use client";

import styles from "./Result.module.scss";
import { ESSENCES, ESSENCE_PROFILES, DUO_PROFILES } from "@/lib/const";

type ResultFamily = { index: number; percentage: number };

type Props = {
  families: ResultFamily[];
  onRestart: () => void;
};

function FragranceList({
  profileIndex,
  align = "left",
}: {
  profileIndex: number;
  align?: "left" | "right";
}) {
  const profile = ESSENCE_PROFILES[profileIndex];
  const linkClass = `${styles.fragranceLink} ${align === "right" ? styles.fragranceLinkRight : ""}`;
  return (
    <ul className={styles.fragranceList}>
      {profile.fragrances.map((f, i) => (
        <li key={f.name} className={styles.fragranceItem}>
          <a href={f.url} className={linkClass}>
            <h3 className={styles.fragranceName}>{f.name}</h3>
            <p className={styles.fragranceNotes}>{f.notes}</p>
          </a>
          {i < profile.fragrances.length - 1 && <hr className={styles.divider} />}
        </li>
      ))}
    </ul>
  );
}

export default function Result({ families, onRestart }: Props) {
  const isSolo = families.length === 1;

  if (isSolo) {
    const { index } = families[0];
    const essence = ESSENCES[index];
    const profile = ESSENCE_PROFILES[index];

    return (
      <div
        className={styles.result}
        style={{ backgroundImage: `url(${profile.bgImage})` }}
      >
        <div className={styles.soloLayout}>
          <div className={styles.soloMain}>
            <div className={styles.soloLeft}>
              <h1 className={styles.soloTitle}>
                <em className={styles.soloEyebrow}>
                  Votre essence est <strong className={styles.soloEyebrowLabel}>{essence.label}</strong>
                </em>
              </h1>
              <p className={styles.description}>{profile.description}</p>
            </div>

            <div className={styles.soloRight}>
              <p className={styles.universeLabel}>Votre univers {essence.label} :</p>
              <FragranceList profileIndex={index} align="right" />
            </div>
          </div>

          <footer className={styles.soloFooter}>
            <button className={styles.restart} onClick={onRestart}>
              ↺ Recommencer l&apos;expérience
            </button>
          </footer>
        </div>
      </div>
    );
  }

  // ── Duo ───────────────────────────────────────────────────────────────────
  const [f1, f2] = families;
  const key = `${Math.min(f1.index, f2.index)}_${Math.max(f1.index, f2.index)}`;
  const duo = DUO_PROFILES[key] ?? {
    title: "Deux essences vous habitent",
    description: "",
  };
  const e1 = ESSENCES[f1.index];
  const e2 = ESSENCES[f2.index];

  return (
    <div
      className={styles.result}
      style={{ backgroundImage: "url(/images/bgDuo.png)" }}
    >
      <div className={styles.duoLayout}>
        <header className={styles.duoHeader}>
          <h1 className={styles.duoTitle}>{duo.title}</h1>
          <p className={styles.description}>{duo.description}</p>
        </header>

        <div className={styles.duoColumns}>
          <div className={styles.duoLeft}>
            <p className={styles.universeLabel}>Votre univers {e1.label}</p>
            <FragranceList profileIndex={f1.index} />
          </div>

          <div className={styles.duoSpacer} aria-hidden="true" />

          <div className={styles.duoRight}>
            <p className={styles.universeLabel}>Votre univers {e2.label} :</p>
            <FragranceList profileIndex={f2.index} align="right" />
          </div>
        </div>

        <footer className={styles.duoFooter}>
          <button className={styles.restart} onClick={onRestart}>
            ↺ Recommencer l&apos;expérience
          </button>
        </footer>
      </div>
    </div>
  );
}

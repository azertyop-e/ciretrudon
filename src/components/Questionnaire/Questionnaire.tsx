"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS, ESSENCES } from "@/lib/const";
import ImageStack, {
  type ImageStackHandle,
} from "@/components/ImageStack/ImageStack";
import styles from "./Questionnaire.module.scss";

export default function Questionnaire() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);
  const [winningFamily, setWinningFamily] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredAnswerIndex, setHoveredAnswerIndex] = useState<number | null>(null);
  const [persistentAdditions, setPersistentAdditions] = useState<Partial<Record<number, string>>>({});

  const contentRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<ImageStackHandle>(null);
  const answerButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const track = (e: MouseEvent) => { mousePositionRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", track);
    return () => window.removeEventListener("mousemove", track);
  }, []);

  const currentQuestion = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;

  const reEvaluateHover = () => {
    const { x, y } = mousePositionRef.current;
    const index = answerButtonsRef.current.findIndex((btn) => {
      if (!btn) return false;
      const r = btn.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });
    setHoveredAnswerIndex(index >= 0 ? index : null);
  };

  const handleAnswer = (optionIndex: number) => {
    if (isTransitioning) return;

    const answer = QUESTIONS[currentIndex].answers[optionIndex];
    const nextScores = scores.map((s, i) => i === answer.family ? s + 1 : s);

    setSelectedIndex(optionIndex);
    setIsTransitioning(true);

    window.setTimeout(() => {
      transitionRef.current?.run(
        () => {
          const additions = QUESTIONS[currentIndex]?.answers[optionIndex]?.additions;
          if (additions) {
            setPersistentAdditions((prev) => ({ ...prev, ...additions }));
          }
          setScores(nextScores);
          const leading = nextScores.indexOf(Math.max(...nextScores));
          console.log(
            "Scores :",
            Object.fromEntries(ESSENCES.map((e, i) => [e.label, nextScores[i]])),
            "→",
            ESSENCES[leading].label,
            ESSENCES[leading].color,
          );
          setHoveredAnswerIndex(null);
          if (currentIndex < total - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedIndex(null);
          } else {
            const winner = nextScores.indexOf(Math.max(...nextScores));
            setWinningFamily(winner);
            setIsComplete(true);
            setSelectedIndex(null);
          }
        },
        () => {
          setIsTransitioning(false);
          reEvaluateHover();
        },
      );
    }, 250);
  };

  const leadingFamily = scores.every((s) => s === 0)
    ? null
    : scores.indexOf(Math.max(...scores));
  const resultLabel = winningFamily !== null ? ESSENCES[winningFamily].label : "";

  const toRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <section
      className={`${styles.questionnaire} ${isTransitioning ? styles.transitioning : ""}`}
      aria-label="Questionnaire olfactif"
    >
      {leadingFamily !== null && (
        <div
          className={styles.colorOverlay}
          style={{
            backgroundColor: toRgba(ESSENCES[leadingFamily].color, ESSENCES[leadingFamily].opacity),
          }}
          aria-hidden="true"
        />
      )}

      <ImageStack
        ref={transitionRef}
        isTransitioning={isTransitioning}
        contentRef={contentRef}
        questionIndex={currentIndex}
        hoveredAnswerIndex={hoveredAnswerIndex}
        persistentAdditions={persistentAdditions}
      />

      <div className={styles.content} ref={contentRef}>
        {isComplete ? (
          <div className={styles.complete}>
            <p className={styles.completeEyebrow}>Votre essence est</p>
            <h2 className={styles.completeTitle}>{resultLabel}</h2>
            <p className={styles.completeBody}>Votre senteur se révèle… laissez-vous envelopper.</p>
          </div>
        ) : (
          <>
            <h1 className={styles.question} key={currentIndex}>
              {currentQuestion.sentence}
            </h1>

            <div className={styles.answers} role="group" aria-label="Réponses possibles">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={answer.label}
                  ref={(node) => { answerButtonsRef.current[index] = node; }}
                  type="button"
                  className={`${styles.answer} ${selectedIndex === index ? styles.selected : ""}`}
                  onClick={() => handleAnswer(index)}
                  onMouseEnter={() => setHoveredAnswerIndex(index)}
                  onMouseLeave={() => setHoveredAnswerIndex(null)}
                  disabled={isTransitioning}
                >
                  {answer.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

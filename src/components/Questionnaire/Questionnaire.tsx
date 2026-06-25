"use client";

import { useEffect, useRef, useState } from "react";
import { QUIZ } from "@/lib/const";
import ImageStack, {
  type ImageStackHandle,
} from "@/components/ImageStack/ImageStack";
import styles from "./Questionnaire.module.scss";

export default function Questionnaire() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredAnswerIndex, setHoveredAnswerIndex] = useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<ImageStackHandle>(null);
  const answerButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const track = (e: MouseEvent) => { mousePositionRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", track);
    return () => window.removeEventListener("mousemove", track);
  }, []);

  const currentQuestion = QUIZ[currentIndex];
  const total = QUIZ.length;

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

    setHoveredAnswerIndex(null);
    setSelectedIndex(optionIndex);
    setIsTransitioning(true);

    window.setTimeout(() => {
      transitionRef.current?.run(
        () => {
          if (currentIndex < total - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedIndex(null);
          } else {
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

  return (
    <section
      className={`${styles.questionnaire} ${isTransitioning ? styles.transitioning : ""}`}
      aria-label="Questionnaire olfactif"
    >
      <ImageStack
        ref={transitionRef}
        isTransitioning={isTransitioning}
        contentRef={contentRef}
        questionIndex={currentIndex}
        hoveredAnswerIndex={hoveredAnswerIndex}
      />

      <div className={styles.content} ref={contentRef}>
        {isComplete ? (
          <div className={styles.complete}>
            <h2>Votre senteur se révèle…</h2>
            <p>Merci d&apos;avoir partagé vos impressions. Votre essence vous attend.</p>
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

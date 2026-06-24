"use client";

import { useRef, useState } from "react";
import { QUESTIONS } from "@/lib/const";
import QuestionnaireTransition, {
  type QuestionnaireTransitionHandle,
} from "@/components/QuestionnaireTransition/QuestionnaireTransition";
import styles from "./Questionnaire.module.scss";

export default function Questionnaire() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<QuestionnaireTransitionHandle>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;

  const handleAnswer = (optionIndex: number) => {
    if (isTransitioning) return;

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
        () => setIsTransitioning(false),
      );
    }, 250);
  };

  return (
    <section
      className={`${styles.questionnaire} ${isTransitioning ? styles.transitioning : ""}`}
      aria-label="Questionnaire olfactif"
    >
      <QuestionnaireTransition
        ref={transitionRef}
        isTransitioning={isTransitioning}
        contentRef={contentRef}
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
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option.label}
                  type="button"
                  className={`${styles.answer} ${selectedIndex === index ? styles.selected : ""}`}
                  onClick={() => handleAnswer(index)}
                  disabled={isTransitioning}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

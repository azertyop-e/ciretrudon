"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, ESSENCES, AUDIO_TRACKS, type AudioScene } from "@/lib/const";
import ImageStack, {
  type ImageStackHandle,
} from "@/components/ImageStack/ImageStack";
import SoundButton from "@/components/SoundButton/SoundButton";
import styles from "./Questionnaire.module.scss";

function computeFamilies(scores: number[]): number[] {
  const total = QUESTIONS.length;
  const ranked = scores
    .map((s, i) => ({ index: i, percentage: Math.round((s / total) * 100) }))
    .sort((a, b) => b.percentage - a.percentage);

  const gap = ranked[0].percentage - ranked[1].percentage;
  return gap <= 10 ? [ranked[0].index, ranked[1].index] : [ranked[0].index];
}

export default function Questionnaire() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredAnswerIndex, setHoveredAnswerIndex] = useState<number | null>(null);
  const [persistentAdditions, setPersistentAdditions] = useState<Partial<Record<number, string>>>({});

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState<number>(1);
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const volumeRef = useRef<number>(1);
  const isMutedRef = useRef(false);
  const currentSceneRef = useRef<AudioScene | null>(null);
  const lastSceneRef = useRef<Partial<Record<number, string>>>({});

  const contentRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<ImageStackHandle>(null);
  const answerButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const leadingFamily = scores.every((s) => s === 0)
    ? null
    : scores.indexOf(Math.max(...scores));

  useEffect(() => {
    const track = (e: MouseEvent) => { mousePositionRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", track);
    return () => window.removeEventListener("mousemove", track);
  }, []);

  const pickScene = (family: number): AudioScene | null => {
    const scenes = AUDIO_TRACKS[family];
    if (!scenes || scenes.length === 0) return null;
    if (scenes.length === 1) return scenes[0];
    const lastKey = lastSceneRef.current[family];
    const pool = scenes.filter((s) => s[0]?.src !== lastKey);
    const picked = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : scenes[Math.floor(Math.random() * scenes.length)];
    lastSceneRef.current[family] = picked[0]?.src ?? "";
    return picked;
  };

  // Start / switch audio scene when the leading family changes
  useEffect(() => {
    if (leadingFamily === null) return;

    const scene = pickScene(leadingFamily);

    // Stop all currently playing tracks
    audioPoolRef.current.forEach((a) => a.pause());
    audioPoolRef.current = [];
    currentSceneRef.current = null;

    if (!scene || scene.length === 0) return;

    currentSceneRef.current = scene;
    const label = ESSENCES[leadingFamily].label;

    scene.forEach((track) => {
      const effectiveVolume = isMutedRef.current ? 0 : track.volume * volumeRef.current;
      const audio = new Audio(track.src);
      const loopMode = track.loop ?? true;
      audio.volume = effectiveVolume;

      if (loopMode === true) {
        audio.loop = true;
      } else {
        let remaining = loopMode - 1;
        audio.addEventListener("ended", function onEnded() {
          if (remaining > 0) {
            remaining--;
            audio.currentTime = 0;
            audio.play().catch(() => {});
          } else {
            audio.removeEventListener("ended", onEnded);
          }
        });
      }

      audio.play().catch(() => {});
      audioPoolRef.current.push(audio);
      const loopLabel = loopMode === true ? "∞" : `×${loopMode}`;
      console.log(`[Audio] ▶ famille "${label}" | piste: ${track.src} | gain: ${track.volume} | loop: ${loopLabel} | slider: ${volumeRef.current} | effectif: ${effectiveVolume}`);
    });
  }, [leadingFamily]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { audioPoolRef.current.forEach((a) => a.pause()); };
  }, []);

  const handleToggleMute = () => {
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    const scene = currentSceneRef.current ?? [];
    audioPoolRef.current.forEach((audio, i) => {
      const gain = scene[i]?.volume ?? 1;
      audio.volume = next ? 0 : gain * volumeRef.current;
    });
  };

  const handleVolumeChange = (val: number) => {
    volumeRef.current = val;
    setVolume(val);
    const scene = currentSceneRef.current ?? [];
    audioPoolRef.current.forEach((audio, i) => {
      const gain = scene[i]?.volume ?? 1;
      if (!isMutedRef.current) audio.volume = gain * val;
    });
    if (val === 0 && !isMutedRef.current) { isMutedRef.current = true; setIsMuted(true); }
    if (val > 0 && isMutedRef.current) { isMutedRef.current = false; setIsMuted(false); }
  };

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
          );
          setHoveredAnswerIndex(null);
          if (currentIndex < total - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedIndex(null);
          } else {
            const families = computeFamilies(nextScores);
            void router.push(`/resultat?families=${families.join(",")}`);
          }
        },
        () => {
          setIsTransitioning(false);
          reEvaluateHover();
        },
      );
    }, 250);
  };

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
      <SoundButton
        isMuted={isMuted}
        volume={volume}
        onToggleMute={handleToggleMute}
        onVolumeChange={handleVolumeChange}
        visible={leadingFamily !== null}
      />
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
      </div>
    </section>
  );
}

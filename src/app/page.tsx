"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ─── TYPES ─────────────────────────────────────────────────────────────────

type FragranceId =
  | "ernesto"
  | "abd-el-kader"
  | "spiritus-sancti"
  | "josephine"
  | "solis-rex"
  | "odeur-de-lune";

type Phase = "intro" | "q1" | "q2" | "q3" | "result";

// ─── DATA ──────────────────────────────────────────────────────────────────

const SCORES: Record<string, Partial<Record<FragranceId, number>>> = {
  // Q1 — heure
  dawn:  { "abd-el-kader": 3, josephine: 2, "solis-rex": 1 },
  noon:  { "solis-rex": 3, "abd-el-kader": 1 },
  dusk:  { ernesto: 2, "spiritus-sancti": 2, "odeur-de-lune": 1 },
  night: { ernesto: 3, "odeur-de-lune": 3, "spiritus-sancti": 1 },
  // Q2 — espace
  library: { ernesto: 3, "spiritus-sancti": 1 },
  garden:  { josephine: 3, "abd-el-kader": 2, "solis-rex": 1 },
  chapel:  { "spiritus-sancti": 3, "odeur-de-lune": 2 },
  sea:     { "abd-el-kader": 2, "odeur-de-lune": 2, "solis-rex": 1 },
  // Q3 — sensation
  intensity: { ernesto: 3, "solis-rex": 2, "spiritus-sancti": 1 },
  delicacy:  { josephine: 3, "abd-el-kader": 2 },
  mystery:   { "spiritus-sancti": 3, "odeur-de-lune": 3 },
  warmth:    { josephine: 2, ernesto: 2, "solis-rex": 2 },
};

const QUESTIONS = [
  {
    id: "q1",
    prompt: "Quelle heure vous appartient ?",
    options: [
      { value: "dawn",  label: "L'aube",        sub: "Quand le monde dort encore" },
      { value: "noon",  label: "Le midi",        sub: "La lumière la plus crue" },
      { value: "dusk",  label: "Le crépuscule",  sub: "Quand le ciel brûle" },
      { value: "night", label: "La nuit",        sub: "Après que tout s'éteint" },
    ],
  },
  {
    id: "q2",
    prompt: "Quel espace vous ressemble ?",
    options: [
      { value: "library", label: "La bibliothèque", sub: "Cuir et papier ancien" },
      { value: "garden",  label: "Le jardin",        sub: "La rosée du matin" },
      { value: "chapel",  label: "La chapelle",      sub: "Encens et silence" },
      { value: "sea",     label: "La mer",           sub: "Sel et horizon infini" },
    ],
  },
  {
    id: "q3",
    prompt: "Ce qui vous attire…",
    options: [
      { value: "intensity", label: "L'intensité",    sub: "Les contrastes forts" },
      { value: "delicacy",  label: "La délicatesse",  sub: "Les nuances subtiles" },
      { value: "mystery",   label: "Le mystère",      sub: "Ce qui se dérobe" },
      { value: "warmth",    label: "La chaleur",      sub: "Les matières nobles" },
    ],
  },
];

interface Fragrance {
  name: string;
  subtitle: string;
  notes: string[];
  description: string;
  accent: string;
}

const FRAGRANCES: Record<FragranceId, Fragrance> = {
  ernesto: {
    name: "Ernesto",
    subtitle: "Havane · La Nuit des Tropiques",
    notes: ["Tabac Virginia", "Cuir", "Bois de Cèdre"],
    description:
      "Le souvenir d'une nuit cubaine. L'odeur du cigare suspendue dans l'air chaud, le cuir d'une vieille Buick, la mélancolie douce d'un monde disparu.",
    accent: "#7a2000",
  },
  "abd-el-kader": {
    name: "Abd El Kader",
    subtitle: "Maroc · L'Aube du Marché",
    notes: ["Menthe Fraîche", "Thé Vert", "Bergamote"],
    description:
      "Un marché au lever du jour. La menthe froissée entre les doigts, le thé qui infuse lentement, la fraîcheur précieuse avant que la chaleur n'arrive.",
    accent: "#0f4a2e",
  },
  "spiritus-sancti": {
    name: "Spiritus Sancti",
    subtitle: "Rome · L'Éternité Murmurée",
    notes: ["Encens", "Myrrhe", "Rose Ancienne"],
    description:
      "L'air d'une basilique déserte. La fumée d'encens qui monte en spirales, les pierres froides sous les pieds, quelque chose de sacré que l'on ne peut nommer.",
    accent: "#3d0f5c",
  },
  josephine: {
    name: "Joséphine",
    subtitle: "Malmaison · Le Printemps Impérial",
    notes: ["Rose de Mai", "Violette", "Musc Blanc"],
    description:
      "Le jardin de Malmaison au printemps. Les roses de l'Impératrice en pleine floraison, la douceur d'un empire au sommet de sa grâce.",
    accent: "#6b1a3a",
  },
  "solis-rex": {
    name: "Solis Rex",
    subtitle: "Versailles · L'Apogée du Soleil",
    notes: ["Orange Amère", "Herbes Aromatiques", "Pierre Chaude"],
    description:
      "Les jardins de Versailles en plein été. La chaleur des allées de gravier, l'orange amère, la magnificence d'un monde ordonné par la lumière.",
    accent: "#7a5400",
  },
  "odeur-de-lune": {
    name: "Odeur de Lune",
    subtitle: "Nuit · Ce que Sent l'Obscurité",
    notes: ["Fleur de Lune", "Iris Poudré", "Ambre Gris"],
    description:
      "Ce que sent la nuit quand tout le monde dort. La fleur qui n'éclot que dans l'obscurité, l'iris poudré, l'ambre qui couve sous la cendre.",
    accent: "#0f1a4a",
  },
};

function getRecommendation(answers: Record<string, string>): Fragrance {
  const totals: Partial<Record<FragranceId, number>> = {};
  for (const ans of Object.values(answers)) {
    for (const [id, score] of Object.entries(SCORES[ans] ?? {})) {
      const fid = id as FragranceId;
      totals[fid] = (totals[fid] ?? 0) + (score ?? 0);
    }
  }
  const best = (Object.entries(totals) as [FragranceId, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0];
  return FRAGRANCES[best?.[0]] ?? FRAGRANCES.ernesto;
}

// ─── CANDLE ────────────────────────────────────────────────────────────────

function Candle({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`candle candle--${size}`}>
      <div className="candle__flame-wrap">
        <div className="candle__flame" />
      </div>
      <div className="candle__wick" />
      <div className="candle__body" />
    </div>
  );
}

// ─── SCREENS ───────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen screen--intro">
      <div className="intro__candle">
        <Candle size="lg" />
      </div>
      <div className="intro__text">
        <p className="intro__eyebrow">Depuis 1643</p>
        <h1 className="intro__title">CIRE TRUDON</h1>
        <div className="intro__divider" />
        <p className="intro__subtitle">Votre senteur vous attend</p>
      </div>
      <button className="cta" onClick={onStart}>
        Commencer l'expérience
      </button>
    </div>
  );
}

function QuestionScreen({
  question,
  questionIndex,
  onAnswer,
}: {
  question: (typeof QUESTIONS)[0];
  questionIndex: number;
  onAnswer: (value: string) => void;
}) {
  return (
    <div className="screen screen--question">
      <div className="question__progress">
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={`progress-dot${
              i === questionIndex
                ? " progress-dot--active"
                : i < questionIndex
                ? " progress-dot--done"
                : ""
            }`}
          />
        ))}
      </div>
      <h2 className="question__prompt">{question.prompt}</h2>
      <div className="question__options">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            className="option"
            onClick={() => onAnswer(opt.value)}
          >
            <span className="option__label">{opt.label}</span>
            <span className="option__sub">{opt.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultScreen({
  fragrance,
  onRestart,
}: {
  fragrance: Fragrance;
  onRestart: () => void;
}) {
  return (
    <div className="screen screen--result">
      <p className="result__eyebrow">Votre senteur</p>
      <h2 className="result__name">{fragrance.name}</h2>
      <p className="result__subtitle">{fragrance.subtitle}</p>
      <p className="result__notes">
        {fragrance.notes.map((note, i) => (
          <span key={note}>
            {note}
            {i < fragrance.notes.length - 1 && (
              <span className="note-sep"> · </span>
            )}
          </span>
        ))}
      </p>
      <p className="result__description">{fragrance.description}</p>
      <div className="result__actions">
        <button className="cta cta--ghost" onClick={onRestart}>
          Recommencer
        </button>
        <a
          href="https://www.ciretrudon.com"
          target="_blank"
          rel="noopener noreferrer"
          className="cta"
        >
          Découvrir →
        </a>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Fragrance | null>(null);
  const phaseRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const transitionTo = useCallback(
    (next: Phase, newAnswers?: Record<string, string>) => {
      if (isAnimating.current || !phaseRef.current) return;
      isAnimating.current = true;

      gsap.to(phaseRef.current, {
        opacity: 0,
        y: -22,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          const finalAnswers = newAnswers ?? answers;
          if (next === "result") {
            setResult(getRecommendation(finalAnswers));
          }
          setAnswers(finalAnswers);
          setPhase(next);
          isAnimating.current = false;
        },
      });
    },
    [answers]
  );

  useEffect(() => {
    if (!phaseRef.current) return;
    gsap.fromTo(
      phaseRef.current,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [phase]);

  const handleAnswer = useCallback(
    (questionId: string, value: string) => {
      const newAnswers = { ...answers, [questionId]: value };
      const next: Record<string, Phase> = { q1: "q2", q2: "q3", q3: "result" };
      transitionTo(next[questionId] as Phase, newAnswers);
    },
    [answers, transitionTo]
  );

  const handleRestart = useCallback(() => {
    setAnswers({});
    setResult(null);
    transitionTo("intro", {});
  }, [transitionTo]);

  const questionIndex =
    phase === "q1" ? 0 : phase === "q2" ? 1 : phase === "q3" ? 2 : -1;

  return (
    <main className="experience">
      {result && phase === "result" && (
        <div
          className="ambient-glow"
          style={{
            background: `radial-gradient(ellipse at center, ${result.accent}55 0%, transparent 68%)`,
          }}
        />
      )}

      <div ref={phaseRef} className="phase-container">
        {phase === "intro" && (
          <IntroScreen onStart={() => transitionTo("q1")} />
        )}

        {questionIndex >= 0 && (
          <QuestionScreen
            question={QUESTIONS[questionIndex]}
            questionIndex={questionIndex}
            onAnswer={(value) => handleAnswer(phase, value)}
          />
        )}

        {phase === "result" && result && (
          <ResultScreen fragrance={result} onRestart={handleRestart} />
        )}
      </div>
    </main>
  );
}

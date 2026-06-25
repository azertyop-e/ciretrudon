import type { CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Slot = {
    zIndex: number;
    parallaxStrength: number;
    reveal: boolean;
    ambient: { style: CSSProperties; rotation: number };
    cover: { xPct: number; yPct: number; widthPct: number; rotation: number };
};

export type Answer = {
    label: string;
    pourcentage: number;
    replacements?: Partial<Record<number, string>>;
    additions?: Partial<Record<number, string>>;
};

export type Question = {
    sentence: string;
    ambientSlots: Partial<Record<number, string>>;
    answers: Answer[];
};

// ─── Essences ─────────────────────────────────────────────────────────────────

export const ESSENCES = [
    { label: "Ardente" },
    { label: "Méridienne" },
    { label: "Floraison" },
    { label: "Carnation" },
] as const;

// ─── Slots visuels (8 emplacements) ──────────────────────────────────────────
export const SLOTS: Slot[] = [
    // ── Arrière-plan ──────────────────────────────────────────────────────────
    {
        zIndex: 1, parallaxStrength: 12, reveal: false,
        ambient: {
            style: { top: "5%", left: "3%", width: "clamp(5rem, 7vw, 7rem)", height: "clamp(7rem, 9vw, 9rem)" },
            rotation: -18,
        },
        cover: { xPct: 0.26, yPct: 0.50, widthPct: 0.54, rotation: -3 },
    },
    {
        zIndex: 2, parallaxStrength: 16, reveal: false,
        ambient: {
            style: { top: "3%", right: "8%", width: "clamp(6rem, 8vw, 8rem)", height: "clamp(8rem, 10vw, 10rem)" },
            rotation: 19,
        },
        cover: { xPct: 0.74, yPct: 0.50, widthPct: 0.54, rotation: 3 },
    },
    // ── Plans intermédiaires ──────────────────────────────────────────────────
    {
        zIndex: 3, parallaxStrength: 22, reveal: false,
        ambient: {
            style: { top: "48%", left: "2%", width: "clamp(7rem, 10vw, 10rem)", height: "clamp(9rem, 12vw, 12rem)" },
            rotation: -22,
        },
        cover: { xPct: 0.47, yPct: 0.78, widthPct: 0.35, rotation: 5 },
    },
    {
        zIndex: 4, parallaxStrength: 28, reveal: true,
        ambient: {
            style: { top: "20%", left: "16%", width: "clamp(8rem, 11vw, 11rem)", height: "clamp(10rem, 14vw, 14rem)" },
            rotation: 14,
        },
        cover: { xPct: 0.50, yPct: 0.22, widthPct: 0.37, rotation: -6 },
    },
    {
        zIndex: 5, parallaxStrength: 36, reveal: true,
        ambient: {
            style: { bottom: "10%", left: "10%", width: "clamp(9rem, 13vw, 13rem)", height: "clamp(11rem, 16vw, 16rem)" },
            rotation: -12,
        },
        cover: { xPct: 0.53, yPct: 0.52, widthPct: 0.34, rotation: -2 },
    },
    // ── Premier plan ──────────────────────────────────────────────────────────
    {
        zIndex: 6, parallaxStrength: 44, reveal: true,
        ambient: {
            style: { top: "38%", right: "3%", width: "clamp(10rem, 14vw, 14rem)", height: "clamp(12rem, 18vw, 18rem)" },
            rotation: -8,
        },
        cover: { xPct: 0.11, yPct: 0.19, widthPct: 0.24, rotation: 10 },
    },
    {
        zIndex: 7, parallaxStrength: 54, reveal: true,
        ambient: {
            style: { bottom: "5%", right: "5%", width: "clamp(11rem, 16vw, 16rem)", height: "clamp(13rem, 20vw, 20rem)" },
            rotation: 16,
        },
        cover: { xPct: 0.83, yPct: 0.17, widthPct: 0.26, rotation: 9 },
    },
    {
        zIndex: 8, parallaxStrength: 64, reveal: true,
        ambient: {
            style: { bottom: "25%", right: "16%", width: "clamp(12rem, 17vw, 17rem)", height: "clamp(14rem, 22vw, 22rem)" },
            rotation: 11,
        },
        cover: { xPct: 0.87, yPct: 0.82, widthPct: 0.23, rotation: -7 },
    },
];

// ─── Questions + gestion des médias ──────────────────────────────────────────
// ambientSlots  : médias de repos affichés par slot entre les réponses
// replacements  : médias qui remplacent l'ambient au hover (slot affiche uniquement le replacement)
// additions     : médias affichés par-dessus l'ambient au hover (les deux coexistent)
export const QUESTIONS: Question[] = [
    {
        sentence: "Quel lieu vous appelle ?",
        ambientSlots: {},
        answers: [
            {
                label: "Un chalet",
                pourcentage: 30,
                replacements: {},
                additions: {
                    3: "/images/floraison/halo.jpeg",
                    4: "/images/floraison/halo.jpeg",
                    5: "/images/floraison/halo.jpeg",
                    6: "/images/floraison/halo.jpeg",
                    7: "/images/floraison/halo.jpeg",
                },
            },
            {
                label: "Une bibliothèque",
                pourcentage: 20,
                replacements: {
                    3: "/images/floraison/halo.jpeg",
                    4: "/images/floraison/halo.jpeg",
                    5: "/images/floraison/halo.jpeg",
                    6: "/images/floraison/halo.jpeg",
                    7: "/images/floraison/halo.jpeg",
                },
            },
            {
                label: "Un jardin",
                pourcentage: 10,
                replacements: {
                    3: "/images/floraison/Herbe.mp4",
                    4: "/images/floraison/Herbe.mp4",
                    5: "/images/floraison/Herbe.mp4",
                    6: "/images/floraison/Herbe.mp4",
                    7: "/images/floraison/Herbe.mp4",
                },
            },
            {
                label: "Le bord de mer",
                pourcentage: 0,
                replacements: {
                    3: "/images/méridienne/Coast.mp4",
                    4: "/images/méridienne/Coast.mp4",
                    5: "/images/méridienne/Coast.mp4",
                    6: "/images/méridienne/Coast.mp4",
                    7: "/images/méridienne/Coast.mp4",
                },
            },
        ],
    },
    {
        sentence: "Quel son fait écho en vous ?",
        ambientSlots: {
            0: "/images/categories/bougies.jpg",
            1: "/images/categories/savons.jpg",
            2: "/images/categories/diffuseurs.jpg",
            3: "/images/categories/parfums.jpg",
            5: "/images/categories/accessoires.jpg",
            6: "/images/categories/promeneuse.jpg",
            7: "/images/categories/vaporisateurs.jpg",
        },
        answers: [
            {
                label: "Le crépitement du feu",
                pourcentage: 30,
                replacements: {
                    3: "/images/categories/bougies.jpg",
                    5: "/images/categories/bougies.jpg",
                    6: "/images/categories/bougies.jpg",
                    7: "/images/categories/bougies.jpg",
                },
                additions: {
                    4: "/images/floraison/violette.jpeg",
                },
            },
            {
                label: "Les pages d'un livre",
                pourcentage: 20,
                replacements: {
                    3: "/images/floraison/violette.jpeg",
                    5: "/images/floraison/violette.jpeg",
                    6: "/images/floraison/violette.jpeg",
                    7: "/images/floraison/violette.jpeg",
                },
            },
            {
                label: "Le chant de la nature",
                pourcentage: 10,
                replacements: {
                    3: "/images/floraison/Feuillage.mp4",
                    5: "/images/floraison/Feuillage.mp4",
                    6: "/images/floraison/Feuillage.mp4",
                    7: "/images/floraison/Feuillage.mp4",
                },
            },
            {
                label: "Des vagues",
                pourcentage: 10,
                replacements: {
                    3: "/images/méridienne/Mer-1.mp4",
                    5: "/images/méridienne/Mer-1.mp4",
                    6: "/images/méridienne/Mer-1.mp4",
                    7: "/images/méridienne/Mer-1.mp4",
                },
            },
        ],
    },
    {
        sentence: "Quelle texture reste ancrée en vous ?",
        ambientSlots: {
            0: "/images/categories/bougies.jpg",
            1: "/images/categories/savons.jpg",
            2: "/images/categories/diffuseurs.jpg",
            3: "/images/categories/parfums.jpg",
            4: "/images/categories/albatres.jpg",
            5: "/images/categories/accessoires.jpg",
            6: "/images/categories/promeneuse.jpg",
            7: "/images/categories/vaporisateurs.jpg",
        },
        answers: [
            {
                label: "De la cire tiède",
                pourcentage: 30,
                replacements: {
                    3: "/images/floraison/halo.jpeg",
                    4: "/images/floraison/halo.jpeg",
                    5: "/images/floraison/halo.jpeg",
                    6: "/images/floraison/halo.jpeg",
                    7: "/images/floraison/halo.jpeg",
                },
            },
            {
                label: "Du cuir patiné",
                pourcentage: 20,
                replacements: {
                    3: "/images/méridienne/Ceramique.jpg",
                    4: "/images/méridienne/Ceramique.jpg",
                    5: "/images/méridienne/Ceramique.jpg",
                    6: "/images/méridienne/Ceramique.jpg",
                    7: "/images/méridienne/Ceramique.jpg",
                },
            },
            {
                label: "Un pétale",
                pourcentage: 10,
                replacements: {
                    3: "/images/floraison/Rose.mp4",
                    4: "/images/floraison/Rose.mp4",
                    5: "/images/floraison/Rose.mp4",
                    6: "/images/floraison/Rose.mp4",
                    7: "/images/floraison/Rose.mp4",
                },
            },
            {
                label: "Du sable fin",
                pourcentage: 40,
                replacements: {
                    3: "/images/méridienne/Mer-2.mp4",
                    4: "/images/méridienne/Mer-2.mp4",
                    5: "/images/méridienne/Mer-2.mp4",
                    6: "/images/méridienne/Mer-2.mp4",
                    7: "/images/méridienne/Mer-2.mp4",
                },
            },
        ],
    },
    {
        sentence: "Quelle couleur dort en vous ?",
        ambientSlots: {
            0: "/images/categories/bougies.jpg",
            1: "/images/categories/savons.jpg",
            2: "/images/categories/diffuseurs.jpg",
            3: "/images/categories/parfums.jpg",
            4: "/images/categories/albatres.jpg",
            5: "/images/categories/accessoires.jpg",
            6: "/images/categories/promeneuse.jpg",
            7: "/images/categories/vaporisateurs.jpg",
        },
        answers: [
            {
                label: "Azur",
                pourcentage: 30,
                replacements: {
                    3: "/images/méridienne/Mer-2.mp4",
                    4: "/images/méridienne/Mer-2.mp4",
                    5: "/images/méridienne/Mer-2.mp4",
                    6: "/images/méridienne/Mer-2.mp4",
                    7: "/images/méridienne/Mer-2.mp4",
                },
            },
            {
                label: "Émeraude",
                pourcentage: 20,
                replacements: {
                    3: "/images/floraison/lumiere.mp4",
                    4: "/images/floraison/lumiere.mp4",
                    5: "/images/floraison/lumiere.mp4",
                    6: "/images/floraison/lumiere.mp4",
                    7: "/images/floraison/lumiere.mp4",
                },
            },
            {
                label: "Noir profond",
                pourcentage: 10,
                replacements: {
                    3: "/images/hero-nuit-rouge.jpg",
                    4: "/images/hero-nuit-rouge.jpg",
                    5: "/images/hero-nuit-rouge.jpg",
                    6: "/images/hero-nuit-rouge.jpg",
                    7: "/images/hero-nuit-rouge.jpg",
                },
            },
            {
                label: "Brun/ambré",
                pourcentage: 40,
                replacements: {
                    3: "/images/méridienne/Figue.mp4",
                    4: "/images/méridienne/Figue.mp4",
                    5: "/images/méridienne/Figue.mp4",
                    6: "/images/méridienne/Figue.mp4",
                    7: "/images/méridienne/Figue.mp4",
                },
            },
        ],
    },
];

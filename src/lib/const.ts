import type { CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Fragrance = {
    name: string;
    notes: string;
    image: string;
    url: string;
};

export type EssenceProfile = {
    bgImage: string;
    description: string;
    fragrances: Fragrance[];
};

export type DuoProfile = {
    title: string;
    description: string;
};

export type Slot = {
    zIndex: number;
    parallaxStrength: number;
    reveal: boolean;
    ambient: { style: CSSProperties; rotation: number };
    cover: { xPct: number; yPct: number; widthPct: number; rotation: number };
};

export type Answer = {
    label: string;
    family: number; // index into ESSENCES (0=Ardente, 1=Méridienne, 2=Floraison, 3=Carnation)
    pourcentage: number;
    replacements?: Partial<Record<number, string>>;
    additions?: Partial<Record<number, string>>;
};

export type Question = {
    sentence: string;
    ambientSlots: Partial<Record<number, string>>;
    answers: Answer[];
};

// ─── Configuration audio ──────────────────────────────────────────────────────

export type AudioTrack = {
    src: string;
    volume: number;
    loop?: true | number; // true (défaut) = infini | number = N répétitions puis silence
};

export type AudioScene = AudioTrack[];

export const AUDIO_TRACKS: [AudioScene[], AudioScene[], AudioScene[], AudioScene[]] = [
    [],
    [
        [
            { 
                src: "/audio/meridienne/Sea Waves - Sound Effect.mp3",
                volume: 0.4,
                loop: true,
            },
            { 
                src: "/audio/meridienne/Jus.mp3",
                volume: 0.3,
                loop: 1,
            },
            { 
                src: "/audio/meridienne/Bruit café.mp3",
                volume: 0.1,
                loop: 1,
            },
        ],
        [
            { 
                src: "/audio/meridienne/Cigale.mp3",
                volume: 0.1,
                loop: true,
            },
            { 
                src: "/audio/meridienne/Mer.mp3",
                volume: 0.6,
                loop: true,
            }
        ],
    ],
    [
        [
            { 
                src: "/audio/floraison/Sweet Bird Sound - Morning Sound Effect  Garden Bird.mp3", 
                volume: 0.4, 
                loop: true 
            },
            { 
                src: "/audio/floraison/Wind blowing tree leaves, SOUND 4k uhd.mp3",             
                volume: 0.6,
                loop: true 
            },
            { 
                src: "/audio/floraison/river sound effect.mp3",                                 
                volume: 0.1,
                loop: true 
            },
        ],
    ],
    [],
];

// ─── Essences ─────────────────────────────────────────────────────────────────

export const ESSENCES = [
    { label: "Ardente",    color: "#1f0a0a", opacity: 0.25 },
    { label: "Méridienne", color: "#C38954", opacity: 0.25 },
    { label: "Floraison",  color: "#92A87C", opacity: 0.25 },
    { label: "Carnation",  color: "#1f0d16", opacity: 0.25 },
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

// ─── Profils enrichis par essence ────────────────────────────────────────────

export const ESSENCE_PROFILES: EssenceProfile[] = [
    // 0 Ardente
    {
        bgImage: "/images/bgSigle.png",
        description: "Votre présence est une flamme qui attire sans consumer. Vous aimez les moments suspendus, la chaleur d'un intérieur choisi, les rituels qui font du temps ordinaire quelque chose d'essentiel.",
        fragrances: [
            { name: "Empire",         notes: "Encens · Myrrhe · Santal",           image: "/images/ardente/Produits/Empire.webp",          url: "/fragrances/empire" },
            { name: "Gabriel",        notes: "Rose · Musc · Santal",               image: "/images/ardente/Produits/Gabriel.webp",         url: "/fragrances/gabriel" },
            { name: "Solis Rex",      notes: "Oliban · Benjoin · Cèdre",           image: "/images/ardente/Produits/Solis Rex.webp",       url: "/fragrances/solis-rex" },
            { name: "Spiritus Sancti",notes: "Encens · Ciste · Cèdre",             image: "/images/ardente/Produits/Spiritus Sancti.webp", url: "/fragrances/spiritus-sancti" },
        ],
    },
    // 1 Méridienne
    {
        bgImage: "/images/bgSigle.png",
        description: "Solaire sans jamais brûler, votre présence réchauffe. On vous devine généreuse, hospitalière, attachée aux plaisirs simples que vous transformez en moments précieux. Vous n'habitez pas les lieux : vous les ensoleillez.",
        fragrances: [
            { name: "Figuerie", notes: "Feuilles de Cèdre · Feuilles de Figuier · Humus Éther",  image: "/images/méridienne/Produits/Figuerie.webp", url: "/fragrances/figuerie" },
            { name: "Cyrnos",   notes: "Citron · Myrte · Thym",                                  image: "/images/méridienne/Produits/Cyrnos.webp",   url: "/fragrances/cyrnos" },
            { name: "Reggio",   notes: "Feuilles de Pamplemousse · Mandarine",                   image: "/images/méridienne/Produits/Reggio.webp",   url: "/fragrances/reggio" },
            { name: "Salta",    notes: "Écorce de Bergamote · Verveine",                         image: "/images/méridienne/Produits/Salta.webp",    url: "/fragrances/salta" },
        ],
    },
    // 2 Floraison
    {
        bgImage: "/images/bgSigle.png",
        description: "Délicate sans être fragile, vous avez le don de faire fleurir ce qui vous entoure. Les jardins vous reconnaissent, les pétales s'inclinent. Votre essence est celle du renouveau perpétuel.",
        fragrances: [
            { name: "Joséphine",  notes: "Bergamote · Cachemire · Iris",           image: "/images/floraison/Produits/Joséphine.webp",  url: "/fragrances/josephine" },
            { name: "Maduraï",    notes: "Ylang-Ylang · Benjoin · Jasmin",         image: "/images/floraison/Produits/Maduraï.webp",    url: "/fragrances/madurai" },
            { name: "Odalisque",  notes: "Citron · Orange · Fleur d'Oranger",      image: "/images/floraison/Produits/Odalisque.webp",  url: "/fragrances/odalisque" },
            { name: "Tuileries",  notes: "Bois de Rose · Cassis · Mandarine",      image: "/images/floraison/Produits/Tuileries.webp",  url: "/fragrances/tuileries" },
        ],
    },
    // 3 Carnation
    {
        bgImage: "/images/bgSigle.png",
        description: "Votre présence est un refuge. Vous incarnez la profondeur, le raffinement discret, la mémoire sensible des choses belles. Votre univers est celui du temps long, des matières nobles et des émotions tenues.",
        fragrances: [
            { name: "Dada",     notes: "Vétiver · Cèdre · Iris",                   image: "/images/carnation/Produits/Dada.webp",      url: "/fragrances/dada" },
            { name: "Ernesto",  notes: "Tabac · Cuir · Ambre",                     image: "/images/carnation/Produits/Ernesto.webp",   url: "/fragrances/ernesto" },
            { name: "Madeleine",notes: "Magnolia · Musc · Bois Blanc",             image: "/images/carnation/Produits/Madeleine.webp", url: "/fragrances/madeleine" },
            { name: "Ourika",   notes: "Rose · Poivre de Sichuan · Vétiver",       image: "/images/carnation/Produits/Ourika.webp",    url: "/fragrances/ourika" },
        ],
    },
];

// ─── Titres & descriptions pour le résultat duo ───────────────────────────────

export const DUO_PROFILES: Record<string, DuoProfile> = {
    "0_1": {
        title: "Entre Braise et Soleil",
        description: "Vous portez en vous la chaleur du feu et la lumière du plein été. Intense et généreux, vous savez autant envelopper que réchauffer. Votre présence est double : profonde et rayonnante.",
    },
    "0_2": {
        title: "La Saison des Feux Doux",
        description: "Vous aimez les contrastes qui ne s'opposent pas mais se complètent, la douceur des jardins et la chaleur des soirs qui durent. Vous transformez chaque instant en rituel.",
    },
    "0_3": {
        title: "L'Ombre et la Braise",
        description: "Vous incarnez les profondeurs. Entre la brûlure lente et l'élégance tenue, votre présence est singulière, inoubliable. Vous ne vous dévoilez qu'à ceux qui savent regarder.",
    },
    "1_2": {
        title: "Entre-deux Saisons",
        description: "Solaire sans jamais brûler, votre présence réchauffe. On vous devine généreuse, hospitalière, attachée aux plaisirs simples que vous transformez en moments précieux. Vous n'habitez pas les lieux : vous les ensoleillez.",
    },
    "1_3": {
        title: "Lumière Ambrée",
        description: "Vous avez l'élégance du soleil couchant : éclatant et retenu à la fois. Entre la clarté méridionale et la richesse des épices, votre univers est celui des beautés qui durent.",
    },
    "2_3": {
        title: "Le Jardin des Heures",
        description: "Entre le pétale et la patine, vous naviguez avec grâce. Vous avez le goût des choses vivantes et des choses qui durent, la rosée et l'ambre. Un univers à nul autre pareil.",
    },
};

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
                family: 0, // Ardente: feu, chaleur, intimité
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
                family: 3, // Carnation: raffinement, cuir, intellect
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
                family: 2, // Floraison:  nature, végétal, fleurs
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
                family: 1, // Méridienne:  mer, littoral, évasion
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
                family: 0, // Ardente
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
                family: 3, // Carnation
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
                family: 2, // Floraison
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
                family: 1, // Méridienne
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
                family: 0, // Ardente: bougie, cire
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
                family: 3, // Carnation: cuir, noblesse
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
                family: 2, // Floraison
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
                family: 1, // Méridienne
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
                family: 1, // Méridienne: mer, ciel
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
                family: 2, // Floraison: verdure
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
                family: 0, // Ardente: obscurité, intensité
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
                family: 3, // Carnation: épices, ambre
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

export const CATEGORIES = [
  "Adventure",
  "Culture",
  "Food",
  "Wellness",
  "Nature",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Experience {
  /** Slug estable y único, p. ej. "adriatic-sailing-route-042". */
  id: string;
  /** Campo sobre el que se aplica la búsqueda por texto. */
  title: string;
  /** 1–3 frases. Se muestra completa en la página de detalle. */
  description: string;
  category: Category;
  /** "Ciudad, País" — p. ej. "Split, Croatia". */
  destination: string;
  /** En EUR, entero. */
  price: number;
  /** 1.0–5.0, con un decimal. */
  rating: number;
  imageUrl: string;

  /** Opcionales: enriquecen la página de detalle (CONTEXT.md §5.1). */
  duration?: string;
  groupSize?: number;
  language?: string;
  highlights?: string[];
}

/** Etiquetas en castellano para las categorías, que en los datos van en inglés. */
export const CATEGORY_LABELS: Record<Category, string> = {
  Adventure: "Aventura",
  Culture: "Cultura",
  Food: "Gastronomía",
  Wellness: "Bienestar",
  Nature: "Naturaleza",
};

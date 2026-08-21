import { CATEGORIES, type Category, type Experience } from "@/types/experience";

/**
 * Escapa los caracteres que tienen significado dentro de una expresión regular.
 * Sin esto, teclear "(" en el buscador lanzaría un SyntaxError y tumbaría la
 * página (CONTEXT.md §6).
 */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Traduce el parámetro `category` de la URL a una categoría real.
 * Insensible a mayúsculas; un valor inexistente se trata como "todas" (null)
 * en lugar de dejar la página en blanco.
 */
export function normalizeCategory(raw: string | null | undefined): Category | null {
  if (!raw) return null;
  const needle = raw.trim().toLowerCase();
  return CATEGORIES.find((category) => category.toLowerCase() === needle) ?? null;
}

export interface DestinationOptions {
  countries: string[];
  cities: string[];
}

/**
 * Opciones del filtro de destino, derivadas del propio dataset y nunca de una
 * lista escrita a mano: añadir un destino nuevo a los datos lo hace aparecer
 * automáticamente en el filtro.
 *
 * Se ofrecen países y ciudades porque el filtro debe permitir ambos. Como el
 * cotejo es por coincidencia parcial, elegir "Croatia" recoge tanto
 * "Split, Croatia" como "Dubrovnik, Croatia".
 */
export function getDestinationOptions(
  list: readonly Experience[],
): DestinationOptions {
  const cities = new Set<string>();
  const countries = new Set<string>();

  for (const { destination } of list) {
    cities.add(destination);
    const country = destination.split(",").pop()?.trim();
    if (country) countries.add(country);
  }

  const byName = (a: string, b: string) => a.localeCompare(b, "es");

  return {
    countries: [...countries].sort(byName),
    cities: [...cities].sort(byName),
  };
}

export interface FilterCriteria {
  search?: string;
  category?: Category | null;
  destination?: string | null;
}

/**
 * Los tres criterios se combinan con lógica AND: una experiencia se muestra
 * solo si supera todos los que estén activos.
 *
 * - `search` casa parcialmente y sin distinguir mayúsculas contra el título
 *   **o** el destino. Como el destino se guarda en formato "Ciudad, País", una
 *   sola expresión regular cubre las dos búsquedas: "Kyoto" y "Japan" casan
 *   ambas con "Kyoto, Japan".
 *
 *   Nota: CONTEXT.md §6 describe la búsqueda como exclusiva del título. Se
 *   amplió a destino a petición expresa, porque 33 de los nombres de ciudad y
 *   país del dataset no aparecen en ningún título y buscarlos devolvía cero.
 *
 * - `destination` sigue siendo un filtro independiente, también parcial, para
 *   que `destination=Croatia` recoja "Split, Croatia" y "Dubrovnik, Croatia".
 */
export function filterExperiences(
  list: readonly Experience[],
  { search = "", category = null, destination = null }: FilterCriteria = {},
): Experience[] {
  const term = search.trim();
  const place = destination?.trim() ?? "";

  const searchPattern = term ? new RegExp(escapeRegExp(term), "i") : null;
  const destinationPattern = place ? new RegExp(escapeRegExp(place), "i") : null;

  return list.filter(
    (experience) =>
      (!searchPattern ||
        searchPattern.test(experience.title) ||
        searchPattern.test(experience.destination)) &&
      (!category || experience.category === category) &&
      (!destinationPattern || destinationPattern.test(experience.destination)),
  );
}

/** Formatea un precio entero en euros. */
export function formatPrice(price: number): string {
  return `${price} €`;
}

/** Valoración con un decimal y coma, que es el separador decimal en castellano. */
export function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}

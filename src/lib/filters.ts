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
 * Quita las tildes y la barra de la "ø" nórdica para que la búsqueda no exija
 * teclear los acentos. Con el catálogo en castellano esto no es un lujo:
 * "japon", "nautico" o "tromso" tienen que encontrar "Japón", "náutico" y
 * "Tromsø".
 *
 * No baja a minúsculas: de eso ya se encarga la flag `i` de la expresión.
 */
export function fold(value: string): string {
  return value
    .replace(/[øØ]/g, "o")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Compara dos cadenas ignorando mayúsculas y tildes. */
export function sameText(a: string, b: string): boolean {
  return fold(a).toLowerCase() === fold(b).toLowerCase();
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
 * cotejo es por coincidencia parcial, elegir "Croacia" recoge tanto
 * "Split, Croacia" como "Dubrovnik, Croacia".
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
 * - `search` casa parcialmente contra el título **o** el destino, ignorando
 *   mayúsculas y tildes. Como el destino se guarda en formato "Ciudad, País",
 *   una sola expresión regular cubre ciudad y país: "Kioto" y "japon" casan
 *   ambas con "Kioto, Japón".
 *
 *   Nota: CONTEXT.md §6 describía la búsqueda como exclusiva del título. Se
 *   amplió al destino a petición expresa, porque los nombres de ciudad y país
 *   casi nunca aparecen en los títulos y buscarlos devolvía cero.
 *
 * - `destination` sigue siendo un filtro independiente, también parcial, para
 *   que `destination=Croacia` recoja "Split, Croacia" y "Dubrovnik, Croacia".
 */
export function filterExperiences(
  list: readonly Experience[],
  { search = "", category = null, destination = null }: FilterCriteria = {},
): Experience[] {
  const term = search.trim();
  const place = destination?.trim() ?? "";

  // Se compara siempre sobre el texto sin tildes, en los dos lados.
  const searchPattern = term ? new RegExp(escapeRegExp(fold(term)), "i") : null;
  const destinationPattern = place
    ? new RegExp(escapeRegExp(fold(place)), "i")
    : null;

  return list.filter((experience) => {
    const title = fold(experience.title);
    const where = fold(experience.destination);

    return (
      (!searchPattern || searchPattern.test(title) || searchPattern.test(where)) &&
      (!category || experience.category === category) &&
      (!destinationPattern || destinationPattern.test(where))
    );
  });
}

/** Formatea un precio entero en euros. */
export function formatPrice(price: number): string {
  return `${price} €`;
}

/** Valoración con un decimal y coma, que es el separador decimal en castellano. */
export function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}

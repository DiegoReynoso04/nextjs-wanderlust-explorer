"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ActiveFilters, { type FilterKey } from "@/components/ActiveFilters";
import EmptyState from "@/components/EmptyState";
import ExperienceGrid from "@/components/ExperienceGrid";
import FilterPanel from "@/components/FilterPanel";
import ResultsCount from "@/components/ResultsCount";
import SearchBar from "@/components/SearchBar";
import { experiences } from "@/data/experiences";
import { useFavorites } from "@/hooks/useFavorites";
import {
  filterExperiences,
  getDestinationOptions,
  normalizeCategory,
} from "@/lib/filters";
import type { Category } from "@/types/experience";

const SEARCH_DEBOUNCE_MS = 280;

/** Países y ciudades del dataset; ambos valen como filtro de destino. */
const DESTINATION_OPTIONS = getDestinationOptions(experiences);
const KNOWN_DESTINATIONS = [
  ...DESTINATION_OPTIONS.countries,
  ...DESTINATION_OPTIONS.cities,
];

export default function ExperienceExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { favorites, toggleFavorite } = useFavorites();

  // ---------------------------------------------------------------------
  // La URL es la fuente de verdad de los filtros (CONTEXT.md §6).
  // Un valor inventado en `category` se ignora y se trata como "todas".
  // ---------------------------------------------------------------------
  const urlSearch = searchParams.get("search")?.trim() ?? "";
  const category = normalizeCategory(searchParams.get("category"));
  const destination = searchParams.get("destination")?.trim() ?? "";

  /** Reescribe la query eliminando los parámetros vacíos, sin recarga ni salto de scroll. */
  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(patch)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  // ---------------------------------------------------------------------
  // Texto "en vuelo" del buscador: el único estado local admisible.
  // `lastPushed` distingue los cambios que hemos provocado nosotros de los
  // que vienen de fuera (atrás/adelante, enlace pegado), de modo que el
  // debounce no pise las teclas que el usuario sigue escribiendo.
  // ---------------------------------------------------------------------
  const [draft, setDraft] = useState(urlSearch);
  const lastPushed = useRef(urlSearch);

  // URL → input
  useEffect(() => {
    if (urlSearch !== lastPushed.current) {
      lastPushed.current = urlSearch;
      setDraft(urlSearch);
    }
  }, [urlSearch]);

  // input → URL, con debounce para no reescribirla en cada tecla
  useEffect(() => {
    const next = draft.trim();
    if (next === lastPushed.current) return;

    const timer = setTimeout(() => {
      lastPushed.current = next;
      updateParams({ search: next });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [draft, updateParams]);

  // ---------------------------------------------------------------------
  // Opciones del desplegable de destino.
  // Si el enlace trae un valor parcial ("Croatia") que no es una opción
  // exacta del dataset, lo inyectamos para que el control quede prerrellenado
  // en lugar de mostrar "todos" mientras la cuadrícula sí está filtrada.
  // ---------------------------------------------------------------------
  const knownDestination = destination
    ? (KNOWN_DESTINATIONS.find(
        (option) => option.toLowerCase() === destination.toLowerCase(),
      ) ?? null)
    : null;

  const extraDestination = destination && !knownDestination ? destination : null;
  const destinationValue = knownDestination ?? extraDestination ?? "";

  // Todo el filtrado ocurre en cliente y en memoria.
  const results = useMemo(
    () => filterExperiences(experiences, { search: urlSearch, category, destination }),
    [urlSearch, category, destination],
  );

  const hasActiveFilters = Boolean(urlSearch || category || destination);

  const clearAll = useCallback(() => {
    lastPushed.current = "";
    setDraft("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router, setDraft]);

  const clearSearch = useCallback(() => {
    lastPushed.current = "";
    setDraft("");
    updateParams({ search: null });
  }, [updateParams, setDraft]);

  const removeFilter = useCallback(
    (key: FilterKey) => {
      if (key === "search") clearSearch();
      else updateParams({ [key]: null });
    },
    [clearSearch, updateParams],
  );

  return (
    <>
      <header className="mx-auto w-full max-w-7xl px-6 pt-10 pb-6 sm:px-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Explorar experiencias
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-muted">
          {experiences.length} experiencias en{" "}
          {DESTINATION_OPTIONS.cities.length} destinos de{" "}
          {DESTINATION_OPTIONS.countries.length} países. Los filtros viajan en
          la URL, así que cualquier vista que encuentres se puede compartir tal
          cual.
        </p>
      </header>

      {/* Franja sticky: buscador persistente + filtros. Va justo bajo la
          Navbar (h-16), de ahí el top-16. */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 sm:px-10">
          <SearchBar value={draft} onChange={setDraft} onClear={clearSearch} />
          <FilterPanel
            category={category}
            destination={destinationValue}
            destinationOptions={DESTINATION_OPTIONS}
            extraDestination={extraDestination}
            hasActiveFilters={hasActiveFilters}
            onCategoryChange={(next: Category | null) =>
              updateParams({ category: next })
            }
            onDestinationChange={(next: string) =>
              updateParams({ destination: next || null })
            }
            onClearAll={clearAll}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ResultsCount shown={results.length} total={experiences.length} />
          <ActiveFilters
            search={urlSearch}
            category={category}
            destination={destination}
            onRemove={removeFilter}
            onClearAll={clearAll}
          />
        </div>

        <div className="mt-7">
          {results.length > 0 ? (
            <ExperienceGrid
              experiences={results}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ) : (
            <EmptyState
              title="Ninguna experiencia encaja con estos filtros"
              description="Prueba con menos criterios: quita el destino, cambia de categoría o busca un término más corto."
              actionLabel="Limpiar todos los filtros"
              onAction={clearAll}
            />
          )}
        </div>
      </div>
    </>
  );
}

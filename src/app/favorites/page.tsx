"use client";

import { useMemo } from "react";

import EmptyState from "@/components/EmptyState";
import ExperienceGrid from "@/components/ExperienceGrid";
import { experiences } from "@/data/experiences";
import { useFavorites } from "@/hooks/useFavorites";
import type { Experience } from "@/types/experience";

/**
 * Página de favoritos (CONTEXT.md §4).
 *
 * Es un componente de cliente porque toda la página depende del estado de
 * favoritos. Lee la lista de ids del provider montado en el layout —el "nivel
 * superior" del que habla §7— y a partir de aquí el estado y la función de
 * alternado bajan **explícitamente como props**: página → ExperienceGrid →
 * ExperienceCard → botón del corazón. Ningún componente por debajo vuelve a
 * tocar el contexto.
 *
 * No hay persistencia: al refrescar el navegador la lista se vacía, que es el
 * comportamiento esperado en esta versión.
 */
export default function FavoritesPage() {
  const { favorites, toggleFavorite, clearFavorites, count } = useFavorites();

  // Se respeta el orden en que se guardaron, no el del catálogo: así las
  // tarjetas no bailan de sitio cada vez que guardas una nueva.
  const saved = useMemo(
    () =>
      favorites
        .map((id) => experiences.find((experience) => experience.id === id))
        .filter((experience): experience is Experience => experience !== undefined),
    [favorites],
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 lg:py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tus favoritos
          </h1>
          <p aria-live="polite" className="mt-2 text-muted">
            {count === 0
              ? "Todavía no has guardado ninguna experiencia."
              : count === 1
                ? "Tienes 1 experiencia guardada."
                : `Tienes ${count} experiencias guardadas.`}
          </p>
        </div>

        {count > 0 && (
          <button
            type="button"
            onClick={clearFavorites}
            className="cursor-pointer rounded-full px-3 py-2 text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Vaciar la lista
          </button>
        )}
      </header>

      <div className="mt-8">
        {count > 0 ? (
          <ExperienceGrid
            experiences={saved}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <EmptyState
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-accent"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            }
            title="Aquí aparecerán tus experiencias guardadas"
            description="Pulsa el corazón de cualquier tarjeta del explorador y volverás a encontrarla en esta página. La lista dura lo que dure la sesión: al refrescar el navegador empieza de cero."
            actionLabel="Explorar experiencias"
            href="/experiences"
          />
        )}
      </div>
    </div>
  );
}

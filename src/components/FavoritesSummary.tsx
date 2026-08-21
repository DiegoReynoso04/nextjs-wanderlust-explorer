"use client";

import Link from "next/link";

import { useFavorites } from "@/hooks/useFavorites";

/**
 * Isla interactiva del perfil. La página es un Server Component, así que este
 * es el único trozo que se hidrata: lee `count` del provider y se actualiza en
 * vivo. El número nunca se escribe a mano (CONTEXT.md §4).
 */
export default function FavoritesSummary() {
  const { count } = useFavorites();

  return (
    <section className="rounded-panel border border-border p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft"
        >
          <svg
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 fill-accent stroke-accent"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </span>

        <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
          Guardadas
        </h2>
      </div>

      <p aria-live="polite" className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-tight tabular-nums">
          {count}
        </span>
        <span className="text-sm text-muted">
          {count === 1 ? "experiencia" : "experiencias"}
        </span>
      </p>

      <p className="mt-2 text-sm text-pretty text-muted">
        {count === 0
          ? "Aún no has guardado nada. El corazón de cada tarjeta las trae aquí."
          : "Se conservan mientras dure la sesión; al refrescar la lista empieza de cero."}
      </p>

      <Link
        href="/favorites"
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Ver mis favoritos
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </section>
  );
}

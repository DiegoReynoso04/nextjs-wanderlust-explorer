"use client";

import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  id: string;
  title: string;
}

/**
 * Isla interactiva del detalle. La página es un Server Component, así que no
 * puede pasar la función de alternado hacia abajo como props: este botón lee
 * el estado del Context, que §2 admite como canal de transporte.
 *
 * En la tarjeta del explorador el corazón sí recibe `isFavorite` y
 * `onToggleFavorite` por props desde el contenedor, como pide §7.
 */
export default function FavoriteButton({ id, title }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(id)}
      aria-pressed={saved}
      aria-label={
        saved
          ? `Quitar ${title} de favoritos`
          : `Guardar ${title} en favoritos`
      }
      className={`flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border text-sm font-semibold transition duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98] motion-reduce:transform-none ${
        saved
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-background text-foreground hover:border-foreground"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-5 w-5 transition-colors ${
          saved ? "fill-accent stroke-accent" : "fill-none stroke-current"
        }`}
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      {saved ? "Guardada en favoritos" : "Guardar en favoritos"}
    </button>
  );
}

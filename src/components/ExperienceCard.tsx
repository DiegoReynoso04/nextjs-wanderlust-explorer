"use client";

import Image from "next/image";
import Link from "next/link";

import { formatPrice, formatRating } from "@/lib/filters";
import { CATEGORY_LABELS, type Experience } from "@/types/experience";

interface ExperienceCardProps {
  experience: Experience;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const IMAGE_SIZES =
  "(min-width: 1280px) 21vw, (min-width: 1024px) 29vw, (min-width: 640px) 44vw, 92vw";

/**
 * Tarjeta del explorador. La foto lleva el peso visual: sin borde ni sombra,
 * la profundidad la aporta la imagen (CONTEXT.md §3).
 *
 * El enlace al detalle es una capa absoluta que cubre toda la tarjeta, no un
 * <a> que la envuelva: así el corazón puede ser un <button> real sin anidar un
 * botón dentro de un enlace, y pulsarlo no navega.
 */
export default function ExperienceCard({
  experience,
  isFavorite,
  onToggleFavorite,
}: ExperienceCardProps) {
  const { id, title, category, destination, price, rating, imageUrl } =
    experience;

  return (
    <article className="group relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes={IMAGE_SIZES}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#222] backdrop-blur-sm">
          {CATEGORY_LABELS[category]}
        </span>
      </div>

      {/* Corazón: botón real, por encima de la capa de enlace (z-20 > z-10). */}
      <button
        type="button"
        onClick={() => onToggleFavorite(id)}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `Quitar ${title} de favoritos`
            : `Guardar ${title} en favoritos`
        }
        className="absolute top-2 right-2 z-20 cursor-pointer rounded-full p-1.5 transition-transform duration-150 ease-out hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-90 motion-reduce:transform-none"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-6 w-6 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-colors ${
            isFavorite
              ? "fill-accent stroke-accent"
              : "fill-black/25 stroke-white"
          }`}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      <div className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold">
            {title}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm tabular-nums">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {formatRating(rating)}
          </span>
        </div>

        <p className="mt-1 text-sm text-muted">{destination}</p>

        <p className="mt-2 text-sm">
          <span className="font-semibold">{formatPrice(price)}</span>{" "}
          <span className="text-muted">por persona</span>
        </p>
      </div>

      <Link
        href={`/experiences/${id}`}
        className="absolute inset-0 z-10 rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span className="sr-only">Ver el detalle de {title}</span>
      </Link>
    </article>
  );
}

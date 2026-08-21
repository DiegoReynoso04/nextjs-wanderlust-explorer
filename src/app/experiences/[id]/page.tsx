import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import FavoriteButton from "@/components/FavoriteButton";
import { experiences } from "@/data/experiences";
import { formatPrice, formatRating } from "@/lib/filters";
import { CATEGORY_LABELS, type Experience } from "@/types/experience";

function findExperience(id: string): Experience | undefined {
  return experiences.find((experience) => experience.id === id);
}

/** Las 100 rutas de detalle se prerenderizan: el dataset es local y estático. */
export function generateStaticParams() {
  return experiences.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/experiences/[id]">): Promise<Metadata> {
  const { id } = await params;
  const experience = findExperience(id);

  if (!experience) return { title: "Experiencia no encontrada" };

  return {
    title: experience.title,
    description: experience.description,
  };
}

/**
 * Server Component. En Next 16 los parámetros de ruta llegan de forma
 * asíncrona, así que hay que esperarlos antes de usar el `id` (CONTEXT.md §10).
 * La única isla de cliente es el botón de favoritos.
 */
export default async function ExperienceDetailPage({
  params,
}: PageProps<"/experiences/[id]">) {
  const { id } = await params;
  const experience = findExperience(id);

  // Un id inexistente muestra un 404 controlado, no un crash.
  if (!experience) notFound();

  const {
    title,
    description,
    category,
    destination,
    price,
    rating,
    imageUrl,
    duration,
    groupSize,
  } = experience;

  return (
    <article>
      {/* Hero a sangre */}
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden bg-[#101010] sm:h-[60vh]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/30"
        />

        <div className="absolute inset-x-0 top-0">
          <div className="mx-auto w-full max-w-7xl px-6 pt-6 sm:px-10">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 rounded-full bg-black/35 py-2 pr-4 pl-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
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
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              Volver al explorador
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 sm:pb-12">
            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#222] backdrop-blur-sm">
              {CATEGORY_LABELS[category]}
            </span>

            <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
              <span>{destination}</span>
              <span className="flex items-center gap-1.5 tabular-nums">
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
              {duration && <span>{duration}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Cuerpo: descripción a la izquierda, resumen de reserva a la derecha */}
      <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-14">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Sobre esta experiencia
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">
              {description}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border pt-8 sm:grid-cols-4">
              <DetailItem label="Destino" value={destination} />
              <DetailItem label="Categoría" value={CATEGORY_LABELS[category]} />
              {duration && <DetailItem label="Duración" value={duration} />}
              {groupSize && (
                <DetailItem
                  label="Grupo"
                  value={`Hasta ${groupSize} personas`}
                />
              )}
            </dl>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-panel border border-border p-6 lg:sticky lg:top-24">
              <p className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight tabular-nums">
                  {formatPrice(price)}
                </span>
                <span className="text-sm text-muted">por persona</span>
              </p>

              <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                <SummaryRow
                  label="Valoración"
                  value={`${formatRating(rating)} / 5,0`}
                />
                {duration && <SummaryRow label="Duración" value={duration} />}
                {groupSize && (
                  <SummaryRow label="Grupo máximo" value={`${groupSize}`} />
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  disabled
                  className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Solicitar reserva
                </button>

                <FavoriteButton id={id} title={title} />
              </div>

              <p className="mt-4 text-center text-xs text-muted">
                Las reservas no están disponibles en esta versión del MVP.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

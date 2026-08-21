import type { Metadata } from "next";
import { Suspense } from "react";

import ExperienceExplorer from "@/components/ExperienceExplorer";

export const metadata: Metadata = {
  title: "Explorar experiencias",
  description:
    "Busca por título y filtra por categoría y destino entre cien experiencias de viaje. Los filtros viajan en la URL.",
};

/**
 * Server Component. El explorador lee `useSearchParams`, así que necesita
 * un límite de Suspense por encima o la compilación de producción falla
 * (CONTEXT.md §10).
 */
export default function ExperiencesPage() {
  return (
    <Suspense fallback={<ExplorerSkeleton />}>
      <ExperienceExplorer />
    </Suspense>
  );
}

function ExplorerSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-10 sm:px-10">
      <div className="h-9 w-72 animate-pulse rounded-input bg-surface" />
      <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-input bg-surface" />
      <div className="mt-8 h-13 w-full animate-pulse rounded-input bg-surface" />
      <div className="mt-4 h-11 w-full animate-pulse rounded-input bg-surface" />

      <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <li key={index}>
            <div className="aspect-[4/3] animate-pulse rounded-card bg-surface" />
            <div className="mt-3 h-4 w-4/5 animate-pulse rounded-input bg-surface" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded-input bg-surface" />
          </li>
        ))}
      </ul>
    </div>
  );
}

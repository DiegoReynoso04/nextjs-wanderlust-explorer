"use client";

import { CATEGORY_LABELS, type Category } from "@/types/experience";

export type FilterKey = "search" | "category" | "destination";

interface ActiveFiltersProps {
  search: string;
  category: Category | null;
  destination: string;
  onRemove: (key: FilterKey) => void;
  onClearAll: () => void;
}

/** Chips de filtros activos, con descarte individual y un "limpiar todo". */
export default function ActiveFilters({
  search,
  category,
  destination,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  const chips: { key: FilterKey; label: string; value: string }[] = [];

  if (search) chips.push({ key: "search", label: "Búsqueda", value: search });
  if (category)
    chips.push({
      key: "category",
      label: "Categoría",
      value: CATEGORY_LABELS[category],
    });
  if (destination)
    chips.push({ key: "destination", label: "Destino", value: destination });

  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {chips.map(({ key, label, value }) => (
        <li key={key}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pr-1.5 pl-3 text-sm">
            <span className="text-muted">{label}:</span>
            <span className="font-medium">{value}</span>
            <button
              type="button"
              onClick={() => onRemove(key)}
              aria-label={`Quitar el filtro ${label.toLowerCase()}: ${value}`}
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-border hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                className="h-3 w-3"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        </li>
      ))}

      {chips.length > 1 && (
        <li>
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-full px-2 py-1.5 text-sm font-medium text-accent underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Limpiar todo
          </button>
        </li>
      )}
    </ul>
  );
}

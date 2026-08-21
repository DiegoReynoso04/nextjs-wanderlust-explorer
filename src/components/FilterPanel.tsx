"use client";

import type { DestinationOptions } from "@/lib/filters";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/types/experience";

interface FilterPanelProps {
  category: Category | null;
  destination: string;
  destinationOptions: DestinationOptions;
  /** Valor traído por la URL que no coincide con ninguna opción del dataset. */
  extraDestination: string | null;
  hasActiveFilters: boolean;
  onCategoryChange: (category: Category | null) => void;
  onDestinationChange: (destination: string) => void;
  onClearAll: () => void;
}

/**
 * Categoría: tira horizontal con subrayado fino en escritorio (CONTEXT.md §3),
 * y un <select> nativo en viewport estrecho, donde las pestañas no caben.
 * Destino: <select> siempre, con las opciones derivadas del propio dataset.
 */
export default function FilterPanel({
  category,
  destination,
  destinationOptions,
  extraDestination,
  hasActiveFilters,
  onCategoryChange,
  onDestinationChange,
  onClearAll,
}: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
      {/* Categoría — tira horizontal (≥ md) */}
      <div
        role="group"
        aria-label="Filtrar por categoría"
        className="hidden items-center gap-6 md:flex"
      >
        <CategoryTab
          isActive={category === null}
          onClick={() => onCategoryChange(null)}
        >
          Todas
        </CategoryTab>

        {CATEGORIES.map((value) => (
          <CategoryTab
            key={value}
            isActive={category === value}
            onClick={() => onCategoryChange(value)}
          >
            {CATEGORY_LABELS[value]}
          </CategoryTab>
        ))}
      </div>

      {/* Categoría — desplegable (< md) */}
      <Select
        id="category-select"
        label="Categoría"
        value={category ?? ""}
        onChange={(value) => onCategoryChange((value || null) as Category | null)}
        className="md:hidden"
      >
        <option value="">Todas las categorías</option>
        {CATEGORIES.map((value) => (
          <option key={value} value={value}>
            {CATEGORY_LABELS[value]}
          </option>
        ))}
      </Select>

      <div className="flex items-center gap-3">
        <Select
          id="destination-select"
          label="Destino"
          value={destination}
          onChange={onDestinationChange}
          className="min-w-0 flex-1 md:w-64 md:flex-none"
        >
          <option value="">Todos los destinos</option>

          {extraDestination && (
            <option value={extraDestination}>{extraDestination}</option>
          )}

          <optgroup label="Países">
            {destinationOptions.countries.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </optgroup>

          <optgroup label="Ciudades">
            {destinationOptions.cities.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </optgroup>
        </Select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="shrink-0 rounded-full px-3 py-2 text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Limpiar todo
          </button>
        )}
      </div>
    </div>
  );
}

function CategoryTab({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`relative cursor-pointer pb-2 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
        isActive
          ? "font-semibold text-foreground"
          : "text-muted hover:text-foreground"
      }`}
    >
      {children}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-foreground"
        />
      )}
    </button>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  className = "",
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full cursor-pointer appearance-none rounded-input border border-border bg-background pr-10 pl-4 text-sm focus:border-foreground focus:outline-none"
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

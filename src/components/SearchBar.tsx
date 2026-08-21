"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

/**
 * Buscador persistente. Es un input controlado por el texto "en vuelo" que
 * mantiene el explorador; el volcado a la URL va con debounce y ocurre allí.
 * Casa contra el título y el destino de cada experiencia.
 */
export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Buscar experiencias por título o destino
      </label>

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>

      <input
        id="search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Busca por título o destino: sailing, Kyoto, Croatia…"
        autoComplete="off"
        className="h-13 w-full rounded-input border border-border bg-background pr-12 pl-12 text-base placeholder:text-muted focus:border-foreground focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Borrar la búsqueda"
          className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

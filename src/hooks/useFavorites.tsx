"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Estado de favoritos de nivel superior (CONTEXT.md §7).
 *
 * Se construye solo con primitivas de React: `useState`, `useCallback`,
 * `useMemo` y el `Context` que el propio React incluye. Ninguna librería
 * externa de gestión de estado.
 *
 * El Context es únicamente el canal de transporte que salva la frontera del
 * layout de servidor. A partir del contenedor de cada página, el estado y la
 * función de alternado viajan hacia abajo como props explícitas.
 *
 * No hay persistencia: al refrescar el navegador la lista se vacía, que es el
 * comportamiento esperado en esta versión.
 */
interface FavoritesApi {
  favorites: string[];
  count: number;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesApi | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const value = useMemo<FavoritesApi>(
    () => ({
      favorites,
      count: favorites.length,
      isFavorite: (id: string) => favorites.includes(id),
      toggleFavorite,
      clearFavorites,
    }),
    [favorites, toggleFavorite, clearFavorites],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesApi {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavorites debe usarse dentro de <FavoritesProvider>. Comprueba src/app/layout.tsx.",
    );
  }
  return context;
}

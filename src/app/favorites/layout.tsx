import type { Metadata } from "next";

/**
 * La página de favoritos es un componente de cliente, y un componente de
 * cliente no puede exportar `metadata`. Este layout mínimo existe solo para
 * darle a la ruta su propio título de pestaña, como el resto de páginas.
 */
export const metadata: Metadata = {
  title: "Favoritos",
  description:
    "Las experiencias que has guardado durante esta sesión, listas para volver a mirarlas.",
};

export default function FavoritesLayout({
  children,
}: LayoutProps<"/favorites">) {
  return children;
}

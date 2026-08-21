import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { FavoritesProvider } from "@/hooks/useFavorites";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Wanderlust Explorer",
    template: "%s · Wanderlust Explorer",
  },
  description:
    "Descubre y guarda experiencias únicas en todo el mundo: gastronomía, aventura, cultura, bienestar y naturaleza.",
};

/**
 * El layout raíz es un Server Component, así que el estado de favoritos vive
 * en <FavoritesProvider>, un componente de cliente montado aquí una sola vez.
 * Así el estado sobrevive a la navegación entre el explorador, los favoritos
 * y el perfil (CONTEXT.md §7).
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <FavoritesProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
        </FavoritesProvider>
      </body>
    </html>
  );
}

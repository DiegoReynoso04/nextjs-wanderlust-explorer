"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useFavorites } from "@/hooks/useFavorites";

const LINKS = [
  { href: "/experiences", label: "Explorar" },
  { href: "/favorites", label: "Favoritos" },
  { href: "/profile", label: "Perfil" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useFavorites();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/90 backdrop-blur-md">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-6 sm:px-10"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full text-base font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
          Wanderlust
        </Link>

        <ul className="flex items-center gap-1 sm:gap-2">
          {LINKS.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4 ${
                    isActive
                      ? "bg-surface font-semibold text-foreground"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {label}
                  {href === "/favorites" && count > 0 && (
                    <span
                      className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white tabular-nums"
                      aria-label={`${count} guardadas`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

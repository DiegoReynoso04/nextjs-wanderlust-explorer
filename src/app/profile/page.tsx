import type { Metadata } from "next";
import Link from "next/link";

import FavoritesSummary from "@/components/FavoritesSummary";

export const metadata: Metadata = {
  title: "Perfil",
  description:
    "Perfil de usuario simulado con el resumen de experiencias guardadas.",
};

/**
 * Usuario inventado (CONTEXT.md §4). Todo el contenido de la página es
 * estático salvo el contador de favoritos, que es una isla de cliente.
 * Para cambiar el perfil basta con editar este objeto.
 */
const USER = {
  name: "Marta Solís",
  alias: "@martasolis",
  initials: "MS",
  location: "Valencia, España",
  memberSince: 2023,
  bio: "Diseñadora de producto con debilidad por los viajes lentos. Prefiere un mercado a las siete de la mañana antes que cualquier mirador con cola, y guarda más experiencias de las que llega a reservar.",
  languages: "Español, inglés, portugués",
} as const;

const QUICK_LINKS = [
  {
    href: "/experiences",
    label: "Explorar experiencias",
    description: "Las 100 del catálogo, con búsqueda y filtros",
  },
  {
    href: "/favorites",
    label: "Mis favoritos",
    description: "Lo que has guardado en esta sesión",
  },
  {
    href: "/",
    label: "Volver al inicio",
    description: "La portada de Wanderlust",
  },
] as const;

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 lg:py-14">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Perfil
      </h1>
      <p className="mt-2 text-muted">
        Cuenta de demostración. En esta versión no hay registro ni sesión real.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Tarjeta de perfil */}
        <section className="rounded-panel border border-border p-6 sm:p-8 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-5">
            <span
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent-soft text-2xl font-semibold tracking-tight text-accent"
            >
              {USER.initials}
            </span>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {USER.name}
              </h2>
              <p className="mt-1 text-muted">{USER.alias}</p>
            </div>
          </div>

          <p className="mt-6 text-pretty text-muted">{USER.bio}</p>

          <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 border-t border-border pt-6 sm:grid-cols-3">
            <ProfileField label="Ubicación" value={USER.location} />
            <ProfileField label="Miembro desde" value={`${USER.memberSince}`} />
            <ProfileField label="Idiomas" value={USER.languages} />
          </dl>
        </section>

        {/* Columna lateral: contador reactivo y accesos rápidos */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <FavoritesSummary />

          <nav
            aria-label="Accesos rápidos"
            className="rounded-panel border border-border p-2"
          >
            <ul>
              {QUICK_LINKS.map(({ href, label, description }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-4 rounded-card px-4 py-3 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span>
                      <span className="block text-sm font-semibold">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">
                        {description}
                      </span>
                    </span>

                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

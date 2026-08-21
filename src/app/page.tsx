import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/**
 * Fotografía del hero. Se sirve desde Unsplash, por lo que el dominio está
 * declarado en `images.remotePatterns` (next.config.ts). Para cambiar la
 * imagen basta con sustituir esta constante.
 */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=80";

export const metadata: Metadata = {
  title: {
    absolute: "Wanderlust Explorer — Experiencias únicas en todo el mundo",
  },
  description:
    "Explora, busca y guarda cien experiencias de viaje seleccionadas: gastronomía, aventura, cultura, bienestar y naturaleza.",
};

export default function Home() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-1 flex-col justify-end overflow-hidden bg-[#101010]">
      {/* Fondo fotográfico a sangre. `alt` vacío: es decorativa, el titular
          es quien transmite el mensaje. */}
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Velos de contraste: la foto manda, pero el texto tiene que leerse. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-black/40 to-transparent to-40%"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 pb-16 sm:px-10 sm:pb-24 lg:pb-28">
        <p className="flex items-center gap-2.5 text-sm font-medium tracking-[0.18em] text-white/75 uppercase">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-accent"
          />
          Wanderlust Labs
        </p>

        <h1 className="mt-6 max-w-4xl text-5xl leading-[0.95] font-semibold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
          Experiencias que no caben en una guía de viaje
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/80 sm:text-xl">
          Un tour gastronómico por los mercados de Bangkok. Una ruta de vela por
          el Adriático. Cien experiencias seleccionadas a mano, listas para
          explorar, filtrar y guardar.
        </p>

        <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/experiences"
            className="group inline-flex h-14 items-center gap-3 rounded-full bg-accent pr-6 pl-8 text-base font-semibold text-white shadow-lg shadow-black/25 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-strong hover:shadow-xl hover:shadow-black/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
          >
            Explorar experiencias
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>

          <p className="text-sm text-white/60">
            100 experiencias · 5 categorías · sin registro
          </p>
        </div>
      </div>
    </section>
  );
}

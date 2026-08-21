import Link from "next/link";

/** 404 controlado cuando el `id` de la URL no existe en el dataset local. */
export default function ExperienceNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:px-10">
      <p className="text-sm font-medium tracking-[0.18em] text-muted uppercase">
        Error 404
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Esta experiencia no existe
      </h1>

      <p className="mt-4 text-pretty text-muted">
        El enlace puede estar mal copiado o la experiencia ya no forma parte del
        catálogo. Vuelve al explorador y busca entre las cien disponibles.
      </p>

      <Link
        href="/experiences"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none"
      >
        Volver al explorador
      </Link>
    </div>
  );
}

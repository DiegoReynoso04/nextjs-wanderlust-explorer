import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  /** Icono decorativo. Por defecto una lupa, que encaja con "sin resultados". */
  icon?: ReactNode;
  /** Un estado vacío ofrece o bien limpiar filtros (onAction) o bien navegar (href). */
  onAction?: () => void;
  href?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  icon,
  onAction,
  href,
}: EmptyStateProps) {
  const actionClasses =
    "inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none";

  return (
    <div className="flex flex-col items-center justify-center rounded-panel border border-border bg-surface px-6 py-20 text-center">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-background"
      >
        {icon ?? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            className="h-6 w-6 text-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        )}
      </span>

      <h2 className="mt-5 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-pretty text-muted">{description}</p>

      <div className="mt-7">
        {href ? (
          <Link href={href} className={actionClasses}>
            {actionLabel}
          </Link>
        ) : (
          <button type="button" onClick={onAction} className={actionClasses}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

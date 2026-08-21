interface ResultsCountProps {
  shown: number;
  total: number;
}

/** "Mostrando X de 100 experiencias" — contexto antes de empezar a scrollear. */
export default function ResultsCount({ shown, total }: ResultsCountProps) {
  return (
    <p aria-live="polite" className="text-sm text-muted">
      {shown === total ? (
        <>
          <span className="font-semibold text-foreground tabular-nums">
            {total}
          </span>{" "}
          experiencias
        </>
      ) : (
        <>
          Mostrando{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {shown}
          </span>{" "}
          de <span className="tabular-nums">{total}</span> experiencias
        </>
      )}
    </p>
  );
}

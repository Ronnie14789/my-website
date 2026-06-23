export function PageLoader() {
  return (
    <div className="page-loader" aria-live="polite" aria-busy="true">
      <div className="spinner" />
      <p>Loading…</p>
    </div>
  );
}

export function SkeletonCard() {
  return <div className="skeleton-card" aria-hidden="true" />;
}

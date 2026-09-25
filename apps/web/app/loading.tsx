export default function Loading() {
  return (
    <div className="state-page" role="status" aria-live="polite">
      <div className="state-badge"><span aria-hidden="true" /> System status // loading</div>
      <div className="state-card">
        <div className="state-spinner" aria-hidden="true">G</div>
        <div>
          <p className="eyebrow">Hydration protocol</p>
          <h1>Loading the creative archive...</h1>
          <p>Fetching the latest projects and media from the studio source.</p>
        </div>
      </div>
    </div>
  );
}

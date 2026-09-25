"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="state-page" role="alert">
      <div className="state-badge state-badge-error"><span aria-hidden="true" /> Signal interrupted</div>
      <div className="state-card state-card-error">
        <p className="eyebrow">Recovery protocol</p>
        <h1>The archive needs another connection.</h1>
        <p>We could not load this view from the application source. Nothing has been changed.</p>
        <button type="button" className="button-primary" onClick={() => reset()}>Retry connection</button>
      </div>
    </div>
  );
}
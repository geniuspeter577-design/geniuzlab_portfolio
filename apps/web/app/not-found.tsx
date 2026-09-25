import Link from "next/link";

export default function NotFound() {
  return (
    <div className="state-page" role="status">
      <div className="state-badge"><span aria-hidden="true" /> Archive response // 404</div>
      <div className="state-card">
        <p className="eyebrow">No matching artifact</p>
        <h1>This project is not in the public archive.</h1>
        <p>The address may be out of date, unpublished, or no longer available.</p>
        <Link href="/work" className="button-primary">Return to work</Link>
      </div>
    </div>
  );
}

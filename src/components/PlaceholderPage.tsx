import Link from "next/link";

export function PlaceholderPage({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="page">
      <section className="panel panel-pad">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="lede" style={{ fontSize: 18 }}>
          {description}
        </p>
        <div className="actions">
          <Link className="button" href="/dashboard">
            Back to dashboard
          </Link>
          <Link className="button secondary" href="/paywall">
            View paywall
          </Link>
        </div>
      </section>
    </main>
  );
}

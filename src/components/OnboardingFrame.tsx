export function OnboardingFrame({
  eyebrow,
  title,
  lede,
  children,
  aside
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <main className="page">
      <div className="grid two-col" style={{ alignItems: "start" }}>
        <section className="panel panel-pad">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="lede" style={{ fontSize: 18 }}>
            {lede}
          </p>
          {children}
        </section>
        <aside className="panel panel-pad">{aside ?? <ProgressAside />}</aside>
      </div>
    </main>
  );
}

function ProgressAside() {
  return (
    <div className="grid">
      <h3>Your v1 onboarding path</h3>
      <ol className="check-list">
        <li>Choose profession and create your account</li>
        <li>Upload a clear solo selfie</li>
        <li>Approve likeness grid</li>
        <li>Generate welcome video</li>
        <li>Review pricing and start posting</li>
      </ol>
    </div>
  );
}

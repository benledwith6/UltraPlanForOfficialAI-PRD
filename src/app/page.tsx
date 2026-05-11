import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="page hero">
      <section>
        <p className="eyebrow">For regulated personal-brand marketing</p>
        <h1>Show up on video without picking up a camera.</h1>
        <p className="lede">
          Official AI turns one approved selfie into compliant short-form marketing videos for lawyers
          and real estate agents, then guides what to post next.
        </p>
        <div className="actions">
          <Link className="button" href="/signup">
            Start with your likeness
          </Link>
          <Link className="button secondary" href="/waitlist">
            Join another profession waitlist
          </Link>
        </div>
        <div className="grid three-col" style={{ marginTop: 34 }}>
          <div className="mini-stat">Likeness gate before any video render.</div>
          <div className="mini-stat">Attorney advertising disclaimers by default.</div>
          <div className="mini-stat">Fair Housing checks block risky realtor scripts.</div>
        </div>
      </section>
      <aside className="panel hero-preview" aria-label="Generated video preview">
        <div className="video-stage">
          <div className="portrait-orbit" />
          <div className="caption-strip">
            <strong>Welcome to Official AI.</strong>
            <br />
            <span style={{ color: "rgba(255,255,255,0.78)" }}>
              Your first AI welcome video appears before the paywall.
            </span>
          </div>
        </div>
      </aside>
    </main>
  );
}

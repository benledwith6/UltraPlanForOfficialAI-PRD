import Link from "next/link";
import { requireCurrentUser } from "@/lib/onboarding";

export default async function FreeDashboardPage() {
  const user = await requireCurrentUser();

  return (
    <main className="page">
      <section className="panel panel-pad">
        <p className="eyebrow">Free dashboard</p>
        <h2>Your watermarked welcome video is waiting.</h2>
        <p className="lede" style={{ fontSize: 18 }}>
          Free users can download the welcome video and preview locked production features.
        </p>
        <div className="grid two-col" style={{ alignItems: "center" }}>
          <div className="video-stage" style={{ minHeight: 360, borderRadius: 8 }}>
            <img
              src={user.onboardingAsset?.welcomeVideoUrl ?? "/welcome-video-placeholder.svg"}
              alt="Watermarked welcome video"
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
            <div className="caption-strip">Made with Official AI</div>
          </div>
          <div className="grid">
            <div className="tier-card">
              <h3>Locked next step</h3>
              <p className="hint">Generate a lawyer explainer, listing walkthrough, brainstorm cards, or guided calendar once you choose a paid tier.</p>
              <div className="actions">
                <Link className="button" href="/paywall">
                  Unlock production
                </Link>
                <Link className="button secondary" href="/character-sheets">
                  View character sheet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

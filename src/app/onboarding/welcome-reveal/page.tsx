import { startPostingAction } from "@/app/actions";
import { requireCurrentUser } from "@/lib/onboarding";
import { OnboardingFrame } from "@/components/OnboardingFrame";

export default async function WelcomeRevealPage() {
  const user = await requireCurrentUser();

  return (
    <OnboardingFrame
      eyebrow="Screen 6"
      title="This is you. Imagine what you could post next."
      lede="Your AI welcome video is ready. Free tier downloads keep a subtle Official AI watermark."
      aside={
        <div className="grid">
          <h3>Current account</h3>
          <p className="hint">{user.email}</p>
          <p className="hint">Profession mode: {user.profession}</p>
        </div>
      }
    >
      <div className="video-stage" style={{ minHeight: 460, borderRadius: 8 }}>
        <img
          src={user.onboardingAsset?.welcomeVideoUrl ?? "/welcome-video-placeholder.svg"}
          alt="Welcome video placeholder frame"
          style={{ width: "100%", maxWidth: 640, height: "auto", borderRadius: 8 }}
        />
        <div className="caption-strip">
          <strong>Welcome to Official AI.</strong>
          <br />
          <span style={{ color: "rgba(255,255,255,0.78)" }}>Made with Official AI</span>
        </div>
      </div>
      <div className="actions" style={{ marginTop: 24 }}>
        <form action={startPostingAction}>
          <button className="button" type="submit">
            Start posting
          </button>
        </form>
        <button className="button secondary" type="button">
          Watch again
        </button>
        <a className="button secondary" href="/welcome-video-placeholder.svg" download>
          Download watermarked video
        </a>
      </div>
    </OnboardingFrame>
  );
}

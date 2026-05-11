import { signupAction } from "@/app/actions";
import { OnboardingFrame } from "@/components/OnboardingFrame";

export default async function SignupPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <OnboardingFrame
      eyebrow="Screen 1"
      title="Start with your profession."
      lede="Official AI is tuned for lawyers and real estate agents at v1. Other professions join the waitlist."
      aside={
        <div className="grid">
          <h3>Why we ask first</h3>
          <p className="hint">
            Your profession controls templates, cadence recommendations, compliance gates, and the onboarding questionnaire.
          </p>
        </div>
      }
    >
      <form action={signupAction}>
        <div className="choice-grid" role="radiogroup" aria-label="Profession">
          <label className="choice">
            <input type="radio" name="profession" value="lawyer" required />
            <strong>I&apos;m a lawyer</strong>
            <span className="hint">State-bar disclaimers and LinkedIn-heavy cadence.</span>
          </label>
          <label className="choice">
            <input type="radio" name="profession" value="realtor" />
            <strong>I&apos;m a real estate agent</strong>
            <span className="hint">Fair Housing checks and listing-first templates.</span>
          </label>
          <label className="choice">
            <input type="radio" name="profession" value="other" />
            <strong>Other</strong>
            <span className="hint">Join the waitlist while we expand.</span>
          </label>
        </div>
        <div className="grid two-col" style={{ marginTop: 22 }}>
          <label className="field">
            <span className="label">Email</span>
            <input className="input" name="email" type="email" autoComplete="email" required />
          </label>
          <label className="field">
            <span className="label">Password</span>
            <input className="input" name="password" type="password" minLength={8} autoComplete="new-password" required />
          </label>
        </div>
        {params.error ? <p className="error">{params.error}</p> : null}
        <div className="actions">
          <button className="button" type="submit">
            Create account
          </button>
          <button className="button secondary" type="button">
            Continue with Google
          </button>
          <button className="button secondary" type="button">
            Continue with LinkedIn
          </button>
        </div>
        <p className="hint" style={{ marginTop: 16 }}>
          OAuth buttons are wired as stubs for v1 scaffolding; email/password runs locally now.
        </p>
      </form>
    </OnboardingFrame>
  );
}

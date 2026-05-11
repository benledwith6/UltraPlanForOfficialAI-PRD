import { waitlistAction } from "@/app/actions";
import { OnboardingFrame } from "@/components/OnboardingFrame";
import Link from "next/link";

export default async function WaitlistPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string; error?: string; joined?: string }>;
}) {
  const params = await searchParams;

  return (
    <OnboardingFrame
      eyebrow="Waitlist"
      title="We are focused on lawyers and real estate first."
      lede="Tell us where you fit and we will invite you when that profession-specific workflow is ready."
    >
      {params.joined ? (
        <div className="panel panel-pad" style={{ boxShadow: "none" }}>
          <h3>You are on the list.</h3>
          <p className="hint">Thanks. We will reach out when your profession opens.</p>
          <Link className="button" href="/">
            Back to Official AI
          </Link>
        </div>
      ) : (
        <form action={waitlistAction}>
          <label className="field">
            <span className="label">Email</span>
            <input className="input" name="email" type="email" defaultValue={params.email ?? ""} required />
          </label>
          <label className="field">
            <span className="label">Profession</span>
            <input className="input" name="profession" placeholder="e.g. financial advisor" required />
          </label>
          <label className="field">
            <span className="label">What would you want Official AI to create?</span>
            <textarea className="textarea" name="note" />
          </label>
          {params.error ? <p className="error">{params.error}</p> : null}
          <button className="button" type="submit">
            Join waitlist
          </button>
        </form>
      )}
    </OnboardingFrame>
  );
}

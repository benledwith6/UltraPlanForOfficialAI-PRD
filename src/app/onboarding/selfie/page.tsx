import { selfieUploadAction } from "@/app/actions";
import { requireCurrentUser } from "@/lib/onboarding";
import { OnboardingFrame } from "@/components/OnboardingFrame";
import { SelfieUploadField } from "@/components/SelfieUploadField";

export default async function SelfiePage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [user, params] = await Promise.all([requireCurrentUser(), searchParams]);
  const supportEscalated = user.onboardingAsset?.supportEscalated;

  return (
    <OnboardingFrame
      eyebrow="Screen 2"
      title="Upload a clear photo of your face."
      lede="This photo is only used to build your likeness pipeline. We hold ungenerated uploads for 7 days, then delete them."
      aside={
        <div>
          <h3>Selfie requirements</h3>
          <ul className="check-list">
            <li>One face only</li>
            <li>Centered and well lit</li>
            <li>At least 1080 x 1080</li>
            <li>No sunglasses or heavy filters</li>
            <li>Neutral expression or slight smile</li>
          </ul>
          <details className="modal-details">
            <summary>View good and bad examples</summary>
            <div className="photo-rules">
              <div className="rule-box">
                <strong>Good</strong>
                <p className="hint">Solo headshot, even lighting, face centered, plain background.</p>
              </div>
              <div className="rule-box">
                <strong>Retry</strong>
                <p className="hint">Group photos, sunglasses, side profile, dim rooms, cropped forehead.</p>
              </div>
            </div>
          </details>
        </div>
      }
    >
      <form action={selfieUploadAction}>
        <SelfieUploadField />
        {params.error ? <p className="error">{params.error}</p> : null}
        {supportEscalated ? (
          <div className="panel panel-pad" style={{ marginTop: 18, boxShadow: "none" }}>
            <h3>Want a human to review?</h3>
            <p className="hint">You have rejected the likeness gate three times. v1 will route this to a support queue.</p>
          </div>
        ) : null}
        <div className="actions" style={{ marginTop: 20 }}>
          <button className="button" type="submit">
            Build my AI character
          </button>
        </div>
      </form>
    </OnboardingFrame>
  );
}

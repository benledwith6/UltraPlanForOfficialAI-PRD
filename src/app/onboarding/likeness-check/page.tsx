import { confirmLikenessAction, rejectLikenessAction } from "@/app/actions";
import { requireCurrentUser } from "@/lib/onboarding";
import { OnboardingFrame } from "@/components/OnboardingFrame";

export default async function LikenessCheckPage() {
  const user = await requireCurrentUser();
  const images = Array.isArray(user.onboardingAsset?.gridImageUrls)
    ? (user.onboardingAsset?.gridImageUrls as string[])
    : [];

  return (
    <OnboardingFrame
      eyebrow="Screen 4"
      title="Does this look like you?"
      lede="Approve only if the grid feels recognizably like you. We never force you past this gate because a bad character sheet poisons every downstream video."
      aside={
        <div className="grid">
          <h3>Likeness attempts</h3>
          <p className="price">{user.onboardingAsset?.likenessAttempts ?? 0}</p>
          <p className="hint">After three rejections, v1 offers human-in-the-loop support.</p>
        </div>
      }
    >
      <div className="portrait-grid">
        {images.map((src, index) => (
          <div className="portrait-card" key={src}>
            <img src={src} alt={`Generated likeness option ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="actions" style={{ marginTop: 24 }}>
        <form action={confirmLikenessAction}>
          <button className="button" type="submit">
            Yes, this looks like me
          </button>
        </form>
        <form action={rejectLikenessAction}>
          <button className="button secondary" type="submit">
            Not quite right — try again
          </button>
        </form>
      </div>
    </OnboardingFrame>
  );
}

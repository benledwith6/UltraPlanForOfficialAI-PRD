import { completeCharacterGenerationAction } from "@/app/actions";
import { AutoRedirect } from "@/components/AutoRedirect";
import { OnboardingFrame } from "@/components/OnboardingFrame";

export default async function GeneratingCharacterPage() {
  await completeCharacterGenerationAction();

  return (
    <OnboardingFrame
      eyebrow="Screen 3"
      title="Building your AI character sheet..."
      lede="This is the part that makes your videos look like you. We are generating varied portraits across angles, expressions, and lighting."
      aside={
        <div className="grid">
          <h3>Recoverable by design</h3>
          <p className="hint">
            If a model call fails, the pipeline retries once silently. If it still fails, the user returns to selfie upload with a specific retry path.
          </p>
        </div>
      }
    >
      <div className="progress" aria-label="Generating character sheet">
        <span />
      </div>
      <p className="hint" style={{ marginTop: 18 }}>
        Local v0 uses deterministic placeholder portraits so the flow is testable without image model keys.
      </p>
      <AutoRedirect href="/onboarding/likeness-check" delayMs={2500} />
    </OnboardingFrame>
  );
}

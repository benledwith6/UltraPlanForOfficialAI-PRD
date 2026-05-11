import Link from "next/link";
import { regenerateCharacterSheetAction } from "@/app/actions";
import type { CharacterSheetAngle, CharacterSheetImageAsset } from "@/lib/character-sheets/types";
import { listCharacterSheetsForUser } from "@/lib/character-sheets/pipeline";
import { requireCurrentUser } from "@/lib/onboarding";

const ANGLE_LABELS: Record<CharacterSheetAngle, string> = {
  front: "Front",
  threeQuarterLeft: "3/4 left",
  profileLeft: "Profile left",
  back: "Back",
  profileRight: "Profile right",
  threeQuarterRight: "3/4 right"
};

function asImageAssets(value: unknown): CharacterSheetImageAsset[] {
  return Array.isArray(value) ? (value as CharacterSheetImageAsset[]) : [];
}

function asAngleAssets(value: unknown): Partial<Record<CharacterSheetAngle, CharacterSheetImageAsset>> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Partial<Record<CharacterSheetAngle, CharacterSheetImageAsset>>) : {};
}

export default async function CharacterSheetsPage() {
  const user = await requireCurrentUser();
  const sheets = await listCharacterSheetsForUser(user.id);
  const latest = sheets[0];
  const nextVersion = (latest?.version ?? 0) + 1;

  return (
    <main className="page">
      <section style={{ maxWidth: 780, marginBottom: 26 }}>
        <p className="eyebrow">Character sheets</p>
        <h2>Your immutable likeness versions.</h2>
        <p className="lede" style={{ fontSize: 18 }}>
          Each version is stored as signed object-storage assets. Later video jobs keep their original characterSheetId, so regenerated
          versions never change old outputs.
        </p>
        <div className="actions">
          <form action={regenerateCharacterSheetAction}>
            <button className="button" type="submit">
              Regenerate as v{nextVersion}
            </button>
          </form>
          <Link className="button secondary" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </section>

      <div className="grid">
        {sheets.length === 0 ? (
          <section className="panel panel-pad">
            <h3>No character sheet yet</h3>
            <p className="hint">Confirm your onboarding likeness grid first. We only burn the full character-sheet generation after that gate.</p>
            <Link className="button" href="/onboarding/selfie">
              Continue onboarding
            </Link>
          </section>
        ) : (
          sheets.map((sheet) => {
            const referenceImages = asImageAssets(sheet.referenceImageUrls);
            const angleImages = asAngleAssets(sheet.threeSixtyImageUrls);

            return (
              <article className="panel panel-pad" key={sheet.id}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <p className="eyebrow">Version {sheet.version}</p>
                    <h3>{sheet.status === "ready" ? "Ready for video conditioning" : `Status: ${sheet.status}`}</h3>
                    <p className="hint">
                      {referenceImages.length} reference images plus {Object.keys(angleImages).length} organized 360-degree views.
                    </p>
                  </div>
                  <span className="mini-stat">characterSheetId: {sheet.id}</span>
                </div>

                <div className="grid" style={{ marginTop: 22 }}>
                  <section>
                    <h3>360-degree sheet</h3>
                    <div className="portrait-grid six-up">
                      {(Object.keys(ANGLE_LABELS) as CharacterSheetAngle[]).map((angle) => {
                        const image = angleImages[angle];
                        return (
                          <div className="portrait-card" key={angle}>
                            {image ? <img src={image.signedUrl} alt={`v${sheet.version} ${ANGLE_LABELS[angle]} character view`} /> : null}
                            <p className="hint asset-label">{ANGLE_LABELS[angle]}</p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <h3>Reference image set</h3>
                    <div className="portrait-grid four-up">
                      {referenceImages.map((image, index) => (
                        <div className="portrait-card" key={image.objectKey}>
                          <img src={image.signedUrl} alt={`v${sheet.version} reference ${index + 1}: ${image.role}`} />
                          <p className="hint asset-label">{image.role}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}

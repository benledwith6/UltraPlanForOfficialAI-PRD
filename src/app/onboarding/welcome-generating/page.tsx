import { saveQuestionnaireAction } from "@/app/actions";
import { requireCurrentUser } from "@/lib/onboarding";
import { OnboardingFrame } from "@/components/OnboardingFrame";

export default async function WelcomeGeneratingPage() {
  const user = await requireCurrentUser();
  const isLawyer = user.profession === "lawyer";

  return (
    <OnboardingFrame
      eyebrow="Screen 5 and 5a"
      title="Producing your first AI video."
      lede="While the welcome video renders, tell us about your practice so templates, cadence, and compliance defaults start in the right place."
      aside={
        <div className="grid">
          <h3>Rendering welcome video</h3>
          <div className="progress">
            <span />
          </div>
          <p className="hint">Local v0 swaps in a placeholder reveal video after this questionnaire.</p>
        </div>
      }
    >
      <form action={saveQuestionnaireAction}>
        {isLawyer ? <LawyerFields /> : <RealtorFields />}
        <fieldset className="field" style={{ border: 0, padding: 0 }}>
          <span className="label">Preferred tone</span>
          <div className="choice-grid">
            <label className="choice">
              <input type="radio" name="tone" value="professional" defaultChecked />
              <strong>Professional</strong>
            </label>
            <label className="choice">
              <input type="radio" name="tone" value="approachable" />
              <strong>Approachable</strong>
            </label>
            <label className="choice">
              <input type="radio" name="tone" value="direct" />
              <strong>Direct</strong>
            </label>
          </div>
        </fieldset>
        <button className="button" type="submit">
          Continue to reveal
        </button>
      </form>
    </OnboardingFrame>
  );
}

function LawyerFields() {
  return (
    <>
      <div className="grid two-col">
        <label className="field">
          <span className="label">Practice area</span>
          <input className="input" name="practiceArea" placeholder="Family law, PI, estate planning..." required />
        </label>
        <label className="field">
          <span className="label">Firm size</span>
          <select className="select" name="firmSize" required>
            <option value="solo">Solo</option>
            <option value="2-10">2-10 attorneys</option>
            <option value="11-50">11-50 attorneys</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span className="label">State(s) of bar admission</span>
        <input className="input" name="barStates" placeholder="CA, NY..." required />
      </label>
      <GoalChoices goals={["new client acquisition", "referrals", "recruiting"]} />
    </>
  );
}

function RealtorFields() {
  return (
    <>
      <div className="grid two-col">
        <label className="field">
          <span className="label">Brokerage</span>
          <input className="input" name="brokerage" placeholder="Compass, eXp, KW..." required />
        </label>
        <label className="field">
          <span className="label">Market(s) you serve</span>
          <input className="input" name="markets" placeholder="Austin, West LA, Marin..." required />
        </label>
      </div>
      <GoalChoices goals={["listings", "buyer leads", "referrals", "recruiting"]} />
    </>
  );
}

function GoalChoices({ goals }: { goals: string[] }) {
  return (
    <fieldset className="field" style={{ border: 0, padding: 0 }}>
      <span className="label">Primary marketing goals</span>
      <div className="choice-grid">
        {goals.map((goal) => (
          <label className="choice" key={goal}>
            <input type="checkbox" name="goals" value={goal} />
            <strong>{goal}</strong>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

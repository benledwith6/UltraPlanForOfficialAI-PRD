import { deferPaywallAction } from "@/app/actions";
import { requireCurrentUser } from "@/lib/onboarding";

const tiers = [
  {
    name: "Starter",
    price: "$99",
    videos: "8 videos / month",
    channels: "LinkedIn + 1 other",
    details: ["All launch templates", "360 character sheet", "Guided cadence"]
  },
  {
    name: "Pro",
    price: "$199",
    videos: "20 videos / month",
    channels: "All supported channels",
    details: ["All templates", "Posting reminders", "Custom template assistance"],
    featured: true
  },
  {
    name: "Studio",
    price: "$399",
    videos: "60 videos / month",
    channels: "All supported channels",
    details: ["Priority render queue", "Concierge support", "Human review option"]
  }
];

export default async function PaywallPage() {
  await requireCurrentUser();

  return (
    <main className="page">
      <section style={{ maxWidth: 760, marginBottom: 28 }}>
        <p className="eyebrow">Screen 7</p>
        <h2>Pick your posting engine.</h2>
        <p className="lede" style={{ fontSize: 18 }}>
          Your welcome video proves the likeness loop. Paid tiers unlock template generation, calendar guidance, and posting workflows.
        </p>
      </section>
      <div className="grid three-col">
        {tiers.map((tier) => (
          <article className={`tier-card${tier.featured ? " featured" : ""}`} key={tier.name}>
            <h3>{tier.name}</h3>
            <div>
              <span className="price">{tier.price}</span>
              <span className="hint"> / month</span>
            </div>
            <p className="hint">Annual billing applies a 15% discount.</p>
            <strong>{tier.videos}</strong>
            <p className="hint">{tier.channels}</p>
            <ul className="check-list">
              {tier.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <button className="button" type="button">
              Start {tier.name}
            </button>
          </article>
        ))}
      </div>
      <form action={deferPaywallAction} style={{ marginTop: 24 }}>
        <button className="button ghost" type="submit">
          I&apos;ll decide later
        </button>
      </form>
    </main>
  );
}

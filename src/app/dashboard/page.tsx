import Link from "next/link";
import { requireCurrentUser } from "@/lib/onboarding";

export default async function DashboardPage() {
  const user = await requireCurrentUser();

  return (
    <main className="page">
      <section className="panel panel-pad">
        <p className="eyebrow">Dashboard</p>
        <h2>Welcome back, {user.email}.</h2>
        <p className="lede" style={{ fontSize: 18 }}>
          The full dashboard arrives across later build checkpoints. Onboarding now lands here for paid users.
        </p>
        <div className="actions">
          <Link className="button" href="/templates">
            Browse templates
          </Link>
          <Link className="button secondary" href="/calendar">
            Open calendar
          </Link>
        </div>
      </section>
    </main>
  );
}

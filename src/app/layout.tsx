import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Official AI",
  description: "AI marketing video for lawyers and real estate agents."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <Link className="brand" href="/">
              <span className="brand-mark">OA</span>
              <span>Official AI</span>
            </Link>
            <nav className="nav-links" aria-label="Primary">
              <a href="/templates">Templates</a>
              <a href="/calendar">Calendar</a>
              <a href="/admin">Admin</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

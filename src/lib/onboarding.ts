import { redirect } from "next/navigation";
import type { Profession, Tone } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export const sampleGridImages = [
  "/portraits/portrait-01.svg",
  "/portraits/portrait-02.svg",
  "/portraits/portrait-03.svg",
  "/portraits/portrait-04.svg",
  "/portraits/portrait-05.svg",
  "/portraits/portrait-06.svg",
  "/portraits/portrait-07.svg",
  "/portraits/portrait-08.svg",
  "/portraits/portrait-09.svg"
];

export const sampleWelcomeVideoUrl = "/welcome-video-placeholder.svg";

export async function requireCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/signup");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { onboardingAsset: true }
  });

  if (!user) redirect("/signup");
  return user;
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    include: { onboardingAsset: true }
  });
}

export function nextRouteForStep(step: string) {
  const routes: Record<string, string> = {
    signup: "/signup",
    selfie: "/onboarding/selfie",
    character_generating: "/onboarding/generating",
    likeness_check: "/onboarding/likeness-check",
    welcome_generating: "/onboarding/welcome-generating",
    welcome_reveal: "/onboarding/welcome-reveal",
    paywall: "/paywall",
    dashboard: "/dashboard",
    waitlist: "/waitlist"
  };

  return routes[step] ?? "/signup";
}

export async function advanceUser(userId: string, step: Parameters<typeof prisma.user.update>[0]["data"]["onboardingStep"]) {
  return prisma.user.update({
    where: { id: userId },
    data: { onboardingStep: step }
  });
}

export async function ensureOnboardingAsset(userId: string) {
  const retainedUntil = new Date();
  retainedUntil.setDate(retainedUntil.getDate() + 7);

  return prisma.onboardingAsset.upsert({
    where: { userId },
    update: {},
    create: { userId, retainedUntil }
  });
}

export function parseProfession(value: FormDataEntryValue | null): Profession | "other" | null {
  if (value === "lawyer" || value === "realtor" || value === "other") return value;
  return null;
}

export function parseTone(value: FormDataEntryValue | null): Tone {
  if (value === "approachable" || value === "direct") return value;
  return "professional";
}

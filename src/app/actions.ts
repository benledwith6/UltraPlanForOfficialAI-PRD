"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { setSessionUserId } from "@/lib/session";
import {
  advanceUser,
  ensureOnboardingAsset,
  parseProfession,
  parseTone,
  requireCurrentUser,
  sampleGridImages,
  sampleWelcomeVideoUrl
} from "@/lib/onboarding";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signupAction(formData: FormData) {
  const profession = parseProfession(formData.get("profession"));
  const email = emailSchema.safeParse(formString(formData, "email"));
  const password = passwordSchema.safeParse(formString(formData, "password"));

  if (profession === "other") {
    const query = email.success ? `?email=${encodeURIComponent(email.data)}` : "";
    redirect(`/waitlist${query}`);
  }

  if (!profession || !email.success || !password.success) {
    redirect("/signup?error=Please choose a supported profession and use a valid email and 8+ character password.");
  }

  const user = await prisma.user.upsert({
    where: { email: email.data },
    update: {
      profession,
      onboardingStep: "selfie",
      lastLoginAt: new Date()
    },
    create: {
      email: email.data,
      passwordHash: `stub:${password.data.length}`,
      profession,
      onboardingStep: "selfie",
      lastLoginAt: new Date()
    }
  });

  await ensureOnboardingAsset(user.id);
  await setSessionUserId(user.id);
  redirect("/onboarding/selfie");
}

export async function waitlistAction(formData: FormData) {
  const email = emailSchema.safeParse(formString(formData, "email"));
  const profession = formString(formData, "profession") || "other";
  const note = formString(formData, "note");

  if (!email.success) {
    redirect("/waitlist?error=Use a valid email so we can invite you when your profession opens.");
  }

  await prisma.waitlistEntry.create({
    data: { email: email.data, profession, note }
  });

  redirect("/waitlist?joined=1");
}

export async function selfieUploadAction(formData: FormData) {
  const user = await requireCurrentUser();
  const file = formData.get("selfie");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/onboarding/selfie?error=Choose a clear solo face photo before continuing.");
  }

  if (!file.type.startsWith("image/")) {
    redirect("/onboarding/selfie?error=That file is not an image. Please upload a JPG, PNG, or HEIC selfie.");
  }

  if (file.size > 12 * 1024 * 1024) {
    redirect("/onboarding/selfie?error=That photo is too large. Please use an image under 12 MB.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const selfieDataUrl = `data:${file.type};base64,${bytes.toString("base64")}`;
  const retainedUntil = new Date();
  retainedUntil.setDate(retainedUntil.getDate() + 7);

  await prisma.onboardingAsset.update({
    where: { userId: user.id },
    data: {
      selfieName: file.name,
      selfieDataUrl,
      selfieValidatedAt: new Date(),
      retainedUntil
    }
  });
  await advanceUser(user.id, "character_generating");
  redirect("/onboarding/generating");
}

export async function completeCharacterGenerationAction() {
  const user = await requireCurrentUser();
  const asset = await ensureOnboardingAsset(user.id);

  if (!asset.selfieDataUrl) {
    redirect("/onboarding/selfie?error=Upload a selfie first so we do not burn a generation.");
  }

  await prisma.onboardingAsset.update({
    where: { userId: user.id },
    data: { gridImageUrls: sampleGridImages }
  });
  await advanceUser(user.id, "likeness_check");
}

export async function confirmLikenessAction() {
  const user = await requireCurrentUser();
  const asset = await ensureOnboardingAsset(user.id);

  if (!asset.gridImageUrls) {
    redirect("/onboarding/generating");
  }

  await prisma.characterSheet.upsert({
    where: {
      userId_version: {
        userId: user.id,
        version: 1
      }
    },
    update: {
      status: "ready",
      referenceImageUrls: sampleGridImages,
      threeSixtyImageUrls: {
        front: sampleGridImages[0],
        threeQuarterLeft: sampleGridImages[1],
        profileLeft: sampleGridImages[2],
        back: sampleGridImages[3],
        profileRight: sampleGridImages[4],
        threeQuarterRight: sampleGridImages[5]
      }
    },
    create: {
      userId: user.id,
      version: 1,
      sourceSelfieUrl: asset.selfieDataUrl ?? "/selfie-placeholder.svg",
      referenceImageUrls: sampleGridImages,
      threeSixtyImageUrls: {
        front: sampleGridImages[0],
        threeQuarterLeft: sampleGridImages[1],
        profileLeft: sampleGridImages[2],
        back: sampleGridImages[3],
        profileRight: sampleGridImages[4],
        threeQuarterRight: sampleGridImages[5]
      },
      status: "ready"
    }
  });

  await advanceUser(user.id, "welcome_generating");
  redirect("/onboarding/welcome-generating");
}

export async function rejectLikenessAction() {
  const user = await requireCurrentUser();
  const asset = await ensureOnboardingAsset(user.id);
  const attempts = asset.likenessAttempts + 1;

  await prisma.onboardingAsset.update({
    where: { userId: user.id },
    data: {
      likenessAttempts: attempts,
      gridImageUrls: Prisma.JsonNull,
      supportEscalated: attempts >= 3
    }
  });
  await advanceUser(user.id, "selfie");

  const message =
    attempts >= 3
      ? "We can bring in a human review before you try again."
      : "No problem. Try another clear solo photo and we will rebuild the grid.";

  redirect(`/onboarding/selfie?error=${encodeURIComponent(message)}`);
}

export async function saveQuestionnaireAction(formData: FormData) {
  const user = await requireCurrentUser();
  const tone = parseTone(formData.get("tone"));

  const lawyerMeta = {
    practiceArea: formString(formData, "practiceArea"),
    firmSize: formString(formData, "firmSize"),
    barStates: formString(formData, "barStates"),
    goals: formData.getAll("goals").map(String)
  };

  const realtorMeta = {
    brokerage: formString(formData, "brokerage"),
    markets: formString(formData, "markets"),
    goals: formData.getAll("goals").map(String)
  };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      tone,
      professionMeta: user.profession === "lawyer" ? lawyerMeta : realtorMeta
    }
  });

  await completeWelcomeVideoAction();
  redirect("/onboarding/welcome-reveal");
}

export async function completeWelcomeVideoAction() {
  const user = await requireCurrentUser();

  await prisma.onboardingAsset.update({
    where: { userId: user.id },
    data: {
      welcomeVideoReady: true,
      welcomeVideoUrl: sampleWelcomeVideoUrl
    }
  });
  await advanceUser(user.id, "welcome_reveal");
}

export async function startPostingAction() {
  const user = await requireCurrentUser();
  await advanceUser(user.id, "paywall");
  redirect("/paywall");
}

export async function deferPaywallAction() {
  const user = await requireCurrentUser();
  await advanceUser(user.id, "dashboard");
  redirect("/dashboard/free");
}

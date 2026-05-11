import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createCharacterSheetVersionForUser, refreshCharacterSheetSignedUrls } from "@/lib/character-sheets/pipeline";

const email = `pipeline-test-${Date.now()}@example.com`;
const templateId = "pipeline-test-template";
const selfieDataUrl = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><rect width="1200" height="1200" fill="white"/></svg>'
).toString("base64")}`;

describe("character sheet pipeline", () => {
  beforeAll(async () => {
    process.env.CHARACTER_SHEET_REFERENCE_COUNT = "12";
    process.env.OBJECT_STORAGE_PUBLIC_BASE_URL = "http://127.0.0.1:3000";

    await prisma.template.upsert({
      where: { id: templateId },
      update: {},
      create: {
        id: templateId,
        name: "Pipeline test template",
        description: "Used by the unit test to prove video jobs pin a character sheet version.",
        profession: "universal",
        inputsSchema: {},
        scriptPromptTemplate: "Say hello",
        videoPromptTemplate: "Render hello",
        defaultDurationSec: 15,
        aspectRatio: "9:16",
        complianceRules: [],
        cta: "Save",
        isPublished: false
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.template.deleteMany({ where: { id: templateId } });
    await prisma.$disconnect();
  });

  it("creates immutable versions and keeps video jobs pinned to the original version", async () => {
    const user = await prisma.user.create({
      data: {
        email,
        profession: "lawyer",
        onboardingStep: "dashboard"
      }
    });

    const v1 = await createCharacterSheetVersionForUser({ userId: user.id, sourceSelfieDataUrl: selfieDataUrl, version: 1 });
    const v1References = v1.referenceImageUrls;

    const videoJob = await prisma.videoJob.create({
      data: {
        userId: user.id,
        templateId,
        characterSheetId: v1.id,
        userInputs: {},
        generatedScript: "Welcome to Official AI.",
        status: "ready"
      }
    });

    const v2 = await createCharacterSheetVersionForUser({ userId: user.id, sourceSelfieDataUrl: selfieDataUrl });
    const pinnedJob = await prisma.videoJob.findUniqueOrThrow({ where: { id: videoJob.id } });
    const preservedV1 = await prisma.characterSheet.findUniqueOrThrow({ where: { id: v1.id } });

    expect(v1.version).toBe(1);
    expect(v2.version).toBe(2);
    expect(pinnedJob.characterSheetId).toBe(v1.id);
    expect(preservedV1.referenceImageUrls).toEqual(v1References);
    expect(Array.isArray(v2.referenceImageUrls)).toBe(true);
    expect((v2.referenceImageUrls as unknown[]).length).toBe(12);
  });

  it("refreshes signed URLs without changing stored object keys", async () => {
    const sheet = await prisma.characterSheet.findFirstOrThrow({
      where: { user: { email }, version: 1 }
    });
    const refreshed = await refreshCharacterSheetSignedUrls(sheet);
    const image = (refreshed.referenceImageUrls as { objectKey: string; signedUrl: string }[])[0];

    expect(image.objectKey).toContain("/character-sheets/v1/references/");
    expect(image.signedUrl).toContain("/api/object-storage/");
    expect(image.signedUrl).toContain("signature=");
  });
});

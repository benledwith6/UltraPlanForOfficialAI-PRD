import { CharacterSheetStatus } from "@prisma/client";
import { getCharacterSheetAdapter } from "@/lib/character-sheets/adapters";
import type { CharacterSheetAngle, CharacterSheetImageAsset } from "@/lib/character-sheets/types";
import { getCharacterSheetRuntimeConfig } from "@/lib/config/feature-flags";
import { prisma } from "@/lib/prisma";
import { createSignedObjectUrl, putObject } from "@/lib/storage/object-storage";

const DATA_URL_PATTERN = /^data:(?<contentType>[^;]+);base64,(?<data>.+)$/;

function parseDataUrl(dataUrl: string) {
  const match = DATA_URL_PATTERN.exec(dataUrl);
  if (!match?.groups) return null;
  return {
    contentType: match.groups.contentType,
    body: Buffer.from(match.groups.data, "base64")
  };
}

function safeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

async function nextVersionForUser(userId: string) {
  const latest = await prisma.characterSheet.findFirst({
    where: { userId },
    orderBy: { version: "desc" },
    select: { version: true }
  });
  return (latest?.version ?? 0) + 1;
}

async function storeSourceSelfie(userId: string, version: number, sourceSelfieDataUrl: string, signedUrlTtlSeconds: number) {
  const parsed = parseDataUrl(sourceSelfieDataUrl);
  const body = parsed?.body ?? Buffer.from(sourceSelfieDataUrl);
  const contentType = parsed?.contentType ?? "text/plain";

  return putObject(
    {
      key: `users/${safeSegment(userId)}/character-sheets/v${version}/source-selfie`,
      body,
      contentType,
      metadata: {
        kind: "confirmed-selfie",
        userId,
        version: String(version)
      }
    },
    signedUrlTtlSeconds
  );
}

function refreshAssetSignedUrl(asset: CharacterSheetImageAsset, ttlSeconds: number): CharacterSheetImageAsset {
  return {
    ...asset,
    signedUrl: createSignedObjectUrl(asset.objectKey, ttlSeconds)
  };
}

export async function refreshCharacterSheetSignedUrls<T extends { referenceImageUrls: unknown; threeSixtyImageUrls: unknown }>(
  sheet: T
) {
  const config = await getCharacterSheetRuntimeConfig();
  const referenceImageUrls = Array.isArray(sheet.referenceImageUrls)
    ? (sheet.referenceImageUrls as CharacterSheetImageAsset[]).map((asset) => refreshAssetSignedUrl(asset, config.signedUrlTtlSeconds))
    : [];
  const threeSixtyImageUrls =
    sheet.threeSixtyImageUrls && typeof sheet.threeSixtyImageUrls === "object" && !Array.isArray(sheet.threeSixtyImageUrls)
      ? Object.fromEntries(
          Object.entries(sheet.threeSixtyImageUrls as Record<string, CharacterSheetImageAsset>).map(([angle, asset]) => [
            angle,
            refreshAssetSignedUrl(asset, config.signedUrlTtlSeconds)
          ])
        )
      : {};

  return {
    ...sheet,
    referenceImageUrls,
    threeSixtyImageUrls
  };
}

export async function getLatestReadyCharacterSheetForUser(userId: string) {
  const sheet = await prisma.characterSheet.findFirst({
    where: { userId, status: "ready" },
    orderBy: { version: "desc" }
  });

  return sheet ? refreshCharacterSheetSignedUrls(sheet) : null;
}

export async function listCharacterSheetsForUser(userId: string) {
  const sheets = await prisma.characterSheet.findMany({
    where: { userId },
    orderBy: { version: "desc" }
  });

  return Promise.all(sheets.map((sheet) => refreshCharacterSheetSignedUrls(sheet)));
}

export async function createCharacterSheetVersionForUser({
  userId,
  sourceSelfieDataUrl,
  version
}: {
  userId: string;
  sourceSelfieDataUrl: string;
  version?: number;
}) {
  const config = await getCharacterSheetRuntimeConfig();
  const targetVersion = version ?? (await nextVersionForUser(userId));
  const sourceSelfie = await storeSourceSelfie(userId, targetVersion, sourceSelfieDataUrl, config.signedUrlTtlSeconds);
  const adapter = getCharacterSheetAdapter(config.adapterId);

  const sheet = await prisma.characterSheet.create({
    data: {
      userId,
      version: targetVersion,
      sourceSelfieUrl: sourceSelfie.signedUrl,
      referenceImageUrls: [],
      threeSixtyImageUrls: {},
      status: CharacterSheetStatus.generating
    }
  });

  try {
    const generated = await adapter.generate({
      userId,
      version: targetVersion,
      sourceSelfieObjectKey: sourceSelfie.key,
      sourceSelfieSignedUrl: sourceSelfie.signedUrl,
      referenceImageCount: config.referenceImageCount
    });

    const referenceImageUrls: CharacterSheetImageAsset[] = [];
    for (const [index, image] of generated.referenceImages.entries()) {
      const stored = await putObject(
        {
          key: `users/${safeSegment(userId)}/character-sheets/v${targetVersion}/references/${String(index + 1).padStart(2, "0")}.svg`,
          body: image.body,
          contentType: image.contentType,
          metadata: {
            kind: "character-reference",
            role: image.role,
            modelId: generated.modelId
          }
        },
        config.signedUrlTtlSeconds
      );
      referenceImageUrls.push({
        objectKey: stored.key,
        storageUrl: stored.storageUrl,
        signedUrl: stored.signedUrl,
        checksum: stored.checksum,
        role: image.role,
        modelId: generated.modelId,
        prompt: image.prompt
      });
    }

    const threeSixtyImageUrls = Object.fromEntries(
      await Promise.all(
        (Object.entries(generated.threeSixtyImages) as [CharacterSheetAngle, (typeof generated.threeSixtyImages)[CharacterSheetAngle]][]).map(
          async ([angle, image]) => {
            const stored = await putObject(
              {
                key: `users/${safeSegment(userId)}/character-sheets/v${targetVersion}/360/${angle}.svg`,
                body: image.body,
                contentType: image.contentType,
                metadata: {
                  kind: "character-360",
                  angle,
                  modelId: generated.modelId
                }
              },
              config.signedUrlTtlSeconds
            );
            return [
              angle,
              {
                objectKey: stored.key,
                storageUrl: stored.storageUrl,
                signedUrl: stored.signedUrl,
                checksum: stored.checksum,
                role: image.role,
                modelId: generated.modelId,
                prompt: image.prompt
              }
            ];
          }
        )
      )
    ) as Record<CharacterSheetAngle, CharacterSheetImageAsset>;

    return prisma.characterSheet.update({
      where: { id: sheet.id },
      data: {
        status: CharacterSheetStatus.ready,
        referenceImageUrls,
        threeSixtyImageUrls
      }
    });
  } catch (error) {
    await prisma.characterSheet.update({
      where: { id: sheet.id },
      data: {
        status: CharacterSheetStatus.failed
      }
    });
    throw error;
  }
}

export async function ensureInitialCharacterSheetForUser(userId: string, sourceSelfieDataUrl: string) {
  const existing = await prisma.characterSheet.findUnique({
    where: {
      userId_version: {
        userId,
        version: 1
      }
    }
  });

  if (existing) return existing;
  return createCharacterSheetVersionForUser({ userId, sourceSelfieDataUrl, version: 1 });
}

import { prisma } from "@/lib/prisma";

type JsonRecord = Record<string, unknown>;

function parseEnvBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

function parseEnvInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getFeatureFlagValue<T>(key: string, fallback: T): Promise<T> {
  const flag = await prisma.featureFlag.findUnique({ where: { key } });
  return flag?.value === undefined || flag.value === null ? fallback : (flag.value as T);
}

export type CharacterSheetRuntimeConfig = {
  adapterId: string;
  referenceImageCount: number;
  signedUrlTtlSeconds: number;
  retentionOnCancellationDays: number;
  sourceSelfieRetentionDays: number;
  useHostedImageModel: boolean;
};

export async function getCharacterSheetRuntimeConfig(): Promise<CharacterSheetRuntimeConfig> {
  const envFallback: JsonRecord = {
    adapterId: process.env.CHARACTER_SHEET_ADAPTER ?? "stub-image-model",
    referenceImageCount: Math.min(24, Math.max(12, parseEnvInteger(process.env.CHARACTER_SHEET_REFERENCE_COUNT, 16))),
    signedUrlTtlSeconds: parseEnvInteger(process.env.OBJECT_STORAGE_SIGNED_URL_TTL_SECONDS, 3600),
    retentionOnCancellationDays: parseEnvInteger(process.env.CHARACTER_SHEET_CANCELLATION_RETENTION_DAYS, 30),
    sourceSelfieRetentionDays: parseEnvInteger(process.env.CHARACTER_SHEET_SOURCE_SELFIE_RETENTION_DAYS, 7),
    useHostedImageModel: parseEnvBoolean(process.env.CHARACTER_SHEET_USE_HOSTED_IMAGE_MODEL, false)
  };

  const raw = await getFeatureFlagValue<JsonRecord>("character_sheet_pipeline", envFallback);

  return {
    adapterId: typeof raw.adapterId === "string" ? raw.adapterId : (envFallback.adapterId as string),
    referenceImageCount: Math.min(
      24,
      Math.max(12, typeof raw.referenceImageCount === "number" ? raw.referenceImageCount : (envFallback.referenceImageCount as number))
    ),
    signedUrlTtlSeconds:
      typeof raw.signedUrlTtlSeconds === "number" ? raw.signedUrlTtlSeconds : (envFallback.signedUrlTtlSeconds as number),
    retentionOnCancellationDays:
      typeof raw.retentionOnCancellationDays === "number"
        ? raw.retentionOnCancellationDays
        : (envFallback.retentionOnCancellationDays as number),
    sourceSelfieRetentionDays:
      typeof raw.sourceSelfieRetentionDays === "number"
        ? raw.sourceSelfieRetentionDays
        : (envFallback.sourceSelfieRetentionDays as number),
    useHostedImageModel:
      typeof raw.useHostedImageModel === "boolean" ? raw.useHostedImageModel : (envFallback.useHostedImageModel as boolean)
  };
}

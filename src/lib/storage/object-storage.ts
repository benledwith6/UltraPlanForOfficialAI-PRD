import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

type PutObjectInput = {
  key: string;
  body: Buffer | string;
  contentType: string;
  metadata?: Record<string, string>;
};

export type StoredObject = {
  key: string;
  storageUrl: string;
  signedUrl: string;
  checksum: string;
};

export type StoredObjectPayload = {
  body: Buffer;
  contentType: string;
  metadata: Record<string, string>;
};

const DEFAULT_BUCKET = "official-ai-local-media";

function storageRoot() {
  return process.env.OBJECT_STORAGE_LOCAL_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), ".official-ai-storage");
}

function bucketName() {
  return process.env.OBJECT_STORAGE_BUCKET ?? DEFAULT_BUCKET;
}

function signingSecret() {
  return process.env.OBJECT_STORAGE_SIGNING_SECRET ?? "official-ai-local-signing-secret";
}

function publicBaseUrl() {
  return (process.env.OBJECT_STORAGE_PUBLIC_BASE_URL ?? process.env.APP_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
}

function normalizedObjectPath(key: string) {
  const normalized = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = path.join(storageRoot(), normalized);
  if (!fullPath.startsWith(storageRoot())) {
    throw new Error("Invalid object key");
  }
  return fullPath;
}

function sign(key: string, expires: number) {
  return crypto.createHmac("sha256", signingSecret()).update(`${key}:${expires}`).digest("hex");
}

export function createSignedObjectUrl(key: string, expiresInSeconds = 3600) {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const encodedKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${publicBaseUrl()}/api/object-storage/${encodedKey}?expires=${expires}&signature=${sign(key, expires)}`;
}

export function verifySignedObjectUrl(key: string, expires: string | null, signature: string | null) {
  if (!expires || !signature) return false;
  const expiresAt = Number.parseInt(expires, 10);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(key, expiresAt);
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function putObject(input: PutObjectInput, expiresInSeconds = 3600): Promise<StoredObject> {
  const objectPath = normalizedObjectPath(input.key);
  await fs.mkdir(path.dirname(objectPath), { recursive: true });

  const body = Buffer.isBuffer(input.body) ? input.body : Buffer.from(input.body);
  await fs.writeFile(objectPath, body);
  await fs.writeFile(
    `${objectPath}.metadata.json`,
    JSON.stringify(
      {
        contentType: input.contentType,
        metadata: input.metadata ?? {}
      },
      null,
      2
    )
  );

  return {
    key: input.key,
    storageUrl: `s3://${bucketName()}/${input.key}`,
    signedUrl: createSignedObjectUrl(input.key, expiresInSeconds),
    checksum: crypto.createHash("sha256").update(body).digest("hex")
  };
}

export async function readObject(key: string): Promise<StoredObjectPayload | null> {
  const objectPath = normalizedObjectPath(key);
  try {
    const [body, metadataJson] = await Promise.all([fs.readFile(objectPath), fs.readFile(`${objectPath}.metadata.json`, "utf8")]);
    const metadata = JSON.parse(metadataJson) as { contentType?: string; metadata?: Record<string, string> };
    return {
      body,
      contentType: metadata.contentType ?? "application/octet-stream",
      metadata: metadata.metadata ?? {}
    };
  } catch {
    return null;
  }
}

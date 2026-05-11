import { readObject, verifySignedObjectUrl } from "@/lib/storage/object-storage";

export async function GET(request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");
  const url = new URL(request.url);

  if (!verifySignedObjectUrl(key, url.searchParams.get("expires"), url.searchParams.get("signature"))) {
    return new Response("Invalid or expired signed URL", { status: 403 });
  }

  const object = await readObject(key);
  if (!object) {
    return new Response("Object not found", { status: 404 });
  }

  return new Response(new Uint8Array(object.body), {
    headers: {
      "Cache-Control": "private, max-age=300",
      "Content-Type": object.contentType,
      "X-Official-AI-Object-Key": key
    }
  });
}

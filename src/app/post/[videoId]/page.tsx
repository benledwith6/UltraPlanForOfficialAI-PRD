import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function PostComposerPage({
  params
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  return (
    <PlaceholderPage
      eyebrow="Posting"
      title={`Post composer for ${videoId}`}
      description="Build item 6 will ship the Option B deep-link reminder path first, with per-platform API decisions behind config."
    />
  );
}

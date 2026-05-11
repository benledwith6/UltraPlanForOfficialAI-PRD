import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function VideoRevealPage({
  params
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  return (
    <PlaceholderPage
      eyebrow="Video library"
      title={`Video ${videoId}`}
      description="Completed video reveal will add playback, download, schedule, post now, save draft, and regenerate actions."
    />
  );
}

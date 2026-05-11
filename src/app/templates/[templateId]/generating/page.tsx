import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function TemplateGeneratingPage({
  params
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  return (
    <PlaceholderPage
      eyebrow="Video generation"
      title={`Generating ${templateId}`}
      description="Build item 2 will introduce the swappable VideoModelAdapter shape before template rendering is completed."
    />
  );
}

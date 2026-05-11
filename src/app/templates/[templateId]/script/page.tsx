import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function TemplateScriptPage({
  params
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  return (
    <PlaceholderPage
      eyebrow="Script review"
      title={`Script draft for ${templateId}`}
      description="Every render will require user script review before the video model adapter runs."
    />
  );
}

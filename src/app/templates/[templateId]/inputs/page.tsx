import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function TemplateInputsPage({
  params
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  return (
    <PlaceholderPage
      eyebrow="Template inputs"
      title={`Inputs for ${templateId}`}
      description="The lawyer legal concept explainer becomes the first complete template flow in build item 3."
    />
  );
}

import type {
  CharacterSheetAngle,
  CharacterSheetGeneratedImage,
  CharacterSheetGenerationInput,
  CharacterSheetGenerationResult,
  CharacterSheetModelAdapter
} from "@/lib/character-sheets/types";

const REFERENCE_ROLES = [
  "neutral studio portrait",
  "soft smile portrait",
  "direct-to-camera portrait",
  "three-quarter portrait",
  "left profile portrait",
  "right profile portrait",
  "warm indoor lighting",
  "cool office lighting",
  "outdoor shade lighting",
  "confident speaking expression",
  "listening expression",
  "subtle laugh expression",
  "serious professional expression",
  "head turn left",
  "head turn right",
  "shoulders-up portrait",
  "mid-shot portrait",
  "high-key portrait",
  "low-key portrait",
  "neutral background portrait",
  "professional jacket portrait",
  "open-collar portrait",
  "camera-height portrait",
  "slight low-angle portrait"
];

const ANGLE_LABELS: Record<CharacterSheetAngle, string> = {
  front: "front view",
  threeQuarterLeft: "3/4 left view",
  profileLeft: "left profile view",
  back: "back view",
  profileRight: "right profile view",
  threeQuarterRight: "3/4 right view"
};

function colorFor(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return {
    bg: `hsl(${hash} 34% 90%)`,
    jacket: `hsl(${(hash + 172) % 360} 34% 34%)`,
    accent: `hsl(${(hash + 44) % 360} 45% 46%)`
  };
}

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function renderStubPortrait(seed: string, label: string) {
  const colors = colorFor(seed);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img" aria-label="${escapeXml(label)}">
  <rect width="1200" height="1200" fill="${colors.bg}"/>
  <rect x="140" y="150" width="920" height="900" rx="48" fill="rgba(255,255,255,0.56)" stroke="${colors.accent}" stroke-width="10"/>
  <path d="M310 1000c42-220 170-334 290-334s248 114 290 334H310z" fill="${colors.jacket}"/>
  <ellipse cx="600" cy="502" rx="184" ry="226" fill="#b88665"/>
  <path d="M420 474c26-122 100-198 180-198s154 76 180 198c-44-44-103-68-180-68s-136 24-180 68z" fill="#5f3f31"/>
  <circle cx="532" cy="512" r="22" fill="#26221f"/>
  <circle cx="668" cy="512" r="22" fill="#26221f"/>
  <path d="M548 620c38 34 72 34 110 0" fill="none" stroke="#513126" stroke-width="15" stroke-linecap="round"/>
  <rect x="215" y="88" width="770" height="72" rx="24" fill="${colors.accent}"/>
  <text x="600" y="136" fill="white" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle">${escapeXml(label)}</text>
  <text x="600" y="1116" fill="#28231f" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700" text-anchor="middle">Official AI local image-model stub</text>
</svg>`;
}

function createImage(seed: string, role: string, prompt: string): CharacterSheetGeneratedImage {
  return {
    role,
    prompt,
    contentType: "image/svg+xml",
    body: Buffer.from(renderStubPortrait(seed, role))
  };
}

class StubCharacterSheetAdapter implements CharacterSheetModelAdapter {
  id = "stub-image-model";

  async generate(input: CharacterSheetGenerationInput): Promise<CharacterSheetGenerationResult> {
    const referenceImages = REFERENCE_ROLES.slice(0, input.referenceImageCount).map((role, index) =>
      createImage(
        `${input.userId}:${input.version}:reference:${index}`,
        role,
        `Generate an on-likeness ${role} from confirmed selfie ${input.sourceSelfieObjectKey}`
      )
    );

    const threeSixtyImages = Object.fromEntries(
      (Object.entries(ANGLE_LABELS) as [CharacterSheetAngle, string][]).map(([angle, label]) => [
        angle,
        createImage(
          `${input.userId}:${input.version}:360:${angle}`,
          label,
          `Generate a consistent neutral-background ${label} from confirmed selfie ${input.sourceSelfieObjectKey}`
        )
      ])
    ) as Record<CharacterSheetAngle, CharacterSheetGeneratedImage>;

    return {
      modelId: this.id,
      referenceImages,
      threeSixtyImages
    };
  }
}

const adapters: Record<string, CharacterSheetModelAdapter> = {
  "stub-image-model": new StubCharacterSheetAdapter()
};

export function getCharacterSheetAdapter(adapterId: string) {
  return adapters[adapterId] ?? adapters["stub-image-model"];
}

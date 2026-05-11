export type CharacterSheetAngle = "front" | "threeQuarterLeft" | "profileLeft" | "back" | "profileRight" | "threeQuarterRight";

export type CharacterSheetImageAsset = {
  role: string;
  objectKey: string;
  storageUrl: string;
  signedUrl: string;
  checksum: string;
  modelId: string;
  prompt: string;
};

export type CharacterSheetGenerationInput = {
  userId: string;
  version: number;
  sourceSelfieObjectKey: string;
  sourceSelfieSignedUrl: string;
  referenceImageCount: number;
};

export type CharacterSheetGeneratedImage = {
  role: string;
  prompt: string;
  contentType: string;
  body: Buffer;
};

export type CharacterSheetGenerationResult = {
  modelId: string;
  referenceImages: CharacterSheetGeneratedImage[];
  threeSixtyImages: Record<CharacterSheetAngle, CharacterSheetGeneratedImage>;
};

export interface CharacterSheetModelAdapter {
  id: string;
  generate(input: CharacterSheetGenerationInput): Promise<CharacterSheetGenerationResult>;
}

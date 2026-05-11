-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "oauthProvider" TEXT,
    "oauthSubject" TEXT,
    "profession" TEXT,
    "professionMeta" JSONB,
    "tone" TEXT NOT NULL DEFAULT 'professional',
    "tier" TEXT NOT NULL DEFAULT 'free',
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" TEXT NOT NULL DEFAULT 'signup',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" DATETIME
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OnboardingAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "selfieName" TEXT,
    "selfieDataUrl" TEXT,
    "selfieValidatedAt" DATETIME,
    "likenessAttempts" INTEGER NOT NULL DEFAULT 0,
    "gridImageUrls" JSONB,
    "welcomeVideoUrl" TEXT,
    "welcomeVideoReady" BOOLEAN NOT NULL DEFAULT false,
    "supportEscalated" BOOLEAN NOT NULL DEFAULT false,
    "retainedUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OnboardingAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharacterSheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "sourceSelfieUrl" TEXT NOT NULL,
    "referenceImageUrls" JSONB NOT NULL,
    "threeSixtyImageUrls" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'generating',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CharacterSheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "profession" TEXT NOT NULL,
    "inputsSchema" JSONB NOT NULL,
    "scriptPromptTemplate" TEXT NOT NULL,
    "videoPromptTemplate" TEXT NOT NULL,
    "defaultDurationSec" INTEGER NOT NULL,
    "aspectRatio" TEXT NOT NULL,
    "complianceRules" JSONB NOT NULL,
    "cta" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VideoJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "characterSheetId" TEXT,
    "userInputs" JSONB NOT NULL,
    "generatedScript" TEXT,
    "videoModelId" TEXT,
    "videoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "errorMessage" TEXT,
    "costCents" INTEGER,
    "renderTimeSeconds" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "VideoJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VideoJob_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VideoJob_characterSheetId_fkey" FOREIGN KEY ("characterSheetId") REFERENCES "CharacterSheet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalendarEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "videoJobId" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "channels" JSONB NOT NULL,
    "caption" TEXT NOT NULL,
    "hashtags" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" DATETIME,
    CONSTRAINT "CalendarEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CalendarEntry_videoJobId_fkey" FOREIGN KEY ("videoJobId") REFERENCES "VideoJob" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "calendarEntryId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "externalPostId" TEXT,
    "externalUrl" TEXT,
    "publishedAt" DATETIME,
    "engagementSnapshot" JSONB,
    CONSTRAINT "Post_calendarEntryId_fkey" FOREIGN KEY ("calendarEntryId") REFERENCES "CalendarEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModelEvaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "videoModelId" TEXT NOT NULL,
    "evaluatorUserId" TEXT NOT NULL,
    "videoJobId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ModelEvaluation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ModelEvaluation_evaluatorUserId_fkey" FOREIGN KEY ("evaluatorUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ModelEvaluation_videoJobId_fkey" FOREIGN KEY ("videoJobId") REFERENCES "VideoJob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'stripe',
    "providerSubscriptionId" TEXT,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" DATETIME,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingAsset_userId_key" ON "OnboardingAsset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterSheet_userId_version_key" ON "CharacterSheet"("userId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEntry_videoJobId_key" ON "CalendarEntry"("videoJobId");

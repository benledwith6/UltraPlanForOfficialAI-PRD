# Official AI Local Setup

## Run Locally

```bash
npm install
cp .env.example .env
npm run db:migrate -- --name init
npm run dev
```

Open `http://localhost:3000`.

## Required Environment Variables

Local v0 runs with placeholder keys. Real integrations should replace these before production.

### App

- `DATABASE_URL`
- `APP_BASE_URL`
- `STRICT_SELFIE_VALIDATION`
- `CHARACTER_GRID_DELAY_MS`
- `WELCOME_VIDEO_DELAY_MS`

### Character Sheet Pipeline

- `CHARACTER_SHEET_ADAPTER` — defaults to `stub-image-model`; swap this when a hosted image provider is wired in.
- `CHARACTER_SHEET_REFERENCE_COUNT` — 12-24 generated references per immutable version.
- `CHARACTER_SHEET_USE_HOSTED_IMAGE_MODEL` — feature-flag-shaped switch for hosted generation; local v0 keeps this `false`.
- `CHARACTER_SHEET_CANCELLATION_RETENTION_DAYS` — defaults to the PRD recommendation of 30-day soft retention.
- `CHARACTER_SHEET_SOURCE_SELFIE_RETENTION_DAYS` — defaults to 7 days for abandoned onboarding selfies.
- `OBJECT_STORAGE_BUCKET`
- `OBJECT_STORAGE_PUBLIC_BASE_URL`
- `OBJECT_STORAGE_SIGNED_URL_TTL_SECONDS`
- `OBJECT_STORAGE_SIGNING_SECRET`
- `OBJECT_STORAGE_LOCAL_DIR`

The `character_sheet_pipeline` feature flag can override adapter, reference count, signed URL TTL, hosted-model usage, and retention values without a code deploy.

### Payments

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER_MONTHLY`
- `STRIPE_PRICE_PRO_MONTHLY`
- `STRIPE_PRICE_STUDIO_MONTHLY`

### Video Model Providers

- `SORA_API_KEY`
- `VEO_API_KEY`
- `HEDRA_API_KEY`
- `RUNWAY_API_KEY`
- `KLING_API_KEY`

### Social Platforms

- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `INSTAGRAM_CLIENT_ID`
- `INSTAGRAM_CLIENT_SECRET`
- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`

### Email And Analytics

- `RESEND_API_KEY`
- `POSTHOG_KEY`

## Current Checkpoint

Build item 2 is the character sheet pipeline. External image-model and object-storage integrations are architecturally real but stubbed locally, with immutable versioned outputs and signed URL-shaped delivery.

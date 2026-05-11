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

Build item 1 is the onboarding flow. External APIs are stubbed, but the route transitions and server-side onboarding state are implemented locally.

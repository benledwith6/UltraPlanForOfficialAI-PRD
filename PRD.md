# PRD — Official AI

> Product Requirements Document for an AI marketing-content web app purpose-built for **lawyers and real estate agents**.
>
> **Status**: draft v1. Authored collaboratively as the input to a one-shot executor handoff (Codex + gstack + browser-use harness). Open questions are flagged inline and consolidated at the end.

---

## 1. Executive Summary

**Product name (working)**: Official AI

**One-liner**: An AI marketing-content platform that lets lawyers and real estate agents produce polished, on-brand short-form video using their own likeness, and ship it to social channels on a guided cadence — without ever picking up a camera.

**Why now**: AI video models (Sora, Veo, Kling, Runway, Hedra, Higgsfield) are now good enough to generate professional-grade short-form video from a still image + script. But generic consumer tools (Pika, Hailuo, etc.) treat video as the deliverable. For professionals whose business depends on **consistent social presence**, video is just one step in a longer chain: idea → script → render → schedule → post → measure. We own the whole chain for two specific verticals where the ROI is highest.

**Differentiator (technical)**: Our internal testing has shown that feeding a video model a **character sheet** plus a **360-degree character sheet** of the user — rather than a single selfie — produces dramatically more consistent, on-likeness video. This is the core technical IP of the product and the reason output quality will beat generic competitors.

**Differentiator (product)**: Two opinionated workflows (lawyer / real estate agent) with templates, cadence recommendations, and posting automation tuned specifically to those professions' marketing norms. We're not a horizontal AI video tool; we're a marketing operating system for these two verticals.

**Business model**: Subscription. Free tier limited to onboarding + a single watermarked video. Paid tiers gate by render minutes per month, posting destinations, and template library access.

**Primary success outcome**: A subscribing user posts ≥4 AI-generated videos per month for 3+ consecutive months.

---

## 2. Problem Statement

### 2.1 The category problem

Both lawyers and real estate agents are now expected to maintain a **personal-brand social presence** as a core driver of new business. Yet 90%+ of practitioners in both fields post almost nothing on social, because the production loop (script → record → edit → post) is too expensive in time, money, and emotional energy.

The general-purpose AI tools that exist today (ChatGPT for scripts, Pika/Sora for video, Buffer/Hootsuite for scheduling) require the user to stitch together 4–6 separate products and still do most of the creative direction themselves. The friction kills adoption.

### 2.2 Lawyer-specific pain

Concrete pains we've heard / observed:

- *"I know I should be making videos explaining what a deposition is, what to do after a car accident, but I bill at $400/hr — I can't justify two hours of production for a 60-second TikTok."*
- Solo attorneys at small firms struggle with **partner-recruitment content** to grow their practice — LinkedIn posts saying "we're hiring" get no engagement; first-person video saying *why someone should join* converts dramatically better, but feels uncomfortable to produce.
- Brand-building content (explainers about practice areas: family law, estate planning, personal injury) requires the attorney to look authoritative on camera — which most don't feel they do.
- **Attorney advertising regulations** vary by state bar and impose substantive constraints on what attorneys can claim, how testimonials work, and what disclosures are needed. Most generic AI video tools ignore this entirely, creating real malpractice risk.

### 2.3 Real estate agent-specific pain

Concrete pains:

- *"Every listing needs a walkthrough video, plus I should be posting weekly market commentary, plus testimonial reels, plus 'why work with me' videos — it's a full-time job on top of selling houses."*
- Walkthrough videos for individual listings have a short shelf life (~30 days) so any production process that takes more than an hour per video is a non-starter.
- "Why work with me" personal-brand videos are the highest-converting content for buyer leads, but agents feel awkward filming them on a phone.
- Fair Housing Act rules constrain what agents can say in marketing about neighborhoods, schools, and demographics — generic AI tools don't know this.
- Recruitment content (for agents looking to grow a team or move brokerages) is a separate but adjacent need.

### 2.4 Why existing tools fail

| Tool category | What it does | Why it fails for these users |
|---|---|---|
| Generic AI video (Pika, Hailuo, consumer Sora) | Produces a single video from a prompt | No likeness consistency, no profession-specific templates, no scheduling, no compliance, no posting |
| Scheduling tools (Buffer, Hootsuite, Later) | Schedules pre-made content | User still has to produce the content from scratch |
| AI avatar tools (HeyGen, Synthesia) | Talking-head video from script | One-take avatar look, no character sheet pipeline → consistent lower likeness quality; no profession workflow; no scheduling/posting |
| Agency/freelancer | Custom production | $5K+/month, slow turnaround, doesn't scale |

Our wedge: **profession-specific opinionation + likeness-quality pipeline + end-to-end (ideation → post)**.

---

## 3. Personas

### 3.1 Lawyer persona — "Maya, the Solo Attorney"

- **Profile**: 38, solo or small-firm attorney (1–10 attorneys), practice area is family / PI / estate planning (i.e., consumer-facing legal services where social proof matters). Has ~500 LinkedIn connections, ~200 Instagram followers. Posts <1×/month.
- **Goals**: Grow inbound case flow without hiring a marketing person. Build authority in her practice area. Recruit junior associates as her firm scales.
- **Constraints**: Bills hourly — every minute spent on marketing is opportunity cost. State bar advertising rules feel like a landmine. Doesn't enjoy being on camera.
- **Tech comfort**: Average. Uses Clio or MyCase for practice management; isn't a power user of social media platforms beyond consuming.
- **Quote**: *"Tell me what to post, generate the video, and tell me when to post it. I'll review and approve."*

### 3.2 Real estate agent persona — "Derek, the Top-25% Agent"

- **Profile**: 42, real estate agent at a mid-large brokerage (eXp, Compass, KW, RE/MAX). Closes 15–30 transactions/year. Has personal Instagram + Facebook + a YouTube channel he started and abandoned. Posts inconsistently (3 posts one week, nothing for a month).
- **Goals**: Stay top-of-mind with past clients for referrals. Generate buyer/seller leads from social. Build a personal brand independent of his brokerage so he can move or start a team.
- **Constraints**: Every listing needs a walkthrough video FAST. Fair Housing rules limit what he can say about neighborhoods. Already pays for Canva, CapCut, Buffer — doesn't want a 5th tool unless it replaces them.
- **Tech comfort**: Above average — comfortable with phone-based content tools, less so with desktop.
- **Quote**: *"I need a walkthrough video for the listing I'm previewing tomorrow, market commentary on Tuesday, and a 'why work with me' reel for next week — all in 20 minutes total, not 4 hours."*

### 3.3 What they share

- Reputation-driven businesses where personal brand directly drives revenue.
- High earning power → willing to pay $99–$299/month if it actually saves time.
- Regulated industries where compliance is not optional.
- Already aware they "should" be doing more social and feel guilty about it.

### 3.4 Secondary persona — Internal team (admin dashboard user)

Our own staff: a small team of operators and ML engineers who need to evaluate which video model produces the best output for each template, monitor failure rates, and curate the template library. Not paying customers but a critical persona for the admin surface.

---

## 4. Goals & Non-Goals

### 4.1 Goals (v1)

1. Onboard a user in <5 minutes from sign-up to first generated video.
2. Produce video output that the user judges to be "on-likeness" (≥80% rating).
3. Reduce time-to-publish from idea → posted-on-LinkedIn to <10 minutes.
4. Surface 8+ profession-tailored templates at launch (4 lawyer, 4 real estate).
5. Support guided posting cadence with weekly recommendation digest.
6. Ship admin tooling sufficient to run a model × template eval before each production deploy.

### 4.2 Non-goals (v1, explicit)

- ❌ Long-form video (>90 seconds). Short-form only.
- ❌ Multi-person scenes. Single subject (the user) only.
- ❌ Live streaming, podcasts, written-content (blog/article) generation.
- ❌ Direct lead-capture / CRM. We hand off to the user's existing tools.
- ❌ Verticals outside lawyer + real estate (no doctors, accountants, financial advisors at v1, even though demand will exist).
- ❌ Native mobile apps. Web-only (responsive, mobile-friendly browser experience).
- ❌ Custom/brand voice cloning beyond the default. (Voice is open question; see §15.)
- ❌ Team/multi-user accounts. Single-user only at v1.

---

## 5. User Stories

### 5.1 Onboarding (both personas)

- As a new user, I want to upload a single selfie and see proof that AI can render *me* before I commit to paying, so I trust the product before opening my wallet.
- As a new user, I want a welcome video of myself saying a generic phrase, so I have a tangible artifact and emotional "this is real" moment before the paywall.
- As a new user, I want to reject the generated likeness and try again if it doesn't look like me, so I don't get stuck with a bad character sheet.

### 5.2 Content production — Lawyer

- As Maya, I want to pick a template like "Explain a legal concept in 60 seconds" and have it generate a script + video where I'm explaining the concept, so I don't have to write or perform.
- As Maya, I want to pick a "We're hiring at our firm" template and produce a recruitment video, so I can grow my associate pipeline without using a recruiting agency.
- As Maya, I want every output to have profession-appropriate disclaimers ("Not legal advice — consult an attorney licensed in your state") automatically attached, so I'm not creating compliance risk.

### 5.3 Content production — Real estate

- As Derek, I want to upload property photos or a Matterport link and get a walkthrough video where my AI likeness narrates the home tour, so I can produce listing content in 5 minutes instead of 2 hours.
- As Derek, I want a "Why work with me" template that generates a personal-brand reel, so I have evergreen content driving buyer leads.
- As Derek, I want every generated post to be screened against Fair Housing language rules, so I don't accidentally violate them.

### 5.4 Brainstorm

- As either persona, I want to describe a rough idea ("something about the new tax law" / "something about why people fail to refinance") and have the system propose 3–5 video angles I can pick from, so I'm not staring at a blank script.

### 5.5 Calendar & cadence

- As either persona, I want a weekly view showing what I have queued, what's scheduled, and what the system recommends I produce next, so I'm always one click away from filling my pipeline.
- As either persona, I want a profession-specific cadence guide ("Tuesdays: market update; Thursdays: testimonial; Fridays: behind-the-scenes"), so I don't have to invent my posting strategy.

### 5.6 Posting

- As either persona, I want to schedule a video to post to LinkedIn / Instagram / TikTok / YouTube at a specific time, so I don't have to be at my computer to publish.
- As either persona, I want a single "approve & post" button, so I don't have to copy/paste captions or upload files manually.

### 5.7 Admin (internal)

- As an internal operator, I want to run the same template against multiple video models and rate the outputs side by side, so I can pick the best model × template pairing.
- As an internal operator, I want to see failure rates and average render times by model, so I can balance quality and cost.

---

## 6. Functional Requirements

For each capability: scope, user-facing behavior, edge cases, success criteria. Implementation choices are deferred to the executor unless flagged.

### 6.1 Onboarding flow (detailed — spec every screen)

The onboarding flow is the single most important surface in v1. It is the moment the user goes from skeptical to converted. Every screen below must exist.

**Screen 1 — Marketing landing → Sign up**
- Pick profession: "I'm a lawyer" / "I'm a real estate agent" / "Other (waitlist)".
- "Other" routes to a waitlist form. Other professions are not supported in v1.
- Email + password OR OAuth (Google, Apple, LinkedIn).
- After auth: route to Screen 2.

**Screen 2 — Selfie upload**
- Single page: "Upload a clear photo of your face." Drag-and-drop or file picker, with webcam capture as fallback.
- Requirements (validated client-side and server-side): single face detected, centered, well-lit, ≥1080×1080, no sunglasses, neutral or slight smile.
- On invalid: friendly error specific to the failure ("We see two faces — please use a solo photo") plus retry.
- Show a sample-photo modal with examples of good and bad selfies.

**Screen 3 — Generating your character (loading state)**
- Shown for ~30–90 seconds while we generate the AI image grid.
- Loading copy that's specific and reassuring: "Building your AI character sheet… this is the part that makes your videos look like you."
- If generation fails (timeout, model error): retry once silently, then show recoverable error with "Try a different photo" option.

**Screen 4 — Likeness grid + confirmation**
- 6–9 AI-generated portraits of the user, varying expression, angle, lighting.
- Single CTA: "Yes, this looks like me" → routes to Screen 5.
- Secondary CTA: "Not quite right — try again" → routes back to Screen 2.
- We must NEVER force the user past this gate. A bad character sheet poisons every downstream video and is the #1 risk to satisfaction.

**Screen 5 — Generating welcome video (loading state)**
- Shown for 1–3 minutes. During this time the user is asked to fill in a short onboarding form (Screen 5a, runs in parallel).
- Loading copy: "Producing your first AI video. While you wait, tell us a bit about your practice."

**Screen 5a — Onboarding questionnaire (parallel)**
- Lawyer: practice area, firm size, state(s) of bar admission, primary marketing goals (new client acquisition / referrals / recruiting), preferred tone (professional / approachable / direct).
- Real estate: brokerage, market(s) you serve, primary marketing goals (listings / buyer leads / referrals / recruiting), preferred tone.
- These answers seed defaults across templates, calendar, and compliance.

**Screen 6 — Welcome video reveal**
- Full-screen autoplay of the user's AI welcome video saying "Welcome to Official AI." Subtle audio fade-in. Strong reveal moment.
- Below the video: "This is you. Imagine what you could post next."
- Primary CTA: "Start posting" → routes to Screen 7 (paywall).
- Secondary CTA: "Watch again" (replays).
- The welcome video is downloadable on the free tier with a watermark.

**Screen 7 — Paywall**
- Three tiers (placeholder; see §10 for full pricing).
- Show what they get on each tier with concrete numbers (videos / month).
- Annual toggle (10–20% discount).
- Below CTA: "I'll decide later" → routes to a stripped-down free dashboard with the watermarked welcome video and one teaser of locked features.

**Edge cases for onboarding**

- User abandons after Screen 2 → don't burn a generation. Hold uploaded photo for 7 days, then delete.
- User abandons after Screen 4 confirmation → character sheet exists but no welcome video. Resume on next login at Screen 5.
- User fails the likeness gate 3 times → offer human-in-the-loop support escalation ("Want a human to review?").
- User on a slow connection during welcome video generation → continue in background and notify via email when ready; user can leave and come back.

### 6.2 Character sheet pipeline (core IP)

This is the technical heart of the product. The executor must implement it as a discrete, well-isolated pipeline so we can swap models without rewriting the UX.

**Inputs**: confirmed selfie (1 image).

**Outputs** (stored per-user, immutable after creation):
1. **Character sheet**: ~12–24 AI-generated reference images of the user from varied angles, expressions, and lighting.
2. **360-degree character sheet**: a programmatically-organized set of front / 3/4 / profile / back views, with consistent lighting and neutral background, suitable as conditioning input to downstream video models.

**Versioning**: each character sheet has a `v` (version). Users can regenerate (e.g., new haircut), creating `v2`, but old videos remain linked to the version they were generated against. This matters for consistency across a user's library.

**Storage**: object storage (S3 or equivalent), with signed URLs. Never serve raw images publicly.

**Privacy**: character sheets are user-owned IP. On account deletion, all sheets are scrubbed within 30 days. See §11 for compliance.

**Use as conditioning**: every downstream video generation references a specific character sheet version. The executor should architect this as `videoJob.characterSheetId = <id>` so any model integration just needs to know which conditioning images to load.

### 6.3 Content production — templates

A **template** is a reusable, profession-scoped recipe with:
- `id`, `name`, `description`, `thumbnail`
- `profession`: `lawyer | realtor | universal`
- `inputs`: structured fields the user fills in (text, file uploads, dropdowns)
- `scriptPromptTemplate`: how user inputs map to an LLM prompt that generates the script
- `videoPromptTemplate`: how the script + character sheet map to a video-model prompt
- `defaultDurationSec`, `aspectRatio` (`9:16`, `1:1`, `16:9`)
- `complianceRules`: which compliance overlays apply (state-bar disclaimers, fair housing screen, etc.)
- `cta`: what the user is encouraged to do with the output (post on LinkedIn, save to library, etc.)

**Launch templates (lawyer)**:
1. Legal concept explainer — "Explain X in 60 seconds"
2. Firm hiring / recruitment reel
3. "Why hire me / my firm" personal-brand reel
4. Practice area overview (e.g., "What family law looks like at our firm")

**Launch templates (real estate)**:
1. Property walkthrough — user provides listing photos or Matterport URL
2. Market commentary — user picks a topic (rates, inventory, season)
3. "Why work with me" personal-brand reel
4. Testimonial reel — user uploads a written client testimonial; we render it as a stylized quote video with their narration

**Template authoring**: at v1, templates are authored internally (we add them via the admin dashboard, not user-generated). v2 allows user customization.

**End-to-end flow for a template-driven video**:

1. User picks a template from the gallery.
2. Inputs screen: user fills in template-specific fields. Show a live preview pane where possible (e.g., the title card updating as they type).
3. "Generate script" CTA → server generates a draft script, displayed in an editable text area.
4. User edits / accepts script.
5. "Generate video" CTA → backend queues a `videoJob` referencing `templateId`, `userScript`, `characterSheetId`. Status: queued → rendering → done / failed.
6. Polling or websocket-pushed progress.
7. On completion: reveal screen with playback, download, "Send to calendar", "Post now", "Edit script and regenerate" options.
8. Compliance overlay automatically attached if template requires it.

### 6.4 Brainstorm surface

User describes a rough content idea in natural language. System returns 3–5 concrete video proposals, each tagged with a suggested template and pre-filled inputs.

**Open question (§15)**: chat-style? Card-based? Guided wizard? Recommendation: card-based — three proposal cards laid out side by side, each with a one-click "Use this idea" that pre-fills the template flow. Chat is too open-ended; wizard is too rigid.

**Behavioral details**:
- Each proposal includes: title, one-line description, suggested template, estimated render time, suggested posting channel.
- "Regenerate" gives a fresh set of 3–5.
- Proposals are not auto-saved; only those the user clicks become drafts in the calendar.

### 6.5 Content calendar with guided cadence

**View modes**: week (default), month, list.

**Items on the calendar**:
- Drafts (template completed but no scheduled post time)
- Scheduled posts (date, time, destination channel, post text + video)
- Published posts (read-only, link to platform)
- **Recommendations**: ghost-card placeholders at recommended posting times based on the user's cadence plan

**Cadence plans (profession-scoped)**:

*Lawyer default cadence (LinkedIn-heavy)*:
- Monday: practice-area explainer (educational, lowest-energy post of the week)
- Wednesday: "behind the scenes / human moment" (humanizing post)
- Friday: client success / testimonial (social proof)
- Monthly: recruitment post

*Real estate default cadence (Instagram + LinkedIn)*:
- Monday: market commentary
- Tuesday: new listing walkthrough (if available)
- Thursday: testimonial / past client
- Saturday: "Why work with me" / personal brand
- As needed: open house promotion, just-sold

User can override the cadence plan. Recommendations are dismissible.

### 6.6 Automated posting

**Supported destinations (v1)**: LinkedIn, Instagram (Business/Creator account), TikTok, YouTube (Shorts), Facebook (Business page). Twitter/X is a stretch goal pending API costs.

**Architectural fork (open question §15)**:
- **Option A — Direct posting**: integrate with each platform's official API to publish on the user's behalf at the scheduled time. Pros: real automation, the product fulfills its promise. Cons: LinkedIn and Instagram restrict third-party posting, especially for video. Requires app review, may require paid API tiers.
- **Option B — Generate-and-queue**: produce the video, prepare the caption, schedule a reminder, and at the scheduled time push a notification ("Tap to post on LinkedIn") that deep-links into the platform's native composer with the asset pre-loaded. Pros: works on every platform without API gymnastics. Cons: not "real" automation; user must tap.

**Recommendation**: ship Option B at v1 for breadth, layer Option A in over time per platform where APIs allow. The product positioning "automated posting" is honest as long as the user experience is single-tap.

**Per-post requirements**:
- Caption editor with character-count guidance per platform.
- Hashtag suggestions (template-driven defaults + user overrides).
- Thumbnail selection from generated video frames.
- Schedule time picker with smart-default times per platform per user's timezone.
- Cancel / reschedule actions before publish.

### 6.7 Admin dashboard (internal)

Restricted to internal accounts. Lives at `/admin`.

**Views**:

1. **Model × template eval grid**: rows are templates, columns are video models. Each cell shows a sample output and a rating UI (1–5 stars + free-text notes). Used before each production deploy to pick the active model per template.
2. **Generation job log**: every `videoJob` in the system with status, model used, render time, cost, output URL. Filterable by user, template, model, time range.
3. **Failure dashboard**: aggregate failure rate per (model, template) pair.
4. **Template manager**: CRUD for templates. Create, edit, archive, publish.
5. **User support view**: lookup user by email, see their character sheets and recent jobs, regenerate a character sheet on their behalf if needed.
6. **Feature flags**: simple key-value flag toggles (e.g., enable Sora for lawyer templates, fall back to Veo, etc.).

---

## 7. UX Flow Descriptions

Each flow described in text. The executor should implement these as discrete page routes; transitions are explicit.

### 7.1 Onboarding flow

`/` (landing) → `/signup` → `/onboarding/selfie` → `/onboarding/generating` (auto-redirects) → `/onboarding/likeness-check` → `/onboarding/welcome-generating` (auto-redirects, with questionnaire overlay) → `/onboarding/welcome-reveal` → `/paywall` → `/dashboard` (or `/dashboard/free` if user defers paywall).

Each route persists its state server-side so the user can return mid-flow without losing progress.

### 7.2 Content creation flow

`/dashboard` → `/templates` (gallery, filterable by profession) → `/templates/:templateId/inputs` → `/templates/:templateId/script` → `/templates/:templateId/generating` → `/library/videos/:videoId` (reveal).

From `/library/videos/:videoId`: options are "Schedule" (→ calendar with this post pre-loaded), "Post now" (→ immediate publish flow), "Save as draft" (→ stays in library, no action), or "Edit script and regenerate" (→ back to script step, branching the version).

### 7.3 Brainstorm flow

`/brainstorm` → user types prompt → 3–5 cards displayed → click "Use this idea" → routes to `/templates/:templateId/inputs` with fields pre-filled.

### 7.4 Calendar flow

`/calendar` (default week view) — drag drafts onto slots; click recommendation ghost cards to expand into "create this content" CTAs; click published posts to view metrics.

### 7.5 Posting flow

From any video reveal: "Post" CTA → select destination(s) → caption editor with platform-specific previews → confirm → either immediate publish (API path) or scheduled notification (deep-link path) per §6.6.

### 7.6 Admin flow

`/admin` (requires staff role) → cards for each admin tool (§6.7). Each is its own page with no fancy routing — admin is a power-user surface, not a polished consumer one.

---

## 8. Data Model

Conceptual entities. Field types are illustrative; the executor picks the exact DB technology and types based on gstack conventions.

### `User`
- `id`, `email`, `passwordHash` (or OAuth provider info)
- `profession`: enum `lawyer | realtor`
- `professionMeta`: JSON (practice area, state, brokerage, etc. — answers from onboarding questionnaire)
- `tone`: enum `professional | approachable | direct`
- `tier`: enum `free | starter | pro | studio` (see pricing)
- `createdAt`, `lastLoginAt`
- `isStaff`: bool (admin access)

### `CharacterSheet`
- `id`, `userId`
- `version`: int
- `sourceSelfieUrl`
- `referenceImageUrls`: array
- `threeSixtyImageUrls`: array (keyed by angle)
- `status`: enum `generating | ready | failed`
- `createdAt`

### `Template`
- `id`, `name`, `description`, `thumbnailUrl`
- `profession`: enum `lawyer | realtor | universal`
- `inputsSchema`: JSON describing the form fields
- `scriptPromptTemplate`: string
- `videoPromptTemplate`: string
- `defaultDurationSec`, `aspectRatio`
- `complianceRules`: array of rule IDs (see §11)
- `cta`: string
- `isPublished`: bool
- `createdAt`, `updatedAt`

### `VideoJob`
- `id`, `userId`, `templateId`, `characterSheetId`
- `userInputs`: JSON (what the user filled in the template form)
- `generatedScript`: text (the LLM output, possibly user-edited)
- `videoModelId`: string (which model executed)
- `videoUrl`: string (final asset)
- `status`: enum `queued | rendering | ready | failed`
- `errorMessage`: string nullable
- `costCents`: int (for internal accounting)
- `renderTimeSeconds`: int
- `createdAt`, `completedAt`

### `CalendarEntry`
- `id`, `userId`, `videoJobId` (nullable for empty placeholders)
- `scheduledAt`: timestamp
- `status`: enum `draft | scheduled | published | failed`
- `channels`: array of enum `linkedin | instagram | tiktok | youtube | facebook`
- `caption`: text
- `hashtags`: array
- `createdAt`, `publishedAt` nullable

### `Post`
- `id`, `calendarEntryId`, `channel`, `externalPostId`, `externalUrl`, `publishedAt`, `engagementSnapshot`: JSON (likes, comments, shares — pulled if API allows)

### `ModelEvaluation` (admin)
- `id`, `templateId`, `videoModelId`, `evaluatorUserId`
- `videoJobId`: a specific job used for evaluation
- `rating`: int 1–5
- `notes`: text
- `createdAt`

### `Subscription`
- `id`, `userId`, `tier`, `provider` (stripe), `providerSubscriptionId`, `status`, `currentPeriodEnd`

### Relationships

- 1 User → 1+ CharacterSheets (versioned)
- 1 Template → many VideoJobs
- 1 CharacterSheet → many VideoJobs
- 1 VideoJob → 0..1 CalendarEntry
- 1 CalendarEntry → many Posts (multi-channel publishing)

---

## 9. Integration Surface

### 9.1 Video model providers

The product is model-agnostic by design. Each model is implemented as a `VideoModelAdapter` with a common interface (input: script + character sheet + duration + aspect ratio; output: video URL + cost + latency).

**Candidates evaluated at launch**: Sora (OpenAI), Veo 3 (Google), Kling, Runway Gen-3+, Hedra, Higgsfield. **Open question (§15)**: which subset ships at v1 — the executor should architect for plug-in adapters but launch with whichever 2–3 perform best in eval (likely Veo + Hedra for talking-head, Runway/Kling for environmental shots like walkthroughs).

### 9.2 Image generation (for character sheets)

Likely Flux, Imagen 4, or SDXL family. Open question whether we self-host or use a hosted API at v1; recommend hosted at v1 for speed-to-market.

### 9.3 LLM (for scripts and brainstorm)

Claude (likely Sonnet 4.5+) for scripts and brainstorm. Anthropic SDK with prompt caching enabled. System prompts encode profession context and tone.

### 9.4 Social platforms

| Platform | API available | v1 path |
|---|---|---|
| LinkedIn | Yes for some account types; restricted for personal profiles | Option B (deep-link/reminder) — APIs are too restrictive for first launch |
| Instagram | Graph API (Business/Creator accounts only) | Option B at v1, Option A as a fast-follow for eligible accounts |
| TikTok | Content Posting API (requires app review) | Option B at v1 |
| YouTube | Data API (uploads supported) | Option A — YouTube is the most permissive |
| Facebook | Graph API (Pages) | Option A for Pages, Option B for personal |

### 9.5 Payments

Stripe. Subscriptions, with monthly + annual options. Customer portal for plan changes/cancellations.

### 9.6 Auth

Email/password + OAuth (Google, Apple, LinkedIn). LinkedIn OAuth doubles as a posting permission scope grant if user opts in.

### 9.7 Storage

Object storage (S3, Cloudflare R2, or equivalent) for all media. Signed URLs for delivery.

### 9.8 Email

Transactional email provider (Resend, Postmark, SendGrid) for welcome flow, post-publish confirmations, and weekly cadence digest.

### 9.9 Analytics

Server-side event tracking (PostHog or equivalent self-hosted) for funnel analysis. Avoid client-side third-party trackers — our users are privacy-sensitive professionals.

---

## 10. Pricing & Paywall

Placeholder pricing — final tiers to be set after pricing research, but the **shape** is committed:

| Tier | Price/mo | Videos/mo | Channels | Templates | Notes |
|---|---|---|---|---|---|
| **Free** | $0 | 1 watermarked welcome video only | None (download only) | None | Conversion tool |
| **Starter** | $99 | 8 videos | LinkedIn + 1 other | All launch templates | Solo practitioners |
| **Pro** | $199 | 20 videos | All supported | All + admin assistance for custom templates | Most common |
| **Studio** | $399 | 60 videos | All | All + priority render queue + concierge support | High-volume agents/firms |

Annual: 15% discount on any tier.

**What's gated**:
- The character sheet pipeline runs only once on Free (the welcome video). All subsequent generations require a paid tier.
- 360 character sheet is available at all paid tiers.
- The brainstorm surface, calendar, and posting are all paid features. Free users see a locked-state preview.
- Admin dashboard is staff-only (not a customer feature).

**Trial**: 7-day money-back guarantee on any tier; no separate free trial. This forces commitment but the welcome video is enough proof to drive that commitment.

---

## 11. Compliance & Risk

This is a regulated-industry product. The PRD treats compliance as a first-class feature, not an afterthought.

### 11.1 Attorney advertising (lawyer persona)

- Most state bars require attorney advertising to (a) clearly identify as advertising, (b) avoid claims of specialization unless certified, (c) avoid testimonial-based comparison claims, (d) include attorney name + bar admission(s).
- Implementation: every lawyer-template output gets a footer overlay (text or voiced disclaimer) with: name, bar admission, "Attorney advertising," and "Past results do not guarantee future outcomes" where applicable.
- State-specific rule database: maintain a per-state rules table in the admin. v1 defaults to the strictest superset; per-state customization is a fast-follow.

### 11.2 Fair Housing (real estate persona)

- Federal Fair Housing Act prohibits language that expresses preference, limitation, or discrimination based on race, color, religion, sex, disability, familial status, national origin.
- Implementation: every realtor-template script is screened by an LLM pre-publish check trained on Fair Housing prohibited language patterns. Flagged scripts cannot publish until edited. Common red flags: school district claims, "family-friendly," "ideal for [demographic]," neighborhood descriptors that imply demographics.
- Optional pre-publish review by a human (us) for users on Studio tier.

### 11.3 AI likeness consent and rights

- Terms of service explicitly cover: user grants us a license to generate and store their character sheets, scoped to their account. We do not use their likeness to train models or for any other user's content.
- On account deletion: all character sheets and derivative videos are deleted within 30 days. User can export their video library before deletion.
- Deepfake exposure: we generate videos of the user as themselves saying things they approve. We never put words in the user's mouth that they haven't reviewed. Mandatory script-review gate before any render.

### 11.4 Disclosure / watermarking

- Free tier: visible "Made with Official AI" watermark on the welcome video.
- Paid tiers: no watermark, but every video includes invisible C2PA-style metadata identifying it as AI-generated. This protects the user (provenance) and the platform (audit trail).
- Some platforms (Meta, TikTok) now require AI-generated content to be labeled — we surface the label flag in the posting flow and pre-fill it.

### 11.5 Data security

- All PII encrypted at rest. Selfies and character sheets encrypted with per-user keys.
- SOC 2 readiness as a goal within 12 months (not v1 launch).
- No third-party trackers (per §9.9).

### 11.6 Likeness misuse

- If a user uploads a photo that isn't of themselves (e.g., a celebrity, a different person), we have no perfect detection. Mitigation: terms of service prohibit it; we reserve the right to remove accounts; we monitor for known-public-figure faces via an embedding-based deny list as a deterrent.

---

## 12. Success Metrics

Tracked in two tiers: input metrics (we control) and outcome metrics (we measure).

### 12.1 Input metrics (weekly cadence)

- New signups
- Onboarding completion rate (sign-up → welcome video reveal)
- Paywall conversion rate (welcome reveal → paid subscription)
- Time-to-first-video (sign-up → first video downloaded or published)
- Free → paid upgrade rate
- Churn rate (monthly)

### 12.2 Outcome / engagement metrics

- **Activation**: % of paid users who publish ≥1 video in week 1
- **Sustained activation**: % of paid users who publish ≥4 videos per month for 3 consecutive months (this is our north star)
- Avg videos generated per paid user per month
- Avg videos published (vs just generated) per paid user per month — gap here signals UX or posting-friction issues
- Compliance flag rate per profession (high flag rates signal template prompts are off)
- "On-likeness" satisfaction rating (post-generation survey, 1–5 stars)

### 12.3 Internal metrics

- Avg render time per (model, template)
- Render failure rate per (model, template)
- Cost per video per tier (we need positive contribution margin per tier)
- Eval-grid completion rate before each deploy

### 12.4 North-star target (12 months post-launch)

- 1,000 paid users at $199 avg
- Sustained activation rate ≥ 40% (i.e., 400+ users posting consistently)

---

## 13. Admin / Internal Tooling Requirements

Covered in §6.7 (functional) and §8 (data model). Operational notes:

- Admin auth is staff-flag on User (no separate admin app).
- All admin actions are audit-logged (who did what, when).
- Admin can impersonate-view a user account in read-only mode for support; impersonate-write requires a second-staff approval.

---

## 14. Out-of-Scope / Future

Captured here so it's clear we considered them and decided to defer:

- Native mobile apps (iOS/Android)
- Multi-user team accounts and seats
- White-label / brokerage-branded deployments
- A/B testing of generated content
- Other verticals (doctors, accountants, financial advisors, dentists, etc.)
- Brand voice cloning (user's actual voice instead of a TTS default)
- Multi-language support
- Live event coverage / real-time content
- Long-form video (>90s)
- User-authored templates

---

## 15. Open Questions

Explicit list of things we are NOT deciding in this PRD. The executor agent should flag these as decision points, not resolve them silently.

1. **Real estate walkthroughs — fully AI-generated vs. property-footage stitching?** Major architecture fork. Recommendation: v1 supports property-photo upload + AI agent intro/outro stitched together (lowest novelty risk; matches realtor expectations); fully AI-generated walkthroughs are v2.

2. **Posting automation — direct API vs. deep-link reminder?** Per §6.6, recommendation is Option B (deep-link) for breadth at v1, Option A for YouTube and Facebook Pages where APIs are permissive. Final per-platform decision deferred to executor based on API access review.

3. **One product with two modes vs. two separate flows?** Recommendation: **one product, two profession modes** at v1. Shared infra (auth, billing, character sheet, video pipeline, calendar, posting), differentiated content layer (templates, cadence, compliance, copy). This is the lowest-friction path.

4. **Character sheet retention on cancellation?** Recommendation: 30-day soft-retention after cancellation (lets users reactivate without re-onboarding), then hard delete.

5. **Free-tier watermarking style?** Subtle corner mark vs. larger badge. Recommendation: subtle corner mark — large badges feel punitive and reduce conversion.

6. **Per-jurisdiction disclosure overlays?** Recommendation: default to the strictest superset of attorney-advertising rules across all US states at v1; per-state customization fast-follow.

7. **Which video model providers ship at v1?** Recommendation: launch with 2–3 (likely Veo 3, Hedra, plus one environmental like Runway), expand via the adapter pattern. Final picks come out of the model × template eval in the admin dashboard.

8. **Brainstorm UX — chat, card, or wizard?** Recommendation: **card-based** (three proposal cards). Justification in §6.4.

9. **Voice — TTS default only, or user voice cloning?** Recommendation: TTS default at v1 (ElevenLabs or comparable). User voice cloning is a clear v2 feature once we validate the core loop.

10. **Mobile experience scope?** Recommendation: web app that is fully usable in a mobile browser (responsive design), but **not** a PWA install flow at v1. Native apps stay out of scope per §14.

11. **Inviting brokerages / law firms?** Should we allow a firm admin to invite multiple attorneys onto a firm plan? Recommendation: defer to post-v1 (no multi-user at v1, per non-goals).

12. **Compliance support level for Studio tier — automated only or include human review?** Open. Could be a meaningful differentiator at the top tier.

---

## 16. Handoff Notes for Implementation

(This section is for the executor agent — Codex + gstack + browser-use harness — not for the PRD review surface.)

- **Stack**: follow gstack conventions. If gstack defaults conflict with anything in this PRD, prefer gstack and flag the conflict.
- **Order of build**: onboarding (§6.1) → character sheet pipeline (§6.2) → template flow for one launch template (lawyer "Legal concept explainer") → paywall + Stripe → calendar → posting (Option B path first) → brainstorm → admin dashboard → remaining templates → polish.
- **QA via browser-use harness**: every user-facing route in §7 must have an automated end-to-end check. Critical paths: signup → paywall (happy path), template generation (happy + failure), posting schedule + reschedule.
- **Open questions**: do NOT silently resolve. Implement the recommended option, but expose configuration so we can flip without redeploy.
- **Compliance rules** are not optional. Lawyer templates must attach disclaimers; realtor templates must screen scripts against Fair Housing language. These are blocking gates, not warnings.
- **Admin dashboard** can be ugly. Functionality over polish.
- **Account context**: `gtm@muditastudios.com` is the Max account driving builds; `benledwith6` GitHub owns the repo. See `CLAUDE.md`.

---

*End of PRD v1.*

# Project Context for Claude

> Durable notes for any Claude Code session working in this repo. Read this first before doing anything.

## What this repo is

Workspace for a one-shot software experiment. The plan:

1. **Draft an exhaustive PRD via `/ultraplan`** (cloud-based collaborative drafting with inline-comment review on claude.ai/code).
2. **Hand the finalized PRD to an executor agent** for one-shot implementation. Executor stack:
   - Codex (OpenAI's CLI) with the GitHub repo loaded
   - [Garry Tan's gstack](https://github.com/garrytan/gstack) skill files installed
   - [browser-use harness](https://github.com/browser-use/browser-harness) for end-to-end QA loop during dev
3. **QA + iterate** until the implementation matches the PRD.

The product itself is an AI marketing-content app for **lawyers and real estate agents**: face/likeness onboarding → character sheet pipeline → templated video generation (real estate walkthroughs, LinkedIn recruit, brand) → content calendar with guided cadence → automated posting → admin dashboard for model×template eval. See `PRD.md` once drafted for the full spec.

## Account & infra context

- **GitHub**: `benledwith6/UltraPlanForOfficialAI-PRD` on `main`. Owner is the GitHub account `benledwith6` (the user has a second account `bentailoredai` — not the active one for this project).
- **Anthropic / Claude Code**: signed in as **`gtm@muditastudios.com`** on a **Max plan** (this is what unlocks ultraplan, which requires Claude Code v2.1.91+). NOTE: this is a different email from the GitHub account — that's expected. The `benledwith6@g.ucla.edu` account is the user's old **Pro** account and is NOT what we use here.
- **Browser for ultraplan review**: when opening claude.ai/code/session URLs to review ultraplan output, you MUST be signed into `gtm@muditastudios.com` (the Max account), not the Pro account.
- **Working directory**: this repo at `~/UltraPlanForOfficialAI-PRD/`. **Do NOT use** the older path `/Users/benledwith/Ultraplan testing/` — it's a duplicate from initial setup and should be deleted after the ultraplan flow finishes (see Cleanup tasks below).

## Cleanup tasks

- [ ] Delete `/Users/benledwith/Ultraplan testing/` once the ultraplan PRD is complete and merged. It was the original git-init location before the GitHub repo was cloned fresh into `~/UltraPlanForOfficialAI-PRD/`. Two copies will diverge if anyone commits to it.

## The `/ultraplan` prompt that drafts the PRD

If the PRD draft is lost or needs to be re-run, paste this verbatim into a CC session inside this repo:

```
/ultraplan Draft an exhaustive Product Requirements Document and write it to PRD.md, replacing the placeholder. This is a PRD, not an implementation plan — focus on WHAT and WHY, not HOW. The PRD will be handed to a separate executor agent (Codex + gstack + browser-use harness) for one-shot implementation, so it must be self-contained and unambiguous.

## Product

A web app that helps **lawyers and real estate agents** automate marketing content production and social posting. The core insight: existing AI content tools don't help these professionals actually produce and ship content tailored to their work. We do.

## Core Capabilities

1. **Face/likeness onboarding**: user uploads a selfie. We generate a grid of AI images of them, ask them to confirm likeness ("yes, looks like me"), then produce an AI welcome video of them saying "welcome to AI content." Paywall follows.
2. **Character sheet pipeline**: from the confirmed likeness we generate a character sheet AND a 360-degree character sheet. These are fed to downstream video models — internal testing showed this produces dramatically better results than naive image-to-video. This is core product IP.
3. **Content production via templates**, per use case:
   - Real estate property walkthrough videos
   - LinkedIn recruiting videos (to convince people to join their firm/team)
   - Brand-building content about their practice/firm
4. **Brainstorm surface**: interactive ideation where the user explores video ideas, riffs on them, and converts them into production jobs.
5. **Content calendar with guided cadence**: recommends what to post and when, based on profession-specific best practices (e.g. "Tuesday: market update; Thursday: testimonial"). Helps users post more frequently.
6. **Automated posting** to social platforms.
7. **Admin dashboard (internal)**: lets our team test different video models against different templates and rate outputs. Goal: continually improve model × template combinations used in production.

## Sections the PRD must contain (exhaustive)

- Executive summary
- Problem statement with concrete pain examples per persona
- Personas — lawyer and real estate agent, in separate sub-sections; their content needs differ materially
- Goals & non-goals
- User stories per persona per surface
- Detailed functional requirements for each capability. For onboarding specifically: spec every screen, state, and edge case.
- UX flow descriptions (text) for onboarding, content creation, brainstorm, calendar, posting, admin
- Data model: users, character sheets, templates, video jobs, calendar entries, posts, model evaluations, etc.
- Integration surface: which video-model providers; which social platforms (LinkedIn, Instagram, TikTok, YouTube, Facebook)
- Pricing & paywall structure — placeholder tiers OK, but be explicit about what is gated
- Compliance & risk: attorney advertising rules vary by state bar; fair housing for real estate; AI likeness consent and rights; watermarking/disclosure
- Success metrics: activation, time-to-first-video, posting frequency lift, retention, paid conversion
- Admin/internal tooling requirements
- Open questions section — call out everything ambiguous

## Open questions to surface explicitly (do not silently resolve)

- Real estate walkthroughs: fully AI-generated vs. user uploads property footage and we stitch with AI agent intro/outro? Major architecture fork.
- Posting automation: full direct-API posting vs. generate-and-queue-with-reminder? LinkedIn/Instagram API limits matter.
- One product with two modes (lawyer vs realtor) or two largely separate flows sharing a backend?
- Likeness rights: what happens to character sheets on cancellation? Watermark on free tier? Disclosure overlays required by jurisdiction?
- Which video model providers at launch (Sora, Veo, Kling, Runway, Hedra, Higgsfield, etc.)?
- Brainstorm UX shape: chat, card-based, or guided wizard?

## Output

Write the final PRD to PRD.md, replacing the placeholder. Use clear markdown headings. Be exhaustive — verbosity is a feature here; the next agent relies entirely on this doc plus the repo.
```

## Status

- [x] Repo initialized and pushed to GitHub
- [x] `/ultraplan` accessible (CC v2.1.91+, Max plan)
- [ ] PRD drafted via ultraplan
- [ ] PRD finalized in browser
- [ ] Cleanup `/Users/benledwith/Ultraplan testing/`
- [ ] Hand off to executor agent (Codex + gstack + browser-harness)
- [ ] Implementation complete
- [ ] QA via browser-use harness passes

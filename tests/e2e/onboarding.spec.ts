import { expect, test } from "@playwright/test";
import path from "node:path";

test("lawyer signup reaches paywall through all onboarding screens", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Start with your likeness" }).click();

  await page.getByLabel("I'm a lawyer").check();
  await page.getByLabel("Email").fill(`maya.${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("official-ai-demo");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/onboarding\/selfie/);
  await page
    .locator('input[name="selfie"]')
    .setInputFiles(path.join(process.cwd(), "tests/fixtures/selfie.svg"));
  await page.getByRole("button", { name: "Build my AI character" }).click();

  await expect(page).toHaveURL(/\/onboarding\/generating/);
  await expect(page.getByRole("heading", { name: /Building your AI character sheet/i })).toBeVisible();

  await expect(page).toHaveURL(/\/onboarding\/likeness-check/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: /Does this look like you/i })).toBeVisible();
  await page.getByRole("button", { name: "Yes, this looks like me" }).click();

  await expect(page).toHaveURL(/\/onboarding\/welcome-generating/);
  await page.getByLabel("Practice area").fill("Estate planning");
  await page.getByLabel("Firm size").selectOption("solo");
  await page.getByLabel("State(s) of bar admission").fill("CA");
  await page.getByLabel("new client acquisition").check();
  await page.getByLabel("Approachable").check();
  await page.getByRole("button", { name: "Continue to reveal" }).click();

  await expect(page).toHaveURL(/\/onboarding\/welcome-reveal/);
  await expect(page.getByRole("heading", { name: /This is you/i })).toBeVisible();
  await page.getByRole("button", { name: "Start posting" }).click();

  await expect(page).toHaveURL(/\/paywall/);
  await expect(page.getByRole("heading", { name: "Pick your posting engine." })).toBeVisible();
});

test("unsupported profession routes to waitlist", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Other").check();
  await page.getByLabel("Email").fill(`other.${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("official-ai-demo");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/waitlist/);
});

import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.3.3: Add Review Comments to Changed Code Lines - Scenario 1', async ({ page }, testInfo) => {
  const reviewer = seedAccount(testInfo, 'PR_REVIEWER');
  const pullRequestEntry = seedValue(testInfo, 'REVIEWABLE_PULL_REQUEST_ENTRY');
  await signIn(page, reviewer);
  await openVisibleTarget(page, pullRequestEntry);
  await page.getByRole('link', { name: /files changed/i }).click();
  await expect(page.getByRole('button', { name: /add.*comment/i }).first()).toBeVisible();
});

test('REQ-6.3.3: Add Review Comments to Changed Code Lines - Scenario 2', async ({ page }, testInfo) => {
  const reviewer = seedAccount(testInfo, 'PR_REVIEWER');
  const pullRequestEntry = seedValue(testInfo, 'PENDING_REVIEW_PULL_REQUEST_ENTRY');
  const comment = `Pending review comment ${uniqueAccount().username.slice(-10)}`;

  await signIn(page, reviewer);
  await openVisibleTarget(page, pullRequestEntry);
  await page.getByRole('link', { name: /files changed/i }).click();
  await page.getByRole('button', { name: /add.*comment/i }).first().click();
  await page.getByLabel(/comment/i).fill(comment);
  await page.getByRole('button', { name: /start a review/i }).click();

  await expect(page.getByText(comment, { exact: true })).toBeVisible();
  await expect(page.getByText(/pending|pending review/i)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/pending|pending review/i)).toBeVisible();
});

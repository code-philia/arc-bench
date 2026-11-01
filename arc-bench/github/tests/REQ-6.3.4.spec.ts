import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.3.4: Submit a Pull Request Review - Scenario 1', async ({ page }, testInfo) => {
  const reviewer = seedAccount(testInfo, 'PR_REVIEWER');
  const pullRequestEntry = seedValue(testInfo, 'REVIEWABLE_PULL_REQUEST_ENTRY');

  await signIn(page, reviewer);
  await openVisibleTarget(page, pullRequestEntry);
  await page.getByRole('link', { name: /files changed/i }).click();
  await page.getByRole('button', { name: /review changes/i }).click();
  await page.getByRole('radio', { name: /approve/i }).check();
  await page.getByRole('button', { name: /submit review/i }).click();
  await expect(page.getByText(/approved/i)).toBeVisible();
});

test('REQ-6.3.4: Submit a Pull Request Review - Scenario 2', async ({ page }, testInfo) => {
  const reviewer = seedAccount(testInfo, 'PR_REVIEWER');
  const pullRequestEntry = seedValue(testInfo, 'CHANGE_REQUEST_PULL_REQUEST_ENTRY');
  const summary = `Please address the failing case ${Date.now()}`;

  await signIn(page, reviewer);
  await openVisibleTarget(page, pullRequestEntry);
  await page.getByRole('link', { name: /files changed/i }).click();
  await page.getByRole('button', { name: /review changes/i }).click();
  await page.getByLabel(/summary|comment/i).fill(summary);
  await page.getByRole('radio', { name: /request changes/i }).check();
  await page.getByRole('button', { name: /submit review/i }).click();

  await expect(page.getByText(/changes requested/i)).toBeVisible();
  await expect(page.getByText(summary, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(/changes requested/i)).toBeVisible();
});

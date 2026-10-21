import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.3.2: Inspect Changed Files and Aggregate Diff - Scenario 1', async ({ page }, testInfo) => {
  const pullRequestEntry = seedValue(testInfo, 'PUBLIC_PULL_REQUEST_ENTRY');
  const changedFile = seedValue(testInfo, 'PR_CHANGED_FILE');

  await openVisibleTarget(page, pullRequestEntry);
  await page.getByRole('link', { name: /files changed/i }).click();
  await expect(page.getByText(changedFile, { exact: true })).toBeVisible();
  await expect(page.getByText(/\+\d+.*-\d+|\d+ additions?.*\d+ deletions?/i)).toBeVisible();
});

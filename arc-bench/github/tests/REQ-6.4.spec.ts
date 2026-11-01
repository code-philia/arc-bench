import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.4: Request or Remove Pull Request Reviewers - Scenario 1', async ({ page }, testInfo) => {
  const author = seedAccount(testInfo, 'PR_AUTHOR');
  const pullRequestEntry = seedValue(testInfo, 'ASSIGNABLE_PULL_REQUEST_ENTRY');
  const reviewer = seedValue(testInfo, 'REQUESTED_REVIEWER');

  await signIn(page, author);
  await openVisibleTarget(page, pullRequestEntry);
  await page.getByRole('button', { name: /reviewers/i }).click();
  await page.getByRole('textbox', { name: 'Search', exact: true }).fill(reviewer);
  await page.getByRole('option', { name: reviewer, exact: true }).click();
  await expect(page.getByText(reviewer, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(reviewer, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: new RegExp(`remove.*${reviewer}`, 'i') }).click();
  await expect(page.getByText(reviewer, { exact: true })).not.toBeVisible();
});

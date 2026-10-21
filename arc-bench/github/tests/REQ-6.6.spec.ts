import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.6: Close or Reopen a Pull Request Without Merging - Scenario 1', async ({ page }, testInfo) => {
  const author = seedAccount(testInfo, 'PR_AUTHOR');
  const pullRequestEntry = seedValue(testInfo, 'CLOSABLE_PULL_REQUEST_ENTRY');

  await signIn(page, author);
  await openVisibleTarget(page, pullRequestEntry);
  await page.getByRole('button', { name: /close pull request/i }).click();
  await expect(page.getByText('Closed', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: /reopen pull request/i }).click();
  await expect(page.getByText('Open', { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /close pull request/i })).toBeVisible();
});

test('REQ-6.6: Close or Reopen a Pull Request Without Merging - Scenario 2', async ({ page }, testInfo) => {
  const viewer = seedAccount(testInfo, 'PR_VIEWER');
  const pullRequestEntry = seedValue(testInfo, 'PROTECTED_PULL_REQUEST_ENTRY');

  await signIn(page, viewer);
  await openVisibleTarget(page, pullRequestEntry);
  await expect(
    page.getByRole('button', { name: /close pull request/i }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: /reopen pull request/i }),
  ).toHaveCount(0);
});

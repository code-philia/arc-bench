import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-4.2.1: View Repository Commit History - Scenario 1', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'CODE_REPOSITORY_ENTRY');
  const commitMessage = seedValue(testInfo, 'COMMIT_MESSAGE');
  const commitAuthor = seedValue(testInfo, 'COMMIT_AUTHOR');

  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('link', { name: /commits/i }).click();
  await expect(page.getByText(commitMessage, { exact: true })).toBeVisible();
  await expect(page.getByText(commitAuthor, { exact: true })).toBeVisible();
  await expect(page.getByText(/ago/i).first()).toBeVisible();
});

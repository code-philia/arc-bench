import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-4.4: Manage Repository Files Through the Web Interface - Scenario 1', async ({ page }, testInfo) => {
  const contributor = seedAccount(testInfo, 'FILE_CONTRIBUTOR');
  const repositoryEntry = seedValue(testInfo, 'FILE_REPOSITORY_ENTRY');
  await signIn(page, contributor);
  await openVisibleTarget(page, repositoryEntry);
  await expect(page.getByRole('button', { name: /add file/i })).toBeVisible();
});

test('REQ-4.4: Manage Repository Files Through the Web Interface - Scenario 2', async ({ page }, testInfo) => {
  const contributor = seedAccount(testInfo, 'FILE_CONTRIBUTOR');
  const repositoryEntry = seedValue(testInfo, 'FILE_REPOSITORY_ENTRY');
  await signIn(page, contributor);
  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('button', { name: /add file/i }).click();
  await page.getByRole('menuitem', { name: /create new file/i }).click();
  await page.getByLabel(/file name/i).fill('../invalid.md');
  await page.getByRole('textbox', { name: /file contents/i }).fill('must not be saved');
  await page.getByRole('button', { name: /commit changes/i }).click();
  await expect(page.getByText(/invalid.*path|commit message.*required/i)).toBeVisible();
});

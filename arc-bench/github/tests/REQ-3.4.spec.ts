import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-3.4: Change Repository Visibility with Permission Checks - Scenario 1', async ({ page }, testInfo) => {
  const administrator = seedAccount(testInfo, 'VISIBILITY_ADMIN');
  const repositoryEntry = seedValue(testInfo, 'VISIBILITY_REPOSITORY_ENTRY');

  await signIn(page, administrator);
  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('link', { name: /settings/i }).click();
  await page.getByRole('link', { name: /general/i }).click();
  await expect(page.getByRole('button', { name: /change visibility/i })).toBeVisible();
});

test('REQ-3.4: Change Repository Visibility with Permission Checks - Scenario 2', async ({ page }, testInfo) => {
  const collaborator = seedAccount(testInfo, 'NON_ADMIN_COLLABORATOR');
  const repositoryEntry = seedValue(testInfo, 'VISIBILITY_REPOSITORY_ENTRY');

  await signIn(page, collaborator);
  await openVisibleTarget(page, repositoryEntry);
  const settings = page.getByRole('link', { name: /settings/i });
  if (await settings.isVisible()) await settings.click();
  await expect(page.getByRole('button', { name: /change visibility/i })).not.toBeVisible();
});

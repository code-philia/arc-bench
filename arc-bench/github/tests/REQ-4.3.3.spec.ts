import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-4.3.3: Change the Repository Default Branch - Scenario 1', async ({ page }, testInfo) => {
  const administrator = seedAccount(testInfo, 'DEFAULT_BRANCH_ADMIN');
  const repositoryEntry = seedValue(testInfo, 'DEFAULT_BRANCH_REPOSITORY_ENTRY');
  const newDefaultBranch = seedValue(testInfo, 'NEW_DEFAULT_BRANCH');
  const oldDefaultBranch = seedValue(testInfo, 'OLD_DEFAULT_BRANCH');

  await signIn(page, administrator);
  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('link', { name: /settings/i }).click();
  await page.getByRole('link', { name: /branches/i }).click();
  await page.getByRole('combobox', { name: /default branch/i }).selectOption({ label: newDefaultBranch });
  await page.getByRole('button', { name: /update/i }).click();
  await page.getByRole('button', { name: /confirm/i }).click();
  await page.goto(baseUrl());
  await openVisibleTarget(page, repositoryEntry);
  await expect(page.getByRole('button', { name: new RegExp(newDefaultBranch, 'i') })).toBeVisible();
  await page.getByRole('button', { name: /branch /i }).click();
  await expect(page.getByRole('option', { name: oldDefaultBranch, exact: true })).toBeVisible();
});

test('REQ-4.3.3: Change the Repository Default Branch - Scenario 2', async ({ page }, testInfo) => {
  const nonAdministrator = seedAccount(testInfo, 'DEFAULT_BRANCH_NON_ADMIN');
  const repositoryEntry = seedValue(testInfo, 'DEFAULT_BRANCH_REPOSITORY_ENTRY');

  await signIn(page, nonAdministrator);
  await openVisibleTarget(page, repositoryEntry);

  const settingsLink = page.getByRole('link', { name: /settings/i });
  if ((await settingsLink.count()) > 0) {
    await settingsLink.click();
    const branchesLink = page.getByRole('link', { name: /branches/i });
    if ((await branchesLink.count()) > 0) {
      await branchesLink.click();
    }
  }

  await expect(page.getByRole('combobox', { name: /default branch/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /update default branch/i })).toHaveCount(0);
});

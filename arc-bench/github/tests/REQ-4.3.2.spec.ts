import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, uniqueAccount, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-4.3.2: Create a Branch from an Existing Revision - Scenario 1', async ({ page }, testInfo) => {
  const contributor = seedAccount(testInfo, 'BRANCH_CONTRIBUTOR');
  const repositoryEntry = seedValue(testInfo, 'BRANCH_REPOSITORY_ENTRY');
  const branchName = `pw-branch-${uniqueAccount().username.slice(-12)}`;

  await signIn(page, contributor);
  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('button', { name: /branch /i }).click();
  await page.getByRole('textbox', { name: /find.*branch/i }).fill(branchName);
  await page.getByRole('option', { name: new RegExp(`create branch.*${branchName}`, 'i') }).click();
  await expect(page.getByRole('button', { name: new RegExp(branchName, 'i') })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: new RegExp(branchName, 'i') })).toBeVisible();
});

test('REQ-4.3.2: Create a Branch from an Existing Revision - Scenario 2', async ({ page }, testInfo) => {
  const contributor = seedAccount(testInfo, 'BRANCH_CONTRIBUTOR');
  const repositoryEntry = seedValue(testInfo, 'BRANCH_REPOSITORY_ENTRY');
  await signIn(page, contributor);
  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('button', { name: /branch /i }).click();
  await page.getByRole('textbox', { name: /find.*branch/i }).fill('invalid..branch');
  await expect(page.getByText(/invalid.*branch/i)).toBeVisible();
});

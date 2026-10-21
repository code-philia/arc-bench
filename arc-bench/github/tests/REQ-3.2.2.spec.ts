import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, uniqueAccount, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-3.2.2: Fork a Repository into Another Namespace - Scenario 1', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'FORK_USER');
  const sourceRepositoryEntry = seedValue(testInfo, 'FORK_SOURCE_REPOSITORY_ENTRY');
  const sourceRepositoryName = seedValue(testInfo, 'FORK_SOURCE_REPOSITORY_NAME');
  const forkName = `pw-fork-${uniqueAccount().username.slice(-12)}`;

  await signIn(page, account);
  await openVisibleTarget(page, sourceRepositoryEntry);
  await page.getByRole('button', { name: /fork/i }).click();
  await page.getByLabel(/repository name/i).fill(forkName);
  await page.getByRole('button', { name: /create fork/i }).click();

  await expect(page.getByRole('heading', { name: new RegExp(forkName, 'i') })).toBeVisible();
  await expect(page.getByText(new RegExp(`forked from.*${sourceRepositoryName}`, 'i'))).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: new RegExp(forkName, 'i') })).toBeVisible();
});

test('REQ-3.2.2: Fork a Repository into Another Namespace - Scenario 2', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'FORK_USER');
  const sourceRepositoryEntry = seedValue(testInfo, 'FORK_SOURCE_REPOSITORY_ENTRY');
  const existingForkName = seedValue(testInfo, 'EXISTING_FORK_NAME');
  await signIn(page, account);
  await openVisibleTarget(page, sourceRepositoryEntry);
  await page.getByRole('button', { name: /fork/i }).click();
  await page.getByLabel(/repository name/i).fill(existingForkName);
  await page.getByRole('button', { name: /create fork/i }).click();
  await expect(page.getByText(/name.*(already|exists)/i)).toBeVisible();
});

import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-4.3.1: List and Switch Repository Branches - Scenario 1', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'BRANCH_REPOSITORY_ENTRY');
  const targetBranch = seedValue(testInfo, 'TARGET_BRANCH');
  const branchOnlyFile = seedValue(testInfo, 'TARGET_BRANCH_FILE');

  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('button', { name: /branch /i }).click();
  await page.getByRole('textbox', { name: /find.*branch/i }).fill(targetBranch);
  await page.getByRole('option', { name: targetBranch, exact: true }).click();
  await expect(page.getByRole('button', { name: new RegExp(targetBranch, 'i') })).toBeVisible();
  await expect(page.getByRole('link', { name: branchOnlyFile, exact: true })).toBeVisible();
});

test('REQ-4.3.1: List and Switch Repository Branches - Scenario 2', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'BRANCH_REPOSITORY_ENTRY');
  const activeBranch = seedValue(testInfo, 'ACTIVE_BRANCH');
  const unknownBranch = seedValue(testInfo, 'UNKNOWN_BRANCH_QUERY');

  await openVisibleTarget(page, repositoryEntry);
  await expect(page.getByRole('button', { name: new RegExp(activeBranch, 'i') })).toBeVisible();
  await page.getByRole('button', { name: /branch /i }).click();
  await page.getByRole('textbox', { name: /find.*branch/i }).fill(unknownBranch);
  await expect(page.getByText(/no.*branch/i)).toBeVisible();
  await page.keyboard.press('Escape');

  await expect(page.getByRole('button', { name: new RegExp(activeBranch, 'i') })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: new RegExp(activeBranch, 'i') })).toBeVisible();
});

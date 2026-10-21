import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, uniqueAccount, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.2.3: Create a Pull Request from Comparison Results - Scenario 1', async ({ page }, testInfo) => {
  const contributor = seedAccount(testInfo, 'PR_CONTRIBUTOR');
  const compareEntry = seedValue(testInfo, 'VALID_COMPARE_ENTRY');
  const title = `Playwright PR ${uniqueAccount().username.slice(-10)}`;

  await signIn(page, contributor);
  await openVisibleTarget(page, compareEntry);
  await page.getByRole('button', { name: /create pull request/i }).click();
  await page.getByLabel(/title/i).fill(title);
  await page.getByRole('button', { name: /create pull request/i }).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(page.getByText('Open', { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
});

test('REQ-6.2.3: Create a Pull Request from Comparison Results - Scenario 2', async ({ page }, testInfo) => {
  const contributor = seedAccount(testInfo, 'PR_CONTRIBUTOR');
  const compareEntry = seedValue(testInfo, 'VALID_COMPARE_ENTRY');
  await signIn(page, contributor);
  await openVisibleTarget(page, compareEntry);
  await page.getByRole('button', { name: /create pull request/i }).click();
  await page.getByLabel(/title/i).fill('   ');
  await page.getByRole('button', { name: /create pull request/i }).click();
  await expect(page.getByText(/title.*required/i)).toBeVisible();
});

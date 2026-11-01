import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.4: Close or Reopen an Issue - Scenario 1', async ({ page }, testInfo) => {
  const editor = seedAccount(testInfo, 'ISSUE_EDITOR');
  const issueEntry = seedValue(testInfo, 'CLOSABLE_ISSUE_ENTRY');

  await signIn(page, editor);
  await openVisibleTarget(page, issueEntry);
  await page.getByRole('button', { name: /close issue/i }).click();
  await expect(page.getByText('Closed', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/closed.*issue/i)).toBeVisible();
  await page.getByRole('button', { name: /reopen issue/i }).click();
  await expect(page.getByText('Open', { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /close issue/i })).toBeVisible();
});

test('REQ-5.4: Close or Reopen an Issue - Scenario 2', async ({ page }, testInfo) => {
  const viewer = seedAccount(testInfo, 'ISSUE_VIEWER');
  const issueEntry = seedValue(testInfo, 'PROTECTED_ISSUE_ENTRY');

  await signIn(page, viewer);
  await openVisibleTarget(page, issueEntry);
  await expect(page.getByRole('button', { name: /close issue/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /reopen issue/i })).toHaveCount(0);
});

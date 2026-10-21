import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.3.2: Apply Labels to an Issue - Scenario 1', async ({ page }, testInfo) => {
  const editor = seedAccount(testInfo, 'ISSUE_EDITOR');
  const issueEntry = seedValue(testInfo, 'LABELABLE_ISSUE_ENTRY');
  const label = seedValue(testInfo, 'ISSUE_LABEL');

  await signIn(page, editor);
  await openVisibleTarget(page, issueEntry);
  await page.getByRole('button', { name: /labels/i }).click();
  await page.getByRole('option', { name: label, exact: true }).click();
  await expect(page.getByText(label, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(label, { exact: true })).toBeVisible();
});

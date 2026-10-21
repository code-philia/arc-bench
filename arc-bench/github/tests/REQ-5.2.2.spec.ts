import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, uniqueAccount, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.2.2: Edit an Issue Title and Description - Scenario 1', async ({ page }, testInfo) => {
  const editor = seedAccount(testInfo, 'ISSUE_EDITOR');
  const issueEntry = seedValue(testInfo, 'EDITABLE_ISSUE_ENTRY');
  const title = `Edited issue ${uniqueAccount().username.slice(-10)}`;
  const body = `Edited description ${Date.now()}`;

  await signIn(page, editor);
  await openVisibleTarget(page, issueEntry);
  await page.getByRole('button', { name: 'Edit issue title', exact: true }).click();
  await page.getByLabel('Issue title', { exact: true }).fill(title);
  await page.getByRole('button', { name: 'Save issue title', exact: true }).click();
  await page.getByRole('button', { name: 'Edit issue description', exact: true }).click();
  await page.getByLabel('Issue description', { exact: true }).fill(body);
  await page.getByRole('button', { name: 'Save issue description', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(page.getByText(body, { exact: true })).toBeVisible();
});

test('REQ-5.2.2: Edit an Issue Title and Description - Scenario 2', async ({ page }, testInfo) => {
  const editor = seedAccount(testInfo, 'ISSUE_EDITOR');
  const issueEntry = seedValue(testInfo, 'INVALID_EDIT_ISSUE_ENTRY');
  const originalTitle = seedValue(testInfo, 'INVALID_EDIT_ISSUE_TITLE');

  await signIn(page, editor);
  await openVisibleTarget(page, issueEntry);
  await expect(page.getByRole('heading', { name: originalTitle, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit issue title', exact: true }).click();
  await page.getByLabel('Issue title', { exact: true }).fill('   ');
  await page.getByRole('button', { name: 'Save issue title', exact: true }).click();

  await expect(page.getByText(/title.*required|title.*empty/i)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: originalTitle, exact: true })).toBeVisible();
});

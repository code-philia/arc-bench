import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.1.2: View an Issue and Its Discussion - Scenario 1', async ({ page }, testInfo) => {
  const issueEntry = seedValue(testInfo, 'ISSUE_ENTRY');
  const title = seedValue(testInfo, 'ISSUE_TITLE');
  const description = seedValue(testInfo, 'ISSUE_DESCRIPTION');

  await openVisibleTarget(page, issueEntry);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(page.getByText(description, { exact: true })).toBeVisible();
  await expect(page.getByText('Open', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/comment|activity/i).first()).toBeVisible();
});

test('REQ-5.1.2: View an Issue and Its Discussion - Scenario 2', async ({ page }, testInfo) => {
  const issueEntry = seedValue(testInfo, 'ISSUE_ENTRY');
  const title = seedValue(testInfo, 'ISSUE_TITLE');
  const description = seedValue(testInfo, 'ISSUE_DESCRIPTION');

  await openVisibleTarget(page, issueEntry);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(page.getByText(description, { exact: true })).toBeVisible();
});

test('REQ-5.1.2: View an Issue and Its Discussion - Scenario 3', async ({ page }, testInfo) => {
  const issueEntry = seedValue(testInfo, 'ISSUE_ENTRY');
  const title = seedValue(testInfo, 'ISSUE_TITLE');

  await openVisibleTarget(page, issueEntry);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await page.goto(baseUrl());
  await openVisibleTarget(page, issueEntry);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(page.getByText('Open', { exact: true }).first()).toBeVisible();
});

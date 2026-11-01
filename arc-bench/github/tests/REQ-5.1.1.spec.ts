import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-5.1.1: List and Filter Repository Issues - Scenario 1', async ({ page }, testInfo) => {
  const issuesEntry = seedValue(testInfo, 'ISSUES_ENTRY');
  const openTitle = seedValue(testInfo, 'OPEN_ISSUE_TITLE');

  await openVisibleTarget(page, issuesEntry);
  await page.getByRole('link', { name: /open/i }).click();
  await page.getByRole('searchbox', { name: 'Search issues', exact: true }).fill(openTitle);
  await expect(page.getByRole('link', { name: openTitle, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: openTitle, exact: true })).toBeVisible();
});

test('REQ-5.1.1: List and Filter Repository Issues - Scenario 2', async ({ page }, testInfo) => {
  const issuesEntry = seedValue(testInfo, 'ISSUES_ENTRY');
  const closedTitle = seedValue(testInfo, 'CLOSED_ISSUE_TITLE');
  const openTitle = seedValue(testInfo, 'OPEN_ISSUE_TITLE');

  await openVisibleTarget(page, issuesEntry);
  await page.getByRole('link', { name: /closed/i }).click();
  await page.getByRole('searchbox', { name: 'Search issues', exact: true }).fill(closedTitle);

  await expect(page.getByRole('link', { name: closedTitle, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: openTitle, exact: true })).not.toBeVisible();
});

import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.2.1: List and Filter Repository Pull Requests - Scenario 1', async ({ page }, testInfo) => {
  const pullsEntry = seedValue(testInfo, 'PULL_REQUESTS_ENTRY');
  const title = seedValue(testInfo, 'OPEN_PULL_REQUEST_TITLE');

  await openVisibleTarget(page, pullsEntry);
  await page.getByRole('link', { name: /open/i }).click();
  await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
  await page.getByRole('link', { name: title, exact: true }).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
});

test('REQ-6.2.1: List and Filter Repository Pull Requests - Scenario 2', async ({ page }, testInfo) => {
  const pullsEntry = seedValue(testInfo, 'PULL_REQUESTS_ENTRY');
  const title = seedValue(testInfo, 'OPEN_PULL_REQUEST_TITLE');

  await openVisibleTarget(page, pullsEntry);
  await page.getByRole('link', { name: /open/i }).click();
  await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
});

test('REQ-6.2.1: List and Filter Repository Pull Requests - Scenario 3', async ({
  page,
}, testInfo) => {
  const pullsEntry = seedValue(testInfo, 'PULL_REQUESTS_ENTRY');
  const title = seedValue(testInfo, 'OPEN_PULL_REQUEST_TITLE');

  await openVisibleTarget(page, pullsEntry);
  await page.getByRole('link', { name: /open/i }).click();
  await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
  await page.goto(baseUrl());
  await openVisibleTarget(page, pullsEntry);
  await page.getByRole('link', { name: /open/i }).click();
  await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
});

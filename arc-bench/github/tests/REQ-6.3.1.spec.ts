import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-6.3.1: View Pull Request Overview and Commits - Scenario 1', async ({ page }, testInfo) => {
  const pullRequestEntry = seedValue(testInfo, 'PULL_REQUEST_ENTRY');
  const title = seedValue(testInfo, 'PULL_REQUEST_TITLE');

  await openVisibleTarget(page, pullRequestEntry);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await page.getByRole('link', { name: /commits/i }).click();
  await expect(page.getByText(/commit/i)).toBeVisible();
  await page.getByRole('link', { name: /files changed/i }).click();
  await expect(page.getByText(/changed files/i)).toBeVisible();
});

test('REQ-6.3.1: View Pull Request Overview and Commits - Scenario 2', async ({ page }, testInfo) => {
  const pullRequestEntry = seedValue(testInfo, 'PULL_REQUEST_ENTRY');
  const title = seedValue(testInfo, 'PULL_REQUEST_TITLE');

  await openVisibleTarget(page, pullRequestEntry);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await page.getByRole('link', { name: /commits/i }).click();
  await expect(page.getByText(/commit/i)).toBeVisible();
});

test('REQ-6.3.1: View Pull Request Overview and Commits - Scenario 3', async ({
  page,
}, testInfo) => {
  const pullRequestEntry = seedValue(testInfo, 'PULL_REQUEST_ENTRY');
  const title = seedValue(testInfo, 'PULL_REQUEST_TITLE');

  await openVisibleTarget(page, pullRequestEntry);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await page.goto(baseUrl());
  await openVisibleTarget(page, pullRequestEntry);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await page.getByRole('link', { name: /files changed/i }).click();
  await expect(page.getByText(/changed files/i)).toBeVisible();
});

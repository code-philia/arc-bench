import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-4.1: Browse Repository Files and Directories - Scenario 1', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'CODE_REPOSITORY_ENTRY');
  const directory = seedValue(testInfo, 'CODE_DIRECTORY');
  const fileName = seedValue(testInfo, 'CODE_FILE_NAME');
  const expectedContent = seedValue(testInfo, 'CODE_FILE_CONTENT');

  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('link', { name: directory, exact: true }).click();
  await page.getByRole('link', { name: fileName, exact: true }).click();
  await expect(page.getByText(expectedContent, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(expectedContent, { exact: true })).toBeVisible();
});

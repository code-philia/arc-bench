import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-3.3: View a Public Repository Overview - Scenario 1', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'PUBLIC_REPOSITORY_ENTRY');
  const repositoryName = seedValue(testInfo, 'PUBLIC_REPOSITORY_NAME');

  await openVisibleTarget(page, repositoryEntry);
  await expect(page.getByRole('heading', { name: new RegExp(repositoryName, 'i') })).toBeVisible();
  await expect(page.getByText(/public/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /code/i })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: new RegExp(repositoryName, 'i') })).toBeVisible();
});

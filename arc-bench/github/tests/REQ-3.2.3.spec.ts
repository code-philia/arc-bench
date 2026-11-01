import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-3.2.3: Copy a Repository Clone Value - Scenario 1', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'PUBLIC_REPOSITORY_ENTRY');
  const repositoryName = seedValue(testInfo, 'PUBLIC_REPOSITORY_NAME');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(baseUrl()).origin });

  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('button', { name: /code/i }).click();
  await page.getByRole('tab', { name: /https/i }).click();
  await page.getByRole('button', { name: /copy.*clone|copy/i }).click();

  await expect(page.getByText(/copied/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: new RegExp(repositoryName, 'i') })).toBeVisible();
});

test('REQ-3.2.3: Copy a Repository Clone Value - Scenario 2', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'PUBLIC_REPOSITORY_ENTRY');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(baseUrl()).origin });
  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('button', { name: /code/i }).click();
  await page.getByRole('tab', { name: /ssh/i }).click();
  await page.getByRole('button', { name: /copy.*clone|copy/i }).click();
  await expect(page.getByText(/copied/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /acme-docs/i })).toBeVisible();
});

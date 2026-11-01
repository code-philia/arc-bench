import { openVisibleTarget } from "./support/e2e";
import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-4.2.3: Search Code Within a Repository - Scenario 1', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'CODE_REPOSITORY_ENTRY');
  const query = seedValue(testInfo, 'CODE_SEARCH_QUERY');
  const fileName = seedValue(testInfo, 'CODE_SEARCH_FILE');

  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill(query);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).press('Enter');
  await page.getByRole('link', { name: /code/i }).click();
  await page.getByRole('link', { name: fileName, exact: true }).click();
  await expect(page.getByText(query, { exact: true })).toBeVisible();
});

test('REQ-4.2.3: Search Code Within a Repository - Scenario 2', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'CODE_REPOSITORY_ENTRY');
  const query = seedValue(testInfo, 'CODE_SEARCH_EMPTY_QUERY');

  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill(query);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).press('Enter');
  await page.getByRole('link', { name: /code/i }).click();

  await expect(page.getByText(/no.*code.*results|no results/i)).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search', exact: true })).toHaveValue(query);
});

test('REQ-4.2.3: Search Code Within a Repository - Scenario 3', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'CODE_REPOSITORY_ENTRY');
  const query = seedValue(testInfo, 'CODE_SEARCH_QUERY');
  const fileName = seedValue(testInfo, 'CODE_SEARCH_FILE');

  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill(query);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).press('Enter');
  await page.getByRole('link', { name: /code/i }).click();
  await page.getByRole('link', { name: fileName, exact: true }).click();
  await expect(page.getByText(query, { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByText(query, { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: fileName, exact: true })).toBeVisible();
});

test('REQ-4.2.3: Search Code Within a Repository - Scenario 4', async ({ page }, testInfo) => {
  const repositoryEntry = seedValue(testInfo, 'CODE_REPOSITORY_ENTRY');
  const query = seedValue(testInfo, 'CODE_SEARCH_EMPTY_QUERY');

  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill(query);
  await page.getByRole('searchbox', { name: 'Search', exact: true }).press('Enter');
  await page.getByRole('link', { name: /code/i }).click();
  await expect(page.getByText(/no.*code.*results|no results/i)).toBeVisible();

  await openVisibleTarget(page, repositoryEntry);
  await page.getByRole('searchbox', { name: /search/i }).fill(query);
  await page.getByRole('searchbox', { name: /search/i }).press('Enter');
  await page.getByRole('link', { name: /code/i }).click();
  await expect(page.getByText(/no.*code.*results|no results/i)).toBeVisible();
});

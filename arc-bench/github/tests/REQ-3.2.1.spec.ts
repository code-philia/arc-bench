import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, uniqueAccount, seedAccount } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-3.2.1: Create a Repository with Owner, Visibility, and Initialization Options - Scenario 1', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'REPOSITORY_OWNER');
  const repositoryName = `pw-repository-${uniqueAccount().username.slice(-12)}`;

  await signIn(page, owner);
  await page.getByRole('link', { name: /new repository/i }).click();
  await page.getByLabel(/repository name/i).fill(repositoryName);
  const description = page.getByLabel(/description/i);
  if (await description.isVisible()) await description.fill('Repository created by Playwright');
  await page.getByRole('radio', { name: /private/i }).check();
  await page.getByRole('checkbox', { name: /add a readme/i }).check();
  await page.getByRole('button', { name: /create repository/i }).click();

  await expect(page.getByRole('heading', { name: new RegExp(repositoryName, 'i') })).toBeVisible();
  await expect(page.getByText(/private/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /readme/i })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: new RegExp(repositoryName, 'i') })).toBeVisible();
});

test('REQ-3.2.1: Create a Repository with Owner, Visibility, and Initialization Options - Scenario 2', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'REPOSITORY_OWNER');
  const existingRepository = seedValue(testInfo, 'EXISTING_OWNED_REPOSITORY');

  await signIn(page, owner);
  await page.getByRole('link', { name: /new repository/i }).click();
  await page.getByLabel(/repository name/i).fill(existingRepository);
  await page.getByRole('button', { name: /create repository/i }).click();

  await expect(page.getByText(/name.*(already|exists|unavailable)/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: new RegExp(existingRepository, 'i') })).not.toBeVisible();
});

test('REQ-3.2.1: Create a Repository with Owner, Visibility, and Initialization Options - Scenario 3', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'REPOSITORY_OWNER');
  await signIn(page, owner);
  await page.getByRole('link', { name: /new repository/i }).click();
  await page.getByRole('button', { name: /create repository/i }).click();
  await expect(page.getByText(/repository name.*required/i)).toBeVisible();
});

import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount, clickVisibleTarget } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-2.1.2: Create an Organization After Authentication - Scenario 1', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'ORGANIZATION_OWNER');
  const organizationName = 'mobile-guild';

  await signIn(page, owner);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await page.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await clickVisibleTarget(page, 'New organization');
  await page.getByLabel('Organization name', { exact: true }).fill(organizationName);
  await page.getByLabel('Display name', { exact: true }).fill('Mobile Guild');
  await page.getByRole('button', { name: 'Create organization', exact: true }).click();

  await expect(page.getByRole('heading', { name: new RegExp(organizationName, 'i') })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: new RegExp(organizationName, 'i') })).toBeVisible();
});

test('REQ-2.1.2: Create an Organization After Authentication - Scenario 2', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'ORGANIZATION_OWNER');
  const existingOrganizationIdentifier = seedValue(testInfo, 'EXISTING_ORGANIZATION_IDENTIFIER');

  await signIn(page, owner);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await page.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await clickVisibleTarget(page, 'New organization');
  await page.getByLabel('Organization name', { exact: true }).fill(existingOrganizationIdentifier);
  await page.getByRole('button', { name: 'Create organization', exact: true }).click();

  await expect(page.getByText('Organization name already exists', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: new RegExp(existingOrganizationIdentifier, 'i') }),
  ).not.toBeVisible();
});

test('REQ-2.1.2: Create an Organization After Authentication - Scenario 3', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'ORGANIZATION_OWNER');
  await signIn(page, owner);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await page.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await clickVisibleTarget(page, 'New organization');
  await page.getByLabel('Organization name', { exact: true }).fill('-invalid-organization');
  await page.getByLabel('Display name', { exact: true }).fill('   ');
  await page.getByRole('button', { name: 'Create organization', exact: true }).click();
  await expect(page.getByText('Organization name format is invalid', { exact: true })).toBeVisible();
});

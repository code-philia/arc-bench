import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount, openVisibleOrganization, clickVisibleTarget } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-2.2.1: Create an Organization Team - Scenario 1', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'ORGANIZATION_OWNER');
  const organizationName = seedValue(testInfo, 'EXISTING_ORGANIZATION');
  const teamName = 'mobile-team';

  await signIn(page, owner);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await page.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await openVisibleOrganization(page, organizationName);
  await clickVisibleTarget(page, 'Teams');
  await clickVisibleTarget(page, 'New team');
  await page.getByLabel('Team name', { exact: true }).fill(teamName);
  await page.getByRole('button', { name: 'Create team', exact: true }).click();

  await expect(page.getByRole('heading', { name: new RegExp(teamName, 'i') })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: new RegExp(teamName, 'i') })).toBeVisible();
});

test('REQ-2.2.1: Create an Organization Team - Scenario 2', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'ORGANIZATION_OWNER');
  await signIn(page, owner);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await page.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await openVisibleOrganization(page, seedValue(testInfo, 'EXISTING_ORGANIZATION'));
  await clickVisibleTarget(page, 'Teams');
  await clickVisibleTarget(page, 'New team');
  await page.getByLabel('Team name', { exact: true }).fill('-invalid-team');
  await page.getByRole('button', { name: 'Create team', exact: true }).click();
  await expect(page.getByText('Team name is invalid', { exact: true })).toBeVisible();
});

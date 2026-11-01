import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount, openVisibleOrganization } from './support/e2e';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-2.2.4: Remove a Member from an Organization - Scenario 1', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'ORGANIZATION_OWNER');
  const member = seedValue(testInfo, 'ORGANIZATION_MEMBER_TO_REMOVE');

  await signIn(page, owner);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await page.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await openVisibleOrganization(page, seedValue(testInfo, 'EXISTING_ORGANIZATION'));
  await page.getByRole('link', { name: 'People', exact: true }).click();
  await expect(page.getByText(member, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: `Member menu ${member}`, exact: true }).click();
  await page.getByRole('menuitem', { name: 'Remove from organization', exact: true }).click();
  await page.getByRole('button', { name: 'Remove', exact: true }).click();

  await expect(page.getByText(member, { exact: true })).not.toBeVisible();
  await page.reload();
  await expect(page.getByText(member, { exact: true })).not.toBeVisible();
});

test('REQ-2.2.4: Remove a Member from an Organization - Scenario 2', async ({ page }, testInfo) => {
  const nonOwner = seedAccount(testInfo, 'ORGANIZATION_NON_OWNER');
  const member = seedValue(testInfo, 'ORGANIZATION_MEMBER_FOR_NON_OWNER');

  await signIn(page, nonOwner);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await page.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await openVisibleOrganization(page, seedValue(testInfo, 'EXISTING_ORGANIZATION'));
  await page.getByRole('link', { name: 'People', exact: true }).click();
  await expect(page.getByText(member, { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: `Member menu ${member}`,
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('menuitem', { name: 'Remove from organization', exact: true }),
  ).toHaveCount(0);
});

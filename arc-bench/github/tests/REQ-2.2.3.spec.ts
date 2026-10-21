import { baseUrl } from './support/e2e';
import { expect, test } from '@playwright/test';
import { seedValue, signIn, seedAccount, openVisibleOrganization, clickVisibleTarget } from './support/e2e';

async function openPeople(page: import('@playwright/test').Page, organizationName: string): Promise<void> {
  await openVisibleOrganization(page, organizationName);
  await page.getByRole('link', { name: 'People', exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl());
});

test('REQ-2.2.3: Directly Add a User as an Organization Member - Scenario 1', async ({ page, browser }, testInfo) => {
  const owner = seedAccount(testInfo, 'ORGANIZATION_OWNER');
  const newMember = seedAccount(testInfo, 'ORGANIZATION_NEW_MEMBER');
  const organizationName = seedValue(testInfo, 'EXISTING_ORGANIZATION');

  await signIn(page, owner);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await page.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await openPeople(page, organizationName);
  await page.getByRole('button', { name: 'Add member', exact: true }).click();
  await page.getByLabel('Username or email', { exact: true }).fill(newMember.username);
  const role = page.getByRole('combobox', { name: 'Role', exact: true });
  await role.click();
  await page.getByRole('option', { name: 'Member', exact: true }).click();
  await page.getByRole('button', { name: 'Add member', exact: true }).last().click();

  await expect(page.getByText(newMember.username, { exact: true })).toBeVisible();
  await expect(page.getByText('Member', { exact: true })).toBeVisible();
  await expect(page.getByText('Pending invitation', { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText(newMember.username, { exact: true })).toBeVisible();

  const memberContext = await browser.newContext();
  const memberPage = await memberContext.newPage();
  await signIn(memberPage, newMember);
  await memberPage.getByRole('button', { name: 'Account menu', exact: true }).click();
  await memberPage.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await expect(memberPage.getByText(organizationName, { exact: true })).toBeVisible();
  await clickVisibleTarget(memberPage, organizationName);
  await memberPage.getByRole('link', { name: 'Repositories', exact: true }).click();
  await expect(memberPage.getByText('Access denied', { exact: true })).toBeVisible();
  await memberContext.close();
});

test('REQ-2.2.3: Directly Add a User as an Organization Member - Scenario 2', async ({ page }, testInfo) => {
  const owner = seedAccount(testInfo, 'ORGANIZATION_OWNER');
  const existingMember = seedAccount(testInfo, 'ORGANIZATION_EXISTING_MEMBER');
  const unknownAccount = 'unknown-reviewer';

  await signIn(page, owner);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await page.getByRole('link', { name: 'Your organizations', exact: true }).click();
  await openPeople(page, seedValue(testInfo, 'EXISTING_ORGANIZATION'));
  await page.getByRole('button', { name: 'Add member', exact: true }).click();
  await page.getByLabel('Username or email', { exact: true }).fill(existingMember.username);
  await page.getByRole('button', { name: 'Add member', exact: true }).last().click();
  await expect(page.getByText('Account is already a member', { exact: true })).toBeVisible();

  await page.getByLabel('Username or email', { exact: true }).fill(unknownAccount);
  await page.getByRole('button', { name: 'Add member', exact: true }).last().click();
  await expect(page.getByText('Account not found', { exact: true })).toBeVisible();
  await expect(page.getByText(existingMember.username, { exact: true })).toHaveCount(1);
});

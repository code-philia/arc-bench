import { expect, test } from '@playwright/test';
import { signIn, seedAccount, clickVisibleTarget, visibleDialog } from './support/e2e';

test('REQ-1.2: Sign Out and End the Current Web Session - Scenario 1', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'SIGN_OUT');
  await signIn(page, account);

  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await clickVisibleTarget(page, 'Sign out');
  const dialog = await visibleDialog(page, 'Sign out');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Confirm sign out', exact: true }).click();

  await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
});

test('REQ-1.2: Sign Out and End the Current Web Session - Scenario 2', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'SIGN_OUT');
  await signIn(page, account);
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await clickVisibleTarget(page, 'Settings');
  await page.getByRole('button', { name: 'Account menu', exact: true }).click();
  await clickVisibleTarget(page, 'Sign out');
  const dialog = await visibleDialog(page, 'Sign out');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Confirm sign out', exact: true }).click();

  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await expect(page.getByLabel('Username or email', { exact: true })).toBeVisible();
});

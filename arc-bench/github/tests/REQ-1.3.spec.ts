import { expect, test } from '@playwright/test';
import { openAccountAccess, openPasswordSettings, seedValue, signIn, seedAccount } from './support/e2e';

test('REQ-1.3: Change Account Password - Scenario 1', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'PASSWORD_CHANGE_SUCCESS');
  const newPassword = seedValue(testInfo, 'PASSWORD_CHANGE_NEW_PASSWORD');
  await signIn(page, account);
  await openPasswordSettings(page);

  await page.getByLabel('Current password', { exact: true }).fill(account.password);
  await page.getByLabel('New password', { exact: true }).fill(newPassword);
  await page.getByLabel('Confirm password', { exact: true }).fill(newPassword);
  await page.getByRole('button', { name: 'Update password', exact: true }).click();
  await expect(page.getByText('Password updated', { exact: true })).toBeVisible();

  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Username or email', { exact: true }).fill(account.email);
  await page.getByLabel('Password', { exact: true }).fill(newPassword);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();
});

test('REQ-1.3: Change Account Password - Scenario 2', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'PASSWORD_CHANGE_INVALID_CURRENT');
  await signIn(page, account);
  await openPasswordSettings(page);

  await page.getByLabel('Current password', { exact: true }).fill(`${account.password}-wrong`);
  await page.getByLabel('New password', { exact: true }).fill('Another-valid-password-123!');
  await page.getByLabel('Confirm password', { exact: true }).fill('does-not-match');
  await page.getByRole('button', { name: 'Update password', exact: true }).click();
  await expect(page.getByText('Current password is incorrect', { exact: true })).toBeVisible();

  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Username or email', { exact: true }).fill(account.email);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();
});

test('REQ-1.3: Change Account Password - Scenario 3', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'PASSWORD_CHANGE_REQUIRED');
  const candidate = seedValue(testInfo, 'PASSWORD_CHANGE_REQUIRED_NEW_PASSWORD');
  await signIn(page, account);
  await openPasswordSettings(page);

  await page.getByLabel('New password', { exact: true }).fill(candidate);
  await page.getByLabel('Confirm password', { exact: true }).fill(candidate);
  await page.getByRole('button', { name: 'Update password', exact: true }).click();
  await expect(page.getByText('Current password is required', { exact: true })).toBeVisible();

  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Username or email', { exact: true }).fill(account.email);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();
});

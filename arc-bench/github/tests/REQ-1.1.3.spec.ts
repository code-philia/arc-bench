import { expect, test } from '@playwright/test';
import { openAccountAccess, seedAccount } from './support/e2e';

async function openResetStep(page: import('@playwright/test').Page, email: string): Promise<void> {
  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByRole('link', { name: 'Forgot password', exact: true }).click();
  await page.getByLabel('Email').fill(email);
  await page.getByRole('button', { name: 'Send reset link', exact: true }).click();
  await expect(page.getByText('123456')).toBeVisible();
  await expect(page.getByLabel('New password')).toBeVisible();
}

test('REQ-1.1.3: Recover Account Access Through a Verified Email - Scenario 1', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'RECOVERY_VISIBILITY');

  await openResetStep(page, account.email);
  await expect(page.getByLabel('Verification code')).toBeVisible();

  await openResetStep(page, 'unknown@example.test');
  await expect(page.getByLabel('Verification code')).toBeVisible();
});

test('REQ-1.1.3: Recover Account Access Through a Verified Email - Scenario 2', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'RECOVERY_INVALID_CODE');
  const attemptedPassword = 'Replacement-password-456!';

  await openResetStep(page, account.email);
  await page.getByLabel('Verification code').fill('000000');
  await page.getByLabel('New password').fill(attemptedPassword);
  await page.getByLabel('Confirm password').fill(attemptedPassword);
  await page.getByRole('button', { name: 'Reset password', exact: true }).click();
  await expect(page.getByText('Verification code is invalid')).toBeVisible();

  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Username or email').fill(account.email);
  await page.getByLabel('Password').fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();
});

test('REQ-1.1.3: Recover Account Access Through a Verified Email - Scenario 3', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'RECOVERY_SUCCESS');
  const newPassword = 'Replacement-password-456!';

  await openResetStep(page, account.email);
  await page.getByLabel('Verification code').fill('123456');
  await page.getByLabel('New password').fill(newPassword);
  await page.getByLabel('Confirm password').fill(newPassword);
  await page.getByRole('button', { name: 'Reset password', exact: true }).click();
  await expect(page.getByText('Password updated')).toBeVisible();

  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Username or email').fill(account.email);
  await page.getByLabel('Password').fill(newPassword);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();
});

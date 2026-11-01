import { expect, test } from '@playwright/test';
import { openAccountAccess, signIn, seedAccount } from './support/e2e';

test('REQ-1.1.2: Sign In with an Existing Account - Scenario 1', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'LOGIN');

  await signIn(page, account);
  await page.reload();
  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();
});

test('REQ-1.1.2: Sign In with an Existing Account - Scenario 2', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'LOGIN');

  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Username or email').fill(account.email);
  await page.getByLabel('Password').fill(`${account.password}-incorrect`);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

test('REQ-1.1.2: Sign In with an Existing Account - Scenario 3', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'LOGIN_EMAIL');

  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Username or email').fill(account.email);
  await page.getByLabel('Password').fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();
});

test('REQ-1.1.2: Sign In with an Existing Account - Scenario 4', async ({ page }, testInfo) => {
  const account = seedAccount(testInfo, 'LOGIN');

  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Username or email').fill('unknown@example.test');
  await page.getByLabel('Password').fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();

  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Username or email').fill(account.username);
  await page.getByLabel('Password').fill(`${account.password}-wrong`);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

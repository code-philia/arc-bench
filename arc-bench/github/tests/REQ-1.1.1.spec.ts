import { expect, test } from '@playwright/test';
import { openAccountAccess } from './support/e2e';

const registrationAccount = {
  username: 'nora-demo',
  email: 'nora.demo@example.test',
  password: 'Valid-password-123!',
};

async function openSignUp(page: import('@playwright/test').Page): Promise<void> {
  await openAccountAccess(page);
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByRole('link', { name: 'Create an account', exact: true }).click();
}

async function submitRegistration(
  page: import('@playwright/test').Page,
  account: { username: string; email: string; password: string },
): Promise<void> {
  await page.getByLabel('Username', { exact: true }).fill(account.username);
  await page.getByLabel('Email', { exact: true }).fill(account.email);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByLabel('Confirm password', { exact: true }).fill(account.password);
  await page.getByRole('checkbox', { name: 'Agree to the terms', exact: true }).check();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
}

test('REQ-1.1.1: Register a New GitHub Account - Scenario 1', async ({ page }) => {
  const account = registrationAccount;

  await openSignUp(page);
  await submitRegistration(page, account);

  await expect(page.getByLabel('Username or email', { exact: true })).toBeVisible();
  await page.getByLabel('Username or email', { exact: true }).fill(account.email);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();

  await page.reload();
  await expect(page.getByText(account.username, { exact: true }).first()).toBeVisible();
});

test('REQ-1.1.1: Register a New GitHub Account - Scenario 2', async ({ page }) => {
  const existing = { username: 'duplicate-demo', email: 'duplicate.demo@example.test', password: 'Valid-password-123!' };
  const attempted = { username: 'duplicate-demo', email: 'unused.demo@example.test', password: 'Valid-password-123!' };

  await openSignUp(page);
  await submitRegistration(page, existing);
  await openSignUp(page);
  await page.getByLabel('Username', { exact: true }).fill(existing.username);
  await page.getByLabel('Email', { exact: true }).fill(attempted.email);
  await page.getByLabel('Password', { exact: true }).fill(attempted.password);
  await page.getByLabel('Confirm password', { exact: true }).fill(attempted.password);
  await page.getByRole('checkbox', { name: 'Agree to the terms', exact: true }).check();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();

  await expect(page.getByText('Username already exists', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Username', { exact: true })).toHaveValue(existing.username);
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue(attempted.email);
});

test('REQ-1.1.1: Register a New GitHub Account - Scenario 3', async ({ page }) => {
  const account = { username: 'invalid-demo', email: 'invalid.demo@example.test', password: 'Valid-password-123!' };

  await openSignUp(page);
  await page.getByLabel('Username', { exact: true }).fill(`-${account.username}`);
  await page.getByLabel('Email', { exact: true }).fill('not-an-email');
  await page.getByLabel('Password', { exact: true }).fill('short');
  await page.getByLabel('Confirm password', { exact: true }).fill('different');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();

  await expect(page.getByText('Username format is invalid', { exact: true })).toBeVisible();
  await expect(page.getByText('Email format is invalid', { exact: true })).toBeVisible();
  await expect(page.getByText('Password requirements are not satisfied', { exact: true })).toBeVisible();
  await expect(page.getByText('Agree to terms is required', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Username', { exact: true })).toHaveValue(`-${account.username}`);
});

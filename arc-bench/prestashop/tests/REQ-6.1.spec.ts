// requirement: REQ-6.1
import { test, expect } from '@playwright/test';
import { home, nav, action, inputForm, field, choice, setChoice } from './helpers';
import { verifiedCustomer } from './fixtures/data';

test("REQ-6.1: Open sign-in entry", async ({ page }) => {
  await home(page);
  await action(nav(page), 'Sign in').click();
  const form = inputForm(page, ['Email', 'Password'], 'Sign in');
  await expect(field(form, 'Email')).toBeVisible();
  await expect(field(form, 'Password')).toHaveAttribute('type', 'password');
  await expect(action(form, 'Sign in')).toBeVisible();
  await expect(action(page, 'No account? Create one here')).toBeVisible();
});

test("REQ-6.1: Reveal password and sign in", async ({ page }) => {
  await home(page);
  const customer = verifiedCustomer('user');
  await action(nav(page), 'Sign in').click();
  const form = inputForm(page, ['Email', 'Password'], 'Sign in');
  const email = field(form, 'Email');
  await email.fill(customer.email);
  const password = field(form, 'Password');
  await password.fill(customer.password);
  await expect(password).toHaveAttribute('type', 'password');
  await action(form, 'SHOW').click();
  await expect(email).toHaveValue(customer.email);
  await expect(password).toHaveAttribute('type', 'text');
  await expect(password).toHaveValue(customer.password);
  await setChoice(choice(form, 'checkbox', 'Remember me'));
  await action(form, 'Sign in').click();
  await expect(nav(page)).toContainText(customer.firstName + ' ' + customer.lastName);
  for (const name of ['My account', 'Sign out']) await expect(action(nav(page), name)).toBeVisible();
});
